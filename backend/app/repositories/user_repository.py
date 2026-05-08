from app.repositories.base import BaseRepository


class UserRepository(BaseRepository):
    def __init__(self):
        super().__init__("users")

    def find_by_user_id(self, user_id: str) -> dict | None:
        result = self._supabase.table(self._table).select("*").eq("id", user_id).maybe_single().execute()
        return result.data

    def update_tier(self, user_id: str, tier: str) -> None:
        self._supabase.table(self._table).update({"tier": tier}).eq("id", user_id).execute()
