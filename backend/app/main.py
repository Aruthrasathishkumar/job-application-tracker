from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db_and_tables
from app.models import user, job, mood, interview
from app.routers import auth, jobs, analytics
from app.routers import mood as mood_router
from app.routers import interviews as interviews_router
from app.routers import salary as salary_router

app = FastAPI(title="Job Tracker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://localhost:\d+|http://127\.0\.0\.1:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(analytics.router)
app.include_router(mood_router.router)
app.include_router(interviews_router.router)
app.include_router(salary_router.router)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def root():
    return {"message": "Job Tracker API is running", "status": "ok"}

@app.get("/health")
def health():
    return {"status": "healthy"}