'use client';

import { useEffect, useRef } from 'react';

/**
 * BrandAura — full-viewport animated background. A WebGL fragment shader renders
 * a slow-flowing brand-green nebula anchored at the top of the page plus a layer
 * of film grain over the cool void. Fully wrapped in try/catch with null guards
 * so it can never throw during hydration; if WebGL is unavailable the canvas
 * stays transparent and the void background shows through. The aura fades out
 * over the first ~700px of scroll. Honours prefers-reduced-motion.
 */
export function BrandAura() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    let raf = 0;
    let cleanup: (() => void) | undefined;

    try {
      const gl = (canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
      if (!gl) return;
      const ctx = gl;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0;

      const vs = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}';
      const fs = `precision highp float;
uniform vec2 u_res;uniform float u_time;uniform float u_red;uniform float u_fade;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));vec2 u=f*f*(3.-2.*f);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res.xy;
  float t=u_time*0.03*(1.0-0.92*u_red);
  vec2 q=vec2(fbm(uv*2.2+vec2(0.0,t)),fbm(uv*2.2+vec2(5.2,t*0.7)));
  float flow=fbm(uv*2.6+q*1.4+vec2(t*0.5,-t*0.3));
  float aura=smoothstep(1.05,0.05,distance(uv,vec2(0.5,0.97)))*u_fade;
  float field=aura*(0.45+0.55*flow);
  vec3 green=vec3(0.0,0.902,0.463);
  vec3 col=vec3(0.031,0.035,0.039);
  col+=green*field*0.16;
  col+=green*flow*aura*0.05;
  float vig=smoothstep(1.25,0.35,length(uv-0.5));
  col*=mix(0.58,1.0,vig);
  float g=hash(gl_FragCoord.xy*0.7+mod(u_time*48.0,1000.0));
  col+=(g-0.5)*0.08*(1.0-0.55*u_red);
  gl_FragColor=vec4(max(col,0.0),1.0);
}`;

      const sh = (type: number, src: string) => {
        const o = ctx.createShader(type);
        if (!o) return null;
        ctx.shaderSource(o, src);
        ctx.compileShader(o);
        return o;
      };
      const v = sh(ctx.VERTEX_SHADER, vs);
      const f = sh(ctx.FRAGMENT_SHADER, fs);
      const prog = ctx.createProgram();
      if (!v || !f || !prog) return;
      ctx.attachShader(prog, v);
      ctx.attachShader(prog, f);
      ctx.linkProgram(prog);
      if (!ctx.getProgramParameter(prog, ctx.LINK_STATUS)) return;
      ctx.useProgram(prog);

      const buf = ctx.createBuffer();
      if (!buf) return;
      ctx.bindBuffer(ctx.ARRAY_BUFFER, buf);
      ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), ctx.STATIC_DRAW);
      const loc = ctx.getAttribLocation(prog, 'a');
      ctx.enableVertexAttribArray(loc);
      ctx.vertexAttribPointer(loc, 2, ctx.FLOAT, false, 0, 0);

      const uRes = ctx.getUniformLocation(prog, 'u_res');
      const uTime = ctx.getUniformLocation(prog, 'u_time');
      const uRed = ctx.getUniformLocation(prog, 'u_red');
      const uFade = ctx.getUniformLocation(prog, 'u_fade');
      ctx.uniform1f(uRed, reduced);

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.floor(window.innerWidth * dpr);
        const h = Math.floor(window.innerHeight * dpr);
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
        ctx.viewport(0, 0, canvas.width, canvas.height);
        ctx.uniform2f(uRes, canvas.width, canvas.height);
      };

      let start: number | null = null;
      const render = (ts: number) => {
        if (start === null) start = ts;
        resize();
        ctx.uniform1f(uTime, (ts - start) / 1000);
        ctx.uniform1f(uFade, Math.max(0, 1 - window.scrollY / 700));
        ctx.drawArrays(ctx.TRIANGLES, 0, 3);
        if (!reduced) raf = requestAnimationFrame(render);
      };
      raf = requestAnimationFrame(render);

      const onResize = () => {
        resize();
        if (reduced) requestAnimationFrame(render);
      };
      window.addEventListener('resize', onResize);
      cleanup = () => window.removeEventListener('resize', onResize);
    } catch {
      // WebGL failed: silently fall back to the CSS void background.
    }

    return () => {
      cancelAnimationFrame(raf);
      cleanup?.();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
