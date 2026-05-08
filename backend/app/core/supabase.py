import asyncio
from collections.abc import Callable
from typing import TypeVar

from supabase import Client, create_client

from app.core.config import settings

_supabase: Client | None = None

T = TypeVar("T")


def get_supabase() -> Client:
    global _supabase
    if _supabase is None:
        _supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    return _supabase


async def run_supabase(fn: Callable[[], T]) -> T:
    """Run a synchronous supabase-py call in a thread pool to avoid blocking the event loop."""
    return await asyncio.to_thread(fn)
