import { useRef, useEffect, useState, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Sky, PerspectiveCamera, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

/* ── Snow particles ── */
function Snow() {
  const points = useRef();
  const count = 1200;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3]     = (Math.random() - 0.5) * 80;
      p[i * 3 + 1] = Math.random() * 25;
      p[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return p;
  }, []);

  useFrame(() => {
    if (!points.current) return;
    const arr = points.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] -= 0.04;
      if (arr[i * 3 + 1] < 0) arr[i * 3 + 1] = 25;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#fff" transparent opacity={0.5} />
    </points>
  );
}

/* ── Aurora Borealis ── */
function Aurora() {
  const meshRef = useRef();
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(80, 15, 60, 10);
    return g;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      pos.setZ(i, Math.sin(x * 0.1 + t * 0.3) * 2 + Math.cos(x * 0.05 + t * 0.5) * 1.5);
      pos.setY(i, pos.getY(i) + Math.sin(t * 0.2 + i * 0.01) * 0.003);
    }
    pos.needsUpdate = true;
    meshRef.current.material.opacity = 0.15 + Math.sin(t * 0.5) * 0.05;
  });

  return (
    <mesh ref={meshRef} geometry={geo} position={[0, 25, -50]} rotation={[0.3, 0, 0]}>
      <meshBasicMaterial
        color="#00ff88"
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function Aurora2() {
  const meshRef = useRef();
  const geo = useMemo(() => new THREE.PlaneGeometry(60, 12, 50, 8), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      pos.setZ(i, Math.sin(x * 0.08 + t * 0.4 + 2) * 2.5);
    }
    pos.needsUpdate = true;
    meshRef.current.material.opacity = 0.12 + Math.sin(t * 0.7 + 1) * 0.04;
  });

  return (
    <mesh ref={meshRef} geometry={geo} position={[10, 28, -55]} rotation={[0.2, 0.3, 0.1]}>
      <meshBasicMaterial
        color="#8844ff"
        transparent
        opacity={0.12}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── Pine Tree ── */
function PineTree({ position, scale: s = 1 }) {
  const group = useRef();
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.z = Math.sin(t * 0.8 + position[0]) * 0.015;
  });

  return (
    <group ref={group} position={position} scale={[s, s, s]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.2, 1, 6]} />
        <meshStandardMaterial color="#3d2517" roughness={0.9} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 1.2 + i * 0.55, 0]} castShadow>
          <coneGeometry args={[0.65 - i * 0.15, 1.1, 7]} />
          <meshStandardMaterial color={['#1a3d1a','#224d22','#2d5e2d'][i]} roughness={0.7} />
        </mesh>
      ))}
      {/* Snow on top */}
      <mesh position={[0, 2.6, 0]}>
        <coneGeometry args={[0.2, 0.3, 7]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ── Jeep ── */
function Jeep({ onToggleLights }) {
  const [lightsOn, setLightsOn] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = btnHovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [btnHovered]);

  const toggle = (e) => {
    e.stopPropagation();
    setLightsOn(!lightsOn);
    onToggleLights(!lightsOn);
  };

  return (
    <group scale={0.9} position={[0, 0.05, 0]}>
      {/* WHITE BUMPER BUTTON — always visible */}
      <mesh
        position={[0, 0.35, 1.95]}
        onClick={toggle}
        onPointerOver={() => setBtnHovered(true)}
        onPointerOut={() => setBtnHovered(false)}
      >
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={btnHovered ? 1.5 : 0.4}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[1.7, 0.7, 3.4]} />
        <meshStandardMaterial color="#d2b48c" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 1.2, 0.1]} castShadow>
        <boxGeometry args={[1.5, 0.6, 1.4]} />
        <meshStandardMaterial color="#d2b48c" roughness={0.4} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 1.2, 0.81]}>
        <boxGeometry args={[1.4, 0.5, 0.02]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.4} metalness={1} roughness={0} />
      </mesh>
      {/* Hood stripes */}
      <mesh position={[0, 0.96, 1.1]}>
        <boxGeometry args={[1.3, 0.02, 1.2]} />
        <meshStandardMaterial color="#8b0000" />
      </mesh>
      {/* Grill */}
      <group position={[0, 0.6, 1.71]}>
        <mesh>
          <boxGeometry args={[1.2, 0.5, 0.05]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        {[...Array(7)].map((_, i) => (
          <mesh key={i} position={[(-0.45 + i * 0.15), 0, 0.01]}>
            <boxGeometry args={[0.05, 0.4, 0.02]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        ))}
      </group>
      {/* Headlights */}
      <group position={[0, 0.7, 1.72]}>
        {[-0.55, 0.55].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <circleGeometry args={[0.18, 32]} />
            <meshStandardMaterial
              emissive={lightsOn ? "#fff" : "#111"}
              emissiveIntensity={lightsOn ? 15 : 0}
              color={lightsOn ? "#fff" : "#444"}
            />
            {lightsOn && (
              <spotLight position={[0, 0, 0.1]} angle={0.5} penumbra={0.3} intensity={15} distance={40} color="#fff" castShadow />
            )}
          </mesh>
        ))}
      </group>
      {/* Wheels */}
      {[[-0.9, 0.4, 1.2], [0.9, 0.4, 1.2], [-0.9, 0.4, -1.2], [0.9, 0.4, -1.2]].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.4, 32]} />
            <meshStandardMaterial color="#050505" roughness={1} />
          </mesh>
          <mesh position={[pos[0] > 0 ? 0.21 : -0.21, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}
      {/* Bumper — chrome */}
      <mesh position={[0, 0.35, 1.8]} castShadow>
        <boxGeometry args={[1.8, 0.2, 0.3]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Roof rack */}
      <mesh position={[0, 1.55, 0.1]}>
        <boxGeometry args={[1.3, 0.04, 1.2]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

/* ── Mountain ── */
function Mountain({ position, scale, color }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <coneGeometry args={[5, 12, 6]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      <mesh position={[0, 4, 0]}>
        <coneGeometry args={[2, 4.2, 6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
    </group>
  );
}

/* ── Social Icon (pure 3D text, no images) ── */
const socials = [
  { name: 'LinkedIn',  label: 'in', color: '#0A66C2', url: 'https://www.linkedin.com' },
  { name: 'Twitter',   label: '𝕏',  color: '#1DA1F2', url: 'https://twitter.com' },
  { name: 'YouTube',   label: '▶',  color: '#FF0000', url: 'https://www.youtube.com' },
  { name: 'Instagram', label: '📷', color: '#E4405F', url: 'https://www.instagram.com' },
];

function SocialNav({ activeIndex, setActiveIndex, visible }) {
  const navigate = (dir, e) => {
    e.stopPropagation();
    if (dir === 'next') setActiveIndex((activeIndex + 1) % socials.length);
    else setActiveIndex((activeIndex - 1 + socials.length) % socials.length);
  };

  const openUrl = (e) => {
    e.stopPropagation();
    window.open(socials[activeIndex].url, '_blank');
  };

  return (
    <group position={[0, 4, -15]} visible={visible}>
      {/* Center Logo */}
      <group position={[0, 0, 0.5]} onClick={openUrl}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <mesh>
          <circleGeometry args={[2, 32]} />
          <meshBasicMaterial color={socials[activeIndex].color} />
        </mesh>
        <Text
          position={[0, 0, 0.1]}
          fontSize={1.8}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {socials[activeIndex].label}
        </Text>
        <Text
          position={[0, -2.5, 0.1]}
          fontSize={0.7}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {socials[activeIndex].name}
        </Text>
        <pointLight intensity={10} color={socials[activeIndex].color} distance={20} />
      </group>

      {/* Left Arrow - triangle mesh */}
      <group position={[-7, 0, 0]} onClick={(e) => navigate('prev', e)}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.8, 1.5, 3]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <pointLight intensity={3} color="#ffffff" distance={8} />
      </group>

      {/* Right Arrow - triangle mesh */}
      <group position={[7, 0, 0]} onClick={(e) => navigate('next', e)}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.8, 1.5, 3]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <pointLight intensity={3} color="#ffffff" distance={8} />
      </group>
    </group>
  );
}

/* ── MAIN SCENE ── */
export function Phase2Environment({ onReady }) {
  const cameraRef = useRef();
  const [lightsActive, setLightsActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(2); // Start with YouTube
  const readyFired = useRef(false);
  const frameCount = useRef(0);

  // Fire onReady after a few frames have actually rendered
  useFrame(() => {
    if (!readyFired.current) {
      frameCount.current++;
      if (frameCount.current > 30) { // ~0.5s at 60fps
        readyFired.current = true;
        onReady && onReady();
      }
    }
  });

  const trees = useMemo(() => {
    const t = [];
    // Dense surrounding forest
    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 8 + Math.random() * 50;
      t.push({ pos: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius], s: 0.7 + Math.random() * 0.6 });
    }
    // Dense path-side trees
    for (let i = -60; i < 60; i += 2.5) {
      t.push({ pos: [-4 - Math.random() * 4, 0, i], s: 0.8 + Math.random() * 0.5 });
      t.push({ pos: [4 + Math.random() * 4, 0, i], s: 0.8 + Math.random() * 0.5 });
    }
    return t;
  }, []);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 15, 40);
      cameraRef.current.lookAt(0, 0, -20);

      gsap.to(cameraRef.current.position, {
        x: 0, y: 2.8, z: 8,
        duration: 5,
        ease: "power2.inOut",
        onUpdate: () => { cameraRef.current.lookAt(0, 1, -30); },
        onComplete: () => { setLightsActive(true); }
      });
    }

  }, []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={45} />

      <color attach="background" args={["#020208"]} />
      <Sky sunPosition={[0, -1, 0]} />
      <Stars radius={120} depth={50} count={7000} factor={6} saturation={0.5} fade speed={0.5} />

      {/* MOON */}
      <group position={[30, 40, -90]}>
        <mesh>
          <sphereGeometry args={[5, 32, 32]} />
          <meshBasicMaterial color="#ffffdd" />
        </mesh>
        <pointLight intensity={3} color="#ffffdd" distance={200} />
        {/* Moon halo */}
        <mesh scale={1.6}>
          <sphereGeometry args={[5, 32, 32]} />
          <meshBasicMaterial color="#ffffdd" transparent opacity={0.06} />
        </mesh>
      </group>

      {/* AURORA BOREALIS */}
      <Aurora />
      <Aurora2 />

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 20, 10]} intensity={0.5} color="#aaccff" castShadow />
      <pointLight position={[0, 10, -40]} intensity={0.5} color="#00ff88" distance={60} />

      <Snow />

      {/* MOUNTAINS */}
      <Mountain position={[0, 0, -30]} scale={[10, 8, 6]} color="#101020" />
      <Mountain position={[-20, 0, -35]} scale={[6, 6, 6]} color="#1a1a2e" />
      <Mountain position={[20, 0, -35]} scale={[6, 6, 6]} color="#1a1a2e" />
      <Mountain position={[-45, 0, -55]} scale={[5, 5, 5]} color="#0d0d1a" />
      <Mountain position={[50, 0, -60]} scale={[7, 7, 7]} color="#0d0d1a" />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0a150a" roughness={1} />
      </mesh>

      {/* Dirt Path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[6, 120]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.8} />
      </mesh>

      {/* FOREST */}
      {trees.map((tree, i) => (
        <PineTree key={i} position={tree.pos} scale={tree.s} />
      ))}

      {/* SOCIAL NAVIGATION — always visible */}
      <SocialNav
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        visible={true}
      />

      {/* THE JEEP */}
      <group position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
        <Jeep onToggleLights={setLightsActive} />
      </group>

      <ContactShadows resolution={512} scale={20} blur={2} opacity={0.3} far={10} color="#000000" position={[0, 0, 0]} />
      <fog attach="fog" args={["#020208", 40, 120]} />
    </>
  );
}
