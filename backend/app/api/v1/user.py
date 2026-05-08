from fastapi import APIRouter

from app.api.deps import CurrentUser
from app.core.exceptions import NotFoundException
from app.core.supabase import get_supabase, run_supabase
from app.schemas.user import UserRead, UserUpdate

router = APIRouter()


@router.get("/profile", response_model=UserRead)
async def get_profile(user: CurrentUser):
    supabase = get_supabase()
    result = await run_supabase(
        lambda: supabase.table("users").select("*").eq("id", user["sub"]).single().execute()
    )
    if result.data is None:
        raise NotFoundException("profile_not_found")
    return result.data


@router.patch("/profile", response_model=UserRead)
async def update_profile(payload: UserUpdate, user: CurrentUser):
    supabase = get_supabase()
    update_data = payload.model_dump(exclude_unset=True, exclude_none=True)
    result = await run_supabase(
        lambda: supabase.table("users").update(update_data).eq("id", user["sub"]).execute()
    )
    return result.data[0]


@router.get("/tier")
async def get_tier(user: CurrentUser):
    supabase = get_supabase()
    result = await run_supabase(
        lambda: supabase.table("users").select("tier").eq("id", user["sub"]).single().execute()
    )
    return {"tier": result.data["tier"]}
