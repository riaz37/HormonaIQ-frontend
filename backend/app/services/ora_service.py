import json
from pathlib import Path

from google import genai
from google.genai import types

from app.core.config import settings

_PROMPT_PATH = Path(__file__).parent.parent / "agents" / "system-prompt.txt"
try:
    _SYSTEM_PROMPT = _PROMPT_PATH.read_text()
    if not _SYSTEM_PROMPT.strip():
        raise ValueError("empty")
except (FileNotFoundError, ValueError) as e:
    raise RuntimeError(
        f"Ora system prompt missing or empty at {_PROMPT_PATH}. "
        "Add app/agents/system-prompt.txt before starting the server."
    ) from e

_MODEL = "gemini-2.0-flash"


class OraService:
    def __init__(self):
        self._client = genai.Client(api_key=settings.GEMINI_API_KEY)

    async def explain_chart(self, context: dict, cycle_number: int) -> tuple[str, int]:
        prompt = (
            f"Based on this DRSP data from cycle {cycle_number}, identify the single most "
            f"clinically significant finding. Focus on the luteal-follicular differential. "
            f"Be specific about which items show the largest phase differential. Maximum 3 sentences.\n\n"
            f"Data: {context}"
        )
        return await self._generate(prompt, max_tokens=300)

    async def appointment_prep(self, context: dict) -> dict:
        prompt = (
            f"Generate appointment preparation for a patient with: conditions={context.get('conditions')}, "
            f"cycles tracked={context.get('cycle_count')}, C-PASS={context.get('c_pass_result')}, "
            f"luteal averages={context.get('luteal_averages')}, "
            f"functional impairment rate={context.get('functional_impairment_rate')}.\n\n"
            f"Return JSON with keys: summary (3 sentences), phrases_to_use (list of 3), "
            f"dismissal_responses (list of 2), key_question (1 best question to ask the doctor)."
        )
        text, tokens = await self._generate(prompt, max_tokens=600, json_mode=True)
        data = json.loads(text)
        return {
            "summary": data.get("summary", ""),
            "phrases_to_use": data.get("phrases_to_use", []),
            "dismissal_responses": data.get("dismissal_responses", []),
            "key_question": data.get("key_question", ""),
            "_tokens": tokens,
        }

    async def why_now(self, context: dict) -> dict:
        prompt = (
            f"The user is on cycle day {context.get('cycle_day')} ({context.get('cycle_phase')} phase). "
            f"Current symptom scores: {context.get('current_scores')}. "
            f"Historical averages for this phase: {context.get('historical_averages_for_phase')}.\n\n"
            f"Based ONLY on her own historical data, explain why she may be feeling this way now. "
            f"Return JSON with keys: context_text (2-3 sentences referencing 'your last N cycles'), "
            f"typical_duration_days_min (int), typical_duration_days_max (int), "
            f"historically_helpful (list of 2-3 things that helped in past cycles based on pattern)."
        )
        text, tokens = await self._generate(prompt, max_tokens=400, json_mode=True)
        data = json.loads(text)
        return {
            "context_text": data.get("context_text", ""),
            "typical_duration_days_min": int(data.get("typical_duration_days_min", 1)),
            "typical_duration_days_max": int(data.get("typical_duration_days_max", 5)),
            "historically_helpful": data.get("historically_helpful", []),
            "_tokens": tokens,
        }

    async def clinical_letter(self, context: dict) -> dict:
        prompt = (
            f"Write a clinical letter for a patient tracked {context.get('cycle_count')} cycles "
            f"({context.get('start_date')} to {context.get('end_date')}) with conditions: "
            f"{context.get('conditions')}.\n\n"
            f"DRSP luteal averages: {context.get('luteal_averages')}\n"
            f"DRSP follicular averages: {context.get('follicular_averages')}\n"
            f"C-PASS criteria met: {context.get('c_pass')}\n\n"
            f"Begin: 'I have been tracking my premenstrual symptoms using the DRSP instrument for "
            f"[tracked days] across {context.get('cycle_count')} menstrual cycles...'\n"
            f"Every data point must trace to the tracked entries. "
            f"Do NOT diagnose. Use 'consistent with' language. Maximum 400 words."
        )
        text, tokens = await self._generate(prompt, max_tokens=700)
        return {"letter_text": text, "_tokens": tokens}

    async def pattern_discovery(self, context: dict) -> dict:
        prompt = (
            f"Analyze {context.get('cycle_count')} cycles of symptom data for a patient with "
            f"conditions: {context.get('conditions')}.\n\n"
            f"Entries (cycle_day, phase, drsp scores, sleep_quality): {context.get('entries')}\n\n"
            f"Find correlations (Pearson r >= 0.6 only). Check: sleep vs severity, "
            f"consecutive day patterns, phase-specific triggers.\n\n"
            f"Return JSON with key 'patterns': list of objects each with "
            f"pattern_type, correlation_coefficient (float), cycles_analyzed (int), "
            f"description (plain language, 'associated with' not 'causes'), "
            f"confidence_note (e.g. 'Based on N cycles'). Empty list if no r>=0.6 patterns found."
        )
        text, tokens = await self._generate(prompt, max_tokens=600, json_mode=True)
        data = json.loads(text)
        return {"patterns": data.get("patterns", []), "_tokens": tokens}

    async def crisis_context(self, context: dict) -> dict:
        prompt = (
            f"The user is on cycle day {context.get('cycle_day')} ({context.get('current_phase')} phase). "
            f"Historical crisis windows from past cycles: {context.get('historical_crisis_windows')}.\n\n"
            f"Generate a grounding statement based ONLY on her own history. "
            f"Begin with: 'You've been here before.' Reference her own data. "
            f"Include how many days this level of distress has typically lasted.\n\n"
            f"Return JSON with keys: min_days (int), max_days (int), "
            f"cycles_analyzed (int), context_text (2-3 sentences, warm, factual, no cheerleading). "
            f"Always end context_text by appending: 'If you need support now, call or text 988.'"
        )
        text, tokens = await self._generate(prompt, max_tokens=300, json_mode=True)
        data = json.loads(text)
        return {
            "min_days": int(data.get("min_days", 1)),
            "max_days": int(data.get("max_days", 3)),
            "cycles_analyzed": int(data.get("cycles_analyzed", 0)),
            "context_text": data.get("context_text", ""),
            "_tokens": tokens,
        }

    async def _generate(
        self, prompt: str, max_tokens: int, json_mode: bool = False
    ) -> tuple[str, int]:
        config_kwargs: dict = {
            "system_instruction": _SYSTEM_PROMPT,
            "max_output_tokens": max_tokens,
            "http_options": types.HttpOptions(timeout=30_000),
        }
        if json_mode:
            config_kwargs["response_mime_type"] = "application/json"

        response = await self._client.aio.models.generate_content(
            model=_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(**config_kwargs),
        )
        tokens = response.usage_metadata.total_token_count or 0
        return response.text, tokens
