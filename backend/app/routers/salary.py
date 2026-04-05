from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.database import get_session
from app.models.job import Job
from app.models.user import User
from app.auth import get_current_user
import statistics

router = APIRouter(prefix="/salary", tags=["salary"])

@router.get("/analysis")
def get_salary_analysis(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    jobs = session.exec(
        select(Job).where(Job.user_id == current_user.id)
    ).all()

    # Jobs with salary data
    jobs_with_salary = [
        j for j in jobs
        if j.salary_min is not None or j.salary_max is not None
    ]

    # Jobs with actual offers
    jobs_with_offers = [
        j for j in jobs
        if j.offer_received is not None
    ]

    if not jobs_with_salary:
        return {
            "has_data": False,
            "message": "Add salary ranges to your job applications to unlock insights"
        }

    # Collect all salary midpoints for analysis
    midpoints = []
    for j in jobs_with_salary:
        if j.salary_min and j.salary_max:
            midpoints.append((j.salary_min + j.salary_max) / 2)
        elif j.salary_min:
            midpoints.append(j.salary_min)
        elif j.salary_max:
            midpoints.append(j.salary_max)

    median_target = statistics.median(midpoints) if midpoints else 0
    mean_target   = statistics.mean(midpoints)   if midpoints else 0
    min_target    = min(midpoints) if midpoints else 0
    max_target    = max(midpoints) if midpoints else 0

    # Per-job salary breakdown
    job_breakdown = []
    for j in jobs_with_salary:
        midpoint = None
        if j.salary_min and j.salary_max:
            midpoint = (j.salary_min + j.salary_max) / 2
        elif j.salary_min:
            midpoint = j.salary_min
        elif j.salary_max:
            midpoint = j.salary_max

        # Percentile position of this job vs all targets
        percentile = None
        if midpoint and midpoints:
            below = sum(1 for m in midpoints if m < midpoint)
            percentile = round(below / len(midpoints) * 100)

        # Counter-offer logic
        counter_offer = None
        negotiation_note = None
        if j.offer_received:
            if j.offer_received < median_target * 0.90:
                counter_offer = round(median_target * 1.05)
                negotiation_note = "Below market median — strong case to negotiate up"
            elif j.offer_received < median_target:
                counter_offer = round(j.offer_received * 1.08)
                negotiation_note = "Slightly below median — reasonable to counter"
            else:
                negotiation_note = "At or above market median — strong offer"

        job_breakdown.append({
            "id": j.id,
            "company": j.company,
            "role": j.role,
            "status": j.status.value,
            "salary_min": j.salary_min,
            "salary_max": j.salary_max,
            "midpoint": midpoint,
            "offer_received": j.offer_received,
            "percentile": percentile,
            "counter_offer": counter_offer,
            "negotiation_note": negotiation_note,
        })

    # Offer analysis
    offer_analysis = None
    if jobs_with_offers:
        offer_amounts = [j.offer_received for j in jobs_with_offers]
        best_offer    = max(offer_amounts)
        percentile_of_best = round(
            sum(1 for m in midpoints if m < best_offer) / len(midpoints) * 100
        ) if midpoints else None

        offer_analysis = {
            "count":             len(jobs_with_offers),
            "best_offer":        best_offer,
            "avg_offer":         round(statistics.mean(offer_amounts)),
            "percentile_of_best": percentile_of_best,
        }

    return {
        "has_data": True,
        "summary": {
            "total_with_salary": len(jobs_with_salary),
            "median_target":     round(median_target),
            "mean_target":       round(mean_target),
            "min_target":        round(min_target),
            "max_target":        round(max_target),
        },
        "job_breakdown":  sorted(job_breakdown, key=lambda x: x["midpoint"] or 0, reverse=True),
        "offer_analysis": offer_analysis,
    }