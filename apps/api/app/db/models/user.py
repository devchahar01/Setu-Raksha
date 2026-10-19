from enum import Enum

from app.db.base import TimeStampedModel
from app.db.models.organization import Organization
from sqlalchemy import Boolean, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


class UserRole(str, Enum):
    CITIZEN = "CITIZEN"
    PROJECT_OFFICER = "PROJECT_OFFICER"
    DIVISION_ENGINEER = "DIVISION_ENGINEER"
    STATE_ANALYST = "STATE_ANALYST"
    SYSTEM_ADMIN = "SYSTEM_ADMIN"


class User(TimeStampedModel):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(30), nullable=False, default=UserRole.PROJECT_OFFICER.value)
    jurisdiction_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("organizations.id"), nullable=True)
    locale: Mapped[str] = mapped_column(String(10), default="en", nullable=False)
    channels: Mapped[str] = mapped_column(String(100), default="email,in_app", nullable=False)
    quiet_hours: Mapped[str | None] = mapped_column(String(50), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    jurisdiction: Mapped[Organization | None] = relationship("Organization")
