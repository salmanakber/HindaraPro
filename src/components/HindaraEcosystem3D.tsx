import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ArrowUpRight, ChevronDown, ChevronUp, Layers, RotateCcw } from 'lucide-react';
import {
  computeExplodedPosition,
  ECOSYSTEM_NODES,
  getVentureCameraPose,
  type EcosystemNodeSpec,
} from '../utils/ecosystem3d';

interface HindaraEcosystem3DProps {
  onInspectVenture?: (ventureId: string) => void;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      size * 0.08,
      size / 2,
      size / 2,
      size * 0.5
    );
    gradient.addColorStop(0, 'rgba(6, 4, 16, 0.85)');
    gradient.addColorStop(0.55, 'rgba(12, 8, 28, 0.42)');
    gradient.addColorStop(1, 'rgba(21, 16, 43, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createHindaraMonolithShape(): THREE.Shape {
  const s = new THREE.Shape();
  // Crisp geometric H silhouette centered at (0,0)
  const w = 0.62;
  const h = 0.92;
  const bar = 0.22;
  const cross = 0.14;

  s.moveTo(-w, -h);
  s.lineTo(-w + bar, -h);
  s.lineTo(-w + bar, -cross);
  s.lineTo(w - bar, -cross);
  s.lineTo(w - bar, -h);
  s.lineTo(w, -h);
  s.lineTo(w, h);
  s.lineTo(w - bar, h);
  s.lineTo(w - bar, cross);
  s.lineTo(-w + bar, cross);
  s.lineTo(-w + bar, h);
  s.lineTo(-w, h);
  s.closePath();
  return s;
}

function buildSatelliteGeometry(
  spec: EcosystemNodeSpec,
  sharedDarkMetal: THREE.MeshStandardMaterial,
  sharedSilver: THREE.MeshStandardMaterial,
  castShadow: boolean
): {
  group: THREE.Group;
  accentMat: THREE.MeshStandardMaterial;
  beaconMat: THREE.MeshStandardMaterial;
  innerSpinTarget: THREE.Object3D;
} {
  const group = new THREE.Group();
  group.name = `venture-${spec.id}`;
  group.userData.ventureId = spec.id;

  const accentMat = new THREE.MeshStandardMaterial({
    color: spec.accentHex,
    emissive: spec.accentHex,
    emissiveIntensity: 0.28,
    roughness: 0.24,
    metalness: 0.45,
  });

  const beaconMat = new THREE.MeshStandardMaterial({
    color: spec.accentHex,
    emissive: spec.accentHex,
    emissiveIntensity: 0.85,
    roughness: 0.18,
    metalness: 0.2,
  });

  // 1. Hexagonal anodized pedestal base
  const baseGeo = new THREE.CylinderGeometry(0.46, 0.54, 0.16, 6);
  const baseMesh = new THREE.Mesh(baseGeo, sharedDarkMetal);
  baseMesh.position.y = -0.36;
  baseMesh.castShadow = castShadow;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // 2. Brushed silver collar & accent beacon ring
  const collarGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.08, 24);
  const collarMesh = new THREE.Mesh(collarGeo, sharedSilver);
  collarMesh.position.y = -0.24;
  group.add(collarMesh);

  const ringGeo = new THREE.TorusGeometry(0.41, 0.024, 12, 32);
  const ringMesh = new THREE.Mesh(ringGeo, beaconMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.position.y = -0.2;
  group.add(ringMesh);

  // 3. Distinct multi-part product sculpture
  const innerSpinTarget = new THREE.Group();
  innerSpinTarget.position.y = 0.18;

  if (spec.shapeKind === 'dispatch') {
    // TidyFlow: Stepped field dispatch cards + telemetry tower
    for (let i = 0; i < 3; i += 1) {
      const card = new THREE.Mesh(new THREE.BoxGeometry(0.54 - i * 0.08, 0.09, 0.42), i === 1 ? accentMat : sharedSilver);
      card.position.set(0, -0.14 + i * 0.16, (i - 1) * 0.06);
      card.rotation.y = (i - 1) * 0.18;
      card.castShadow = castShadow;
      innerSpinTarget.add(card);
    }
    const pin = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.24, 16), beaconMat);
    pin.position.set(0, 0.36, 0);
    pin.rotation.x = Math.PI;
    innerSpinTarget.add(pin);
  } else if (spec.shapeKind === 'agent') {
    // TidyAgent: Crystalline AI octahedron core inside precision gyroscope ring
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), accentMat);
    core.castShadow = castShadow;
    innerSpinTarget.add(core);
    const orbit = new THREE.Mesh(new THREE.TorusGeometry(0.39, 0.025, 12, 36), sharedSilver);
    orbit.rotation.set(0.6, 0.4, 0);
    innerSpinTarget.add(orbit);
    const orbit2 = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.018, 12, 36), beaconMat);
    orbit2.rotation.set(-0.7, 0.2, 0.5);
    innerSpinTarget.add(orbit2);
  } else if (spec.shapeKind === 'sync') {
    // TidySync: Twin interlocked sync bridge cylinders + data conduit
    const nodeA = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.38, 16), sharedSilver);
    nodeA.position.set(-0.2, 0, 0);
    nodeA.castShadow = castShadow;
    const nodeB = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.38, 16), accentMat);
    nodeB.position.set(0.2, 0.08, 0);
    nodeB.castShadow = castShadow;
    const bridge = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.032, 12, 28, Math.PI), beaconMat);
    bridge.position.set(0, 0.18, 0);
    innerSpinTarget.add(nodeA, nodeB, bridge);
  } else if (spec.shapeKind === 'shield') {
    // StockSentry: Extruded beveled defense shield prism + radar ring
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, -0.34);
    shieldShape.lineTo(0.28, -0.1);
    shieldShape.lineTo(0.26, 0.26);
    shieldShape.lineTo(0, 0.34);
    shieldShape.lineTo(-0.26, 0.26);
    shieldShape.lineTo(-0.28, -0.1);
    shieldShape.closePath();
    const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.025,
      bevelThickness: 0.025,
    });
    shieldGeo.center();
    const shieldMesh = new THREE.Mesh(shieldGeo, accentMat);
    shieldMesh.castShadow = castShadow;
    const backing = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.52, 0.06), sharedDarkMetal);
    backing.position.z = -0.09;
    innerSpinTarget.add(shieldMesh, backing);
  } else if (spec.shapeKind === 'warranty') {
    // AfterSale OS: Stacked frosted warranty plates + verified crown seal
    for (let i = 0; i < 3; i += 1) {
      const plate = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.07, 0.36),
        i === 2 ? accentMat : sharedSilver
      );
      plate.position.set(0, -0.12 + i * 0.13, 0);
      plate.rotation.y = i * 0.2;
      plate.castShadow = castShadow;
      innerSpinTarget.add(plate);
    }
    const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.06, 20), beaconMat);
    seal.position.set(0.12, 0.21, 0.06);
    innerSpinTarget.add(seal);
  } else {
    // SlotWise: Tilted glass scheduling console on brushed metallic stand
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.2), sharedSilver);
    stand.position.y = -0.22;
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.4, 0.05), sharedDarkMetal);
    screen.position.y = 0.04;
    screen.rotation.x = -0.28;
    screen.castShadow = castShadow;
    const slotBarA = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.07, 0.07), accentMat);
    slotBarA.position.set(0, 0.11, 0.01);
    slotBarA.rotation.x = -0.28;
    const slotBarB = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.07, 0.07), beaconMat);
    slotBarB.position.set(-0.05, -0.02, 0.045);
    slotBarB.rotation.x = -0.28;
    innerSpinTarget.add(stand, screen, slotBarA, slotBarB);
  }

  group.add(innerSpinTarget);

  // Tag every child mesh for raycasting
  group.traverse((obj) => {
    obj.userData.ventureId = spec.id;
  });

  return { group, accentMat, beaconMat, innerSpinTarget };
}

export function HindaraEcosystem3D({ onInspectVenture }: HindaraEcosystem3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isExploded, setIsExploded] = useState(false);
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);

  const selectedIdRef = useRef<string | null>(null);
  const hoveredIdRef = useRef<string | null>(null);
  const explodedRef = useRef(false);
  const resetNonceRef = useRef(0);
  const cameraGoalRef = useRef<{
    active: boolean;
    cam: THREE.Vector3;
    target: THREE.Vector3;
  }>({
    active: false,
    cam: new THREE.Vector3(5.2, 4.85, 6.55),
    target: new THREE.Vector3(0, 0.25, 0),
  });

  selectedIdRef.current = selectedId;
  hoveredIdRef.current = hoveredId;
  explodedRef.current = isExploded;

  const focusVenture = (id: string | null) => {
    setSelectedId(id);
    const pose = getVentureCameraPose(id);
    cameraGoalRef.current.cam.set(...pose.cameraPos);
    cameraGoalRef.current.target.set(...pose.targetPos);
    cameraGoalRef.current.active = true;
  };

  const handleResetView = () => {
    setIsExploded(false);
    setSelectedId(null);
    const pose = getVentureCameraPose(null);
    cameraGoalRef.current.cam.set(...pose.cameraPos);
    cameraGoalRef.current.target.set(...pose.targetPos);
    cameraGoalRef.current.active = true;
    resetNonceRef.current += 1;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    let gl: WebGLRenderingContext | WebGL2RenderingContext;
    try {
      const canvas = document.createElement('canvas');
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        powerPreference: 'high-performance',
        alpha: false,
      });
      gl = renderer.getContext();
    } catch {
      setWebglFailed(true);
      return;
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererName = debugInfo
      ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
      : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(
      rendererName
    );

    if (!isSoftwareGl) {
      // Recreate with antialias enabled on real hardware GPUs
      renderer.dispose();
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false,
      });
      gl = renderer.getContext();
    }

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 320);

    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x15102b);
    scene.fog = new THREE.FogExp2(0x15102b, 0.032);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 80);
    camera.position.set(5.2, 4.85, 6.55);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 4.2;
    controls.maxDistance = 12.5;
    controls.maxPolarAngle = Math.PI * 0.47;
    controls.target.set(0, 0.25, 0);
    controls.update();

    // Cancel camera tween if user starts dragging manually
    const onControlStart = () => {
      cameraGoalRef.current.active = false;
    };
    controls.addEventListener('start', onControlStart);

    // 3-Point Studio Lighting (identical intensity across GPU & Software GL)
    const hemiLight = new THREE.HemisphereLight(0xf3f0ff, 0x1e163d, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e6, 2.35);
    keyLight.position.set(5.5, 8.5, 4.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 22;
    keyLight.shadow.camera.left = -6;
    keyLight.shadow.camera.right = 6;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -6;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x8b5cf6, 1.45);
    rimLight.position.set(-6, 4.5, -5.5);
    scene.add(rimLight);

    const coreGlow = new THREE.PointLight(0x7c3aed, 2.2, 11);
    coreGlow.position.set(0, 1.4, 0);
    scene.add(coreGlow);

    // Studio Ground Plane & Contact Shadow
    const shadowTex = createContactShadowTexture();
    const contactShadow = new THREE.Mesh(
      new THREE.CircleGeometry(5.6, 48),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
      })
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = -0.01;
    scene.add(contactShadow);

    // Shared Studio Materials
    const darkObsidianMat = new THREE.MeshStandardMaterial({
      color: 0x1c1538,
      roughness: 0.38,
      metalness: 0.55,
    });
    const brushedTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0xd9d4f2,
      roughness: 0.24,
      metalness: 0.86,
    });
    const royalVioletMat = new THREE.MeshStandardMaterial({
      color: 0x6d28d9,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.5,
    });
    const warmBrassMat = new THREE.MeshStandardMaterial({
      color: 0xe6c88a,
      roughness: 0.26,
      metalness: 0.88,
    });

    // Grounded Architectural Studio Plinth
    const plinthGroup = new THREE.Group();
    const outerStage = new THREE.Mesh(
      new THREE.CylinderGeometry(4.45, 4.75, 0.22, 48),
      darkObsidianMat
    );
    outerStage.position.y = -0.11;
    outerStage.receiveShadow = true;
    plinthGroup.add(outerStage);

    const orbitalTrackRing = new THREE.Mesh(
      new THREE.TorusGeometry(3.25, 0.032, 14, 72),
      warmBrassMat
    );
    orbitalTrackRing.rotation.x = Math.PI / 2;
    orbitalTrackRing.position.y = 0.015;
    plinthGroup.add(orbitalTrackRing);

    const innerStage = new THREE.Mesh(
      new THREE.CylinderGeometry(1.55, 1.75, 0.26, 36),
      darkObsidianMat
    );
    innerStage.position.y = 0.13;
    innerStage.receiveShadow = true;
    plinthGroup.add(innerStage);

    const innerRim = new THREE.Mesh(
      new THREE.TorusGeometry(1.56, 0.028, 12, 48),
      royalVioletMat
    );
    innerRim.rotation.x = Math.PI / 2;
    innerRim.position.y = 0.26;
    plinthGroup.add(innerRim);
    scene.add(plinthGroup);

    // Central Hindara Labs "H" Composite Monument
    const coreGroup = new THREE.Group();
    coreGroup.position.y = 1.28;

    const hShape = createHindaraMonolithShape();
    const hGeo = new THREE.ExtrudeGeometry(hShape, {
      depth: 0.28,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.045,
      bevelThickness: 0.045,
    });
    hGeo.center();

    const hMonument = new THREE.Mesh(hGeo, royalVioletMat);
    hMonument.castShadow = !isSoftwareGl;
    coreGroup.add(hMonument);

    const hTrimGeo = new THREE.ExtrudeGeometry(hShape, {
      depth: 0.16,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    hTrimGeo.center();
    const hFrame = new THREE.Mesh(hTrimGeo, brushedTitaniumMat);
    hFrame.scale.set(1.06, 1.04, 0.52);
    coreGroup.add(hFrame);

    const gimbalOuter = new THREE.Mesh(
      new THREE.TorusGeometry(1.36, 0.028, 14, 64),
      brushedTitaniumMat
    );
    gimbalOuter.rotation.x = Math.PI * 0.34;
    coreGroup.add(gimbalOuter);

    const gimbalInner = new THREE.Mesh(
      new THREE.TorusGeometry(1.12, 0.022, 14, 56),
      warmBrassMat
    );
    gimbalInner.rotation.y = Math.PI * 0.25;
    coreGroup.add(gimbalInner);
    scene.add(coreGroup);

    // Build 6 Venture Satellite Nodes + Radial Conduit Beams
    const ventureEntries = ECOSYSTEM_NODES.map((spec) => {
      const built = buildSatelliteGeometry(
        spec,
        darkObsidianMat,
        brushedTitaniumMat,
        !isSoftwareGl
      );
      built.group.position.set(...spec.basePosition);
      scene.add(built.group);

      const conduitGeo = new THREE.CylinderGeometry(0.016, 0.016, 1, 8);
      const conduitMat = new THREE.MeshStandardMaterial({
        color: spec.accentHex,
        emissive: spec.accentHex,
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.5,
      });
      const conduit = new THREE.Mesh(conduitGeo, conduitMat);
      scene.add(conduit);

      return {
        spec,
        ...built,
        conduit,
        conduitMat,
      };
    });

    // Raycasting & Pointer Interaction
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const pickVentureId = (clientX: number, clientY: number): string | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return null;
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(
        ventureEntries.map((v) => v.group),
        true
      );
      if (hits.length === 0) return null;
      return (hits[0].object.userData.ventureId as string | undefined) ?? null;
    };

    const handlePointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      const hitId = pickVentureId(e.clientX, e.clientY);
      if (hitId !== hoveredIdRef.current) {
        setHoveredId(hitId);
      }
      renderer.domElement.style.cursor = hitId ? 'pointer' : 'grab';
    };

    const handlePointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 6) return;
      const hitId = pickVentureId(e.clientX, e.clientY);
      if (hitId) {
        focusVenture(hitId);
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    // ResizeObserver for crisp responsive viewport
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.max(Math.floor(entry.contentRect.width), 280);
      const h = Math.max(Math.floor(entry.contentRect.height), 280);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // WebGL context loss / recovery
    let contextLost = false;
    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
    };
    const onContextRestored = () => {
      contextLost = false;
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    // Pre-allocated scratch math objects (zero allocations in tick loop)
    const _originCore = new THREE.Vector3(0, 0.35, 0);
    const _nodeVec = new THREE.Vector3();
    const _midVec = new THREE.Vector3();
    const _upAxis = new THREE.Vector3(0, 1, 0);
    const _dirVec = new THREE.Vector3();

    let explodeLerp = 0;
    let rafId = 0;
    let timerId = 0;
    let disposed = false;
    let prevTime = performance.now();

    function afterDraw(callback: () => void) {
      if ('fenceSync' in gl && typeof (gl as WebGL2RenderingContext).fenceSync === 'function') {
        const gl2 = gl as WebGL2RenderingContext;
        const sync = gl2.fenceSync(gl2.SYNC_GPU_COMMANDS_COMPLETE, 0);
        if (sync) {
          gl2.flush();
          const poll = () => {
            if (disposed) {
              gl2.deleteSync(sync);
              return;
            }
            const status = gl2.clientWaitSync(sync, 0, 0);
            if (status === gl2.TIMEOUT_EXPIRED) {
              rafId = requestAnimationFrame(poll);
            } else {
              gl2.deleteSync(sync);
              timerId = window.setTimeout(callback, 80);
            }
          };
          rafId = requestAnimationFrame(poll);
          return;
        }
      }
      timerId = window.setTimeout(callback, 80);
    }

    const tick = () => {
      if (disposed) return;
      if (!contextLost) {
        const now = performance.now();
        const dt = Math.min((now - prevTime) / 1000, 0.05);
        prevTime = now;
        const t = now * 0.001;

        const targetExplode = explodedRef.current ? 1 : 0;
        explodeLerp = THREE.MathUtils.damp(explodeLerp, targetExplode, 5.5, dt);

        // Animate central Hindara monument & gimbals
        coreGroup.position.y = 1.28 + explodeLerp * 0.65 + Math.sin(t * 1.4) * 0.04;
        hMonument.rotation.y = t * 0.32;
        hFrame.rotation.y = t * 0.32;
        gimbalOuter.rotation.z = t * 0.42;
        gimbalInner.rotation.x = -t * 0.55;

        // Animate each SaaS satellite module + radial conduit
        for (let i = 0; i < ventureEntries.length; i += 1) {
          const item = ventureEntries[i];
          const [ex, ey, ez] = computeExplodedPosition(
            item.spec.basePosition,
            item.spec.explodeOffset,
            explodeLerp
          );
          const floatOffset = Math.sin(t * 1.8 + i * 1.1) * 0.05;
          item.group.position.set(ex, ey + floatOffset, ez);

          const isSelected = selectedIdRef.current === item.spec.id;
          const isHovered = hoveredIdRef.current === item.spec.id;
          const targetScale = isSelected ? 1.22 : isHovered ? 1.12 : 1;
          const nextScale = THREE.MathUtils.damp(item.group.scale.x, targetScale, 8, dt);
          item.group.scale.setScalar(nextScale);

          item.innerSpinTarget.rotation.y = t * (isSelected ? 1.15 : 0.45) + i * 0.7;
          item.accentMat.emissiveIntensity = isSelected ? 0.85 : isHovered ? 0.55 : 0.28;
          item.beaconMat.emissiveIntensity = isSelected ? 1.45 : isHovered ? 1.1 : 0.75;
          item.conduitMat.emissiveIntensity = isSelected ? 1.1 : 0.35;

          // Align conduit cylinder between core anchor and node pedestal
          _nodeVec.set(ex, ey - 0.32 + floatOffset, ez);
          _midVec.addVectors(_originCore, _nodeVec).multiplyScalar(0.5);
          _dirVec.subVectors(_nodeVec, _originCore);
          const len = Math.max(_dirVec.length(), 0.001);
          item.conduit.position.copy(_midVec);
          item.conduit.scale.set(1, len, 1);
          item.conduit.quaternion.setFromUnitVectors(_upAxis, _dirVec.normalize());
        }

        // Smooth camera transition when inspecting a node or resetting
        if (cameraGoalRef.current.active) {
          camera.position.x = THREE.MathUtils.damp(
            camera.position.x,
            cameraGoalRef.current.cam.x,
            5.2,
            dt
          );
          camera.position.y = THREE.MathUtils.damp(
            camera.position.y,
            cameraGoalRef.current.cam.y,
            5.2,
            dt
          );
          camera.position.z = THREE.MathUtils.damp(
            camera.position.z,
            cameraGoalRef.current.cam.z,
            5.2,
            dt
          );
          controls.target.x = THREE.MathUtils.damp(
            controls.target.x,
            cameraGoalRef.current.target.x,
            5.8,
            dt
          );
          controls.target.y = THREE.MathUtils.damp(
            controls.target.y,
            cameraGoalRef.current.target.y,
            5.8,
            dt
          );
          controls.target.z = THREE.MathUtils.damp(
            controls.target.z,
            cameraGoalRef.current.target.z,
            5.8,
            dt
          );
          if (
            camera.position.distanceTo(cameraGoalRef.current.cam) < 0.04 &&
            controls.target.distanceTo(cameraGoalRef.current.target) < 0.03
          ) {
            cameraGoalRef.current.active = false;
          }
        }

        controls.update();
        renderer.render(scene, camera);
      }

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    if (isSoftwareGl) {
      renderer.render(scene, camera);
      afterDraw(tick);
    } else {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.clearTimeout(timerId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      shadowTex.dispose();
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  const activeNode =
    ECOSYSTEM_NODES.find((node) => node.id === (selectedId ?? hoveredId)) ?? null;

  return (
    <div
      data-testid="hindara-3d-stage"
      className="relative h-[460px] w-full overflow-hidden rounded-2xl border border-[#2a2932] bg-[#141418] shadow-xl sm:h-[520px]"
    >
      {webglFailed ? (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center text-[#f6f3ff]">
          <p className="font-mono text-xs tracking-wider text-violet-300 uppercase">
            Hindara Labs · 6 SaaS Architecture
          </p>
          <p className="mt-3 font-display text-2xl font-bold">
            TidyFlow · TidyAgent · TidySync · StockSentry · AfterSale OS · SlotWise
          </p>
          <p className="mt-2 max-w-md text-sm text-violet-200/80">
            Interactive 3D WebGL preview is unavailable on this browser session. Explore all
            six live products in the portfolio showcase below.
          </p>
        </div>
      ) : (
        <div ref={mountRef} className="h-full w-full" aria-label="Interactive 3D Hindara Labs SaaS constellation" />
      )}

      {/* Top HUD Bar — No backdrop-blur over WebGL canvas */}
      <div className="pointer-events-none absolute inset-x-4 top-4 flex flex-wrap items-start justify-between gap-3">
        <div className="pointer-events-auto rounded-xl border border-[#2e2352] bg-[#15102b]/92 px-3.5 py-2 text-xs text-violet-100">
          <p className="font-mono text-[11px] tracking-wider text-violet-300 uppercase">
            Hindara Core · Interactive 3D
          </p>
          <p className="mt-0.5 text-[11px] text-violet-200/80">
            Drag to orbit · Click any module to focus
          </p>
        </div>

        {activeNode && (
          <div
            data-testid="3d-selected-hud"
            className="pointer-events-auto flex items-center gap-3 rounded-xl border border-violet-500/40 bg-[#15102b]/95 px-4 py-2.5 text-white shadow-lg"
          >
            <div className="min-w-0">
              <p className="font-mono text-[11px] text-violet-300 tabular-nums">
                {activeNode.index} · {activeNode.categoryLabel}
              </p>
              <p className="font-display text-sm font-bold">{activeNode.name}</p>
              <p className="font-mono text-[11px] text-violet-200/75">{activeNode.domainLabel}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {onInspectVenture && (
                <button
                  type="button"
                  onClick={() => onInspectVenture(activeNode.id)}
                  className="rounded-lg border border-violet-400/40 bg-violet-950/60 px-2.5 py-1.5 text-xs font-semibold text-violet-100 transition-colors hover:bg-violet-800/70"
                >
                  Inspect
                </button>
              )}
              <a
                href={activeNode.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${activeNode.name} live site`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#7c3aed] text-white transition-colors hover:bg-[#6d28d9]"
              >
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Single Collapsible Bottom Control Dock */}
      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-col items-center">
        <div className="pointer-events-auto w-full max-w-2xl rounded-2xl border border-[#2e2352] bg-[#15102b]/92 p-2.5 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsExploded((prev) => !prev)}
                aria-pressed={isExploded}
                className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isExploded
                    ? 'bg-[#7c3aed] text-white'
                    : 'border border-[#2e2352] bg-[#1e173d] text-violet-100 hover:border-violet-500/50'
                }`}
              >
                <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                {isExploded ? 'Collapse Layers' : 'Explode Layers'}
              </button>

              <button
                type="button"
                onClick={handleResetView}
                className="inline-flex min-h-[34px] items-center gap-1.5 rounded-lg border border-[#2e2352] bg-[#1e173d] px-3 py-1.5 text-xs font-semibold text-violet-100 transition-colors hover:border-violet-500/50"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset View
              </button>
            </div>

            <button
              type="button"
              onClick={() => setControlsCollapsed((prev) => !prev)}
              aria-expanded={!controlsCollapsed}
              className="inline-flex min-h-[34px] items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-violet-200 hover:text-white"
            >
              {controlsCollapsed ? (
                <>
                  Show Ventures <ChevronUp className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  Hide Controls <ChevronDown className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>

          {!controlsCollapsed && (
            <div className="mt-2 grid grid-cols-3 gap-1.5 border-t border-[#2e2352] pt-2 sm:grid-cols-6">
              {ECOSYSTEM_NODES.map((node) => {
                const isSelected = selectedId === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => focusVenture(isSelected ? null : node.id)}
                    aria-pressed={isSelected}
                    className={`rounded-lg px-2 py-1.5 text-left transition-colors ${
                      isSelected
                        ? 'bg-[#7c3aed] text-white'
                        : 'bg-[#1c1538] text-violet-100 hover:bg-[#292050]'
                    }`}
                  >
                    <span className="block font-mono text-[10px] opacity-75 tabular-nums">
                      {node.index}
                    </span>
                    <span className="block truncate font-display text-[11px] font-semibold">
                      {node.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
