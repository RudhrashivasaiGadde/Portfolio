import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Text, Image } from '@react-three/drei';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

function DustParticles({ trigger }) {
  const pointsRef = useRef();
  const particlesCount = 200;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
    }
    return pos;
  }, []);

  useEffect(() => {
    if (trigger && pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position;
      
      // Reset positions
      for (let i = 0; i < particlesCount; i++) {
        posAttr.array[i * 3] = 0;
        posAttr.array[i * 3 + 1] = 0;
        posAttr.array[i * 3 + 2] = 0;
      }
      posAttr.needsUpdate = true;

      // Burst animation
      for (let i = 0; i < particlesCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 5;
        gsap.to(posAttr.array, {
          [i * 3]: Math.cos(angle) * radius,
          [i * 3 + 1]: Math.sin(angle) * radius,
          [i * 3 + 2]: (Math.random() - 0.5) * 5,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: () => posAttr.needsUpdate = true
        });
      }

      // Fade animation
      gsap.fromTo(pointsRef.current.material, 
        { opacity: 1 }, 
        { opacity: 0, duration: 1.5, ease: "power2.in" }
      );
    }
  }, [trigger]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.06} 
        color="#ffffff" 
        transparent 
        opacity={0} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function Coaster({ theme, phase, setPhase }) {
  const meshRef = useRef();
  const innerGroupRef = useRef();
  const hoverFactor = useRef(0);
  const isDark = theme === 'dark';
  const [opacity, setOpacity] = useState(1);
  const [showDust, setShowDust] = useState(false);

  // Trigger dust when dark mode is entered
  useEffect(() => {
    if (isDark) {
      setShowDust(true);
      setTimeout(() => setShowDust(false), 2000);
    }
  }, [isDark]);
  
  // Phase 2 Transition Effect
  useEffect(() => {
    if (phase === 'transitioning') {
      ScrollTrigger.getById("coaster-trigger")?.kill();

      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(() => setPhase('phase2Loading'), 300);
        }
      });

      // Smooth expansion and fade out
      tl.to(meshRef.current.position, {
        x: 0,
        y: 0,
        z: 6, // Closer to screen
        duration: 2,
        ease: "power2.inOut"
      })
      .to(meshRef.current.rotation, {
        x: Math.PI / 2, // Rotate to face camera perfectly
        y: 0,
        z: Math.PI * 4,
        duration: 2,
        ease: "power2.inOut"
      }, 0)
      .to(meshRef.current.scale, {
        x: 40,
        y: 40,
        z: 40,
        duration: 2,
        ease: "power2.in"
      }, 0.5)
      .to({ val: 1 }, {
        val: 0,
        duration: 0.5,
        onUpdate: function() { setOpacity(this.targets()[0].val); },
        ease: "power2.in"
      }, 1.5);
    }
  }, [phase, setPhase]);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        id: "coaster-trigger",
        trigger: ".overlay",
        start: "top top",
        end: "bottom bottom",
        scrub: 3.0,
      }
    });

    const tilt = Math.PI / 5;
    gsap.set(meshRef.current.position, { x: 2.2, y: 0, z: 0 });
    gsap.set(meshRef.current.rotation, { x: tilt, y: 0, z: 0 });

    tl.to(meshRef.current.position, { x: -2.2, ease: "power1.inOut", duration: 1 }, 0)
      .to(meshRef.current.rotation, { x: Math.PI * 2 + tilt, y: Math.PI * 2, z: 0, ease: "power1.inOut", duration: 1 }, 0)
      .to(meshRef.current.position, { x: 2.2, ease: "power1.inOut", duration: 1 }, 1)
      .to(meshRef.current.rotation, { x: Math.PI * 4 + tilt, y: -Math.PI * 1, z: 0, ease: "power1.inOut", duration: 1 }, 1)
      .to(meshRef.current.position, { x: -2.2, ease: "power1.inOut", duration: 1 }, 2)
      .to(meshRef.current.rotation, { x: Math.PI * 6 + tilt, y: Math.PI * 2, z: 0, ease: "power1.inOut", duration: 1 }, 2);

    return () => tl.kill();
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current && phase === 'phase1') {
      const trigger = ScrollTrigger.getById("coaster-trigger");
      const velocity = trigger ? Math.abs(trigger.getVelocity()) : 0;
      const targetIntensity = Math.max(0, 1 - (velocity / 600));
      hoverFactor.current += (targetIntensity - hoverFactor.current) * 0.05;
      
      if (hoverFactor.current > 0.01) {
        meshRef.current.position.y += Math.sin(t * 1.5) * 0.003 * hoverFactor.current;
        meshRef.current.rotation.z += Math.cos(t * 1) * 0.001 * hoverFactor.current;
      }
    }
  });

  return (
    <group ref={meshRef}>
      <DustParticles trigger={showDust} />
      <group ref={innerGroupRef}>
        
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.8, 1.8, 0.3, 64]} />
          <meshStandardMaterial 
            color={isDark ? "#ffffff" : "#c0c0c0"} 
            roughness={0.1} 
            metalness={0.8}
            envMapIntensity={0.5}
            transparent
            opacity={opacity}
          />
        </mesh>
        
        <mesh position={[0, 0.155, 0]} receiveShadow>
           <cylinderGeometry args={[1.6, 1.6, 0.01, 64]} />
           <meshStandardMaterial 
             color={isDark ? "#000000" : "#222222"} 
             roughness={0.9} 
             metalness={0.1} 
             transparent
             opacity={opacity}
           />
        </mesh>
        
        {/* Spider-Man Icon - Two versions to prevent suspension during switch */}
        <Image 
          url="https://cdn-icons-png.flaticon.com/512/1090/1090806.png"
          position={[0, 0.165, 0]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          scale={[1.2, 1.2]} 
          transparent
          opacity={opacity}
          visible={!isDark}
        />
        <Image 
          url="/venom.png" 
          position={[0, 0.165, 0]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          scale={[1.2, 1.2]} 
          transparent
          opacity={opacity}
          visible={isDark}
        />

        <mesh position={[0, -0.155, 0]} receiveShadow>
           <cylinderGeometry args={[1.6, 1.6, 0.01, 64]} />
           <meshStandardMaterial 
             color="#111111"
             roughness={0.8} 
             metalness={0.2} 
             transparent
             opacity={opacity}
           />
        </mesh>
        
        <Image 
          url="logo.png" 
          position={[0, -0.165, 0]} 
          rotation={[Math.PI / 2, Math.PI, 0]} 
          scale={[1.8, 1.8]} 
          transparent
          opacity={opacity}
        />
        
      </group>
    </group>
  );
}
