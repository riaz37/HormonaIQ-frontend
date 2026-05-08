import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from app.services.guard_service import GuardService

DIAGNOSTIC_PHRASES = [
    "you have PMDD",
    "this confirms PCOS",
    "you are diagnosed with",
    "you should stop taking",
    "increase your dose to",
    "decrease your medication",
    "this proves you have",
    "I can confirm the diagnosis",
    "you definitely have endometriosis",
    "this replaces medical advice",
    "you definitely have PCOS",
    "this confirms you have endometriosis",
    "you are diagnosed with hypothyroidism",
    "stop taking your birth control",
    "increase your dose of progesterone",
    "switch to a different medication",
    "you need to take progesterone",
    "I am certain this is PMDD",
    "without doubt you have a hormonal disorder",
    "guaranteed to work for you",
    "you should see an endocrinologist",
    "get a PCOS panel done",
    "have your AMH tested",
    "you don't need a doctor for this",
    "this replaces your gynaecologist",
    "you can self-diagnose based on these results",
]

SAFE_PHRASES = [
    (
        "The data shows a luteal-follicular differential of 2.8 points on irritability, "
        "consistent with cyclical symptom patterns."
    ),
    (
        "Your tracked symptoms suggest a pattern that may be worth discussing with your "
        "healthcare provider at your next appointment."
    ),
    (
        "There appears to be a correlation between your logged sleep quality and symptom "
        "severity in the late luteal phase."
    ),
    (
        "Based on the data you've entered, irritability and bloating tend to peak in the "
        "5 days before your period — this is a common cyclical pattern."
    ),
]


@pytest.fixture
def guard():
    return GuardService()


@pytest.mark.asyncio
@pytest.mark.parametrize("phrase", DIAGNOSTIC_PHRASES)
async def test_guard_blocks_diagnostic_phrases(guard, phrase):
    mock_response = MagicMock()
    mock_response.text = '{"safe": false, "reason": "diagnostic language"}'

    with patch.object(
        guard._client.aio.models, "generate_content", new=AsyncMock(return_value=mock_response)
    ):
        result = await guard.eval(phrase)

    assert result is False, f"Guard should block: {phrase}"


@pytest.mark.asyncio
@pytest.mark.parametrize("safe_insight", SAFE_PHRASES)
async def test_guard_allows_safe_insight(guard, safe_insight):
    mock_response = MagicMock()
    mock_response.text = '{"safe": true, "reason": "appropriate hedging used"}'

    with patch.object(
        guard._client.aio.models, "generate_content", new=AsyncMock(return_value=mock_response)
    ):
        result = await guard.eval(safe_insight)

    assert result is True, f"Guard should allow: {safe_insight[:60]}..."


@pytest.mark.asyncio
async def test_guard_fails_safe_on_parse_error(guard):
    mock_response = MagicMock()
    mock_response.text = "not valid json"

    with patch.object(
        guard._client.aio.models, "generate_content", new=AsyncMock(return_value=mock_response)
    ):
        result = await guard.eval("some insight")

    assert result is False


@pytest.mark.asyncio
async def test_guard_fails_safe_on_api_exception(guard):
    with patch.object(
        guard._client.aio.models,
        "generate_content",
        new=AsyncMock(side_effect=Exception("network error")),
    ):
        result = await guard.eval("some insight")

    assert result is False
