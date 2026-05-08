from pydantic import BaseModel


class ReportRequest(BaseModel):
    cycle_count: int
    start_date: str
    end_date: str
    chart_data: dict  # pre-computed by client
    includes_si: bool = False
