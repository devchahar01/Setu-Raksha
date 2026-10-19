import uuid
from datetime import UTC, datetime

from app.db.base import Base
from sqlalchemy import DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column


class AuditLog(Base):
    """
    Append-only audit log for every create, update, and delete operation.
    Guarantees forensic traceability with actor_id, request_id, and delta diffs.
    """

    __tablename__ = "audit_log"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    actor_id: Mapped[str | None] = mapped_column(String(36), index=True, nullable=True)
    action: Mapped[str] = mapped_column(String(50), nullable=False)  # CREATE, UPDATE, DELETE, LOGIN, APPROVE
    entity: Mapped[str] = mapped_column(String(50), index=True, nullable=False)  # Bridge, Audit, Assignment, User
    entity_id: Mapped[str | None] = mapped_column(String(36), index=True, nullable=True)
    before_state: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON snapshot
    after_state: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON snapshot
    request_id: Mapped[str | None] = mapped_column(String(100), index=True, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False
    )
