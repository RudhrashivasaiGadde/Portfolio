import { useProgress } from '@react-three/drei';
import { useEffect, useState, useRef } from 'react';

export function LoadingScreen({ started, setStarted }) {
  const { progress } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const displayRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const rafRef = useRef(null);

  useEffect(() => {
    const checkLoading = () => {
      const elapsed = Date.now() - startTimeRef.current;

      const diff = progress - displayRef.current;
      const step = diff > 0 ? diff * 0.1 : 0;
      const next = Math.min(displayRef.current + step + Math.random() * 0.8, progress, 100);
      displayRef.current = next;
      setDisplayProgress(next);

      if (progress >= 100 && elapsed >= 2000 && displayRef.current >= 99) {
        setStarted(true);
      } else {
        rafRef.current = requestAnimationFrame(checkLoading);
      }
    };

    rafRef.current = requestAnimationFrame(checkLoading);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [progress, setStarted]);

  return (
    <div className={`loading-screen ${started ? 'loading-screen--hidden' : ''}`}>
      <div className="loading-container">
        <div className="loading-coaster">
          <div className="loading-logo">
             <img src="shinchan.png" alt="Shinchan" />
          </div>
          <svg className="loading-ring ring-of-fire" viewBox="0 0 100 100">
            <circle 
              cx="50" cy="50" r="45" 
              fill="none" 
              stroke="#FFD700" 
              strokeWidth="4" 
              strokeDasharray={`${(displayProgress / 100) * 283} 283`}
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="loading-text">
          <span className="pirate-font">Gathering the crew... {Math.round(displayProgress)}%</span>
        </div>
      </div>
    </div>
  );
}
