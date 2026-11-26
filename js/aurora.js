// Aurora cursor: a WebGL light curtain that follows the pointer, shockwave ripples on click,
// and an ambient northern-lights band. Rendered at reduced resolution and blended with "screen".
export function initAurora(canvas, { reduce }) {
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return null;
  const N = 28; // trail points
  const vs = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
  const fs = `
    precision highp float;
    uniform vec2 uRes; uniform float uScale; uniform float uTime; uniform float uEnergy; uniform float uAmb;
    uniform vec2 uP[${N}]; uniform vec4 uC[6];
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }
    float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }
    float seg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-3), 0.0, 1.0); return length(pa - ba * h); }
    vec3 pal(float t){
      vec3 lil = vec3(0.78, 0.69, 1.0), blu = vec3(0.55, 0.74, 1.0), aqu = vec3(0.60, 0.98, 0.96), pnk = vec3(0.96, 0.72, 1.0);
      return t < 0.33 ? mix(lil, blu, t / 0.33) : t < 0.66 ? mix(blu, aqu, (t - 0.33) / 0.33) : mix(aqu, pnk, (t - 0.66) / 0.34);
    }
    void main(){
      vec2 p = vec2(gl_FragCoord.x, uRes.y * uScale - gl_FragCoord.y) / uScale;
      // trail glow
      float g = 0.0, hue = 0.0;
      float flick = fbm(vec2(p.x * 0.012 + uTime * 0.5, p.y * 0.006 - uTime * 0.7));
      for (int i = 0; i < ${N - 1}; i++) {
        float t = float(i) / ${N - 1}.0;
        float d = seg(p, uP[i], uP[i + 1]);
        float w = mix(34.0, 3.0, t) * (0.55 + 0.9 * flick) * (0.6 + uEnergy * 0.8);
        float k = exp(-(d * d) / (w * w)) * (1.0 - t);
        g += k; hue += k * t;
      }
      g *= 0.22;
      float curtain = 0.55 + 0.45 * sin(p.x * 0.09 + flick * 9.0 + uTime * 2.4);
      g *= mix(0.6, 1.35, curtain);
      vec3 col = pal(clamp(hue / max(g * 4.5, 1e-3) + flick * 0.25, 0.0, 1.0)) * g;
      // core
      float core = exp(-pow(length(p - uP[0]) / 7.0, 2.0)) * 0.9;
      col += vec3(0.95, 0.93, 1.0) * core;
      // ripples
      for (int k = 0; k < 6; k++) {
        vec4 c = uC[k]; float age = uTime - c.z;
        if (age > 0.0 && age < 1.8) {
          float life = 1.0 - age / 1.8;
          float r = age * (420.0 + c.w * 900.0);
          float d = length(p - c.xy);
          float ring = exp(-pow((d - r) / (10.0 + age * 18.0), 2.0)) * life;
          float ring2 = exp(-pow((d - r * 0.62) / 6.0, 2.0)) * life * 0.5;
          float ang = atan(p.y - c.y, p.x - c.x);
          col += pal(fract(ang / 6.2831 + age * 0.4)) * (ring + ring2) * (0.55 + c.w * 0.6);
        }
      }
      // ambient aurora band
      if (uAmb > 0.0) {
        vec2 q = p / uRes;
        float band = fbm(vec2(q.x * 3.0 + uTime * 0.05, uTime * 0.08));
        float y0 = 0.18 + band * 0.22;
        float curtainA = pow(fbm(vec2(q.x * 14.0 + uTime * 0.15, q.y * 1.5)), 2.0);
        float shape = exp(-pow((q.y - y0) / (0.06 + band * 0.12), 2.0)) + exp(-pow((q.y - y0 - 0.12) / 0.2, 2.0)) * 0.35;
        col += pal(fract(q.x * 0.8 + band + uTime * 0.02)) * shape * curtainA * 0.55 * uAmb;
      }
      float a = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);
      gl_FragColor = vec4(col, a);
    }`;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(prog, n);
  const uRes = U('uRes'), uScale = U('uScale'), uTime = U('uTime'), uEnergy = U('uEnergy'), uAmb = U('uAmb'), uP = U('uP'), uC = U('uC');
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  let W = innerWidth, H = innerHeight, scale = 0.5;
  function resize() {
    W = innerWidth; H = innerHeight;
    scale = Math.min(window.devicePixelRatio || 1, 2) * (W * H > 1600000 ? 0.42 : 0.55);
    canvas.width = Math.round(W * scale); canvas.height = Math.round(H * scale);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize(); addEventListener('resize', resize);

  const pts = new Float32Array(N * 2);
  let mx = W / 2, my = H / 2, energy = 0, amb = 1, ambT = 1, lastX = mx, lastY = my, moved = false;
  for (let i = 0; i < N; i++) { pts[i * 2] = mx; pts[i * 2 + 1] = my; }
  const clicks = new Float32Array(24); let ci = 0;
  const t0 = performance.now();
  addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; moved = true; }, { passive: true });
  function ripple(x, y, strength = 0.3) {
    const t = (performance.now() - t0) / 1000;
    clicks.set([x, y, t, strength], (ci % 6) * 4); ci++;
  }
  addEventListener('pointerdown', e => ripple(e.clientX, e.clientY, 0.25));

  let running = true;
  function frame(now) {
    requestAnimationFrame(frame);
    if (!running || document.hidden) return;
    const t = (now - t0) / 1000;
    pts[0] += (mx - pts[0]) * 0.55; pts[1] += (my - pts[1]) * 0.55;
    for (let i = 1; i < N; i++) {
      pts[i * 2] += (pts[(i - 1) * 2] - pts[i * 2]) * 0.42;
      pts[i * 2 + 1] += (pts[(i - 1) * 2 + 1] - pts[i * 2 + 1]) * 0.42;
    }
    const sp = Math.hypot(mx - lastX, my - lastY); lastX = mx; lastY = my;
    energy += (Math.min(1, sp / 40) - energy) * 0.08;
    amb += (ambT - amb) * 0.04;
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uRes, W, H); gl.uniform1f(uScale, scale); gl.uniform1f(uTime, reduce ? t * 0.3 : t);
    gl.uniform1f(uEnergy, moved ? energy : 0); gl.uniform1f(uAmb, amb);
    gl.uniform2fv(uP, pts); gl.uniform4fv(uC, clicks);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  requestAnimationFrame(frame);
  return {
    ripple,
    setAmbient(v) { ambT = v; },
    setRunning(v) { running = v; canvas.style.visibility = v ? 'visible' : 'hidden'; }
  };
}
