"""Integration tests for POST /api/v1/ora/explain."""
import pytest
from unittest.mock import AsyncMock, MagicMock, patch

import httpx

from app.api.v1.ora import SAFE_FALLBACK

_EXPLAIN_URL = "/api/v1/ora/explain"

_VALID_PAYLOAD = {
    "context": {
        "symptoms": {"irritability": [2, 3, 4, 5, 3, 2], "bloating": [1, 2, 3, 4, 2, 1]},
        "phase_labels": ["follicular", "luteal"],
    },
    "cycle_number": 3,
}


def _quota_ok_mock() -> MagicMock:
    mock = MagicMock()
    mock.table.return_value = mock
    mock.insert.return_value = mock
    mock.execute.return_value = MagicMock(data=None, error=None)
    rpc_result = MagicMock()
    rpc_result.execute.return_value = MagicMock(data=True)
    mock.rpc.return_value = rpc_result
    return mock


def _quota_exceeded_mock() -> MagicMock:
    mock = MagicMock()
    # tier lookup returns free
    tier_mock = MagicMock()
    tier_mock.execute.return_value = MagicMock(data={"tier": "free"})
    mock.table.return_value.select.return_value.eq.return_value.single.return_value = tier_mock
    rpc_result = MagicMock()
    rpc_result.execute.return_value = MagicMock(data=False)
    mock.rpc.return_value = rpc_result
    return mock


@pytest.mark.asyncio
@pytest.mark.integration
async def test_free_tier_under_quota_returns_insight(client, auth_headers):
    insight_text = "Irritability peaks 5 days before menstruation — a classic luteal pattern."
    supabase_mock = _quota_ok_mock()

    with (
        patch("app.api.v1.ora.get_supabase", return_value=supabase_mock),
        patch(
            "app.api.v1.ora.ora_service.explain_chart",
            new=AsyncMock(return_value=(insight_text, 100)),
        ),
        patch(
            "app.api.v1.ora.guard_service.eval",
            new=AsyncMock(return_value=True),
        ),
    ):
        response = await client.post(_EXPLAIN_URL, json=_VALID_PAYLOAD, headers=auth_headers)

    assert response.status_code == 200
    assert response.json()["insight"] == insight_text


@pytest.mark.asyncio
@pytest.mark.integration
async def test_free_tier_over_quota_returns_429(client, auth_headers):
    supabase_mock = _quota_exceeded_mock()

    with patch("app.api.v1.ora.get_supabase", return_value=supabase_mock):
        response = await client.post(_EXPLAIN_URL, json=_VALID_PAYLOAD, headers=auth_headers)

    assert response.status_code == 429
    assert response.json()["detail"] == "quota_exceeded"


@pytest.mark.asyncio
@pytest.mark.integration
async def test_pro_tier_skips_quota(client, pro_auth_headers):
    insight_text = "Pro insight — no quota gate."

    supabase_mock = MagicMock()
    supabase_mock.table.return_value = supabase_mock
    supabase_mock.insert.return_value = supabase_mock
    supabase_mock.execute.return_value = MagicMock(data=None, error=None)

    with (
        patch("app.api.v1.ora.get_supabase", return_value=supabase_mock),
        patch(
            "app.api.v1.ora.ora_service.explain_chart",
            new=AsyncMock(return_value=(insight_text, 80)),
        ),
        patch(
            "app.api.v1.ora.guard_service.eval",
            new=AsyncMock(return_value=True),
        ),
    ):
        response = await client.post(_EXPLAIN_URL, json=_VALID_PAYLOAD, headers=pro_auth_headers)

    assert response.status_code == 200
    assert response.json()["insight"] == insight_text
    supabase_mock.rpc.assert_not_called()


@pytest.mark.asyncio
@pytest.mark.integration
async def test_guard_blocked_returns_fallback(client, auth_headers):
    supabase_mock = _quota_ok_mock()

    with (
        patch("app.api.v1.ora.get_supabase", return_value=supabase_mock),
        patch(
            "app.api.v1.ora.ora_service.explain_chart",
            new=AsyncMock(return_value=("You have PMDD — this confirms it.", 90)),
        ),
        patch(
            "app.api.v1.ora.guard_service.eval",
            new=AsyncMock(return_value=False),
        ),
    ):
        response = await client.post(_EXPLAIN_URL, json=_VALID_PAYLOAD, headers=auth_headers)

    assert response.status_code == 200
    assert response.json()["insight"] == SAFE_FALLBACK


@pytest.mark.asyncio
@pytest.mark.integration
async def test_gemini_timeout_returns_503(client, auth_headers):
    """A timeout from Gemini must surface as a 5xx."""
    supabase_mock = _quota_ok_mock()

    with (
        patch("app.api.v1.ora.get_supabase", return_value=supabase_mock),
        patch(
            "app.api.v1.ora.ora_service.explain_chart",
            new=AsyncMock(side_effect=httpx.TimeoutException("timed out")),
        ),
    ):
        response = await client.post(_EXPLAIN_URL, json=_VALID_PAYLOAD, headers=auth_headers)

    assert response.status_code in (500, 503)
