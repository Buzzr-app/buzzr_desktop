'use client';

import { useEffect, useRef } from 'react';
import { useViewportGate } from '@/components/hooks/useViewportGate';
import { cn } from '@/components/utils';

/**
 * GyroidField - a brand-adapted, perf-gated generative background.
 *
 * Evokes the Fluid "gyroid / ASCII / pixelate" aesthetic with our own tokens
 * instead of a third-party iframe, so it stays on-brand and never ships a
 * long-lived expensive render:
 *   - colors come ONLY from CSS design tokens (no hex literals here); per-card
 *     variety is a SHADE-OF-GREEN shift of those tokens (tiny hue nudge + per-seed
 *     saturation/lightness), so every card is a distinct green - never teal/cyan
 *   - the field is computed in a single fragment shader at CELL resolution
 *     (a few px per cell) and upscaled with `image-rendering: pixelated`, so GPU
 *     cost is trivial regardless of size (the "pixelate" look is free)
 *   - the rAF loop only runs while near the viewport (useViewportGate), pauses
 *     on a hidden tab, and is throttled to ~30fps
 *   - `prefers-reduced-motion` renders exactly one static frame, no loop
 *   - if WebGL is unavailable it renders nothing (section bg remains)
 */

type GyroidVariant = 'cta' | 'reels' | 'dither' | 'hex';

type VariantConfig = {
  lo: string; // token name for the deep/shadow color (≈ page bg)
  hi: string; // token name for the field color
  peak: string; // token name for the brightest band highlight
  zoom: number;
  warp: number;
  speed: number;
  levels: number;
  intensity: number;
  cell: number; // upscaled pixel size (matches Fluid "pixelate N")
  grain?: number; // subtle noise amplitude (dither variant only)
};

// `cta` (footer) dense detail; `reels` per-card; `dither` Bayer blog; `hex` smooth honeycomb.
const VARIANTS: Record<GyroidVariant, VariantConfig> = {
  cta: {
    lo: '--color-canvas',
    hi: '--color-accent',
    peak: '--color-accent-text',
    zoom: 9.4,
    warp: 1.0,
    speed: 0.9,
    levels: 8,
    intensity: 1.0,
    cell: 4
  },
  reels: {
    lo: '--color-steel',
    hi: '--color-accent-text',
    peak: '--color-accent',
    zoom: 6.6,
    warp: 0.7,
    speed: 0.75,
    levels: 7,
    intensity: 0.92,
    cell: 4
  },
  // Matches Fluid preset: Gyroid · MINT · Hex · pixelate 3 · zoom 4 · warp 9 · speed 3 · grain 0.12
  hex: {
    lo: '--color-canvas',
    hi: '--color-accent-text',
    peak: '--color-accent',
    zoom: 4.0,
    warp: 9.0,
    speed: 0.55,
    levels: 0,
    intensity: 1.0,
    cell: 3,
    grain: 0.12
  },
  // Matches Fluid preset: Gyroid · MINT · Dither · pixelate 9 · zoom 4 · warp 9 · speed 3 · grain 0.25
  dither: {
    lo: '--color-canvas',
    hi: '--color-accent-text',
    peak: '--color-accent',
    zoom: 4.0,
    warp: 9.0,
    speed: 0.55,
    levels: 0, // unused in dither path (Bayer replaces level-banding)
    intensity: 1.0,
    cell: 9,
    grain: 0.25
  }
};

// Per-seed variation so every card is a DIFFERENT SHADE OF GREEN - never teal /
// cyan / blue. Hue is locked to a tight green band (≤±8°); the real distinctness
// comes from per-seed SATURATION and LIGHTNESS scaling of the brand-green tokens.
// Indexed by seed. Each row targets a named green so the set reads as a family:
//   0 vivid lime-green  1 bright emerald   2 deep forest green
//   3 soft mint-green   4 rich grass green 5 dark pine
const HUE_OFFSETS = [3, -2, -6, 6, 1, -8, 4, -4]; // degrees, tight green band
const SAT_MULT = [1.12, 1.04, 0.96, 0.72, 1.18, 0.86, 1.0, 0.9]; // per-seed saturation
const LIGHT_MULT = [1.16, 1.0, 0.74, 1.22, 0.92, 0.62, 1.08, 0.82]; // per-seed lightness
const ZOOM_MULT = [1, 1.22, 0.86, 1.34, 0.8, 1.12, 0.94, 1.28];
const WARP_MULT = [1, 0.8, 1.3, 0.68, 1.4, 0.95, 1.16, 0.78];
const SPEED_MULT = [1, 1.2, 0.84, 1.14, 0.9, 1.3, 0.78, 1.06];
const PHASE = [0, 11, 23, 37, 51, 67, 83, 97]; // seconds, desync the loops

const VERTEX_SRC = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT_SRC = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uLo;
uniform vec3 uHi;
uniform vec3 uPeak;
uniform float uZoom;
uniform float uWarp;
uniform float uLevels;
uniform float uIntensity;

// Gyroid: sin(x)cos(y) + sin(y)cos(z) + sin(z)cos(x). Sampling a moving z-slice
// makes the iso-bands flow and morph like the Fluid engine's surface.
float gyroid(vec3 p) { return dot(sin(p), cos(p.zxy)); }

void main() {
  vec2 uv = gl_FragCoord.xy / uRes - 0.5;
  uv.x *= uRes.x / uRes.y;

  vec3 p = vec3(uv * uZoom, uTime * 0.35);
  // Domain warp -> the "warp" character: bands twist instead of marching straight.
  p.xy += uWarp * vec2(sin(p.y * 1.6 + uTime * 0.5), cos(p.x * 1.6 - uTime * 0.4));

  float g = gyroid(p * 3.14159);
  g += 0.55 * gyroid(p * 6.6 + uTime * 0.2);   // second octave -> finer grain
  g += 0.30 * gyroid(p * 13.1 - uTime * 0.1);  // third octave -> intricate detail
  g += 0.16 * gyroid(p * 25.7 + uTime * 0.05); // fourth octave -> dense filigree
  g = clamp(g * 0.30 + 0.5, 0.0, 1.0);

  // Radial falloff so the field melts into the surface at the edges.
  float vig = smoothstep(1.35, 0.1, length(uv));
  g *= vig;

  // ASCII-like density banding: quantize brightness into discrete steps.
  float q = clamp(floor(g * uLevels) / max(uLevels - 1.0, 1.0), 0.0, 1.0);

  vec3 col = mix(uLo, uHi, q * uIntensity);
  col = mix(col, uPeak, smoothstep(0.82, 1.0, q) * 0.5 * uIntensity);
  gl_FragColor = vec4(col, 1.0);
}
`;

// Bayer 4x4 ordered-dither variant for blog covers.
// Replaces ASCII level-banding with a threshold pattern so the surface
// reads as a mint/green halftone grid over the gyroid topology.
const DITHER_FRAGMENT_SRC = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uLo;
uniform vec3 uHi;
uniform vec3 uPeak;
uniform float uZoom;
uniform float uWarp;
uniform float uGrain;

float gyroid(vec3 p) { return dot(sin(p), cos(p.zxy)); }

// 4x4 Bayer ordered-dither threshold. WebGL 1.0 compatible (step/mix only).
float bayer4x4(vec2 fc) {
  vec2 p = mod(floor(fc), 4.0);
  float x = p.x;
  float y = p.y;
  // Row vectors (Bayer values / 16.0)
  vec4 r0 = vec4(0.0, 8.0, 2.0, 10.0) / 16.0;
  vec4 r1 = vec4(12.0, 4.0, 14.0, 6.0) / 16.0;
  vec4 r2 = vec4(3.0, 11.0, 1.0, 9.0) / 16.0;
  vec4 r3 = vec4(15.0, 7.0, 13.0, 5.0) / 16.0;
  // Select row
  vec4 row = mix(
    mix(r0, r1, step(1.0, y)),
    mix(r2, r3, step(1.0, y - 2.0)),
    step(2.0, y)
  );
  // Select column
  return mix(
    mix(row.x, row.y, step(1.0, x)),
    mix(row.z, row.w, step(1.0, x - 2.0)),
    step(2.0, x)
  );
}

// Fast pseudo-random for grain
float hash21(vec2 p) {
  p = fract(p * vec2(443.897, 441.423));
  p += dot(p, p + 19.19);
  return fract(p.x * p.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes - 0.5;
  uv.x *= uRes.x / uRes.y;

  vec3 p = vec3(uv * uZoom, uTime * 0.28);
  p.xy += uWarp * 0.08 * vec2(sin(p.y * 1.4 + uTime * 0.38), cos(p.x * 1.4 - uTime * 0.32));

  float g = gyroid(p * 3.14159);
  g += 0.52 * gyroid(p * 6.4 + uTime * 0.18);
  g += 0.28 * gyroid(p * 12.8 - uTime * 0.09);
  g = clamp(g * 0.32 + 0.5, 0.0, 1.0);

  // Subtle grain before dithering
  float noise = hash21(gl_FragCoord.xy + uTime * 0.07) - 0.5;
  g = clamp(g + noise * uGrain, 0.0, 1.0);

  // Ordered Bayer dithering: per-pixel threshold -> binary hi/lo surface
  float threshold = bayer4x4(gl_FragCoord.xy);
  float dithered = step(threshold, g);

  // Accent peak: brightest dithered cells pick up a hint of the peak token
  vec3 col = mix(uLo, uHi, dithered);
  col = mix(col, uPeak, step(0.78, g) * dithered * 0.45);
  gl_FragColor = vec4(col, 1.0);
}
`;

// Smooth hexagonal-cell surface for blog covers and bento auras.
// Each hex cell displays a single flat color sampled from the gyroid at the
// cell center, giving a honeycomb mosaic feel without the static of Bayer dither.
const HEX_FRAGMENT_SRC = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uLo;
uniform vec3 uHi;
uniform vec3 uPeak;
uniform float uZoom;
uniform float uWarp;
uniform float uGrain;

float gyroid(vec3 p) { return dot(sin(p), cos(p.zxy)); }

float hash21(vec2 p) {
  p = fract(p * vec2(443.897, 441.423));
  p += dot(p, p + 19.19);
  return fract(p.x * p.y);
}

// Nearest pointy-top hex cell center. r = circumradius.
// Two interleaved rectangular grids, WebGL 1.0 safe.
vec2 hexNearest(vec2 p, float r) {
  float W = 1.73205080757 * r;
  float Hrow = 3.0 * r;
  vec2 ca = vec2(round(p.x / W) * W, round(p.y / Hrow) * Hrow);
  float cbx = (round(p.x / W - 0.5) + 0.5) * W;
  float cby = round((p.y - 1.5 * r) / Hrow) * Hrow + 1.5 * r;
  vec2 cb = vec2(cbx, cby);
  return dot(p - ca, p - ca) < dot(p - cb, p - cb) ? ca : cb;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes - 0.5;
  uv.x *= uRes.x / uRes.y;

  vec2 cell = hexNearest(uv, 0.065);

  vec3 p = vec3(cell * uZoom, uTime * 0.28);
  p.xy += uWarp * 0.07 * vec2(sin(p.y * 1.4 + uTime * 0.38), cos(p.x * 1.4 - uTime * 0.32));

  float g = gyroid(p * 3.14159);
  g += 0.52 * gyroid(p * 6.4 + uTime * 0.18);
  g += 0.28 * gyroid(p * 12.8 - uTime * 0.09);
  g = clamp(g * 0.32 + 0.5, 0.0, 1.0);

  // Per-cell grain: constant within a cell, so no pixel-level static
  float noise = hash21(cell * 100.0) - 0.5;
  g = clamp(g + noise * uGrain, 0.0, 1.0);

  // 5-level smooth quantization gives mosaic look without binary harshness
  g = floor(g * 5.0 + 0.5) / 5.0;

  float vig = smoothstep(1.2, 0.15, length(uv));
  g *= vig;

  vec3 col = mix(uLo, uHi, g);
  col = mix(col, uPeak, smoothstep(0.76, 1.0, g) * 0.48);
  gl_FragColor = vec4(col, 1.0);
}
`;

type RGB = [number, number, number];

function readToken(styles: CSSStyleDeclaration, name: string, fallback: RGB): RGB {
  const raw = styles.getPropertyValue(name).trim();
  const hex = raw.startsWith('#') ? raw.slice(1) : '';
  if (hex.length === 6) {
    return [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255
    ];
  }
  if (hex.length === 3) {
    return [
      parseInt(hex[0] + hex[0], 16) / 255,
      parseInt(hex[1] + hex[1], 16) / 255,
      parseInt(hex[2] + hex[2], 16) / 255
    ];
  }
  return fallback;
}

function rgbToHsl([r, g, b]: RGB): RGB {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h / 6, s, l];
}

function hslToRgb([h, s, l]: RGB): RGB {
  if (s === 0) return [l, l, l];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [hue(h + 1 / 3), hue(h), hue(h - 1 / 3)];
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

// Shade a brand-green token into a DIFFERENT SHADE OF GREEN while keeping it
// unmistakably green: nudge hue only a hair (≤±8°, never into teal/cyan), then
// derive the real per-card distinctness from saturation + lightness scaling.
function shadeGreen(rgb: RGB, deg: number, satMul: number, lightMul: number): RGB {
  const hsl = rgbToHsl(rgb);
  hsl[0] = (hsl[0] + deg / 360 + 1) % 1; // tiny hue nudge inside the green band
  hsl[1] = clamp01(hsl[1] * satMul); // per-seed saturation
  hsl[2] = clamp01(hsl[2] * lightMul); // per-seed lightness
  return hslToRgb(hsl);
}

export function GyroidField({
  variant = 'cta',
  seed,
  className
}: {
  variant?: GyroidVariant;
  seed?: number;
  className?: string;
}) {
  const [gateRef, isNear] = useViewportGate<HTMLDivElement>({
    defaultActive: false,
    rootMargin: '600px 0px'
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const base = VARIANTS[variant];
    const hasSeed = typeof seed === 'number';
    const i = hasSeed ? Math.abs(Math.floor(seed)) : 0;
    const hueDeg = hasSeed ? HUE_OFFSETS[i % HUE_OFFSETS.length] : 0;
    const satMul = hasSeed ? SAT_MULT[i % SAT_MULT.length] : 1;
    const lightMul = hasSeed ? LIGHT_MULT[i % LIGHT_MULT.length] : 1;
    const cfg = {
      ...base,
      zoom: base.zoom * (typeof seed === 'number' ? ZOOM_MULT[i % ZOOM_MULT.length] : 1),
      warp: base.warp * (typeof seed === 'number' ? WARP_MULT[i % WARP_MULT.length] : 1),
      speed: base.speed * (typeof seed === 'number' ? SPEED_MULT[i % SPEED_MULT.length] : 1)
    };
    const phase = typeof seed === 'number' ? PHASE[i % PHASE.length] : 0;

    const gl =
      (canvas.getContext('webgl', {
        antialias: false,
        alpha: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: false,
        powerPreference: 'low-power',
        preserveDrawingBuffer: false
      }) as WebGLRenderingContext | null) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) return; // No WebGL: leave the section's own background showing.

    /* ── program ── */
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const fragSrc = variant === 'dither' ? DITHER_FRAGMENT_SRC
                 : variant === 'hex' ? HEX_FRAGMENT_SRC
                 : FRAGMENT_SRC;
    const program = gl.createProgram()!;
    const vertShader = compile(gl.VERTEX_SHADER, VERTEX_SRC);
    const fragShader = compile(gl.FRAGMENT_SHADER, fragSrc);
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[GyroidField] program link failed', gl.getProgramInfoLog(program));
      }
      return;
    }
    // Shaders are linked into the program now; free the standalone GL objects
    // (deleteProgram alone does not free shaders that were never marked).
    gl.deleteShader(vertShader);
    gl.deleteShader(fragShader);
    gl.useProgram(program);

    // Fullscreen triangle (covers clip space with one primitive).
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(program, 'uRes'),
      time: gl.getUniformLocation(program, 'uTime'),
      lo: gl.getUniformLocation(program, 'uLo'),
      hi: gl.getUniformLocation(program, 'uHi'),
      peak: gl.getUniformLocation(program, 'uPeak'),
      zoom: gl.getUniformLocation(program, 'uZoom'),
      warp: gl.getUniformLocation(program, 'uWarp'),
      levels: gl.getUniformLocation(program, 'uLevels'),     // null in dither shader, no-op
      intensity: gl.getUniformLocation(program, 'uIntensity'), // null in dither shader, no-op
      grain: gl.getUniformLocation(program, 'uGrain')        // null in non-dither shaders, no-op
    };

    const styles = getComputedStyle(document.documentElement);
    const lo = readToken(styles, cfg.lo, [0.04, 0.04, 0.05]);
    const hi = shadeGreen(readToken(styles, cfg.hi, [0.0, 0.76, 0.39]), hueDeg, satMul, lightMul);
    const peak = shadeGreen(readToken(styles, cfg.peak, [0.2, 0.83, 0.6]), hueDeg, satMul, lightMul);
    gl.uniform3fv(u.lo, lo);
    gl.uniform3fv(u.hi, hi);
    gl.uniform3fv(u.peak, peak);
    gl.uniform1f(u.zoom, cfg.zoom);
    gl.uniform1f(u.warp, cfg.warp);
    gl.uniform1f(u.levels, cfg.levels);
    gl.uniform1f(u.intensity, cfg.intensity);
    gl.uniform1f(u.grain, cfg.grain ?? 0);

    /* ── size: render at CELL resolution, CSS upscales (pixelate look) ── */
    const resize = () => {
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      const bufW = Math.max(2, Math.min(240, Math.round(w / cfg.cell)));
      const bufH = Math.max(2, Math.min(200, Math.round(h / cfg.cell)));
      canvas.width = bufW;
      canvas.height = bufH;
      gl.viewport(0, 0, bufW, bufH);
      gl.uniform2f(u.res, bufW, bufH);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

    const draw = (timeSeconds: number) => {
      gl.uniform1f(u.time, timeSeconds);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    /* ── reduced motion: one static frame, no loop ── */
    if (reduceMQ.matches) {
      draw(phase + 8.0);
      return () => {
        ro.disconnect();
        gl.deleteProgram(program);
        gl.deleteBuffer(buffer);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    }

    /* ── throttled animation loop, gated to visibility ── */
    let raf = 0;
    let last = 0;
    let elapsed = phase;
    const FRAME_MS = 1000 / 30;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) {
        last = now;
        return;
      }
      const dt = last ? now - last : FRAME_MS;
      if (dt < FRAME_MS) return; // throttle to ~30fps
      last = now;
      elapsed += Math.min(dt, 64) * 0.001 * cfg.speed;
      draw(elapsed);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [variant, seed, isNear]);

  return (
    <div ref={gateRef} aria-hidden className={cn('pointer-events-none', className)}>
      {isNear ? (
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          style={{ imageRendering: 'pixelated', display: 'block' }}
        />
      ) : null}
    </div>
  );
}
