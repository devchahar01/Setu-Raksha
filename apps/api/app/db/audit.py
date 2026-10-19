import json
from typing import Any

from app.db.models.audit_log import AuditLog
from sqlalchemy.ext.asyncio import AsyncSession


async def log_audit_event(
    db: AsyncSession,
    action: str,
    entity: str,
    entity_id: str | None = None,
    actor_id: str | None = None,
    request_id: str | None = None,
    before: dict[str, Any] | None = None,
    after: dict[str, Any] | None = None,
) -> AuditLog:
    """Record an append-only audit log entry."""
    entry = AuditLog(
        action=action,
        entity=entity,
        entity_id=entity_id,
        actor_id=actor_id,
        request_id=request_id,
        before_state=json.dumps(before, default=str) if before else None,
        after_state=json.dumps(after, default=str) if after else None,
    )
    db.add(entry)
    await db.flush()
    return entry
