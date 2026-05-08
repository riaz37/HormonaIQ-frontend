import csv
import io
import json
import zipfile
from datetime import date

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.api.deps import CurrentUser
from app.core.supabase import get_supabase, run_supabase

router = APIRouter()


@router.delete("/range", status_code=204)
async def delete_range(start: date, end: date, user: CurrentUser):
    if (end - start).days > 366:
        raise HTTPException(status_code=400, detail="range_too_large")

    supabase = get_supabase()
    user_id = user["sub"]

    # Audit BEFORE delete — unaudited deletion is worse than undeleted audit
    await run_supabase(
        lambda: supabase.table("audit_log").insert({
            "user_id": user_id,
            "event_type": "range_deleted",
            "meta": {"start": str(start), "end": str(end)},
        }).execute()
    )

    await run_supabase(
        lambda: supabase.table("symptom_logs")
        .delete()
        .eq("user_id", user_id)
        .gte("log_date", start.isoformat())
        .lte("log_date", end.isoformat())
        .execute()
    )


@router.get("/export")
async def export_data(user: CurrentUser, format: str = "json"):
    if format not in ("json", "csv"):
        raise HTTPException(status_code=400, detail="format must be 'json' or 'csv'")

    supabase = get_supabase()
    user_id = user["sub"]

    # Fetch all user data in parallel
    logs_res, labs_res, flashes_res, safety_res = await _fetch_all(supabase, user_id)

    await run_supabase(
        lambda: supabase.table("audit_log").insert({
            "user_id": user_id,
            "event_type": "export_generated",
        }).execute()
    )

    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        if format == "json":
            zf.writestr("symptom_logs.json", json.dumps(logs_res, default=str))
            if labs_res:
                zf.writestr("pcos_lab_values.json", json.dumps(labs_res, default=str))
            if flashes_res:
                zf.writestr("peri_hot_flashes.json", json.dumps(flashes_res, default=str))
            if safety_res:
                zf.writestr("safety_plan.json", json.dumps(safety_res, default=str))
        else:
            zf.writestr("symptom_logs.csv", _to_csv(logs_res))
            if labs_res:
                zf.writestr("pcos_lab_values.csv", _to_csv(labs_res))
            if flashes_res:
                zf.writestr("peri_hot_flashes.csv", _to_csv(flashes_res))

    zip_buffer.seek(0)
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={
            "Content-Disposition": 'attachment; filename="hormonaiq-export.zip"',
            "Cache-Control": "no-store",
        },
    )


async def _fetch_all(supabase, user_id: str):
    import asyncio

    logs, labs, flashes, safety = await asyncio.gather(
        run_supabase(lambda: supabase.table("symptom_logs").select("*").eq("user_id", user_id).execute()),
        run_supabase(lambda: supabase.table("pcos_lab_values").select("*").eq("user_id", user_id).execute()),
        run_supabase(lambda: supabase.table("peri_hot_flashes").select("*").eq("user_id", user_id).execute()),
        run_supabase(lambda: supabase.table("safety_plans").select("*").eq("user_id", user_id).single().execute()),
    )
    return (
        logs.data or [],
        labs.data or [],
        flashes.data or [],
        [safety.data] if safety.data else [],
    )


def _to_csv(rows: list[dict]) -> str:
    if not rows:
        return ""
    buf = io.StringIO()
    writer = csv.DictWriter(buf, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)
    return buf.getvalue()
