from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import get_db
from auth_utils import get_current_admin

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)

@router.post("/terms", response_model=schemas.TermResponse)
def create_term(
    term_data: schemas.TermCreate,
    current_admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new term (Admin only)"""
    # Check if term already exists
    existing_term = db.query(models.Term).filter(
        models.Term.term == term_data.term
    ).first()
    
    if existing_term:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Term already exists"
        )
    
    new_term = models.Term(**term_data.dict())
    db.add(new_term)
    db.commit()
    db.refresh(new_term)
    
    return new_term

@router.put("/terms/{term_id}", response_model=schemas.TermResponse)
def update_term(
    term_id: int,
    term_data: schemas.TermUpdate,
    current_admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update a term (Admin only)"""
    term = db.query(models.Term).filter(models.Term.id == term_id).first()
    
    if not term:
        raise HTTPException(status_code=404, detail="Term not found")
    
    # Update only provided fields
    update_data = term_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(term, key, value)
    
    db.commit()
    db.refresh(term)
    
    return term

@router.delete("/terms/{term_id}")
def delete_term(
    term_id: int,
    current_admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a term (Admin only)"""
    term = db.query(models.Term).filter(models.Term.id == term_id).first()
    
    if not term:
        raise HTTPException(status_code=404, detail="Term not found")
    
    db.delete(term)
    db.commit()
    
    return {"message": f"Term '{term.term}' deleted successfully"}

@router.get("/users", response_model=List[schemas.UserResponse])
def get_all_users(
    current_admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all users (Admin only)"""
    users = db.query(models.User).all()
    return users

@router.get("/scores/all", response_model=List[schemas.ScoreResponse])
def get_all_scores(
    current_admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all user scores (Admin only)"""
    scores = db.query(models.UserScore).order_by(
        models.UserScore.created_at.desc()
    ).all()
    return scores