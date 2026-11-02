/* Asogbon portfolio — 3D liquid-glass hero (three.js, vendored locally) */
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const canvas = document.getElementById("scene");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

function webglOK() {
  try { const c = document.createElement("canvas"); return !!(window.WebGL2RenderingContext && c.getContext("webgl2")); }
  catch { return false; }
}

if (!canvas || !webglOK()) {
  if (canvas) canvas.remove(); // CSS ambient orbs remain as the fallback
} else {
  init();
}

function init() {
  const isMobile = innerWidth < 760;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.3 : 1.75));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0, 11);

  /* ---- Colour sources behind the glass (what the glass refracts) ---- */
  const backdrop = new THREE.Group();
  scene.add(backdrop);
  const glowColors = [0x3b6dff, 0x8b5cf6, 0x22d3ee, 0xec4899, 0x2563eb];
  const glows = glowColors.map((c, i) => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(i === 0 ? 0.95 : 0.55 + Math.random() * 0.3, 48, 48),
      new THREE.MeshBasicMaterial({ color: c })
    );
    m.userData = { r: 0.35 + i * 0.18, s: 0.25 + i * 0.07, o: i * 1.3, y: (i % 2 ? 1 : -1) * 0.25 };
    m.position.z = -1.6;
    backdrop.add(m);
    return m;
  });

  /* ---- Hero object: liquid-glass torus knot ---- */
  const hero = new THREE.Group();
  scene.add(hero);

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.04,
    transmission: 1,
    thickness: 1.6,
    ior: 1.45,
    iridescence: 0.75,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [120, 480],
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.25,
    attenuationColor: new THREE.Color(0xbfd3ff),
    attenuationDistance: 3.5,
    specularIntensity: 1,
  });

  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.25, 0.42, isMobile ? 160 : 260, isMobile ? 24 : 40, 2, 3), glass);
  hero.add(knot);

  /* ---- Floating glass "app icon" tiles (iOS squircles) ---- */
  function squircle(size = 1, r = 0.3, depth = 0.22) {
    const s = size / 2, shape = new THREE.Shape();
    shape.moveTo(-s + r, -s);
    shape.lineTo(s - r, -s); shape.quadraticCurveTo(s, -s, s, -s + r);
    shape.lineTo(s, s - r); shape.quadraticCurveTo(s, s, s - r, s);
    shape.lineTo(-s + r, s); shape.quadraticCurveTo(-s, s, -s, s - r);
    shape.lineTo(-s, -s + r); shape.quadraticCurveTo(-s, -s, -s + r, -s);
    const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 6, curveSegments: 24 });
    g.center();
    return g;
  }
  const tileGlass = glass.clone();
  tileGlass.thickness = 0.6;
  tileGlass.iridescence = 0.4;

  const tiles = [];
  const tileSpecs = [
    { p: [-2.3, 1.7, 0.6], s: 0.95, tint: 0x6f9bff },
    { p: [2.4, -1.5, 0.8], s: 0.8, tint: 0xa78bfa },
    { p: [2.1, 1.9, -0.6], s: 0.6, tint: 0x5eead4 },
    { p: [-2.0, -2.0, -0.3], s: 0.55, tint: 0xf9a8d4 },
  ];
  tileSpecs.forEach((t, i) => {
    const m = tileGlass.clone();
    m.color = new THREE.Color(t.tint);
    m.attenuationColor = new THREE.Color(t.tint);
    m.attenuationDistance = 1.2;
    const mesh = new THREE.Mesh(squircle(t.s, t.s * 0.28, t.s * 0.22), m);
    mesh.position.set(...t.p);
    mesh.rotation.set(Math.random() * 0.6, Math.random() * 0.8, Math.random() * 0.4);
    mesh.userData = { base: new THREE.Vector3(...t.p), sp: 0.4 + i * 0.13, ph: i * 1.7 };
    hero.add(mesh);
    tiles.push(mesh);
  });

  /* ---- Small glass bubbles ---- */
  const bubbles = [];
  const bubbleGeo = new THREE.SphereGeometry(1, 48, 48);
  for (let i = 0; i < (isMobile ? 4 : 7); i++) {
    const b = new THREE.Mesh(bubbleGeo, glass);
    const sc = 0.12 + Math.random() * 0.22;
    b.scale.setScalar(sc);
    b.userData = { a: Math.random() * Math.PI * 2, r: 2.6 + Math.random() * 1.2, sp: 0.15 + Math.random() * 0.25, y: (Math.random() - 0.5) * 3 };
    hero.add(b);
    bubbles.push(b);
  }

  /* Rim lights for specular highlights */
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 4, 5); scene.add(key);
  const rimA = new THREE.PointLight(0x7aa2ff, 30, 20); rimA.position.set(-4, 2, 2); scene.add(rimA);
  const rimB = new THREE.PointLight(0xc084fc, 25, 20); rimB.position.set(4, -3, 1); scene.add(rimB);

  /* ---- Layout: right of the copy on desktop, behind the heading on mobile ---- */
  let layout = {};
  function place() {
    const w = innerWidth, h = innerHeight;
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    const mobile = w < 1020;
    layout = mobile
      ? { x: w < 640 ? 0.35 : 0.9, y: w < 640 ? 1.55 : 1.9, s: w < 640 ? 0.6 : 0.75 }
      : { x: 2.75, y: 0.15, s: 1 };
    hero.position.set(layout.x, layout.y, 0);
    hero.scale.setScalar(layout.s);
    backdrop.position.set(layout.x, layout.y, 0);
    backdrop.scale.setScalar(layout.s);
  }
  place();
  addEventListener("resize", place);

  /* ---- Pointer + scroll ---- */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener("pointermove", (e) => {
    pointer.tx = e.clientX / innerWidth - 0.5;
    pointer.ty = e.clientY / innerHeight - 0.5;
  }, { passive: true });

  let scrollP = 0;
  const onScroll = () => {
    scrollP = Math.min(1.5, scrollY / innerHeight);
    const minOpacity = innerWidth < 1020 ? 0 : 0.28;
    canvas.style.opacity = Math.max(minOpacity, 1 - scrollP * 0.9).toFixed(3);
  };
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  /* ---- Render loop (pauses when hidden / scrolled away on mobile) ---- */
  const clock = new THREE.Clock();
  let running = true;
  document.addEventListener("visibilitychange", () => { running = !document.hidden; if (running) loop(); });

  function frame() {
    const t = reduce ? 0 : clock.getElapsedTime();
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;

    knot.rotation.x = t * 0.18 + pointer.y * 0.6 + scrollP * 1.2;
    knot.rotation.y = t * 0.24 + pointer.x * 0.8;
    knot.position.y = Math.sin(t * 0.8) * 0.12;

    tiles.forEach((m) => {
      const u = m.userData;
      m.position.x = u.base.x + Math.sin(t * u.sp + u.ph) * 0.18 + pointer.x * 0.5;
      m.position.y = u.base.y + Math.cos(t * u.sp * 1.2 + u.ph) * 0.22 - pointer.y * 0.4;
      m.rotation.y += 0.004; m.rotation.x += 0.002;
    });
    bubbles.forEach((b) => {
      const u = b.userData;
      const a = u.a + t * u.sp;
      b.position.set(Math.cos(a) * u.r, u.y + Math.sin(t * 0.7 + u.a) * 0.3, Math.sin(a) * u.r * 0.6);
    });
    glows.forEach((g) => {
      const u = g.userData;
      g.position.x = Math.cos(t * u.s + u.o) * u.r;
      g.position.y = u.y + Math.sin(t * u.s * 1.3 + u.o) * u.r * 0.6;
    });

    hero.position.y = layout.y + scrollP * 2.2;
    hero.rotation.z = pointer.x * -0.08;
    camera.position.x = pointer.x * 0.6;
    camera.position.y = -pointer.y * 0.4;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  function loop() {
    if (!running) return;
    const offscreenMobile = innerWidth < 1020 && scrollP > 1.1;
    if (!offscreenMobile) frame();
    if (!reduce) requestAnimationFrame(loop);
  }
  loop();
  if (reduce) frame();
  document.documentElement.classList.add("has-3d");
}
