from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import uuid

class MoodLog(SQLModel, table=True):
    __tablename__ = "mood_logs"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True
    )
    user_id: str = Field(foreign_key="users.id")
    job_id: Optional[str] = Field(default=None, foreign_key="jobs.id")
    score: int                    # 1–5
    trigger_event: Optional[str] = None   # "status_change", "manual", "rejection"
    note: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)