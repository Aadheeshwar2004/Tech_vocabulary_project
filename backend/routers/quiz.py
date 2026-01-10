from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import random

import models
import schemas
from database import get_db
from auth_utils import get_current_user

router = APIRouter(
    prefix="/api/quiz",
    tags=["Quiz"]
)

@router.get("/random")
def get_random_quiz(
    count: int = 5,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get random terms for quiz (requires authentication)"""
    all_terms = db.query(models.Term).all()
    
    if len(all_terms) == 0:
        raise HTTPException(status_code=404, detail="No terms available")
    
    selected_terms = random.sample(all_terms, min(count, len(all_terms)))
    
    quiz = []
    for term in selected_terms:
        quiz.append({
            "id": term.id,
            "definition": term.definition,
            "example": term.example,
            "difficulty": term.difficulty
        })
    
    return {"questions": quiz, "total": len(quiz)}

@router.post("/check", response_model=schemas.AnswerResponse)
def check_answer(
    answer: schemas.Answer,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Check if answer is correct (requires authentication)"""
    term = db.query(models.Term).filter(models.Term.id == answer.term_id).first()
    
    if not term:
        raise HTTPException(status_code=404, detail="Term not found")
    
    is_correct = term.term.lower().strip() == answer.user_answer.lower().strip()
    
    return {
        "correct": is_correct,
        "correct_answer": term.term,
        "real_world": term.real_world
    }