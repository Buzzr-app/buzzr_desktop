'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { HERO_BANDS, bandProgress, sampleHeroProgress } from '@/src/lib/heroProgress';

/* Scene tokens are read once from the dark landing surface at mount. */
type SceneTokens = {
  canvas: string;
  steel: string;
  steelSurface: string;
  subtle: string;
  accent: string;
  foreground: string;
  ramp: string[]; // [peak, great, good, mid, bad, garbage]
};

function readTokens(): SceneTokens {
  // Neutral, non-brand fallbacks: only reached if getComputedStyle yields empty
  // (CSS not yet applied / token renamed). Neutral fallbacks make failures
  // visibly grey rather than a wrong brand impostor.
  const fallback: SceneTokens = {
    canvas: '#808080',
    steel: '#404040',
    steelSurface: '#505050',
    subtle: '#3a3a42',
    accent: '#808080',
    foreground: '#d0d0d0',
    ramp: ['#808080', '#808080', '#808080', '#808080', '#808080', '#808080']
  };
  if (typeof window === 'undefined') return fallback;
  const s = getComputedStyle(document.documentElement);
  const g = (n: string, fb: string) => s.getPropertyValue(n).trim() || fb;
  return {
    canvas: g('--color-canvas', fallback.canvas),
    steel: g('--color-steel', fallback.steel),
    steelSurface: g('--color-steel-surface', fallback.steelSurface),
    subtle: g('--color-subtle', fallback.subtle),
    accent: g('--color-accent', fallback.accent),
    foreground: g('--color-foreground', fallback.foreground),
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

/* ── solid voxel basketball: a thick, dense, seamed sphere ───────────────── */
// Each voxel carries a base position, an outward radial direction (drives both
// the panel/seam shading and the explosion vector), a tumble axis, a per-voxel
// random, and a base scale jitter - so the surface reads as crafted, not flat.
// Density is perf-tiered and the shell is thick + nearly gap-free so the ball
// reads as a SOLID basketball, not a translucent fuzz.
function pickDensityTier() {
  // SSR / no-window guard -> mid tier.
  if (typeof window === 'undefined') {
    return { g: 0.066, pixelRatioCap: 1.6 };
  }
  const w = window.innerWidth || 1280;
  const dpr = window.devicePixelRatio || 1;
  const cores = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 4;
  const coarse =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches;

  const mobile = coarse || w < 760;
  const lowPower = cores <= 4 || dpr >= 2.5;

  if (mobile || (lowPower && w < 1100)) {
    return { g: 0.092, pixelRatioCap: 1.3 }; // mobile / low  -> ~4-7k cubes
  }
  if (w >= 1500 && cores >= 8 && dpr <= 2) {
    return { g: 0.057, pixelRatioCap: 1.8 }; // desktop high -> ~16-20k cubes
  }
  return { g: 0.066, pixelRatioCap: 1.6 };   // desktop mid  -> ~11-14k cubes
}

function buildVoxels() {
  const R = 1.42;
  const tier = pickDensityTier();
  const g = tier.g;            // perf-gated grid spacing
  const size = g * 0.96;       // cubes nearly touch -> solid, gap-free surface
  const inner = 0.74 * R;      // THICK shell (was 0.82R) so the burst reads solid
  const outer = 1.0 * R;
  const lim = Math.ceil(outer / g) + 1;
  const SEAM_WAVE = 0.32;      // amplitude of the wavy equator seam (basketball weave)

  const base: number[] = [];
  const dir: number[] = [];
  const seam: number[] = [];
  const axis: number[] = [];
  const rand: number[] = [];
  const scl: number[] = [];

  // Deterministic hash so the look is stable across reloads.
  let seed = 1;
  const rng = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  for (let x = -lim; x <= lim; x++) {
    for (let y = -lim; y <= lim; y++) {
      for (let z = -lim; z <= lim; z++) {
        const px = x * g;
        const py = y * g;
        const pz = z * g;
        const d = Math.hypot(px, py, pz);
        if (d < inner || d > outer) continue;

        // Density gate: only the OUTERMOST ~18% of shell depth is fully packed;
        // deeper voxels are kept at 34% (they only flash briefly during burst).
        const depth = (outer - d) / (outer - inner); // 0 at surface, 1 at core
        if (depth > 0.18 && rng() > 0.34) continue;

        base.push(px, py, pz);
        const inv = 1 / (d || 1e-5);
        const dxu = px * inv;
        const dyu = py * inv;
        const dzu = pz * inv;
        dir.push(dxu, dyu, dzu);

        // CPU-baked basketball seam distance: 2 perpendicular vertical great
        // circles (|dx|,|dz|) carve 4 lunes; one wavy equator seam (dy weaving
        // by SEAM_WAVE*sin(2*lon)) splits each lune -> the real 8-panel weave.
        const lon = Math.atan2(dzu, dxu);
        const dWavy = Math.abs(dyu - SEAM_WAVE * Math.sin(2 * lon));
        seam.push(Math.min(Math.abs(dxu), Math.abs(dzu), dWavy));

        // random unit tumble axis
        let ax = rng() * 2 - 1;
        let ay = rng() * 2 - 1;
        let az = rng() * 2 - 1;
        const al = Math.hypot(ax, ay, az) || 1;
        ax /= al;
        ay /= al;
        az /= al;
        axis.push(ax, ay, az);

        rand.push(rng());
        scl.push(0.92 + rng() * 0.16); // tight jitter -> surface stays watertight
      }
    }
  }
  return {
    base: new Float32Array(base),
    dir: new Float32Array(dir),
    seam: new Float32Array(seam),
    axis: new Float32Array(axis),
    rand: new Float32Array(rand),
    scl: new Float32Array(scl),
    count: base.length / 3,
    size,
    pixelRatioCap: tier.pixelRatioCap
  };
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

function roundedScreenGeometry(width: number, height: number, radius: number) {
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(radius, width / 2, height / 2);
  const shape = new THREE.Shape();

  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  const geometry = new THREE.ShapeGeometry(shape, 18);
  const positions = geometry.getAttribute('position');
  const uvs = new Float32Array(positions.count * 2);

  for (let i = 0; i < positions.count; i++) {
    const px = positions.getX(i);
    const py = positions.getY(i);
    uvs[i * 2] = (px + width / 2) / width;
    uvs[i * 2 + 1] = (py + height / 2) / height;
  }

  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  return geometry;
}

// Neutral shade endpoints (not brand colors) for deriving lighter/darker tints.
const SHADE_WHITE = new THREE.Color(0xffffff);

/**
 * The voxel ball is "all shades of green": a 5-stop ramp built ONLY from the
 * green brand tokens (buzz-peak + buzz-great) with --color-canvas as the deep
 * on-brand shadow anchor and white as the highlight. Sampled by a real light
 * term in the shader, so the ball gets a true terminator, not random noise.
 */
function buildGreenRamp(tk: SceneTokens): THREE.Color[] {
  const peak = new THREE.Color(tk.ramp[0]); // buzz-peak, brightest green
  const great = new THREE.Color(tk.ramp[1]); // buzz-great, deeper green
  const canvasCol = new THREE.Color(tk.canvas); // warm app near-black -> on-brand shadow
  return [
    peak.clone().lerp(SHADE_WHITE, 0.3), // 0 highlight (top-lit sheen)
    peak.clone(), // 1 bright brand green
    peak.clone().lerp(great, 0.5), // 2 mid green
    great.clone(), // 3 shadow green (emissive base)
    great.clone().lerp(canvasCol, 0.45) // 4 deep shadow + seam channel (on-brand)
  ];
}

export default function ClayHeroScene({ wrapperSelector }: { wrapperSelector?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduce = reduceMQ.matches;
    // Guards async callbacks (texture load) against a unmount that already ran
    // cleanup - StrictMode tears the first mount down before the image resolves.
    let disposed = false;

    /* ── renderer ── */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      // Retain the last frame in the drawing buffer so off-rAF / hidden-tab
      // captures (and toDataURL) reflect the current pose instead of an empty
      // buffer. Negligible cost for a scene this small.
      preserveDrawingBuffer: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setSize(container.clientWidth || 1, container.clientHeight || 1, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0.1, 6.3);
    camera.lookAt(0, 0, 0);

    /* ── environment IBL (matte clay GI) ── */
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new RoomEnvironment();
    const envRT = pmrem.fromScene(envScene, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.55;
    pmrem.dispose();
    envScene.dispose?.();

    /* ── tokens → colors ── */
    const tokens = readTokens();
    const rampColors = buildGreenRamp(tokens);
    const hemi = new THREE.HemisphereLight(
      new THREE.Color(tokens.canvas),
      new THREE.Color(tokens.steel),
      0.6
    );
    const amb = new THREE.AmbientLight(0xffffff, 0.28);
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(3.5, 5, 4);
    const rim = new THREE.DirectionalLight(new THREE.Color(tokens.accent), 0.45);
    rim.position.set(-4, 2, -2);
    // Front fill so the phone body reads (lit, not a dark silhouette).
    const fill = new THREE.DirectionalLight(0xffffff, 0.85);
    fill.position.set(0, 1.2, 6.5);
    scene.add(hemi, amb, key, rim, fill);

    /* ── scene graph: sceneGroup (parallax) > ball + phoneGroup ── */
    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    /* ── voxel ball ── */
    const vox = buildVoxels();
    const voxGeo = new RoundedBoxGeometry(vox.size, vox.size, vox.size, 2, vox.size * 0.22);
    voxGeo.setAttribute('aBaseDir', new THREE.InstancedBufferAttribute(vox.dir, 3));
    voxGeo.setAttribute('aRand', new THREE.InstancedBufferAttribute(vox.rand, 1));
    voxGeo.setAttribute('aSeamDist', new THREE.InstancedBufferAttribute(vox.seam, 1));

    const voxMat = new THREE.MeshStandardMaterial({
      transparent: false, // opaque kills the z-fight shimmer
      opacity: 1.0,
      depthWrite: true, // the #1 fix vs the old translucent shell
      depthTest: true,
      side: THREE.FrontSide,
      roughness: 0.6, // matte rubber, not plastic-shiny
      metalness: 0.0,
      emissive: new THREE.Color(tokens.ramp[1]), // deep green base lift
      emissiveIntensity: 0.06 // lower so shadows stay deep, not lifted flat
    });

    const ballUniforms = {
      uTime: { value: 0 },
      uRamp: { value: rampColors },
      uExplode: { value: 0 },
      uFresnel: { value: 0.6 }, // rim now feeds emissive only
      uSeamW: { value: 0.072 }, // seam half-width (arc radians) - TUNABLE
      uSeamDark: { value: 0.86 }, // retained (seam now uses the canvas-green stop)
      uLightDir: { value: key.position.clone().normalize() } // key light -> real terminator
    };

    voxMat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = ballUniforms.uTime;
      shader.uniforms.uRamp = ballUniforms.uRamp;
      shader.uniforms.uExplode = ballUniforms.uExplode;
      shader.uniforms.uFresnel = ballUniforms.uFresnel;
      shader.uniforms.uSeamW = ballUniforms.uSeamW;
      shader.uniforms.uSeamDark = ballUniforms.uSeamDark;
      shader.uniforms.uLightDir = ballUniforms.uLightDir;

      // Solid basketball: panel green + recessed 8-panel seams (three mutually
      // perpendicular great circles, |n.x|/|n.y|/|n.z|) resolved in the vertex
      // stage. All colour derives from the green token ramp - no hardcoded hex.
      shader.vertexShader =
        'attribute vec3 aBaseDir;\nattribute float aRand;\nattribute float aSeamDist;\n' +
        'uniform float uTime;\nuniform float uExplode;\nuniform float uSeamW;\nuniform float uSeamDark;\nuniform vec3 uLightDir;\nuniform vec3 uRamp[5];\n' +
        'varying vec3 vPanel;\nvarying vec3 vSeamCol;\nvarying float vSeam;\nvarying float vSeamCore;\nvarying float vSeamAO;\nvarying float vFresnel;\nvarying float vRand;\n' +
        shader.vertexShader.replace(
          '#include <project_vertex>',
          '#include <project_vertex>\n' +
            '  vRand = aRand;\n' +
            '  vec3 nrmV = normalize(transformedNormal);\n' +
            '  vec3 viewV = normalize(-mvPosition.xyz);\n' +
            '  vFresnel = pow(1.0 - clamp(dot(nrmV, viewV), 0.0, 1.0), 2.6);\n' +
            '  vec3 lightV = normalize((viewMatrix * vec4(uLightDir, 0.0)).xyz);\n' +
            '  float shade = clamp(0.5 + 0.5 * dot(nrmV, lightV) + aBaseDir.y * 0.12, 0.0, 1.0);\n' +
            '  vPanel = (shade < 0.5\n' +
            '    ? mix(uRamp[4], uRamp[3], shade * 2.0)\n' +
            '    : mix(uRamp[3], mix(uRamp[1], uRamp[0], (shade - 0.5) * 0.7), (shade - 0.5) * 2.0)) * (0.97 + aRand * 0.06);\n' +
            '  vSeamCol = uRamp[4];\n' +
            '  vSeam = 1.0 - smoothstep(uSeamW, uSeamW + max(uSeamW * 0.6, 0.012), aSeamDist);\n' +
            '  vSeamCore = 1.0 - smoothstep(0.0, uSeamW * 0.5, aSeamDist);\n' +
            '  vSeamAO = max(vSeam, (1.0 - smoothstep(uSeamW * 1.6, uSeamW * 1.6 + 0.05, aSeamDist)) * 0.55);\n'
        );

      shader.fragmentShader =
        'uniform float uFresnel;\nuniform float uExplode;\n' +
        'varying vec3 vPanel;\nvarying vec3 vSeamCol;\nvarying float vSeam;\nvarying float vSeamCore;\nvarying float vSeamAO;\nvarying float vFresnel;\nvarying float vRand;\n' +
        shader.fragmentShader
          .replace(
            '#include <color_fragment>',
            '#include <color_fragment>\n' +
              '  vec3 ballCol = mix(vPanel, vSeamCol, vSeam);\n' +
              '  ballCol = mix(ballCol, vSeamCol, vSeamCore * 0.55);\n' +
              '  ballCol *= (1.0 - vSeamAO * 0.30);\n' +
              '  diffuseColor.rgb = ballCol;\n' +
              '  diffuseColor.a = 1.0;\n'
          )
          .replace(
            'vec3 totalEmissiveRadiance = emissive;',
            'float panelLit = 1.0 - vSeam;\n' +
              '  vec3 totalEmissiveRadiance = emissive + vPanel * (0.04 + uExplode * 0.18 + vFresnel * uFresnel * 0.5) * panelLit;'
          );
    };
    voxMat.customProgramCacheKey = () => 'voxelBasketball_v3';

    const ball = new THREE.InstancedMesh(voxGeo, voxMat, vox.count);
    ball.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    ball.frustumCulled = false; // voxels fly far out during the burst
    ball.renderOrder = 2;
    ball.position.set(0, -1.05, -0.18);
    sceneGroup.add(ball);

    // Reusable scratch + per-instance writer for the explosion.
    const m4 = new THREE.Matrix4();
    const qTmp = new THREE.Quaternion();
    const pTmp = new THREE.Vector3();
    const sTmp = new THREE.Vector3();
    const axTmp = new THREE.Vector3();
    const BURST = 2.15;

    const writeInstance = (i: number, explode: number) => {
      const local = clamp01((explode - vox.rand[i] * 0.16) / 0.84);
      const dist = local * BURST * (0.45 + vox.rand[i]);
      pTmp.set(
        vox.base[i * 3] + vox.dir[i * 3] * dist,
        vox.base[i * 3 + 1] + vox.dir[i * 3 + 1] * dist,
        vox.base[i * 3 + 2] + vox.dir[i * 3 + 2] * dist
      );
      const angle = local * (2.0 + vox.rand[i] * 3.2);
      axTmp.set(vox.axis[i * 3], vox.axis[i * 3 + 1], vox.axis[i * 3 + 2]);
      qTmp.setFromAxisAngle(axTmp, angle);
      // SHRINK-TO-ZERO burst: opaque voxels cannot alpha-fade, so each holds
      // size through early flight then smoothsteps its scale to exactly 0.
      const start = 0.35 + vox.rand[i] * 0.15;
      const shrink = 1 - smooth(start, 1, local);
      const s = vox.scl[i] * shrink;
      sTmp.set(s, s, s);
      m4.compose(pTmp, qTmp, sTmp);
      ball.setMatrixAt(i, m4);
    };

    // Initial (un-exploded) layout.
    for (let i = 0; i < vox.count; i++) writeInstance(i, 0);
    ball.instanceMatrix.needsUpdate = true;

    let prevExplode = -1;
    const EXPLODE_EPS = 1e-4;
    const applyExplosion = (explode: number) => {
      // Only rewrite instances when the explode value actually moved - a held
      // value (e.g. progress pinned at 1) shouldn't re-pose ~2.3k matrices/frame.
      if (Math.abs(explode - prevExplode) < EXPLODE_EPS) return;
      for (let i = 0; i < vox.count; i++) writeInstance(i, explode);
      ball.instanceMatrix.needsUpdate = true;
      prevExplode = explode;
    };

    /* ── clean clay phone ── */
    const phoneGroup = new THREE.Group();
    sceneGroup.add(phoneGroup);

    const phone = new THREE.Group();
    phone.rotation.x = -0.04;
    phone.rotation.y = 0.05;
    phoneGroup.add(phone);

    const bodyGeo = new RoundedBoxGeometry(1.55, 3.18, 0.34, 6, 0.2);
    // Dark graphite titanium: anchor on --color-subtle pulled toward --color-canvas
    // and drop metalness so the front fill light stops catching it as silver. This
    // unifies the WebGL phone with the darker CSS phones (DataBento/promo) without
    // touching the scene lights (which also rake the basketball) or the bands.
    const phoneBodyColor = () =>
      new THREE.Color(tokens.subtle).lerp(new THREE.Color(tokens.canvas), 0.35);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: phoneBodyColor(),
      roughness: 0.6,
      metalness: 0.22
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.renderOrder = 0;
    phone.add(body);

    // Neutral brushed-steel edge just inside the body - a metal rim, not a green glow.
    const frameGeo = new RoundedBoxGeometry(1.5, 3.13, 0.355, 4, 0.19);
    const frameMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(tokens.steelSurface),
      roughness: 0.5,
      metalness: 0.6,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0.0,
      transparent: true,
      opacity: 0.0
    });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.renderOrder = 0;
    phone.add(frame);

    const screenGeo = roundedScreenGeometry(1.34, 2.86, 0.105);
    const screenMat = new THREE.MeshBasicMaterial({
      // Dark token slab before the dashboard texture arrives, so a map-less
      // frame (e.g. the reduced-motion first paint) is never an opaque white quad.
      color: new THREE.Color(tokens.steel),
      transparent: true,
      opacity: 0,
      toneMapped: false
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = 0.181;
    screen.renderOrder = 1;
    phone.add(screen);

    const texLoader = new THREE.TextureLoader();
    let screenTex: THREE.Texture | null = null;
    texLoader.load(
      '/app-screens/dashboard.png',
      (tex) => {
        // The component may already have unmounted (StrictMode dev double-mount,
        // or a fast nav) - don't touch a disposed material / lost GL context.
        if (disposed) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        screenTex = tex;
        screenMat.map = tex;
        screenMat.color.set(0xffffff); // neutral multiplier so the dashboard reads true
        screenMat.needsUpdate = true;
        if (reduce) renderer.render(scene, camera);
      },
      undefined,
      (err) => {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[ClayHeroScene] screen texture failed to load', err);
        }
      }
    );

    /* ── progress source: the pin wrapper ── */
    const wrapper =
      (wrapperSelector && document.querySelector<HTMLElement>(wrapperSelector)) ||
      container.closest<HTMLElement>('[data-hero-pin]');

    let progress = 0;

    const sampleProgress = () => {
      return sampleHeroProgress(wrapper, reduce);
    };

    /* ── pointer parallax ── */
    let mx = 0;
    let my = 0;
    const onPointerMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reduce) window.addEventListener('pointermove', onPointerMove);

    /* ── resize ── */
    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, vox.pixelRatioCap));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // Re-render the current pose immediately: when rAF is throttled (hidden
      // tab) a resize would otherwise leave the resized buffer un-redrawn.
      renderer.render(scene, camera);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    /* ── pose: ball detonates while the phone rises forward into center stage ── */
    const poseScene = (p: number, t: number) => {
      const isNarrow = camera.aspect < 0.72;
      const explode = bandProgress(HERO_BANDS.burst, p);
      ballUniforms.uExplode.value = explode;
      ballUniforms.uTime.value = t;
      ballUniforms.uFresnel.value = lerp(0.6, 0.95, explode);
      applyExplosion(explode);

      // The ball starts at visual center. The frosted copy layer handles legibility.
      const ballScale = lerp(isNarrow ? 0.32 : 0.56, isNarrow ? 0.72 : 0.95, explode);
      ball.scale.setScalar(ballScale);
      ball.position.y = lerp(isNarrow ? -0.06 : -0.08, isNarrow ? 0.12 : 0.16, explode);

      const rise = easeOutCubic(bandProgress(HERO_BANDS.phoneRise, p));
      phone.visible = rise > 0.018;
      // Settle the risen phone lower in frame so it clears the post-scroll copy
      // (BUZZR + tagline + CTAs) instead of crowding the buttons.
      phone.position.y = lerp(isNarrow ? -4.2 : -3.0, isNarrow ? -0.42 : -0.5, rise);
      phone.position.z = lerp(-0.45, 0.2, rise); // pulled forward, in front of where the ball was
      const sc = lerp(isNarrow ? 0.46 : 0.58, isNarrow ? 0.58 : 0.7, rise);
      phone.scale.setScalar(sc);

      const surface = bandProgress(HERO_BANDS.phoneSurface, p);
      screenMat.opacity = surface;
      frameMat.opacity = surface * 0.48;
    };

    /* ── reduced-motion: single static pose, one frame ── */
    if (reduce) {
      ball.rotation.set(0.08, 0.6, 0);
      poseScene(1, 0);
      screenMat.opacity = 1;
      renderer.render(scene, camera);
    }

    /* ── animation loop ── */
    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const t = clock.elapsedTime;

      const raw = sampleProgress();
      progress += (raw - progress) * 0.1;

      // Idle spin only while the ball is still coherent; let the burst take over after.
      const spin = 1 - smooth(0.16, 0.5, progress);
      ball.rotation.y += dt * 0.42 * spin;
      ball.rotation.x += dt * 0.09 * spin;

      poseScene(progress, t);

      sceneGroup.rotation.y += (mx * 0.1 - sceneGroup.rotation.y) * 0.06;
      sceneGroup.rotation.x += (-my * 0.06 - sceneGroup.rotation.x) * 0.06;

      renderer.render(scene, camera);
    };

    if (!reduce) {
      clock.start();
      animate();
    }

    /* ── scroll-linked render fallback ──
       Browsers throttle requestAnimationFrame to ~0fps when the tab is hidden
       (backgrounded / off-screen). For a pinned scroll sequence that means the
       pose would freeze mid-scroll. Rendering directly on scroll while hidden
       keeps the frames correct (and is a no-op cost when visible, since rAF is
       already sampling scroll every frame). */
    const onScroll = () => {
      if (reduce || !document.hidden) return;
      progress = sampleProgress();
      poseScene(progress, clock.elapsedTime);
      renderer.render(scene, camera);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Dev-only deterministic seek hook for headless/preview verification, where
    // requestAnimationFrame is throttled to 0fps and scroll-driving is unstable.
    // Never compiled into a meaningful path in production-style envs.
    const devHook =
      process.env.NODE_ENV !== 'production'
        ? (p: number) => {
            resize();
            progress = clamp01(p);
            poseScene(progress, clock.elapsedTime);
            renderer.render(scene, camera);
          }
        : null;
    if (devHook) {
      (window as unknown as { __heroSeek?: (p: number) => void }).__heroSeek = devHook;
    }

    /* ── react to reduced-motion change ── */
    const onReduceChange = () => {
      const next = reduceMQ.matches;
      if (next === reduce) return;
      reduce = next;
      if (reduce) {
        cancelAnimationFrame(raf);
        raf = 0;
        window.removeEventListener('pointermove', onPointerMove);
        sceneGroup.rotation.set(0, 0, 0);
        ball.rotation.set(0.08, 0.6, 0);
        poseScene(1, 0);
        screenMat.opacity = 1;
        renderer.render(scene, camera);
      } else {
        window.addEventListener('pointermove', onPointerMove);
        clock.start();
        animate();
      }
    };
    reduceMQ.addEventListener('change', onReduceChange);

    /* ── cleanup ── */
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      reduceMQ.removeEventListener('change', onReduceChange);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      if (devHook) {
        delete (window as unknown as { __heroSeek?: (p: number) => void }).__heroSeek;
      }

      ball.dispose(); // releases the InstancedMesh instanceMatrix GPU buffer
      voxGeo.dispose();
      voxMat.dispose();
      bodyGeo.dispose();
      bodyMat.dispose();
      frameGeo.dispose();
      frameMat.dispose();
      screenGeo.dispose();
      screenMat.dispose();
      screenTex?.dispose();
      envRT.dispose();

      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [wrapperSelector]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
