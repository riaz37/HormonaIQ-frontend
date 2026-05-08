from typing import Generic, TypeVar

T = TypeVar("T")


class BaseRepository(Generic[T]):
    def __init__(self, table_name: str):
        from app.core.supabase import get_supabase
        self._supabase = get_supabase()
        self._table = table_name

    def find_by_id(self, record_id: str) -> dict | None:
        result = self._supabase.table(self._table).select("*").eq("id", record_id).maybe_single().execute()
        return result.data

    def find_all_by_user(self, user_id: str) -> list[dict]:
        result = self._supabase.table(self._table).select("*").eq("user_id", user_id).execute()
        return result.data

    def create(self, data: dict) -> dict:
        result = self._supabase.table(self._table).insert(data).execute()
        return result.data[0]

    def update(self, record_id: str, data: dict) -> dict:
        result = self._supabase.table(self._table).update(data).eq("id", record_id).execute()
        return result.data[0]

    def delete(self, record_id: str) -> None:
        self._supabase.table(self._table).delete().eq("id", record_id).execute()
