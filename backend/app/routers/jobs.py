from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import Optional
from datetime import date
from app.database import get_session
from app.models.job import Job, JobStatus, JobSource
from app.models.user import User
from app.auth import get_current_user

router = APIRouter(prefix="/jobs", tags=["jobs"])

class JobCreate(BaseModel):
    company: str
    role: str
    status: JobStatus = JobStatus.applied
    source: JobSource = JobSource.cold
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    jd_url: Optional[str] = None
    notes: Optional[str] = None
    deadline: Optional[date] = None

class JobUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    status: Optional[JobStatus] = None
    source: Optional[JobSource] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    offer_received: Optional[int] = None
    jd_url: Optional[str] = None
    notes: Optional[str] = None
    deadline: Optional[date] = None

@router.get("")
def get_jobs(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    jobs = session.exec(
        select(Job)
        .where(Job.user_id == current_user.id)
        .order_by(Job.created_at.desc())
    ).all()
    return jobs

@router.post("")
def create_job(
    body: JobCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    job = Job(
        user_id=current_user.id,
        **body.model_dump(exclude_none=True)
    )
    session.add(job)
    session.commit()
    session.refresh(job)
    return job

@router.patch("/{job_id}")
def update_job(
    job_id: str,
    body: JobUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    job = session.get(Job, job_id)
    if not job or job.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Job not found")
    update_data = body.model_dump(exclude_none=True)
    for key, value in update_data.items():
        setattr(job, key, value)
    session.commit()
    session.refresh(job)
    return job

@router.delete("/{job_id}")
def delete_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    job = session.get(Job, job_id)
    if not job or job.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Job not found")
    session.delete(job)
    session.commit()
    return {"message": "Deleted"}

from fastapi.responses import StreamingResponse
import csv
import io

@router.get("/export/csv")
def export_csv(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    jobs = session.exec(
        select(Job)
        .where(Job.user_id == current_user.id)
        .order_by(Job.created_at.desc())
    ).all()

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "Company", "Role", "Status", "Source",
        "Salary Min", "Salary Max", "Offer Received",
        "Applied Date", "Deadline", "JD URL", "Notes"
    ])

    for job in jobs:
        writer.writerow([
            job.company,
            job.role,
            job.status.value,
            job.source.value,
            job.salary_min or "",
            job.salary_max or "",
            job.offer_received or "",
            job.applied_date,
            job.deadline or "",
            job.jd_url or "",
            job.notes or "",
        ])

    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=job_applications.csv"}
    )