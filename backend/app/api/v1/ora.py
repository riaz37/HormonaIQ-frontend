from fastapi import APIRouter, Depends, HTTPException, Request

from app.api.deps import CurrentUser, require_tier
from app.core.exceptions import QuotaExceededException
from app.core.rate_limit import limiter
from app.core.supabase import get_supabase, run_supabase
from app.schemas.ora import (
    OraAppointmentPrepRequest, OraAppointmentPrepResponse,
    OraClinicalLetterRequest, OraClinicalLetterResponse,
    OraCrisisContextRequest, OraCrisisContextResponse,
    OraExplainRequest, OraExplainResponse,
    OraPatternsRequest, OraPatternsResponse,
    OraWhyNowRequest, OraWhyNowResponse,
)
from app.services.guard_service import GuardService
from app.services.ora_service import OraService

router = APIRouter()
ora_service = OraService()
guard_service = GuardService()

SAFE_FALLBACK = (
    "Ora wasn't able to generate an insight for this data. "
    "Speak with your doctor about the patterns you're tracking."
)


async def _check_quota(user_id: str, feature: str, limit: int) -> None:
    """Atomically check monthly quota via advisory-locked RPC."""
    supabase = get_supabase()
    result = await run_supabase(
        lambda: supabase.rpc(
            "check_ora_quota",
            {"p_user_id": user_id, "p_feature": feature, "p_limit": limit},
        ).execute()
    )
    if result.data is False:
        raise QuotaExceededException()


async def _log_usage(user_id: str, feature: str, tokens: int, blocked: bool) -> None:
    supabase = get_supabase()
    await run_supabase(
        lambda: supabase.table("ora_usage").insert({
            "user_id": user_id,
            "feature": feature,
            "tokens_used": tokens,
            "guard_blocked": blocked,
        }).execute()
    )


async def _get_tier(user_id: str) -> str:
    supabase = get_supabase()
    result = await run_supabase(
        lambda: supabase.table("users").select("tier").eq("id", user_id).single().execute()
    )
    return result.data.get("tier", "free") if result.data else "free"


# ── Feature 1: Explain Chart ──────────────────────────────────────────────────

@router.post("/explain", response_model=OraExplainResponse)
@limiter.limit("10/minute")
async def explain_chart(request: Request, payload: OraExplainRequest, user: CurrentUser):
    user_id = user["sub"]
    tier = await _get_tier(user_id)

    if tier != "pro":
        await _check_quota(user_id, "explain_chart", 3)

    insight, tokens = await ora_service.explain_chart(payload.context, payload.cycle_number)
    safe = await guard_service.eval(insight)
    await _log_usage(user_id, "explain_chart", tokens, not safe)

    return OraExplainResponse(insight=insight if safe else SAFE_FALLBACK)


# ── Feature 2: Appointment Prep (Pro) ────────────────────────────────────────

@router.post("/appointment-prep", response_model=OraAppointmentPrepResponse)
@limiter.limit("5/minute")
async def appointment_prep(
    request: Request,
    payload: OraAppointmentPrepRequest,
    user: CurrentUser,
    _: None = Depends(require_tier("pro")),
):
    user_id = user["sub"]
    data = await ora_service.appointment_prep(payload.model_dump())
    tokens = data.pop("_tokens", 0)

    guard_text = f"{data['summary']} {' '.join(data['phrases_to_use'])}"
    safe = await guard_service.eval(guard_text)
    await _log_usage(user_id, "appointment_prep", tokens, not safe)

    if not safe:
        raise HTTPException(status_code=500, detail="insight_blocked")

    return OraAppointmentPrepResponse(**data)


# ── Feature 3: Why Is This Happening (3/month free → unlimited Pro) ──────────

@router.post("/why-now", response_model=OraWhyNowResponse)
@limiter.limit("10/minute")
async def why_now(request: Request, payload: OraWhyNowRequest, user: CurrentUser):
    user_id = user["sub"]
    tier = await _get_tier(user_id)

    if tier != "pro":
        await _check_quota(user_id, "why_now", 3)

    data = await ora_service.why_now(payload.model_dump())
    tokens = data.pop("_tokens", 0)
    safe = await guard_service.eval(data["context_text"])
    await _log_usage(user_id, "why_now", tokens, not safe)

    if not safe:
        return OraWhyNowResponse(
            context_text=SAFE_FALLBACK,
            typical_duration_days_min=0,
            typical_duration_days_max=0,
            historically_helpful=[],
        )

    return OraWhyNowResponse(**data)


# ── Feature 4: Clinical Letter (Pro, min 2 cycles) ────────────────────────────

@router.post("/clinical-letter", response_model=OraClinicalLetterResponse)
@limiter.limit("3/minute")
async def clinical_letter(
    request: Request,
    payload: OraClinicalLetterRequest,
    user: CurrentUser,
    _: None = Depends(require_tier("pro")),
):
    if payload.cycle_count < 2:
        raise HTTPException(status_code=422, detail="minimum_2_cycles_required")

    user_id = user["sub"]
    data = await ora_service.clinical_letter(payload.model_dump())
    tokens = data.pop("_tokens", 0)
    safe = await guard_service.eval(data["letter_text"])
    await _log_usage(user_id, "clinical_letter", tokens, not safe)

    if not safe:
        raise HTTPException(status_code=500, detail="insight_blocked")

    return OraClinicalLetterResponse(**data)


# ── Feature 5: Pattern Discovery (Pro, min 4 cycles) ─────────────────────────

@router.post("/patterns", response_model=OraPatternsResponse)
@limiter.limit("5/minute")
async def pattern_discovery(
    request: Request,
    payload: OraPatternsRequest,
    user: CurrentUser,
    _: None = Depends(require_tier("pro")),
):
    if payload.cycle_count < 4:
        raise HTTPException(status_code=422, detail="minimum_4_cycles_required")

    user_id = user["sub"]
    data = await ora_service.pattern_discovery(payload.model_dump())
    tokens = data.pop("_tokens", 0)

    guard_text = " ".join(p.get("description", "") for p in data["patterns"])
    safe = await guard_service.eval(guard_text) if guard_text.strip() else True
    await _log_usage(user_id, "pattern_discovery", tokens, not safe)

    if not safe:
        return OraPatternsResponse(patterns=[])

    return OraPatternsResponse(**data)


# ── Feature 6: Crisis Contextualization (Pro, min 4 cycles, no recent crisis) ─

@router.post("/crisis-context", response_model=OraCrisisContextResponse)
@limiter.limit("5/minute")
async def crisis_context(
    request: Request,
    payload: OraCrisisContextRequest,
    user: CurrentUser,
    _: None = Depends(require_tier("pro")),
):
    if len(payload.historical_crisis_windows) < 4:
        raise HTTPException(status_code=422, detail="minimum_4_cycles_required")

    user_id = user["sub"]
    supabase = get_supabase()

    # Gate: no crisis event in last 48 hours
    from datetime import datetime, timedelta, timezone
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=48)).isoformat()
    crisis_result = await run_supabase(
        lambda: supabase.table("crisis_events")
        .select("id")
        .eq("user_id", user_id)
        .gte("occurred_at", cutoff)
        .limit(1)
        .execute()
    )
    if crisis_result.data:
        raise HTTPException(status_code=403, detail="crisis_window_active")

    data = await ora_service.crisis_context(payload.model_dump())
    tokens = data.pop("_tokens", 0)
    safe = await guard_service.eval(data["context_text"])
    await _log_usage(user_id, "crisis_context", tokens, not safe)

    if not safe:
        raise HTTPException(status_code=500, detail="insight_blocked")

    return OraCrisisContextResponse(**data)
