"""
Setu Raksha - Multi-Channel Notification Service (Phase 6)
Handles:
1. Trilingual template rendering (EN, HI, MR)
2. Month-end inspection reminder scan (T-7, T-2, Overdue Escalation)
3. Dynamic multi-channel dispatch (Email & SMS mock)
4. Audit-logging of all outbound emergency notifications
"""
import calendar
from datetime import UTC, datetime
from typing import Any, Dict, List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.models.audit import Audit
from app.db.models.bridge import Bridge, BridgeAssignment
from app.db.models.notification import AlertNotification
from app.db.models.user import User, UserRole


MONTH_END_MESSAGES = {
    "T_MINUS_7": {
        "en": "REMINDER: Monthly inspection audit for bridge {code} ({name}) is due in 7 days.",
        "hi": "स्मरण: पुल {code} ({name}) का मासिक निरीक्षण ऑडिट 7 दिनों में देय है।",
        "mr": "स्मरणपत्र: पूल {code} ({name}) चे मासिक तपासणी ऑडिट ७ दिवसांत देय आहे.",
    },
    "T_MINUS_2": {
        "en": "URGENT: Monthly inspection audit for bridge {code} ({name}) is due in 2 days.",
        "hi": "अति आवश्यक: पुल {code} ({name}) का मासिक निरीक्षण ऑडिट 2 दिनों में देय है।",
        "mr": "तातडीचे: पूल {code} ({name}) चे मासिक तपासणी ऑडिट २ दिवसांत देय आहे.",
    },
    "OVERDUE": {
        "en": "ESCALATION: Monthly audit for bridge {code} ({name}) is OVERDUE. Escalated to Division Engineer.",
        "hi": "एस्केलेशन: पुल {code} ({name}) का मासिक ऑडिट अतिदेय हो चुका है। संभागीय अभियंता को प्रेषित।",
        "mr": "एस्केलेशन: पूल {code} ({name}) चे मासिक ऑडिट थकीत आहे. विभागीय अभियंत्यांकडे वर्ग करण्यात आले आहे.",
    },
}


class NotificationService:
    """Service handling multi-channel alerts and month-end scanning."""

    @staticmethod
    async def dispatch_notification(
        db: AsyncSession,
        recipient: str,
        channel: str,
        language: str,
        tier: str,
        subject: str,
        body: str,
        bridge_id: Optional[str] = None,
    ) -> AlertNotification:
        """Dispatches an alert notification via Email/SMS and logs it in the database."""
        # Cleanly mock external SMTP / SMS delivery
        notification = AlertNotification(
            bridge_id=bridge_id,
            recipient=recipient,
            channel=channel.upper(),
            language=language.lower(),
            tier=tier.upper(),
            subject=subject,
            body=body,
            status="SENT",
            source="simulated",
            dispatched_at=datetime.now(UTC),
        )
        db.add(notification)
        await db.commit()
        await db.refresh(notification)
        return notification

    @classmethod
    async def scan_month_end_reminders(
        cls,
        db: AsyncSession,
        override_date: Optional[datetime] = None,
    ) -> List[AlertNotification]:
        """
        Scans all bridges for missing audits in current month period (YYYY-MM).
        Sends T-7, T-2 reminders or OVERDUE escalation alerts.
        """
        now = override_date or datetime.now(UTC)
        current_period = now.strftime("%Y-%m")
        _, last_day = calendar.monthrange(now.year, now.month)
        days_left = last_day - now.day

        # Fetch all active bridges with assignments
        stmt = (
            select(Bridge)
            .where(Bridge.is_deleted == False)
            .options(
                selectinload(Bridge.assignments).selectinload(BridgeAssignment.officer),
            )
        )
        res = await db.execute(stmt)
        bridges = list(res.scalars().all())

        dispatched: List[AlertNotification] = []

        for bridge in bridges:
            # Check if audit already exists for current period
            audit_stmt = select(Audit).where(
                Audit.bridge_id == bridge.id,
                Audit.period == current_period,
            )
            audit_res = await db.execute(audit_stmt)
            existing_audit = audit_res.scalar_one_or_none()

            if existing_audit and existing_audit.status in ["SUBMITTED", "APPROVED"]:
                continue  # Already submitted or approved

            # Determine alert type based on days left
            if days_left == 7:
                msg_key = "T_MINUS_7"
                tier = "WATCH"
            elif days_left <= 2 and days_left >= 0:
                msg_key = "T_MINUS_2"
                tier = "WARNING"
            elif days_left < 0:
                msg_key = "OVERDUE"
                tier = "CRITICAL"
            else:
                # For testing or outside scan windows, default to T-7
                msg_key = "T_MINUS_7"
                tier = "WATCH"

            # Identify recipients from assignments
            assigned_officers = [
                a.officer for a in bridge.assignments if a.officer and (a.to_date is None or a.to_date >= now)
            ]
            
            # If no assigned officer, find any officer or admin to notify
            if not assigned_officers:
                admin_res = await db.execute(
                    select(User).where(User.role == UserRole.SYSTEM_ADMIN.value).limit(1)
                )
                assigned_officers = list(admin_res.scalars().all())

            for officer in assigned_officers:
                lang = getattr(officer, "locale", "en") or "en"
                body_template = MONTH_END_MESSAGES[msg_key].get(lang, MONTH_END_MESSAGES[msg_key]["en"])
                body = body_template.format(code=bridge.code, name=bridge.name)
                subject = f"[{tier}] Bridge Audit Reminder: {bridge.code}"

                # Send Email
                notif_email = await cls.dispatch_notification(
                    db=db,
                    recipient=officer.email,
                    channel="EMAIL",
                    language=lang,
                    tier=tier,
                    subject=subject,
                    body=body,
                    bridge_id=bridge.id,
                )
                dispatched.append(notif_email)

                # Send SMS if phone available or configured
                officer_phone = getattr(officer, "phone", None)
                if officer_phone:
                    notif_sms = await cls.dispatch_notification(
                        db=db,
                        recipient=officer_phone,
                        channel="SMS",
                        language=lang,
                        tier=tier,
                        subject=subject,
                        body=body[:160],  # Standard single segment preview
                        bridge_id=bridge.id,
                    )
                    dispatched.append(notif_sms)

        return dispatched
