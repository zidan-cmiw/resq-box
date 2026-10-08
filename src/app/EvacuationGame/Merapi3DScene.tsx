import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { useRuntimeStore } from '../../store/runtimeStore';
import { retroAudio } from '../../utils/retroAudio';
import {
  CURVED_ROADS_DATA,
  ROAD_JUNCTION_NODES,
  CURVED_RIVERS_DATA,
  CALIBRATED_BRIDGES,
  CALIBRATED_BUILDINGS,
} from './merapiCurvedMapData';

// ── DEFINISI KOORDINAT & DATA GEOGRAFI 3D MERAPI STL ────────────────
// Puncak Kawah Merapi di STL setelah center, rotateX(-90deg), dan scale Y 2.8x
const PEAK_X = -25.28;
const PEAK_Z = -47.0;

// Jalur Alur Lahar Lembah Kawah Utama (Kali Gendol, Kali Kuning, Kali Boyong) untuk Awan Panas
const LAVA_STREAM_GENDOL = [
  new THREE.Vector3(-25.28, 0, -47.0),
  new THREE.Vector3(-20.0, 0, -35.0),
  new THREE.Vector3(-14.0, 0, -22.0),
  new THREE.Vector3(-6.0, 0, -6.0),
  new THREE.Vector3(4.0, 0, 10.0),
  new THREE.Vector3(14.0, 0, 24.0),
  new THREE.Vector3(22.0, 0, 38.0),
  new THREE.Vector3(28.0, 0, 56.0),
];

const LAVA_STREAM_KUNING = [
  new THREE.Vector3(-25.28, 0, -47.0),
  new THREE.Vector3(-23.0, 0, -32.0),
  new THREE.Vector3(-19.0, 0, -18.0),
  new THREE.Vector3(-14.0, 0, -4.0),
  new THREE.Vector3(-10.0, 0, 12.0),
  new THREE.Vector3(-9.0, 0, 28.0),
  new THREE.Vector3(-10.5, 0, 46.0),
  new THREE.Vector3(-11.5, 0, 65.0),
];

const LAVA_STREAM_BOYONG = [
  new THREE.Vector3(-25.28, 0, -47.0),
  new THREE.Vector3(-29.0, 0, -34.0),
  new THREE.Vector3(-34.0, 0, -18.0),
  new THREE.Vector3(-38.5, 0, 0.0),
  new THREE.Vector3(-42.0, 0, 18.0),
  new THREE.Vector3(-45.0, 0, 34.0),
  new THREE.Vector3(-48.0, 0, 52.0),
];

// ── ALIRAN LELEHAN LAVA PIJAR KAWAH MERAPI (ERUPSI EFUSIF) ──────────
// Aliran lava efusif meluap dari bibir kawah, menuruni lereng atas KRB III,
// dan berhenti di lereng atas (area lingkaran merah screenshot 2, Z antara -39 s.d. -16),
// serta menyentuh hulu sungai kanan (Kali Gendol & Kali Woro) dan sungai tengah (Kali Kuning).
const EFFUSIVE_LAVA_EAST_GENDOL = [
  new THREE.Vector3(-25.28, 0, -47.0),
  new THREE.Vector3(-18.0, 0, -43.0),
  new THREE.Vector3(-10.0, 0, -39.0),
  new THREE.Vector3(-3.0, 0, -35.5),
  new THREE.Vector3(4.0, 0, -32.0),
  new THREE.Vector3(9.5, 0, -29.0),
  new THREE.Vector3(13.0, 0, -26.0),
];

const EFFUSIVE_LAVA_EAST_WORO = [
  new THREE.Vector3(-25.28, 0, -47.0),
  new THREE.Vector3(-14.0, 0, -46.5),
  new THREE.Vector3(-2.0, 0, -46.0),
  new THREE.Vector3(8.0, 0, -45.0),
  new THREE.Vector3(16.0, 0, -43.0),
  new THREE.Vector3(22.0, 0, -39.0),
];

const EFFUSIVE_LAVA_SOUTH_KUNING_MAIN = [
  new THREE.Vector3(-25.28, 0, -47.0),
  new THREE.Vector3(-24.5, 0, -41.0),
  new THREE.Vector3(-23.5, 0, -34.0),
  new THREE.Vector3(-22.0, 0, -26.5),
  new THREE.Vector3(-20.0, 0, -20.0),
  new THREE.Vector3(-18.5, 0, -16.0),
];

const EFFUSIVE_LAVA_SOUTH_KUNING_BRANCH = [
  new THREE.Vector3(-25.28, 0, -47.0),
  new THREE.Vector3(-22.5, 0, -39.0),
  new THREE.Vector3(-19.5, 0, -31.0),
  new THREE.Vector3(-17.0, 0, -23.0),
  new THREE.Vector3(-14.5, 0, -16.0),
];

const EFFUSIVE_LAVA_WEST_BOYONG_MAIN = [
  new THREE.Vector3(-25.28, 0, -47.0),
  new THREE.Vector3(-28.5, 0, -41.0),
  new THREE.Vector3(-32.5, 0, -34.0),
  new THREE.Vector3(-36.5, 0, -26.0),
  new THREE.Vector3(-39.0, 0, -18.0),
];

const EFFUSIVE_LAVA_WEST_BOYONG_BRANCH = [
  new THREE.Vector3(-25.28, 0, -47.0),
  new THREE.Vector3(-30.5, 0, -39.0),
  new THREE.Vector3(-35.0, 0, -31.0),
  new THREE.Vector3(-38.5, 0, -23.0),
  new THREE.Vector3(-41.0, 0, -16.0),
];

export interface RoadNode3D {
  id: number;
  x: number;
  y?: number;
  z: number;
  neighbors: number[];
}

export const ROAD_NODES_3D: RoadNode3D[] = [
  { id: 0, x: -38.2, z: -20.0, neighbors: [1] },
  { id: 1, x: -35.0, z: -10.1, neighbors: [0, 2, 10] },
  { id: 2, x: -44.0, z: 0.0, neighbors: [1, 3] },
  { id: 3, x: -53.3, z: 3.5, neighbors: [2, 4] },
  { id: 4, x: -47.2, z: 24.7, neighbors: [3, 5, 20] },
  { id: 5, x: -45.0, z: 44.0, neighbors: [4, 6] },
  { id: 6, x: -46.0, z: 56.0, neighbors: [5, 7, 30] },
  { id: 7, x: -54.0, z: 74.0, neighbors: [6, 8] },
  { id: 8, x: -55.0, z: 94.0, neighbors: [7, 9] },
  { id: 9, x: -32.0, z: 95.0, neighbors: [8, 40] },
  { id: 11, x: -38.0, z: -2.0, neighbors: [12, 10] },
  { id: 12, x: -26.0, z: 12.0, neighbors: [11, 21] },
  { id: 21, x: -28.0, z: 26.0, neighbors: [12, 20, 22, 31] },
  { id: 31, x: -22.0, z: 57.0, neighbors: [21, 30, 32, 40] },
  { id: 40, x: -16.0, z: 95.0, neighbors: [9, 31, 41] },
  { id: 13, x: -12.7, z: -22.0, neighbors: [14] },
  { id: 14, x: -8.8, z: 5.5, neighbors: [13, 10, 15, 23] },
  { id: 23, x: -6.5, z: 26.3, neighbors: [14, 22, 24, 28] },
  { id: 28, x: -4.3, z: 55.6, neighbors: [23, 33] },
  { id: 33, x: 5.0, z: 56.6, neighbors: [28, 32, 34, 37] },
  { id: 37, x: -2.0, z: 73.5, neighbors: [33, 42] },
  { id: 42, x: 6.3, z: 96.0, neighbors: [41, 37, 43] },
  { id: 16, x: 2.0, z: -22.0, neighbors: [15] },
  { id: 15, x: 13.6, z: 5.5, neighbors: [16, 14, 17, 25] },
  { id: 24, x: 4.3, z: 25.9, neighbors: [23, 25, 29] },
  { id: 25, x: 20.5, z: 26.0, neighbors: [15, 24, 26, 29, 35] },
  { id: 29, x: 13.0, z: 36.5, neighbors: [24, 25, 34] },
  { id: 35, x: 19.1, z: 56.6, neighbors: [25, 34, 36, 44] },
  { id: 44, x: 14.0, z: 82.0, neighbors: [35, 43] },
  { id: 43, x: 28.3, z: 95.0, neighbors: [42, 44, 45] },
  { id: 18, x: 25.0, z: -28.0, neighbors: [17] },
  { id: 17, x: 38.0, z: 5.5, neighbors: [18, 15, 27] },
  { id: 27, x: 41.7, z: 26.0, neighbors: [17, 26, 38] },
  { id: 38, x: 39.6, z: 56.6, neighbors: [27, 36, 39, 46] },
  { id: 39, x: 56.5, z: 56.6, neighbors: [38, 46] },
  { id: 46, x: 55.0, z: 92.0, neighbors: [38, 39, 45] },
  { id: 45, x: 42.0, z: 96.0, neighbors: [43, 46] },
  { id: 10, x: -17.5, z: 5.5, neighbors: [1, 11, 14] },
  { id: 20, x: -36.0, z: 26.0, neighbors: [4, 21] },
  { id: 22, x: -17.5, z: 26.0, neighbors: [21, 23] },
  { id: 26, x: 30.0, z: 26.0, neighbors: [25, 27] },
  { id: 30, x: -34.0, z: 56.6, neighbors: [6, 31] },
  { id: 32, x: -11.5, z: 56.6, neighbors: [31, 33] },
  { id: 34, x: 12.0, z: 56.6, neighbors: [29, 33, 35] },
  { id: 36, x: 29.0, z: 56.6, neighbors: [35, 38] },
  { id: 41, x: -12.0, z: 95.0, neighbors: [40, 42] },
];

export const NODE_MAP = new Map<number, RoadNode3D>();
ROAD_NODES_3D.forEach((n) => NODE_MAP.set(n.id, n));

export const ROAD_EDGES: [number, number][] = [];
const seenEdges = new Set<string>();
ROAD_NODES_3D.forEach((node) => {
  node.neighbors.forEach((nbrId) => {
    const key = Math.min(node.id, nbrId) + '-' + Math.max(node.id, nbrId);
    if (!seenEdges.has(key)) {
      seenEdges.add(key);
      ROAD_EDGES.push([node.id, nbrId]);
    }
  });
});

export default function Merapi3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showKrbZones, setShowKrbZones] = useState<boolean>(true);
  const [hasDisasterImpact, setHasDisasterImpact] = useState<boolean>(false);
  const [eruptionStageText, setEruptionStageText] = useState<string>('');
  const eruptionStageTextRef = useRef<string>('');

  // Runtime Store Telemetry
  const volcanoStatus = useRuntimeStore((s) => s.volcanoStatus);
  const eruptionType = useRuntimeStore((s) => s.eruptionType);
  const seismicLevel = useRuntimeStore((s) => s.seismicLevel);
  const richterScale = useRuntimeStore((s) => s.richterScale);
  const rgbColor = useRuntimeStore((s) => s.rgbColor);
  const selectedRoute = useRuntimeStore((s) => s.selectedRoute);
  const activeShelter = useRuntimeStore((s) => s.activeShelter);
  const activeEvacCommand = useRuntimeStore((s) => s.activeEvacCommand);
  const isBuzzerOn = useRuntimeStore((s) => s.pinStates.BUZZER);
  const isMapExpanded = useRuntimeStore((s) => s.isMapExpanded);
  const toggleMapExpanded = useRuntimeStore((s) => s.toggleMapExpanded);
  const disasterResetCounter = useRuntimeStore((s) => s.disasterResetCounter);

  // Three.js Core References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const terrainMeshRef = useRef<THREE.Mesh | null>(null);

  // FX References
  const ledLightRef = useRef<THREE.PointLight | null>(null);
  const ledMeshRef = useRef<THREE.Mesh | null>(null);
  const ledHaloMeshRef = useRef<THREE.Mesh | null>(null);
  const ledOuterHaloMeshRef = useRef<THREE.Mesh | null>(null);
  const ledGroundRingRef = useRef<THREE.Mesh | null>(null);
  const sirenLightRef = useRef<THREE.PointLight | null>(null);
  const lavaMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const smokePointsRef = useRef<THREE.Points | null>(null);
  const bombsGroupRef = useRef<THREE.Group | null>(null);
  const lavaStreamsGroupRef = useRef<THREE.Group | null>(null);
  const seismicRingsGroupRef = useRef<THREE.Group | null>(null);
  const krbLinesGroupRef = useRef<THREE.Group | null>(null);

  // Multi-Stage Eruption & Disaster Simulation Refs
  const plinianColumnGroupRef = useRef<THREE.Group | null>(null);
  const collapsingColumnGroupRef = useRef<THREE.Group | null>(null);
  const lavaFountainGroupRef = useRef<THREE.Group | null>(null);
  const pyroclasticGroupRef = useRef<THREE.Group | null>(null);
  const pyroclasticLightsGroupRef = useRef<THREE.Group | null>(null);
  const ashFallPointsRef = useRef<THREE.Points | null>(null);
  const explosionLightRef = useRef<THREE.PointLight | null>(null);

  // Effusive Eruption Refs (Thermal Fire, Steam Vapor, Active Points)
  const thermalFirePointsRef = useRef<THREE.Points | null>(null);
  const steamVaporPointsRef = useRef<THREE.Points | null>(null);
  const activeLavaPointsRef = useRef<THREE.Vector3[]>([]);

  // Animation Refs
  const seismicLevelRef = useRef<number>(seismicLevel);
  const volcanoStatusRef = useRef<string>(volcanoStatus);
  const eruptionTypeRef = useRef<string>(eruptionType);
  const isBuzzerOnRef = useRef<boolean>(isBuzzerOn);
  const selectedRouteRef = useRef<string>(selectedRoute);
  const activeShelterRef = useRef<string>(activeShelter);
  const activeEvacCommandRef = useRef<string>(activeEvacCommand);
  const lastSeismicSoundTimeRef = useRef<number>(0);
  const prevSeismicRef = useRef<number>(0);
  const isPostDisasterRef = useRef<boolean>(false);
  const lastEruptionTypeRef = useRef<string>('NONE');
  const hasEnvironmentalDamageRef = useRef<boolean>(false);
  const resetDisasterStateRef = useRef<() => void>(() => { });

  useEffect(() => { seismicLevelRef.current = seismicLevel; }, [seismicLevel]);
  useEffect(() => { volcanoStatusRef.current = volcanoStatus; }, [volcanoStatus]);
  useEffect(() => { eruptionTypeRef.current = eruptionType; }, [eruptionType]);
  useEffect(() => { isBuzzerOnRef.current = isBuzzerOn; }, [isBuzzerOn]);
  useEffect(() => { selectedRouteRef.current = selectedRoute; }, [selectedRoute]);
  useEffect(() => { activeShelterRef.current = activeShelter; }, [activeShelter]);
  useEffect(() => { activeEvacCommandRef.current = activeEvacCommand; }, [activeEvacCommand]);

  useEffect(() => {
    if (disasterResetCounter > 0 && resetDisasterStateRef.current) {
      resetDisasterStateRef.current();
    }
  }, [disasterResetCounter]);

  // Handle Resize on Expand Map View
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    }, 320);
    return () => clearTimeout(timer);
  }, [isMapExpanded]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // ── 1. SETUP SCENE, CAMERA & RENDERER (60 FPS OPTIMIZED) ─────────
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x060913, 0.0028);

    // POV: 3D Axonometric POV Samping (Default View Langsung dari Samping)
    const camera = new THREE.PerspectiveCamera(36, width / height, 1.0, 800);
    cameraRef.current = camera;
    camera.up.set(0, 1, 0);
    camera.position.set(38, 78, 122);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableRotate = true; // Rotasi orbit 3D diaktifkan
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2.05; // Mencegah kamera tembus ke bawah plinth
    controls.minDistance = 30;
    controls.maxDistance = 260;
    controls.target.set(-5, 0, 15);
    camera.lookAt(controls.target);
    controls.update();

    // ── 2. LIGHTING ──────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.95);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xfef08a, 0x1e293b, 0.5);
    hemiLight.position.set(0, 120, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.5);
    sunLight.position.set(65, 110, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 280;
    sunLight.shadow.camera.left = -90;
    sunLight.shadow.camera.right = 90;
    sunLight.shadow.camera.top = 90;
    sunLight.shadow.camera.bottom = -90;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // ── 3. LOAD STL TERRAIN & FAST SPATIAL HEIGHTMAP SAMPLING ─────────
    const stlLoader = new STLLoader();
    let terrainMesh: THREE.Mesh | null = null;

    // Grid bounds & resolusi (0.5 unit untuk interpolasi biliniar mulus tanpa raycaster bottleneck)
    const H_MIN_X = -70, H_MAX_X = 70;
    const H_MIN_Z = -110, H_MAX_Z = 110;
    const H_RES = 0.5;
    const H_COLS = Math.ceil((H_MAX_X - H_MIN_X) / H_RES);
    const H_ROWS = Math.ceil((H_MAX_Z - H_MIN_Z) / H_RES);
    let heightmapGrid: Float32Array | null = null;

    function sampleTerrain(x: number, z: number): number {
      if (!heightmapGrid) return -10;
      const fx = Math.max(0, Math.min(H_COLS - 1.001, (x - H_MIN_X) / H_RES));
      const fz = Math.max(0, Math.min(H_ROWS - 1.001, (z - H_MIN_Z) / H_RES));
      const c0 = Math.floor(fx);
      const r0 = Math.floor(fz);
      const c1 = Math.min(H_COLS - 1, c0 + 1);
      const r1 = Math.min(H_ROWS - 1, r0 + 1);

      const tx = fx - c0;
      const tz = fz - r0;

      const h00 = heightmapGrid[r0 * H_COLS + c0];
      const h10 = heightmapGrid[r0 * H_COLS + c1];
      const h01 = heightmapGrid[r1 * H_COLS + c0];
      const h11 = heightmapGrid[r1 * H_COLS + c1];

      return (h00 * (1 - tx) + h10 * tx) * (1 - tz) + (h01 * (1 - tx) + h11 * tx) * tz;
    }

    stlLoader.load(
      '/terrain-688.stl',
      (geometry) => {
        geometry.center();
        geometry.rotateX(-Math.PI / 2);
        geometry.computeVertexNormals();

        const HEIGHT_SCALE = 2.8;
        const pos = geometry.attributes.position;
        const colors = new Float32Array(pos.count * 3);
        const colTemp = new THREE.Color();

        // 1. Bangun Spatial Heightmap Instan (Hanya ~30ms, menggantikan ratusan ribu tes raycast)
        const grid = new Float32Array(H_COLS * H_ROWS).fill(-15);
        for (let i = 0; i < pos.count; i += 3) {
          const v0x = pos.getX(i), v0y = pos.getY(i) * HEIGHT_SCALE, v0z = pos.getZ(i);
          const v1x = pos.getX(i + 1), v1y = pos.getY(i + 1) * HEIGHT_SCALE, v1z = pos.getZ(i + 1);
          const v2x = pos.getX(i + 2), v2y = pos.getY(i + 2) * HEIGHT_SCALE, v2z = pos.getZ(i + 2);

          const triMinX = Math.min(v0x, v1x, v2x);
          const triMaxX = Math.max(v0x, v1x, v2x);
          const triMinZ = Math.min(v0z, v1z, v2z);
          const triMaxZ = Math.max(v0z, v1z, v2z);
          const triMaxY = Math.max(v0y, v1y, v2y);

          const c0 = Math.max(0, Math.floor((triMinX - H_MIN_X) / H_RES));
          const c1 = Math.min(H_COLS - 1, Math.floor((triMaxX - H_MIN_X) / H_RES));
          const r0 = Math.max(0, Math.floor((triMinZ - H_MIN_Z) / H_RES));
          const r1 = Math.min(H_ROWS - 1, Math.floor((triMaxZ - H_MIN_Z) / H_RES));

          for (let r = r0; r <= r1; r++) {
            for (let c = c0; c <= c1; c++) {
              const idx = r * H_COLS + c;
              if (triMaxY > grid[idx]) grid[idx] = triMaxY;
            }
          }
        }
        heightmapGrid = grid;

        // 2. Pewarnaan Vertex Lereng & Kawah Merapi
        for (let i = 0; i < pos.count; i++) {
          const vx = pos.getX(i);
          const vy = pos.getY(i) * HEIGHT_SCALE;
          const vz = pos.getZ(i);

          if (pos.getY(i) <= -8.28) {
            colTemp.setHex(0x1e293b); // Dudukan Diorama Bawah
          } else if (Math.abs(vx) > 67.5 || Math.abs(vz) > 108.5) {
            colTemp.setHex(0x272e3f); // Dinding Samping Diorama
          } else {
            const distToPeak = Math.hypot(vx - PEAK_X, vz - PEAK_Z);
            if (distToPeak < 6.5) {
              colTemp.setRGB(0.12, 0.08, 0.08); // Kawah Dalam
            } else if (distToPeak < 13.0) {
              colTemp.setRGB(0.92, 0.32, 0.08); // Bibir Kawah Lahar Pijar
            } else if (distToPeak < 35.0 || vy > 2.0) {
              const angle = Math.atan2(vz - PEAK_Z, vx - PEAK_X);
              const ridgeStripe = Math.sin(angle * 14.0);
              if (ridgeStripe > 0.2) colTemp.setRGB(0.32, 0.55, 0.22);
              else colTemp.setRGB(0.55, 0.60, 0.55);
            } else if (vz < 35.0) {
              colTemp.setRGB(0.24, 0.52, 0.18); // Lereng Hutan Pinus
            } else {
              colTemp.setRGB(0.20, 0.64, 0.28); // Dataran Rendah Subur
            }

            const contour = Math.sin(pos.getY(i) * 5.5) > 0.92 ? 0.90 : 1.0;
            colTemp.multiplyScalar(contour);
          }

          colors[i * 3] = colTemp.r;
          colors[i * 3 + 1] = colTemp.g;
          colors[i * 3 + 2] = colTemp.b;
        }

        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const terrainMat = new THREE.MeshStandardMaterial({
          vertexColors: true,
          roughness: 0.88,
          metalness: 0.05,
          flatShading: false,
        });

        terrainMesh = new THREE.Mesh(geometry, terrainMat);
        terrainMeshRef.current = terrainMesh;
        terrainMesh.scale.set(1.0, HEIGHT_SCALE, 1.0);
        terrainMesh.updateMatrixWorld();
        terrainMesh.castShadow = false;
        terrainMesh.receiveShadow = true;
        scene.add(terrainMesh);

        // Pre-kalkulasi ketinggian semua Node Jalan 3D saat inisialisasi
        ROAD_NODES_3D.forEach((n) => {
          n.y = sampleTerrain(n.x, n.z) + 0.18;
          NODE_MAP.set(n.id, n);
        });

        // Bangun Seluruh Elemen Diorama (semuanya berjalan super cepat tanpa lag)
        try {
          buildRivers();
          buildRoads();
          buildBridges();
          buildArchitecturalBuildings();
          buildTrees();
          buildUtilityPoles();
          buildRoadFissures();
          buildBuildingDustSystem();
          buildCentralLed();
          buildCraterVFX();
          buildDynamicLavaStreams();
          buildThermalAndSteamParticles();
          buildPlinianAndEjectaSystems();
          buildPyroclasticSurge();
          buildAshFallSystem();
          buildSeismicRipples();
          buildKrbBoundaries();
          buildCompassRose();
          buildNpcPopulation();
        } catch (err) {
          console.error('Error saat membangun elemen diorama:', err);
        } finally {
          setIsLoading(false);
        }
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadProgress(Math.round((xhr.loaded / xhr.total) * 100));
        } else {
          setLoadProgress(Math.min(99, Math.round((xhr.loaded / 3165784) * 100)));
        }
      },
      (error) => {
        console.error('Gagal memuat terrain-688.stl:', error);
        setIsLoading(false);
      }
    );

    // ── HELPER: GEOMETRI PITA KONTINU (SEAMLESS MITER RIBBON) ────────
    // Menghubungkan seluruh segmen dengan miter normals bersama & subdivisi kontur halus (zero gaps, zero sawteeth)
    function createSmoothRibbonGeometry(
      rawPoints2D: [number, number][],
      width: number,
      yOffset: number
    ): THREE.BufferGeometry {
      if (rawPoints2D.length < 2) return new THREE.BufferGeometry();

      // Subdivisi segmen panjang agar pita mengikuti kontur permukaan 3D tanpa kroak/clipping tanah.
      // maxStep 0.45 lebih rapat dari resolusi grid heightmap (H_RES 0.5) menjamin elevasi presisi 100%.
      const points2D: [number, number][] = [rawPoints2D[0]];
      const maxStep = 0.45;
      for (let i = 0; i < rawPoints2D.length - 1; i++) {
        const p1 = rawPoints2D[i];
        const p2 = rawPoints2D[i + 1];
        const dist = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
        const steps = Math.max(1, Math.ceil(dist / maxStep));
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          points2D.push([
            p1[0] + (p2[0] - p1[0]) * t,
            p1[1] + (p2[1] - p1[1]) * t,
          ]);
        }
      }

      const n = points2D.length;
      const normals: THREE.Vector2[] = [];
      const miterLengths: number[] = [];

      for (let i = 0; i < n; i++) {
        if (i === 0) {
          const p0 = new THREE.Vector2(points2D[0][0], points2D[0][1]);
          const p1 = new THREE.Vector2(points2D[1][0], points2D[1][1]);
          const dir = p1.clone().sub(p0).normalize();
          normals.push(new THREE.Vector2(-dir.y, dir.x));
          miterLengths.push(width * 0.5);
        } else if (i === n - 1) {
          const pPrev = new THREE.Vector2(points2D[n - 2][0], points2D[n - 2][1]);
          const pLast = new THREE.Vector2(points2D[n - 1][0], points2D[n - 1][1]);
          const dir = pLast.clone().sub(pPrev).normalize();
          normals.push(new THREE.Vector2(-dir.y, dir.x));
          miterLengths.push(width * 0.5);
        } else {
          const pPrev = new THREE.Vector2(points2D[i - 1][0], points2D[i - 1][1]);
          const pCurr = new THREE.Vector2(points2D[i][0], points2D[i][1]);
          const pNext = new THREE.Vector2(points2D[i + 1][0], points2D[i + 1][1]);

          const d1 = pCurr.clone().sub(pPrev).normalize();
          const d2 = pNext.clone().sub(pCurr).normalize();
          const tangent = d1.clone().add(d2).normalize();
          const miterNorm = new THREE.Vector2(-tangent.y, tangent.x);

          const n1 = new THREE.Vector2(-d1.y, d1.x);
          const dot = Math.abs(miterNorm.dot(n1));
          let miterLen = (width * 0.5) / Math.max(0.35, dot);
          miterLen = Math.min(miterLen, width * 1.25);

          normals.push(miterNorm);
          miterLengths.push(miterLen);
        }
      }

      // Pre-sample elevasi maksimum penampang melintang (5 titik uji) agar bebas tenggelam
      const baseHeights: number[] = new Array(n);
      for (let i = 0; i < n; i++) {
        const px = points2D[i][0];
        const pz = points2D[i][1];
        const norm = normals[i];
        const len = miterLengths[i];

        const lx = px - norm.x * len;
        const lz = pz - norm.y * len;
        const rx = px + norm.x * len;
        const rz = pz + norm.y * len;
        const q1x = px - norm.x * len * 0.5;
        const q1z = pz - norm.y * len * 0.5;
        const q2x = px + norm.x * len * 0.5;
        const q2z = pz + norm.y * len * 0.5;

        const cy = sampleTerrain(px, pz);
        const ly = sampleTerrain(lx, lz);
        const ry = sampleTerrain(rx, rz);
        const q1y = sampleTerrain(q1x, q1z);
        const q2y = sampleTerrain(q2x, q2z);

        baseHeights[i] = Math.max(cy, ly, ry, q1y, q2y);
      }

      // Anti-sagging lookahead: mencegah celah/cekungan di tengah quad antara 2 titik subdivisi
      for (let i = 0; i < n - 1; i++) {
        const mx = (points2D[i][0] + points2D[i + 1][0]) * 0.5;
        const mz = (points2D[i][1] + points2D[i + 1][1]) * 0.5;
        const my = sampleTerrain(mx, mz);
        const avgY = (baseHeights[i] + baseHeights[i + 1]) * 0.5;
        if (my > avgY) {
          const delta = my - avgY;
          baseHeights[i] += delta;
          baseHeights[i + 1] += delta;
        }
      }

      const positions: number[] = [];
      const indices: number[] = [];

      for (let i = 0; i < n; i++) {
        const px = points2D[i][0];
        const pz = points2D[i][1];
        const norm = normals[i];
        const len = miterLengths[i];

        const lx = px - norm.x * len;
        const lz = pz - norm.y * len;
        const rx = px + norm.x * len;
        const rz = pz + norm.y * len;

        const h = baseHeights[i] + yOffset;

        // Left vertex
        positions.push(lx, h, lz);
        // Right vertex
        positions.push(rx, h, rz);
      }

      for (let i = 0; i < n - 1; i++) {
        const i0 = 2 * i;
        const i1 = 2 * i + 1;
        const i2 = 2 * (i + 1);
        const i3 = 2 * (i + 1) + 1;

        indices.push(i0, i1, i2);
        indices.push(i1, i3, i2);
      }

      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geom.setIndex(indices);
      geom.computeVertexNormals();
      return geom;
    }

    // ── HELPER: GEOMETRI ALIRAN SUNGAI ALAMI (LAPISAN PALING BAWAH DI PALUNG LEMBAH) ──
    // Mengikuti alur palung dasar lembah alami tanpa terangkat ke tebing bantaran atau jalan/jembatan
    function createRiverRibbonGeometry(
      rawPoints2D: [number, number][],
      width: number,
      yOffset: number
    ): { geom: THREE.BufferGeometry; points2D: [number, number][] } {
      if (rawPoints2D.length < 2) return { geom: new THREE.BufferGeometry(), points2D: [] };

      const points2D: [number, number][] = [rawPoints2D[0]];
      const maxStep = 0.45;
      for (let i = 0; i < rawPoints2D.length - 1; i++) {
        const p1 = rawPoints2D[i];
        const p2 = rawPoints2D[i + 1];
        const dist = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
        const steps = Math.max(1, Math.ceil(dist / maxStep));
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          points2D.push([
            p1[0] + (p2[0] - p1[0]) * t,
            p1[1] + (p2[1] - p1[1]) * t,
          ]);
        }
      }

      const n = points2D.length;
      const normals: THREE.Vector2[] = [];
      const miterLengths: number[] = [];

      for (let i = 0; i < n; i++) {
        if (i === 0) {
          const p0 = new THREE.Vector2(points2D[0][0], points2D[0][1]);
          const p1 = new THREE.Vector2(points2D[1][0], points2D[1][1]);
          const dir = p1.clone().sub(p0).normalize();
          normals.push(new THREE.Vector2(-dir.y, dir.x));
          miterLengths.push(width * 0.5);
        } else if (i === n - 1) {
          const pPrev = new THREE.Vector2(points2D[n - 2][0], points2D[n - 2][1]);
          const pLast = new THREE.Vector2(points2D[n - 1][0], points2D[n - 1][1]);
          const dir = pLast.clone().sub(pPrev).normalize();
          normals.push(new THREE.Vector2(-dir.y, dir.x));
          miterLengths.push(width * 0.5);
        } else {
          const pPrev = new THREE.Vector2(points2D[i - 1][0], points2D[i - 1][1]);
          const pCurr = new THREE.Vector2(points2D[i][0], points2D[i][1]);
          const pNext = new THREE.Vector2(points2D[i + 1][0], points2D[i + 1][1]);

          const d1 = pCurr.clone().sub(pPrev).normalize();
          const d2 = pNext.clone().sub(pCurr).normalize();
          const tangent = d1.clone().add(d2).normalize();
          const miterNorm = new THREE.Vector2(-tangent.y, tangent.x);

          const n1 = new THREE.Vector2(-d1.y, d1.x);
          const dot = Math.abs(miterNorm.dot(n1));
          let miterLen = (width * 0.5) / Math.max(0.35, dot);
          miterLen = Math.min(miterLen, width * 1.25);

          normals.push(miterNorm);
          miterLengths.push(miterLen);
        }
      }

      // Elevasi air murni di dasar palung lembah (centerline sungai)
      const baseHeights = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        baseHeights[i] = sampleTerrain(points2D[i][0], points2D[i][1]);
      }

      // Penghalusan gradien aliran air menuruni lereng secara kontinu
      const smoothedHeights = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const prev = i > 0 ? baseHeights[i - 1] : baseHeights[0];
        const curr = baseHeights[i];
        const next = i < n - 1 ? baseHeights[i + 1] : baseHeights[n - 1];
        smoothedHeights[i] = prev * 0.25 + curr * 0.5 + next * 0.25;
      }

      const positions: number[] = [];
      const indices: number[] = [];
      const colors = new Float32Array(n * 2 * 3);

      for (let i = 0; i < n; i++) {
        const px = points2D[i][0];
        const pz = points2D[i][1];
        const norm = normals[i];
        const len = miterLengths[i];

        const lx = px - norm.x * len;
        const lz = pz - norm.y * len;
        const rx = px + norm.x * len;
        const rz = pz + norm.y * len;

        const h = smoothedHeights[i] + yOffset;

        // Left vertex
        positions.push(lx, h, lz);
        // Right vertex
        positions.push(rx, h, rz);

        // Warna awal: Biru Sungai Alami Sky-600 (0x0284c7)
        const vL = (2 * i) * 3;
        const vR = (2 * i + 1) * 3;
        colors[vL] = 0.01; colors[vL + 1] = 0.52; colors[vL + 2] = 0.78;
        colors[vR] = 0.01; colors[vR + 1] = 0.52; colors[vR + 2] = 0.78;
      }

      for (let i = 0; i < n - 1; i++) {
        const i0 = 2 * i;
        const i1 = 2 * i + 1;
        const i2 = 2 * (i + 1);
        const i3 = 2 * (i + 1) + 1;

        indices.push(i0, i1, i2);
        indices.push(i1, i3, i2);
      }

      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geom.setIndex(indices);
      geom.computeVertexNormals();
      return { geom, points2D };
    }

    // ── DATA REGISTRY BANGUNAN, POHON & SUNGAI UNTUK DINAMIKA BENCANA ──
    interface RegisteredBuilding {
      id: string;
      type: 'hospital' | 'bpbd' | 'school' | 'barak' | 'house';
      x: number;
      z: number;
      group: THREE.Group;
      initialY: number;
      initialRotX: number;
      initialRotY: number;
      initialRotZ: number;
      hp: number;
      damageState: 'intact' | 'damaged' | 'destroyed';
      isCharred: boolean;
      isConcrete: boolean;
      meshes: { mesh: THREE.Mesh; origMat: THREE.Material | THREE.Material[] }[];
      crackMesh?: THREE.Group;
      rubbleMesh?: THREE.Group;
      width: number;
      depth: number;
      height: number;
    }

    interface RegisteredTree {
      x: number;
      z: number;
      group: THREE.Group;
      trunkMesh: THREE.Mesh;
      foliageMesh: THREE.Mesh;
      origTrunkMat: THREE.Material;
      origFolMat: THREE.Material;
      isCharred: boolean;
    }

    interface RegisteredPole {
      group: THREE.Group;
      x: number;
      z: number;
      initialRotX: number;
      initialRotZ: number;
      poleMesh: THREE.Mesh;
    }

    interface RiverTrack {
      riverIndex: number;
      mesh: THREE.Mesh;
      geometry: THREE.BufferGeometry;
      colorsAttr: THREE.BufferAttribute;
      sliceCoords: [number, number][];
      turbidity: Float32Array;
      firstContactSlice: number;
      propagationHead: number;
      propagationSpeed: number;
    }

    const registeredBuildings: RegisteredBuilding[] = [];
    const registeredTrees: RegisteredTree[] = [];
    const registeredPoles: RegisteredPole[] = [];
    const registeredRivers: RiverTrack[] = [];
    let riverMaterialRef: THREE.MeshStandardMaterial | null = null;
    let roadFissuresGroup: THREE.Group | null = null;
    let buildingDustPoints: THREE.Points | null = null;

    // Material hangus & jelaga awan panas / bom
    const charredSootMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.95,
      metalness: 0.05,
    });
    const scorchedWallMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.9,
      metalness: 0.05,
    });
    const charredTreeTrunkMat = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.98,
    });

    // ── 4. BANGUN ALIRAN SUNGAI ALAMI (LAPISAN DASAR PALING BAWAH) ──
    function buildRivers() {
      // Material air sungai murni biru alami dengan vertexColors: true
      const riverMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        vertexColors: true,
        emissive: 0x022035,
        emissiveIntensity: 0.55,
        roughness: 0.18,
        metalness: 0.10,
        transparent: false,
        depthWrite: true,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -2,
        side: THREE.DoubleSide,
      });
      riverMaterialRef = riverMat;

      // Lebar pita air sungai semula yang ramping (1.95 unit, tidak digedein)
      const riverWidth = 1.95;
      registeredRivers.length = 0;

      CURVED_RIVERS_DATA.forEach((ptsArr, rivIdx) => {
        if (ptsArr.length < 2) return;
        // Permukaan air sungai di elevasi dasar 0.08 unit & renderOrder 1 (lapisan terbawah di bawah jalan dan jembatan)
        const { geom, points2D } = createRiverRibbonGeometry(ptsArr, riverWidth, 0.08);
        const riverMesh = new THREE.Mesh(geom, riverMat);
        riverMesh.renderOrder = 1;
        scene.add(riverMesh);

        const colorsAttr = geom.getAttribute('color') as THREE.BufferAttribute;
        const sliceCount = points2D.length;

        registeredRivers.push({
          riverIndex: rivIdx,
          mesh: riverMesh,
          geometry: geom,
          colorsAttr,
          sliceCoords: points2D,
          turbidity: new Float32Array(sliceCount),
          firstContactSlice: -1,
          propagationHead: -1,
          propagationSpeed: 16.0,
        });
      });
    }

    // ── 5. JARINGAN JALAN ASPAL MULUS (DI ATAS SUNGAI) ──────
    function buildRoads() {
      const roadMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.88,
        metalness: 0.05,
        polygonOffset: true,
        polygonOffsetFactor: -3,
        polygonOffsetUnits: -6,
        side: THREE.DoubleSide,
      });

      const lineMat = new THREE.MeshBasicMaterial({
        color: 0xf8fafc,
        polygonOffset: true,
        polygonOffsetFactor: -5,
        polygonOffsetUnits: -10,
        side: THREE.DoubleSide,
      });
      const roadWidth = 1.45;

      // 1. Ekstrusi Pita Aspal Mulus untuk Setiap Alur Jalan (renderOrder 6, elevasi 0.36 di atas sungai)
      CURVED_ROADS_DATA.forEach((ptsArr) => {
        if (ptsArr.length < 2) return;
        const roadGeom = createSmoothRibbonGeometry(ptsArr, roadWidth, 0.36);
        const roadMesh = new THREE.Mesh(roadGeom, roadMat);
        roadMesh.renderOrder = 6;
        roadMesh.receiveShadow = true;
        scene.add(roadMesh);

        // Garis Tengah Putih Mulus (renderOrder 7)
        const lineGeom = createSmoothRibbonGeometry(ptsArr, 0.14, 0.40);
        const lineMesh = new THREE.Mesh(lineGeom, lineMat);
        lineMesh.renderOrder = 7;
        scene.add(lineMesh);
      });

      // 2. Seamless Junction Caps (Penutup Persimpangan Bulat)
      const capGeom = new THREE.CircleGeometry(roadWidth * 0.58, 16);
      ROAD_JUNCTION_NODES.forEach(([jx, jz]) => {
        const jy = sampleTerrain(jx, jz) + 0.362;
        const cap = new THREE.Mesh(capGeom, roadMat);
        cap.renderOrder = 6;
        cap.rotation.x = -Math.PI / 2;
        cap.position.set(jx, jy, jz);
        cap.receiveShadow = true;
        scene.add(cap);
      });
    }

    // ── 5B. STRUKTUR JEMBATAN 3D REALISTIS MELINTANG DI ATAS SUNGAI ──
    function buildBridges() {
      const concreteMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.7,
        metalness: 0.2,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -8,
      });
      const asphaltDeckMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.85,
        polygonOffset: true,
        polygonOffsetFactor: -5,
        polygonOffsetUnits: -10,
      });
      const redRailingMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.4,
        polygonOffset: true,
        polygonOffsetFactor: -5,
        polygonOffsetUnits: -10,
      });
      const whiteRailingMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.4,
        polygonOffset: true,
        polygonOffsetFactor: -5,
        polygonOffsetUnits: -10,
      });
      const pillarMat = new THREE.MeshStandardMaterial({
        color: 0x64748b,
        roughness: 0.8,
      });

      CALIBRATED_BRIDGES.forEach((b) => {
        const group = new THREE.Group();
        const halfL = b.length * 0.48;
        const cos = Math.cos(b.rot);
        const sin = Math.sin(b.rot);
        const xA = b.x - halfL * cos;
        const zA = b.z + halfL * sin;
        const xB = b.x + halfL * cos;
        const zB = b.z - halfL * sin;
        const bankYA = sampleTerrain(xA, zA);
        const bankYB = sampleTerrain(xB, zB);
        const maxBankY = Math.max(bankYA, bankYB);
        const riverBedY = sampleTerrain(b.x, b.z);

        // Elevasi dek jembatan menyatu dengan jalan di kedua bantaran tepi sungai
        // dan melayang bebas di atas permukaan air sungai (ruang kolong terbuka)
        const gy = Math.max(maxBankY + 0.28, riverBedY + 0.65);
        group.position.set(b.x, gy, b.z);
        group.rotation.y = b.rot;
        group.renderOrder = 10; // Jembatan berada di lapisan teratas melintang di atas sungai

        const deckW = b.length;
        const deckD = 1.55;
        const deckH = 0.26;

        // 1. Dek Beton Penopang (renderOrder 10)
        const baseDeck = new THREE.Mesh(new THREE.BoxGeometry(deckW, deckH, deckD), concreteMat);
        baseDeck.renderOrder = 10;
        baseDeck.castShadow = true;
        baseDeck.receiveShadow = true;
        group.add(baseDeck);

        // 2. Lapisan Aspal Jalan di Atas Jembatan (renderOrder 11)
        const roadTop = new THREE.Mesh(new THREE.BoxGeometry(deckW, 0.05, deckD * 0.94), asphaltDeckMat);
        roadTop.renderOrder = 11;
        roadTop.position.y = deckH * 0.5 + 0.02;
        group.add(roadTop);

        // 3. Pagar Pengaman Kiri & Kanan (Guardrail Merah-Putih)
        [-deckD * 0.5 + 0.05, deckD * 0.5 - 0.05].forEach((rz) => {
          const railTop = new THREE.Mesh(new THREE.BoxGeometry(deckW, 0.12, 0.08), redRailingMat);
          railTop.renderOrder = 12;
          railTop.position.set(0, deckH * 0.5 + 0.35, rz);
          group.add(railTop);

          const railMid = new THREE.Mesh(new THREE.BoxGeometry(deckW, 0.08, 0.08), whiteRailingMat);
          railMid.renderOrder = 12;
          railMid.position.set(0, deckH * 0.5 + 0.18, rz);
          group.add(railMid);

          const numPosts = 5;
          for (let p = 0; p < numPosts; p++) {
            const px = -deckW * 0.5 + (deckW / (numPosts - 1)) * p;
            const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.42, 0.1), concreteMat);
            post.renderOrder = 12;
            post.position.set(px, deckH * 0.5 + 0.21, rz);
            group.add(post);
          }
        });

        // 4. Pilar Beton Jembatan Menembus ke Dasar Sungai
        const pillarHeight = Math.max(2.6, (gy - riverBedY) + 1.2);
        [-deckW * 0.28, deckW * 0.28].forEach((px) => {
          const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.28, pillarHeight, 8), pillarMat);
          pillar.renderOrder = 10;
          pillar.position.set(px, -(pillarHeight * 0.5) + 0.05, 0);
          pillar.castShadow = true;
          group.add(pillar);
        });

        scene.add(group);
      });
    }

    // ── 6. BANGUNAN ARSITEKTURAL REALISTIS (SESUAI LEGENDA WARNA USER) ──
    function buildArchitecturalBuildings() {
      const hospitalWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
      const glassWindowMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.15, metalness: 0.8 });
      const redCrossMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const bpbdOrangeMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.5 });
      const darkSlateMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.65 });
      const blueSchoolRoofMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.55 });
      const schoolWallMat = new THREE.MeshStandardMaterial({ color: 0xfef9c3, roughness: 0.6 });
      const yellowCanvasMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.65, side: THREE.DoubleSide });
      const jogloClayMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 });
      const teakWoodMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.75 });
      const metalMastMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2 });

      // ── MATERIAL RETAKAN REALISTIS GEMPA BUMI (DUAL-LAYER HIGH CONTRAST) ──
      // Lapisan 1: Plester & kapur dinding rontok warna putih terang (Chipped Spall Border)
      const crackSpallMat = new THREE.MeshBasicMaterial({
        color: 0xf8fafc,
        side: THREE.DoubleSide,
        depthTest: true,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      });
      // Lapisan 2: Inti rekahan rongga patahan batuan/beton warna hitam arang pekat (Deep Fracture Core)
      const crackDarkMat = new THREE.MeshBasicMaterial({
        color: 0x09090b,
        side: THREE.DoubleSide,
        depthTest: true,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
      });

      // Helper: Pembentukan Pola Retakan Organik Gempa Bumi (Non-Linear Jagged Fracture Ribbons)
      function generateJaggedPath(
        start: { u: number; v: number },
        end: { u: number; v: number },
        segments: number,
        jaggedAmp: number,
        seed = 1
      ): { u: number; v: number }[] {
        const pts = [start];
        const du = end.u - start.u;
        const dv = end.v - start.v;
        const len = Math.hypot(du, dv);
        if (len < 0.001) return pts;
        const nu = -dv / len;
        const nv = du / len;

        for (let i = 1; i < segments; i++) {
          const t = i / segments;
          const bu = start.u + du * t;
          const bv = start.v + dv * t;
          // Disposisi zig-zag tajam berirama khas patahan batuan/beton gempa bumi
          const sign = i % 2 === 1 ? 1 : -1;
          const pseudoRand = Math.sin(seed * 11.3 + i * 4.7) * 0.5 + 0.5;
          const amp = jaggedAmp * (0.75 + 0.70 * pseudoRand) * sign;
          const parallelJitter = (Math.cos(seed * 5.9 + i * 3.1) * 0.25) * (len / segments);

          pts.push({
            u: bu + nu * amp + (du / len) * parallelJitter,
            v: bv + nv * amp + (dv / len) * parallelJitter,
          });
        }
        pts.push(end);
        return pts;
      }

      function addPathQuads(
        pts: { u: number; v: number }[],
        face: 'front' | 'side' | 'otherSide',
        halfWidth: number,
        zOffset: number,
        positions: number[],
        w: number,
        d: number
      ) {
        const hw = w * 0.5;
        const hd = d * 0.5;

        for (let i = 0; i < pts.length - 1; i++) {
          const p1 = pts[i];
          const p2 = pts[i + 1];
          const du = p2.u - p1.u;
          const dv = p2.v - p1.v;
          const len = Math.hypot(du, dv);
          if (len < 0.001) continue;

          const nu = -dv / len;
          const nv = du / len;

          const extU = (du / len) * (halfWidth * 0.45);
          const extV = (dv / len) * (halfWidth * 0.45);

          const aU = p1.u - extU;
          const aV = p1.v - extV;
          const bU = p2.u + extU;
          const bV = p2.v + extV;

          const c0u = aU - nu * halfWidth, c0v = aV - nv * halfWidth;
          const c1u = aU + nu * halfWidth, c1v = aV + nv * halfWidth;
          const c2u = bU - nu * halfWidth, c2v = bV - nv * halfWidth;
          const c3u = bU + nu * halfWidth, c3v = bV + nv * halfWidth;

          function to3D(u: number, v: number): [number, number, number] {
            if (face === 'front') {
              return [u, v, hd + zOffset];
            } else if (face === 'side') {
              return [hw + zOffset, v, u];
            } else {
              return [-hw - zOffset, v, u];
            }
          }

          const v0 = to3D(c0u, c0v);
          const v1 = to3D(c1u, c1v);
          const v2 = to3D(c2u, c2v);
          const v3 = to3D(c3u, c3v);

          positions.push(...v0, ...v1, ...v2);
          positions.push(...v1, ...v3, ...v2);
        }
      }

      function createRealisticCrackGroup(
        w: number,
        h: number,
        d: number,
        crackPos: THREE.Vector3,
        seed: number
      ): THREE.Group {
        const crackGroup = new THREE.Group();
        crackGroup.position.copy(crackPos);

        const spallPositions: number[] = [];
        const darkPositions: number[] = [];

        const hw = w * 0.5;
        const hh = h * 0.5;
        const hd = d * 0.5;

        // Ketebalan lebar jelas agar terlihat kontras dari sudut pandang kamera axonometric
        const mainSpallHW = Math.max(0.12, Math.min(0.20, h * 0.09));
        const mainCoreHW = mainSpallHW * 0.48;
        const branchSpallHW = mainSpallHW * 0.72;
        const branchCoreHW = mainCoreHW * 0.72;

        function addJaggedCrackSystem(
          start: { u: number; v: number },
          end: { u: number; v: number },
          face: 'front' | 'side' | 'otherSide',
          segments: number,
          jaggedAmp: number,
          s: number,
          branches?: { nodeIdx: number; angleOffset: number; length: number; segs: number }[]
        ) {
          const mainPath = generateJaggedPath(start, end, segments, jaggedAmp, s);
          addPathQuads(mainPath, face, mainSpallHW, 0.026, spallPositions, w, d);
          addPathQuads(mainPath, face, mainCoreHW, 0.038, darkPositions, w, d);

          if (branches) {
            branches.forEach((br, bIdx) => {
              const node = mainPath[Math.min(mainPath.length - 1, Math.max(0, br.nodeIdx))];
              const nextNode = mainPath[Math.min(mainPath.length - 1, br.nodeIdx + 1)];
              const baseAng = Math.atan2(nextNode.v - node.v, nextNode.u - node.u);
              const brAng = baseAng + br.angleOffset;
              const brEnd = {
                u: node.u + Math.cos(brAng) * br.length,
                v: node.v + Math.sin(brAng) * br.length,
              };
              const brPath = generateJaggedPath(node, brEnd, br.segs, jaggedAmp * 0.75, s + 10 + bIdx);
              addPathQuads(brPath, face, branchSpallHW, 0.026, spallPositions, w, d);
              addPathQuads(brPath, face, branchCoreHW, 0.038, darkPositions, w, d);
            });
          }
        }

        // 1. DINDING DEPAN (+Z): Pola Retakan Geser Seismik Diagonal (X-Shear Failure khas Gempa)
        addJaggedCrackSystem(
          { u: -hw * 0.78, v: hh * 0.82 },
          { u: hw * 0.75, v: -hh * 0.85 },
          'front',
          8,
          h * 0.16,
          seed,
          [
            { nodeIdx: 2, angleOffset: -0.90, length: w * 0.28, segs: 3 },
            { nodeIdx: 4, angleOffset: 1.05, length: w * 0.26, segs: 3 },
            { nodeIdx: 6, angleOffset: -1.15, length: w * 0.20, segs: 2 },
          ]
        );

        addJaggedCrackSystem(
          { u: hw * 0.70, v: hh * 0.75 },
          { u: -hw * 0.65, v: -hh * 0.72 },
          'front',
          7,
          h * 0.15,
          seed + 4,
          [
            { nodeIdx: 3, angleOffset: 1.10, length: w * 0.22, segs: 2 },
            { nodeIdx: 5, angleOffset: -0.95, length: w * 0.18, segs: 2 },
          ]
        );

        addJaggedCrackSystem(
          { u: hw * 0.12, v: -hh * 0.98 },
          { u: -hw * 0.08, v: hh * 0.45 },
          'front',
          5,
          h * 0.13,
          seed + 8,
          [
            { nodeIdx: 2, angleOffset: 0.95, length: w * 0.22, segs: 2 },
          ]
        );

        // 2. DINDING SAMPING KANAN (+X) - MENGHADAP LANGSUNG KE ARAH KAMERA DEFAULT!
        addJaggedCrackSystem(
          { u: -hd * 0.75, v: hh * 0.80 },
          { u: hd * 0.72, v: -hh * 0.82 },
          'side',
          8,
          h * 0.16,
          seed + 12,
          [
            { nodeIdx: 2, angleOffset: 0.95, length: d * 0.28, segs: 3 },
            { nodeIdx: 5, angleOffset: -1.05, length: d * 0.24, segs: 2 },
          ]
        );

        addJaggedCrackSystem(
          { u: hd * 0.15, v: -hh * 0.98 },
          { u: hd * 0.22, v: hh * 0.55 },
          'side',
          5,
          h * 0.12,
          seed + 16,
          [
            { nodeIdx: 2, angleOffset: -0.85, length: d * 0.20, segs: 2 },
          ]
        );

        // 3. DINDING SAMPING KIRI (-X)
        addJaggedCrackSystem(
          { u: hd * 0.65, v: hh * 0.75 },
          { u: -hd * 0.60, v: -hh * 0.78 },
          'otherSide',
          6,
          h * 0.14,
          seed + 20,
          [
            { nodeIdx: 3, angleOffset: 0.95, length: d * 0.22, segs: 2 },
          ]
        );

        // 4. RETAKAN SUDUT PILAR (CORNER CRACK)
        addJaggedCrackSystem(
          { u: hw * 0.92, v: hh * 0.90 },
          { u: hw * 0.88, v: -hh * 0.35 },
          'front',
          5,
          h * 0.08,
          seed + 24
        );

        // Pasang BufferGeometry untuk border plester putih dan inti rekahan hitam
        if (spallPositions.length > 0) {
          const spallGeom = new THREE.BufferGeometry();
          spallGeom.setAttribute('position', new THREE.Float32BufferAttribute(spallPositions, 3));
          spallGeom.computeVertexNormals();
          const spallMesh = new THREE.Mesh(spallGeom, crackSpallMat);
          crackGroup.add(spallMesh);
        }

        if (darkPositions.length > 0) {
          const darkGeom = new THREE.BufferGeometry();
          darkGeom.setAttribute('position', new THREE.Float32BufferAttribute(darkPositions, 3));
          darkGeom.computeVertexNormals();
          const darkMesh = new THREE.Mesh(darkGeom, crackDarkMat);
          crackGroup.add(darkMesh);
        }

        // 5. Serpihan pecahan plester / beton rontok di dasar dinding
        const flakeGeom = new THREE.BoxGeometry(0.14, 0.05, 0.14);
        for (let f = 0; f < 9; f++) {
          const flake = new THREE.Mesh(flakeGeom, crackSpallMat);
          const isFront = f % 2 === 0;
          if (isFront) {
            flake.position.set(
              (Math.sin(f * 2.3) * 0.38) * w,
              -hh + 0.025,
              hd + 0.06 + (f * 0.03 % 0.12)
            );
          } else {
            flake.position.set(
              hw + 0.06 + (f * 0.03 % 0.12),
              -hh + 0.025,
              (Math.sin(f * 3.1) * 0.38) * d
            );
          }
          flake.rotation.set(0.1, f * 0.9, 0.1);
          crackGroup.add(flake);
        }

        crackGroup.visible = false;
        return crackGroup;
      }

      function registerBuildingGroup(
        id: string,
        type: 'hospital' | 'bpbd' | 'school' | 'barak' | 'house',
        x: number,
        z: number,
        group: THREE.Group,
        isConcrete: boolean
      ) {
        const meshes: { mesh: THREE.Mesh; origMat: THREE.Material | THREE.Material[] }[] = [];
        group.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            meshes.push({ mesh: child, origMat: child.material });
          }
        });

        const bbox = new THREE.Box3().setFromObject(group);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const bWidth = Math.max(2.0, size.x);
        const bDepth = Math.max(2.0, size.z);
        const bHeight = Math.max(1.2, size.y);

        const mainBoxInfo = { width: bWidth, height: bHeight, depth: bDepth };
        const crackPos = new THREE.Vector3(0, bHeight * 0.5, 0);
        let maxVol = 0;

        group.traverse((child: any) => {
          if (child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry) {
            const p = (child.geometry as any).parameters;
            if (p) {
              const vol = (p.width || 1) * (p.height || 1) * (p.depth || 1);
              if (vol > maxVol) {
                maxVol = vol;
                mainBoxInfo.width = p.width;
                mainBoxInfo.height = p.height;
                mainBoxInfo.depth = p.depth;
                crackPos.copy(child.position);
              }
            }
          }
        });

        const w = mainBoxInfo.width;
        const h = mainBoxInfo.height;
        const d = mainBoxInfo.depth;

        // 1. Overlay retakan realistis multi-cabang (Organic Jagged Crack Mesh) untuk Gempa Sedang & Besar
        const seed = Math.abs(Math.round(x * 37 + z * 17)) % 100;
        const crackGroup = createRealisticCrackGroup(w, h, d, crackPos, seed);

        // Jika sekolah atau rumah sakit dengan beberapa sayap, tambahkan retakan pada sayap bangunan
        if (type === 'school') {
          const wingCrackLeft = createRealisticCrackGroup(1.9, 1.6, 3.2, new THREE.Vector3(-2.25, 0.8, 1.45), seed + 30);
          wingCrackLeft.visible = true;
          crackGroup.add(wingCrackLeft);

          const wingCrackRight = createRealisticCrackGroup(1.9, 1.6, 3.2, new THREE.Vector3(2.25, 0.8, 1.45), seed + 60);
          wingCrackRight.visible = true;
          crackGroup.add(wingCrackRight);
        } else if (type === 'hospital') {
          const igdCrack = createRealisticCrackGroup(2.2, 1.3, 1.8, new THREE.Vector3(3.3, 0.65, 0.3), seed + 40);
          igdCrack.visible = true;
          crackGroup.add(igdCrack);
        }

        crackGroup.visible = false;
        group.add(crackGroup);

        // 2. Model Puing-Puing Reruntuhan Hancur (Rubble / Debris Chunks) untuk Gempa Besar
        const rubbleGroup = new THREE.Group();
        const rubbleConcreteMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
        const rubbleBrickMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.85 });

        for (let r = 0; r < 7; r++) {
          const rw = 0.35 + Math.random() * 0.35;
          const rh = 0.18 + Math.random() * 0.25;
          const rd = 0.35 + Math.random() * 0.35;
          const mat = r % 2 === 0 ? rubbleConcreteMat : rubbleBrickMat;
          const chunk = new THREE.Mesh(new THREE.BoxGeometry(rw, rh, rd), mat);
          chunk.position.set(
            (Math.random() - 0.5) * bWidth * 0.8,
            rh * 0.5 + 0.02,
            (Math.random() - 0.5) * bDepth * 0.8
          );
          chunk.rotation.set(Math.random() * 0.4, Math.random() * 3.14, Math.random() * 0.4);
          chunk.castShadow = true;
          rubbleGroup.add(chunk);
        }
        rubbleGroup.visible = false;
        group.add(rubbleGroup);

        registeredBuildings.push({
          id,
          type,
          x,
          z,
          group,
          initialY: group.position.y,
          initialRotX: group.rotation.x,
          initialRotY: group.rotation.y,
          initialRotZ: group.rotation.z,
          hp: 100,
          damageState: 'intact',
          isCharred: false,
          isConcrete,
          meshes,
          crackMesh: crackGroup,
          rubbleMesh: rubbleGroup,
          width: bWidth,
          depth: bDepth,
          height: bHeight,
        });
      }

      // ── A. HELPER: RUMAH SAKIT REALISTIS (WARNA PUTIH) ─────────────
      function createRSUD(x: number, z: number, rotY = 0) {
        const group = new THREE.Group();
        const gy = sampleTerrain(x, z);
        group.position.set(x, gy, z);
        group.rotation.y = rotY;

        const mainW = 4.6; const mainH = 2.2; const mainD = 2.8;
        const mainBuilding = new THREE.Mesh(new THREE.BoxGeometry(mainW, mainH, mainD), hospitalWhiteMat);
        mainBuilding.position.y = mainH * 0.5;
        mainBuilding.castShadow = true;
        mainBuilding.receiveShadow = true;
        group.add(mainBuilding);

        for (let row = 0; row < 2; row++) {
          const win = new THREE.Mesh(new THREE.BoxGeometry(mainW * 0.82, 0.42, 0.06), glassWindowMat);
          win.position.set(0, 0.6 + row * 1.0, mainD * 0.5 + 0.03);
          group.add(win);
        }

        const igdW = 2.2; const igdH = 1.3; const igdD = 1.8;
        const igdBuilding = new THREE.Mesh(new THREE.BoxGeometry(igdW, igdH, igdD), hospitalWhiteMat);
        igdBuilding.position.set(mainW * 0.5 + igdW * 0.45, igdH * 0.5, 0.3);
        group.add(igdBuilding);

        const canopy = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 1.4), hospitalWhiteMat);
        canopy.position.set(mainW * 0.5 + igdW * 0.45, 1.35, 1.3);
        group.add(canopy);

        const crossH = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.32, 0.08), redCrossMat);
        crossH.position.set(0, 1.4, mainD * 0.5 + 0.06);
        const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.0, 0.08), redCrossMat);
        crossV.position.set(0, 1.4, mainD * 0.5 + 0.06);
        group.add(crossH);
        group.add(crossV);

        const helipad = new THREE.Mesh(
          new THREE.RingGeometry(0.65, 0.85, 16),
          new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide })
        );
        helipad.rotation.x = -Math.PI / 2;
        helipad.position.y = mainH + 0.05;
        group.add(helipad);

        registerBuildingGroup(`rsud_${x}_${z}`, 'hospital', x, z, group, true);
        scene.add(group);
      }

      // ── B. HELPER: POSKO BPBD REALISTIS (WARNA OREN) ────────────────
      function createBPBD(x: number, z: number, rotY = 0) {
        const group = new THREE.Group();
        const gy = sampleTerrain(x, z);
        group.position.set(x, gy, z);
        group.rotation.y = rotY;

        const bW = 4.0; const bH = 1.9; const bD = 2.4;
        const body = new THREE.Mesh(new THREE.BoxGeometry(bW, bH, bD), bpbdOrangeMat);
        body.position.y = bH * 0.5;
        body.castShadow = true;
        group.add(body);

        const roof = new THREE.Mesh(new THREE.ConeGeometry(2.8, 1.1, 4), darkSlateMat);
        roof.position.y = bH + 0.55;
        roof.rotation.y = Math.PI / 4;
        group.add(roof);

        const garage = new THREE.Mesh(
          new THREE.BoxGeometry(1.3, 1.0, 0.05),
          new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 })
        );
        garage.position.set(1.0, 0.5, bD * 0.5 + 0.03);
        group.add(garage);

        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 5.0, 8), metalMastMat);
        mast.position.set(-bW * 0.5 - 0.6, 2.5, 0);
        group.add(mast);

        const dish = new THREE.Mesh(
          new THREE.SphereGeometry(0.55, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.5),
          new THREE.MeshStandardMaterial({ color: 0xf8fafc, side: THREE.DoubleSide })
        );
        dish.position.set(-bW * 0.5 - 0.6, 4.3, 0);
        dish.rotation.x = 0.5;
        group.add(dish);

        const sirenLight = new THREE.PointLight(0xef4444, 2.0, 25);
        sirenLight.position.set(-bW * 0.5 - 0.6, 5.2, 0);
        sirenLightRef.current = sirenLight;
        group.add(sirenLight);

        const sirenMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.28, 8), redCrossMat);
        sirenMesh.position.set(-bW * 0.5 - 0.6, 5.15, 0);
        group.add(sirenMesh);

        registerBuildingGroup(`bpbd_${x}_${z}`, 'bpbd', x, z, group, true);
        scene.add(group);
      }

      // Helper: Geometri Atap Limasan / Jurai 4-Sisi Realistis
      function createHipRoofGeometry(w: number, d: number, h: number) {
        const geom = new THREE.BufferGeometry();
        const positions: number[] = [];
        const hw = w * 0.5;
        const hd = d * 0.5;

        const v0 = [-hw, 0, -hd];
        const v1 = [hw, 0, -hd];
        const v2 = [hw, 0, hd];
        const v3 = [-hw, 0, hd];

        function addTri(a: number[], b: number[], c: number[]) {
          positions.push(...a, ...b, ...c);
        }

        if (w >= d) {
          const ridge = Math.max(0.4, w - d);
          const rA = [-ridge * 0.5, h, 0];
          const rB = [ridge * 0.5, h, 0];
          // Belakang
          addTri(v1, v0, rA);
          addTri(v1, rA, rB);
          // Depan
          addTri(v3, v2, rB);
          addTri(v3, rB, rA);
          // Kiri
          addTri(v0, v3, rA);
          // Kanan
          addTri(v2, v1, rB);
          // Penutup Bawah
          addTri(v0, v1, v2);
          addTri(v0, v2, v3);
        } else {
          const ridge = Math.max(0.4, d - w);
          const rA = [0, h, -ridge * 0.5];
          const rB = [0, h, ridge * 0.5];
          // Kiri
          addTri(v0, v3, rB);
          addTri(v0, rB, rA);
          // Kanan
          addTri(v2, v1, rA);
          addTri(v2, rA, rB);
          // Belakang
          addTri(v1, v0, rA);
          // Depan
          addTri(v3, v2, rB);
          // Penutup Bawah
          addTri(v0, v1, v2);
          addTri(v0, v2, v3);
        }

        geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geom.computeVertexNormals();
        return geom;
      }

      // ── C. HELPER: SEKOLAH REALISTIS BENTUK 'U' (WARNA BIRU) ────────
      function createSchool(x: number, z: number, rotY = 0) {
        const group = new THREE.Group();
        const gy = sampleTerrain(x, z);
        group.position.set(x, gy, z);
        group.rotation.y = rotY;

        const courtMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, roughness: 0.8 });
        const fasciaMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
        const doorWoodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });

        // 1. Sayap Utama Belakang (Ruang Guru, Kantor & Lab)
        const backW = 6.4; const backH = 1.6; const backD = 1.9;
        const backWall = new THREE.Mesh(new THREE.BoxGeometry(backW, backH, backD), schoolWallMat);
        backWall.position.set(0, backH * 0.5, -1.0);
        backWall.castShadow = true;
        backWall.receiveShadow = true;
        group.add(backWall);

        // Atap Limasan Sayap Belakang
        const backRoofGeom = createHipRoofGeometry(backW + 0.5, backD + 0.5, 0.95);
        const backRoof = new THREE.Mesh(backRoofGeom, blueSchoolRoofMat);
        backRoof.position.set(0, backH, -1.0);
        backRoof.castShadow = true;
        group.add(backRoof);

        // 2. Sayap Kiri (Ruang Kelas Kiri)
        const wingW = 1.9; const wingH = 1.6; const wingD = 3.2;
        const leftWall = new THREE.Mesh(new THREE.BoxGeometry(wingW, wingH, wingD), schoolWallMat);
        leftWall.position.set(-2.25, wingH * 0.5, 1.45);
        leftWall.castShadow = true;
        leftWall.receiveShadow = true;
        group.add(leftWall);

        // Atap Limasan Sayap Kiri
        const leftRoofGeom = createHipRoofGeometry(wingW + 0.5, wingD + 0.5, 0.95);
        const leftRoof = new THREE.Mesh(leftRoofGeom, blueSchoolRoofMat);
        leftRoof.position.set(-2.25, wingH, 1.45);
        leftRoof.castShadow = true;
        group.add(leftRoof);

        // 3. Sayap Kanan (Ruang Kelas Kanan)
        const rightWall = new THREE.Mesh(new THREE.BoxGeometry(wingW, wingH, wingD), schoolWallMat);
        rightWall.position.set(2.25, wingH * 0.5, 1.45);
        rightWall.castShadow = true;
        rightWall.receiveShadow = true;
        group.add(rightWall);

        // Atap Limasan Sayap Kanan
        const rightRoofGeom = createHipRoofGeometry(wingW + 0.5, wingD + 0.5, 0.95);
        const rightRoof = new THREE.Mesh(rightRoofGeom, blueSchoolRoofMat);
        rightRoof.position.set(2.25, wingH, 1.45);
        rightRoof.castShadow = true;
        group.add(rightRoof);

        // 4. Lapangan Upacara / Courtyard di Tengah Huruf 'U'
        const courtW = 2.6; const courtD = 3.2;
        const court = new THREE.Mesh(new THREE.BoxGeometry(courtW, 0.04, courtD), courtMat);
        court.position.set(0, 0.02, 1.45);
        court.receiveShadow = true;
        group.add(court);

        // Pintu Utama Sayap Belakang & Kanopi
        const mainDoor = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.1, 0.06), doorWoodMat);
        mainDoor.position.set(0, 0.55, -1.0 + backD * 0.5 + 0.03);
        group.add(mainDoor);

        const porchCanopy = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.6), fasciaMat);
        porchCanopy.position.set(0, 1.25, -1.0 + backD * 0.5 + 0.28);
        group.add(porchCanopy);

        // Jendela Kaca Sekolah
        // Sayap Belakang (menghadap lapangan)
        [-1.8, -0.9, 0.9, 1.8].forEach((wx) => {
          const win = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.55, 0.05), glassWindowMat);
          win.position.set(wx, 0.95, -1.0 + backD * 0.5 + 0.03);
          group.add(win);
        });

        // Sayap Kiri (menghadap lapangan)
        [0.4, 1.4, 2.4].forEach((wz) => {
          const win = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.55, 0.65), glassWindowMat);
          win.position.set(-2.25 + wingW * 0.5 + 0.03, 0.95, wz);
          group.add(win);
        });

        // Sayap Kanan (menghadap lapangan)
        [0.4, 1.4, 2.4].forEach((wz) => {
          const win = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.55, 0.65), glassWindowMat);
          win.position.set(2.25 - wingW * 0.5 - 0.03, 0.95, wz);
          group.add(win);
        });

        // 5. Tiang Bendera Merah Putih di Lapangan Upacara
        const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.14, 0.5), courtMat);
        pedestal.position.set(0, 0.07, 1.45);
        group.add(pedestal);

        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 3.4, 8), metalMastMat);
        mast.position.set(0, 1.7, 1.45);
        mast.castShadow = true;
        group.add(mast);

        const finial = new THREE.Mesh(
          new THREE.SphereGeometry(0.065, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8, roughness: 0.2 })
        );
        finial.position.set(0, 3.42, 1.45);
        group.add(finial);

        // Bendera Merah Putih Berkibar
        const flagTop = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.20, 0.02), redCrossMat);
        flagTop.position.set(0.35, 3.12, 1.45);
        flagTop.castShadow = true;
        group.add(flagTop);

        const flagBottom = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.20, 0.02), hospitalWhiteMat);
        flagBottom.position.set(0.35, 2.92, 1.45);
        flagBottom.castShadow = true;
        group.add(flagBottom);

        registerBuildingGroup(`school_${x}_${z}`, 'school', x, z, group, true);
        scene.add(group);
      }

      // ── D. HELPER: BARAK PENGUNGSIAN REALISTIS (KOMPLEKS TENDA BNPB / BPBD) ───
      function createShelterBarak(x: number, z: number, rotY = 0) {
        const group = new THREE.Group();
        const gy = sampleTerrain(x, z);
        group.position.set(x, gy, z);
        group.rotation.y = rotY;

        const pipeMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.75, roughness: 0.3 });
        const roofMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b, // Oranye-kuning terang khas BNPB
          roughness: 0.55,
          side: THREE.DoubleSide
        });

        // 1. Platform / Paving Dasar Barak (Diorama Concrete Pad)
        const padW = 7.6; const padD = 5.8; const padH = 0.12;
        const pad = new THREE.Mesh(
          new THREE.BoxGeometry(padW, padH, padD),
          new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 })
        );
        pad.position.y = padH * 0.5;
        pad.receiveShadow = true;
        group.add(pad);

        // 2. Tenda Pleton Utama BNPB (Gable Tent Khas BNPB Warna Oranye/Kuning)
        const tentW = 3.6; const tentD = 4.8; const wallH = 1.25; const roofPeakH = 1.05;
        // Dinding Tenda (Terpal Kuning BNPB)
        const tentWalls = new THREE.Mesh(
          new THREE.BoxGeometry(tentW, wallH, tentD),
          yellowCanvasMat
        );
        tentWalls.position.set(0, padH + wallH * 0.5, 0);
        tentWalls.castShadow = true;
        group.add(tentWalls);

        // Atap Pelana Prisma Segitiga (Ridge Canvas Roof)
        const roofGeom = new THREE.BufferGeometry();
        const hw = tentW * 0.5 + 0.15;
        const hd = tentD * 0.5 + 0.15;
        const rPos: number[] = [
          // Sisi kiri atap
          -hw, 0, -hd, 0, roofPeakH, -hd, 0, roofPeakH, hd,
          -hw, 0, -hd, 0, roofPeakH, hd, -hw, 0, hd,
          // Sisi kanan atap
          hw, 0, -hd, 0, roofPeakH, hd, 0, roofPeakH, -hd,
          hw, 0, -hd, hw, 0, hd, 0, roofPeakH, hd,
          // Segitiga depan
          -hw, 0, hd, 0, roofPeakH, hd, hw, 0, hd,
          // Segitiga belakang
          -hw, 0, -hd, hw, 0, -hd, 0, roofPeakH, -hd,
        ];
        roofGeom.setAttribute('position', new THREE.Float32BufferAttribute(rPos, 3));
        roofGeom.computeVertexNormals();
        const roof = new THREE.Mesh(roofGeom, roofMat);
        roof.position.set(0, padH + wallH, 0);
        roof.castShadow = true;
        group.add(roof);

        // Rangka Tiang Pipa Galvanis Tenda (Exoskeleton Poles A-Frame)
        [-hd, 0, hd].forEach((pz) => {
          [-hw, hw].forEach((px) => {
            const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, wallH, 8), pipeMat);
            pole.position.set(px, padH + wallH * 0.5, pz);
            group.add(pole);
          });
        });
        // Balok puncak bubungan
        const ridgeBeam = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, tentD + 0.4), pipeMat);
        ridgeBeam.position.set(0, padH + wallH + roofPeakH, 0);
        group.add(ridgeBeam);

        // Jendela Ventilasi Kasa di Sisi Tenda
        [-1.2, 1.2].forEach((pz) => {
          [-hw - 0.02, hw + 0.02].forEach((px) => {
            const vent = new THREE.Mesh(
              new THREE.BoxGeometry(0.04, 0.45, 0.8),
              new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 })
            );
            vent.position.set(px, padH + wallH * 0.6, pz);
            group.add(vent);
          });
        });

        // Kanopi Pintu Masuk Depan + Tiang Penyangga
        const canopy = new THREE.Mesh(
          new THREE.BoxGeometry(1.6, 0.05, 1.2),
          roofMat
        );
        canopy.position.set(0, padH + wallH * 0.95, hd + 0.6);
        canopy.rotation.x = 0.12;
        group.add(canopy);

        [-0.75, 0.75].forEach((cx) => {
          const cPole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, wallH * 0.9, 8), pipeMat);
          cPole.position.set(cx, padH + wallH * 0.45, hd + 1.15);
          group.add(cPole);
        });

        // Spanduk Resmi di Atas Pintu: "BARAK PENGUNGSIAN BNPB"
        const signBoard = new THREE.Mesh(
          new THREE.BoxGeometry(2.2, 0.38, 0.06),
          new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 })
        );
        signBoard.position.set(0, padH + wallH + 0.25, hd + 0.06);
        group.add(signBoard);

        // 3. Tenda Medis / Dapur Umum Satelit (Tenda Kubah / Pyramid Putih di Samping)
        const medTentW = 1.8; const medTentH = 1.35;
        const medTent = new THREE.Mesh(
          new THREE.ConeGeometry(medTentW * 0.75, medTentH, 4),
          new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 })
        );
        medTent.position.set(-2.6, padH + medTentH * 0.5, 0.6);
        medTent.rotation.y = Math.PI / 4;
        medTent.castShadow = true;
        group.add(medTent);

        // Palang Merah Kecil di Tenda Medis
        const medCrossH = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.12, 0.04), redCrossMat);
        medCrossH.position.set(-2.6, padH + 0.75, 0.6 + medTentW * 0.5);
        group.add(medCrossH);
        const medCrossV = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.4, 0.04), redCrossMat);
        medCrossV.position.set(-2.6, padH + 0.75, 0.6 + medTentW * 0.5);
        group.add(medCrossV);

        // 4. Stasiun Tandon Air Bersih BPBD (Water Tank Tower)
        const towerH = 1.1;
        const tankRadius = 0.42; const tankH = 0.95;
        [-0.35, 0.35].forEach((tx) => {
          [-0.35, 0.35].forEach((tz) => {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, towerH, 6), pipeMat);
            leg.position.set(2.6 + tx, padH + towerH * 0.5, -1.2 + tz);
            group.add(leg);
          });
        });
        const tank = new THREE.Mesh(
          new THREE.CylinderGeometry(tankRadius, tankRadius, tankH, 16),
          new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.35 })
        );
        tank.position.set(2.6, padH + towerH + tankH * 0.5, -1.2);
        tank.castShadow = true;
        group.add(tank);

        // 5. Genset Listrik Darurat (Generator Box)
        const genBox = new THREE.Mesh(
          new THREE.BoxGeometry(0.75, 0.5, 0.55),
          new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.5, roughness: 0.4 })
        );
        genBox.position.set(2.6, padH + 0.25, 0.6);
        genBox.castShadow = true;
        group.add(genBox);

        const exhaust = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.025, 0.25, 6),
          pipeMat
        );
        exhaust.position.set(2.8, padH + 0.5 + 0.1, 0.7);
        group.add(exhaust);

        // 6. Palet Logistik Kardus Bantuan Pangan BNPB
        const pallet = new THREE.Mesh(
          new THREE.BoxGeometry(0.85, 0.08, 0.85),
          new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 })
        );
        pallet.position.set(2.6, padH + 0.04, 1.6);
        group.add(pallet);

        [[0, 0], [-0.18, 0.18], [0.18, 0.18]].forEach(([cx, cz], ci) => {
          const box = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.28, 0.35),
            new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.75 })
          );
          box.position.set(2.6 + cx, padH + 0.08 + 0.14 + (ci === 0 ? 0.28 : 0), 1.6 + cz);
          box.castShadow = true;
          group.add(box);
        });

        // 7. Tiang Bendera Merah Putih
        const poleHeight = 3.6;
        const flagPole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.035, 0.035, poleHeight, 8),
          metalMastMat
        );
        flagPole.position.set(-2.5, padH + poleHeight * 0.5, 2.2);
        group.add(flagPole);

        const flagRed = new THREE.Mesh(
          new THREE.BoxGeometry(0.65, 0.22, 0.02),
          new THREE.MeshBasicMaterial({ color: 0xef4444 })
        );
        flagRed.position.set(-2.5 + 0.32, padH + poleHeight - 0.12, 2.2);
        group.add(flagRed);

        const flagWhite = new THREE.Mesh(
          new THREE.BoxGeometry(0.65, 0.22, 0.02),
          new THREE.MeshBasicMaterial({ color: 0xf8fafc })
        );
        flagWhite.position.set(-2.5 + 0.32, padH + poleHeight - 0.34, 2.2);
        group.add(flagWhite);

        // 8. Tiang Lampu Sorot Lapangan (Floodlight Tower)
        const lampPoleH = 3.2;
        const lampPole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.04, lampPoleH, 8),
          pipeMat
        );
        lampPole.position.set(3.2, padH + lampPoleH * 0.5, -2.0);
        group.add(lampPole);

        const floodLightHead = new THREE.Mesh(
          new THREE.BoxGeometry(0.32, 0.2, 0.15),
          new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.8 })
        );
        floodLightHead.position.set(3.2, padH + lampPoleH, -2.0);
        floodLightHead.rotation.x = 0.4;
        group.add(floodLightHead);

        registerBuildingGroup(`barak_${x}_${z}`, 'barak', x, z, group, false);
        scene.add(group);
      }

      // ── E. HELPER: RUMAH WARGA JOGLO / LIMASAN (WARNA MERAH GENTENG) ──
      function createVillageHouse(x: number, z: number, rotY = 0) {
        const group = new THREE.Group();
        const gy = sampleTerrain(x, z);
        group.position.set(x, gy, z);
        group.rotation.y = rotY;

        const wW = 2.2; const wH = 1.1; const wD = 1.8;
        const walls = new THREE.Mesh(new THREE.BoxGeometry(wW, wH, wD), hospitalWhiteMat);
        walls.position.y = wH * 0.5;
        walls.castShadow = true;
        group.add(walls);

        const roofLower = new THREE.Mesh(new THREE.ConeGeometry(2.1, 0.55, 4), jogloClayMat);
        roofLower.position.y = wH + 0.25;
        roofLower.rotation.y = Math.PI / 4;
        group.add(roofLower);

        const roofPeak = new THREE.Mesh(new THREE.ConeGeometry(1.0, 0.75, 4), jogloClayMat);
        roofPeak.position.y = wH + 0.7;
        roofPeak.rotation.y = Math.PI / 4;
        group.add(roofPeak);

        const door = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.75, 0.05), teakWoodMat);
        door.position.set(0, 0.38, wD * 0.5 + 0.03);
        group.add(door);

        [-0.9, 0.9].forEach((px) => {
          const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 6), teakWoodMat);
          pillar.position.set(px, 0.45, wD * 0.5 + 0.35);
          group.add(pillar);
        });

        registerBuildingGroup(`house_${x}_${z}`, 'house', x, z, group, false);
        scene.add(group);
      }

      // ── PENEMPATAN BANGUNAN HASIL KALIBRASI 1:1 DARI ANOTASI USER ──
      CALIBRATED_BUILDINGS.hospitals.forEach((h) => createRSUD(h.x, h.z, h.r));
      CALIBRATED_BUILDINGS.bpbds.forEach((b) => createBPBD(b.x, b.z, b.r));
      CALIBRATED_BUILDINGS.schools.forEach((s) => createSchool(s.x, s.z, s.r));
      CALIBRATED_BUILDINGS.baraks.forEach((b) => createShelterBarak(b.x, b.z, b.r));
      CALIBRATED_BUILDINGS.houses.forEach((h) => createVillageHouse(h.x, h.z, h.r));
    }


    // ── 7. POHON PINUS & KANOPI MINIATUR ─────────────────────────────
    function buildTrees() {
      const treeCoords = [
        { x: -48, z: 42 }, { x: -52, z: 60 }, { x: -55, z: 72 }, { x: -56, z: 95 },
        { x: -20, z: 37 }, { x: -16, z: 51 }, { x: -5, z: 70 }, { x: -4, z: 90 },
        { x: 24, z: 38 }, { x: 28, z: 60 }, { x: 34, z: 72 }, { x: 38, z: 95 },
        { x: -28, z: 75 }, { x: -20, z: 75 }, { x: -44, z: 42 }, { x: 14, z: 60 },
        { x: -35, z: 18 }, { x: -22, z: 9.5 }, { x: 8, z: 15 }, { x: 17, z: 2 },
      ];

      const trunkGeom = new THREE.CylinderGeometry(0.12, 0.18, 0.9, 6);
      const folGeom = new THREE.DodecahedronGeometry(0.75, 1);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
      const folMats = [
        new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 }),
        new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.7 }),
        new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 }),
      ];

      treeCoords.forEach((pt, i) => {
        const group = new THREE.Group();
        const gy = sampleTerrain(pt.x, pt.z);
        group.position.set(pt.x, gy, pt.z);

        const trunk = new THREE.Mesh(trunkGeom, trunkMat);
        trunk.position.y = 0.45;
        trunk.castShadow = true;
        group.add(trunk);

        const folMat = folMats[i % folMats.length];
        const fol = new THREE.Mesh(folGeom, folMat);
        fol.position.y = 1.15;
        fol.castShadow = true;
        group.add(fol);

        scene.add(group);
        registeredTrees.push({
          x: pt.x,
          z: pt.z,
          group,
          trunkMesh: trunk,
          foliageMesh: fol,
          origTrunkMat: trunkMat,
          origFolMat: folMat,
          isCharred: false,
        });
      });
    }

    // ── 7B. TIANG LISTRIK & LAMPU JALAN (SESUAI LOGIKA GEMPA SEDANG & BESAR) ──
    function buildUtilityPoles() {
      const poleCoords = [
        { x: -50, z: 12 }, { x: -44, z: 20 }, { x: -38, z: 28 }, { x: -30, z: 24 },
        { x: -22, z: 26 }, { x: -14, z: 28 }, { x: -6, z: 28 }, { x: 2, z: 26 },
        { x: 10, z: 28 }, { x: 18, z: 30 }, { x: 26, z: 34 }, { x: 34, z: 42 },
        { x: -52, z: 45 }, { x: -46, z: 52 }, { x: -38, z: 58 }, { x: -30, z: 54 },
        { x: -20, z: 58 }, { x: -10, z: 58 }, { x: 0, z: 58 }, { x: 12, z: 58 },
        { x: 22, z: 62 }, { x: 32, z: 65 }, { x: -42, z: 75 }, { x: -32, z: 82 },
        { x: -20, z: 86 }, { x: -8, z: 88 }, { x: 8, z: 90 }, { x: 24, z: 90 },
      ];

      const poleGeom = new THREE.CylinderGeometry(0.055, 0.075, 2.3, 6);
      const crossarmGeom = new THREE.BoxGeometry(0.55, 0.05, 0.05);
      const lampShadeGeom = new THREE.CylinderGeometry(0.08, 0.12, 0.06, 6);
      const bulbGeom = new THREE.SphereGeometry(0.04, 6, 6);

      const poleMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.7, metalness: 0.2 });
      const crossarmMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 });
      const lampMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
      const bulbMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.5 });

      poleCoords.forEach((pt) => {
        const group = new THREE.Group();
        const gy = sampleTerrain(pt.x, pt.z);
        group.position.set(pt.x, gy, pt.z);

        const pole = new THREE.Mesh(poleGeom, poleMat);
        pole.position.y = 1.15;
        pole.castShadow = true;
        group.add(pole);

        const crossarm = new THREE.Mesh(crossarmGeom, crossarmMat);
        crossarm.position.y = 2.15;
        group.add(crossarm);

        const shade = new THREE.Mesh(lampShadeGeom, lampMat);
        shade.position.set(0.24, 2.12, 0);
        group.add(shade);

        const bulb = new THREE.Mesh(bulbGeom, bulbMat);
        bulb.position.set(0.24, 2.06, 0);
        group.add(bulb);

        scene.add(group);
        registeredPoles.push({
          group,
          x: pt.x,
          z: pt.z,
          initialRotX: group.rotation.x,
          initialRotZ: group.rotation.z,
          poleMesh: pole,
        });
      });
    }

    // ── 7C. RETAKAN JALAN ASPAL MENGANGA (GEMPA BESAR) ───────────────────
    function buildRoadFissures() {
      roadFissuresGroup = new THREE.Group();

      const fissurePoints = [
        { x: -6.98, z: 26.32, rot: 0.35, len: 4.5, w: 0.45 },
        { x: 4.32, z: 25.85, rot: -0.4, len: 4.2, w: 0.42 },
        { x: -28.67, z: 23.47, rot: 0.8, len: 5.0, w: 0.48 },
        { x: 21.26, z: 37.99, rot: -0.25, len: 4.6, w: 0.46 },
        { x: -7.66, z: 55.84, rot: 0.5, len: 5.2, w: 0.52 },
        { x: 13.81, z: 56.32, rot: -0.6, len: 4.8, w: 0.48 },
        { x: -0.2, z: 89.65, rot: 0.15, len: 6.0, w: 0.55 },
        { x: 32.78, z: 90.12, rot: -0.3, len: 5.4, w: 0.50 },
      ];

      const fissureMat = new THREE.MeshStandardMaterial({
        color: 0x09090b,
        roughness: 0.95,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -8,
      });

      fissurePoints.forEach((fp) => {
        const gy = sampleTerrain(fp.x, fp.z) + 0.38;
        const geom = new THREE.PlaneGeometry(fp.w, fp.len, 2, 6);
        const pos = geom.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < pos.count; i++) {
          const y = pos.getY(i);
          pos.setX(i, pos.getX(i) + Math.sin(y * 4.5) * 0.14);
        }
        geom.computeVertexNormals();

        const mesh = new THREE.Mesh(geom, fissureMat);
        mesh.rotation.x = -Math.PI / 2;
        mesh.rotation.z = fp.rot;
        mesh.position.set(fp.x, gy, fp.z);
        roadFissuresGroup!.add(mesh);
      });

      roadFissuresGroup.visible = false;
      scene.add(roadFissuresGroup);
    }

    // ── 7D. PARTIKEL DEBU TEBAL RUNTUHAN BANGUNAN (GEMPA BESAR) ──────────
    function buildBuildingDustSystem() {
      const dustCount = 180;
      const geom = new THREE.BufferGeometry();
      const posArr = new Float32Array(dustCount * 3);
      const velArr: { x: number; y: number; z: number; life: number; maxLife: number; homeX: number; homeZ: number; homeY: number }[] = [];

      for (let i = 0; i < dustCount; i++) {
        posArr[i * 3] = 0;
        posArr[i * 3 + 1] = -50;
        posArr[i * 3 + 2] = 0;
        velArr.push({
          x: (Math.random() - 0.5) * 0.08,
          y: 0.03 + Math.random() * 0.06,
          z: (Math.random() - 0.5) * 0.08,
          life: Math.random() * 60,
          maxLife: 60 + Math.random() * 40,
          homeX: 0,
          homeZ: 0,
          homeY: 0,
        });
      }

      geom.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
      const mat = new THREE.PointsMaterial({
        color: 0xe2e8f0,
        size: 2.6,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      });

      buildingDustPoints = new THREE.Points(geom, mat);
      (buildingDustPoints as any).userData = { vels: velArr };
      buildingDustPoints.visible = false;
      scene.add(buildingDustPoints);
    }

    // ── LOGIKA KERUSAKAN BANGUNAN & POHON AKIBAT BENCANA ─────────────
    function damageBuilding(b: RegisteredBuilding, amount: number, cause: 'lapilli' | 'bomb' | 'pyroclastic') {
      if (b.damageState === 'destroyed') return;
      b.hp = Math.max(0, b.hp - amount);

      if (b.hp <= 0 || cause === 'bomb' || (cause === 'pyroclastic' && !b.isConcrete)) {
        b.hp = 0;
        b.damageState = 'destroyed';
        b.isCharred = true;
        // Efek visual: roboh / runtuh total, miring, puing berjelaga hitam
        b.group.scale.y = 0.36;
        b.group.rotation.z = b.initialRotZ + (b.x > 0 ? 0.24 : -0.24);
        b.group.rotation.x = b.initialRotX + 0.15;
        b.group.position.y = b.initialY - 0.12;
        b.meshes.forEach(({ mesh }) => {
          mesh.material = charredSootMat;
        });
      } else if (b.hp < 100) {
        b.damageState = 'damaged';
        // Efek visual: atap retak / miring sedikit, dinding berjelaga
        b.group.rotation.z = b.initialRotZ + (b.x > 0 ? 0.08 : -0.08);
        b.meshes.forEach(({ mesh }) => {
          mesh.material = scorchedWallMat;
        });
      }
    }

    function charBuildingWithPyroclastic(b: RegisteredBuilding) {
      if (b.isCharred) return;
      b.isCharred = true;
      if (b.isConcrete) {
        // Bangunan beton (RSUD, BPBD, Sekolah) tetap berdiri kokoh, tetapi fasad gosong kelam terkena awan panas 600°C
        b.meshes.forEach(({ mesh }) => {
          mesh.material = scorchedWallMat;
        });
      } else {
        // Bangunan kayu / limasan desa / tenda barak langsung hancur terbakar
        damageBuilding(b, 100, 'pyroclastic');
      }
    }

    function charTree(t: RegisteredTree) {
      if (t.isCharred) return;
      t.isCharred = true;
      t.foliageMesh.visible = false; // daun terbakar rontok habis
      t.trunkMesh.material = charredTreeTrunkMat; // batang kayu jadi arang hitam legam
    }

    function resetDisasterState() {
      registeredBuildings.forEach((b) => {
        b.hp = 100;
        b.damageState = 'intact';
        b.isCharred = false;
        if (b.crackMesh) b.crackMesh.visible = false;
        if (b.rubbleMesh) b.rubbleMesh.visible = false;
        b.group.scale.set(1, 1, 1);
        b.group.rotation.set(b.initialRotX, b.initialRotY, b.initialRotZ);
        b.group.position.set(b.x, b.initialY, b.z);
        b.meshes.forEach(({ mesh, origMat }) => {
          mesh.material = origMat;
        });
      });
      registeredPoles.forEach((p) => {
        p.group.rotation.set(0, 0, p.initialRotZ);
      });
      if (roadFissuresGroup) roadFissuresGroup.visible = false;
      if (buildingDustPoints) buildingDustPoints.visible = false;
      npcs.forEach((npc) => {
        npc.status = 'IDLE';
        npc.isKnockedOut = false;
        npc.isProne = false;
        npc.crouchTimer = 0;
        npc.gazeTimer = 0;
        npc.lookUpTimer = 0;
        npc.dodgeOffset = 0;
        npc.dodgeTimer = 0;
        npc.shelteredInConcrete = false;
        npc.evacuated = false;
        npc.mesh.visible = true;
        npc.mesh.rotation.x = 0;
        npc.headMesh.rotation.x = 0;
        npc.headMesh.rotation.y = 0;
        npc.bodyMesh.scale.y = 1.0;
        npc.headMesh.position.y = npc.role === 'student' ? 0.48 : 0.60;
      });
      if (evacVehicle) {
        evacVehicle.isActive = false;
        evacVehicle.currentZ = evacVehicle.initialZ;
        const vy = sampleTerrain(evacVehicle.initialX, evacVehicle.initialZ) + 0.15;
        evacVehicle.group.position.set(evacVehicle.initialX, vy, evacVehicle.initialZ);
        evacVehicle.group.visible = true;
        evacVehicle.beaconLight.intensity = 0;
      }
      registeredTrees.forEach((t) => {
        t.isCharred = false;
        t.foliageMesh.visible = true;
        t.trunkMesh.material = t.origTrunkMat;
      });
      registeredRivers.forEach((track) => {
        track.firstContactSlice = -1;
        track.propagationHead = -1;
        track.turbidity.fill(0);
        const colors = track.colorsAttr.array as Float32Array;
        for (let i = 0; i < track.sliceCoords.length; i++) {
          const vL = (2 * i) * 3;
          const vR = (2 * i + 1) * 3;
          colors[vL] = 0.01; colors[vL + 1] = 0.52; colors[vL + 2] = 0.78;
          colors[vR] = 0.01; colors[vR + 1] = 0.52; colors[vR + 2] = 0.78;
        }
        track.colorsAttr.needsUpdate = true;
      });
      if (riverMaterialRef) {
        riverMaterialRef.color.setHex(0xffffff);
        riverMaterialRef.emissive.setHex(0x022035);
        riverMaterialRef.emissiveIntensity = 0.55;
        riverMaterialRef.roughness = 0.18;
      }
      if (plinianColumnGroupRef.current) plinianColumnGroupRef.current.visible = false;
      if (collapsingColumnGroupRef.current) collapsingColumnGroupRef.current.visible = false;
      if (lavaFountainGroupRef.current) lavaFountainGroupRef.current.visible = false;
      if (bombsGroupRef.current) bombsGroupRef.current.visible = false;
      if (pyroclasticGroupRef.current) pyroclasticGroupRef.current.visible = false;
      if (pyroclasticLightsGroupRef.current) {
        pyroclasticLightsGroupRef.current.children.forEach((l) => {
          (l as THREE.PointLight).intensity = 0;
        });
      }
      if (thermalFirePointsRef.current) thermalFirePointsRef.current.visible = false;
      if (steamVaporPointsRef.current) steamVaporPointsRef.current.visible = false;
      if (lavaStreamsGroupRef.current) lavaStreamsGroupRef.current.visible = false;
      lavaTubes.forEach(({ light }) => {
        light.intensity = 0;
      });
      activeLavaPointsRef.current = [];
      if (ashFallPointsRef.current) {
        (ashFallPointsRef.current.material as THREE.PointsMaterial).opacity = 0;
        ashFallPointsRef.current.visible = false;
      }
      if (smokePointsRef.current) {
        const mat = smokePointsRef.current.material as THREE.PointsMaterial;
        mat.color.setHex(0xf1f5f9);
        mat.size = 3.5;
        mat.opacity = 0.45;
      }
      if (scene.fog) {
        scene.fog.color.setHex(0x060913);
        (scene.fog as THREE.FogExp2).density = 0.0028;
      }
      isPostDisasterRef.current = false;
      lastEruptionTypeRef.current = 'NONE';
      hasEnvironmentalDamageRef.current = false;
      setHasDisasterImpact(false);
      setEruptionStageText('');
    }
    resetDisasterStateRef.current = resetDisasterState;

    // ── 8. BUNDARAN LAMPU SENSOR LED PUSAT (SUPER TERANG & MENYALA) ──
    function buildCentralLed() {
      const ledPos = new THREE.Vector2(-5, 22);
      const groundY = sampleTerrain(ledPos.x, ledPos.y);

      const group = new THREE.Group();
      group.position.set(ledPos.x, groundY, ledPos.y);

      // Piringan pendaran cahaya di atas aspal & tanah sekitarnya (Ground Light Pool)
      const groundLight = new THREE.Mesh(
        new THREE.RingGeometry(0.3, 8.5, 36),
        new THREE.MeshBasicMaterial({
          color: 0x00ff66,
          transparent: true,
          opacity: 0.45,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      groundLight.rotation.x = -Math.PI / 2;
      groundLight.position.y = 0.08;
      ledGroundRingRef.current = groundLight;
      group.add(groundLight);

      // Base Bundaran Jalan yang Kokoh
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(2.2, 2.6, 0.45, 24),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 })
      );
      base.position.y = 0.22;
      group.add(base);

      // Ring lis pembatas bundaran
      const curb = new THREE.Mesh(
        new THREE.CylinderGeometry(2.4, 2.5, 0.15, 24),
        new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.6 })
      );
      curb.position.y = 0.08;
      group.add(curb);

      // Tiang Baja Utama Menara Lampu
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.26, 0.34, 2.8, 12),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 })
      );
      pole.position.y = 1.6;
      group.add(pole);

      // Dudukan / Bracket Lampu Baja
      const bracket = new THREE.Mesh(
        new THREE.CylinderGeometry(1.1, 0.35, 0.4, 16),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 })
      );
      bracket.position.y = 3.0;
      group.add(bracket);

      // 1. Bola Lampu Utama (Core Beacon Bulb - Radius 1.35 unit)
      const domeMat = new THREE.MeshStandardMaterial({
        color: 0x00ff66,
        emissive: 0x00ff66,
        emissiveIntensity: 8.5,
        roughness: 0.05,
        metalness: 0.1,
      });
      const dome = new THREE.Mesh(new THREE.SphereGeometry(1.35, 24, 24), domeMat);
      dome.position.y = 3.6;
      ledMeshRef.current = dome;
      group.add(dome);

      // Inti Pijar Putih Panas di Tengah Bola Lampu
      const coreBulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.85, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      coreBulb.position.y = 3.6;
      group.add(coreBulb);

      // 2. Inner Glow Halo (Additive Blending)
      const innerHaloMat = new THREE.MeshBasicMaterial({
        color: 0x00ff66,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.BackSide,
      });
      const innerHalo = new THREE.Mesh(new THREE.SphereGeometry(2.6, 20, 20), innerHaloMat);
      innerHalo.position.y = 3.6;
      ledHaloMeshRef.current = innerHalo;
      group.add(innerHalo);

      // 3. Outer Corona Flare (Pendaran Cahaya Luar Sangat Terang)
      const outerHaloMat = new THREE.MeshBasicMaterial({
        color: 0x00ff66,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.BackSide,
      });
      const outerHalo = new THREE.Mesh(new THREE.SphereGeometry(5.2, 20, 20), outerHaloMat);
      outerHalo.position.y = 3.6;
      ledOuterHaloMeshRef.current = outerHalo;
      group.add(outerHalo);

      // 4. PointLight Intensitas Tinggi (Penerangan Area 3D Merapi)
      const pLight = new THREE.PointLight(0x00ff66, 25.0, 60, 1.2);
      pLight.position.set(0, 3.8, 0);
      ledLightRef.current = pLight;
      group.add(pLight);

      scene.add(group);
    }



    // ── 10. KAWAH, KUBAH LAVA (LAVA DOME) & SISTEM PARTIKEL ASAP/ABU ──
    function buildCraterVFX() {
      const peakY = sampleTerrain(PEAK_X, PEAK_Z) + 1.0;

      // Danau Kawah Magma
      const lavaGeom = new THREE.CircleGeometry(3.2, 16);
      const lavaMat = new THREE.MeshBasicMaterial({ color: 0xff3b00, side: THREE.DoubleSide });
      lavaMatRef.current = lavaMat;
      const lavaDisk = new THREE.Mesh(lavaGeom, lavaMat);
      lavaDisk.position.set(PEAK_X, peakY - 0.3, PEAK_Z);
      lavaDisk.rotation.x = -Math.PI / 2;
      scene.add(lavaDisk);

      // Partikel Asap Vulkanik (120 Partikel)
      const count = 120;
      const smokeGeom = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const velocities: { x: number; y: number; z: number; life: number; maxLife: number }[] = [];

      for (let i = 0; i < count; i++) {
        positions[i * 3] = PEAK_X + (Math.random() - 0.5) * 4;
        positions[i * 3 + 1] = peakY + Math.random() * 8;
        positions[i * 3 + 2] = PEAK_Z + (Math.random() - 0.5) * 4;

        velocities.push({
          x: (Math.random() - 0.5) * 0.08,
          y: 0.1 + Math.random() * 0.18,
          z: (Math.random() - 0.5) * 0.08,
          life: Math.random() * 60,
          maxLife: 60 + Math.random() * 60,
        });
      }

      smokeGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const smokeMat = new THREE.PointsMaterial({
        color: 0xe2e8f0,
        size: 4.5,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
      });

      const smoke = new THREE.Points(smokeGeom, smokeMat);
      smokePointsRef.current = smoke;
      (smoke as any).userData = { velocities, peakY };
      scene.add(smoke);
    }

    // ── 11. ALIRAN LELEHAN LAVA PIJAR DINAMIS (GRAVITY PATHFINDING & COOLING TEXTURE) ──
    interface DynamicLavaTube {
      mesh: THREE.Mesh;
      fullCurve: THREE.CatmullRomCurve3;
      light: THREE.PointLight;
      radius: number;
    }
    const lavaTubes: DynamicLavaTube[] = [];

    function buildDynamicLavaStreams() {
      const group = new THREE.Group();
      lavaStreamsGroupRef.current = group;

      // 6 Aliran lelehan lava yang meluap dari bibir kawah menuruni lereng atas
      const streamDefs = [
        { path: EFFUSIVE_LAVA_EAST_GENDOL, radius: 1.25 },
        { path: EFFUSIVE_LAVA_EAST_WORO, radius: 1.10 },
        { path: EFFUSIVE_LAVA_SOUTH_KUNING_MAIN, radius: 1.30 },
        { path: EFFUSIVE_LAVA_SOUTH_KUNING_BRANCH, radius: 0.95 },
        { path: EFFUSIVE_LAVA_WEST_BOYONG_MAIN, radius: 1.25 },
        { path: EFFUSIVE_LAVA_WEST_BOYONG_BRANCH, radius: 0.95 },
      ];
      const lavaStreamMat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.55,
        metalness: 0.15,
        emissive: 0x330c00,
        emissiveIntensity: 1.2,
      });

      streamDefs.forEach(({ path, radius }) => {
        const sampledPts: THREE.Vector3[] = [];
        path.forEach((pt) => {
          const gy = sampleTerrain(pt.x, pt.z) + 0.22;
          sampledPts.push(new THREE.Vector3(pt.x, gy, pt.z));
        });

        const fullCurve = new THREE.CatmullRomCurve3(sampledPts);

        // Dummy initial mesh kecil di bibir kawah
        const initialPts = [sampledPts[0], sampledPts[0].clone().add(new THREE.Vector3(0.01, 0, 0.01))];
        const subCurve = new THREE.CatmullRomCurve3(initialPts);
        const tubeGeom = new THREE.TubeGeometry(subCurve, 4, radius, 8, false);

        // Inisialisasi attribute warna vertex
        const colors = new Float32Array(tubeGeom.attributes.position.count * 3);
        for (let c = 0; c < colors.length; c += 3) {
          colors[c] = 1.0; colors[c + 1] = 0.35; colors[c + 2] = 0.05;
        }
        tubeGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const tubeMesh = new THREE.Mesh(tubeGeom, lavaStreamMat);
        tubeMesh.castShadow = true;
        group.add(tubeMesh);

        const headLight = new THREE.PointLight(0xff5500, 3.5, 22);
        headLight.position.copy(sampledPts[0]);
        group.add(headLight);

        lavaTubes.push({ mesh: tubeMesh, fullCurve, light: headLight, radius });
      });

      group.visible = false;
      scene.add(group);
    }

    // Pemanjangan kontinu lava dari puncak menuruni lereng secara pelan & bertahap (Smooth Continuous Extrusion)
    function updateLavaCreep(progress: number, elapsed: number, isEffusiveFlow: boolean = false) {
      if (!lavaStreamsGroupRef.current) return;
      if (progress <= 0.003) {
        lavaStreamsGroupRef.current.visible = false;
        activeLavaPointsRef.current = [];
        lavaTubes.forEach(({ light }) => {
          light.intensity = 0;
        });
        return;
      }
      lavaStreamsGroupRef.current.visible = true;

      const glow = 2.4 + Math.sin(elapsed * 6.5) * 1.0;
      const allActivePts: THREE.Vector3[] = [];

      lavaTubes.forEach(({ mesh, fullCurve, light, radius }) => {
        // Jumlah titik sampel sub-kurva dari kawah (u=0) ke ujung depan lava (u=progress)
        // Memanjang secara kontinu milimeter demi milimeter dari bibir kawah ke bawah tanpa pop-in jump
        const numSubPts = Math.max(6, Math.ceil(progress * 42));
        const activePts: THREE.Vector3[] = [];

        for (let k = 0; k <= numSubPts; k++) {
          const u = (k / numSubPts) * progress;
          const pt = fullCurve.getPoint(u);
          // Evaluasi kontur permukaan tanah diorama agar aliran lava menempel presisi pada lekukan lereng
          const gy = sampleTerrain(pt.x, pt.z) + 0.28;
          activePts.push(new THREE.Vector3(pt.x, gy, pt.z));
        }

        // Pastikan ujung depan tidak menumpuk identik dengan titik awal jika baru mulai keluar
        if (activePts.length >= 2) {
          const totalDist = activePts[0].distanceTo(activePts[activePts.length - 1]);
          if (totalDist < 0.15) {
            const tangent = fullCurve.getTangent(0).normalize().multiplyScalar(0.18);
            const nudged = activePts[0].clone().add(tangent);
            nudged.y = sampleTerrain(nudged.x, nudged.z) + 0.28;
            activePts[activePts.length - 1] = nudged;
          }
        }

        allActivePts.push(...activePts);

        if (activePts.length >= 2) {
          mesh.geometry.dispose();
          const subCurve = new THREE.CatmullRomCurve3(activePts);
          const tubularSegments = Math.max(8, numSubPts * 2);
          const radialSegments = 8;
          // Radius bertumbuh halus saat awal keluar dari bibir kawah (tidak mendadak gemuk/tabung tebal)
          const curRadius = (isEffusiveFlow ? radius : radius * 0.75) * Math.min(1.0, 0.45 + progress * 6.5);
          const tubeGeom = new THREE.TubeGeometry(
            subCurve,
            tubularSegments,
            curRadius,
            radialSegments,
            false
          );

          // Dinamika Pendinginan Tekstur (Cooling Effect):
          // Merah Pijar (Panas) → Jingga → Hitam/Abu-abu (Membeku menjadi batuan basal)
          const count = tubeGeom.attributes.position.count;
          const colors = new Float32Array(count * 3);
          const rings = tubularSegments + 1;
          const radialVerts = radialSegments + 1;

          for (let r = 0; r < rings; r++) {
            const t = r / tubularSegments; // 0: hulu kawah, 1: ujung terdepan
            let cr = 0, cg = 0, cb = 0;

            if (t > 0.80) {
              // 1. Merah Pijar Panas Membara ke Kuning Keemasan di ujung depan
              const f = (t - 0.80) / 0.20;
              cr = 1.0;
              cg = 0.45 + f * 0.45;
              cb = 0.05 + f * 0.20;
            } else if (t > 0.35) {
              // 2. Jingga hangat membakar di badan tengah
              const f = (t - 0.35) / 0.45;
              cr = 0.85 + f * 0.15;
              cg = 0.18 + f * 0.27;
              cb = 0.02 + f * 0.03;
            } else {
              // 3. Membeku menjadi kerak batuan basal hitam/abu-abu
              const f = t / 0.35;
              cr = 0.12 + f * 0.55;
              cg = 0.12 + f * 0.12;
              cb = 0.14 + f * 0.02;
            }

            for (let s = 0; s < radialVerts; s++) {
              const idx = (r * radialVerts + s) * 3;
              const angle = (s / radialSegments) * Math.PI * 2;
              const isTopCrust = Math.sin(angle) > 0.2;
              const crustDim = (isTopCrust && t < 0.85) ? 0.65 : 1.0;

              colors[idx] = cr * crustDim;
              colors[idx + 1] = cg * crustDim;
              colors[idx + 2] = cb * crustDim;
            }
          }

          tubeGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
          mesh.geometry = tubeGeom;

          const leadPt = activePts[activePts.length - 1];
          light.position.set(leadPt.x, leadPt.y + 0.4, leadPt.z);
          light.intensity = progress > 0.005 ? glow * 1.1 : 0;
          (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = glow * 0.6;
        }
      });

      activeLavaPointsRef.current = allActivePts;
    }

    // ── SISTEM PARTIKEL TERMAL (API BANGUNAN/POHON & UAP AIR SUNGAI) ──
    const MAX_THERMAL_FIRE = 150;
    const fireVels: { x: number; y: number; z: number; life: number; maxLife: number }[] = [];
    const MAX_STEAM_VAPOR = 160;
    const steamVels: { x: number; y: number; z: number; originY: number }[] = [];

    function buildThermalAndSteamParticles() {
      // 1. Api & Bara Termal
      const fireGeom = new THREE.BufferGeometry();
      const firePositions = new Float32Array(MAX_THERMAL_FIRE * 3);
      for (let i = 0; i < MAX_THERMAL_FIRE; i++) {
        firePositions[i * 3] = 0;
        firePositions[i * 3 + 1] = -100;
        firePositions[i * 3 + 2] = 0;
        fireVels.push({ x: 0, y: 0.3 + Math.random() * 0.4, z: 0, life: 0, maxLife: 30 + Math.random() * 30 });
      }
      fireGeom.setAttribute('position', new THREE.BufferAttribute(firePositions, 3));
      const fireMat = new THREE.PointsMaterial({
        color: 0xff4500,
        size: 3.2,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const firePoints = new THREE.Points(fireGeom, fireMat);
      firePoints.visible = false;
      scene.add(firePoints);
      thermalFirePointsRef.current = firePoints;

      // 2. Uap Air Mendidih
      const steamGeom = new THREE.BufferGeometry();
      const steamPositions = new Float32Array(MAX_STEAM_VAPOR * 3);
      for (let i = 0; i < MAX_STEAM_VAPOR; i++) {
        steamPositions[i * 3] = 0;
        steamPositions[i * 3 + 1] = -100;
        steamPositions[i * 3 + 2] = 0;
        steamVels.push({ x: 0, y: 0.5 + Math.random() * 0.6, z: 0, originY: 0 });
      }
      steamGeom.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));
      const steamMat = new THREE.PointsMaterial({
        color: 0xf1f5f9,
        size: 5.5,
        transparent: true,
        opacity: 0.78,
        depthWrite: false,
      });
      const steamPoints = new THREE.Points(steamGeom, steamMat);
      steamPoints.visible = false;
      scene.add(steamPoints);
      steamVaporPointsRef.current = steamPoints;
    }

    function updateThermalParticles(
      burningBldgs: THREE.Vector3[],
      burningTrees: THREE.Vector3[],
      steamContacts: THREE.Vector3[],
      dt: number,
      elapsed: number
    ) {
      if (thermalFirePointsRef.current) {
        const firePts = thermalFirePointsRef.current;
        const allBurn = [...burningBldgs, ...burningTrees];
        if (allBurn.length > 0) {
          firePts.visible = true;
          const posAttr = firePts.geometry.attributes.position as THREE.BufferAttribute;
          for (let i = 0; i < MAX_THERMAL_FIRE; i++) {
            const v = fireVels[i];
            v.life += 1;
            let py = posAttr.getY(i) + v.y * dt * 8.0;
            let px = posAttr.getX(i) + (Math.random() - 0.5) * 0.08;
            let pz = posAttr.getZ(i) + (Math.random() - 0.5) * 0.08;

            if (v.life >= v.maxLife || py > 40 || posAttr.getY(i) < -50) {
              v.life = 0;
              const anchor = allBurn[i % allBurn.length];
              px = anchor.x + (Math.random() - 0.5) * 1.6;
              py = anchor.y + Math.random() * 0.5;
              pz = anchor.z + (Math.random() - 0.5) * 1.6;
            }
            posAttr.setXYZ(i, px, py, pz);
          }
          posAttr.needsUpdate = true;
        } else {
          firePts.visible = false;
        }
      }

      if (steamVaporPointsRef.current) {
        const steamPts = steamVaporPointsRef.current;
        if (steamContacts.length > 0) {
          steamPts.visible = true;
          const posAttr = steamPts.geometry.attributes.position as THREE.BufferAttribute;
          for (let i = 0; i < MAX_STEAM_VAPOR; i++) {
            const v = steamVels[i];
            let py = posAttr.getY(i) + v.y * dt * 9.0;
            let px = posAttr.getX(i) + Math.sin(elapsed * 2.5 + i) * 0.09;
            let pz = posAttr.getZ(i) + Math.cos(elapsed * 2.5 + i) * 0.09;

            if (py > v.originY + 12.0 || posAttr.getY(i) < -50) {
              const anchor = steamContacts[i % steamContacts.length];
              px = anchor.x + (Math.random() - 0.5) * 2.2;
              py = anchor.y + Math.random() * 0.6;
              pz = anchor.z + (Math.random() - 0.5) * 2.2;
              v.originY = anchor.y;
            }
            posAttr.setXYZ(i, px, py, pz);
          }
          posAttr.needsUpdate = true;
        } else {
          steamPts.visible = false;
        }
      }
    }

    // ── PERAMBATAN KEKERUHAN AIR SUNGAI BERTAHAP (DOWNSTREAM PROPAGATION) ──
    function updateRiverTurbidity(
      dt: number,
      activeLava: THREE.Vector3[],
      steamContacts: THREE.Vector3[]
    ) {
      if (registeredRivers.length === 0) return;

      registeredRivers.forEach((track) => {
        const n = track.sliceCoords.length;

        // 1. Deteksi kontak fisik aliran lava dengan alur sungai di lereng atas
        if (activeLava.length > 0) {
          for (let i = 0; i < n; i++) {
            const sc = track.sliceCoords[i];
            for (let lIdx = 0; lIdx < activeLava.length; lIdx += 2) {
              const lp = activeLava[lIdx];
              const dist = Math.hypot(sc[0] - lp.x, sc[1] - lp.z);
              if (dist < 4.2) {
                // Kontak lava di slice i
                if (track.firstContactSlice === -1 || i < track.firstContactSlice) {
                  track.firstContactSlice = i;
                  if (track.propagationHead < i) {
                    track.propagationHead = i;
                  }
                }
                // Spawning partikel uap putih tebal mendidih di titik kontak air & lava
                steamContacts.push(new THREE.Vector3(sc[0], sampleTerrain(sc[0], sc[1]) + 0.35, sc[1]));
                break;
              }
            }
          }
        }

        // 2. Logika perambatan kekeruhan bertahap ke hilir (Downstream River Propagation)
        if (track.firstContactSlice !== -1) {
          // Titik kontak terus memproduksi kekeruhan pekat
          track.turbidity[track.firstContactSlice] = Math.min(
            1.0,
            track.turbidity[track.firstContactSlice] + dt * 1.6
          );

          // Kepala gelombang kekeruhan mengalir merambat ke hilir menyusuri sungai
          track.propagationHead = Math.min(n - 1, track.propagationHead + track.propagationSpeed * dt);

          // Sedikit difusi ke arah hulu (maksimal 5 slice ke belakang)
          const startSlice = Math.max(0, track.firstContactSlice - 5);
          const endSlice = Math.floor(track.propagationHead);

          const colors = track.colorsAttr.array as Float32Array;
          let changed = false;

          for (let i = startSlice; i <= endSlice; i++) {
            const distFromHead = track.propagationHead - i;
            // Target kekeruhan dengan gradasi halus di ujung depan gelombang
            const targetTurb = Math.min(1.0, Math.max(0.18, distFromHead * 0.22));

            if (track.turbidity[i] < targetTurb) {
              track.turbidity[i] = THREE.MathUtils.lerp(
                track.turbidity[i],
                targetTurb,
                Math.min(1.0, dt * 2.8)
              );
              changed = true;
            }

            const turb = track.turbidity[i];
            // Transisi warna: Biru Jernih (0.01, 0.52, 0.78) -> Cokelat Lumpur Lahar Keruh (0.42, 0.30, 0.18)
            const cr = 0.01 + turb * (0.42 - 0.01);
            const cg = 0.52 + turb * (0.30 - 0.52);
            const cb = 0.78 + turb * (0.18 - 0.78);

            const vL = (2 * i) * 3;
            const vR = (2 * i + 1) * 3;
            colors[vL] = cr; colors[vL + 1] = cg; colors[vL + 2] = cb;
            colors[vR] = cr; colors[vR + 1] = cg; colors[vR + 2] = cb;
          }

          if (changed) {
            track.colorsAttr.needsUpdate = true;
          }
        }
      });
    }

    function handleEffusiveThermalInteractions(dt: number, elapsed: number) {
      const activeLava = activeLavaPointsRef.current;
      if (!activeLava || activeLava.length === 0) return;

      const burningBldgs: THREE.Vector3[] = [];
      const burningTrees: THREE.Vector3[] = [];
      const steamContacts: THREE.Vector3[] = [];

      // 1. Kerusakan Bangunan Termal (DoT & Melting)
      registeredBuildings.forEach((b) => {
        let minD = 999;
        for (let i = 0; i < activeLava.length; i += 2) {
          const lp = activeLava[i];
          const d = Math.hypot(b.x - lp.x, b.z - lp.z);
          if (d < minD) minD = d;
        }

        const hitDist = b.isConcrete ? 4.5 : 3.8;
        if (minD <= hitDist) {
          // Kontak termal langsung! DoT ~5.5% per detik
          const dmg = dt * 5.5;
          b.hp = Math.max(0, b.hp - dmg);
          burningBldgs.push(new THREE.Vector3(b.x, b.group.position.y + 0.4, b.z));

          const melt = (100 - b.hp) / 100;
          if (b.hp <= 0) {
            b.damageState = 'destroyed';
            b.isCharred = true;
            b.group.scale.y = 0.28; // tertimbun lava
            b.group.position.y = b.initialY - 0.45;
            b.meshes.forEach((m) => { m.mesh.material = charredSootMat; });
          } else {
            b.damageState = 'damaged';
            b.group.scale.y = Math.max(0.35, 1.0 - melt * 0.55);
            b.group.position.y = b.initialY - melt * 0.28;
            b.group.rotation.z = b.initialRotZ + (b.x > 0 ? 0.12 : -0.12) * melt;
            b.meshes.forEach((m) => { m.mesh.material = scorchedWallMat; });
          }
        }
      });

      // 2. Kebakaran Pohon/Hutan
      registeredTrees.forEach((t) => {
        let minD = 999;
        for (let i = 0; i < activeLava.length; i += 3) {
          const lp = activeLava[i];
          const d = Math.hypot(t.x - lp.x, t.z - lp.z);
          if (d < minD) minD = d;
        }

        if (minD <= 2.8) {
          burningTrees.push(new THREE.Vector3(t.x, t.group.position.y + 0.6, t.z));
          charTree(t);
        }
      });

      // 3. Efek Uap Air Mendidih Kontak Sungai & Perambatan Kekeruhan Air Sungai Bertahap
      updateRiverTurbidity(dt, activeLava, steamContacts);

      updateThermalParticles(burningBldgs, burningTrees, steamContacts, dt, elapsed);
    }

    // ── 12. KOLOM ABU PLINIAN JAMUR, LAVA FOUNTAIN, BOM & LAPILLI ─────
    interface VolcanicBombItem {
      mesh: THREE.Mesh;
      origin: THREE.Vector3;
      vel: THREE.Vector3;
      gravity: number;
      active: boolean;
      delay: number;
      isLarge: boolean;
    }
    const volcanicBombsList: VolcanicBombItem[] = [];

    interface AshPuffItem {
      mesh: THREE.Mesh;
      relY: number;
      angle: number;
      radius: number;
      speed: number;
    }
    const ashColumnPuffs: AshPuffItem[] = [];
    const ashUmbrellaPuffs: { mesh: THREE.Mesh; dist: number; angle: number; rotSpeed: number }[] = [];
    let volcanicLightningLight: THREE.PointLight | null = null;

    interface LavaFountainDrop {
      mesh: THREE.Mesh;
      vel: THREE.Vector3;
      originY: number;
      active: boolean;
      delay: number;
    }
    const lavaFountainDrops: LavaFountainDrop[] = [];

    // ── DATA STRUKTUR RUNTUHAN KOLOM ABU (COLUMN COLLAPSE TORRENTS) ──
    interface CollapsingTorrentPuff {
      mesh: THREE.Mesh;
      angle: number;
      startRadius: number;
      fallSpeed: number;
      startRelY: number;
      delay: number;
    }
    const collapsingAshTorrents: CollapsingTorrentPuff[] = [];

    function buildPlinianAndEjectaSystems() {
      const peakY = sampleTerrain(PEAK_X, PEAK_Z) + 1.2;

      // 1. Kolom Abu Plinian & Jamur Vulkanik Raksasa
      const plinianGroup = new THREE.Group();
      plinianColumnGroupRef.current = plinianGroup;

      const ashPillarGeom = new THREE.DodecahedronGeometry(2.4, 1);
      const ashMat = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9, // Senada 100% dengan awan panas (putih kelabu cerah kontras tinggi)
        emissive: 0x475569, // Pendaran lembut volume kabut abu senada awan panas
        emissiveIntensity: 0.22,
        roughness: 0.82,
        metalness: 0.02,
        transparent: true,
        opacity: 0.98,
        depthWrite: true,
      });

      for (let i = 0; i < 32; i++) {
        const pMesh = new THREE.Mesh(ashPillarGeom, ashMat);
        pMesh.scale.setScalar(0.7 + Math.random() * 0.6);
        plinianGroup.add(pMesh);
        ashColumnPuffs.push({
          mesh: pMesh,
          relY: i / 32,
          angle: Math.random() * Math.PI * 2,
          radius: 0.8 + Math.random() * 1.4,
          speed: 0.8 + Math.random() * 0.4,
        });
      }

      const umbrellaGeom = new THREE.DodecahedronGeometry(3.2, 1);
      for (let i = 0; i < 28; i++) {
        const uMesh = new THREE.Mesh(umbrellaGeom, ashMat);
        uMesh.scale.setScalar(0.8 + Math.random() * 0.6);
        plinianGroup.add(uMesh);
        ashUmbrellaPuffs.push({
          mesh: uMesh,
          dist: 0.15 + (i / 28) * 0.85,
          angle: (i / 28) * Math.PI * 2 + Math.random() * 0.35,
          rotSpeed: 0.04 + Math.random() * 0.07,
        });
      }

      const lightningLight = new THREE.PointLight(0x60a5fa, 0, 40);
      lightningLight.position.set(PEAK_X, peakY + 30, PEAK_Z);
      volcanicLightningLight = lightningLight;
      plinianGroup.add(lightningLight);

      plinianGroup.visible = false;
      scene.add(plinianGroup);

      // 1B. Tirai Runtuhan Kolom Abu (Column Collapse Torrents)
      const collapseGroup = new THREE.Group();
      collapsingColumnGroupRef.current = collapseGroup;

      const collapseGeom = new THREE.DodecahedronGeometry(2.5, 1);
      for (let i = 0; i < 28; i++) {
        const cMesh = new THREE.Mesh(collapseGeom, ashMat);
        cMesh.scale.setScalar(0.7 + Math.random() * 0.5);
        collapseGroup.add(cMesh);
        collapsingAshTorrents.push({
          mesh: cMesh,
          angle: (i / 28) * Math.PI * 2 + Math.random() * 0.4,
          startRadius: 5 + Math.random() * 5,
          fallSpeed: 18 + Math.random() * 10,
          startRelY: 22 + Math.random() * 10,
          delay: (i / 28) * 1.2,
        });
      }
      collapseGroup.visible = false;
      scene.add(collapseGroup);

      // 2. Lava Fountain (Semburan Pijar Magma di Kawah)
      const fountainGroup = new THREE.Group();
      lavaFountainGroupRef.current = fountainGroup;
      const fountainGeom = new THREE.DodecahedronGeometry(0.45, 0);
      const fountainMat = new THREE.MeshStandardMaterial({
        color: 0xff3b00,
        emissive: 0xff7700,
        emissiveIntensity: 4.2,
        roughness: 0.2,
      });

      for (let i = 0; i < 35; i++) {
        const fMesh = new THREE.Mesh(fountainGeom, fountainMat);
        fountainGroup.add(fMesh);
        lavaFountainDrops.push({
          mesh: fMesh,
          vel: new THREE.Vector3(0, 0, 0),
          originY: peakY,
          active: false,
          delay: Math.random() * 1.5,
        });
      }
      fountainGroup.visible = false;
      scene.add(fountainGroup);

      // 3. Bom Vulkanik Besar (18 Buah) & Lapilli Kecil (45 Buah)
      const bombsGroup = new THREE.Group();
      bombsGroupRef.current = bombsGroup;

      const largeBombGeom = new THREE.DodecahedronGeometry(0.85, 1);
      const largeBombMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xff3b00,
        emissiveIntensity: 3.5,
        roughness: 0.4,
      });

      for (let i = 0; i < 18; i++) {
        const bMesh = new THREE.Mesh(largeBombGeom, largeBombMat);
        bombsGroup.add(bMesh);
        volcanicBombsList.push({
          mesh: bMesh,
          origin: new THREE.Vector3(PEAK_X, peakY + 1.2, PEAK_Z),
          vel: new THREE.Vector3(0, 0, 0),
          gravity: 28,
          active: false,
          delay: 0.2 + Math.random() * 3.5,
          isLarge: true,
        });
      }

      const lapilliGeom = new THREE.DodecahedronGeometry(0.35, 0);
      const lapilliMat = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        emissive: 0xea580c,
        emissiveIntensity: 2.8,
      });

      for (let i = 0; i < 45; i++) {
        const lMesh = new THREE.Mesh(lapilliGeom, lapilliMat);
        bombsGroup.add(lMesh);
        volcanicBombsList.push({
          mesh: lMesh,
          origin: new THREE.Vector3(PEAK_X, peakY + 1.2, PEAK_Z),
          vel: new THREE.Vector3(0, 0, 0),
          gravity: 22,
          active: false,
          delay: 0.4 + Math.random() * 4.5,
          isLarge: false,
        });
      }

      bombsGroup.visible = false;
      scene.add(bombsGroup);

      const expLight = new THREE.PointLight(0xffedd5, 0, 130);
      expLight.position.set(PEAK_X, peakY + 4, PEAK_Z);
      explosionLightRef.current = expLight;
      scene.add(expLight);
    }

    // ── 12B. AWAN PANAS WEDHUS GEMBEL (MASIF, RAPAT & MEMUDAR SEIRING JARAK) ──
    interface PyroclasticPuff {
      mesh: THREE.Mesh;
      material: THREE.MeshStandardMaterial;
      valleyIdx: number;
      tier: 'base' | 'body' | 'crest';
      streamProgress: number;
      streamPosNorm: number;
      sideOffset: number;
      heightOffset: number;
      scaleBase: number;
      rotSpeed: THREE.Vector3;
      puffSeed: number;
      initialEmissiveIntensity: number;
    }
    const pyroclasticPuffs: PyroclasticPuff[] = [];
    const valleySurgeLights: THREE.PointLight[] = [];

    function buildPyroclasticSurge() {
      const group = new THREE.Group();
      pyroclasticGroupRef.current = group;

      const lightsGroup = new THREE.Group();
      pyroclasticLightsGroupRef.current = lightsGroup;

      // 3 Lampu Frontal Pijar Termal untuk Garis Depan Awan Panas di 3 Lembah
      for (let v = 0; v < 3; v++) {
        const pLight = new THREE.PointLight(0xff3b00, 0, 45);
        lightsGroup.add(pLight);
        valleySurgeLights.push(pLight);
      }
      scene.add(lightsGroup);

      // Geometri Gumpalan Awan (Dodecahedron detail 1, radius 1.85 unit)
      const billowGeom = new THREE.DodecahedronGeometry(1.85, 1);

      // 210 Gumpalan Awan (70 per lembah) bertingkat 3-Tier di alur sungai
      for (let v = 0; v < 3; v++) {
        for (let i = 0; i < 70; i++) {
          const tier: 'base' | 'body' | 'crest' = i < 16 ? 'base' : i < 48 ? 'body' : 'crest';
          const isBase = tier === 'base';

          // Material unik per-puff agar opacity & disipasi dapat dikontrol presisi per gumpalan
          const pMat = new THREE.MeshStandardMaterial({
            color: isBase ? 0x9a3412 : 0xf1f5f9,
            emissive: isBase ? 0xff3b00 : 0x475569,
            emissiveIntensity: isBase ? 2.8 : 0.18,
            roughness: 0.86,
            metalness: 0.02,
            transparent: true,
            opacity: 0.95,
            depthWrite: false, // Menghilangkan artefak kotak / clipping tumpang tindih
          });

          const pMesh = new THREE.Mesh(billowGeom, pMat);
          group.add(pMesh);

          // Posisi nominal 0.0 s.d 1.0 sepanjang alur sungai dengan sebaran merata dan jitter
          const norm = i / 69;
          const jitter = (Math.random() - 0.5) * 0.035;
          const streamPosNorm = Math.max(0.01, Math.min(0.99, norm + jitter));

          // Ketinggian vertikal dan skala proporsional bervolume dinamis
          const heightOffset = tier === 'base'
            ? 1.1 + Math.random() * 0.7
            : tier === 'body'
              ? 2.8 + Math.random() * 1.5
              : 5.2 + Math.random() * 2.4;

          const scaleBase = tier === 'base'
            ? 1.15 + Math.random() * 0.35
            : tier === 'body'
              ? 1.55 + Math.random() * 0.45
              : 1.95 + Math.random() * 0.55;

          // Simpangan lateral melebar ke samping seiring menuruni lereng
          const sideSpread = 1.3 + streamPosNorm * 3.8;
          const sideOffset = (Math.random() - 0.5) * 2 * sideSpread;

          pyroclasticPuffs.push({
            mesh: pMesh,
            material: pMat,
            valleyIdx: v,
            tier,
            streamProgress: streamPosNorm,
            streamPosNorm,
            sideOffset,
            heightOffset,
            scaleBase,
            rotSpeed: new THREE.Vector3(
              (Math.random() - 0.5) * 1.6,
              (Math.random() - 0.5) * 2.0,
              (Math.random() - 0.5) * 1.6
            ),
            puffSeed: Math.random() * 10.0,
            initialEmissiveIntensity: isBase ? 2.8 : 0.18,
          });
        }
      }

      group.visible = false;
      scene.add(group);
    }

    // ── 12C. SISTEM HUJAN ABU VULKANIK (ASH FALL FLAKES) ──────────────
    function buildAshFallSystem() {
      const ashCount = 300;
      const ashGeom = new THREE.BufferGeometry();
      const ashPositions = new Float32Array(ashCount * 3);
      const ashVels: { x: number; y: number; z: number }[] = [];

      for (let i = 0; i < ashCount; i++) {
        ashPositions[i * 3] = (Math.random() - 0.5) * 130;
        ashPositions[i * 3 + 1] = 5 + Math.random() * 45;
        ashPositions[i * 3 + 2] = -40 + Math.random() * 140;

        ashVels.push({
          x: (Math.random() - 0.5) * 0.3,
          y: -(1.4 + Math.random() * 2.2),
          z: (Math.random() - 0.5) * 0.3,
        });
      }

      ashGeom.setAttribute('position', new THREE.BufferAttribute(ashPositions, 3));
      const ashMat = new THREE.PointsMaterial({
        color: 0x94a3b8,
        size: 2.2,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });

      const ashPoints = new THREE.Points(ashGeom, ashMat);
      ashFallPointsRef.current = ashPoints;
      (ashPoints as any).userData = { ashVels };
      scene.add(ashPoints);
    }

    // ── 13. GELOMBANG SEISMIK GEMPA BUMI (CINCIN MERAH ALAY DIHAPUS TOTAL) ──
    function buildSeismicRipples() {
      // Efek cincin merah lingkaran alay dihapus total sesuai permintaan user.
      // Gempa hanya mengandalkan getaran tanah alami maket & tremor kamera dengan atenuasi jarak.
      const group = new THREE.Group();
      group.visible = false;
      seismicRingsGroupRef.current = group;
      scene.add(group);
    }

    // ── 14. GARIS BATAS & ZONASI KRB REALISTIS (KRB 1, 2, 3) ───────────────
    function buildKrbBoundaries() {
      const group = new THREE.Group();
      krbLinesGroupRef.current = group;

      const MAP_MIN_X = -66.5;
      const MAP_MAX_X = 66.5;
      const MAP_MIN_Z = -52.0;
      const MAP_MAX_Z = 106.0;

      // 1. ZONASI TERRAIN WARNA TRANSLUCENT (KRB 1: Hijau, KRB 2: Kuning, KRB 3: Merah)
      function createZoneSurfaceMesh(innerR: number, outerR: number, color: number, opacity: number) {
        const positions: number[] = [];
        const indices: number[] = [];
        const rSteps = 6;
        const aSteps = 45;

        for (let ri = 0; ri <= rSteps; ri++) {
          const curR = THREE.MathUtils.lerp(innerR, outerR, ri / rSteps);
          const maxCos = Math.min(1.0, Math.max(-1.0, (MAP_MAX_X - PEAK_X) / Math.max(1, curR * 1.35)));
          const minCos = Math.min(1.0, Math.max(-1.0, (MAP_MIN_X - PEAK_X) / Math.max(1, curR * 1.35)));
          const startAng = Math.acos(maxCos);
          const endAng = Math.acos(minCos);

          for (let ai = 0; ai <= aSteps; ai++) {
            const ang = THREE.MathUtils.lerp(startAng, endAng, ai / aSteps);
            let x = PEAK_X + Math.cos(ang) * curR * 1.35;
            let z = PEAK_Z + Math.sin(ang) * curR;
            x = Math.max(MAP_MIN_X, Math.min(MAP_MAX_X, x));
            z = Math.max(MAP_MIN_Z, Math.min(MAP_MAX_Z, z));
            const y = sampleTerrain(x, z) + 0.12;
            positions.push(x, y, z);
          }
        }

        const stride = aSteps + 1;
        for (let ri = 0; ri < rSteps; ri++) {
          for (let ai = 0; ai < aSteps; ai++) {
            const p0 = ri * stride + ai;
            const p1 = p0 + 1;
            const p2 = (ri + 1) * stride + ai;
            const p3 = p2 + 1;
            indices.push(p0, p2, p1);
            indices.push(p1, p2, p3);
          }
        }

        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geom.setIndex(indices);
        geom.computeVertexNormals();

        const mat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity,
          depthWrite: false,
          side: THREE.DoubleSide,
        });

        return new THREE.Mesh(geom, mat);
      }

      // Zona KRB III: Merah (2 - 34)
      group.add(createZoneSurfaceMesh(2.0, 34.0, 0xef4444, 0.22));
      // Zona KRB II: Kuning (34 - 68)
      group.add(createZoneSurfaceMesh(34.0, 68.0, 0xfacc15, 0.18));

      // 2. GARIS TEBAL BATAS KRB (Ribbon 3D Tebal + Cahaya Emissive)
      function createKrbRibbonArc(radius: number, color: number, emissiveColor: number, width: number = 0.85) {
        const maxCos = Math.min(1.0, Math.max(-1.0, (MAP_MAX_X - PEAK_X) / (radius * 1.35)));
        const minCos = Math.min(1.0, Math.max(-1.0, (MAP_MIN_X - PEAK_X) / (radius * 1.35)));
        const startAng = Math.acos(maxCos);
        const endAng = Math.acos(minCos);

        const steps = 60;
        const pts: [number, number][] = [];
        const linePts: THREE.Vector3[] = [];
        for (let i = 0; i <= steps; i++) {
          const ang = THREE.MathUtils.lerp(startAng, endAng, i / steps);
          let x = PEAK_X + Math.cos(ang) * radius * 1.35;
          let z = PEAK_Z + Math.sin(ang) * radius;
          x = Math.max(MAP_MIN_X, Math.min(MAP_MAX_X, x));
          z = Math.max(MAP_MIN_Z, Math.min(MAP_MAX_Z, z));
          pts.push([x, z]);
          linePts.push(new THREE.Vector3(x, sampleTerrain(x, z) + 0.48, z));
        }

        const arcGroup = new THREE.Group();

        // Pita tebal
        const geom = createSmoothRibbonGeometry(pts, width, 0.44);
        const mat = new THREE.MeshStandardMaterial({
          color,
          emissive: emissiveColor,
          emissiveIntensity: 0.6,
          roughness: 0.4,
          polygonOffset: true,
          polygonOffsetFactor: -3,
          polygonOffsetUnits: -6,
          side: THREE.DoubleSide,
        });
        arcGroup.add(new THREE.Mesh(geom, mat));

        // Garis putus-putus neon di atas pita
        const lineGeom = new THREE.BufferGeometry().setFromPoints(linePts);
        const lineMat = new THREE.LineDashedMaterial({
          color: 0xffffff,
          dashSize: 1.6,
          gapSize: 0.8,
          linewidth: 2,
        });
        const dashLine = new THREE.Line(lineGeom, lineMat);
        dashLine.computeLineDistances();
        arcGroup.add(dashLine);

        return arcGroup;
      }

      // Garis Batas KRB III (Radius 34 - Merah)
      group.add(createKrbRibbonArc(34, 0xef4444, 0xb91c1c, 0.9));
      // Garis Batas KRB II (Radius 68 - Kuning)
      group.add(createKrbRibbonArc(68, 0xf59e0b, 0xd97706, 0.9));

      // 3. TULISAN FLOATING 3D BADGE (KRB 1, KRB 2, KRB 3)
      function createKrbBadge(title: string, subtitle: string, bgColor: string, borderColor: string, pos: [number, number, number], scale: [number, number]) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 160;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle = bgColor;
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 8;
        ctx.shadowColor = borderColor;
        ctx.shadowBlur = 24;

        const x = 14, y = 14, w = 484, h = 132, r = 26;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 46px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(title, 256, 70);

        ctx.fillStyle = '#f1f5f9';
        ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
        ctx.fillText(subtitle, 256, 116);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.set(pos[0], pos[1], pos[2]);
        sprite.scale.set(scale[0], scale[1], 1);
        return sprite;
      }

      // Badge KRB III (Merah)
      group.add(createKrbBadge(
        'KRB III (ZONA MERAH)',
        '',
        'rgba(153, 27, 27, 0.94)',
        '#ef4444',
        [-25.28, sampleTerrain(-25.28, -22.0) + 9.5, -22.0],
        [28, 8.75]
      ));

      // Badge KRB II (Kuning)
      group.add(createKrbBadge(
        'KRB II (ZONA KUNING)',
        '',
        'rgba(180, 83, 9, 0.94)',
        '#f59e0b',
        [22.0, sampleTerrain(22.0, 18.0) + 9.5, 18.0],
        [28, 8.75]
      ));

      // Badge KRB I (Hijau)
      group.add(createKrbBadge(
        'KRB I (ZONA HIJAU)',
        '',
        'rgba(6, 95, 70, 0.94)',
        '#10b981',
        [-28.0, sampleTerrain(-28.0, 72.0) + 9.5, 72.0],
        [28, 8.75]
      ));

      scene.add(group);
    }

    // ── 15. MEDALLION ORNAMEN ARAH MATA ANGIN (COMPASS ROSE) ─────────
    function buildCompassRose() {
      // Koordinat Center di Lereng Hijau Sudut Kanan Atas Peta Merapi (Area Lingkaran Merah Pengguna)
      const COMPASS_X = 50.0;
      const COMPASS_Z = -82.0;
      const COMPASS_RADIUS = 10.0;

      const group = new THREE.Group();

      // 1. KANVAS TEXTURE RESOLUSI TINGGI 1024x1024
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const cx = 512, cy = 512;
      ctx.clearRect(0, 0, 1024, 1024);

      // A. Outer Shadow & Bezel Kuningan Emas (Padded Safe Margin)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 476, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fill();
      ctx.restore();

      // Cincin Bezel Kuningan Luar
      const gBrass1 = ctx.createRadialGradient(cx, cy, 430, cx, cy, 472);
      gBrass1.addColorStop(0, '#78350f');
      gBrass1.addColorStop(0.3, '#d97706');
      gBrass1.addColorStop(0.6, '#fde047');
      gBrass1.addColorStop(0.85, '#b45309');
      gBrass1.addColorStop(1, '#451a03');
      ctx.beginPath();
      ctx.arc(cx, cy, 472, 0, Math.PI * 2);
      ctx.fillStyle = gBrass1;
      ctx.fill();

      // Parit Celah Gelap
      ctx.beginPath();
      ctx.arc(cx, cy, 442, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();

      // Bevel Kuningan Dalam
      const gBrass2 = ctx.createRadialGradient(cx, cy, 420, cx, cy, 442);
      gBrass2.addColorStop(0, '#92400e');
      gBrass2.addColorStop(0.5, '#f59e0b');
      gBrass2.addColorStop(1, '#78350f');
      ctx.beginPath();
      ctx.arc(cx, cy, 442, 0, Math.PI * 2);
      ctx.fillStyle = gBrass2;
      ctx.fill();

      // B. Dial Face Obsidian Navy Dalam
      const gDial = ctx.createRadialGradient(cx, cy, 0, cx, cy, 420);
      gDial.addColorStop(0, '#0f172a');
      gDial.addColorStop(0.65, '#090d16');
      gDial.addColorStop(0.9, '#040711');
      gDial.addColorStop(1, '#020408');
      ctx.beginPath();
      ctx.arc(cx, cy, 420, 0, Math.PI * 2);
      ctx.fillStyle = gDial;
      ctx.fill();

      // Lingkaran Koordinat Konsentris
      [105, 195, 280, 365].forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 3 ? '#d97706' : 'rgba(148, 163, 184, 0.22)';
        ctx.lineWidth = idx === 3 ? 3 : 1.2;
        if (idx !== 3) ctx.setLineDash([4, 4]);
        else ctx.setLineDash([]);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // 16 Garis Pemandu Radial Halus
      for (let i = 0; i < 16; i++) {
        const ang = (i / 16) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * 80, cy + Math.sin(ang) * 80);
        ctx.lineTo(cx + Math.cos(ang) * 365, cy + Math.sin(ang) * 365);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // C. Skala Derajat & Takik Kompas (Radius 372 s.d. 414)
      for (let deg = 0; deg < 360; deg += 2) {
        const ang = (deg - 90) * (Math.PI / 180);
        const is30 = deg % 30 === 0;
        const is10 = deg % 10 === 0;
        const rInner = is30 ? 372 : is10 ? 384 : 394;
        const rOuter = 414;

        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * rInner, cy + Math.sin(ang) * rInner);
        ctx.lineTo(cx + Math.cos(ang) * rOuter, cy + Math.sin(ang) * rOuter);
        ctx.strokeStyle = is30 ? '#fbbf24' : is10 ? '#cbd5e1' : '#64748b';
        ctx.lineWidth = is30 ? 3 : is10 ? 1.8 : 0.9;
        ctx.stroke();

        // Angka Derajat per 30°
        if (is30) {
          const rText = 352;
          const tx = cx + Math.cos(ang) * rText;
          const ty = cy + Math.sin(ang) * rText;
          ctx.save();
          ctx.translate(tx, ty);
          ctx.fillStyle = '#94a3b8';
          ctx.font = 'bold 12px "Segoe UI", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(deg + '°', 0, 0);
          ctx.restore();
        }
      }

      // D. Bintang 4 Penjuru Sekunder (Interkardinal: TL, TG, BD, BL)
      const interAngles = [45, 135, 225, 315];
      const rInter = 195;
      const wInterBase = 30;
      interAngles.forEach((deg) => {
        const ang = (deg - 90) * (Math.PI / 180);
        const tipX = cx + Math.cos(ang) * rInter;
        const tipY = cy + Math.sin(ang) * rInter;
        const baseAngL = ang - Math.PI / 2;
        const baseAngR = ang + Math.PI / 2;
        const baseLX = cx + Math.cos(baseAngL) * wInterBase;
        const baseLY = cy + Math.sin(baseAngL) * wInterBase;
        const baseRX = cx + Math.cos(baseAngR) * wInterBase;
        const baseRY = cy + Math.sin(baseAngR) * wInterBase;

        // Faset Kiri (Emas Cerah)
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(baseLX, baseLY);
        ctx.lineTo(tipX, tipY);
        ctx.closePath();
        ctx.fillStyle = '#fde047';
        ctx.fill();

        // Faset Kanan (Amber Gelap)
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(baseRX, baseRY);
        ctx.closePath();
        ctx.fillStyle = '#b45309';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(baseLX, baseLY);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(baseRX, baseRY);
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // E. Bintang 4 Penjuru Utama (Kardinal: N, E, S, W)
      const rCard = 290;
      const wCardBase = 48;

      const drawNeedle = (angleDeg: number, tipR: number, baseW: number, colLight: string, colDark: string, borderCol?: string) => {
        const ang = (angleDeg - 90) * (Math.PI / 180);
        const tipX = cx + Math.cos(ang) * tipR;
        const tipY = cy + Math.sin(ang) * tipR;
        const baseAngL = ang - Math.PI / 2;
        const baseAngR = ang + Math.PI / 2;
        const baseLX = cx + Math.cos(baseAngL) * baseW;
        const baseLY = cy + Math.sin(baseAngL) * baseW;
        const baseRX = cx + Math.cos(baseAngR) * baseW;
        const baseRY = cy + Math.sin(baseAngR) * baseW;

        // Faset Kiri
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(baseLX, baseLY);
        ctx.lineTo(tipX, tipY);
        ctx.closePath();
        ctx.fillStyle = colLight;
        ctx.fill();

        // Faset Kanan
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(baseRX, baseRY);
        ctx.closePath();
        ctx.fillStyle = colDark;
        ctx.fill();

        // Tulang Tengah Jarum
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(tipX, tipY);
        ctx.strokeStyle = borderCol || '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Garis Tepi
        ctx.beginPath();
        ctx.moveTo(baseLX, baseLY);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(baseRX, baseRY);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        return { tipX, tipY };
      }

      // Selatan (180° / South - Menghadap ke Bawah)
      drawNeedle(180, rCard, wCardBase, '#cbd5e1', '#475569', '#f1f5f9');

      // Timur (90° / East - Menghadap ke Kanan)
      drawNeedle(90, rCard, wCardBase, '#facc15', '#92400e', '#fef08a');

      // Barat (270° / West - Menghadap ke Kiri)
      drawNeedle(270, rCard, wCardBase, '#facc15', '#92400e', '#fef08a');

      // UTARA (0° / North - MENGHADAP KE ATAS! Warna Merah Menyala & Emas)
      const northTip = drawNeedle(0, rCard + 16, wCardBase + 6, '#ef4444', '#991b1b', '#fde047');

      // Finial Intan Emas di Puncak Jarum Utara
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(northTip.tipX, northTip.tipY - 22);
      ctx.lineTo(northTip.tipX + 12, northTip.tipY);
      ctx.lineTo(northTip.tipX, northTip.tipY + 12);
      ctx.lineTo(northTip.tipX - 12, northTip.tipY);
      ctx.closePath();
      ctx.fillStyle = '#fde047';
      ctx.shadowColor = 'rgba(239, 68, 68, 0.9)';
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // F. Poros Pusat Kuningan (Center Hub Pivot)
      const gHubOuter = ctx.createRadialGradient(cx, cy, 48, cx, cy, 64);
      gHubOuter.addColorStop(0, '#78350f');
      gHubOuter.addColorStop(0.5, '#f59e0b');
      gHubOuter.addColorStop(1, '#451a03');
      ctx.beginPath();
      ctx.arc(cx, cy, 64, 0, Math.PI * 2);
      ctx.fillStyle = gHubOuter;
      ctx.fill();
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 44, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();

      // Kubah Permata Merah Tengah
      const gJewel = ctx.createRadialGradient(cx - 8, cy - 8, 4, cx, cy, 38);
      gJewel.addColorStop(0, '#f87171');
      gJewel.addColorStop(0.4, '#dc2626');
      gJewel.addColorStop(0.85, '#991b1b');
      gJewel.addColorStop(1, '#450a0a');
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      ctx.fillStyle = gJewel;
      ctx.shadowColor = 'rgba(239, 68, 68, 0.85)';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Pantulan Cahaya Kilau di Kubah
      ctx.beginPath();
      ctx.arc(cx - 10, cy - 10, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fill();

      // G. BADGE BESAR UTARA, SELATAN, TIMUR, BARAT (DIGEDEIN EKSTRA BESAR & TEGAS)
      const drawBigBadge = (x: number, y: number, text: string, subText: string, mainCol: string, bgCol: string, borderCol: string, radius: number, fontSize: number, subFontSize: number) => {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = bgCol;
        ctx.fill();

        ctx.lineWidth = 4;
        ctx.strokeStyle = borderCol;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Huruf Utama (U, S, T, B)
        ctx.fillStyle = mainCol;
        ctx.font = '900 ' + fontSize + 'px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y + 2);

        // Subtext (UTARA, SELATAN, TIMUR, BARAT)
        if (subText) {
          const textY = y > cy ? y + radius + subFontSize * 0.9 : y - radius - subFontSize * 0.4;
          ctx.font = '900 ' + subFontSize + 'px "Segoe UI", Arial, sans-serif';
          ctx.strokeStyle = '#020617';
          ctx.lineWidth = 4;
          ctx.strokeText(subText, x, textY);
          ctx.fillStyle = borderCol;
          ctx.fillText(subText, x, textY);
        }
        ctx.restore();
      }

      // U (UTARA - PALING BESAR, MENONJOL, MERAH MENYALA MENGHADAP KE ATAS)
      drawBigBadge(cx, 130, 'U', 'UTARA', '#ffffff', '#dc2626', '#fde047', 56, 64, 22);

      // T (TIMUR - KANAN / EAST)
      drawBigBadge(894, cy, 'T', 'TIMUR', '#fef08a', '#0f172a', '#f59e0b', 50, 56, 20);

      // S (SELATAN - BAWAH / SOUTH)
      drawBigBadge(cx, 894, 'S', 'SELATAN', '#ffffff', '#0f172a', '#94a3b8', 50, 56, 20);

      // B (BARAT - KIRI / WEST)
      drawBigBadge(130, cy, 'B', 'BARAT', '#fef08a', '#0f172a', '#f59e0b', 50, 56, 20);

      // Label Interkardinal (TL, TG, BD, BL)
      const interLabels = [
        { text: 'TL', deg: 45, col: '#fde047' },
        { text: 'TG', deg: 135, col: '#cbd5e1' },
        { text: 'BD', deg: 225, col: '#cbd5e1' },
        { text: 'BL', deg: 315, col: '#fde047' },
      ];
      interLabels.forEach((item) => {
        const ang = (item.deg - 90) * (Math.PI / 180);
        const r = 245;
        const lx = cx + Math.cos(ang) * r;
        const ly = cy + Math.sin(ang) * r;
        ctx.save();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(lx, ly, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = item.col;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = item.col;
        ctx.font = '900 18px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.text, lx, ly + 1);
        ctx.restore();
      });

      // Teks Judul Plakat Bawah
      ctx.save();
      ctx.font = '900 18px "Segoe UI", Arial, sans-serif';
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 3;
      ctx.strokeText('DIORAMA MERAPI • ARAH MATA ANGIN', cx, cy + 160);
      ctx.fillStyle = '#fde047';
      ctx.textAlign = 'center';
      ctx.fillText('DIORAMA MERAPI • ARAH MATA ANGIN', cx, cy + 160);
      ctx.restore();

      const compassTexture = new THREE.CanvasTexture(canvas);
      compassTexture.anisotropy = 16;
      compassTexture.generateMipmaps = true;
      compassTexture.minFilter = THREE.LinearMipmapLinearFilter;
      compassTexture.magFilter = THREE.LinearFilter;

      // 2. DISK MESH BERKONTUR MENGIKUTI ELEVASI TERRAIN
      const rings = 10;
      const segments = 48;
      const positions: number[] = [];
      const uvs: number[] = [];
      const indices: number[] = [];

      // Titik Pusat
      positions.push(COMPASS_X, sampleTerrain(COMPASS_X, COMPASS_Z) + 0.22, COMPASS_Z);
      uvs.push(0.5, 0.5);

      for (let r = 1; r <= rings; r++) {
        const rad = (r / rings) * COMPASS_RADIUS;
        for (let s = 0; s < segments; s++) {
          const angle = (s / segments) * Math.PI * 2;
          const x = COMPASS_X + Math.cos(angle) * rad;
          const z = COMPASS_Z + Math.sin(angle) * rad;
          const y = sampleTerrain(x, z) + 0.22;
          // UV: u (0 = Barat/kiri, 1 = Timur/kanan), v (1 = Utara/atas/-z, 0 = Selatan/bawah/+z)
          const u = 0.5 + (Math.cos(angle) * rad) / (2 * COMPASS_RADIUS);
          const v = 0.5 - (Math.sin(angle) * rad) / (2 * COMPASS_RADIUS);
          positions.push(x, y, z);
          uvs.push(u, v);
        }
      }

      for (let s = 0; s < segments; s++) {
        const nextS = (s + 1) % segments;
        indices.push(0, 1 + s, 1 + nextS);
      }

      for (let r = 1; r < rings; r++) {
        const rowStart = 1 + (r - 1) * segments;
        const nextRowStart = 1 + r * segments;
        for (let s = 0; s < segments; s++) {
          const nextS = (s + 1) % segments;
          const p0 = rowStart + s;
          const p1 = rowStart + nextS;
          const p2 = nextRowStart + s;
          const p3 = nextRowStart + nextS;
          indices.push(p0, p2, p1);
          indices.push(p1, p2, p3);
        }
      }

      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geom.setIndex(indices);
      geom.computeVertexNormals();

      const diskMat = new THREE.MeshStandardMaterial({
        map: compassTexture,
        transparent: true,
        roughness: 0.35,
        metalness: 0.2,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -8,
        side: THREE.DoubleSide,
      });
      group.add(new THREE.Mesh(geom, diskMat));

      // 3. CINCIN BEZEL KUNINGAN FISIK 3D MENGELILINGI MEDALLION
      const rimPositions: number[] = [];
      const rimIndices: number[] = [];
      const rimWidth = 0.45;
      for (let s = 0; s <= segments; s++) {
        const angle = (s / segments) * Math.PI * 2;
        const rIn = COMPASS_RADIUS - rimWidth * 0.5;
        const rOut = COMPASS_RADIUS + rimWidth * 0.5;
        const inX = COMPASS_X + Math.cos(angle) * rIn;
        const inZ = COMPASS_Z + Math.sin(angle) * rIn;
        const inY = sampleTerrain(inX, inZ) + 0.26;
        const outX = COMPASS_X + Math.cos(angle) * rOut;
        const outZ = COMPASS_Z + Math.sin(angle) * rOut;
        const outY = sampleTerrain(outX, outZ) + 0.26;

        rimPositions.push(inX, inY, inZ);
        rimPositions.push(outX, outY, outZ);
      }
      for (let s = 0; s < segments; s++) {
        const p0 = s * 2;
        const p1 = s * 2 + 1;
        const p2 = (s + 1) * 2;
        const p3 = (s + 1) * 2 + 1;
        rimIndices.push(p0, p1, p2);
        rimIndices.push(p1, p3, p2);
      }
      const rimGeom = new THREE.BufferGeometry();
      rimGeom.setAttribute('position', new THREE.Float32BufferAttribute(rimPositions, 3));
      rimGeom.setIndex(rimIndices);
      rimGeom.computeVertexNormals();

      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        metalness: 0.85,
        roughness: 0.25,
        emissive: 0x78350f,
        emissiveIntensity: 0.25,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -5,
        polygonOffsetUnits: -10,
      });
      group.add(new THREE.Mesh(rimGeom, rimMat));

      // 4. POROS PUSAT FISIK 3D (BRASS HUB & RED JEWEL)
      const centerBaseY = sampleTerrain(COMPASS_X, COMPASS_Z) + 0.25;
      const hubBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.85, 1.0, 0.3, 20),
        new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          metalness: 0.85,
          roughness: 0.2,
          emissive: 0xb45309,
          emissiveIntensity: 0.25,
        })
      );
      hubBase.position.set(COMPASS_X, centerBaseY + 0.15, COMPASS_Z);
      group.add(hubBase);

      const hubJewel = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 16, 16),
        new THREE.MeshStandardMaterial({
          color: 0xef4444,
          emissive: 0xdc2626,
          emissiveIntensity: 0.45,
          roughness: 0.1,
          metalness: 0.2,
        })
      );
      hubJewel.position.set(COMPASS_X, centerBaseY + 0.35, COMPASS_Z);
      group.add(hubJewel);

      // 5. PENERANGAN AKSEN EMAS LEMBUT
      const compLight = new THREE.PointLight(0xfef08a, 1.2, 22, 1.5);
      compLight.position.set(COMPASS_X, centerBaseY + 3.5, COMPASS_Z);
      group.add(compLight);

      scene.add(group);
    }

    // ── 16. SIMULASI NPC MINIATUR REALISTIS (75 WARGA) & MOBIL EVAKUASI ──
    interface EvacuationVehicle {
      group: THREE.Group;
      initialX: number;
      initialZ: number;
      currentX: number;
      currentZ: number;
      speed: number;
      isActive: boolean;
      beaconLight: THREE.PointLight;
    }
    let evacVehicle: EvacuationVehicle | null = null;

    type NpcRole = 'student' | 'adult' | 'elder' | 'officer';

    interface RealisticNpc {
      id: number;
      mesh: THREE.Group;
      bodyMesh: THREE.Mesh;
      headMesh: THREE.Mesh;
      role: NpcRole;
      fromNode: number;
      toNode: number;
      progress: number;
      baseSpeed: number;
      lateralOffset: number;
      walkPhase: number;
      status: 'IDLE' | 'ALERT' | 'PANIC' | 'EXTREME_PANIC' | 'DUCK_COVER' | 'PRONE';
      isIndoor: boolean;
      indoorBuilding: RegisteredBuilding | null;
      shelteredInConcrete: boolean;
      crouchTimer: number;
      gazeTimer: number;
      lookUpTimer: number;
      dodgeOffset: number;
      dodgeTimer: number;
      isKnockedOut: boolean;
      isProne: boolean;
      evacuated: boolean;
      fieldOffset: { x: number; z: number };
      personalSpeedMod: number;
      exitProgress: number;
      isOutsideBuilding: boolean;
    }

    const npcs: RealisticNpc[] = [];

    function buildEvacuationVehicle() {
      const vGroup = new THREE.Group();
      const initX = 6.33;
      const initZ = 96.0;
      const groundY = sampleTerrain(initX, initZ);

      vGroup.position.set(initX, groundY + 0.15, initZ);

      // 1. Chassis Mobil Tanggap Darurat BPBD / SAR (Oranye Khas + Putih)
      const chassisGeom = new THREE.BoxGeometry(1.4, 0.45, 2.6);
      const chassisMat = new THREE.MeshStandardMaterial({
        color: 0xea580c,
        metalness: 0.35,
        roughness: 0.4,
      });
      const chassis = new THREE.Mesh(chassisGeom, chassisMat);
      chassis.position.y = 0.35;
      chassis.castShadow = true;
      vGroup.add(chassis);

      // 2. Kabin Depan & Kaca Tinted
      const cabGeom = new THREE.BoxGeometry(1.3, 0.55, 1.2);
      const cabMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        metalness: 0.2,
        roughness: 0.3,
      });
      const cab = new THREE.Mesh(cabGeom, cabMat);
      cab.position.set(0, 0.82, -0.4);
      cab.castShadow = true;
      vGroup.add(cab);

      const glassGeom = new THREE.BoxGeometry(1.32, 0.35, 0.7);
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.1,
        metalness: 0.9,
      });
      const windshield = new THREE.Mesh(glassGeom, glassMat);
      windshield.position.set(0, 0.88, -0.4);
      vGroup.add(windshield);

      // 3. Bak Belakang Terbuka / Kanopi Evakuasi untuk Penumpang Warga
      const canopyGeom = new THREE.BoxGeometry(1.36, 0.6, 1.25);
      const canopyMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.7,
      });
      const canopy = new THREE.Mesh(canopyGeom, canopyMat);
      canopy.position.set(0, 0.82, 0.65);
      canopy.castShadow = true;
      vGroup.add(canopy);

      // 4. Roda 4 Truk Evakuasi
      const wheelGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.2, 10);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
      wheelGeom.rotateZ(Math.PI / 2);

      [
        [-0.72, 0.24, -0.75],
        [0.72, 0.24, -0.75],
        [-0.72, 0.24, 0.75],
        [0.72, 0.24, 0.75],
      ].forEach(([wx, wy, wz]) => {
        const wheel = new THREE.Mesh(wheelGeom, wheelMat);
        wheel.position.set(wx, wy, wz);
        wheel.castShadow = true;
        vGroup.add(wheel);
      });

      // 5. Lampu Rotator Sirine Darurat di Atap Kabin
      const sirenGeom = new THREE.CylinderGeometry(0.12, 0.14, 0.16, 8);
      const sirenMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.9,
      });
      const sirenMesh = new THREE.Mesh(sirenGeom, sirenMat);
      sirenMesh.position.set(0, 1.18, -0.4);
      vGroup.add(sirenMesh);

      const beaconLight = new THREE.PointLight(0x38bdf8, 0, 16);
      beaconLight.position.set(0, 1.35, -0.4);
      vGroup.add(beaconLight);

      // 6. Miniatur Warga di Dalam Bak Evakuasi
      const pColors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b];
      [-0.32, 0.32].forEach((px, pi) => {
        [-0.3, 0.3].forEach((pz, pj) => {
          const pGroup = new THREE.Group();
          const pBody = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.13, 0.36, 6),
            new THREE.MeshStandardMaterial({ color: pColors[(pi * 2 + pj) % pColors.length], roughness: 0.6 })
          );
          pBody.position.y = 0.78;
          pGroup.add(pBody);
          const pHead = new THREE.Mesh(
            new THREE.SphereGeometry(0.11, 6, 6),
            new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.5 })
          );
          pHead.position.y = 1.02;
          pGroup.add(pHead);
          pGroup.position.set(px, 0, 0.65 + pz);
          vGroup.add(pGroup);
        });
      });

      scene.add(vGroup);

      evacVehicle = {
        group: vGroup,
        initialX: initX,
        initialZ: initZ,
        currentX: initX,
        currentZ: initZ,
        speed: 7.5,
        isActive: false,
        beaconLight,
      };
    }

    function buildNpcPopulation() {
      // 1. Material visual per arketipe peran (Anak Sekolah, Dewasa, Lansia, Petugas BPBD)
      const studentBodyMats = [
        new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5 }), // Biru seragam
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 }), // Putih kemeja
        new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.6 }), // Pramuka cokelat
      ];
      const adultBodyMats = [
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.6 }), // Merah
        new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.6 }), // Hijau zamrud
        new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.6 }), // Biru muda
        new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.6 }), // Ungu
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 }), // Kuning kunyit
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 }), // Abu gelap
        new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.6 }), // Hijau pinus
      ];
      const elderBodyMats = [
        new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.8 }), // Khaki
        new THREE.MeshStandardMaterial({ color: 0xa8a29e, roughness: 0.8 }), // Abu-abu
        new THREE.MeshStandardMaterial({ color: 0x57534e, roughness: 0.8 }), // Cokelat tua
        new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 }), // Batik cokelat
      ];
      const officerBodyMat = new THREE.MeshStandardMaterial({
        color: 0xea580c, // Rompi oranye khas BPBD / TAGANA
        roughness: 0.4,
      });
      const officerHelmetMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15, // Helm keselamatan kuning BPBD
        roughness: 0.3,
        metalness: 0.2,
      });
      const civilianHeadMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.5 });

      // Geometri proporsional figur miniatur
      const studentBodyGeom = new THREE.CylinderGeometry(0.10, 0.13, 0.40, 6);
      const studentHeadGeom = new THREE.SphereGeometry(0.11, 6, 6);

      const adultBodyGeom = new THREE.CylinderGeometry(0.12, 0.16, 0.48, 6);
      const adultHeadGeom = new THREE.SphereGeometry(0.13, 6, 6);

      const elderBodyGeom = new THREE.CylinderGeometry(0.13, 0.16, 0.44, 6);
      const elderHeadGeom = new THREE.SphereGeometry(0.12, 6, 6);

      const officerBodyGeom = new THREE.CylinderGeometry(0.13, 0.17, 0.50, 6);
      const officerHeadGeom = new THREE.SphereGeometry(0.13, 6, 6);

      // Cari kumpulan seluruh bangunan per kategori agar NPC terdistribusi merata ke seluruh sektor
      const schoolBldgs = registeredBuildings.filter((b) => b.type === 'school');
      const bpbdBldgs = registeredBuildings.filter((b) => b.type === 'bpbd');
      const rsudBldgs = registeredBuildings.filter((b) => b.type === 'hospital');
      const houseBldgs = registeredBuildings.filter((b) => b.type === 'house');
      const barakBldgs = registeredBuildings.filter((b) => b.type === 'barak');

      function getNearestNode(x: number, z: number): number {
        let bestId = ROAD_NODES_3D[0].id;
        let minDist = 99999;
        for (const n of ROAD_NODES_3D) {
          const d = Math.hypot(n.x - x, n.z - z);
          if (d < minDist) {
            minDist = d;
            bestId = n.id;
          }
        }
        return bestId;
      }

      for (let i = 0; i < 75; i++) {
        const group = new THREE.Group();
        let role: NpcRole = 'adult';
        let bodyGeom = adultBodyGeom;
        let headGeom = adultHeadGeom;
        let bodyMat = adultBodyMats[i % adultBodyMats.length];
        let headMat = civilianHeadMat;
        let baseSpeed = 0.0035 + ((i * 7) % 5) * 0.0003;
        let isIndoor = false;
        let indoorBuilding: RegisteredBuilding | null = null;
        let fromNode = 0;
        let toNode = 0;
        const progress = (i * 0.137) % 1.0;

        // Distribusi variasi lajur samping (Lateral Offset) agar TIDAK PERNAH SEBARIS LURUS (Conga-Line Free!)
        const laneIdx = (i * 3) % 7; // 7 lajur melintang di jalan
        const lateralOffset = ((laneIdx - 3) / 3.0) * 0.55 + (((i * 13) % 11) / 10 - 0.5) * 0.18;
        const walkPhase = (i * 1.618) % (Math.PI * 2);

        if (i < 20) {
          // ── KELOMPOK 1: ANAK SEKOLAH (20 Siswa Tersebar di 3 Kompleks Sekolah: Barat, SMP 1 Merapi, Selatan) ──
          role = 'student';
          bodyGeom = studentBodyGeom;
          headGeom = studentHeadGeom;
          bodyMat = studentBodyMats[i % studentBodyMats.length];
          baseSpeed = 0.0042 + ((i * 5) % 5) * 0.0003; // Lincah

          const school = schoolBldgs.length > 0 ? schoolBldgs[i % schoolBldgs.length] : null;
          const schoolNearNode = school ? getNearestNode(school.x, school.z) : 21;
          const schoolNodeObj = NODE_MAP.get(schoolNearNode)!;
          fromNode = schoolNearNode;
          toNode = schoolNodeObj.neighbors[i % schoolNodeObj.neighbors.length];

          // Sebagian siswa di dalam kelas / gedung beton, sebagian di halaman terbuka
          if (i % 2 === 0 && school) {
            isIndoor = true;
            indoorBuilding = school;
          }
        } else if (i < 30) {
          // ── KELOMPOK 2: PETUGAS BPBD / SAR / MEDIS / TAGANA (10 Petugas Tersebar di Seluruh Posko & RSUD) ──
          role = 'officer';
          bodyGeom = officerBodyGeom;
          headGeom = officerHeadGeom;
          bodyMat = officerBodyMat;
          headMat = officerHelmetMat;
          baseSpeed = 0.0046 + ((i * 3) % 5) * 0.0002; // Sigap dan cepat

          let anchorBldg: RegisteredBuilding | null = null;
          if (i % 3 === 0 && bpbdBldgs.length > 0) {
            anchorBldg = bpbdBldgs[Math.floor(i / 3) % bpbdBldgs.length];
          } else if (i % 3 === 1 && rsudBldgs.length > 0) {
            anchorBldg = rsudBldgs[Math.floor(i / 3) % rsudBldgs.length];
          } else if (barakBldgs.length > 0) {
            anchorBldg = barakBldgs[Math.floor(i / 3) % barakBldgs.length];
          }

          const anchorNode = anchorBldg ? getNearestNode(anchorBldg.x, anchorBldg.z) : 42;
          const anchorNodeObj = NODE_MAP.get(anchorNode)!;
          fromNode = anchorNode;
          toNode = anchorNodeObj.neighbors[i % anchorNodeObj.neighbors.length];
        } else if (i < 43) {
          // ── KELOMPOK 3: WARGA LANSIA (13 Lansia Tersebar di Trotoar & Pemukiman) ──
          role = 'elder';
          bodyGeom = elderBodyGeom;
          headGeom = elderHeadGeom;
          bodyMat = elderBodyMats[i % elderBodyMats.length];
          baseSpeed = 0.0022 + ((i * 4) % 4) * 0.0002; // Santai / langkah hati-hati

          const edge = ROAD_EDGES[i % ROAD_EDGES.length];
          fromNode = edge[0];
          toNode = edge[1];
        } else {
          // ── KELOMPOK 4: WARGA DEWASA (32 Warga Tersebar di Berbagai Rumah Penduduk) ──
          role = 'adult';
          bodyGeom = adultBodyGeom;
          headGeom = adultHeadGeom;
          bodyMat = adultBodyMats[i % adultBodyMats.length];
          baseSpeed = 0.0035 + ((i * 7) % 5) * 0.0003;

          const houseIdx = i % (houseBldgs.length || 1);
          const house = houseBldgs[houseIdx];
          if (i < 58 && house) {
            isIndoor = true;
            indoorBuilding = house;
            fromNode = getNearestNode(house.x, house.z);
            const nObj = NODE_MAP.get(fromNode)!;
            toNode = nObj.neighbors[i % nObj.neighbors.length];
          } else {
            const edge = ROAD_EDGES[i % ROAD_EDGES.length];
            fromNode = edge[0];
            toNode = edge[1];
          }
        }

        const body = new THREE.Mesh(bodyGeom, bodyMat);
        body.position.y = role === 'student' ? 0.22 : 0.28;
        body.castShadow = true;
        group.add(body);

        const head = new THREE.Mesh(headGeom, headMat);
        head.position.y = role === 'student' ? 0.48 : 0.60;
        head.castShadow = true;
        group.add(head);

        const fieldOffset = {
          x: (((i * 7) % 17) / 16 - 0.5) * 8.5,
          z: (((i * 11) % 17) / 16 - 0.5) * 8.5,
        };
        const personalSpeedMod = 0.85 + ((i * 13) % 9) * 0.05;

        scene.add(group);
        npcs.push({
          id: i,
          mesh: group,
          bodyMesh: body,
          headMesh: head,
          role,
          fromNode,
          toNode,
          progress,
          baseSpeed,
          lateralOffset,
          walkPhase,
          status: 'IDLE',
          isIndoor,
          indoorBuilding,
          shelteredInConcrete: false,
          crouchTimer: 0,
          gazeTimer: 0,
          lookUpTimer: 0,
          dodgeOffset: 0,
          dodgeTimer: 0,
          isKnockedOut: false,
          isProne: false,
          evacuated: false,
          fieldOffset,
          personalSpeedMod,
          exitProgress: 0,
          isOutsideBuilding: false,
        });
      }

      // Bangun Mobil Evakuasi SAR / BPBD di Barak Selatan (KRB I)
      buildEvacuationVehicle();
    }

    // ── 17. ANIMATION LOOP 60 FPS ULTRA RESPONSIVE ───────────────────
    const clock = new THREE.Clock();

    const eruptionState = {
      active: false,
      startTime: 0,
      stageTime: 0,
      type: 'NONE',
      soundBoomPlayed: false,
      preRumblePlayed: false,
    };

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      controls.update();

      const currentSeismic = seismicLevelRef.current;
      const currentVolcano = volcanoStatusRef.current;
      const currentEruption = eruptionTypeRef.current;

      // Gempa vulkanik intrinsik saat gunung meletus:
      // Saat status AWAS Eksplosif: gempa level 3 aktif kuat terus dari awal hingga akhir!
      // Saat status AWAS Efusif: gempa tremor vulkanik ringan (level 1, getaran mikro halus).
      const isEruptingVolcano = currentVolcano === 'AWAS';
      const isEffusiveEruption = isEruptingVolcano && currentEruption === 'EFUSIF';
      const effectiveSeismic = (currentVolcano === 'SIAGA') ? 0 : isEffusiveEruption ? 1 : Math.max(
        currentSeismic,
        isEruptingVolcano ? 3 : 0
      );
      let currentPyroRadius = 0;

      // Pendaran riak air sungai biru alami kontras tinggi (lapisan paling dasar)
      if (riverMaterialRef) {
        riverMaterialRef.emissiveIntensity = 0.55 + Math.sin(elapsed * 2.8) * 0.10;
      }

      // 1. EFEK GEMPA BUMI SEISMIK ALAMI (GETARAN TANAH, KAMERA & ATENUASI JARAK)
      if (effectiveSeismic > 0 && cameraRef.current) {
        let amp = 0.42;
        let freq = 24;

        if (isEffusiveEruption) {
          amp = 0.42;
          freq = 24;
        } else if (effectiveSeismic === 1) {
          // Gempa Ringan: Sangat tipis dan intermiten (naik-turun sedikit)
          const intermittent = Math.max(0, Math.sin(elapsed * 2.4));
          amp = 0.28 * intermittent;
          freq = 22;
        } else if (effectiveSeismic === 2) {
          // Gempa Sedang: Cukup kuat dan konstan (membuat pandangan pengguna agak bergoyang)
          amp = 1.45;
          freq = 34;
        } else {
          // Gempa Besar: Sangat hebat (kamera bergoyang acak ke segala arah dengan amplitudo tinggi)
          amp = 4.2;
          freq = 46;
        }

        // Camera tremor alami sesuai tingkat gempa
        if (effectiveSeismic === 1 && !isEffusiveEruption && !isEruptingVolcano) {
          // Gempa Ringan: Getaran kamera sangat tipis dan intermiten (naik-turun sedikit di sumbu Y)
          const sY = Math.sin(elapsed * freq) * (amp * 0.45);
          const sX = Math.cos(elapsed * (freq * 0.7)) * (amp * 0.12);
          cameraRef.current.position.add(new THREE.Vector3(sX, sY, 0));
        } else if (effectiveSeismic === 2 && !isEruptingVolcano) {
          // Gempa Sedang: Cukup kuat dan konstan (membuat pandangan agak bergoyang)
          const sX = Math.sin(elapsed * freq) * (amp * 0.35);
          const sY = Math.cos(elapsed * (freq * 1.15)) * (amp * 0.28);
          const sZ = Math.sin(elapsed * (freq * 0.85)) * (amp * 0.18);
          cameraRef.current.position.add(new THREE.Vector3(sX, sY, sZ));
          cameraRef.current.rotation.z += Math.sin(elapsed * freq * 1.1) * 0.0035;
        } else if (effectiveSeismic === 3 || isEruptingVolcano) {
          // Gempa Besar: Bergoyang acak ke segala arah dengan amplitudo tinggi
          const sX = (Math.sin(elapsed * 42) + Math.sin(elapsed * 67 + 0.6) * 0.55) * amp * 0.44;
          const sY = (Math.cos(elapsed * 48) + Math.sin(elapsed * 73 + 1.2) * 0.50) * amp * 0.34;
          const sZ = (Math.sin(elapsed * 36) + Math.cos(elapsed * 60 + 2.0) * 0.45) * amp * 0.28;
          cameraRef.current.position.add(new THREE.Vector3(sX, sY, sZ));
          cameraRef.current.rotation.z += (Math.sin(elapsed * 44) + Math.cos(elapsed * 71)) * 0.0085;
        } else {
          const sX = (Math.sin(elapsed * freq) + Math.sin(elapsed * (freq * 1.61) + 1.2) * 0.5) * amp * 0.42;
          const sY = (Math.cos(elapsed * (freq * 1.1)) + Math.cos(elapsed * (freq * 1.73) + 2.1) * 0.5) * amp * 0.28;
          const sZ = Math.sin(elapsed * (freq * 0.9)) * amp * 0.20;
          cameraRef.current.position.add(new THREE.Vector3(sX, sY, sZ));
          cameraRef.current.rotation.z += Math.sin(elapsed * freq * 1.2) * (amp * 0.0030);
        }

        // Getaran Fisik Tanah Diorama Alami
        if (terrainMeshRef.current) {
          terrainMeshRef.current.position.y = Math.sin(elapsed * 55) * (amp * 0.035);
        }

        // Atenuasi Getaran Fisik Berdasarkan Jarak ke Gunung
        registeredBuildings.forEach((b) => {
          const dist = Math.hypot(b.x - PEAK_X, b.z - PEAK_Z);
          const att = 1 / (1 + 0.018 * dist);
          const jX = Math.sin(elapsed * freq + b.x) * (amp * 0.06 * att);
          const jZ = Math.cos(elapsed * freq * 1.1 + b.z) * (amp * 0.06 * att);
          b.group.position.x = b.x + jX;
          b.group.position.z = b.z + jZ;
        });

        registeredTrees.forEach((t) => {
          const dist = Math.hypot(t.x - PEAK_X, t.z - PEAK_Z);
          const att = 1 / (1 + 0.018 * dist);
          t.group.rotation.z = Math.sin(elapsed * 35 + t.x) * (amp * 0.04 * att);
        });
      } else {
        if (terrainMeshRef.current) terrainMeshRef.current.position.y = 0;
        registeredBuildings.forEach((b) => {
          b.group.position.x = b.x;
          b.group.position.z = b.z;
        });
        registeredTrees.forEach((t) => {
          t.group.rotation.z = 0;
        });
      }

      // ── LOGIKA KHUSUS GEMPA BUMI PADA BANGUNAN, TIANG, RETAKAN JALAN & AUDIO ──
      if (effectiveSeismic > 0 && !eruptionState.active) {
        if (effectiveSeismic !== prevSeismicRef.current) {
          prevSeismicRef.current = effectiveSeismic;
          lastSeismicSoundTimeRef.current = elapsed;
          if (effectiveSeismic === 1) retroAudio.playLightEarthquakeRumble();
          else if (effectiveSeismic === 2) retroAudio.playMediumEarthquakeWithCreak();
          else if (effectiveSeismic === 3) retroAudio.playMajorEarthquakeWithCollapse();
        } else {
          const soundInterval = effectiveSeismic === 1 ? 4.2 : effectiveSeismic === 2 ? 3.6 : 3.2;
          if (elapsed - lastSeismicSoundTimeRef.current >= soundInterval) {
            lastSeismicSoundTimeRef.current = elapsed;
            if (effectiveSeismic === 1) retroAudio.playLightEarthquakeRumble();
            else if (effectiveSeismic === 2) retroAudio.playMediumEarthquakeWithCreak();
            else if (effectiveSeismic === 3) retroAudio.playMajorEarthquakeWithCollapse();
          }
        }
      } else if (effectiveSeismic === 0 && prevSeismicRef.current !== 0) {
        const hadMajorSeismic = prevSeismicRef.current >= 2;
        prevSeismicRef.current = 0;
        lastSeismicSoundTimeRef.current = 0;
        if (hadMajorSeismic) {
          hasEnvironmentalDamageRef.current = true;
          setHasDisasterImpact(true);
          if (!eruptionState.active && !isPostDisasterRef.current) {
            const stageText = 'PASCA-GEMPA: DAMPAK KERUSAKAN BANGUNAN & JALAN';
            eruptionStageTextRef.current = stageText;
            setEruptionStageText(stageText);
          }
        }
        // Hentikan getaran translasi horizontal bangunan, pertahankan posisi amblas dan retakan
        registeredBuildings.forEach((b) => {
          b.group.position.x = b.x;
          b.group.position.z = b.z;
        });
        if (buildingDustPoints) {
          buildingDustPoints.visible = false;
        }
      }

      // Logika respon fisik bangunan & objek sekitar pada simulasi gempa
      if (!eruptionState.active && !isPostDisasterRef.current) {
        if (effectiveSeismic === 1 && !hasEnvironmentalDamageRef.current) {
          // Gempa Ringan: No Damage (HP bangunan tetap 100%), tanpa retakan, tiang tegak
          registeredBuildings.forEach((b) => {
            b.hp = 100;
            if (b.crackMesh) b.crackMesh.visible = false;
            if (b.rubbleMesh) b.rubbleMesh.visible = false;
            b.group.scale.set(1, 1, 1);
            b.group.position.y = b.initialY;
          });
          registeredPoles.forEach((p) => {
            p.group.rotation.z = p.initialRotZ;
          });
          if (roadFissuresGroup) roadFissuresGroup.visible = false;
          if (buildingDustPoints) buildingDustPoints.visible = false;
        } else if (effectiveSeismic === 2) {
          hasEnvironmentalDamageRef.current = true;
          setHasDisasterImpact(true);
          // Gempa Sedang: HP berkurang bertahap ke 50-70% (target 60%), retakan terlihat, tiang miring
          registeredBuildings.forEach((b) => {
            b.hp = Math.max(60, b.hp - dt * 4.5);
            if (b.crackMesh) b.crackMesh.visible = true;
            if (b.rubbleMesh) b.rubbleMesh.visible = false;
            b.group.position.x = b.x + Math.sin(elapsed * 24 + b.x) * 0.04;
          });
          registeredPoles.forEach((p) => {
            p.group.rotation.z = p.initialRotZ + 0.18 + Math.sin(elapsed * 12 + p.x) * 0.035;
          });
          if (roadFissuresGroup) roadFissuresGroup.visible = false;
          if (buildingDustPoints) buildingDustPoints.visible = false;
        } else if (effectiveSeismic === 3) {
          hasEnvironmentalDamageRef.current = true;
          setHasDisasterImpact(true);
          // Gempa Besar: HP langsung turun drastis ke 0%, bangunan bergoyang hebat, partikel debu, puing runtuh, amblas, tiang tumbang, jalan retak
          registeredBuildings.forEach((b) => {
            b.hp = 0;
            // 1. Goyang hebat ke kiri dan kanan
            b.group.position.x = b.x + Math.sin(elapsed * 28 + b.x) * 0.18;
            b.group.position.z = b.z + Math.cos(elapsed * 26 + b.z) * 0.14;
            // 2. Retakan & puing-puing hancur muncul
            if (b.crackMesh) b.crackMesh.visible = true;
            if (b.rubbleMesh) b.rubbleMesh.visible = true;
            // 3. Runtuh amblas perlahan ke bawah tanah
            b.group.scale.y = Math.max(0.32, b.group.scale.y - dt * 0.35);
            b.group.position.y = Math.max(b.initialY - 0.45, b.group.position.y - dt * 0.22);
          });
          // Tiang listrik tumbang ke tanah
          registeredPoles.forEach((p) => {
            p.group.rotation.z = THREE.MathUtils.lerp(p.group.rotation.z, p.initialRotZ + 1.45, dt * 3.5);
          });
          // Retakan jalan aspal menganga lebar
          if (roadFissuresGroup) roadFissuresGroup.visible = true;
          // Spawning partikel debu tebal di dasar bangunan
          if (buildingDustPoints) {
            buildingDustPoints.visible = true;
            const posAttr = buildingDustPoints.geometry.attributes.position as THREE.BufferAttribute;
            const vels = (buildingDustPoints as any).userData.vels;
            for (let i = 0; i < posAttr.count; i++) {
              const v = vels[i];
              let px = posAttr.getX(i) + v.x;
              let py = posAttr.getY(i) + v.y;
              let pz = posAttr.getZ(i) + v.z;
              v.life += 1;
              if (v.life > v.maxLife || py < -10) {
                v.life = 0;
                const randB = registeredBuildings[Math.floor(Math.random() * registeredBuildings.length)];
                if (randB) {
                  px = randB.x + (Math.random() - 0.5) * randB.width * 0.85;
                  py = randB.initialY + 0.15 + Math.random() * 0.4;
                  pz = randB.z + (Math.random() - 0.5) * randB.depth * 0.85;
                }
              }
              posAttr.setXYZ(i, px, py, pz);
            }
            posAttr.needsUpdate = true;
          }
        }
      }

      // 2. TIMELINE LOGIKA ERUPSI GUNUNG MERAPI REALISTIS (EKSPLOSIF VS EFUSIF)
      const isAwas = currentVolcano === 'AWAS';
      const isSiaga = currentVolcano === 'SIAGA';
      const isWaspada = currentVolcano === 'WASPADA';
      // HANYA STATUS AWAS YANG MEMICU LETUSAN / MELETUS!
      // Status SIAGA adalah fase waspada tinggi & persiapan evakuasi (asap tebal & tremor, tapi belum meletus)
      const isErupting = isAwas;
      const isExplosive = isErupting && currentEruption !== 'EFUSIF';
      const isEffusive = isErupting && currentEruption === 'EFUSIF';

      if (!isErupting) {
        if (eruptionState.active) {
          const completedType = eruptionState.type;
          eruptionState.active = false;
          eruptionState.stageTime = 0;
          isPostDisasterRef.current = true;
          lastEruptionTypeRef.current = completedType;
          hasEnvironmentalDamageRef.current = true;
          setHasDisasterImpact(true);

          // 1. Sembunyikan semburan aktif kawah & dentuman
          if (plinianColumnGroupRef.current) plinianColumnGroupRef.current.visible = false;
          if (collapsingColumnGroupRef.current) collapsingColumnGroupRef.current.visible = false;
          if (lavaFountainGroupRef.current) lavaFountainGroupRef.current.visible = false;
          if (bombsGroupRef.current) bombsGroupRef.current.visible = false;
          if (volcanicLightningLight) volcanicLightningLight.intensity = 0;
          if (explosionLightRef.current) explosionLightRef.current.intensity = 0;
          if (ashFallPointsRef.current) {
            (ashFallPointsRef.current.material as THREE.PointsMaterial).opacity = 0;
            ashFallPointsRef.current.visible = false;
          }

          // Asap kawah mereda menjadi uap putih tipis pasca-bencana
          if (smokePointsRef.current) {
            const mat = smokePointsRef.current.material as THREE.PointsMaterial;
            mat.color.setHex(completedType === 'EFUSIF' ? 0xf8fafc : 0x94a3b8);
            mat.size = 3.6;
            mat.opacity = 0.55;
          }

          // 2. PERTAHANKAN DAMPAK LINGKUNGAN PADA PETA SESUAI TIPE LETUSAN
          if (completedType === 'EKSPLOSIF') {
            // Awan panas (wedhus gembel) TETAP MENYELIMUTI lereng & lembah alur sungai!
            if (pyroclasticGroupRef.current) {
              pyroclasticGroupRef.current.visible = true;
            }
            if (pyroclasticLightsGroupRef.current) {
              pyroclasticLightsGroupRef.current.children.forEach((l) => {
                (l as THREE.PointLight).intensity = 0.75;
              });
            }
            if (scene.fog) {
              scene.fog.color.setHex(0x1a1e28);
              (scene.fog as THREE.FogExp2).density = 0.0035;
            }
            const stageText = 'PASCA-ERUPSI EKSPLOSIF: DAMPAK AWAN PANAS & ABU VULKANIK';
            eruptionStageTextRef.current = stageText;
            setEruptionStageText(stageText);
          } else if (completedType === 'EFUSIF') {
            // Lelehan lava pijar TETAP MEMBEKU/MEMBARA di lereng kawah & lembah!
            if (lavaStreamsGroupRef.current) {
              lavaStreamsGroupRef.current.visible = true;
            }
            const stageText = 'PASCA-ERUPSI EFUSIF: ENDAPAN LAVA PIJAR & LAHAR';
            eruptionStageTextRef.current = stageText;
            setEruptionStageText(stageText);
          }
        }

        // Loop pasca-bencana: pertahankan gumpalan awan panas, lava, dan kekeruhan sungai
        if (isPostDisasterRef.current) {
          if (lastEruptionTypeRef.current === 'EKSPLOSIF') {
            if (pyroclasticGroupRef.current) {
              pyroclasticGroupRef.current.visible = true;
              pyroclasticPuffs.forEach((puff) => {
                if (puff.mesh.visible) {
                  puff.mesh.rotation.y += puff.rotSpeed.y * dt * 0.12;
                }
              });
            }
            updateRiverTurbidity(dt, [], []);
          } else if (lastEruptionTypeRef.current === 'EFUSIF') {
            if (lavaStreamsGroupRef.current) {
              lavaStreamsGroupRef.current.visible = true;
            }
            const glow = 1.2 + Math.sin(elapsed * 2.5) * 0.35;
            lavaTubes.forEach(({ light }) => {
              light.intensity = glow * 0.45;
            });
            updateRiverTurbidity(dt, [], []);
          }
        } else if (isSiaga && smokePointsRef.current) {
          // Status SIAGA: Asap kawah pekat mengepul aktif sebagai tanda peningkatan aktivitas vulkanik (belum meletus)
          const mat = smokePointsRef.current.material as THREE.PointsMaterial;
          mat.color.setHex(0x64748b);
          mat.size = 5.5;
          mat.opacity = 0.85;
        }
      } else {
        if (!eruptionState.active) {
          eruptionState.active = true;
          eruptionState.startTime = elapsed;
          eruptionState.type = isExplosive ? 'EKSPLOSIF' : 'EFUSIF';
          eruptionState.soundBoomPlayed = false;
          eruptionState.preRumblePlayed = false;
          hasEnvironmentalDamageRef.current = true;
          setHasDisasterImpact(true);
          resetDisasterState();
        }
        eruptionState.stageTime = elapsed - eruptionState.startTime;
      }

      if (eruptionState.active) {
        const eTime = eruptionState.stageTime;
        const peakY = sampleTerrain(PEAK_X, PEAK_Z) + 1.2;

        if (isExplosive) {
          // ── TAHAP 1: PRE-ERUPSI (0.0s - 2.0s) ──
          if (eTime < 2.0) {
            const stageName = 'PRE-ERUPSI (TREMOR VULKANIK)';
            if (eruptionStageTextRef.current !== stageName) {
              eruptionStageTextRef.current = stageName;
              setEruptionStageText(stageName);
            }

            // Suara getaran & tremor kamera meningkat tepat sebelum ledakan
            if (!eruptionState.preRumblePlayed) {
              retroAudio.playEarthquakeRumble();
              eruptionState.preRumblePlayed = true;
            }
            if (cameraRef.current) {
              const preShake = (0.8 + eTime * 1.5) * 0.45;
              cameraRef.current.position.add(new THREE.Vector3(
                Math.sin(elapsed * 48) * preShake,
                Math.cos(elapsed * 55) * preShake,
                Math.sin(elapsed * 38) * (preShake * 0.6)
              ));
            }

            // Asap kawah pekat mengepul dari puncak (senada dengan warna awan panas)
            if (smokePointsRef.current) {
              const mat = smokePointsRef.current.material as THREE.PointsMaterial;
              mat.color.setHex(0xf1f5f9);
              mat.size = 7.0;
              mat.opacity = 0.95;
            }
            if (plinianColumnGroupRef.current) plinianColumnGroupRef.current.visible = false;
            if (collapsingColumnGroupRef.current) collapsingColumnGroupRef.current.visible = false;
            if (lavaStreamsGroupRef.current) lavaStreamsGroupRef.current.visible = false;
            if (bombsGroupRef.current) bombsGroupRef.current.visible = false;
            if (pyroclasticGroupRef.current) pyroclasticGroupRef.current.visible = false;
          }

          // ── TAHAP 2: LEDAKAN UTAMA & KOLOM ABU PLINIAN MEMBUMBUNG (2.0s - 4.8s) ──
          if (eTime >= 2.0) {
            if (eTime < 4.8) {
              const stageName = 'LEDAKAN UTAMA & KOLOM ABU PLINIAN';
              if (eruptionStageTextRef.current !== stageName) {
                eruptionStageTextRef.current = stageName;
                setEruptionStageText(stageName);
              }
            }

            // Dentuman dan kilatan cahaya kawah
            if (!eruptionState.soundBoomPlayed) {
              retroAudio.playVolcanoBoom();
              eruptionState.soundBoomPlayed = true;
              if (explosionLightRef.current) explosionLightRef.current.intensity = 22.0;
            }
            if (explosionLightRef.current) {
              explosionLightRef.current.intensity = Math.max(0, explosionLightRef.current.intensity - dt * 7.5);
            }

            // Semburan Kolom Abu Vertikal Plinian & Jamur Raksasa
            if (plinianColumnGroupRef.current) {
              plinianColumnGroupRef.current.visible = true;
              const colProg = Math.min(1.0, (eTime - 2.0) / 2.2);
              const maxH = 58 * colProg;

              ashColumnPuffs.forEach((puff) => {
                puff.angle += dt * puff.speed;
                const py = peakY + puff.relY * maxH;
                const px = PEAK_X + Math.cos(puff.angle) * (puff.radius * (1 + puff.relY * 1.8));
                const pz = PEAK_Z + Math.sin(puff.angle) * (puff.radius * (1 + puff.relY * 1.8));
                puff.mesh.position.set(px, py, pz);
                puff.mesh.rotation.x += dt * 0.6;
                puff.mesh.rotation.y += dt * 0.8;
              });

              // Payung Awan Jamur (Mushroom Head) di Puncak Kolom
              const headProg = Math.max(0, Math.min(1.0, (eTime - 2.8) / 2.0));
              const headRadius = 34 * headProg;
              const headBaseY = peakY + maxH;

              ashUmbrellaPuffs.forEach((upuff) => {
                upuff.angle += dt * upuff.rotSpeed;
                const r = upuff.dist * headRadius;
                const px = PEAK_X + Math.cos(upuff.angle) * r;
                const pz = PEAK_Z + Math.sin(upuff.angle) * (r * 0.95);
                const py = headBaseY + Math.sin(upuff.dist * Math.PI) * 6.5 + (Math.sin(elapsed * 2 + upuff.angle) * 1.2);
                upuff.mesh.position.set(px, py, pz);
                upuff.mesh.scale.setScalar(1.5 + upuff.dist * 2.2 * headProg);
              });

              // Petir Vulkanik di Kepala Jamur
              if (volcanicLightningLight) {
                volcanicLightningLight.intensity = Math.random() > 0.88 ? 9.5 : 0;
                volcanicLightningLight.position.set(PEAK_X, headBaseY + 2, PEAK_Z);
              }
            }

            // Lava Fountain (Semburan Pijar Magma Vertikal di Kawah)
            if (lavaFountainGroupRef.current) {
              lavaFountainGroupRef.current.visible = true;
              lavaFountainDrops.forEach((drop) => {
                if (!drop.active) {
                  drop.delay -= dt;
                  if (drop.delay <= 0) {
                    drop.active = true;
                    drop.mesh.position.set(
                      PEAK_X + (Math.random() - 0.5) * 3.5,
                      drop.originY,
                      PEAK_Z + (Math.random() - 0.5) * 3.5
                    );
                    drop.vel.set(
                      (Math.random() - 0.5) * 9.0,
                      16 + Math.random() * 14,
                      (Math.random() - 0.5) * 9.0
                    );
                  }
                } else {
                  drop.mesh.position.addScaledVector(drop.vel, dt);
                  drop.vel.y -= 34 * dt;
                  if (drop.mesh.position.y <= drop.originY - 0.5) {
                    drop.active = false;
                    drop.delay = Math.random() * 0.6;
                  }
                }
              });
            }

            // Bom Vulkanik & Lapilli (Lintasan Parabola Gravitasi)
            if (bombsGroupRef.current) {
              bombsGroupRef.current.visible = true;
              volcanicBombsList.forEach((b) => {
                if (!b.active) {
                  b.delay -= dt;
                  if (b.delay <= 0) {
                    b.active = true;
                    b.mesh.position.copy(b.origin);
                    if (b.isLarge) {
                      b.vel.set(
                        (Math.random() - 0.5) * 22,
                        24 + Math.random() * 16,
                        (Math.random() - 0.5) * 22
                      );
                    } else {
                      b.vel.set(
                        (Math.random() - 0.5) * 42,
                        28 + Math.random() * 20,
                        (Math.random() - 0.5) * 42
                      );
                    }
                  }
                } else {
                  b.mesh.position.addScaledVector(b.vel, dt);
                  b.vel.y -= b.gravity * dt;
                  b.mesh.rotation.x += 4 * dt;
                  b.mesh.rotation.y += 5 * dt;

                  const groundAtBomb = sampleTerrain(b.mesh.position.x, b.mesh.position.z);
                  if (b.mesh.position.y <= groundAtBomb + 0.25) {
                    registeredBuildings.forEach((bldg) => {
                      const dImpact = Math.hypot(bldg.x - b.mesh.position.x, bldg.z - b.mesh.position.z);
                      if (b.isLarge && dImpact < 4.2) {
                        damageBuilding(bldg, 100, 'bomb');
                      } else if (!b.isLarge && dImpact < 3.5) {
                        damageBuilding(bldg, 20, 'lapilli');
                      }
                    });

                    b.active = false;
                    b.delay = 0.8 + Math.random() * 3.5;
                  }
                }
              });
            }
          }

          // ── TAHAP 3: RUNTUHAN KOLOM ABU (COLUMN COLLAPSE) (4.8s - 6.2s) ──
          if (eTime >= 4.8) {
            if (eTime < 6.2) {
              const stageName = 'RUNTUHAN KOLOM ABU (COLUMN COLLAPSE)';
              if (eruptionStageTextRef.current !== stageName) {
                eruptionStageTextRef.current = stageName;
                setEruptionStageText(stageName);
              }
            }

            if (collapsingColumnGroupRef.current) {
              collapsingColumnGroupRef.current.visible = true;
              const collapseProg = Math.min(1.0, (eTime - 4.8) / 1.4);

              collapsingAshTorrents.forEach((c) => {
                const p = Math.min(1.0, Math.max(0, collapseProg * 1.35 - c.delay * 0.35));
                const curRadius = c.startRadius * (1 - p * 0.72);
                const px = PEAK_X + Math.cos(c.angle) * curRadius;
                const pz = PEAK_Z + Math.sin(c.angle) * curRadius;
                const py = peakY + c.startRelY * (1 - p * p) + 2.5;

                c.mesh.position.set(px, py, pz);
                c.mesh.rotation.x += dt * 2.2;
                c.mesh.rotation.y += dt * 2.6;
                c.mesh.scale.setScalar(1.5 + p * 2.2);
                c.mesh.visible = p > 0.02 && p < 0.99;
              });

              // Tremor saat kolom runtuh menabrak lereng kawah
              if (cameraRef.current && collapseProg < 0.9) {
                const colShake = Math.sin(elapsed * 50) * 0.35;
                cameraRef.current.position.y += colShake * 0.15;
              }
            }
          }

          // ── TAHAP 4: AWAN PANAS WEDHUS GEMBEL MENYAPU LERENG (6.2s - 10.5s) ──
          if (eTime >= 6.2) {
            if (eTime < 10.5) {
              const stageName = 'AWAN PANAS (WEDHUS GEMBEL) MENYAPU LERENG';
              if (eruptionStageTextRef.current !== stageName) {
                eruptionStageTextRef.current = stageName;
                setEruptionStageText(stageName);
              }
            }

            if (pyroclasticGroupRef.current) {
              pyroclasticGroupRef.current.visible = true;
              const valleyStreams = [LAVA_STREAM_GENDOL, LAVA_STREAM_KUNING, LAVA_STREAM_BOYONG];

              // Kecepatan tinggi meluncur menuruni lereng (3.8 detik mencapai jangkauan terjauh)
              const surgeProg = Math.min(1.0, (eTime - 6.2) / 3.8);
              const maxPyroRadius = Math.min(96, surgeProg * 96);
              currentPyroRadius = maxPyroRadius;

              pyroclasticPuffs.forEach((puff) => {
                const stream = valleyStreams[puff.valleyIdx];

                // Posisi kemajuan puff di sepanjang alur lembah sungai
                // Kepala surge bergerak maju di surgeProg. Puff terbentang proporsional dari kawah ke kepala surge.
                const targetProg = puff.streamPosNorm * Math.min(1.0, surgeProg * 1.05);

                // Turbulensi dinamis bergulung menuruni alur (rolling flow)
                const rollCycle = (elapsed * 0.20 + puff.puffSeed * 1.7) % 1.0;
                const flowOffset = (rollCycle - 0.5) * 0.05;
                const pProg = Math.max(0.0, Math.min(1.0, targetProg + flowOffset));
                puff.streamProgress = pProg;

                const sLen = stream.length;
                const floatIdx = pProg * (sLen - 1);
                const sIdx = Math.min(sLen - 2, Math.floor(floatIdx));
                const sFrac = floatIdx - sIdx;
                const pA = stream[sIdx];
                const pB = stream[sIdx + 1];

                const basePos = new THREE.Vector3().lerpVectors(pA, pB, sFrac);
                const px = basePos.x + puff.sideOffset;
                const pz = basePos.z;
                const groundY = sampleTerrain(px, pz);
                const py = groundY + puff.heightOffset;
                puff.mesh.position.set(px, py, pz);

                // Rotasi turbulensi vorteks wedhus gembel
                puff.mesh.rotation.x += puff.rotSpeed.x * dt;
                puff.mesh.rotation.y += puff.rotSpeed.y * dt;
                puff.mesh.rotation.z += puff.rotSpeed.z * dt;

                // Jarak horizontal dari kawah puncak Merapi
                const distFromCrater = Math.hypot(px - PEAK_X, pz - PEAK_Z);

                // ── MAKIN JAUH MAKIN NGILANG (DISPERSI & FADE-OUT BERTINGKAT) ──
                // 1. Fading berdasarkan kemajuan lereng (pProg)
                let progressFade = 1.0;
                if (pProg <= 0.22) {
                  progressFade = 1.0; // Lereng atas/kawah: pekat maksimal
                } else if (pProg <= 0.52) {
                  progressFade = 1.0 - ((pProg - 0.22) / 0.30) * 0.28; // Mulai menipis lembut (1.0 -> 0.72)
                } else if (pProg <= 0.76) {
                  progressFade = 0.72 - ((pProg - 0.52) / 0.24) * 0.57; // Menipis tajam (0.72 -> 0.15)
                } else {
                  progressFade = Math.max(0.0, 0.15 - ((pProg - 0.76) / 0.12) * 0.15); // Lenyap total ke 0
                }

                // 2. Fading berdasarkan jarak mutlak dari kawah (distFromCrater)
                // Di radius > 40 mulai memudar, di radius >= 74 (sebelum masuk perumahan desa) hilang total!
                let distanceFade = 1.0;
                if (distFromCrater > 40.0) {
                  distanceFade = Math.max(0.0, 1.0 - (distFromCrater - 40.0) / 34.0);
                }

                // 3. Fading seiring waktu pasca-surge (tahap lava pijar & hujan abu, eTime >= 9.8s)
                let stageFade = 1.0;
                if (eTime >= 9.8) {
                  const tPast = eTime - 9.8;
                  stageFade = Math.max(0.12, 1.0 - tPast * 0.08);
                }

                // Opacity gabungan per-puff
                const finalOpacity = Math.max(0.0, Math.min(0.96, progressFade * distanceFade * stageFade));
                puff.material.opacity = finalOpacity;

                // Pendaran bara termal mendingin seiring menjauh dari kawah
                if (puff.tier === 'base') {
                  const heatFade = Math.max(0.0, 1.0 - pProg * 1.8);
                  puff.material.emissiveIntensity = puff.initialEmissiveIntensity * heatFade * stageFade;
                }

                // Skala bervolume dinamis
                const billowScale = puff.scaleBase * (1.0 + pProg * 0.30 + Math.sin(elapsed * 2.4 + puff.puffSeed) * 0.08);
                puff.mesh.scale.setScalar(billowScale);

                // Mesh hanya dirender jika terlihat dan berada dalam jangkauan aktif
                puff.mesh.visible = finalOpacity > 0.02 && (surgeProg > 0.05) && (distFromCrater <= maxPyroRadius + 10);
              });

              // Lampu termal frontal di garis depan masing-masing lembah
              if (valleySurgeLights.length >= 3) {
                for (let v = 0; v < 3; v++) {
                  const stream = valleyStreams[v];
                  const pProg = Math.min(0.68, surgeProg * 0.82);
                  const sIdx = Math.min(stream.length - 2, Math.floor(pProg * (stream.length - 1)));
                  const sFrac = (pProg * (stream.length - 1)) - sIdx;
                  const pFront = new THREE.Vector3().lerpVectors(stream[sIdx], stream[sIdx + 1], sFrac);
                  const gY = sampleTerrain(pFront.x, pFront.z);
                  valleySurgeLights[v].position.set(pFront.x, gY + 2.5, pFront.z);
                  const lightFade = Math.max(0, 1.0 - pProg / 0.68);
                  valleySurgeLights[v].intensity = surgeProg > 0.05 && surgeProg < 0.98 ? 4.5 * lightFade : 0;
                }
              }

              // Dampak Awan Panas terhadap Bangunan & Pohon yang Dilewati
              registeredBuildings.forEach((bldg) => {
                const distPeak = Math.hypot(bldg.x - PEAK_X, bldg.z - PEAK_Z);
                if (distPeak <= maxPyroRadius && bldg.z > PEAK_Z - 5) {
                  charBuildingWithPyroclastic(bldg);
                }
              });

              registeredTrees.forEach((tr) => {
                const distPeak = Math.hypot(tr.x - PEAK_X, tr.z - PEAK_Z);
                if (distPeak <= maxPyroRadius) {
                  charTree(tr);
                }
              });
            }
          }

          // ── TAHAP 5: ALIRAN LAVA MERAYAP & HUJAN ABU (9.5s <= eTime) ──
          if (eTime >= 9.5) {
            if (eTime < 14.0) {
              const stageName = 'ALIRAN LAVA PIJAR & HUJAN ABU';
              if (eruptionStageTextRef.current !== stageName) {
                eruptionStageTextRef.current = stageName;
                setEruptionStageText(stageName);
              }
            }

            // Aliran lava merayap turun perlahan (dari 0.0 ke 1.0)
            const lavaProg = Math.min(1.0, (eTime - 9.5) / 10.0);
            updateLavaCreep(lavaProg, elapsed);

            // Sistem Hujan Abu Melayang di Seluruh Map
            if (ashFallPointsRef.current) {
              const ashPts = ashFallPointsRef.current;
              ashPts.visible = true;
              (ashPts.material as THREE.PointsMaterial).opacity = Math.min(0.85, (eTime - 9.5) * 0.28);

              const posAttr = ashPts.geometry.attributes.position as THREE.BufferAttribute;
              const vels = (ashPts as any).userData.ashVels;

              for (let k = 0; k < posAttr.count; k++) {
                const v = vels[k];
                let px = posAttr.getX(k) + v.x + Math.sin(elapsed * 2 + k) * 0.08;
                let py = posAttr.getY(k) + v.y * dt * 8.0;
                let pz = posAttr.getZ(k) + v.z;

                const gy = sampleTerrain(px, pz);
                if (py <= gy + 0.1) {
                  py = 35 + Math.random() * 15;
                  px = (Math.random() - 0.5) * 130;
                  pz = -40 + Math.random() * 140;
                }
                posAttr.setXYZ(k, px, py, pz);
              }
              posAttr.needsUpdate = true;
            }

            // Visibilitas Berkabut Vulkanik Gelap
            if (scene.fog) {
              scene.fog.color.lerp(new THREE.Color(0x161822), 0.035);
              (scene.fog as THREE.FogExp2).density = THREE.MathUtils.lerp((scene.fog as THREE.FogExp2).density, 0.0038, 0.03);
            }
          }

          // ── TAHAP 6: LAHAR DINGIN & EVAKUASI TOTAL (14.0s <= eTime) ──
          if (eTime >= 14.0) {
            const stageName = 'LAHAR DINGIN & EVAKUASI TOTAL';
            if (eruptionStageTextRef.current !== stageName) {
              eruptionStageTextRef.current = stageName;
              setEruptionStageText(stageName);
            }

            // Air sungai Kali Gendol, Kali Kuning, Kali Boyong berubah jadi lumpur pekat lahar dingin
            registeredRivers.forEach((track) => {
              if (track.firstContactSlice === -1) {
                track.firstContactSlice = 0;
                track.propagationHead = 0;
              }
            });
            updateRiverTurbidity(dt, [], []);
          }
        } else if (isEffusive) {
          // ── ERUPSI EFUSIF: LELEHAN LAVA PIJAR & KERUSAKAN TERMAL ──
          // Sembunyikan seluruh komponen ledakan eksplosif & hujan abu
          if (plinianColumnGroupRef.current) plinianColumnGroupRef.current.visible = false;
          if (collapsingColumnGroupRef.current) collapsingColumnGroupRef.current.visible = false;
          if (lavaFountainGroupRef.current) lavaFountainGroupRef.current.visible = false;
          if (bombsGroupRef.current) bombsGroupRef.current.visible = false;
          if (pyroclasticGroupRef.current) pyroclasticGroupRef.current.visible = false;
          if (pyroclasticLightsGroupRef.current) {
            pyroclasticLightsGroupRef.current.children.forEach((l) => { (l as THREE.PointLight).intensity = 0; });
          }
          if (ashFallPointsRef.current) ashFallPointsRef.current.visible = false;

          // Asap putih tipis (uap air & gas sulfur konstan, bukan asap hitam pekat)
          if (smokePointsRef.current) {
            const mat = smokePointsRef.current.material as THREE.PointsMaterial;
            mat.color.setHex(0xf8fafc);
            mat.size = 3.2;
            mat.opacity = 0.58;
          }

          // ── TAHAP 1: PRE-ERUPSI & AKTIVITAS KAWAH (0.0s - 3.5s) ──
          if (eTime < 3.5) {
            const stageName = 'PRE-ERUPSI: AKTIVITAS KAWAH & GAS SULFUR';
            if (eruptionStageTextRef.current !== stageName) {
              eruptionStageTextRef.current = stageName;
              setEruptionStageText(stageName);
            }
            updateLavaCreep(0, elapsed, true);
          }
          // ── TAHAP 2: PELEPASAN LELEHAN LAVA PIJAR LEMBAH (3.5s - 12.0s) ──
          else if (eTime < 12.0) {
            const stageName = 'LELEHAN LAVA LEMBAH & KERUSAKAN TERMAL';
            if (eruptionStageTextRef.current !== stageName) {
              eruptionStageTextRef.current = stageName;
              setEruptionStageText(stageName);
            }
            // Kecepatan lambat: 3.5s s.d. 20s (~16.5 detik aliran merayap pelan menuruni lereng)
            const effProgress = Math.min(1.0, (eTime - 3.5) / 16.5);
            updateLavaCreep(effProgress, elapsed, true);
            handleEffusiveThermalInteractions(dt, elapsed);
          }
          // ── TAHAP 3: ALIRAN MERAYAP & PENDINGINAN KERAK BASAL (12.0s - 20.0s) ──
          else if (eTime < 20.0) {
            const stageName = 'ALIRAN MERAYAP & PENDINGINAN KERAK BASAL';
            if (eruptionStageTextRef.current !== stageName) {
              eruptionStageTextRef.current = stageName;
              setEruptionStageText(stageName);
            }
            const effProgress = Math.min(1.0, (eTime - 3.5) / 16.5);
            updateLavaCreep(effProgress, elapsed, true);
            handleEffusiveThermalInteractions(dt, elapsed);
          }
          // ── TAHAP 4: TIMBUNAN BATUAN BASAL BEKU & PASCA-ERUPSI (>= 20.0s) ──
          else {
            const stageName = 'PASCA-ERUPSI: TIMBUNAN BATUAN BASAL MEMBEKU';
            if (eruptionStageTextRef.current !== stageName) {
              eruptionStageTextRef.current = stageName;
              setEruptionStageText(stageName);
            }
            updateLavaCreep(1.0, elapsed, true);
            handleEffusiveThermalInteractions(dt, elapsed);
          }
        }
      }

      // 3. UPDATE MOBIL EVAKUASI & 75 NPC (AI EVAKUASI BERTAHAP REALISTIS)
      if (evacVehicle) {
        if (isAwas || isExplosive || isEffusive) {
          evacVehicle.isActive = true;
          evacVehicle.beaconLight.intensity = Math.sin(elapsed * 25) > 0 ? 6.0 : 0.5;

          // Mobil melaju ke arah Selatan menjemput & mengangkut warga
          if (evacVehicle.currentZ < 104.5) {
            evacVehicle.currentZ += dt * evacVehicle.speed;
            const vy = sampleTerrain(evacVehicle.currentX, evacVehicle.currentZ) + 0.15;
            evacVehicle.group.position.set(evacVehicle.currentX, vy, evacVehicle.currentZ);
            evacVehicle.group.visible = true;
          } else {
            // Sampai di ujung batas peta (Z >= 104.5): menghilang seolah telah sampai di area aman luar peta
            evacVehicle.group.visible = false;
            evacVehicle.beaconLight.intensity = 0;
          }
        } else {
          evacVehicle.isActive = false;
          evacVehicle.beaconLight.intensity = 0;
          evacVehicle.currentZ = evacVehicle.initialZ;
          const vy = sampleTerrain(evacVehicle.initialX, evacVehicle.initialZ) + 0.15;
          evacVehicle.group.position.set(evacVehicle.initialX, vy, evacVehicle.initialZ);
          evacVehicle.group.visible = true;
        }
      }

      function resolveBuildingCollision(px: number, pz: number, radius = 0.45): { x: number; z: number } {
        let cx = px;
        let cz = pz;
        for (let bIdx = 0; bIdx < registeredBuildings.length; bIdx++) {
          const b = registeredBuildings[bIdx];
          const hw = b.width * 0.5 + radius;
          const hd = b.depth * 0.5 + radius;
          const dx = cx - b.x;
          const dz = cz - b.z;
          if (Math.abs(dx) < hw && Math.abs(dz) < hd) {
            const ox = hw - Math.abs(dx);
            const oz = hd - Math.abs(dz);
            if (ox < oz) {
              cx = b.x + (dx >= 0 ? hw : -hw);
            } else {
              cz = b.z + (dz >= 0 ? hd : -hd);
            }
          }
        }
        return { x: cx, z: cz };
      }

      const OPEN_FIELDS = [
        { id: 'lapangan_barat', x: -28.0, z: 22.0 },
        { id: 'lapangan_tengah', x: 15.0, z: 52.0 },
        { id: 'lapangan_selatan', x: -22.0, z: 76.0 },
        { id: 'lapangan_tenggara', x: 34.0, z: 74.0 },
      ];

      const currentRoute = selectedRouteRef.current;
      const currentEvacCmd = activeEvacCommandRef.current;
      const isRouteLingkar = currentRoute.includes('Lingkar') || currentRoute.includes('LINGKAR');
      const isRouteSungai = currentRoute.includes('Sungai') || currentRoute.includes('SUNGAI');
      const isRouteLapangan = currentRoute.includes('Lapangan') || currentRoute.includes('LAPANGAN');
      const isBuzzer = isBuzzerOnRef.current;
      const isDisaster = effectiveSeismic > 0 || isAwas || isSiaga || isWaspada || isExplosive || isEffusive || isBuzzer;

      let baseSpeedMultiplier = 1.0;
      let npcStepRate = 8;

      if (isDisaster && currentEvacCmd === 'NONE') {
        // BENCANA AKTIF TETAPI BELUM ADA BLOK EVAKUASI DARI USER:
        // Warga PANIK KEBINGUNGAN! Mereka hanya lari-lari panik tanpa tujuan evakuasi
        baseSpeedMultiplier = effectiveSeismic === 3 ? 0.6 : 1.85;
        npcStepRate = 14;
      } else if (currentEvacCmd !== 'NONE') {
        // BLOK EVAKUASI AKTIF DARI USER:
        // Warga bergerak teratur dan sigap sesuai perintah blok
        baseSpeedMultiplier = currentEvacCmd === 'LUAR_MAP' ? 2.6 : 2.1;
        npcStepRate = 15;
      } else if (isRouteLingkar || isRouteLapangan || isRouteSungai) {
        baseSpeedMultiplier = 1.9;
        npcStepRate = 13;
      }

      for (let i = 0; i < npcs.length; i++) {
        const npc = npcs[i];
        if (npc.evacuated) {
          npc.mesh.visible = false;
          continue;
        }

        const npcSpeedMultiplier = baseSpeedMultiplier * npc.personalSpeedMod;
        const nA = NODE_MAP.get(npc.fromNode)!;
        const nB = NODE_MAP.get(npc.toNode)!;

        // Vektor arah segmen jalan
        const dirX = nB.x - nA.x;
        const dirZ = nB.z - nA.z;
        const segLen = Math.hypot(dirX, dirZ) || 1;

        // Normal tegak lurus sumbu jalan untuk variasi samping (lateral offset)
        const normX = -dirZ / segLen;
        const normZ = dirX / segLen;

        // Posisi dasar di garis jalan
        const midX = THREE.MathUtils.lerp(nA.x, nB.x, npc.progress);
        const midZ = THREE.MathUtils.lerp(nA.z, nB.z, npc.progress);

        // Lateral offset dinamis: jitter halus agar tidak berbaris kaku seperti semut
        const laneJitter = Math.sin(elapsed * 1.8 + npc.id * 1.3) * 0.12;
        const totalLat = npc.lateralOffset + npc.dodgeOffset + laneJitter;
        let posX = midX + normX * totalLat;
        let posZ = midZ + normZ * totalLat;
        let posY = sampleTerrain(posX, posZ) + 0.18;

        // ── PENANGANAN NPC DI DALAM GEDUNG & EVAKUASI KELUAR GEDUNG ──
        if (npc.isIndoor && npc.indoorBuilding) {
          const bldg = npc.indoorBuilding;
          const doorX = bldg.x;
          const doorZ = bldg.z + bldg.depth * 0.5 + 1.2;

          if (!isDisaster && currentEvacCmd === 'NONE') {
            // Normal: santai di dalam gedung
            const bOffX = (((npc.id * 7) % 9) / 8 - 0.5) * (bldg.width * 0.45);
            const bOffZ = (((npc.id * 11) % 9) / 8 - 0.5) * (bldg.depth * 0.45);
            posX = bldg.x + bOffX;
            posZ = bldg.z + bOffZ;
            posY = sampleTerrain(posX, posZ) + 0.18;
          } else if (isDisaster && currentEvacCmd === 'NONE') {
            // Bencana tanpa blok evakuasi: panik di dalam ruangan!
            npc.status = 'PANIC';
            const panX = Math.sin(elapsed * 6 + npc.id * 1.5) * 0.4;
            const panZ = Math.cos(elapsed * 6 + npc.id * 1.5) * 0.4;
            posX = bldg.x + panX;
            posZ = bldg.z + panZ;
            posY = sampleTerrain(posX, posZ) + 0.18;
          } else if (currentEvacCmd === 'KELUAR_BANGUNAN' || currentEvacCmd === 'TANAH_LAPANG' || currentEvacCmd === 'KRB1' || currentEvacCmd === 'KRB2' || currentEvacCmd === 'LUAR_MAP') {
            // Evakuasi keluar bangunan aktif! NPC keluar melalui pintu tanpa menembus dinding
            npc.exitProgress = Math.min(1.0, npc.exitProgress + dt * 1.8);
            posX = THREE.MathUtils.lerp(bldg.x, doorX, npc.exitProgress);
            posZ = THREE.MathUtils.lerp(bldg.z, doorZ, npc.exitProgress);
            posY = sampleTerrain(posX, posZ) + 0.18;

            if (npc.exitProgress >= 1.0) {
              npc.isIndoor = false;
              npc.isOutsideBuilding = true;
              if (currentEvacCmd === 'KELUAR_BANGUNAN') {
                // Di luar bangunan: menyebar di halaman terbuka depan gedung
                posX = doorX + npc.fieldOffset.x * 0.35;
                posZ = doorZ + 1.4 + Math.abs(npc.fieldOffset.z) * 0.25;
                posY = sampleTerrain(posX, posZ) + 0.18;
                npc.status = 'ALERT';
              }
            }
          }
        }

        // ── EVAKUASI KE TANAH LAPANG TERDEKAT (JAUH DARI BANGUNAN) ──
        if ((currentEvacCmd === 'TANAH_LAPANG' || isRouteLapangan) && isDisaster) {
          let bestField = OPEN_FIELDS[0];
          let bestDist = 9999;
          for (let f = 0; f < OPEN_FIELDS.length; f++) {
            const d = Math.hypot(posX - OPEN_FIELDS[f].x, posZ - OPEN_FIELDS[f].z);
            if (d < bestDist) {
              bestDist = d;
              bestField = OPEN_FIELDS[f];
            }
          }
          const targetFieldX = bestField.x + npc.fieldOffset.x;
          const targetFieldZ = bestField.z + npc.fieldOffset.z;
          const distToMyField = Math.hypot(posX - targetFieldX, posZ - targetFieldZ);

          if (distToMyField < 7.5) {
            // Sudah sampai di tanah lapang terbuka: tiarap / merunduk pelindung kepala
            npc.isProne = true;
            npc.mesh.rotation.x = 0.9;
            npc.bodyMesh.scale.y = 0.50;
            npc.headMesh.position.y = 0.32;
            posX = THREE.MathUtils.lerp(posX, targetFieldX, 0.05);
            posZ = THREE.MathUtils.lerp(posZ, targetFieldZ, 0.05);
            posY = sampleTerrain(posX, posZ) + 0.05;
            npc.mesh.position.set(posX, posY, posZ);
            continue;
          }
        }

        // ── EVAKUASI MENJAUH DARI KRB I KELUAR PETA (HILANG DARI PETA) ──
        if ((currentEvacCmd === 'LUAR_MAP' || isAwas || isExplosive) && posZ >= 103.5) {
          // NPC mencapai batas selatan peta: menghilang (de-spawn) seolah keluar dari jangkauan map
          npc.evacuated = true;
          npc.mesh.visible = false;
          continue;
        }

        // ── COLLISION AVOIDANCE BANGUNAN (TIDAK MENEMBUS DINDING GEDUNG) ──
        if (!npc.isIndoor) {
          const col = resolveBuildingCollision(posX, posZ, 0.45);
          posX = col.x;
          posZ = col.z;
          posY = sampleTerrain(posX, posZ) + 0.18;
        }

        const distToPeak = Math.hypot(posX - PEAK_X, posZ - PEAK_Z);

        // ── DETEKSI AWAN PANAS (WEDHUS GEMBEL) ──
        if (currentPyroRadius > 0 && distToPeak <= currentPyroRadius) {
          const hasConcreteProtection = (npc.isIndoor && (npc.indoorBuilding?.isConcrete ?? false)) ||
            registeredBuildings.some((b) => b.isConcrete && Math.hypot(posX - b.x, posZ - b.z) < 5.2);

          if (hasConcreteProtection) {
            npc.shelteredInConcrete = true;
            npc.mesh.position.set(posX, posY, posZ);
            continue;
          } else {
            npc.isKnockedOut = true;
            npc.mesh.rotation.x = Math.PI / 2;
            npc.mesh.position.set(posX, posY + 0.06, posZ);
            continue;
          }
        }

        // ── DETEKSI & MENGHINDAR BOM VULKANIK DINAMIS ──
        if (isExplosive) {
          if (npc.dodgeTimer > 0) {
            npc.dodgeTimer -= dt;
            if (npc.dodgeTimer <= 0) {
              npc.dodgeOffset = 0;
            }
          } else {
            for (let bi = 0; bi < volcanicBombsList.length; bi++) {
              const bomb = volcanicBombsList[bi];
              if (!bomb.active) continue;
              const dbx = posX - bomb.mesh.position.x;
              const dbz = posZ - bomb.mesh.position.z;
              const dBomb = Math.hypot(dbx, dbz);
              if (dBomb < 8.5 && bomb.mesh.position.y < 22 && bomb.vel.y < 0) {
                npc.dodgeTimer = 1.4;
                const dodgeDir = dbx >= 0 ? 1 : -1;
                npc.dodgeOffset = dodgeDir * 1.6;
                break;
              }
            }
          }
        }

        // ── SURVIVAL GEMPA BESAR (TIARAP / RUNTUHAN) ──
        if (effectiveSeismic === 3 && !isAwas) {
          const isDuckCoverUnderTable = (npc.isIndoor || npc.shelteredInConcrete) && (npc.indoorBuilding?.isConcrete ?? false);

          if (isDuckCoverUnderTable) {
            npc.isProne = true;
            npc.isKnockedOut = false;
            npc.bodyMesh.scale.y = 0.45;
            npc.headMesh.position.y = 0.28;
            npc.mesh.rotation.x = 0.8;
            npc.mesh.position.set(posX, posY + 0.05, posZ);
            continue;
          }

          let nearCollapsingWall = false;
          for (let b = 0; b < registeredBuildings.length; b++) {
            const bldg = registeredBuildings[b];
            const dBldg = Math.hypot(posX - bldg.x, posZ - bldg.z);
            if (dBldg < 3.8) {
              nearCollapsingWall = true;
              break;
            }
          }

          if (nearCollapsingWall) {
            npc.isKnockedOut = true;
            npc.mesh.rotation.x = Math.PI / 2;
            npc.mesh.position.set(posX, posY + 0.06, posZ);
            continue;
          } else if (currentEvacCmd === 'TANAH_LAPANG') {
            npc.isProne = true;
            npc.isKnockedOut = false;
            npc.mesh.rotation.x = 1.25;
            npc.bodyMesh.scale.y = 0.42;
            npc.headMesh.position.y = 0.24;
            npc.mesh.position.set(posX, posY + 0.05, posZ);
            continue;
          }
        } else {
          if (npc.isKnockedOut || npc.isProne) {
            npc.isKnockedOut = false;
            npc.isProne = false;
            npc.mesh.rotation.x = 0;
            npc.bodyMesh.scale.y = 1.0;
            npc.headMesh.position.y = npc.role === 'student' ? 0.48 : 0.60;
          }
        }

        // ── TAHAP GEMPA SEDANG / WASPADA LOOK-UP ──
        if (effectiveSeismic === 2 && !isAwas) {
          if (npc.isIndoor && npc.indoorBuilding?.isConcrete && currentEvacCmd === 'NONE') {
            npc.status = 'DUCK_COVER';
            npc.bodyMesh.scale.y = 0.52;
            npc.headMesh.position.y = 0.32;
            npc.headMesh.rotation.x = 0.5;
            npc.mesh.position.set(posX, posY, posZ);
            continue;
          } else {
            npc.status = 'PANIC';
          }
        }

        if (effectiveSeismic === 1 && !isAwas && currentEvacCmd === 'NONE') {
          if (npc.isIndoor) {
            npc.status = 'ALERT';
          } else {
            if (npc.lookUpTimer <= 0 && npc.status !== 'ALERT') {
              npc.lookUpTimer = 1.4 + (npc.id % 4) * 0.3;
              npc.status = 'ALERT';
            }
            if (npc.lookUpTimer > 0) {
              npc.lookUpTimer -= dt;
              npc.headMesh.rotation.x = -0.55;
              npc.headMesh.rotation.y = Math.sin(elapsed * 4 + npc.id) * 0.25;
              npc.mesh.position.set(posX, posY, posZ);
              continue;
            } else {
              npc.headMesh.rotation.x = 0;
              npc.headMesh.rotation.y = 0;
            }
          }
        }

        // ── STATUS WASPADA (MENOLEH KE KAWAH) ──
        if (isWaspada && !isSiaga && !isAwas && effectiveSeismic === 0 && currentEvacCmd === 'NONE') {
          if (npc.gazeTimer > 0) {
            npc.gazeTimer -= dt;
            const angToPeak = Math.atan2(PEAK_X - posX, PEAK_Z - posZ);
            npc.mesh.rotation.y = angToPeak;
            npc.headMesh.rotation.x = -0.35;
            npc.mesh.position.set(posX, posY, posZ);
            continue;
          } else {
            npc.headMesh.rotation.x = 0;
            if (Math.sin(elapsed * 0.35 + npc.id * 1.7) > 0.99 && Math.random() < 0.06) {
              npc.gazeTimer = 2.0 + (npc.id % 3) * 0.5;
            }
          }
        }

        // ── BAHAYA LEMBAH SUNGAI SAAT ERUPSI TANPA MENJAUHI SUNGAI ──
        if (isRouteSungai && (isAwas || isExplosive || isEffusive) && currentEvacCmd !== 'JAUHI_SUNGAI') {
          const nearRiverBed = Math.abs(posX) < 13.0 && posZ < 65.0;
          if (nearRiverBed) {
            npc.isKnockedOut = true;
            npc.mesh.rotation.x = Math.PI / 2;
            npc.mesh.position.set(posX, posY + 0.06, posZ);
            continue;
          }
        } else if (!isDisaster && currentEvacCmd === 'NONE') {
          npc.status = 'IDLE';
          npc.bodyMesh.scale.y = 1.0;
          npc.headMesh.position.y = npc.role === 'student' ? 0.48 : 0.60;
        }

        // ── PERGERAKAN JALAN & ROUTING DI PERSIMPANGAN (ORGANIK & ANTI-CONGA-LINE) ──
        npc.progress += npc.baseSpeed * npcSpeedMultiplier;
        if (npc.progress >= 1.0) {
          npc.progress = 0;
          npc.fromNode = npc.toNode;
          const currNode = NODE_MAP.get(npc.fromNode)!;
          const choices = currNode.neighbors;
          const personalBias = ((npc.id * 13) % 17 - 8) * 0.3;

          if (!isDisaster && currentEvacCmd === 'NONE') {
            // NORMAL: rutinitas harian jalan santai
            npc.toNode = choices[Math.floor(Math.random() * choices.length)];
          } else if (isDisaster && currentEvacCmd === 'NONE') {
            // BENCANA TANPA BLOK EVAKUASI: PANIK KEBINGUNGAN!
            // Lari-lari bolak-balik tanpa arah evakuasi
            npc.toNode = choices[Math.floor(Math.random() * choices.length)];
          } else if (currentEvacCmd === 'TANAH_LAPANG' || isRouteLapangan) {
            // EVAKUASI KE TANAH LAPANG TERDEKAT (SEBARAN ALAMI ANTI-SEMUT):
            let bestField = OPEN_FIELDS[0];
            let bestDist = 9999;
            for (let f = 0; f < OPEN_FIELDS.length; f++) {
              const d = Math.hypot(currNode.x - OPEN_FIELDS[f].x, currNode.z - OPEN_FIELDS[f].z);
              if (d < bestDist) {
                bestDist = d;
                bestField = OPEN_FIELDS[f];
              }
            }
            const targetX = bestField.x + npc.fieldOffset.x;
            const targetZ = bestField.z + npc.fieldOffset.z;
            const scored = choices.map((nbrId) => {
              const n = NODE_MAP.get(nbrId);
              if (!n) return { id: nbrId, score: 999 };
              const dTarget = Math.hypot(n.x - targetX, n.z - targetZ);
              return { id: nbrId, score: dTarget + personalBias + (Math.random() - 0.5) * 3.5 };
            });
            scored.sort((a, b) => a.score - b.score);
            npc.toNode = scored.length > 1 && Math.random() < 0.25 ? scored[1].id : scored[0].id;
          } else if (currentEvacCmd === 'KRB2') {
            // EVAKUASI KE KRB II (STATUS WASPADA):
            const scored = choices.map((nbrId) => {
              const n = NODE_MAP.get(nbrId);
              if (!n) return { id: nbrId, score: -999 };
              let s = (n.z - currNode.z) * 2.5 + personalBias + (Math.random() - 0.5) * 2.0;
              return { id: nbrId, score: s };
            });
            scored.sort((a, b) => b.score - a.score);
            npc.toNode = scored.length > 1 && Math.random() < 0.3 ? scored[1].id : scored[0].id;
          } else if (currentEvacCmd === 'KRB1') {
            // EVAKUASI KE KRB I (STATUS SIAGA):
            const scored = choices.map((nbrId) => {
              const n = NODE_MAP.get(nbrId);
              if (!n) return { id: nbrId, score: -999 };
              let s = (n.z - currNode.z) * 2.8;
              s += (npc.id % 2 === 0 ? n.x : -n.x) * 0.35 + personalBias + (Math.random() - 0.5) * 2.0;
              return { id: nbrId, score: s };
            });
            scored.sort((a, b) => b.score - a.score);
            npc.toNode = scored.length > 1 && Math.random() < 0.3 ? scored[1].id : scored[0].id;
          } else if (currentEvacCmd === 'LUAR_MAP') {
            // EVAKUASI TOTAL MENJAUH DARI KRB I KE LUAR PETA:
            const scored = choices.map((nbrId) => {
              const n = NODE_MAP.get(nbrId);
              if (!n) return { id: nbrId, score: -999 };
              let s = (n.z - currNode.z) * 4.0 + personalBias + (Math.random() - 0.5) * 2.0;
              return { id: nbrId, score: s };
            });
            scored.sort((a, b) => b.score - a.score);
            npc.toNode = scored.length > 1 && Math.random() < 0.25 ? scored[1].id : scored[0].id;
          } else if (currentEvacCmd === 'JAUHI_SUNGAI') {
            // EVAKUASI MENJAUHI WILAYAH SUNGAI:
            const scored = choices.map((nbrId) => {
              const n = NODE_MAP.get(nbrId);
              if (!n) return { id: nbrId, score: -999 };
              let s = Math.abs(n.x) * 2.5 + (n.z - currNode.z) * 0.8 + personalBias + (Math.random() - 0.5) * 2.0;
              return { id: nbrId, score: s };
            });
            scored.sort((a, b) => b.score - a.score);
            npc.toNode = scored.length > 1 && Math.random() < 0.3 ? scored[1].id : scored[0].id;
          } else if (isRouteLingkar) {
            // JALUR LINGKAR UTAMA:
            const scored = choices.map((nbrId) => {
              const n = NODE_MAP.get(nbrId);
              if (!n) return { id: nbrId, score: -999 };
              let s = Math.abs(n.x) * 1.6 + (n.z - currNode.z) * 2.2 + personalBias + (Math.random() - 0.5) * 1.5;
              return { id: nbrId, score: s };
            });
            scored.sort((a, b) => b.score - a.score);
            npc.toNode = scored.length > 1 && Math.random() < 0.3 ? scored[1].id : scored[0].id;
          } else if (isRouteSungai) {
            // JALUR LEMBAH SUNGAI:
            const scored = choices.map((nbrId) => {
              const n = NODE_MAP.get(nbrId);
              if (!n) return { id: nbrId, score: 999 };
              return { id: nbrId, score: Math.abs(n.x) + Math.random() * 0.5 };
            });
            scored.sort((a, b) => a.score - b.score);
            npc.toNode = scored[0].id;
          } else {
            npc.toNode = choices[Math.floor(Math.random() * choices.length)];
          }
        }

        // Posisi & Rotasi Akhir
        npc.mesh.position.set(posX, posY, posZ);

        const ang = Math.atan2(dirX, dirZ);
        npc.mesh.rotation.y = ang;

        // Goyangan seismik teratenuasi jarak
        if (effectiveSeismic > 0) {
          const distNpc = Math.hypot(posX - PEAK_X, posZ - PEAK_Z);
          const attNpc = 1 / (1 + 0.018 * distNpc);
          npc.mesh.rotation.z = Math.sin(elapsed * 28 + npc.walkPhase) * (0.22 * attNpc);
        } else {
          npc.mesh.rotation.z = 0;
        }

        // Ayunan langkah kaki alami (desinkronisasi fase per individu)
        const stepBob = Math.abs(Math.sin(elapsed * npcStepRate + npc.walkPhase)) * 0.06;
        npc.mesh.position.y += stepBob;
      }

      // 4. UPDATE PARTIKEL ASAP KAWAH
      if (smokePointsRef.current) {
        const pts = smokePointsRef.current;
        const posAttr = pts.geometry.attributes.position as THREE.BufferAttribute;
        const vels = (pts as any).userData.velocities;
        const peakY = (pts as any).userData.peakY;

        for (let i = 0; i < posAttr.count; i++) {
          const v = vels[i];
          const ySpeed = isExplosive ? v.y * 2.8 : isEffusive ? v.y * 1.2 : v.y;
          let y = posAttr.getY(i) + ySpeed;
          let x = posAttr.getX(i) + v.x * (isExplosive ? 2.0 : 1.0);
          let z = posAttr.getZ(i) + v.z * (isExplosive ? 2.0 : 1.0);

          v.life += 1;
          if (v.life > v.maxLife) {
            v.life = 0;
            x = PEAK_X + (Math.random() - 0.5) * (isExplosive ? 8 : 3);
            y = peakY + 0.6;
            z = PEAK_Z + (Math.random() - 0.5) * (isExplosive ? 8 : 3);
          }

          posAttr.setXYZ(i, x, y, z);
        }
        posAttr.needsUpdate = true;
      }

      // 5. Pendaran Lampu LED Pusat (Super Terang & Glow Aura)
      if (ledMeshRef.current && ledLightRef.current) {
        const pulse = 1.0 + Math.sin(elapsed * 5.5) * 0.28;
        (ledMeshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 8.5 * pulse;
        ledLightRef.current.intensity = (rgbColor === 'off' ? 0 : 25.0) * pulse;

        if (ledHaloMeshRef.current) {
          ledHaloMeshRef.current.scale.setScalar(1.0 + Math.sin(elapsed * 5.5) * 0.18);
          (ledHaloMeshRef.current.material as THREE.MeshBasicMaterial).opacity = (rgbColor === 'off' ? 0 : 0.65) * pulse;
        }
        if (ledOuterHaloMeshRef.current) {
          ledOuterHaloMeshRef.current.scale.setScalar(1.0 + Math.cos(elapsed * 4.0) * 0.25);
          (ledOuterHaloMeshRef.current.material as THREE.MeshBasicMaterial).opacity = (rgbColor === 'off' ? 0 : 0.35) * pulse;
        }
        if (ledGroundRingRef.current) {
          (ledGroundRingRef.current.material as THREE.MeshBasicMaterial).opacity = (rgbColor === 'off' ? 0 : 0.45) * pulse;
        }
      }

      // 6. Sirine EWS Berkedip jika Buzzer ON
      if (sirenLightRef.current && isBuzzerOnRef.current) {
        sirenLightRef.current.intensity = Math.sin(elapsed * 20) > 0 ? 8.0 : 0;
      }

      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Sinkronisasi Warna LED Pusat (Super Terang & Seluruh Lapisan Cahaya)
  useEffect(() => {
    let hex = 0x00ff66;
    if (rgbColor === 'red' || volcanoStatus === 'AWAS') hex = 0xff0033;
    else if (rgbColor === 'orange' || volcanoStatus === 'SIAGA') hex = 0xff6600;
    else if (rgbColor === 'yellow' || volcanoStatus === 'WASPADA') hex = 0xffea00;
    else if (rgbColor === 'off') hex = 0x1e293b;

    if (ledMeshRef.current) {
      const mat = ledMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.color.setHex(hex);
      mat.emissive.setHex(hex);
    }
    if (ledLightRef.current) {
      ledLightRef.current.color.setHex(hex);
      ledLightRef.current.intensity = rgbColor === 'off' ? 0 : 25.0;
    }
    if (ledHaloMeshRef.current) {
      (ledHaloMeshRef.current.material as THREE.MeshBasicMaterial).color.setHex(hex);
    }
    if (ledOuterHaloMeshRef.current) {
      (ledOuterHaloMeshRef.current.material as THREE.MeshBasicMaterial).color.setHex(hex);
    }
    if (ledGroundRingRef.current) {
      (ledGroundRingRef.current.material as THREE.MeshBasicMaterial).color.setHex(hex);
    }
  }, [rgbColor, volcanoStatus]);

  // Sinkronisasi Tipe Partikel Asap Kawah
  useEffect(() => {
    if (!smokePointsRef.current) return;
    const mat = smokePointsRef.current.material as THREE.PointsMaterial;
    if (volcanoStatus === 'AWAS') {
      mat.color.setHex(eruptionType === 'EFUSIF' ? 0x94a3b8 : 0xf1f5f9); // Senada awan panas untuk eksplosif
      mat.size = eruptionType === 'EFUSIF' ? 4.5 : 8.0;
      mat.opacity = 0.9;
    } else if (volcanoStatus === 'SIAGA') {
      mat.color.setHex(0x64748b);
      mat.size = 5.0;
      mat.opacity = 0.7;
    } else if (volcanoStatus === 'WASPADA') {
      mat.color.setHex(0xd97706);
      mat.size = 4.0;
      mat.opacity = 0.6;
    } else {
      mat.color.setHex(0xe2e8f0);
      mat.size = 3.0;
      mat.opacity = 0.5;
    }
  }, [volcanoStatus, eruptionType]);

  useEffect(() => {
    if (krbLinesGroupRef.current) krbLinesGroupRef.current.visible = showKrbZones;
  }, [showKrbZones]);

  const resetCamera = () => {
    if (!controlsRef.current || !cameraRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    camera.up.set(0, 1, 0);
    controls.target.set(-5, 0, 15);
    camera.position.set(38, 78, 122);
    camera.lookAt(controls.target);
    controls.update();
  };

  const handleResetDisasterEnvironment = () => {
    retroAudio.playSelect();
    if (resetDisasterStateRef.current) {
      resetDisasterStateRef.current();
    }
    useRuntimeStore.getState().setSeismicSimulation(0);
    useRuntimeStore.getState().setVolcanoSimulation('NORMAL', 'NONE');
    useRuntimeStore.getState().setEvacuationCommand('NONE');
    useRuntimeStore.getState().addLog('[RESET] Kondisi lingkungan, kerusakan bangunan, dan peta telah direset ke semula.', 'info');
    setHasDisasterImpact(false);
    setEruptionStageText('');
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#060913] select-none">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {isLoading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#060913]/90 backdrop-blur-md">
          <div className="w-14 h-14 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
          <h3 className="text-sm font-bold text-white tracking-wide font-pixel">Memuat Digital Twin 3D Merapi</h3>
          <p className="text-[11px] text-slate-400 mt-1">Mengoptimalkan geometri maket & topografi STL • {loadProgress}%</p>
        </div>
      )}

      {/* ── HEADER STATUS GUNUNG & TAHAP SIMULASI DINAMIS ── */}
      <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1.5 pointer-events-none">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs font-bold font-pixel px-3 py-1.5 rounded-xl border shadow-xl backdrop-blur-md transition-all ${volcanoStatus === 'AWAS'
              ? 'bg-red-950/90 text-red-200 border-red-500 animate-pulse'
              : volcanoStatus === 'SIAGA'
                ? 'bg-orange-950/90 text-orange-200 border-orange-500'
                : volcanoStatus === 'WASPADA'
                  ? 'bg-yellow-950/90 text-yellow-200 border-yellow-500'
                  : 'bg-emerald-950/90 text-emerald-200 border-emerald-500'
              }`}
          >
            STATUS: {volcanoStatus}
          </span>

          {/* Tipe Erupsi Jika Sedang Aktif */}
          {eruptionType !== 'NONE' && volcanoStatus !== 'NORMAL' && (
            <span className="text-[10px] font-bold font-pixel px-2.5 py-1.5 rounded-xl border bg-amber-950/90 text-amber-200 border-amber-500 shadow-xl backdrop-blur-md animate-bounce">
              {eruptionType === 'EKSPLOSIF' ? '💥 ERUPSI EKSPLOSIF' : '🌋 ERUPSI EFUSIF'}
            </span>
          )}

          {/* Peringatan Gempa Bumi Aktif */}
          {seismicLevel > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold font-pixel px-2.5 py-1.5 rounded-xl border bg-red-950/90 text-red-200 border-red-500 shadow-xl backdrop-blur-md animate-pulse">
                ⚠️ GEMPA {richterScale.toFixed(1)} SR [{seismicLevel === 3 ? 'KUAT' : seismicLevel === 2 ? 'SEDANG' : 'RINGAN'}]
              </span>
              <span className="text-[9px] font-medium font-sans px-2 py-0.5 rounded-lg bg-black/70 text-slate-300 border border-slate-700/80 backdrop-blur-xs w-fit">
                {seismicLevel === 1 && 'Status: Panic • NPC Menuju Lapangan (1.5x) • Bangunan Aman (HP 100%)'}
                {seismicLevel === 2 && 'Status: Extreme Panic • Merunduk 3s & Lari (2x) • Dinding Retak (HP 60%) • Tiang Miring'}
                {seismicLevel === 3 && 'Status: Kolaps Total • Warga Tiarap/Reruntuhan • Bangunan Runtuh Amblas • Tiang Roboh'}
              </span>
            </div>
          )}
        </div>

        {/* Indikator Tahap Erupsi Riil (Timeline Eksplosif / Efusif) */}
        {eruptionStageText && volcanoStatus !== 'NORMAL' && (
          <div className="flex items-center gap-1.5 bg-rose-950/90 border border-rose-500/80 rounded-xl px-2.5 py-1 text-[10px] font-bold font-pixel text-rose-200 shadow-xl backdrop-blur-md animate-pulse w-fit">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping shrink-0" />
            <span>TAHAP: {eruptionStageText}</span>
          </div>
        )}

        {/* Banner Notifikasi Rute Evakuasi Aktif */}
        {selectedRoute !== 'Belum Ditentukan' && (
          <div className="bg-emerald-950/90 border border-emerald-500/80 rounded-xl px-3 py-1 text-[10px] text-emerald-200 shadow-xl flex items-center gap-1.5 animate-bounce w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>Rute: <strong>{selectedRoute}</strong> → {activeShelter}</span>
          </div>
        )}
      </div>

      {/* ── TOOLBAR ATAS KANAN: GARIS KRB, RESET VIEW, GEDEIN PETA ── */}
      <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 bg-[#0f172a]/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1 shadow-xl">
        <button
          onClick={() => setShowKrbZones(!showKrbZones)}
          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${showKrbZones ? 'bg-amber-600 text-white border-amber-400 shadow-xs' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          title="Tampilkan / Sembunyikan Zonasi KRB I, II, III"
        >
          <span>Garis KRB</span>
        </button>
        <button
          onClick={resetCamera}
          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer flex items-center gap-1"
          title="Reset Sudut Pandang Kamera"
        >
          <span>Reset View</span>
        </button>

        {/* Tombol Gedein Peta / Perbesar Tampilan */}
        <button
          onClick={toggleMapExpanded}
          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1 shadow-xs ${isMapExpanded
            ? 'bg-amber-600 text-white border-amber-400'
            : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-600/60'
            }`}
          title={isMapExpanded ? 'Kecilkan Tampilan Peta' : 'Perbesar Tampilan Peta'}
        >
          <span>{isMapExpanded ? 'Perkecil Peta' : 'Gedein Peta'}</span>
        </button>

        {/* Tombol Reset Dampak Lingkungan / Peta Pasca Bencana */}
        <button
          onClick={handleResetDisasterEnvironment}
          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1 shadow-xs ${hasDisasterImpact
            ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400 animate-pulse'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 hover:text-white'
            }`}
          title="Reset kondisi lingkungan, kerusakan bangunan, awan panas, dan lava ke kondisi normal"
        >
          <span>Reset Kondisi</span>
        </button>
      </div>
    </div>
  );
}
