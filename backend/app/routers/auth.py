import re
import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel
from app.database import get_session
from app.models.user import User
from app.auth import hash_password, verify_password, create_token, get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])

EMAIL_RE = re.compile(r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$')

class RegisterRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    success: bool
    message: str
    token: str
    user_id: str
    email: str

class MeResponse(BaseModel):
    success: bool
    user_id: str
    email: str

@router.post("/register", response_model=AuthResponse)
def register(body: RegisterRequest, session: Session = Depends(get_session)):
    email = body.email.strip().lower()
    password = body.password

    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    if not EMAIL_RE.match(email):
        raise HTTPException(status_code=400, detail="Please enter a valid email address")
    if not password or len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    try:
        existing = session.exec(
            select(User).where(User.email == email)
        ).first()
        if existing:
            raise HTTPException(status_code=409, detail="An account with this email already exists")

        user = User(
            email=email,
            password_hash=hash_password(password)
        )
        session.add(user)
        session.commit()
        session.refresh(user)

        logger.info(f"User registered: {email}")

        return AuthResponse(
            success=True,
            message="Account created successfully",
            token=create_token(user.id),
            user_id=user.id,
            email=user.email
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration failed for {email}: {str(e)}")
        session.rollback()
        raise HTTPException(status_code=500, detail="Registration failed. Please try again.")

@router.post("/login", response_model=AuthResponse)
def login(body: LoginRequest, session: Session = Depends(get_session)):
    email = body.email.strip().lower()
    password = body.password

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    try:
        user = session.exec(
            select(User).where(User.email == email)
        ).first()

        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        logger.info(f"User logged in: {email}")

        return AuthResponse(
            success=True,
            message="Login successful",
            token=create_token(user.id),
            user_id=user.id,
            email=user.email
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login failed for {email}: {str(e)}")
        raise HTTPException(status_code=500, detail="Login failed. Please try again.")

@router.get("/me", response_model=MeResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return MeResponse(
        success=True,
        user_id=current_user.id,
        email=current_user.email
    )
