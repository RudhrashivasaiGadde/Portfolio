import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer, ContactShadows } from '@react-three/drei';
import { Coaster } from './components/Coaster';
import { Overlay } from './components/Overlay';
import { LoadingScreen } from './components/LoadingScreen';
import { Phase2Screen } from './components/Phase2Screen';
import { Phase2Environment } from './components/Phase2Environment';

export default function App() {
  const [started, setStarted] = useState(false);
  const [theme, setTheme] = useState('light');
  const [phase, setPhase] = useState('phase1');
  const [isAtTop, setIsAtTop] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    if (phase === 'phase2Active') {
      document.body.setAttribute('data-theme', 'dark');
      document.body.style.background = '#000000';
      // Animate progress from 0 to 100
      setLoadProgress(0);
      const interval = setInterval(() => {
        setLoadProgress(prev => {
          if (prev >= 100) { clearInterval(interval); return 100; }
          return Math.min(prev + Math.random() * 6 + 2, 100);
        });
      }, 60);
      return () => clearInterval(interval);
    } else {
      document.body.setAttribute('data-theme', theme);
      document.body.style.background = '';
      setSceneReady(false);
      setLoadProgress(0);
    }
  }, [theme, phase]);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <LoadingScreen started={started} setStarted={setStarted} />
      <div id="canvas-container" style={phase === 'phase2Active' ? { pointerEvents: 'auto', zIndex: 10 } : {}}>
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} shadows gl={{ alpha: true }}>
          <ambientLight intensity={phase === 'phase2Active' ? 0.2 : 0.8} />
          
          {phase === 'phase2Active' ? (
            <Phase2Environment onReady={() => setSceneReady(true)} />
          ) : (
            <>
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={5} castShadow />
              <Suspense fallback={null}>
                <Coaster theme={theme} phase={phase} setPhase={setPhase} />
                
                <Environment resolution={256}>
                  <group rotation={[-Math.PI / 4, -0.3, 0]}>
                    <Lightformer intensity={20} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
                    <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
                    <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
                  </group>
                </Environment>
                <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" position={[0, -1.5, 0]} />
              </Suspense>
            </>
          )}
        </Canvas>
      </div>

      {/* Phase 2 loading overlay */}
      {phase === 'phase2Active' && !sceneReady && (
        <div className="phase2-env-loading">
          <div className="env-stars"></div>
          <div className="env-loading-content">
            <p className="env-progress-number">{Math.floor(loadProgress)}%</p>
            <div className="env-progress-bar">
              <div className="env-progress-fill" style={{ width: `${loadProgress}%` }}></div>
            </div>
            <p className="env-progress-label">Loading Environment</p>
          </div>
        </div>
      )}

      <Overlay 
        visible={started && phase === 'phase1'} 
        theme={theme} 
        setTheme={setTheme} 
        isAtTop={isAtTop}
        setPhase={setPhase}
      />
      {phase !== 'phase1' && phase !== 'phase2Active' && <Phase2Screen phase={phase} setPhase={setPhase} />}
    </>
  );
}
