import asyncio
import hashlib
import json
from datetime import UTC, datetime
from typing import AsyncGenerator, List, Optional

from app.api.deps import get_current_user, get_db
from app.core.errors import NotFoundException
from app.db.models.bridge import Bridge
from app.db.models.telemetry import Sensor, TelemetryReading
from app.db.models.user import User
from app.schemas.telemetry import (
    SensorCreate,
    SensorResponse,
    TelemetryBatchCreate,
    TelemetryReadingResponse,
    TelemetrySummary,
)
from fastapi import APIRouter, Depends, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(tags=["Telemetry & Real-Time Monitoring (L3)"])


def evaluate_anomaly(reading_type: str, value: float, bridge: Optional[Bridge] = None) -> bool:
    """Evaluates threshold-based anomaly rules based on bridge design parameters."""
    val = abs(value)
    if reading_type == "PIER_INCLINOMETER":
        return val >= 1.0  # >= 1.0 degree tilt is anomalous for bridge piers
    elif reading_type == "WATER_LEVEL":
        if bridge and bridge.design_hfl_m:
            return value >= (bridge.design_hfl_m - 1.0)  # within 1m of High Flood Level
        return val >= 15.0  # generic threshold if no HFL
    elif reading_type == "ACCELEROMETER":
        return val >= 2.5  # 2.5 m/s² high vibration
    elif reading_type == "RAIN_GAUGE":
        return val >= 50.0  # > 50 mm/hr heavy rainfall
    return False


@router.post(
    "/telemetry/sensors",
    response_model=SensorResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a structural or hydrological sensor",
)
async def register_sensor(
    sensor_in: SensorCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Sensor:
    # Verify bridge exists
    bridge = await db.get(Bridge, sensor_in.bridge_id)
    if not bridge:
        raise NotFoundException("Bridge not found", params={"bridge_id": sensor_in.bridge_id})

    key_hash = hashlib.sha256(sensor_in.api_key.encode("utf-8")).hexdigest()
    sensor = Sensor(
        bridge_id=sensor_in.bridge_id,
        type=sensor_in.type,
        location_on_structure=sensor_in.location_on_structure,
        unit=sensor_in.unit,
        calibration_metadata=sensor_in.calibration_metadata,
        key_hash=key_hash,
        state="HEALTHY",
    )
    db.add(sensor)
    await db.commit()
    await db.refresh(sensor)
    return sensor


@router.get(
    "/bridges/{bridge_id}/sensors",
    response_model=List[SensorResponse],
    summary="List all sensors installed on a bridge",
)
async def list_sensors(
    bridge_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[Sensor]:
    res = await db.execute(select(Sensor).where(Sensor.bridge_id == bridge_id))
    return list(res.scalars().all())


@router.post(
    "/telemetry/readings",
    response_model=List[TelemetryReadingResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Batch ingest telemetry readings with automated anomaly detection",
)
async def ingest_readings(
    payload: TelemetryBatchCreate,
    db: AsyncSession = Depends(get_db),
) -> List[TelemetryReading]:
    saved_readings: List[TelemetryReading] = []
    now = datetime.now(UTC)

    # Cache bridges and sensors to minimize queries
    sensor_cache: dict[str, Sensor] = {}
    bridge_cache: dict[str, Bridge] = {}

    for item in payload.readings:
        if item.sensor_id not in sensor_cache:
            sensor = await db.get(Sensor, item.sensor_id)
            if sensor:
                sensor_cache[item.sensor_id] = sensor

        sensor = sensor_cache.get(item.sensor_id)
        bridge = None
        if item.bridge_id not in bridge_cache:
            bridge = await db.get(Bridge, item.bridge_id)
            if bridge:
                bridge_cache[item.bridge_id] = bridge
        else:
            bridge = bridge_cache[item.bridge_id]

        sensor_type = sensor.type if sensor else "UNKNOWN"
        is_anomaly = evaluate_anomaly(sensor_type, item.value, bridge)

        reading = TelemetryReading(
            sensor_id=item.sensor_id,
            bridge_id=item.bridge_id,
            ts=item.ts or now,
            value=item.value,
            unit=item.unit,
            quality=item.quality,
            source="simulated",  # honest labeling
            is_anomaly=is_anomaly,
        )
        db.add(reading)
        saved_readings.append(reading)

        if sensor:
            sensor.last_reading_at = reading.ts
            sensor.state = "HEALTHY"

    await db.commit()
    for r in saved_readings:
        await db.refresh(r)
    return saved_readings


@router.get(
    "/bridges/{bridge_id}/telemetry",
    response_model=List[TelemetryReadingResponse],
    summary="Query recent telemetry readings for a bridge",
)
async def get_bridge_telemetry(
    bridge_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    sensor_type: Optional[str] = Query(None, description="Filter by sensor type"),
    limit: int = Query(100, ge=1, le=1000),
) -> List[TelemetryReading]:
    stmt = (
        select(TelemetryReading)
        .where(TelemetryReading.bridge_id == bridge_id)
        .order_by(desc(TelemetryReading.ts))
        .limit(limit)
    )
    if sensor_type:
        stmt = stmt.join(Sensor, TelemetryReading.sensor_id == Sensor.id).where(Sensor.type == sensor_type)

    res = await db.execute(stmt)
    return list(res.scalars().all())


@router.get(
    "/bridges/{bridge_id}/telemetry/summary",
    response_model=TelemetrySummary,
    summary="Get telemetry summary and anomaly statistics for a bridge",
)
async def get_telemetry_summary(
    bridge_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TelemetrySummary:
    sensors_res = await db.execute(select(Sensor).where(Sensor.bridge_id == bridge_id))
    sensors = list(sensors_res.scalars().all())

    readings_res = await db.execute(
        select(TelemetryReading)
        .where(TelemetryReading.bridge_id == bridge_id)
        .order_by(desc(TelemetryReading.ts))
        .limit(20)
    )
    latest_readings = list(readings_res.scalars().all())
    anomalies = sum(1 for r in latest_readings if r.is_anomaly)

    return TelemetrySummary(
        bridge_id=bridge_id,
        sensor_count=len(sensors),
        latest_readings=[TelemetryReadingResponse.model_validate(r) for r in latest_readings],
        anomalies_detected=anomalies,
        source_label="source=simulated",
    )


@router.get(
    "/bridges/{bridge_id}/telemetry/stream",
    summary="Real-time Server-Sent Events (SSE) telemetry stream",
)
async def stream_bridge_telemetry(
    bridge_id: str,
    db: AsyncSession = Depends(get_db),
) -> StreamingResponse:
    """Streams live telemetry data to browser dashboards using SSE."""
    async def event_generator() -> AsyncGenerator[str, None]:
        # Send initial connection event
        yield f"data: {json.dumps({'status': 'connected', 'bridge_id': bridge_id, 'source': 'simulated'})}\n\n"
        for _ in range(5):  # Emit 5 sample live frames
            await asyncio.sleep(1)
            # Fetch latest 2 readings
            stmt = (
                select(TelemetryReading)
                .where(TelemetryReading.bridge_id == bridge_id)
                .order_by(desc(TelemetryReading.ts))
                .limit(2)
            )
            res = await db.execute(stmt)
            readings = list(res.scalars().all())
            payload = [
                {
                    "id": r.id,
                    "sensor_id": r.sensor_id,
                    "ts": r.ts.isoformat(),
                    "value": r.value,
                    "unit": r.unit,
                    "is_anomaly": r.is_anomaly,
                    "source": "simulated",
                }
                for r in readings
            ]
            yield f"data: {json.dumps(payload)}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
