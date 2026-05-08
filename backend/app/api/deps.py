from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.exceptions import ForbiddenException, UpgradeRequiredException
from app.core.security import verify_supabase_jwt

bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)],
) -> dict:
    return verify_supabase_jwt(credentials.credentials)


CurrentUser = Annotated[dict, Depends(get_current_user)]


def require_tier(tier: str):
    async def check(user: CurrentUser):
        from app.core.supabase import get_supabase, run_supabase
        supabase = get_supabase()
        result = await run_supabase(
            lambda: supabase.table("users").select("tier").eq("id", user["sub"]).single().execute()
        )
        db_tier = result.data.get("tier", "free") if result.data else "free"
        if db_tier != tier:
            raise UpgradeRequiredException()
    return check
