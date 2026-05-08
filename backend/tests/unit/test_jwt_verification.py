import time

import pytest
from fastapi import HTTPException
from jose import jwt

from app.core.security import verify_supabase_jwt


SECRET = "test-secret-key-for-unit-tests-only"
ALGORITHM = "HS256"


def make_token(sub="user-123", exp_offset=3600, aud="authenticated"):
    payload = {
        "sub": sub,
        "aud": aud,
        "exp": int(time.time()) + exp_offset,
        "iat": int(time.time()),
    }
    return jwt.encode(payload, SECRET, algorithm=ALGORITHM)


def test_valid_token(monkeypatch):
    monkeypatch.setattr("app.core.security.settings.SUPABASE_JWT_SECRET", SECRET)
    token = make_token()
    result = verify_supabase_jwt(token)
    assert result["sub"] == "user-123"


def test_expired_token_raises_401(monkeypatch):
    monkeypatch.setattr("app.core.security.settings.SUPABASE_JWT_SECRET", SECRET)
    token = make_token(exp_offset=-1)
    with pytest.raises(HTTPException) as exc:
        verify_supabase_jwt(token)
    assert exc.value.status_code == 401


def test_wrong_audience_raises_401(monkeypatch):
    monkeypatch.setattr("app.core.security.settings.SUPABASE_JWT_SECRET", SECRET)
    token = make_token(aud="service_role")
    with pytest.raises(HTTPException) as exc:
        verify_supabase_jwt(token)
    assert exc.value.status_code == 401


def test_tampered_token_raises_401(monkeypatch):
    monkeypatch.setattr("app.core.security.settings.SUPABASE_JWT_SECRET", SECRET)
    token = make_token() + "tampered"
    with pytest.raises(HTTPException) as exc:
        verify_supabase_jwt(token)
    assert exc.value.status_code == 401
