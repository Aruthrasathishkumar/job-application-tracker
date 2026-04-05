from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, date
from enum import Enum
import uuid

class JobStatus(str, Enum):
    applied = "applied"
    screening = "screening"
    interview = "interview"
    offer = "offer"
    rejected = "rejected"

class JobSource(str, Enum):
    cold = "cold"
    linkedin = "linkedin"
    alumni = "alumni"
    referral = "referral"
    recruiter = "recruiter"

class Job(SQLModel, table=True):
    __tablename__ = "jobs"
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    company: str
    role: str
    status: JobStatus = Field(default=JobStatus.applied)
    source: JobSource = Field(default=JobSource.cold)
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    offer_received: Optional[int] = None
    jd_url: Optional[str] = None
    notes: Optional[str] = None
    deadline: Optional[date] = None
    applied_date: date = Field(default_factory=date.today)
    created_at: datetime = Field(default_factory=datetime.utcnow)