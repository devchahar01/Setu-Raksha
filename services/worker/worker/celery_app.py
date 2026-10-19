"""
Setu Raksha - Celery Worker & Beat Scheduler Configuration (Phase 0)
Configured with Asia/Kolkata timezone and idempotent task patterns.
"""
import os
from celery import Celery

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "setu_worker",
    broker=REDIS_URL,
    backend=REDIS_URL,
)

celery_app.conf.update(
    timezone="Asia/Kolkata",
    enable_utc=True,
    task_track_started=True,
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    result_expires=86400,
    broker_connection_retry_on_startup=True,
)


@celery_app.task(name="tasks.health_check", bind=True)
def worker_health_check(self) -> dict[str, str]:
    return {"status": "healthy", "worker": "setu_worker", "task_id": self.request.id}
