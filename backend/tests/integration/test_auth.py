"""Integration tests for POST /api/v1/auth/signup and DELETE /api/v1/auth/delete."""
import pytest
from unittest.mock import MagicMock, patch


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

_SIGNUP_URL = "/api/v1/auth/signup"
_DELETE_URL = "/api/v1/auth/delete"

_VALID_PAYLOAD = {
    "email": "test@example.com",
    "password": "S3cur3P@ss!",
    "conditions": ["pmdd"],
    "primary_condition": "pmdd",
    "age_decade": 30,
    "cycle_len": 28,
    "last_period_date": None,
    "irregular_cycles": False,
    "adhd_flag": False,
}


def _make_auth_user(user_id: str = "created-user-uuid") -> MagicMock:
    """Return a mock Supabase auth response with the given user ID."""
    user = MagicMock()
    user.id = user_id
    response = MagicMock()
    response.user = user
    return response


# ---------------------------------------------------------------------------
# Signup tests
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
@pytest.mark.integration
async def test_signup_creates_user(client, mock_supabase):
    """POST /signup with a valid payload should return 201 and a user_id."""
    user_id = "new-user-uuid-1234"
    mock_supabase.auth.admin.create_user.return_value = _make_auth_user(user_id)

    # .table("users").insert(...).execute() — already chained via mock_supabase
    mock_supabase.execute.return_value = MagicMock(data=[{"id": user_id}], error=None)

    response = await client.post(_SIGNUP_URL, json=_VALID_PAYLOAD)

    assert response.status_code == 201
    body = response.json()
    assert body["user_id"] == user_id
    assert "tier" in body


@pytest.mark.asyncio
@pytest.mark.integration
async def test_signup_duplicate_email_returns_400(client, mock_supabase):
    """When Supabase auth raises (e.g. duplicate email), the endpoint returns 400."""
    mock_supabase.auth.admin.create_user.side_effect = Exception(
        "User already registered"
    )

    response = await client.post(_SIGNUP_URL, json=_VALID_PAYLOAD)

    assert response.status_code == 400
    assert "User already registered" in response.json()["detail"]


@pytest.mark.asyncio
@pytest.mark.integration
async def test_signup_db_failure_cleans_up_auth_user(client, mock_supabase):
    """If the users table insert fails after auth creation, delete_user must be called.

    NOTE: The current auth.py implementation does NOT yet call delete_user on DB
    failure — this test documents the expected behaviour and will fail until the
    compensating transaction is added to the endpoint.
    """
    user_id = "user-to-rollback"
    mock_supabase.auth.admin.create_user.return_value = _make_auth_user(user_id)

    # Make .execute() raise on the insert call only
    mock_supabase.execute.side_effect = Exception("DB insert failed")

    # We expect the endpoint to propagate an error (500 or 400)
    response = await client.post(_SIGNUP_URL, json=_VALID_PAYLOAD)

    # Regardless of the HTTP status, delete_user should have been called as
    # a compensating action to avoid orphaned auth accounts.
    assert response.status_code in (400, 500)
    mock_supabase.auth.admin.delete_user.assert_called_once_with(user_id)


# ---------------------------------------------------------------------------
# Delete account tests
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
@pytest.mark.integration
async def test_delete_account_returns_204(client, mock_supabase, auth_headers):
    """Authenticated DELETE /delete should cascade-delete all user data and return 204."""
    response = await client.post(_DELETE_URL, headers=auth_headers)

    assert response.status_code == 204
    # Verify the auth-level delete was also requested
    mock_supabase.auth.admin.delete_user.assert_called_once_with("test-user-id")


@pytest.mark.asyncio
@pytest.mark.integration
async def test_delete_account_requires_auth(client):
    """DELETE /delete without an Authorization header must return 403."""
    response = await client.post(_DELETE_URL)

    # FastAPI HTTPBearer raises 403 when no credentials are supplied
    assert response.status_code == 403
