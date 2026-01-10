from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# ================= USER SCHEMAS =================

class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(UserBase):
    id: int
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ================= AUTH SCHEMA =================

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# ================= TERM SCHEMAS =================

class TermBase(BaseModel):
    term: str
    definition: str
    example: str
    real_world: str
    difficulty: str


class TermCreate(TermBase):
    pass


class TermUpdate(BaseModel):
    term: Optional[str] = None
    definition: Optional[str] = None
    example: Optional[str] = None
    real_world: Optional[str] = None
    difficulty: Optional[str] = None


class TermResponse(TermBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ================= QUIZ SCHEMAS =================

class QuizQuestion(BaseModel):
    id: int
    definition: str
    example: str
    difficulty: str


class Answer(BaseModel):
    term_id: int
    user_answer: str


class AnswerResponse(BaseModel):
    correct: bool
    correct_answer: str
    real_world: str


# ================= SCORE SCHEMAS =================

class ScoreCreate(BaseModel):
    correct: int
    total: int


class ScoreResponse(BaseModel):
    id: int
    user_id: int
    correct: int
    total: int
    percentage: float
    created_at: datetime

    class Config:
        from_attributes = True
