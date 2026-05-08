"""Integration tests for quota enforcement on POST /api/v1/ora/explain."""
import asyncio
import pytest
from unittest.mock import AsyncMock, MagicMock, call, patch

_EXPLAIN_URL = "/api/v1/ora/explain"

_VALID_PAYLOAD = {
    "context": {
        "symptoms": {"irritability": [2, 3, 4, 5, 3, 2]},
        "phase_labels": ["follicular", "luteal"],
    },
    "cycle_number": 1,
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _build_quota_supabase(quota_responses: list[bool]) -> MagicMock:
    """Build a Supabase mock whose quota RPC returns successive values.

    quota_responses is consumed in order; each call to .execute() on the RPC
    result returns the next value from the list.
    """
    mock = MagicMock(name="supabase_quota")
    mock.table.return_value = mock
    mock.insert.return_value = mock
    mock.execute.return_value = MagicMock(data=None, error=None)

    # Each rpc().execute() call pops from quota_responses
    execute_results = [MagicMock(data=v) for v in quota_responses]
    rpc_mock = MagicMock()
    rpc_mock.execute.side_effect = execute_results
    mock.rpc.return_value = rpc_mock

    return mock


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
@pytest.mark.integration
async def test_concurrent_free_tier_requests_only_one_succeeds(client, auth_headers):
    """Two concurrent requests from the same free-tier user — exactly one 429.

    The quota RPC is the atomic gate: first call returns True (allowed),
    second returns False (quota now exhausted). asyncio.gather sends both
    requests simultaneously to exercise the concurrent path.
    """
    insight_text = "Luteal-phase irritability differential: 2.8 points."

    # First quota check passes, second fails
    supabase_mock = _build_quota_supabase([True, False])

    async def _post():
        return await client.post(_EXPLAIN_URL, json=_VALID_PAYLOAD, headers=auth_headers)

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
        r1, r2 = await asyncio.gather(_post(), _post())

    statuses = sorted([r1.status_code, r2.status_code])
    assert statuses == [200, 429], (
        f"Expected exactly one 200 and one 429, got {statuses}"
    )


@pytest.mark.asyncio
@pytest.mark.integration
async def test_quota_rpc_called_with_correct_params(client, auth_headers):
    """The check_ora_quota RPC must be invoked with the correct named parameters."""
    insight_text = "Follicular baseline is consistently lower than luteal phase."

    supabase_mock = _build_quota_supabase([True])

    with (
        patch("app.api.v1.ora.get_supabase", return_value=supabase_mock),
        patch(
            "app.api.v1.ora.ora_service.explain_chart",
            new=AsyncMock(return_value=(insight_text, 75)),
        ),
        patch(
            "app.api.v1.ora.guard_service.eval",
            new=AsyncMock(return_value=True),
        ),
    ):
        response = await client.post(_EXPLAIN_URL, json=_VALID_PAYLOAD, headers=auth_headers)

    assert response.status_code == 200

    # Verify the RPC was called exactly once with the expected arguments
    supabase_mock.rpc.assert_called_once_with(
        "check_ora_quota",
        {
            "p_user_id": "test-user-id",
            "p_feature": "explain_chart",
            "p_limit": 3,
        },
    )
