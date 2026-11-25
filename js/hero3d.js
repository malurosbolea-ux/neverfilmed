import * as THREE from './three.module.min.js';

// Stage: an intro tunnel of glass frames, then a spiral of frames for the home screen.
export function initStage(canvas, { images, reduce, onHover, onPick }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch (e) { return null; }
  if (!renderer || !renderer.getContext()) return null;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xEDE8FF, 18, 60);
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
  camera.position.set(0, 0, 10);

  const geo = new THREE.PlaneGeometry(1.6, 1, 40, 1);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i); pos.setZ(i, -x * x * 0.2); }
  pos.needsUpdate = true;
  geo.computeVertexNormals();

  const vert = `
    varying vec2 vUv; varying vec3 vN; varying vec3 vV; varying float vFog;
    void main(){
      vUv = uv;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vV = normalize(-mv.xyz);
      vN = normalize(normalMatrix * normal);
      vFog = smoothstep(14.0, 55.0, -mv.z);
      gl_Position = projectionMatrix * mv;
    }`;
  const frag = `
    uniform sampler2D uMap; uniform float uTime; uniform float uHover; uniform float uFade; uniform float uReady;
    varying vec2 vUv; varying vec3 vN; varying vec3 vV; varying float vFog;
    float sdRound(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
    void main(){
      vec2 p = (vUv - 0.5) * vec2(1.6, 1.0);
      float d = sdRound(p, vec2(0.8, 0.5), 0.09);
      float a = 1.0 - smoothstep(0.0, 0.006, d);
      if (a < 0.01) discard;
      vec3 lil = vec3(0.79, 0.72, 1.0);
      vec3 blu = vec3(0.64, 0.76, 1.0);
      vec3 pastel = mix(lil, blu, vUv.x);
      vec3 tex = mix(pastel, texture2D(uMap, vUv).rgb, uReady);
      vec3 col;
      if (gl_FrontFacing) { col = mix(tex, tex * 0.86 + pastel * 0.22, 0.2); col *= 1.0 + uHover * 0.12; }
      else { col = mix(mix(pastel, vec3(1.0), 0.42), tex, 0.12); }
      float wave = 0.5 + 0.5 * sin(uTime * 1.2 + vUv.x * 6.0 + vUv.y * 4.0);
      vec3 ir = mix(lil, blu, wave) + vec3(0.12);
      col = mix(col, ir, smoothstep(-0.04, 0.0, d) * 0.92);
      col += pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.0) * 0.3 * ir;
      float s = abs(fract((vUv.x + vUv.y * 0.5) * 0.5 - uTime * 0.06) - 0.5);
      col += smoothstep(0.035, 0.0, s) * 0.16;
      col = mix(col, vec3(0.93, 0.91, 1.0), vFog);
      gl_FragColor = vec4(col, a * uFade);
    }`;

  const loader = new THREE.TextureLoader();
  const textures = images.map(src => {
    const t = loader.load(src, () => { mats.forEach(m => { if (m.uniforms.uMap.value === t) m.uniforms.uReady.value = 1; }); });
    t.minFilter = THREE.LinearFilter; t.generateMipmaps = false;
    return t;
  });
  const mats = [];
  const makeMat = i => {
    const m = new THREE.ShaderMaterial({
      uniforms: { uMap: { value: textures[i % textures.length] }, uTime: { value: 0 }, uHover: { value: 0 }, uFade: { value: 1 }, uReady: { value: 0 } },
      vertexShader: vert, fragmentShader: frag, transparent: true, side: THREE.DoubleSide
    });
    mats.push(m); return m;
  };

  // spiral (home)
  const rig = new THREE.Group(), group = new THREE.Group();
  rig.add(group); scene.add(rig);
  const N = images.length, meshes = [];
  for (let i = 0; i < N; i++) {
    const m = new THREE.Mesh(geo, makeMat(i));
    const a = (i / N) * Math.PI * 2 * 1.3;
    m.position.set(Math.sin(a) * 2.55, (i - (N - 1) / 2) * 0.43, Math.cos(a) * 2.55);
    m.rotation.y = a;
    m.userData = { i, hover: 0 };
    group.add(m); meshes.push(m);
  }
  group.rotation.set(0.1, 0, -0.3);

  // tunnel (intro)
  const tunnel = new THREE.Group(); scene.add(tunnel);
  const TN = 44;
  for (let i = 0; i < TN; i++) {
    const m = new THREE.Mesh(geo, makeMat(i * 5));
    const a = i * 0.95, r = 2.3 + (i % 3) * 0.35, z = -4 - i * 2.1;
    m.position.set(Math.cos(a) * r, Math.sin(a) * r, z);
    m.lookAt(0, 0, z);
    m.rotateZ((i % 2 ? 1 : -1) * 0.2);
    tunnel.add(m);
  }

  // dust
  const COUNT = 700;
  const pp = new Float32Array(COUNT * 3), ps = new Float32Array(COUNT);
  let seed = 7; const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  for (let i = 0; i < COUNT; i++) { pp[i * 3] = (rnd() - 0.5) * 16; pp[i * 3 + 1] = (rnd() - 0.5) * 11; pp[i * 3 + 2] = 8 - rnd() * 100; ps[i] = 0.4 + rnd() * 1.4; }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  pg.setAttribute('size', new THREE.BufferAttribute(ps, 1));
  const pm = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPx: { value: renderer.getPixelRatio() } },
    vertexShader: `attribute float size; uniform float uTime; uniform float uPx; varying float vA;
      void main(){ vec3 p = position; p.y += sin(uTime * 0.3 + position.x) * 0.15;
        vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_PointSize = size * 10.0 * uPx / max(0.5, -mv.z); vA = 0.35 + 0.4 * size / 1.8;
        gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d);
      gl_FragColor = vec4(mix(vec3(0.66,0.56,1.0), vec3(0.52,0.68,1.0), gl_PointCoord.x), a * vA); }`,
    transparent: true, depthWrite: false
  });
  const dust = new THREE.Points(pg, pm);
  scene.add(dust);

  // state
  let W = 1, H = 1, aspect = 1, scroll = 0, inView = true, active = true;
  let mode = 'gate', m0 = 0, mDur = 1, resolver = null, spinBoost = 0;
  const t0 = performance.now();
  const mouse = new THREE.Vector2(-9, -9), target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  const ray = new THREE.Raycaster();
  let hovered = -1;
  group.visible = false; rig.visible = false;

  function layout() {
    const s = aspect < 1 ? 0.5 + aspect * 0.42 : Math.min(1.08, 0.82 + aspect * 0.12);
    group.scale.setScalar(s);
    rig.position.x = aspect > 1.25 ? 1.75 : aspect > 0.9 ? 0.9 : 0;
    rig.position.y = aspect < 0.9 ? 1.05 : -0.05;
  }
  function resize() {
    W = canvas.clientWidth || innerWidth; H = canvas.clientHeight || innerHeight; aspect = W / H;
    renderer.setSize(W, H, false);
    camera.aspect = aspect; camera.updateProjectionMatrix();
    layout();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  addEventListener('pointermove', e => {
    mouse.x = (e.clientX / innerWidth) * 2 - 1; mouse.y = -(e.clientY / innerHeight) * 2 + 1;
    target.x = mouse.x; target.y = mouse.y;
  });
  new IntersectionObserver(es => { inView = es[0].isIntersecting; }).observe(canvas);

  const easeIn = x => x * x * x;
  const easeOutExpo = x => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
  const speed = reduce ? 0.25 : 1;

  function frame(now) {
    requestAnimationFrame(frame);
    if (!active || !inView || document.hidden) return;
    const t = (now - t0) / 1000;
    cur.x += (target.x - cur.x) * 0.05; cur.y += (target.y - cur.y) * 0.05;
    pm.uniforms.uTime.value = t;

    if (mode === 'gate') {
      camera.position.set(cur.x * 0.4, cur.y * 0.3, 10 - Math.sin(t * 0.4) * 0.6);
      camera.fov = 50; camera.rotation.set(0, 0, t * 0.03);
      tunnel.rotation.z = t * 0.05;
    } else if (mode === 'fly') {
      const p = Math.min(1, (now - m0) / mDur);
      const e = easeIn(p);
      camera.position.set(0, 0, 10 - e * 98);
      camera.fov = 50 + e * 60;
      camera.rotation.set(0, 0, t * 0.03 + e * 1.4);
      tunnel.rotation.z = t * 0.05 + e * 2;
      if (p >= 1) { mode = 'landing'; if (resolver) { resolver(); resolver = null; } }
    } else if (mode === 'land') {
      const p = Math.min(1, (now - m0) / mDur);
      const e = easeOutExpo(p);
      camera.position.set(0, 0, 34 - e * 25);
      camera.fov = 70 - e * 38;
      camera.rotation.set(0, 0, (1 - e) * -0.6);
      spinBoost = (1 - e) * 7;
      if (p >= 1) { mode = 'home'; spinBoost = 0; }
    }
    if (mode === 'home' || mode === 'land') {
      group.rotation.y = t * 0.11 * speed + scroll * 2.6 + spinBoost;
      rig.rotation.x = cur.y * 0.12; rig.rotation.y = cur.x * 0.18;
      group.position.y = scroll * 2.2;
      if (mode === 'home') { camera.position.set(0, 0, 9 - scroll * 2.4); camera.fov = 32; camera.rotation.set(0, 0, 0); }
      ray.setFromCamera(mouse, camera);
      const hit = mode === 'home' ? ray.intersectObjects(meshes, false)[0] : null;
      const h = hit ? hit.object.userData.i : -1;
      if (h !== hovered) { hovered = h; if (onHover) onHover(h); }
      const fade = 1 - Math.min(1, scroll * 1.1) * 0.7;
      for (const m of meshes) {
        m.userData.hover += ((m.userData.i === hovered ? 1 : 0) - m.userData.hover) * 0.12;
        m.material.uniforms.uHover.value = m.userData.hover;
        m.material.uniforms.uFade.value = fade;
        const s = 1 + m.userData.hover * 0.12; m.scale.set(s, s, s);
      }
    }
    camera.updateProjectionMatrix();
    dust.rotation.z = t * 0.01 * speed;
    for (const m of mats) m.uniforms.uTime.value = t;
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);

  return {
    count: N,
    getHovered() { return mode === 'home' ? hovered : -1; },
    setScroll(p) { scroll = p; },
    setActive(v) { active = v; canvas.style.visibility = v ? 'visible' : 'hidden'; },
    fly(ms) { mode = 'fly'; m0 = performance.now(); mDur = ms; return new Promise(r => { resolver = r; }); },
    land(ms) {
      tunnel.visible = false; group.visible = true; rig.visible = true;
      scene.fog.near = 30; scene.fog.far = 90;
      mode = 'land'; m0 = performance.now(); mDur = ms;
    },
    skip() { tunnel.visible = false; group.visible = true; rig.visible = true; scene.fog.near = 30; scene.fog.far = 90; mode = 'home'; }
  };
}
