// ── dataSaver.ts ──────────────────────────────────────────────────────────
// Mode hemat data: mengurangi unduhan & beban render untuk sekolah dengan
// koneksi terbatas atau perangkat kelas bawah.
//
// APA YANG DIHEMAT
//   • Scene 3D Merapi (Three.js + terrain ~966 KB) → diganti ringkasan teks
//   • Animasi latar & partikel (menghemat CPU/baterai perangkat lama)
//   • Prefetch modul berat
//
// TIDAK mengurangi materi pelajaran. Seluruh isi kurikulum, soal, dan alur
// level tetap lengkap — hanya cara penyajiannya yang diringankan.

import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'resqbox-data-saver';

export type DataSaverMode = 'auto' | 'on' | 'off';

interface DataSaverState {
  /** Pilihan pengguna. */
  mode: DataSaverMode;
  /** Hasil akhir setelah memperhitungkan kondisi jaringan. */
  active: boolean;
  /** Alasan aktif — ditampilkan di UI agar siswa/guru paham. */
  reason: 'manual-on' | 'manual-off' | 'auto-metered' | 'auto-slow' | 'off';
}

let state: DataSaverState = readInitial();
const listeners = new Set<() => void>();

/** Deteksi jaringan lambat / mode hemat data dari peramban. */
function detectNetwork(): { saveData: boolean; effectiveType: string | null } {
  if (typeof navigator === 'undefined') return { saveData: false, effectiveType: null };
  const conn = (
    navigator as unknown as {
      connection?: { saveData?: boolean; effectiveType?: string };
      mozConnection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection ?? (navigator as unknown as { mozConnection?: { saveData?: boolean; effectiveType?: string } }).mozConnection;
  return {
    saveData: Boolean(conn?.saveData),
    effectiveType: conn?.effectiveType ?? null,
  };
}

function computeActive(mode: DataSaverMode): { active: boolean; reason: DataSaverState['reason'] } {
  if (mode === 'on') return { active: true, reason: 'manual-on' };
  if (mode === 'off') return { active: false, reason: 'manual-off' };

  const { saveData, effectiveType } = detectNetwork();
  // Peramban sudah menandai "hemat data", atau jaringan 2G/3G.
  if (saveData) return { active: true, reason: 'auto-metered' };
  if (effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g') {
    return { active: true, reason: 'auto-slow' };
  }
  return { active: false, reason: 'off' };
}

function readInitial(): DataSaverState {
  let mode: DataSaverMode = 'auto';
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'on' || raw === 'off' || raw === 'auto') mode = raw;
  } catch {
    /* localStorage tidak tersedia (mode privat) — pakai default */
  }
  const { active, reason } = computeActive(mode);
  return { mode, active, reason };
}

function emit(): void {
  for (const l of listeners) l();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): DataSaverState {
  return state;
}

/** Ubah mode. `'auto'` mengikuti kondisi jaringan. */
export function setDataSaverMode(mode: DataSaverMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* abaikan */
  }
  const { active, reason } = computeActive(mode);
  state = { mode, active, reason };
  emit();
}

/** Panggil saat perangkat berganti jaringan (mis. pindah dari WiFi ke seluler). */
export function refreshDataSaver(): void {
  const { active, reason } = computeActive(state.mode);
  if (active !== state.active || reason !== state.reason) {
    state = { ...state, active, reason };
    emit();
  }
}

/** Apakah mode hemat data sedang aktif. Pakai di komponen React. */
export function useDataSaver(): DataSaverState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Versi non-hook, untuk dipakai di luar komponen React. */
export function isDataSaverActive(): boolean {
  return state.active;
}

/** Penjelasan singkat untuk ditampilkan ke pengguna. */
export function describeReason(reason: DataSaverState['reason']): string {
  switch (reason) {
    case 'manual-on':
      return 'Mode hemat data dinyalakan manual. Scene 3D dan animasi berat dimatikan.';
    case 'manual-off':
      return 'Mode hemat data dimatikan. Semua tampilan penuh (3D & animasi) dimuat.';
    case 'auto-metered':
      return 'Peramban menandai koneksi hemat data, jadi tampilan diringankan otomatis.';
    case 'auto-slow':
      return 'Koneksi terdeteksi lambat (2G/3G), jadi tampilan diringankan otomatis.';
    default:
      return 'Koneksi terdeteksi cukup cepat. Semua tampilan dimuat penuh.';
  }
}

// Ikuti perubahan kondisi jaringan bila peramban mendukungnya.
if (typeof window !== 'undefined') {
  const conn = (navigator as unknown as { connection?: EventTarget }).connection;
  conn?.addEventListener?.('change', refreshDataSaver);
  window.addEventListener('online', refreshDataSaver);
}
