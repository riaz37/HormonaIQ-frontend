import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock


def test_report_returns_pdf_content_type():
    """PDF endpoint returns application/pdf."""
    # Integration test — requires real WeasyPrint, covered in integration suite
    pass  # Placeholder: see tests/integration/test_report.py


def test_report_no_disk_write(tmp_path):
    """Verify StreamingResponse uses BytesIO, not a file path."""
    import io
    from app.api.v1.report import generate_report
    # The route only uses io.BytesIO — no file system writes possible
    # This is a structural test — verifying the import chain
    import inspect
    source = inspect.getsource(generate_report)
    assert "open(" not in source
    assert "tmp" not in source.lower()
    assert "BytesIO" in source
