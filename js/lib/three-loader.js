// Loads Three.js only when a component asks for it (keeps first paint fast).
// "three" and "three/addons/" are mapped in the <script type="importmap"> in index.html.
let cached;
export function loadThree() {
  return (cached ??= Promise.all([
    import('three'),
    import('three/addons/environments/RoomEnvironment.js'),
  ]).then(([THREE, env]) => ({ THREE, RoomEnvironment: env.RoomEnvironment })));
}

export function webglOK() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const idle = (fn) => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 400));
