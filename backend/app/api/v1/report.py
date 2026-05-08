import asyncio
import io
from pathlib import Path

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML

from app.api.deps import CurrentUser, require_tier
from app.schemas.report import ReportRequest

router = APIRouter()
jinja_env = Environment(loader=FileSystemLoader(Path(__file__).parent.parent / "templates"))


@router.post("/generate")
async def generate_report(
    payload: ReportRequest,
    user: CurrentUser,
    _: None = Depends(require_tier("pro")),
) -> StreamingResponse:
    template = jinja_env.get_template("drsp_report.html")
    html_str = template.render(
        cycle_count=payload.cycle_count,
        start_date=payload.start_date,
        end_date=payload.end_date,
        chart_data=payload.chart_data,
        includes_si=payload.includes_si,
    )
    pdf_bytes = await asyncio.to_thread(lambda: HTML(string=html_str).write_pdf())

    if len(pdf_bytes) > 10 * 1024 * 1024:
        from fastapi import HTTPException
        raise HTTPException(status_code=413, detail="pdf_too_large")

    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": 'attachment; filename="drsp-summary.pdf"',
            "Cache-Control": "no-store, no-cache, must-revalidate",
            "Pragma": "no-cache",
        },
    )
