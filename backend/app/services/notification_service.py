"""
Notification service for dispatching Expo push notifications.
NOTE: Primary notification scheduling is handled by Supabase Edge Functions
(send-daily-reminders) triggered via pg_cron. This service handles ad-hoc
server-initiated notifications from FastAPI routes (e.g., crisis check-ins).
"""

import httpx

from app.core.supabase import get_supabase, run_supabase


EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"

CRISIS_TYPES = {"crisis_checkin"}


class NotificationService:
    async def send(
        self,
        user_id: str,
        notification_type: str,
        title: str,
        body: str,
    ) -> bool:
        """
        Dispatch a push notification to a user.
        Returns True if sent, False if suppressed (disabled, no token, passive mode).
        """
        supabase = get_supabase()
        result = await run_supabase(
            lambda: supabase.table("users")
            .select("expo_push_token, notifs_enabled, passive_mode_until")
            .eq("id", user_id)
            .single()
            .execute()
        )
        user = result.data

        if not user or not user.get("notifs_enabled"):
            return False
        if not user.get("expo_push_token"):
            return False

        passive_until = user.get("passive_mode_until")
        if passive_until and notification_type not in CRISIS_TYPES:
            from datetime import datetime, timezone
            if datetime.fromisoformat(passive_until) > datetime.now(timezone.utc):
                return False

        async with httpx.AsyncClient() as client:
            await client.post(
                EXPO_PUSH_URL,
                json={
                    "to": user["expo_push_token"],
                    "title": title,
                    "body": body,
                    "data": {"type": notification_type},
                    "sound": "default",
                },
            )

        await run_supabase(
            lambda: supabase.table("notification_log").insert({
                "user_id": user_id,
                "type": notification_type,
            }).execute()
        )

        return True
