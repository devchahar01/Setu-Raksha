import logging
import math

from fastapi import Request

logger = logging.getLogger("setu.i18n")

SUPPORTED_LOCALES = ["en", "hi", "mr"]
DEFAULT_LOCALE = "en"


def get_request_locale(request: Request, user_locale: str | None = None) -> str:
    """
    Determine locale from user preference, then Accept-Language header, defaulting to 'en'.
    """
    if user_locale and user_locale in SUPPORTED_LOCALES:
        return user_locale

    accept_language = request.headers.get("Accept-Language")
    if accept_language:
        for part in accept_language.split(","):
            code = part.split(";")[0].strip().lower()[:2]
            if code in SUPPORTED_LOCALES:
                return code

    return DEFAULT_LOCALE


def calculate_sms_segments(text: str) -> dict[str, int | bool]:
    """
    Calculate SMS character count and segments.
    Standard GSM-7 allows 160 characters per segment.
    Devanagari characters (Hindi, Marathi) require UCS-2 encoding,
    which allows only 70 characters for a single segment and 67 characters per multipart segment.
    Warns if message exceeds 3 segments.
    """
    is_unicode = any(ord(char) > 127 for char in text)
    length = len(text)

    if not is_unicode:
        # GSM-7 (160 characters per single segment, 153 for concatenated)
        segments = 1 if length <= 160 else math.ceil(length / 153)
    else:
        # UCS-2 (70 characters per single segment, 67 for concatenated)
        segments = 1 if length <= 70 else math.ceil(length / 67)

    if segments > 3:
        logger.warning(
            f"SMS segment alert: Message length {length} exceeds 3 segments ({segments} segments needed). "
            "May incur high carrier delivery costs in India."
        )

    return {
        "length": length,
        "is_unicode": is_unicode,
        "segments": segments,
        "exceeds_3_segments": segments > 3,
    }
