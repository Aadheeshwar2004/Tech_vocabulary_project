# Tech Vocabulary Builder - Full Stack Application

A Duolingo-style platform for learning technical terms through interactive quizzes, code examples, and real-world applications.

## 🎯 Features

- **Interactive Quiz Game**: Test knowledge with definition and code-based questions
- **Real-World Examples**: Learn how terms are used in actual industry scenarios
- **Progress Tracking**: Monitor scores and improvement over time
- **Browse Terms**: Explore comprehensive library of technical terms
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

**Frontend:**
- React 18.2
- Vite (Build tool)
- Modern CSS with animations

**Backend:**
- FastAPI (Python web framework)
- Pydantic (Data validation)
- Uvicorn (ASGI server)

## 📁 Project Structure

```
tech-vocabulary-builder/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Pydantic models
│   ├── database.py          # Data management
│   ├── requirements.txt     # Python dependencies
│   └── data/
│       └── terms.json       # Terms database
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── App.jsx          # Main app component
│   │   ├── App.css          # Styles
│   │   └── main.jsx         # Entry point
│   ├── package.json         # Node dependencies
│   └── index.html           # HTML template
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the backend server:
```bash
python main.py
```

Backend will run on: `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 🎮 Usage

1. **Start Backend**: Run `python main.py` in the backend directory
2. **Start Frontend**: Run `npm run dev` in the frontend directory
3. **Open Browser**: Navigate to `http://localhost:5173`
4. **Play Quiz**: Click "Start Quiz" to test your knowledge
5. **Browse Terms**: Click "Browse All Terms" to explore the vocabulary

## 📡 API Endpoints

### GET `/api/terms`
Get all available terms

**Response:**
```json
[
  {
    "id": 1,
    "term": "API",
    "definition": "Application Programming Interface...",
    "example": "fetch('https://api.example.com/users')",
    "realWorld": "Twitter API allows developers...",
    "difficulty": "easy"
  }
]
```

### GET `/api/quiz/random?count=5`
Get random terms for quiz (without answers)

**Response:**
```json
{
  "questions": [
    {
      "id": 1,
      "definition": "Application Programming Interface...",
      "example": "fetch('https://api.example.com/users')",
      "difficulty": "easy"
    }
  ],
  "total": 5
}
```

### POST `/api/quiz/check`
Check user's answer

**Request:**
```json
{
  "term_id": 1,
  "user_answer": "API"
}
```

**Response:**
```json
{
  "correct": true,
  "correct_answer": "API",
  "real_world": "Twitter API allows developers..."
}
```

## 📸 Screenshots

Include screenshots in your submission document showing:
- Home page
- Quiz in progress
- Correct/incorrect answer feedback
- Results screen
- Terms browser

## 🎥 Demo Video

Record a screen recording showing:
1. Starting the application
2. Playing the quiz
3. Viewing all terms
4. Score tracking

## 🏗️ Build for Production

### Frontend
```bash
cd frontend
npm run build
```

### Backend
Use gunicorn or uvicorn with workers:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 🧪 Testing

### Test Backend API
```bash
# Test health check
curl http://localhost:8000/

# Test get all terms
curl http://localhost:8000/api/terms

# Test quiz endpoint
curl http://localhost:8000/api/quiz/random?count=5
```

### Sample API Requests/Responses

**Get All Terms:**
```bash
curl http://localhost:8000/api/terms
```

**Check Answer:**
```bash
curl -X POST http://localhost:8000/api/quiz/check \
  -H "Content-Type: application/json" \
  -d '{"term_id": 1, "user_answer": "API"}'
```

## 🎓 Learning Outcomes

By building this project, you'll gain experience with:
- Full-stack application architecture
- REST API design and implementation
- React component-based development
- State management in React
- CORS configuration
- Frontend-backend integration
- Responsive UI design

## 📝 Notes

- Backend runs on port 8000
- Frontend runs on port 5173
- CORS is configured for local development
- Data is stored in JSON file (can be extended to use database)

## 🤝 Contributing

Feel free to add more terms to `backend/data/terms.json` to expand the vocabulary!

## 📄 License

This project is created for educational purposes.

---

Built with ❤️ for tech learners everywhere!