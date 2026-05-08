from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address


def _user_key(request: Request) -> str:
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        try:
            from app.core.security import verify_supabase_jwt
            payload = verify_supabase_jwt(auth[7:])
            return payload["sub"]
        except Exception:
            pass
    return get_remote_address(request)


limiter = Limiter(key_func=_user_key)
