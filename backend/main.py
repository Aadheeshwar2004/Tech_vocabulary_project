from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models
from database import engine, init_db

# Import routers
from routers import auth, user, admin, quiz

# Create database tables
# models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Tech Vocabulary Builder API",
    description="A full-stack application with authentication and role-based access control",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()

# Health check endpoint
@app.get("/", tags=["Root"])
def root():
    """Health check endpoint"""
    return {
        "message": "Tech Vocabulary Builder API is running!",
        "version": "2.0.0",
        "features": ["Authentication", "Authorization", "Database Persistence"],
        "docs": "/docs"
    }

# Include routers
app.include_router(auth.router)      # /api/auth/*
app.include_router(user.router)      # /api/terms, /api/scores, /api/stats
app.include_router(quiz.router)      # /api/quiz/*
app.include_router(admin.router)     # /api/admin/*

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)