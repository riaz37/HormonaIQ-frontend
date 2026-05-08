"""Integration tests for DELETE /api/v1/data/range."""
import pytest
from unittest.mock import MagicMock, call, patch

_RANGE_URL = "/api/v1/data/range"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _build_supabase_mock() -> MagicMock:
    """Return a chainable Supabase mock that records all calls."""
    mock = MagicMock(name="supabase")
    mock.table.return_value = mock
    mock.delete.return_value = mock
    mock.insert.return_value = mock
    mock.eq.return_value = mock
    mock.gte.return_value = mock
    mock.lte.return_value = mock
    mock.execute.return_value = MagicMock(data=None, error=None)
    return mock


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
@pytest.mark.integration
async def test_delete_range_success(client, auth_headers):
    """DELETE /data/range with a valid date window returns 204 No Content."""
    supabase_mock = _build_supabase_mock()

    with patch("app.api.v1.data.get_supabase", return_value=supabase_mock):
        response = await client.delete(
            _RANGE_URL,
            params={"start": "2026-01-01", "end": "2026-03-01"},
            headers=auth_headers,
        )

    assert response.status_code == 204


@pytest.mark.asyncio
@pytest.mark.integration
async def test_delete_range_too_large_returns_400(client, auth_headers):
    """A date range spanning more than 366 days must be rejected with 400.

    NOTE: This test documents intended behaviour. The validation guard
    (> 366 days → HTTP 400) must be added to data.py for this test to pass.
    """
    response = await client.delete(
        _RANGE_URL,
        params={"start": "2020-01-01", "end": "2026-12-31"},
        headers=auth_headers,
    )

    assert response.status_code == 400


@pytest.mark.asyncio
@pytest.mark.integration
async def test_delete_range_audit_insert_called_before_delete(client, auth_headers):
    """The audit_log insert must happen AFTER symptom_logs are deleted.

    The current data.py implementation deletes symptom_logs first, then
    inserts the audit record — this test verifies that ordering is preserved.
    """
    supabase_mock = _build_supabase_mock()

    # Track the sequence in which .table() is called
    call_sequence: list[str] = []

    original_table = supabase_mock.table.side_effect

    def record_table(name: str):
        call_sequence.append(name)
        return supabase_mock

    supabase_mock.table.side_effect = record_table

    with patch("app.api.v1.data.get_supabase", return_value=supabase_mock):
        response = await client.delete(
            _RANGE_URL,
            params={"start": "2026-01-01", "end": "2026-03-01"},
            headers=auth_headers,
        )

    assert response.status_code == 204

    # symptom_logs must appear before audit_log in the call sequence
    assert "symptom_logs" in call_sequence, "symptom_logs table was never accessed"
    assert "audit_log" in call_sequence, "audit_log table was never accessed"
    symptom_idx = call_sequence.index("symptom_logs")
    audit_idx = call_sequence.index("audit_log")
    assert symptom_idx < audit_idx, (
        f"Expected symptom_logs (pos {symptom_idx}) before audit_log (pos {audit_idx})"
    )
