from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from app.database import get_session
from app.models.mood import MoodLog
from app.models.user import User
from app.auth import get_current_user
from collections import defaultdict

router = APIRouter(prefix="/mood", tags=["mood"])

class MoodCreate(BaseModel):
    score: int
    job_id: Optional[str] = None
    trigger_event: Optional[str] = "manual"
    note: Optional[str] = None

@router.post("")
def log_mood(
    body: MoodCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if not 1 <= body.score <= 5:
        raise HTTPException(status_code=400, detail="Score must be between 1 and 5")

    mood = MoodLog(
        user_id=current_user.id,
        job_id=body.job_id,
        score=body.score,
        trigger_event=body.trigger_event,
        note=body.note
    )
    session.add(mood)
    session.commit()
    session.refresh(mood)
    return mood

@router.get("/trend")
def get_mood_trend(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Get all mood logs for this user
    logs = session.exec(
        select(MoodLog)
        .where(MoodLog.user_id == current_user.id)
        .order_by(MoodLog.created_at)
    ).all()

    if not logs:
        return {
            "logs": [],
            "daily_average": [],
            "seven_day_average": None,
            "burnout_warning": False,
            "burnout_message": None,
            "total_logs": 0
        }

    # Group by day and compute daily average
    daily_scores = defaultdict(list)
    for log in logs:
        day = log.created_at.strftime("%Y-%m-%d")
        daily_scores[day].append(log.score)

    daily_average = [
        {
            "date": day,
            "avg_score": round(sum(scores) / len(scores), 2),
            "count": len(scores)
        }
        for day, scores in sorted(daily_scores.items())
    ]

    # 7-day rolling average (last 7 days only)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    recent_logs = [l for l in logs if l.created_at >= seven_days_ago]
    seven_day_avg = None
    if recent_logs:
        seven_day_avg = round(
            sum(l.score for l in recent_logs) / len(recent_logs), 2
        )

    # Burnout detection
    burnout_warning = False
    burnout_message = None

    if seven_day_avg is not None and seven_day_avg < 2.5:
        burnout_warning = True
        burnout_message = (
            f"Your average mood this week is {seven_day_avg}/5. "
            "Job searching is tough. Consider taking a short break "
            "before your next application — quality matters more than quantity."
        )
    elif seven_day_avg is not None and seven_day_avg < 3.2:
        burnout_message = (
            f"Your mood this week is {seven_day_avg}/5 — slightly below average. "
            "You're doing well. Keep going but make sure to take breaks."
        )

    # Recent logs formatted for frontend
    recent_formatted = [
        {
            "id": log.id,
            "score": log.score,
            "trigger_event": log.trigger_event,
            "note": log.note,
            "created_at": log.created_at.isoformat()
        }
        for log in logs[-10:]
    ]

    return {
        "logs": recent_formatted,
        "daily_average": daily_average,
        "seven_day_average": seven_day_avg,
        "burnout_warning": burnout_warning,
        "burnout_message": burnout_message,
        "total_logs": len(logs)
    }

@router.get("/today")
def get_today_mood(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    today_start = datetime.utcnow().replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    log = session.exec(
        select(MoodLog)
        .where(MoodLog.user_id == current_user.id)
        .where(MoodLog.created_at >= today_start)
        .order_by(MoodLog.created_at.desc())
    ).first()

    return {"logged_today": log is not None, "score": log.score if log else None}