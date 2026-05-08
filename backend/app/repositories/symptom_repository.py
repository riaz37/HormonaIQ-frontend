from app.repositories.base import BaseRepository


class SymptomRepository(BaseRepository):
    def __init__(self):
        super().__init__("symptom_logs")

    def find_by_date_range(self, user_id: str, start: str, end: str) -> list[dict]:
        result = (
            self._supabase.table(self._table)
            .select("*")
            .eq("user_id", user_id)
            .gte("log_date", start)
            .lte("log_date", end)
            .order("log_date", desc=True)
            .execute()
        )
        return result.data
