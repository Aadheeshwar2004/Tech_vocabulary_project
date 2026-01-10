import React, { useState, useEffect } from 'react';
import ScoreBoard from './ScoreBoard';

const Game = ({ onExit }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [gameFinished, setGameFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchQuiz = async () => {
    try {
      const res = await fetch('/api/quiz/random?count=10', {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setQuestions(data.questions);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching quiz:', err);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!userAnswer.trim()) return;

    setSubmitted(true);
    const currentQuestion = questions[currentIndex];

    try {
      const res = await fetch('/api/quiz/check', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          term_id: currentQuestion.id,
          user_answer: userAnswer
        })
      });
      const data = await res.json();

      setFeedback(data);
      
      const newScore = {
        correct: score.correct + (data.correct ? 1 : 0),
        total: score.total + 1
      };
      setScore(newScore);

      // Auto-advance after 3 seconds
      setTimeout(() => {
        handleNext();
      }, 3000);

    } catch (err) {
      console.error('Error checking answer:', err);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setFeedback(null);
      setSubmitted(false);
    } else {
      saveScore();
    }
  };

  const saveScore = async () => {
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          correct: score.correct + (feedback?.correct ? 1 : 0),
          total: score.total + 1
        })
      });
    } catch (err) {
      console.error('Error saving score:', err);
    } finally {
      setGameFinished(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !submitted) {
      handleSubmit();
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (gameFinished) {
    const finalScore = {
      correct: score.correct + (feedback?.correct ? 1 : 0),
      total: score.total + 1
    };
    const percentage = Math.round((finalScore.correct / finalScore.total) * 100);
    let message = '';
    
    if (percentage >= 80) message = '🎉 Excellent! You\'re a tech vocabulary master!';
    else if (percentage >= 60) message = '👍 Good job! Keep learning!';
    else if (percentage >= 40) message = '📚 Not bad! There\'s room for improvement!';
    else message = '💪 Keep practicing! You\'ll get better!';

    return (
      <div className="results-container">
        <h2>Quiz Complete!</h2>
        <div className="results-score">{percentage}%</div>
        <div className="results-message">{message}</div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{finalScore.correct}</span>
            <span className="stat-label">Correct Answers</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{finalScore.total - finalScore.correct}</span>
            <span className="stat-label">Incorrect Answers</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{finalScore.total}</span>
            <span className="stat-label">Total Questions</span>
          </div>
        </div>

        <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Play Again
          </button>
          <button className="btn btn-secondary" onClick={onExit}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="game-container">
      <ScoreBoard correct={score.correct} total={score.total} />
      
      <div className="question-card">
        <div className="question-number">
          Question {currentIndex + 1} of {questions.length}
        </div>
        
        <div className={`difficulty-badge difficulty-${currentQuestion.difficulty}`}>
          {currentQuestion.difficulty.toUpperCase()}
        </div>

        <div className="definition">
          <strong>Definition:</strong> {currentQuestion.definition}
        </div>

        <div className="code-example">
          <strong>Example:</strong><br/>
          {currentQuestion.example}
        </div>

        <div>
          <input
            type="text"
            className="answer-input"
            placeholder="Type the term here..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={submitted}
            autoFocus
          />
        </div>

        {!submitted && (
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={!userAnswer.trim()}
          >
            Submit Answer
          </button>
        )}

        {feedback && (
          <div className={`feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>
            {feedback.correct ? (
              <div>
                <h3>✅ Correct!</h3>
                <p>Great job! The answer is <strong>{feedback.correct_answer}</strong></p>
              </div>
            ) : (
              <div>
                <h3>❌ Incorrect</h3>
                <p>The correct answer is <strong>{feedback.correct_answer}</strong></p>
              </div>
            )}
            
            {feedback.real_world && (
              <div className="real-world">
                <h4>💡 Real-World Usage:</h4>
                <p>{feedback.real_world}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {submitted && currentIndex < questions.length - 1 && (
        <button className="btn btn-secondary" onClick={handleNext}>
          Next Question →
        </button>
      )}
    </div>
  );
};

export default Game;