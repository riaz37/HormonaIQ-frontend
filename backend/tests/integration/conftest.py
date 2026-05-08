"""Integration test configuration and shared fixtures.

All fixtures here avoid hitting real external services. Supabase and
Anthropic calls are intercepted at the dependency-injection / module level.
"""
from unittest.mock import MagicMock, patch

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.main import app


# ---------------------------------------------------------------------------
# HTTP client
# ---------------------------------------------------------------------------


@pytest_asyncio.fixture
async def client():
    """Yield an AsyncClient wired directly to the FastAPI app (no network)."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac


# ---------------------------------------------------------------------------
# Supabase mock
# ---------------------------------------------------------------------------


@pytest.fixture
def mock_supabase():
    """Patch get_supabase() across every module that imports it.

    Returns the MagicMock so individual tests can configure return values.
    """
    mock = MagicMock()

    # Default chainable builder: .table(...).insert(...).execute() etc.
    # Each chained call returns the mock itself so that arbitrary call chains
    # resolve without AttributeError.
    mock.table.return_value = mock
    mock.insert.return_value = mock
    mock.delete.return_value = mock
    mock.update.return_value = mock
    mock.select.return_value = mock
    mock.eq.return_value = mock
    mock.gte.return_value = mock
    mock.lte.return_value = mock
    mock.execute.return_value = MagicMock(data=None, error=None)
    mock.rpc.return_value = mock

    patches = [
        patch("app.api.v1.auth.get_supabase", return_value=mock),
        patch("app.api.v1.ora.get_supabase", return_value=mock),
        patch("app.api.v1.data.get_supabase", return_value=mock),
        patch("app.core.supabase.get_supabase", return_value=mock),
    ]
    for p in patches:
        p.start()

    yield mock

    for p in patches:
        p.stop()


# ---------------------------------------------------------------------------
# Auth / JWT mock
# ---------------------------------------------------------------------------


@pytest.fixture
def auth_headers():
    """Return Bearer headers and patch JWT verification to bypass real Supabase.

    The patched verify_supabase_jwt returns a minimal free-tier JWT payload.
    """
    fake_payload = {"sub": "test-user-id", "user_metadata": {}}

    with patch(
        "app.core.security.verify_supabase_jwt", return_value=fake_payload
    ):
        yield {"Authorization": "Bearer test_token"}


@pytest.fixture
def pro_auth_headers():
    """Same as auth_headers but for a pro-tier user."""
    fake_payload = {"sub": "test-user-id", "user_metadata": {"tier": "pro"}}

    with patch(
        "app.core.security.verify_supabase_jwt", return_value=fake_payload
    ):
        yield {"Authorization": "Bearer test_token"}
