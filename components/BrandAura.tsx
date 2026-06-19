'use client';

import { useEffect, useRef } from 'react';

/**
 * GrainShader (exported as `BrandAura` for drop-in compatibility with page.tsx):
 * a full-viewport fixed WebGL canvas behind all content. Renders an animated
 * film-grain field over the cool void, plus a brand-green ambient aura anchored
 * at the top of the page that fades out over the first ~700px of scroll.
 * Honours prefers-reduced-motion (renders a single static frame). Degrades to
 * the void background colour if WebGL is unavailable.
 */
export function BrandAura() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl =
      (canvas.getContext('webgl') as WebGLRenderingContext | null) ??
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0;

    const vs = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}';
    const fs = `precision highp float;
uniform vec2 u_res;uniform float u_time;uniform float u_red;uniform float u_fade;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));vec2 u=f*f*(3.-2.*f);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.02;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res.xy;
  float t=u_time*0.04*(1.0-0.9*u_red);
  float n=fbm(vec2(uv.x*2.3,uv.y*2.3+t*1.3));
  float aura=smoothstep(1.05,0.05,distance(uv,vec2(0.5,0.96)));
  aura*=(0.55+0.45*n)*u_fade;
  vec3 green=vec3(0.0,0.902,0.463);
  vec3 col=vec3(0.031,0.035,0.039);
  col+=green*aura*0.13;
  float vig=smoothstep(1.25,0.4,length(uv-0.5));
  col*=mix(0.7,1.0,vig);
  float g=hash(gl_FragCoord.xy*0.7+mod(u_time*50.0,1000.0));
  col+=(g-0.5)*0.06*(1.0-0.6*u_red);
  gl_FragColor=vec4(max(col,0.0),1.0);
}`;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRed = gl.getUniformLocation(prog, 'u_red');
    const uFade = gl.getUniformLocation(prog, 'u_fade');
    gl.uniform1f(uRed, reduced);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    let raf = 0;
    let start: number | null = null;
    const render = (ts: number) => {
      if (start === null) start = ts;
      resize();
      const fade = Math.max(0, 1 - window.scrollY / 700);
      gl.uniform1f(uTime, (ts - start) / 1000);
      gl.uniform1f(uFade, fade);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced) raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onResize = () => {
      resize();
      if (reduced) requestAnimationFrame(render);
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
