"""Integration tests for POST /api/v1/report/generate."""
import pytest
from unittest.mock import MagicMock, patch

_REPORT_URL = "/api/v1/report/generate"

_VALID_PAYLOAD = {
    "cycle_count": 3,
    "start_date": "2026-01-01",
    "end_date": "2026-03-31",
    "chart_data": {"symptom": "irritability", "values": [2, 3, 5, 4, 2]},
    "includes_si": False,
}

_SMALL_PDF = b"%PDF-1.4 fake pdf content"
_LARGE_PDF = b"x" * (10 * 1024 * 1024 + 1)  # 10 MB + 1 byte


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _mock_jinja_and_weasyprint(pdf_bytes: bytes):
    """Return a tuple of context-manager patches for Jinja2 + WeasyPrint.

    The report endpoint calls:
      jinja_env.get_template(...)   → template.render(...) → html_str
      HTML(string=html_str).write_pdf()  → pdf_bytes
    """
    mock_template = MagicMock()
    mock_template.render.return_value = "<html><body>report</body></html>"

    mock_html_instance = MagicMock()
    mock_html_instance.write_pdf.return_value = pdf_bytes

    patch_template = patch(
        "app.api.v1.report.jinja_env.get_template", return_value=mock_template
    )
    patch_html = patch(
        "app.api.v1.report.HTML", return_value=mock_html_instance
    )
    return patch_template, patch_html


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
@pytest.mark.integration
async def test_free_tier_gets_403(client, auth_headers):
    """Free-tier users must receive 403 when attempting to generate a report."""
    response = await client.post(_REPORT_URL, json=_VALID_PAYLOAD, headers=auth_headers)

    assert response.status_code == 403
    assert response.json()["detail"] == "upgrade_required"


@pytest.mark.asyncio
@pytest.mark.integration
async def test_pro_tier_generates_pdf(client, pro_auth_headers):
    """Pro-tier users receive a 200 with Content-Type: application/pdf."""
    patch_template, patch_html = _mock_jinja_and_weasyprint(_SMALL_PDF)

    with patch_template, patch_html:
        response = await client.post(_REPORT_URL, json=_VALID_PAYLOAD, headers=pro_auth_headers)

    assert response.status_code == 200
    assert "application/pdf" in response.headers["content-type"]
    assert response.content == _SMALL_PDF


@pytest.mark.asyncio
@pytest.mark.integration
async def test_cache_control_header_present(client, pro_auth_headers):
    """The PDF response must carry a Cache-Control: no-store header."""
    patch_template, patch_html = _mock_jinja_and_weasyprint(_SMALL_PDF)

    with patch_template, patch_html:
        response = await client.post(_REPORT_URL, json=_VALID_PAYLOAD, headers=pro_auth_headers)

    assert response.status_code == 200
    cache_control = response.headers.get("cache-control", "")
    assert "no-store" in cache_control


@pytest.mark.asyncio
@pytest.mark.integration
async def test_pdf_too_large_returns_413(client, pro_auth_headers):
    """When write_pdf returns more than 10 MB the endpoint must raise 413."""
    patch_template, patch_html = _mock_jinja_and_weasyprint(_LARGE_PDF)

    with patch_template, patch_html:
        response = await client.post(_REPORT_URL, json=_VALID_PAYLOAD, headers=pro_auth_headers)

    assert response.status_code == 413
    assert response.json()["detail"] == "pdf_too_large"
