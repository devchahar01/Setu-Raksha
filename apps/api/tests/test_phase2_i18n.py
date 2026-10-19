import pytest
from app.core.i18n import calculate_sms_segments


def test_sms_segmentation_gsm7() -> None:
    """Test standard ASCII/GSM-7 SMS character counting."""
    msg = "Bridge MH-PUN-001 Good Tier."
    res = calculate_sms_segments(msg)
    assert res["is_unicode"] is False
    assert res["segments"] == 1
    assert res["exceeds_3_segments"] is False


def test_sms_segmentation_devanagari_unicode() -> None:
    """Test Devanagari SMS character counting with UCS-2 encoding."""
    devanagari_msg = "सेतु रक्षा: पुल संख्या MH-PUN-001 सुरक्षित स्तर पर है।"
    res = calculate_sms_segments(devanagari_msg)
    assert res["is_unicode"] is True
    assert res["segments"] == 1
    assert res["exceeds_3_segments"] is False


def test_sms_segmentation_exceeding_3_segments() -> None:
    """Test long Devanagari message exceeding 3 segments generates warning flag."""
    long_devanagari_msg = "सेतु रक्षा अवसंरचना सुरक्षा सूचना: " * 15 # > 210 chars
    res = calculate_sms_segments(long_devanagari_msg)
    assert res["is_unicode"] is True
    assert res["segments"] > 3
    assert res["exceeds_3_segments"] is True
