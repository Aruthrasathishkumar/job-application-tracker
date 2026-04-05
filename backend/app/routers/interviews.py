from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from app.database import get_session
from app.models.interview import InterviewNote
from app.models.job import Job
from app.models.user import User
from app.auth import get_current_user

router = APIRouter(prefix="/interviews", tags=["interviews"])

class InterviewCreate(BaseModel):
    job_id: str
    round: Optional[str] = None
    questions_asked: Optional[str] = None
    my_answers: Optional[str] = None
    weak_spots: Optional[str] = None
    went_well: Optional[str] = None
    interviewer_name: Optional[str] = None
    interview_date: Optional[date] = None

class InterviewUpdate(BaseModel):
    round: Optional[str] = None
    questions_asked: Optional[str] = None
    my_answers: Optional[str] = None
    weak_spots: Optional[str] = None
    went_well: Optional[str] = None
    interviewer_name: Optional[str] = None
    interview_date: Optional[date] = None

@router.get("")
def get_all_interviews(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    notes = session.exec(
        select(InterviewNote)
        .where(InterviewNote.user_id == current_user.id)
        .order_by(InterviewNote.created_at.desc())
    ).all()

    # Enrich with job info
    result = []
    for note in notes:
        job = session.get(Job, note.job_id)
        result.append({
            "id": note.id,
            "job_id": note.job_id,
            "company": job.company if job else "Unknown",
            "role": job.role if job else "Unknown",
            "round": note.round,
            "questions_asked": note.questions_asked,
            "my_answers": note.my_answers,
            "weak_spots": note.weak_spots,
            "went_well": note.went_well,
            "interviewer_name": note.interviewer_name,
            "interview_date": note.interview_date,
            "created_at": note.created_at,
        })
    return result

@router.get("/job/{job_id}")
def get_interviews_for_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    notes = session.exec(
        select(InterviewNote)
        .where(InterviewNote.job_id == job_id)
        .where(InterviewNote.user_id == current_user.id)
        .order_by(InterviewNote.created_at.desc())
    ).all()
    return notes

@router.post("")
def create_interview(
    body: InterviewCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Verify this job belongs to the user
    job = session.get(Job, body.job_id)
    if not job or job.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Job not found")

    note = InterviewNote(
        user_id=current_user.id,
        **body.model_dump(exclude_none=True)
    )
    session.add(note)
    session.commit()
    session.refresh(note)
    return note

@router.patch("/{note_id}")
def update_interview(
    note_id: str,
    body: InterviewUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    note = session.get(InterviewNote, note_id)
    if not note or note.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Note not found")

    update_data = body.model_dump(exclude_none=True)
    update_data["updated_at"] = datetime.utcnow()
    for key, value in update_data.items():
        setattr(note, key, value)

    session.commit()
    session.refresh(note)
    return note

@router.delete("/{note_id}")
def delete_interview(
    note_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    note = session.get(InterviewNote, note_id)
    if not note or note.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Note not found")
    session.delete(note)
    session.commit()
    return {"message": "Deleted"}

@router.get("/search")
def search_interviews(
    q: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Simple case-insensitive search across all text fields
    all_notes = session.exec(
        select(InterviewNote)
        .where(InterviewNote.user_id == current_user.id)
    ).all()

    q_lower = q.lower()
    results = []
    for note in all_notes:
        job = session.get(Job, note.job_id)
        searchable = " ".join(filter(None, [
            note.questions_asked or "",
            note.my_answers or "",
            note.weak_spots or "",
            note.went_well or "",
            note.round or "",
            note.interviewer_name or "",
            job.company if job else "",
            job.role if job else "",
        ])).lower()

        if q_lower in searchable:
            results.append({
                "id": note.id,
                "job_id": note.job_id,
                "company": job.company if job else "Unknown",
                "role": job.role if job else "Unknown",
                "round": note.round,
                "questions_asked": note.questions_asked,
                "my_answers": note.my_answers,
                "weak_spots": note.weak_spots,
                "went_well": note.went_well,
                "interviewer_name": note.interviewer_name,
                "interview_date": note.interview_date,
                "created_at": note.created_at,
            })
    return results