from datetime import date

from pydantic import BaseModel, EmailStr


class SignupRequest(BaseModel):
    model_config = {"extra": "forbid"}

    email: EmailStr
    password: str
    conditions: list[str] = []
    primary_condition: str | None = None
    age_decade: int | None = None
    cycle_len: int = 28
    last_period_date: date | None = None
    irregular_cycles: bool = False
    adhd_flag: bool = False
    verified_minor: bool = False


class UserRead(BaseModel):
    id: str
    tier: str
    conditions: list[str]
    primary_condition: str | None
    cycle_len: int
    ora_enabled: bool
    notifs_enabled: bool
    notif_hour: int
    notif_minute: int


class UserUpdate(BaseModel):
    model_config = {"extra": "forbid"}

    cycle_len: int | None = None
    last_period_date: date | None = None
    irregular_cycles: bool | None = None
    ora_enabled: bool | None = None
    brain_fog_mode: bool | None = None
    reduce_motion: bool | None = None
    notifs_enabled: bool | None = None
    notif_hour: int | None = None
    notif_minute: int | None = None
    expo_push_token: str | None = None
    veteran_mode: bool | None = None
    ed_safe_mode: bool | None = None
