import React from 'react';

const ScoreBoard = ({ correct, total }) => {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  return (
    <div className="score-display">
      Score: {correct} / {total} ({percentage}%)
    </div>
  );
};

export default ScoreBoard;