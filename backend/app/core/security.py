from fastapi import HTTPException, status
from jose import JWTError, jwt

from app.core.config import settings


def verify_supabase_jwt(token: str) -> dict:
    """Verify a Supabase-issued JWT. Raises 401 on any failure."""
    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="invalid_token",
            headers={"WWW-Authenticate": "Bearer"},
        )
