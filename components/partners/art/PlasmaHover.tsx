"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import s from "./plasma.module.css";

/**
 * Warm plasma behind a card's illustration (DESIGN.md §G.16; inspired by React Bits
 * "Plasma", written in-house: one fragment shader, no library). Domain-warped noise in
 * Roma's paper palette (cream → rose → amber, with Roma red gathering under the cursor),
 * fading to white at the bottom like the --well-warm it replaces.
 *
 * Runs only while the pointer is over the nearest `[data-plasma-host]`: fades in from the
 * cursor, follows it with easing, fades out and stops the rAF loop on leave. The WebGL
 * context is created on first hover. Off on touch / coarse pointers and under reduced
 * motion (the card then shows its normal well). Exception to §A.6.4 / §A.8 approved by
 * the client (20 Nov 2026): a hover-only surface, never a loop while reading.
 */

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uGlow;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = uv * vec2(uRes.x / uRes.y, 1.0) * 1.7;
  float t = uTime * 0.11;

  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 1.3), fbm(p + 3.0 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p + 2.6 * r);

  vec3 cream = vec3(0.992, 0.953, 0.882);
  vec3 rose  = vec3(0.945, 0.839, 0.808);
  vec3 amber = vec3(0.925, 0.655, 0.388);
  vec3 red   = vec3(0.698, 0.082, 0.082);

  vec3 col = mix(cream, rose, smoothstep(0.25, 0.65, f));
  col = mix(col, amber, smoothstep(0.55, 0.9, f) * 0.5);

  vec2 d = (uv - uMouse) * vec2(uRes.x / uRes.y, 1.0);
  float glow = exp(-dot(d, d) * 5.0);
  col = mix(col, red, clamp((0.35 + length(r) * 0.6) * glow * uGlow, 0.0, 0.62));

  // fade into the white card at the bottom (gl y runs upward)
  col = mix(col, vec3(1.0), smoothstep(0.42, 0.0, uv.y) * 0.85);
  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function PlasmaHover() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.closest<HTMLElement>("[data-plasma-host]");
    if (!canvas || !host) return;
    if (prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let gl: WebGLRenderingContext | null = null;
    let uRes: WebGLUniformLocation | null = null;
    let uTime: WebGLUniformLocation | null = null;
    let uMouse: WebGLUniformLocation | null = null;
    let uGlow: WebGLUniformLocation | null = null;
    let failed = false;
    let raf = 0;
    let running = false;
    let start = 0;
    let mix = 0;
    let mixTarget = 0;
    const mouse = { x: 0.5, y: 0.6 };
    const target = { x: 0.5, y: 0.6 };

    const init = () => {
      gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: "low-power" });
      if (!gl) return false;
      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      const prog = gl.createProgram();
      if (!vs || !fs || !prog) return false;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "p");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      uRes = gl.getUniformLocation(prog, "uRes");
      uTime = gl.getUniformLocation(prog, "uTime");
      uMouse = gl.getUniformLocation(prog, "uMouse");
      uGlow = gl.getUniformLocation(prog, "uGlow");
      start = performance.now();
      return true;
    };

    const resize = () => {
      if (!gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const frame = (now: number) => {
      if (!gl) return;
      resize();
      mouse.x += (target.x - mouse.x) * 0.08;
      mouse.y += (target.y - mouse.y) * 0.08;
      mix += (mixTarget - mix) * 0.09;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uGlow, mix);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.style.opacity = String(mix);
      if (mixTarget === 0 && mix < 0.01) {
        running = false;
        canvas.style.opacity = "0";
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const point = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      target.x = Math.min(1.2, Math.max(-0.2, (e.clientX - r.left) / r.width));
      target.y = Math.min(1.2, Math.max(-0.2, 1 - (e.clientY - r.top) / r.height));
    };
    const enter = (e: PointerEvent) => {
      if (failed) return;
      if (!gl && !init()) {
        failed = true;
        return;
      }
      point(e);
      if (mix < 0.02) {
        mouse.x = target.x;
        mouse.y = target.y;
      }
      mixTarget = 1;
      if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };
    const leave = () => {
      mixTarget = 0;
    };

    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointermove", point);
    host.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointermove", point);
      host.removeEventListener("pointerleave", leave);
      const ctx = gl as WebGLRenderingContext | null;
      ctx?.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className={s.canvas} aria-hidden="true" />;
}
