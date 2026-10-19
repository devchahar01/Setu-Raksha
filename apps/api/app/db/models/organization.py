from enum import Enum
from typing import Optional

from app.db.base import TimeStampedModel
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


class JurisdictionType(str, Enum):
    STATE = "STATE"
    DIVISION = "DIVISION"
    DISTRICT = "DISTRICT"


class Organization(TimeStampedModel):
    __tablename__ = "organizations"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    type: Mapped[str] = mapped_column(
        String(20), nullable=False, default=JurisdictionType.DISTRICT.value
    )
    parent_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("organizations.id"), nullable=True
    )

    parent: Mapped[Optional["Organization"]] = relationship(
        "Organization", remote_side="Organization.id", back_populates="children"
    )
    children: Mapped[list["Organization"]] = relationship("Organization", back_populates="parent")
