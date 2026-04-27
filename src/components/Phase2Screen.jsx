import { useEffect, useState } from 'react';

export function Phase2Screen({ phase, setPhase }) {
  if (phase === 'transitioning') return null;

  // We show the "Are you sure?" screen for both loading and ready phases to keep it consistent
  if (phase === 'phase2Loading' || phase === 'phase2Ready' || phase === 'phase3Loading' || phase === 'phase3Complete') {
    return (
      <div className="phase2-ready fade-in">
        <div className="ready-content">
          <h1 style={{ color: '#000', fontSize: '3rem', marginBottom: '2rem' }}>Are you sure?</h1>
          <p style={{ color: '#333', marginBottom: '3rem' }}>You are about to enter Phase 2.</p>
          <button className="confirm-btn" onClick={() => setPhase('phase2Active')}>
            Yes, I am sure.
          </button>
        </div>
      </div>
    );
  }

  return null;
}
