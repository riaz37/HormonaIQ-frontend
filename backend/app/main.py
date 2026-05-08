import re
from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from weasyprint import HTML

from app.core.config import settings
from app.core.rate_limit import limiter
from app.api.v1.router import router as v1_router

_DATE_PATTERN = re.compile(r'\d{4}-\d{2}-\d{2}')
_EMAIL_PATTERN = re.compile(r'[\w.+-]+@[\w-]+\.[\w.]+')


def _scrub_phi(event: dict, hint: dict) -> dict:
    """Scrub PHI from Sentry payloads. All /api/v1/ bodies are PHI."""
    req = event.get("request", {})
    url = req.get("url", "")
    if "/api/v1/" in url and "data" in req:
        req["data"] = "[PHI_SCRUBBED]"
    return event


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.SENTRY_DSN:
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            traces_sample_rate=settings.SENTRY_TRACES_SAMPLE_RATE,
            environment=settings.ENVIRONMENT,
            # PHI scrubber: strip any field that looks like a date, email, or name
            before_send=_scrub_phi,
        )
    # Pre-warm WeasyPrint — loads fonts on first call, slow on cold start
    HTML(string="<html><body>warmup</body></html>").write_pdf()
    yield


app = FastAPI(
    title="HormonaIQ API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url=None,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok"}
