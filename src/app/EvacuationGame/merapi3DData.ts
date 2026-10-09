/**
 * Data spasial untuk adegan 3D Merapi.
 *
 * Berkas ini memuat koordinat peta: puncak gunung, jalur aliran lava, dan
 * jaringan jalan evakuasi. Dipisahkan dari Merapi3DScene.tsx karena isinya
 * murni data — tidak ada logika, state, maupun efek samping.
 *
 * Koordinat di bawah dipakai puluhan kali di dalam komponen (PEAK_X 32 kali,
 * PEAK_Z 29 kali). Dengan dipisahkan, koordinat peta dapat dicari dan diubah
 * tanpa menggulir melewati ribuan baris kode Three.js.
 *
 * Sistem koordinat: x positif ke timur, z positif ke selatan, satuan sama
 * dengan satuan adegan Three.js.
 */

import * as THREE from 'three';

export const PEAK_X = -25.28;
export const PEAK_Z = -47.0;

// Jalur Alur Lahar Lembah Kawah Utama (Kali Gendol, Kali Kuning, Kali Boyong) untuk Awan Panas
export const LAVA_STREAM_GENDOL = [
  new THREE.Vector3(-25.28, 0, -47.0),
  new THREE.Vector3(-20.0, 0, -35.0),
  new THREE.Vector3(-14.0, 0, -22.0),
  new THREE.Vector3(-6.0, 0, -6.0),
  new THREE.Vector3(4.0, 0, 10.0),
  new THREE.Vector3(14.0, 0, 24.0),
  new THREE.Vector3(22.0, 0, 38.0),
  new THREE.Vector3(28.0, 0, 56.0),
];

export const LAVA_STREAM_KUNING = [
  new THREE.Vector3(-25.28, 0, -47.0),
  new THREE.Vector3(-23.0, 0, -32.0),
  new THREE.Vector3(-19.0, 0, -18.0),
  new THREE.Vector3(-14.0, 0, -4.0),
  new THREE.Vector3(-10.0, 0, 12.0),
  new THREE.Vector3(-9.0, 0, 28.0),
  new THREE.Vector3(-10.5, 0, 46.0),
  new THREE.Vector3(-11.5, 0, 65.0),
];

export const LAVA_STREAM_BOYONG = [
  new THREE.Vector3(-25.28, 0, -47.0),
  new THREE.Vector3(-29.0, 0, -34.0),
  new THREE.Vector3(-34.0, 0, -18.0),
  new THREE.Vector3(-38.5, 0, 0.0),
  new THREE.Vector3(-42.0, 0, 18.0),
  new THREE.Vector3(-45.0, 0, 34.0),
  new THREE.Vector3(-48.0, 0, 52.0),
];

// 3 Jalur Aliran Awan Panas Tambahan (Sesuai Coretan Pengguna: Lereng Barat, Punggung Tengah, & Lereng Timur)
export const LAVA_STREAM_KRASAK_WEST = [
  new THREE.Vector3(-25.28, 0, -47.0),
  new THREE.Vector3(-34.0, 0, -38.0),
  new THREE.Vector3(-42.0, 0, -24.0),
  new THREE.Vector3(-48.0, 0, -8.0),
  new THREE.Vector3(-53.0, 0, 8.0),
  new THREE.Vector3(-56.0, 0, 24.0),
  new THREE.Vector3(-58.0, 0, 40.0),
];

export const LAVA_STREAM_RIDGE_MID = [
  new THREE.Vector3(-25.28, 0, -47.0),
  new THREE.Vector3(-26.5, 0, -34.0),
  new THREE.Vector3(-27.0, 0, -20.0),
  new THREE.Vector3(-25.5, 0, -6.0),
  new THREE.Vector3(-22.0, 0, 8.0),
  new THREE.Vector3(-19.5, 0, 22.0),
  new THREE.Vector3(-18.0, 0, 36.0),
];

export const LAVA_STREAM_WORO_EAST = [
  new THREE.Vector3(-25.28, 0, -47.0),
  new THREE.Vector3(-14.0, 0, -40.0),
  new THREE.Vector3(-2.0, 0, -28.0),
  new THREE.Vector3(10.0, 0, -14.0),
  new THREE.Vector3(22.0, 0, 0.0),
  new THREE.Vector3(32.0, 0, 16.0),
  new THREE.Vector3(40.0, 0, 32.0),
  new THREE.Vector3(48.0, 0, 48.0),
];

// ── ALIRAN LELEHAN LAVA PIJAR KAWAH MERAPI (ERUPSI EFUSIF) ──────────
// Aliran lava efusif meluap dari bibir kawah, menuruni lereng atas KRB III,
// dan berhenti di lereng atas (area lingkaran merah screenshot 2, Z antara -39 s.d. -16),
// serta menyentuh hulu sungai kanan (Kali Gendol & Kali Woro) dan sungai tengah (Kali Kuning).
export const EFFUSIVE_LAVA_EAST_GENDOL = [
  new THREE.Vector3(-25.28, 0, -47.0),
  new THREE.Vector3(-18.0, 0, -43.0),
  new THREE.Vector3(-10.0, 0, -39.0),
  new THREE.Vector3(-3.0, 0, -35.5),
  new THREE.Vector3(4.0, 0, -32.0),
  new THREE.Vector3(9.5, 0, -29.0),
  new THREE.Vector3(13.0, 0, -26.0),
];

export const EFFUSIVE_LAVA_EAST_WORO = [
  new THREE.Vector3(-25.28, 0, -47.0),
  new THREE.Vector3(-14.0, 0, -46.5),
  new THREE.Vector3(-2.0, 0, -46.0),
  new THREE.Vector3(8.0, 0, -45.0),
  new THREE.Vector3(16.0, 0, -43.0),
  new THREE.Vector3(22.0, 0, -39.0),
];

export const EFFUSIVE_LAVA_SOUTH_KUNING_MAIN = [
  new THREE.Vector3(-25.28, 0, -47.0),
  new THREE.Vector3(-24.5, 0, -41.0),
  new THREE.Vector3(-23.5, 0, -34.0),
  new THREE.Vector3(-22.0, 0, -26.5),
  new THREE.Vector3(-20.0, 0, -20.0),
  new THREE.Vector3(-18.5, 0, -16.0),
];

export const EFFUSIVE_LAVA_SOUTH_KUNING_BRANCH = [
  new THREE.Vector3(-25.28, 0, -47.0),
  new THREE.Vector3(-22.5, 0, -39.0),
  new THREE.Vector3(-19.5, 0, -31.0),
  new THREE.Vector3(-17.0, 0, -23.0),
  new THREE.Vector3(-14.5, 0, -16.0),
];

export const EFFUSIVE_LAVA_WEST_BOYONG_MAIN = [
  new THREE.Vector3(-25.28, 0, -47.0),
  new THREE.Vector3(-28.5, 0, -41.0),
  new THREE.Vector3(-32.5, 0, -34.0),
  new THREE.Vector3(-36.5, 0, -26.0),
  new THREE.Vector3(-39.0, 0, -18.0),
];

export const EFFUSIVE_LAVA_WEST_BOYONG_BRANCH = [
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
export const seenEdges = new Set<string>();
ROAD_NODES_3D.forEach((node) => {
  node.neighbors.forEach((nbrId) => {
    const key = Math.min(node.id, nbrId) + '-' + Math.max(node.id, nbrId);
    if (!seenEdges.has(key)) {
      seenEdges.add(key);
      ROAD_EDGES.push([node.id, nbrId]);
    }
  });
});
