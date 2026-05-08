"""
Queries crisis_events for Ora crisis-context feature.
NOTE: The crisis ASSESSMENT algorithm (tier classification) lives in
supabase/functions/sync-push/crisis-pipeline.ts — that is the
authoritative server-side check. This service only queries existing events.
"""

from datetime import datetime, timedelta, timezone

from app.core.supabase import get_supabase, run_supabase


class CrisisService:
    async def has_recent_crisis(self, user_id: str, within_hours: int = 48) -> bool:
        """Return True if user had a crisis event within the given window."""
        supabase = get_supabase()
        cutoff = (datetime.now(timezone.utc) - timedelta(hours=within_hours)).isoformat()
        result = await run_supabase(
            lambda: supabase.table("crisis_events")
            .select("id")
            .eq("user_id", user_id)
            .gte("occurred_at", cutoff)
            .limit(1)
            .execute()
        )
        return len(result.data) > 0
