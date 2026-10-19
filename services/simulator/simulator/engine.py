"""
Setu Raksha - Telemetry Scenario Engine (Phase 4)
Generates physically realistic synthetic IoT telemetry curves for:
1. Monsoon Flash Flood Hydrograph (Water Level + Rain Gauge)
2. Schoharie Creek Scour-Driven Pier Tilt (Inclinometer)
3. Heavy Overload & Resonant Vibration (Accelerometer)
"""
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
import math
from typing import Any, Dict, List


@dataclass
class TelemetryFrame:
    sensor_id: str
    bridge_id: str
    ts: datetime
    value: float
    unit: str
    quality: str
    source: str = "simulated"


class ScenarioEngine:
    """Generates synthetic telemetry time-series for stress testing and early warning validation."""

    @staticmethod
    def generate_monsoon_flash_flood(
        bridge_id: str,
        water_sensor_id: str,
        rain_sensor_id: str,
        base_hfl_m: float = 540.0,
        start_time: datetime | None = None,
        duration_hours: int = 12,
        interval_minutes: int = 15,
    ) -> List[Dict[str, Any]]:
        """
        Simulates sudden intense monsoon downpour causing severe hydrograph rise.
        Peak occurs at t = duration / 2.
        """
        start = start_time or (datetime.now(UTC) - timedelta(hours=duration_hours))
        total_steps = int((duration_hours * 60) / interval_minutes)
        readings: List[Dict[str, Any]] = []

        base_water_level = base_hfl_m - 6.0  # safe dry/early level

        for step in range(total_steps):
            current_time = start + timedelta(minutes=step * interval_minutes)
            t_ratio = step / total_steps

            # Rain gauge: peaks at 0.35 into storm (e.g., 95 mm/hr cloudburst)
            rain_peak = math.exp(-((t_ratio - 0.35) ** 2) / 0.02)
            rain_rate = round(5.0 + 90.0 * rain_peak, 2)

            # Water level: lag behind rain peak, peaks at 0.65 into storm, reaching 1.2m above HFL
            water_peak = math.exp(-((t_ratio - 0.65) ** 2) / 0.04)
            water_level = round(base_water_level + 7.5 * water_peak, 3)

            readings.append({
                "sensor_id": rain_sensor_id,
                "bridge_id": bridge_id,
                "ts": current_time.isoformat(),
                "value": rain_rate,
                "unit": "mm/h",
                "quality": "GOOD",
                "source": "simulated",
            })

            readings.append({
                "sensor_id": water_sensor_id,
                "bridge_id": bridge_id,
                "ts": current_time.isoformat(),
                "value": water_level,
                "unit": "m",
                "quality": "GOOD",
                "source": "simulated",
            })

        return readings

    @staticmethod
    def generate_scour_pier_tilt(
        bridge_id: str,
        inclinometer_sensor_id: str,
        start_time: datetime | None = None,
        duration_hours: int = 48,
        interval_minutes: int = 30,
    ) -> List[Dict[str, Any]]:
        """
        Simulates foundation riprap failure & scour undermining causing pier rotation.
        Tilt gradually increases from 0.05° to 2.85° (exceeding critical 1.5° limit).
        """
        start = start_time or (datetime.now(UTC) - timedelta(hours=duration_hours))
        total_steps = int((duration_hours * 60) / interval_minutes)
        readings: List[Dict[str, Any]] = []

        for step in range(total_steps):
            current_time = start + timedelta(minutes=step * interval_minutes)
            # Exponential progressive tilting curve
            progress = step / total_steps
            tilt = 0.05 + 2.80 * (progress ** 2.2)
            # add minor sensor noise +/- 0.02
            noise = 0.01 * math.sin(step)
            tilt_val = round(tilt + noise, 3)

            readings.append({
                "sensor_id": inclinometer_sensor_id,
                "bridge_id": bridge_id,
                "ts": current_time.isoformat(),
                "value": tilt_val,
                "unit": "deg",
                "quality": "GOOD",
                "source": "simulated",
            })

        return readings
