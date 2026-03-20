import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as THREE from 'three';

/* ═══════════════════════ CONSTANTS ════════════════════════════════════ */

const HAIR_SEGMENTS = 4;          // segments per strand for a slight curve
const SPHERE_RADIUS = 1.0;
const COMB_STRENGTH = 0.6;
const RELAX_RATE = 0.0;        // set > 0 for gradual relaxation
const INITIAL_FIELD = 'dipole';   // starting hair pattern

/* ═══════════════════ FIBONACCI SPHERE ════════════════════════════════ */

function fibonacciSphere(n) {
  const pts = [];
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const θ = ga * i;
    pts.push(new THREE.Vector3(Math.cos(θ) * r, y, Math.sin(θ) * r));
  }
  return pts;
}

/* ═══════════════════ TANGENT PROJECTION ══════════════════════════════ */

function projectTangent(normal, v) {
  // v_t = v − (v·n)n
  return v.clone().addScaledVector(normal, -v.dot(normal));
}

function randomTangent(normal) {
  const rand = new THREE.Vector3(
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5,
  );
  const t = projectTangent(normal, rand);
  if (t.lengthSq() < 1e-8) return randomTangent(normal); // retry degenerate
  return t.normalize();
}

/* ═══════════════════ PRESET FIELDS ═══════════════════════════════════ */

function dipoleField(p) {
  // rotation about Y → zeros at poles
  return projectTangent(p, new THREE.Vector3(-p.z, 0, p.x)).normalize();
}

function spiralField(p) {
  const rot = new THREE.Vector3(-p.z, 0, p.x);
  const toN = projectTangent(p, new THREE.Vector3(0, 1, 0));
  const v = rot.add(toN.multiplyScalar(0.5));
  const t = projectTangent(p, v);
  return t.lengthSq() > 1e-8 ? t.normalize() : new THREE.Vector3();
}

function cycloneField(p) {
  const rot = new THREE.Vector3(-p.z, 0, p.x);
  const θ = Math.atan2(Math.sqrt(p.x * p.x + p.z * p.z), p.y);
  const φ = Math.atan2(p.z, p.x);
  const vθ = new THREE.Vector3(
    Math.cos(θ) * Math.cos(φ), -Math.sin(θ), Math.cos(θ) * Math.sin(φ),
  );
  const combined = rot.add(vθ.multiplyScalar(Math.sin(θ) * 0.6));
  const t = projectTangent(p, combined);
  return t.lengthSq() > 1e-8 ? t.normalize() : new THREE.Vector3();
}

const PRESETS = {
  dipole: { label: 'Dipole', fn: dipoleField },
  spiral: { label: 'Spiral', fn: spiralField },
  cyclone: { label: 'Cyclone', fn: cycloneField },
  random: { label: 'Random', fn: null },
};

/* ═══════════════════ COLOUR HELPER ═══════════════════════════════════ */

const _col = new THREE.Color();
function hairColor(mag) {
  // dark-brown at root → lighter at tip; dim when short
  const h = 0.07;                 // warm brown hue
  const s = 0.55 + mag * 0.2;
  const l = 0.18 + mag * 0.22;
  _col.setHSL(h, s, l);
  return _col;
}

/* ═══════════════════════ COMPONENT ═══════════════════════════════════ */

export default function HairyBallSimulator() {
  const containerRef = useRef(null);
  const stateRef = useRef(null);   // holds all Three.js + sim state

  // Settings State
  const [preset, setPreset] = useState(INITIAL_FIELD);
  const [numHairs, setNumHairs] = useState(15000);
  const [hairLength, setHairLength] = useState(0.13);
  const [combRadius, setCombRadius] = useState(0.20);

  const [combed, setCombed] = useState(false);
  const presetRef = useRef(preset);
  const numHairsRef = useRef(numHairs);
  const hairLengthRef = useRef(hairLength);
  const combRadiusRef = useRef(combRadius);

  // Sync refs for the render loop / hooks
  useEffect(() => { presetRef.current = preset; }, [preset]);
  useEffect(() => { numHairsRef.current = numHairs; }, [numHairs]);
  useEffect(() => { hairLengthRef.current = hairLength; }, [hairLength]);
  useEffect(() => { combRadiusRef.current = combRadius; }, [combRadius]);

  /* ── Initialise hair directions from preset ─────────────── */
  const initHairs = useCallback((points, presetKey) => {
    const fn = PRESETS[presetKey]?.fn;
    return points.map(p => {
      if (fn) {
        const t = fn(p);
        return t.lengthSq() > 1e-8 ? t.clone().normalize() : randomTangent(p);
      }
      return randomTangent(p);
    });
  }, []);

  /* ── Build / update the line geometry ───────────────────── */
  const updateHairGeometry = useCallback((state) => {
    const { points, dirs, positions, colors, lineGeo } = state;
    const n = points.length;
    const vertsPerHair = HAIR_SEGMENTS + 1;

    for (let i = 0; i < n; i++) {
      const p = points[i];
      const d = dirs[i];
      const mag = d.length();
      const base = i * vertsPerHair * 3;
      const cBase = i * vertsPerHair * 3;

      for (let s = 0; s <= HAIR_SEGMENTS; s++) {
        const t = s / HAIR_SEGMENTS;
        const len = hairLengthRef.current * mag * t; // Use dynamic length
        // Slight outward curve (lifts away from surface) for realism
        const lift = 0.02 * t * t;
        const px = p.x * (SPHERE_RADIUS + lift) + d.x * len;
        const py = p.y * (SPHERE_RADIUS + lift) + d.y * len;
        const pz = p.z * (SPHERE_RADIUS + lift) + d.z * len;
        const idx = base + s * 3;
        positions[idx] = px;
        positions[idx + 1] = py;
        positions[idx + 2] = pz;

        // Color: root → tip gradient
        const rootColor = hairColor(mag);
        const tipBright = Math.min(1, mag * 1.2);
        colors[cBase + s * 3] = rootColor.r * (1 - t * 0.3) + t * tipBright * 0.9;
        colors[cBase + s * 3 + 1] = rootColor.g * (1 - t * 0.3) + t * tipBright * 0.6;
        colors[cBase + s * 3 + 2] = rootColor.b * (1 - t * 0.3) + t * tipBright * 0.3;
      }
    }

    // Safety checks in case geometry sizes changed
    if (lineGeo.attributes.position) lineGeo.attributes.position.needsUpdate = true;
    if (lineGeo.attributes.color) lineGeo.attributes.color.needsUpdate = true;
  }, []);

  /* ── Full Geometry Rebuild (when Count changes) ─────────── */
  const rebuildGeometry = useCallback((s, count) => {
    // Clean up old geometry
    if (s.linesMesh) {
      s.pivot.remove(s.linesMesh);
      s.lineGeo.dispose();
      s.linesMesh.material.dispose();
    }

    s.points = fibonacciSphere(count);
    s.dirs = initHairs(s.points, presetRef.current);

    const vertsPerHair = HAIR_SEGMENTS + 1;
    const totalVerts = count * vertsPerHair;
    s.positions = new Float32Array(totalVerts * 3);
    s.colors = new Float32Array(totalVerts * 3);

    const indices = [];
    for (let i = 0; i < count; i++) {
      const off = i * vertsPerHair;
      for (let s = 0; s < HAIR_SEGMENTS; s++) indices.push(off + s, off + s + 1);
    }

    s.lineGeo = new THREE.BufferGeometry();
    s.lineGeo.setAttribute('position', new THREE.BufferAttribute(s.positions, 3));
    s.lineGeo.setAttribute('color', new THREE.BufferAttribute(s.colors, 3));
    s.lineGeo.setIndex(indices);

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true, linewidth: 1, transparent: true, opacity: 0.92,
    });
    s.linesMesh = new THREE.LineSegments(s.lineGeo, lineMat);
    s.pivot.add(s.linesMesh);

    updateHairGeometry(s);
  }, [initHairs, updateHairGeometry]);

  /* ── Scene initialisation ───────────────────────────────── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = container.clientWidth;
    const H = container.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.set(0, 0.4, 3.0);
    camera.lookAt(0, 0, 0);

    // Lights
    scene.add(new THREE.AmbientLight(0xffeedd, 0.8));
    const dir1 = new THREE.DirectionalLight(0xffffff, 1.0);
    dir1.position.set(4, 5, 6);
    scene.add(dir1);
    const dir2 = new THREE.DirectionalLight(0x88aaff, 0.35);
    dir2.position.set(-4, -2, -5);
    scene.add(dir2);

    // Sphere
    const sphereGeo = new THREE.SphereGeometry(SPHERE_RADIUS * 0.99, 64, 64);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xf5e6d3, roughness: 0.85, metalness: 0.0,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);

    const pivot = new THREE.Group();
    pivot.add(sphereMesh);
    scene.add(pivot);

    // Comb indicator (we update its scale dynamically later)
    const combGeo = new THREE.RingGeometry(0.95, 1.05, 48);
    const combMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6, transparent: true, opacity: 0.0, side: THREE.DoubleSide,
    });
    const combRing = new THREE.Mesh(combGeo, combMat);
    scene.add(combRing);

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // State ref
    const state = {
      renderer, scene, camera, pivot, sphereMesh, points: [], dirs: [],
      positions: null, colors: null, lineGeo: null, linesMesh: null,
      combRing, combMat, raycaster, mouse,
      isDragging: false, isOrbiting: false,
      prevMouse: new THREE.Vector2(), prevHit: null,
      rotation: new THREE.Euler(0, 0, 0, 'YXZ'),
      frameId: 0,
    };
    stateRef.current = state;

    rebuildGeometry(state, numHairsRef.current);

    // ── Render loop ──
    const animate = () => {
      state.frameId = requestAnimationFrame(animate);

      // Relax (optional slow drift toward original field)
      if (RELAX_RATE > 0) {
        const fn = PRESETS[presetRef.current]?.fn;
        if (fn) {
          const currentCount = s.points.length;
          for (let i = 0; i < currentCount; i++) {
            const target = fn(s.points[i]);
            if (target.lengthSq() > 1e-8) {
              s.dirs[i].lerp(target.normalize(), RELAX_RATE);
              s.dirs[i].copy(projectTangent(s.points[i], s.dirs[i]));
              if (s.dirs[i].lengthSq() > 1e-8) s.dirs[i].normalize();
            }
          }
          updateHairGeometry(s);
        }
      }

      pivot.rotation.copy(state.rotation);
      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ──
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(state.frameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [initHairs, updateHairGeometry]);

  /* ── Reacting to Count Changes ────────────────────────────── */
  useEffect(() => {
    const s = stateRef.current;
    if (!s) return;
    rebuildGeometry(s, numHairs);
    setCombed(false);
  }, [numHairs, rebuildGeometry]);

  /* ── Reacting to Length Changes ───────────────────────────── */
  useEffect(() => {
    const s = stateRef.current;
    if (!s) return;
    updateHairGeometry(s);
  }, [hairLength, updateHairGeometry]);

  /* ── Reset hairs when preset changes ────────────────────── */
  useEffect(() => {
    const s = stateRef.current;
    if (!s) return;
    const newDirs = initHairs(s.points, preset);
    for (let i = 0; i < s.points.length; i++) s.dirs[i].copy(newDirs[i]);
    updateHairGeometry(s);
    setCombed(false);
  }, [preset, initHairs, updateHairGeometry]);

  /* ── Pointer helpers ────────────────────────────────────── */
  const getNDC = useCallback((e) => {
    const rect = containerRef.current.getBoundingClientRect();
    return new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
  }, []);

  const hitSphere = useCallback((ndc) => {
    const s = stateRef.current;
    if (!s) return null;
    s.raycaster.setFromCamera(ndc, s.camera);
    const hits = s.raycaster.intersectObject(s.sphereMesh, false);
    if (hits.length === 0) return null;
    // Transform hit point into pivot local space
    const localPt = s.pivot.worldToLocal(hits[0].point.clone());
    return localPt.normalize();
  }, []);

  const combAt = useCallback((hitPt, direction) => {
    const s = stateRef.current;
    if (!s) return;
    const { points, dirs } = s;
    const radius = combRadiusRef.current;

    // Project comb direction into tangent plane of each nearby hair
    for (let i = 0; i < points.length; i++) {
      const dist = points[i].distanceTo(hitPt);
      if (dist > radius) continue;
      const falloff = 1 - dist / radius;
      const strength = falloff * falloff * COMB_STRENGTH;

      // Project direction to tangent plane at this point
      const tangDir = projectTangent(points[i], direction.clone());
      if (tangDir.lengthSq() < 1e-8) continue;
      tangDir.normalize();

      // Blend toward combed direction
      dirs[i].lerp(tangDir, strength);
      // Re-project to tangent (numerical safety)
      dirs[i].copy(projectTangent(points[i], dirs[i]));
      if (dirs[i].lengthSq() > 1e-8) dirs[i].normalize();
      else dirs[i].set(0, 0, 0);
    }

    updateHairGeometry(s);
    setCombed(true);
  }, [updateHairGeometry]);

  /* ── Pointer events ─────────────────────────────────────── */
  const onPointerDown = useCallback((e) => {
    const s = stateRef.current;
    if (!s) return;
    const ndc = getNDC(e);
    const hit = hitSphere(ndc);

    if (hit) {
      // Combing mode
      s.isDragging = true;
      s.isOrbiting = false;
      s.prevHit = hit;
      s.combMat.opacity = 0.35;
    } else {
      // Orbit mode
      s.isOrbiting = true;
      s.isDragging = false;
    }
    s.prevMouse.copy(ndc);
  }, [getNDC, hitSphere]);

  const onPointerMove = useCallback((e) => {
    const s = stateRef.current;
    if (!s) return;
    const ndc = getNDC(e);

    // Update comb ring position (hover feedback)
    const hitHover = hitSphere(ndc);
    if (hitHover) {
      const worldPt = s.pivot.localToWorld(hitHover.clone().multiplyScalar(SPHERE_RADIUS + 0.02));
      s.combRing.position.copy(worldPt);
      s.combRing.lookAt(s.camera.position);
      // dynamically scale comb ring based on radius setting
      s.combRing.scale.setScalar(combRadiusRef.current);
      if (!s.isDragging) s.combMat.opacity = 0.15;
      containerRef.current.style.cursor = 'crosshair';
    } else {
      s.combMat.opacity = 0.0;
      containerRef.current.style.cursor = s.isOrbiting ? 'grabbing' : 'grab';
    }

    if (s.isDragging) {
      const hit = hitSphere(ndc);
      if (hit && s.prevHit) {
        const dir = hit.clone().sub(s.prevHit);
        if (dir.lengthSq() > 1e-8) {
          combAt(hit, dir.normalize());
        }
        s.prevHit = hit;
      }
    } else if (s.isOrbiting) {
      const dx = ndc.x - s.prevMouse.x;
      const dy = ndc.y - s.prevMouse.y;
      s.rotation.y += dx * 2.5;
      s.rotation.x += dy * 2.5;
      s.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, s.rotation.x));
    }

    s.prevMouse.copy(ndc);
  }, [getNDC, hitSphere, combAt]);

  const onPointerUp = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    s.isDragging = false;
    s.isOrbiting = false;
    s.prevHit = null;
    s.combMat.opacity = 0.0;
  }, []);

  /* ── Reset handler ──────────────────────────────────────── */
  const handleReset = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    const newDirs = initHairs(s.points, presetRef.current);
    for (let i = 0; i < s.points.length; i++) s.dirs[i].copy(newDirs[i]);
    updateHairGeometry(s);
    setCombed(false);
  }, [initHairs, updateHairGeometry]);

  /* ═══════════════════════ RENDER ════════════════════════════════════ */

  return (
    <div className="flex flex-col items-center w-full gap-6 my-8 font-sans">
      <div className="flex flex-col bg-[#FCF8EE] p-6 lg:p-8 backdrop-blur-3xl rounded-[2rem] shadow-[0_8px_32px_rgba(251,146,60,0.15)] bg-orange-50/40 border border-orange-200/50 w-full overflow-hidden relative">

        {/* ── Header & Controls ── */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 border-b border-slate-700 pb-6 mb-4 w-full max-w-5xl mx-auto">
          <div className="text-center xl:text-left flex-shrink-0">
            <h3 id="hairy-ball-simulator" className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight leading-tight">
              Hairy Ball Simulator
            </h3>
          </div>

          <div className="flex gap-3 items-center w-full sm:w-auto justify-center flex-wrap">
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className="h-9 px-4 rounded-xl bg-white/70 border border-gray-200 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 min-w-[130px]"
            >
              {Object.entries(PRESETS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>

            <button
              onClick={handleReset}
              className="h-9 px-6 bg-rose-500/90 hover:bg-rose-500 text-white rounded-xl font-bold shadow-[0_4px_20px_rgba(244,63,94,0.3)] backdrop-blur-sm border border-rose-400/50 flex items-center gap-2 min-w-[100px] justify-center"
            >
              Reset
            </button>
          </div>
        </div>

        {/* ── Settings Panel ── */}
        <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row gap-6 bg-white/50 p-4 rounded-2xl border border-gray-200/60 shadow-sm mb-6 z-10 relative">

          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between text-xs font-bold text-gray-600 uppercase tracking-widest">
              <span>Hair Count</span>
              <span className="text-orange-600">{numHairs.toLocaleString()}</span>
            </div>
            <input
              type="range" min="1000" max="60000" step="1000"
              value={numHairs} onChange={(e) => setNumHairs(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none"
            />
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between text-xs font-bold text-gray-600 uppercase tracking-widest">
              <span>Hair Length</span>
              <span className="text-blue-600">{hairLength.toFixed(2)}</span>
            </div>
            <input
              type="range" min="0.02" max="0.4" step="0.01"
              value={hairLength} onChange={(e) => setHairLength(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none"
            />
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between text-xs font-bold text-gray-600 uppercase tracking-widest">
              <span>Comb Size</span>
              <span className="text-pink-600">{combRadius.toFixed(2)}</span>
            </div>
            <input
              type="range" min="0.05" max="0.8" step="0.01"
              value={combRadius} onChange={(e) => setCombRadius(Number(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none"
            />
          </div>

        </div>

        {/* ── 3D Canvas ── */}
        <div
          ref={containerRef}
          className="w-full aspect-square max-w-[560px] mx-auto cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden"
          style={{ touchAction: 'none' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />

        {/* ── Instructions ── */}
        <div className="flex flex-col items-center mt-4 gap-1">
          <p className="text-center text-sm text-gray-500 font-medium">
            <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-xs font-bold mr-1">Drag on sphere</span>
            to comb the hair ·
            <span className="inline-block bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs font-bold mx-1">Drag outside</span>
            to rotate
          </p>
        </div>
      </div>
    </div>
  );
}
