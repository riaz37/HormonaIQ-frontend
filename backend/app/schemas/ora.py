from pydantic import BaseModel


# ── Feature 1: Explain Chart ──────────────────────────────────────────────────

class OraExplainRequest(BaseModel):
    context: dict  # PHI-scrubbed OraContext from mobile
    cycle_number: int


class OraExplainResponse(BaseModel):
    insight: str


# ── Feature 2: Appointment Prep ───────────────────────────────────────────────

class OraAppointmentPrepRequest(BaseModel):
    conditions: list[str]
    cycle_count: int
    c_pass_result: dict | None = None
    luteal_averages: dict
    functional_impairment_rate: float  # 0.0–1.0


class OraAppointmentPrepResponse(BaseModel):
    summary: str
    phrases_to_use: list[str]
    dismissal_responses: list[str]
    key_question: str


# ── Feature 3: Why Is This Happening ─────────────────────────────────────────

class OraWhyNowRequest(BaseModel):
    cycle_day: int
    cycle_phase: str
    current_scores: dict
    historical_averages_for_phase: dict  # keyed by DRSP item


class OraWhyNowResponse(BaseModel):
    context_text: str
    typical_duration_days_min: int
    typical_duration_days_max: int
    historically_helpful: list[str]


# ── Feature 4: Clinical Letter ────────────────────────────────────────────────

class OraClinicalLetterRequest(BaseModel):
    conditions: list[str]
    cycle_count: int
    start_date: str   # YYYY-MM-DD
    end_date: str
    luteal_averages: dict
    follicular_averages: dict
    c_pass: dict
    drsp_item_count: int


class OraClinicalLetterResponse(BaseModel):
    letter_text: str


# ── Feature 5: Pattern Discovery ──────────────────────────────────────────────

class OraPatternsRequest(BaseModel):
    entries: list[dict]   # [{cycle_day, phase, drsp, sleep_quality}]
    cycle_count: int
    conditions: list[str]


class OraPatternItem(BaseModel):
    pattern_type: str
    correlation_coefficient: float
    cycles_analyzed: int
    description: str
    confidence_note: str


class OraPatternsResponse(BaseModel):
    patterns: list[OraPatternItem]


# ── Feature 6: Crisis Contextualization ──────────────────────────────────────

class OraCrisisContextRequest(BaseModel):
    cycle_day: int
    current_phase: str
    historical_crisis_windows: list[dict]  # [{min_days, max_days, cycle_number}]


class OraCrisisContextResponse(BaseModel):
    min_days: int
    max_days: int
    cycles_analyzed: int
    context_text: str
