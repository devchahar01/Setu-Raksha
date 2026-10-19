from datetime import UTC, datetime
from typing import List, Optional

from app.api.deps import get_current_user, get_db
from app.db.models.notification import AlertNotification
from app.db.models.user import User
from app.notifications.service import NotificationService
from app.schemas.notification import DispatchTestRequest, MonthEndScanResponse, NotificationOut
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(tags=["Notification Engine & Scheduler (L4)"])


@router.post(
    "/notifications/scan-month-end",
    response_model=MonthEndScanResponse,
    status_code=status.HTTP_200_OK,
    summary="Trigger month-end inspection reminder scan across all jurisdiction bridges",
)
async def trigger_month_end_scan(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MonthEndScanResponse:
    now = datetime.now(UTC)
    dispatched = await NotificationService.scan_month_end_reminders(db, now)
    return MonthEndScanResponse(
        period=now.strftime("%Y-%m"),
        alerts_dispatched=len(dispatched),
        source_label="source=simulated",
    )


@router.post(
    "/notifications/dispatch",
    response_model=NotificationOut,
    status_code=status.HTTP_201_CREATED,
    summary="Dispatch an ad-hoc emergency alert notification via Email or SMS",
)
async def dispatch_alert(
    payload: DispatchTestRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AlertNotification:
    return await NotificationService.dispatch_notification(
        db=db,
        recipient=payload.recipient,
        channel=payload.channel,
        language=payload.language,
        tier=payload.tier,
        subject=payload.subject,
        body=payload.body,
        bridge_id=payload.bridge_id,
    )


@router.get(
    "/notifications/history",
    response_model=List[NotificationOut],
    summary="View outbound alert dispatch audit history",
)
async def get_notification_history(
    bridge_id: Optional[str] = Query(None, description="Filter by bridge ID"),
    limit: int = Query(50, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[AlertNotification]:
    stmt = select(AlertNotification).order_by(desc(AlertNotification.dispatched_at)).limit(limit)
    if bridge_id:
        stmt = stmt.where(AlertNotification.bridge_id == bridge_id)
    res = await db.execute(stmt)
    return list(res.scalars().all())
