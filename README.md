# 📘 Tech Vocabulary Builder – Full Stack Application

A **Duolingo-style full stack application** to learn technical vocabulary through quizzes, authentication, scoring, and admin management.

---

## 🎯 Overview

Tech Vocabulary Builder helps users learn and test technical terms using interactive quizzes.  
It includes **user authentication**, **score tracking**, and an **admin panel** for managing quiz content.

---

## 🚀 Features

### 👤 User Features
- User Registration & Login (JWT-based authentication)
- Interactive Quiz Gameplay
- Scoreboard & Performance Tracking
- Vocabulary Cards for Learning

### 🛡️ Admin Features
- Admin Login
- Manage Quiz Questions & Terms
- Monitor User Activity & Scores

### ⚙️ Technical Highlights
- Secure authentication using JWT
- Modular backend with FastAPI routers
- Modern frontend using React + Vite
- SQLite database for persistence

---

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- JSX
- CSS

### Backend
- FastAPI
- Pydantic
- SQLite
- JWT Authentication
- Uvicorn

---

## 📁 Project Structure

```
tech-vocabulary-builder/
│
├── backend/
│   ├── data/
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── auth.py
│   │   ├── quiz.py
│   │   └── user.py
│   │
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   ├── python_view_test_results.py
│   │   ├── test_admin.py
│   │   ├── test_auth.py
│   │   ├── test_quiz.py
│   │   ├── test_user.py
│   │   └── test_results.db
│   │
│   ├── auth_utils.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── main.py
│   ├── tech_vocab.db
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── Game.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ScoreBoard.jsx
│   │   │   └── TermCard.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
├── venv/
├── README.md
└── .gitignore
```

---

## ⚙️ Installation & Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

- POST `/auth/register`
- POST `/auth/login`
- GET `/quiz/start`
- POST `/quiz/submit`
- GET `/user/profile`
- GET `/admin/users`

---

## 👨‍💻 Team

**By Team3**
