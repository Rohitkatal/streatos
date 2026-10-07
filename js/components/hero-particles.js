// WebGL layer over the hero artwork: drifting golden dust / spice flecks with mouse parallax.
// Cheap on purpose: ~160 points, low-power GPU hint, paused when the hero is off-screen.
import { loadThree, webglOK, reducedMotion, idle } from '../lib/three-loader.js';

export function initHeroParticles() {
  const scene = document.querySelector('.scene');
  if (!scene || !webglOK()) return;
  idle(() => start(scene).catch(err => console.warn('[hero-particles] skipped:', err)));
}

async function start(host) {
  const { THREE } = await loadThree();

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-fx';
  canvas.setAttribute('aria-hidden', 'true');
  host.prepend(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
  camera.position.z = 10;

  // soft round sprite drawn on a canvas, no image file needed
  const sc = document.createElement('canvas'); sc.width = sc.height = 64;
  const g = sc.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(.35, 'rgba(255,255,255,.55)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  const sprite = new THREE.CanvasTexture(sc);

  const small = innerWidth < 700;
  const layer = (count, size, color, opacity) => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count * 4);          // nx, ny, speed, phase
    for (let i = 0; i < count; i++) {
      seed[i * 4] = Math.random() * 2 - 1; seed[i * 4 + 1] = Math.random() * 2 - 1;
      seed[i * 4 + 2] = .02 + Math.random() * .06;     seed[i * 4 + 3] = Math.random() * 6.28;
      pos[i * 3 + 2] = (Math.random() - .5) * 8;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ size, map: sprite, color, transparent: true, opacity,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);
    return { pts, pos, seed, count };
  };
  const layers = [layer(small ? 40 : 110, .16, 0xFFE29A, .75), layer(small ? 18 : 40, .34, 0xFFC96B, .5)];

  let halfW = 6, halfH = 4.6, mx = 0, my = 0, cx = 0, cy = 0, visible = true, last = performance.now(), raf = 0;

  const resize = () => {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    halfH = Math.tan(THREE.MathUtils.degToRad(25)) * 10; halfW = halfH * camera.aspect;
  };
  new ResizeObserver(resize).observe(host); resize();

  host.addEventListener('pointermove', (e) => {
    const r = host.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5;
  });

  const still = reducedMotion();
  function frame(now) {
    raf = 0;
    const dt = Math.min((now - last) / 1000, .05); last = now;
    cx += (mx - cx) * .04; cy += (my - cy) * .04;
    camera.position.x = cx * 1.2; camera.position.y = -cy * .8; camera.lookAt(0, 0, 0);

    for (const L of layers) {
      for (let i = 0; i < L.count; i++) {
        const s = L.seed;
        if (!still) { s[i * 4 + 1] += s[i * 4 + 2] * dt; if (s[i * 4 + 1] > 1.1) s[i * 4 + 1] = -1.1; }
        const wob = Math.sin(now * .0006 + s[i * 4 + 3]) * .25;
        L.pos[i * 3]     = s[i * 4] * halfW * 1.15 + wob;
        L.pos[i * 3 + 1] = s[i * 4 + 1] * halfH * 1.1;
      }
      L.pts.geometry.attributes.position.needsUpdate = true;
    }
    renderer.render(scene, camera);
    if (visible && !document.hidden && !still) raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); }).observe(host);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
  kick();
}
