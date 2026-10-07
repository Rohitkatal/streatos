// Real 3D product pouch for the "Origin story" section.
//  - pillow-shaped pouch geometry, label painted on a <canvas> texture, crinkle bump map
//  - image-based lighting (RoomEnvironment) for believable plastic reflections
//  - orbiting rajma beans (InstancedMesh), blob shadow, drag / arrow-key rotation
// If WebGL or the CDN is unavailable the original HTML .pack label stays visible.
import { loadThree, webglOK, reducedMotion } from '../lib/three-loader.js';

export function initPack3D() {
  const stack = document.querySelector('.story .stack');
  const pack = stack?.querySelector('.pack');
  if (!stack || !pack || !webglOK()) return;

  const data = {
    title: pack.querySelector('h2')?.textContent.trim() || 'Bhaderwahi Rajma',
    origin: pack.querySelector('.origin b')?.textContent.trim() || 'Bhaderwah, Jammu & Kashmir',
    pos: pack.querySelectorAll('.origin b')[1]?.textContent.trim() || '32°58′N 75°43′E',
    line: pack.querySelector('.pack-body > p')?.textContent.trim() || 'From the mountains to kitchens across India.',
    glyph: pack.querySelector('#glyph'),
  };

  const stage = document.createElement('div');
  stage.className = 'stage3d';
  stage.innerHTML = '<canvas tabindex="0" role="img" aria-label="Interactive 3D model of the ' + data.title +
    ' pack. Drag, or use the left and right arrow keys, to rotate it."></canvas><span class="hint">Drag to rotate</span>';
  stack.insertBefore(stage, pack);

  const io = new IntersectionObserver(async ([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    try { await start(stage, stack, data); }
    catch (err) { console.warn('[pack3d] falling back to HTML label:', err); stage.remove(); stack.classList.remove('has-3d'); }
  }, { rootMargin: '300px' });
  io.observe(stage);
}

/* ---------- label textures painted with the 2D canvas API ---------- */
function paintFront(THREE, data, aniso) {
  const W = 1024, H = 1396, c = Object.assign(document.createElement('canvas'), { width: W, height: H });
  const g = c.getContext('2d');
  const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#1E7A3C'); bg.addColorStop(1, '#0F3D22');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);

  g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(0, 0, W, 120);          // top seal
  g.fillRect(0, H - 90, W, 90);                                        // bottom seal
  g.fillStyle = 'rgba(255,255,255,.35)';                               // seal crimps
  for (let x = 0; x < W; x += 14) { g.fillRect(x, 20, 6, 80); g.fillRect(x, H - 70, 6, 50); }

  g.textAlign = 'center'; g.fillStyle = '#FFE08A';
  g.font = '110px "Yatra One", Georgia, serif'; g.letterSpacing = '10px';
  g.fillText('STREATOS', W / 2, 270);
  g.letterSpacing = '4px'; g.font = '500 30px "DM Mono", monospace'; g.fillStyle = 'rgba(255,224,138,.8)';
  g.fillText('EXAMPLE LABEL', W / 2, 322);

  // cream window panel
  const px = 70, py = 380, pw = W - 140, ph = 700, r = 54;
  g.fillStyle = '#F6E7C8'; g.beginPath(); g.roundRect(px, py, pw, ph, r); g.fill();
  g.strokeStyle = '#B8800F'; g.lineWidth = 6; g.setLineDash([4, 14]); g.lineCap = 'round';
  g.beginPath(); g.roundRect(px + 22, py + 22, pw - 44, ph - 44, r - 20); g.stroke(); g.setLineDash([]);

  g.fillStyle = '#0F3D22'; g.letterSpacing = '0px';
  const words = data.title.split(' ');
  g.font = '128px "Yatra One", Georgia, serif';
  if (words.length > 1) { g.fillText(words[0], W / 2, py + 190); g.fillText(words.slice(1).join(' '), W / 2, py + 330); }
  else g.fillText(data.title, W / 2, py + 260);

  // kidney beans
  const bean = (x, y, rot, s) => {
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
    g.fillStyle = '#8E1F1A'; g.beginPath(); g.ellipse(0, 0, 60, 36, 0, 0, 7); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.45)'; g.lineWidth = 5; g.beginPath(); g.moveTo(-34, -8); g.quadraticCurveTo(0, -30, 34, -8); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.ellipse(-44, 12, 8, 5, 0, 0, 7); g.fill(); g.restore();
  };
  bean(W / 2 - 150, py + 450, -.3, 1); bean(W / 2, py + 470, .25, 1.15); bean(W / 2 + 160, py + 445, -.1, .95);

  g.fillStyle = '#4E6357'; g.font = '500 34px "DM Mono", monospace';
  g.fillText('Origin: ' + data.origin, W / 2, py + 580);
  g.fillText(data.pos, W / 2, py + 628);

  g.fillStyle = '#FFF'; g.font = '56px "Yatra One", Georgia, serif';
  g.fillText('Scan for the origin story', W / 2, 1190);

  // scan glyph (same pattern as the site's #glyph), bottom-left
  if (data.glyph) {
    const rects = [...data.glyph.querySelectorAll('rect')], n = 9, cell = 11, ox = 90, oy = 1220;
    g.fillStyle = '#fff'; g.beginPath(); g.roundRect(ox - 10, oy - 10, n * cell + 20, n * cell + 20, 10); g.fill();
    g.fillStyle = '#10231C';
    rects.forEach(el => g.fillRect(ox + el.getAttribute('x') * cell, oy + el.getAttribute('y') * cell, cell, cell));
  }
  g.fillStyle = 'rgba(255,255,255,.85)'; g.textAlign = 'right'; g.font = '500 30px "DM Mono", monospace';
  g.fillText('NET WT 500 g', W - 90, 1296);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; return t;
}

function paintBack(THREE, data, aniso) {
  const W = 1024, H = 1396, c = Object.assign(document.createElement('canvas'), { width: W, height: H });
  const g = c.getContext('2d');
  const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#176B33'); bg.addColorStop(1, '#0B2E1A');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  g.textAlign = 'center'; g.fillStyle = '#FFE08A'; g.font = '84px "Yatra One", Georgia, serif';
  g.fillText('The Origin Story', W / 2, 330);
  g.fillStyle = '#EAF1E4'; g.font = '500 38px "DM Mono", monospace';
  const lines = (data.line + ' Every Streatos pack carries the place, the farming and the people behind it.').match(/.{1,34}(\s|$)/g) || [];
  lines.slice(0, 8).forEach((l, i) => g.fillText(l.trim(), W / 2, 460 + i * 62));
  g.fillStyle = '#FFE08A'; g.fillText('streatos.com', W / 2, H - 200);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; return t;
}

function crinkle(THREE) {                          // grayscale noise => bumpMap gives the plastic-film wrinkles
  const c = Object.assign(document.createElement('canvas'), { width: 512, height: 512 });
  const g = c.getContext('2d'); g.fillStyle = '#808080'; g.fillRect(0, 0, 512, 512);
  if ('filter' in g) g.filter = 'blur(2px)';
  for (let i = 0; i < 260; i++) {
    const v = 70 + Math.random() * 120 | 0;
    g.strokeStyle = `rgb(${v},${v},${v})`; g.lineWidth = 1 + Math.random() * 5;
    g.beginPath(); const x = Math.random() * 512, y = Math.random() * 512;
    g.moveTo(x, y); g.lineTo(x + (Math.random() - .5) * 140, y + (Math.random() - .5) * 140); g.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1.6, 2.2); return t;
}

/* ---------- scene ---------- */
async function start(stage, stack, data) {
  const { THREE, RoomEnvironment } = await loadThree();
  await Promise.all([document.fonts?.load('64px "Yatra One"'), document.fonts?.load('30px "DM Mono"')].filter(Boolean)).catch(() => {});

  const canvas = stage.querySelector('canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  const aniso = renderer.capabilities.getMaxAnisotropy();

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = .85;
  const camera = new THREE.PerspectiveCamera(32, 1, .1, 60);

  const key = new THREE.DirectionalLight(0xfff1d6, 2.1); key.position.set(3, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0x9fe3b0, .9);  rim.position.set(-4, 2, -3); scene.add(rim);

  // pouch: a subdivided box, pushed out into a pillow and pinched at the seams
  const PW = 2.2, PH = 3.1, PD = .5;
  const geo = new THREE.BoxGeometry(PW, PH, PD, 28, 40, 6);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const nx = p.getX(i) / (PW / 2), ny = p.getY(i) / (PH / 2), z = p.getZ(i);
    const edge = 1 - (1 - nx ** 4) * (1 - ny ** 4);
    const bulge = (1 - nx * nx) * (1 - Math.abs(ny) ** 6) * .34;
    p.setZ(i, z * (1 - .8 * edge) + Math.sign(z) * bulge);
  }
  geo.computeVertexNormals();

  const bump = crinkle(THREE);
  const film = (extra) => new THREE.MeshPhysicalMaterial({ roughness: .42, metalness: .05, clearcoat: .7, clearcoatRoughness: .28, bumpMap: bump, bumpScale: 1.1, ...extra });
  const side = film({ color: 0x14502a });
  const pouch = new THREE.Mesh(geo, [side, side, side, side,
    film({ map: paintFront(THREE, data, aniso) }),     // +z front
    film({ map: paintBack(THREE, data, aniso) })]);    // -z back
  scene.add(pouch);

  // contact shadow
  const sh = Object.assign(document.createElement('canvas'), { width: 128, height: 128 });
  const sg = sh.getContext('2d'), rg = sg.createRadialGradient(64, 64, 0, 64, 64, 64);
  rg.addColorStop(0, 'rgba(0,0,0,.42)'); rg.addColorStop(1, 'rgba(0,0,0,0)'); sg.fillStyle = rg; sg.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.5),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sh), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.85; scene.add(shadow);

  // orbiting beans
  const N = 26;
  const beanGeo = new THREE.SphereGeometry(.11, 20, 14); beanGeo.scale(1.55, .95, .8);
  const beans = new THREE.InstancedMesh(beanGeo,
    new THREE.MeshPhysicalMaterial({ color: 0x8e1f1a, roughness: .32, clearcoat: .5, clearcoatRoughness: .4 }), N);
  scene.add(beans);
  const B = Array.from({ length: N }, () => ({
    a: Math.random() * 6.28, r: 1.65 + Math.random() * .6, y: (Math.random() - .5) * 3.2,
    s: (.12 + Math.random() * .22) * (Math.random() < .5 ? -1 : 1), ph: Math.random() * 6.28,
    rx: Math.random() * 6, ry: Math.random() * 6, spin: .4 + Math.random() * 1.2,
  }));
  const dummy = new THREE.Object3D();

  // controls
  const reduce = reducedMotion();
  let yaw = 0, target = 0, vel = 0, dragging = false, lastX = 0, px = 0, py = 0;
  const touch = () => stage.classList.add('touched');
  canvas.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); stage.classList.add('drag'); touch(); });
  const up = () => { dragging = false; stage.classList.remove('drag'); };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect(); px = (e.clientX - r.left) / r.width - .5; py = (e.clientY - r.top) / r.height - .5;
    if (dragging) { const dx = e.clientX - lastX; lastX = e.clientX; target += dx * .012; vel = dx * .012; }
  });
  canvas.addEventListener('pointerleave', () => { px = py = 0; });
  canvas.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { target -= .3; touch(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { target += .3; touch(); e.preventDefault(); }
  });

  const resize = () => {
    const w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.position.set(0, .25, Math.max(7.6, 8.5 / camera.aspect)); camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(stage); resize();

  let visible = true, raf = 0, last = performance.now(), t = 0, first = true;
  function frame(now) {
    raf = 0;
    const dt = Math.min((now - last) / 1000, .05); last = now; t += dt;

    if (!dragging) { target += vel; vel *= .92; }
    yaw += (target - yaw) * Math.min(1, dt * 8);
    const sway = reduce || dragging || stage.classList.contains('touched') ? 0 : Math.sin(t * .7) * .32;
    pouch.rotation.y = yaw + sway + px * .35;
    pouch.rotation.x = py * .18;
    pouch.position.y = reduce ? 0 : Math.sin(t * 1.1) * .06;

    for (let i = 0; i < N; i++) {
      const b = B[i]; if (!reduce) b.a += b.s * dt;
      dummy.position.set(Math.cos(b.a) * b.r, b.y + (reduce ? 0 : Math.sin(t * .9 + b.ph) * .12), Math.sin(b.a) * b.r * .6);
      dummy.rotation.set(b.rx + t * b.spin * .3, b.ry + t * b.spin * .4, 0);
      dummy.updateMatrix(); beans.setMatrixAt(i, dummy.matrix);
    }
    beans.instanceMatrix.needsUpdate = true;

    renderer.render(scene, camera);
    if (first) { first = false; stage.classList.add('ready'); stack.classList.add('has-3d'); }
    if (visible && !document.hidden) raf = requestAnimationFrame(frame);
  }
  const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); }).observe(stage);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); stage.remove(); stack.classList.remove('has-3d'); });
  kick();
}
