import json

from google import genai
from google.genai import types

from app.core.config import settings

_GUARD_SYSTEM = (
    "You are a medical safety reviewer. Evaluate AI-generated health insights. "
    "Return JSON only: { \"safe\": boolean, \"reason\": string }"
)

_GUARD_CRITERIA = """Block (safe=false) if the text:
1. Makes a diagnosis (e.g., "you have PMDD," "this confirms PCOS")
2. Recommends changing a medication dose
3. Recommends starting or stopping any medication
4. Expresses clinical certainty without appropriate hedging
5. Contains any identifying information
6. References methods of self-harm
7. Claims to replace medical advice

Text to evaluate:
\"\"\"
{INSIGHT_TEXT}
\"\"\""""

_MODEL = "gemini-2.0-flash"


class GuardService:
    def __init__(self):
        self._client = genai.Client(api_key=settings.GEMINI_API_KEY)

    async def eval(self, insight_text: str) -> bool:
        """Returns True if safe to show, False if blocked. Fails safe on any error."""
        prompt = _GUARD_CRITERIA.replace("{INSIGHT_TEXT}", insight_text)
        try:
            response = await self._client.aio.models.generate_content(
                model=_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=_GUARD_SYSTEM,
                    response_mime_type="application/json",
                    max_output_tokens=128,
                    http_options=types.HttpOptions(timeout=15_000),
                ),
            )
            result = json.loads(response.text)
            return bool(result.get("safe", False))
        except Exception:
            return False  # fail safe — never show if guard errors
