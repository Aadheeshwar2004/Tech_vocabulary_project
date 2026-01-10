import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Game from './components/Game';
import TermCard from './components/TermCard';
import AdminPanel from './components/AdminPanel';

const App = () => {
  const [view, setView] = useState('home');
  const [authView, setAuthView] = useState('login');
  const [user, setUser] = useState(null);
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setView('home');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setView('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('home');
  };

  const fetchAllTerms = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/terms', {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setTerms(data);
    } catch (err) {
      console.error('Error fetching terms:', err);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats', {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleViewTerms = () => {
    setView('terms');
    fetchAllTerms();
  };

  const handleViewStats = () => {
    setView('stats');
    fetchStats();
  };

  // Not authenticated - show login/register
  if (!user) {
    return (
      <div className="app">
        <div className="header">
          <h1>🚀 Tech Vocabulary Builder</h1>
          <p>Learn technical terms like a pro!</p>
        </div>

        <div className="content">
          {authView === 'login' ? (
            <Login 
              onLogin={handleLogin}
              onSwitchToRegister={() => setAuthView('register')}
            />
          ) : (
            <Register 
              onRegister={handleRegister}
              onSwitchToLogin={() => setAuthView('login')}
            />
          )}
        </div>
      </div>
    );
  }

  // Authenticated - show main app
  const renderContent = () => {
    if (view === 'home') {
      return (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
            <h3 style={{ color: '#667eea', marginBottom: '10px' }}>
              Welcome back, {user.username}! 
              {user.is_admin && ' 👨‍💼'}
            </h3>
            <p style={{ color: '#666' }}>
              {user.is_admin ? 'You have admin privileges' : 'Ready to test your knowledge?'}
            </p>
          </div>

          <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#333' }}>
            Tech Vocabulary Builder
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Master technical terms through interactive quizzes and real-world examples!
          </p>
          
          <div className="nav-buttons">
            <button className="btn btn-primary" onClick={() => setView('game')}>
              🎮 Start Quiz
            </button>
            <button className="btn btn-secondary" onClick={handleViewTerms}>
              📚 Browse All Terms
            </button>
            <button className="btn btn-secondary" onClick={handleViewStats}>
              📊 View Statistics
            </button>
            {user.is_admin && (
              <button className="btn btn-danger" onClick={() => setView('admin')}>
                👨‍💼 Admin Panel
              </button>
            )}
          </div>

          <div style={{ marginTop: '60px', textAlign: 'left', maxWidth: '800px', margin: '60px auto 0' }}>
            <h3 style={{ color: '#667eea', marginBottom: '20px' }}>Features:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                <h4 style={{ color: '#333', marginBottom: '10px' }}>🎯 Interactive Quiz</h4>
                <p style={{ color: '#666' }}>Test your knowledge with definition-based questions</p>
              </div>
              <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                <h4 style={{ color: '#333', marginBottom: '10px' }}>💻 Code Examples</h4>
                <p style={{ color: '#666' }}>See how each term is used in real code</p>
              </div>
              <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                <h4 style={{ color: '#333', marginBottom: '10px' }}>🌍 Real-World Context</h4>
                <p style={{ color: '#666' }}>Understand practical applications in industry</p>
              </div>
              <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                <h4 style={{ color: '#333', marginBottom: '10px' }}>📊 Track Progress</h4>
                <p style={{ color: '#666' }}>Monitor your learning with score history</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (view === 'game') {
      return <Game onExit={() => setView('home')} />;
    }

    if (view === 'admin') {
      return <AdminPanel onExit={() => setView('home')} />;
    }

    if (view === 'stats') {
      return (
        <div>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
            📊 Platform Statistics
          </h2>
          {stats ? (
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-value">{stats.total_users}</span>
                <span className="stat-label">Total Users</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{stats.total_quizzes}</span>
                <span className="stat-label">Quizzes Completed</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{stats.average_score}%</span>
                <span className="stat-label">Average Score</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{stats.total_questions_answered}</span>
                <span className="stat-label">Questions Answered</span>
              </div>
            </div>
          ) : (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading statistics...</p>
            </div>
          )}
        </div>
      );
    }

    if (view === 'terms') {
      return (
        <div>
          <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <h2 style={{ color: '#333', marginBottom: '10px' }}>All Tech Terms</h2>
            <p style={{ color: '#666' }}>Browse through our collection of {terms.length} technical terms</p>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading terms...</p>
            </div>
          ) : (
            <div className="terms-grid">
              {terms.map(term => (
                <TermCard key={term.id} term={term} />
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>🚀 Tech Vocabulary Builder</h1>
        <p>Learn technical terms like a pro!</p>
      </div>

      {view !== 'home' && (
        <div className="nav-buttons">
          <button className="btn btn-secondary" onClick={() => setView('home')}>
            🏠 Home
          </button>
          <button className="btn btn-primary" onClick={() => setView('game')}>
            🎮 Quiz
          </button>
          <button className="btn btn-secondary" onClick={handleViewTerms}>
            📚 All Terms
          </button>
          <button className="btn btn-secondary" onClick={handleViewStats}>
            📊 Stats
          </button>
          {user.is_admin && (
            <button className="btn btn-danger" onClick={() => setView('admin')}>
              👨‍💼 Admin
            </button>
          )}
          <button className="btn btn-danger" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      )}

      {view === 'home' && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button className="btn btn-danger" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      )}

      <div className="content">
        {renderContent()}
      </div>

      <div style={{ textAlign: 'center', color: 'white', marginTop: '40px', padding: '20px' }}>
        <p>Built with ❤️ using React, FastAPI & SQLAlchemy</p>
      </div>
    </div>
  );
};

export default App;