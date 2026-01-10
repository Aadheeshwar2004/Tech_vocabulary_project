import React from 'react';

const TermCard = ({ term }) => {
  return (
    <div className="term-card">
      <h3>{term.term}</h3>
      <div className={`difficulty-badge difficulty-${term.difficulty}`}>
        {term.difficulty.toUpperCase()}
      </div>
      
      <p>{term.definition}</p>
      
      <span className="label">Example:</span>
      <div className="code-example">{term.example}</div>
      
      <span className="label">Real-World Usage:</span>
      <p>{term.real_world}</p>
    </div>
  );
};

export default TermCard;