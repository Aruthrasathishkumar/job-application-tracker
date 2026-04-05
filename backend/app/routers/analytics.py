from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.database import get_session
from app.models.job import Job
from app.models.user import User
from app.auth import get_current_user
from collections import defaultdict

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/sources")
def get_source_analytics(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    jobs = session.exec(
        select(Job).where(Job.user_id == current_user.id)
    ).all()

    # Build per-source breakdown
    source_data = defaultdict(lambda: {
        "source": "",
        "total": 0,
        "applied": 0,
        "screening": 0,
        "interview": 0,
        "offer": 0,
        "rejected": 0,
        "conversion_rate": 0.0
    })

    for job in jobs:
        source = job.source.value
        status = job.status.value
        source_data[source]["source"] = source
        source_data[source]["total"] += 1
        source_data[source][status] += 1

    # Calculate conversion rate per source (offer / total * 100)
    for source in source_data:
        total = source_data[source]["total"]
        offers = source_data[source]["offer"]
        interviews = source_data[source]["interview"]
        source_data[source]["conversion_rate"] = round(
            (offers / total * 100) if total > 0 else 0, 1
        )
        source_data[source]["interview_rate"] = round(
            ((interviews + offers) / total * 100) if total > 0 else 0, 1
        )

    total = len(jobs)

    # Overall funnel stages
    overall_funnel = [
        {"stage": "Applied",   "count": total},
        {"stage": "Screening", "count": sum(1 for j in jobs if j.status.value in ["screening","interview","offer"])},
        {"stage": "Interview", "count": sum(1 for j in jobs if j.status.value in ["interview","offer"])},
        {"stage": "Offer",     "count": sum(1 for j in jobs if j.status.value == "offer")},
    ]

    return {
        "by_source": list(source_data.values()),
        "overall_funnel": overall_funnel,
        "summary": {
            "total":         total,
            "got_screening": sum(1 for j in jobs if j.status.value not in ["applied","rejected"]),
            "got_interview": sum(1 for j in jobs if j.status.value in ["interview","offer"]),
            "got_offer":     sum(1 for j in jobs if j.status.value == "offer"),
            "rejected":      sum(1 for j in jobs if j.status.value == "rejected"),
        }
    }