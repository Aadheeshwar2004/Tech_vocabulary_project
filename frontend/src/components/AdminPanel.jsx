import React, { useState, useEffect } from 'react';

const AdminPanel = ({ onExit }) => {
  const [terms, setTerms] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('terms');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTerm, setEditingTerm] = useState(null);
  const [formData, setFormData] = useState({
    term: '',
    definition: '',
    example: '',
    real_world: '',
    difficulty: 'easy'
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'terms') {
        const res = await fetch('/api/terms', {
          headers: getAuthHeaders()
        });
        const data = await res.json();
        setTerms(data);
      } else if (activeTab === 'users') {
        const res = await fetch('/api/admin/users', {
          headers: getAuthHeaders()
        });
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      showMessage('error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTerm = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/terms', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail);
      }

      showMessage('success', 'Term added successfully!');
      setShowAddForm(false);
      setFormData({
        term: '',
        definition: '',
        example: '',
        real_world: '',
        difficulty: 'easy'
      });
      fetchData();
    } catch (err) {
      showMessage('error', err.message);
    }
  };

  const handleUpdateTerm = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/terms/${editingTerm.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail);
      }

      showMessage('success', 'Term updated successfully!');
      setEditingTerm(null);
      setFormData({
        term: '',
        definition: '',
        example: '',
        real_world: '',
        difficulty: 'easy'
      });
      fetchData();
    } catch (err) {
      showMessage('error', err.message);
    }
  };

  const handleDeleteTerm = async (termId, termName) => {
    if (!confirm(`Are you sure you want to delete "${termName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/terms/${termId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        throw new Error('Failed to delete term');
      }

      showMessage('success', 'Term deleted successfully!');
      fetchData();
    } catch (err) {
      showMessage('error', err.message);
    }
  };

  const startEdit = (term) => {
    setEditingTerm(term);
    setFormData({
      term: term.term,
      definition: term.definition,
      example: term.example,
      real_world: term.real_world,
      difficulty: term.difficulty
    });
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setEditingTerm(null);
    setShowAddForm(false);
    setFormData({
      term: '',
      definition: '',
      example: '',
      real_world: '',
      difficulty: 'easy'
    });
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>👨‍💼 Admin Panel</h2>
        <p>Manage terms and view users</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.type === 'success' ? '✅' : '❌'} {message.text}
        </div>
      )}

      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'terms' ? 'active' : ''}`}
          onClick={() => setActiveTab('terms')}
        >
          📚 Manage Terms
        </button>
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 View Users
        </button>
      </div>

      {activeTab === 'terms' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? '❌ Cancel' : '➕ Add New Term'}
            </button>
          </div>

          {showAddForm && (
            <div className="admin-form-card">
              <h3>{editingTerm ? '✏️ Edit Term' : '➕ Add New Term'}</h3>
              <form onSubmit={editingTerm ? handleUpdateTerm : handleAddTerm}>
                <div className="form-group">
                  <label>Term Name *</label>
                  <input
                    type="text"
                    name="term"
                    value={formData.term}
                    onChange={handleInputChange}
                    placeholder="e.g., API"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Definition *</label>
                  <textarea
                    name="definition"
                    value={formData.definition}
                    onChange={handleInputChange}
                    placeholder="Enter the definition..."
                    required
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Code Example *</label>
                  <textarea
                    name="example"
                    value={formData.example}
                    onChange={handleInputChange}
                    placeholder="Enter a code example..."
                    required
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>Real-World Usage *</label>
                  <textarea
                    name="real_world"
                    value={formData.real_world}
                    onChange={handleInputChange}
                    placeholder="Describe real-world usage..."
                    required
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Difficulty *</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary">
                    {editingTerm ? '💾 Update Term' : '➕ Add Term'}
                  </button>
                  {editingTerm && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading terms...</p>
            </div>
          ) : (
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Term</th>
                    <th>Difficulty</th>
                    <th>Definition</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {terms.map(term => (
                    <tr key={term.id}>
                      <td><strong>{term.term}</strong></td>
                      <td>
                        <span className={`difficulty-badge difficulty-${term.difficulty}`}>
                          {term.difficulty}
                        </span>
                      </td>
                      <td>{term.definition.substring(0, 100)}...</td>
                      <td>
                        <button
                          className="btn-small btn-edit"
                          onClick={() => startEdit(term)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn-small btn-delete"
                          onClick={() => handleDeleteTerm(term.id, term.term)}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : (
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td><strong>{user.username}</strong></td>
                      <td>{user.email}</td>
                      <td>
                        {user.is_admin ? (
                          <span className="role-badge admin">👨‍💼 Admin</span>
                        ) : (
                          <span className="role-badge user">👤 User</span>
                        )}
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;