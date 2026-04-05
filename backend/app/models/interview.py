from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, date
import uuid

class InterviewNote(SQLModel, table=True):
    __tablename__ = "interview_notes"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True
    )
    job_id: str = Field(foreign_key="jobs.id")
    user_id: str = Field(foreign_key="users.id")
    round: Optional[str] = None
    questions_asked: Optional[str] = None
    my_answers: Optional[str] = None
    weak_spots: Optional[str] = None
    went_well: Optional[str] = None
    interviewer_name: Optional[str] = None
    interview_date: Optional[date] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)