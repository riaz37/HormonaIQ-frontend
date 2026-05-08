import hashlib

from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser
from app.core.supabase import get_supabase, run_supabase
from app.schemas.user import SignupRequest

router = APIRouter()

DELETION_ORDER = [
    "crisis_events", "ora_usage", "notification_log", "safety_plans",
    "peri_gcs_assessments", "peri_hot_flashes", "pcos_lab_values",
    "drsp_charts", "symptom_logs", "sync_watermarks",
]


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(payload: SignupRequest):
    """Create Supabase auth user + initial users row."""
    # Minor guard: users born < 18 years ago require a guardian email before account creation.
    # verified_minor is set by the client from onboarding YOB. If flagged, reject here —
    # the mobile onboarding flow must collect guardian email and call /auth/guardian-consent first.
    if payload.verified_minor:
        raise HTTPException(
            status_code=403,
            detail="guardian_consent_required",
        )

    supabase = get_supabase()
    try:
        auth_response = await run_supabase(
            lambda: supabase.auth.admin.create_user(
                {"email": payload.email, "password": payload.password, "email_confirm": True}
            )
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    user_id = auth_response.user.id
    email_hash = hashlib.sha256(payload.email.lower().encode()).hexdigest()

    try:
        await run_supabase(
            lambda: supabase.table("users").insert({
                "id": user_id,
                "email_hash": email_hash,
                "conditions": payload.conditions,
                "primary_condition": payload.primary_condition,
                "age_decade": payload.age_decade,
                "cycle_len": payload.cycle_len,
                "last_period_date": payload.last_period_date.isoformat() if payload.last_period_date else None,
                "irregular_cycles": payload.irregular_cycles,
                "adhd_flag": payload.adhd_flag,
            }).execute()
        )
    except Exception as e:
        # Compensation: remove the auth user so the account isn't orphaned
        try:
            await run_supabase(lambda: supabase.auth.admin.delete_user(user_id))
        except Exception:
            pass
        raise HTTPException(status_code=500, detail="signup_failed") from e

    return {"user_id": user_id, "tier": "free"}


@router.post("/delete", status_code=status.HTTP_204_NO_CONTENT)
async def delete_account(user: CurrentUser):
    """Hard-delete all user data then the auth account."""
    supabase = get_supabase()
    user_id = user["sub"]

    for table in DELETION_ORDER:
        await run_supabase(
            lambda t=table: supabase.table(t).delete().eq("user_id", user_id).execute()
        )

    await run_supabase(
        lambda: supabase.table("users").delete().eq("id", user_id).execute()
    )
    await run_supabase(
        lambda: supabase.table("audit_log").insert(
            {"user_id": None, "event_type": "account_deleted"}
        ).execute()
    )
    await run_supabase(lambda: supabase.auth.admin.delete_user(user_id))
