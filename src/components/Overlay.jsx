import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export function Overlay({ visible, theme, setTheme, isAtTop, setPhase }) {
  const containerRef = useRef();

  useEffect(() => {
    if (theme === 'dark') {
      const tl = gsap.timeline();
      tl.to(containerRef.current.querySelectorAll('h1, h2, p, .feature-card, .pirate-font'), {
        color: '#ffffff',
        textShadow: '0 0 10px rgba(255,255,255,0.5)',
        duration: 1,
        stagger: 0.05,
        ease: "power2.out"
      })
      .to(containerRef.current.querySelectorAll('h1, h2, p, .feature-card, .pirate-font'), {
        textShadow: '0 0 0px rgba(255,255,255,0)',
        duration: 1,
        ease: "power2.in"
      }, "+=0.5");
    } else {
      gsap.to(containerRef.current.querySelectorAll('h1, h2, p, .feature-card, .pirate-font'), {
        color: '', // Revert to CSS default
        textShadow: 'none',
        duration: 0.5
      });
    }
  }, [theme]);

  return (
    <div ref={containerRef} className={`overlay ${visible ? 'visible' : 'hidden'}`}>
      
      {/* PHASE 2 PROMPT NAV BAR */}
      {theme === 'dark' && isAtTop && (
        <nav className="phase2-nav">
          <p>Do you want to enter the next phase?</p>
          <button onClick={() => setPhase('transitioning')}>Yes, Enter Phase 2</button>
        </nav>
      )}
      
      <section className="section left">
        <div className="content">
          <p className="tagline pirate-font">Ahoy, I'm</p>
          <h1 className="pirate-font">Rudhrashivasai Gadde</h1>
          <h2>Creative Developer</h2>
          <p>Age: 17 | Developer & Designer</p>
        </div>
      </section>

      <section className="section right">
        <div className="content">
          <h2>My Education & Journey</h2>
          <p>I am a passionate 17-year-old student diving deep into the world of web development, 3D design, and building immersive digital experiences.</p>
        </div>
      </section>

      <section className="section left">
        <div className="content">
          <h2>My Ecosystem</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Frontend</h3>
              <p>React, Three.js, GSAP, TailwindCSS</p>
            </div>
            <div className="feature-card">
              <h3>Backend</h3>
              <p>Node.js, Python, SQL</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section right">
        <div className="content" style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', maxWidth: '600px', marginLeft: 'auto', lineHeight: '1.2' }}>
            We caught your attention<br />with a minimalist design.
          </h2>
          <p>If you're looking for someone to build next-generation immersive web experiences, reach out to me.</p>
          <div className="feature-grid" style={{ justifyContent: 'flex-end' }}>
            <div className="feature-card">
              <h3>Email</h3>
              <p>hello@rudhrashivasai.com</p>
            </div>
            <div className="feature-card">
              <h3>Socials</h3>
              <p>LinkedIn | Instagram | GitHub</p>
            </div>
          </div>
          
          <button 
            className="theme-toggle-btn"
            onClick={() => {
              setTheme(theme === 'dark' ? 'light' : 'dark');
            }}
          >
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>
      </section>
    </div>
  );
}
