from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database import get_db
from models import User
import schemas
from auth_utils import (
    authenticate_user,
    create_access_token,
    get_password_hash,
    get_current_user
)

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

# ================= REGISTER =================

@router.post("/register", response_model=schemas.Token)
def register(
    user_data: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(400, "Username already exists")

    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(400, "Email already exists")

    user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        is_admin=False
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.username})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

# ================= LOGIN (SWAGGER FORM) =================

@router.post("/login", response_model=schemas.Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    token = create_access_token({"sub": user.username})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

# ================= ME =================

@router.get("/me", response_model=schemas.UserResponse)
def me(
    current_user: User = Depends(get_current_user)
):
    return current_user
