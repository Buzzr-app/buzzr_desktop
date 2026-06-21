'use client';

import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, useTexture, Grid, ContactShadows, Float } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';

/* ── theme tokens → three colours (re-read when the .dark class flips) ────────── */
type Tokens = ReturnType<typeof readTokens>;

function readTokens() {
  const fallback = {
    accent: '#00c264', accentDim: '#00a152', onAccent: '#04150b',
    canvas: '#f6f3ec', border: '#ddd8cc', foreground: '#232a31', steel: '#20262d',
    ramp: ['#00c264', '#16a34a', '#ca8a04', '#ea580c', '#dc2626', '#7c3aed']
  };
  if (typeof window === 'undefined') return fallback;
  const s = getComputedStyle(document.documentElement);
  const g = (n: string, fb: string) => s.getPropertyValue(n).trim() || fb;
  return {
    accent: g('--color-accent', fallback.accent),
    accentDim: g('--color-accent-dim', fallback.accentDim),
    onAccent: g('--color-on-accent', fallback.onAccent),
    canvas: g('--color-canvas', fallback.canvas),
    border: g('--color-border', fallback.border),
    foreground: g('--color-foreground', fallback.foreground),
    steel: g('--color-steel', fallback.steel),
    ramp: [
      g('--color-buzz-peak', fallback.ramp[0]),
      g('--color-buzz-great', fallback.ramp[1]),
      g('--color-buzz-good', fallback.ramp[2]),
      g('--color-buzz-mid', fallback.ramp[3]),
      g('--color-buzz-bad', fallback.ramp[4]),
      g('--color-buzz-garbage', fallback.ramp[5])
    ]
  };
}

function useTokens(): Tokens {
  const [t, setT] = useState<Tokens>(() => readTokens());
  useEffect(() => {
    const obs = new MutationObserver(() => setT(readTokens()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return t;
}

function usePrefersReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setR(mq.matches);
    const on = () => setR(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return r;
}

/* ── voxel-sphere geometry (basketball shell) ─────────────────────────────────── */
function buildVoxels() {
  const N = 7, R = 1, step = R / N, size = step * 0.84;
  const inner = 0.78, outer = 1.0;
  const m: number[] = [];
  for (let x = -N; x <= N; x++)
    for (let y = -N; y <= N; y++)
      for (let z = -N; z <= N; z++) {
        const px = x * step, py = y * step, pz = z * step;
        const d = Math.hypot(px, py, pz);
        if (d >= inner * R && d <= outer * R) m.push(px, py, pz);
      }
  return { positions: m, count: m.length / 3, size };
}

/* ── voxel basketball: GLSL shader cycles the Buzz heat ramp + darkens the seams ── */
function VoxelBall({ tokens, reduce }: { tokens: Tokens; reduce: boolean }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const { positions, count, size } = useMemo(buildVoxels, []);
  const geometry = useMemo(() => new THREE.BoxGeometry(size, size, size), [size]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRamp: { value: tokens.ramp.map((c) => new THREE.Color(c)) },
      uSeam: { value: new THREE.Color(tokens.onAccent) }
    }),
    [tokens]
  );

  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.42, metalness: 0.05 });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.uTime;
      shader.uniforms.uRamp = uniforms.uRamp;
      shader.uniforms.uSeam = uniforms.uSeam;
      shader.vertexShader =
        'varying vec3 vDir;\n' +
        shader.vertexShader.replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\n  vDir = normalize(instanceMatrix[3].xyz);'
        );
      shader.fragmentShader =
        'uniform float uTime;\nuniform vec3 uRamp[6];\nuniform vec3 uSeam;\nvarying vec3 vDir;\n' +
        'vec3 buzzRamp(float t){ t = clamp(t,0.0,1.0)*5.0; float i = floor(t); int idx = int(i);\n' +
        '  vec3 a = uRamp[idx]; vec3 b = uRamp[idx>=5?5:idx+1]; return mix(a,b,t-i); }\n' +
        shader.fragmentShader.replace(
          '#include <color_fragment>',
          '#include <color_fragment>\n  {\n    float tt = fract(vDir.y*0.5+0.5 + uTime*0.07);\n    vec3 grad = buzzRamp(tt);\n    float seam = clamp(smoothstep(0.09,0.0,abs(vDir.x)) + smoothstep(0.09,0.0,abs(vDir.z)) + smoothstep(0.06,0.0,abs(vDir.y)), 0.0, 1.0);\n    diffuseColor.rgb = mix(grad, uSeam, seam*0.8);\n  }'
        );
    };
    return mat;
  }, [uniforms]);

  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
      m.setPosition(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [positions, count]);

  useFrame((state, delta) => {
    if (reduce) return;
    uniforms.uTime.value = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y += delta * 0.32;
      ref.current.rotation.x += delta * 0.12;
    }
  });

  return <instancedMesh ref={ref} args={[geometry, material, count]} />;
}

/* ── clay iPhone: matte rounded body + the dashboard screen ───────────────────── */
function ClayPhone({ tokens }: { tokens: Tokens }) {
  const tex = useTexture('/screenshot-dashboard.png');
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return (
    <group rotation={[0.04, -0.12, 0]}>
      <RoundedBox args={[1.55, 3.18, 0.34]} radius={0.2} smoothness={6}>
        <meshStandardMaterial color={tokens.accent} roughness={0.82} metalness={0} />
      </RoundedBox>
      <RoundedBox args={[1.38, 3.0, 0.02]} radius={0.16} smoothness={5} position={[0, 0, 0.175]}>
        <meshStandardMaterial color={tokens.onAccent} roughness={0.6} />
      </RoundedBox>
      <mesh position={[0, 0, 0.186]}>
        <planeGeometry args={[1.28, 2.9]} />
        <meshStandardMaterial map={tex} roughness={0.34} metalness={0} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.28, 0.2]}>
        <capsuleGeometry args={[0.05, 0.34, 4, 12]} />
        <meshStandardMaterial color={tokens.onAccent} roughness={0.5} />
      </mesh>
    </group>
  );
}

/* ── scroll rig: turns the whole rig, settles level when the hero is centred ───── */
function Rig({ reduce, children }: { reduce: boolean; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const { gl } = useThree();
  useFrame(() => {
    if (!ref.current) return;
    if (reduce) {
      ref.current.rotation.set(0.05, -0.18, 0);
      return;
    }
    const r = gl.domElement.getBoundingClientRect();
    const center = r.top + r.height / 2;
    const p = (center - window.innerHeight / 2) / (window.innerHeight / 2 + r.height / 2);
    const c = Math.max(-1, Math.min(1, p));
    const eased = Math.sign(c) * (c * c * (3 - 2 * Math.abs(c)));
    ref.current.rotation.y += (eased * 0.62 - ref.current.rotation.y) * 0.12;
    ref.current.rotation.x += (0.05 + eased * 0.04 - ref.current.rotation.x) * 0.12;
  });
  return <group ref={ref}>{children}</group>;
}

export default function ClayHeroScene() {
  const tokens = useTokens();
  const reduce = usePrefersReducedMotion();
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0.35, 0.25, 6.3], fov: 36 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <hemisphereLight args={[new THREE.Color(tokens.canvas), new THREE.Color(tokens.steel), 0.7]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[3.5, 5, 4]} intensity={1.2} />
      <directionalLight position={[-4, 2, -2]} intensity={0.4} color={new THREE.Color(tokens.accent)} />
      <Suspense fallback={null}>
        <Rig reduce={reduce}>
          <group position={[-0.5, -0.05, 0]}>
            <ClayPhone tokens={tokens} />
          </group>
          <Float speed={reduce ? 0 : 1.3} floatIntensity={reduce ? 0 : 0.5} rotationIntensity={0}>
            <group position={[1.55, 1.2, 0.5]} scale={0.92}>
              <VoxelBall tokens={tokens} reduce={reduce} />
            </group>
          </Float>
        </Rig>
        <ContactShadows position={[0, -1.78, 0]} opacity={0.45} scale={9} blur={2.6} far={3.6} color={tokens.onAccent} />
        <Grid
          position={[0, -1.8, 0]}
          args={[26, 26]}
          cellSize={0.5}
          cellThickness={0.6}
          cellColor={tokens.border}
          sectionSize={2.5}
          sectionThickness={1}
          sectionColor={tokens.accent}
          fadeDistance={17}
          fadeStrength={3}
          infiniteGrid
        />
      </Suspense>
    </Canvas>
  );
}
