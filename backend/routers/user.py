from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import get_db
from auth_utils import get_current_user

router = APIRouter(
    prefix="/api",
    tags=["User"]
)

@router.get("/terms", response_model=List[schemas.TermResponse])
def get_all_terms(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all terms (requires authentication)"""
    terms = db.query(models.Term).all()
    return terms

@router.get("/terms/{term_id}", response_model=schemas.TermResponse)
def get_term(
    term_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific term by ID (requires authentication)"""
    term = db.query(models.Term).filter(models.Term.id == term_id).first()
    if not term:
        raise HTTPException(status_code=404, detail="Term not found")
    return term

@router.post("/scores", response_model=schemas.ScoreResponse)
def save_score(
    score_data: schemas.ScoreCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save user score (requires authentication)"""
    percentage = round((score_data.correct / score_data.total * 100) if score_data.total > 0 else 0, 2)
    
    new_score = models.UserScore(
        user_id=current_user.id,
        correct=score_data.correct,
        total=score_data.total,
        percentage=percentage
    )
    
    db.add(new_score)
    db.commit()
    db.refresh(new_score)
    
    return new_score

@router.get("/scores/my-history", response_model=List[schemas.ScoreResponse])
def get_my_scores(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's score history (requires authentication)"""
    scores = db.query(models.UserScore).filter(
        models.UserScore.user_id == current_user.id
    ).order_by(models.UserScore.created_at.desc()).all()
    
    return scores

@router.get("/stats")
def get_stats(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get overall statistics (requires authentication)"""
    all_scores = db.query(models.UserScore).all()
    
    if not all_scores:
        return {
            "total_users": 0,
            "total_quizzes": 0,
            "average_score": 0,
            "total_questions_answered": 0
        }
    
    total_users = db.query(models.User).count()
    
    return {
        "total_users": total_users,
        "total_quizzes": len(all_scores),
        "average_score": round(sum(s.percentage for s in all_scores) / len(all_scores), 2),
        "total_questions_answered": sum(s.total for s in all_scores)
    }