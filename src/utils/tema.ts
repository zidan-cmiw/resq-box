// ── utils/tema.ts ─────────────────────────────────────────────────────────
// MODE TERANG & MODE GELAP RESQ-BOX
//
// CARA PAKAI
//   Di dalam komponen React:
//     const { tema, pasangTema, alihkanTema } = useTema();
//
//   Di luar komponen (mis. mesin game, penanganan peristiwa):
//     import { alihkanTema, temaAktif } from '../utils/tema';
//
// MENGAPA MODUL INI, BUKAN STORE ZUSTAND BARU
//
//   Pengaturan tampilan yang sudah ada di aplikasi ini — suara
//   (`utils/retroAudio.ts`), bahasa (`i18n/index.ts`), dan penghemat data
//   (`utils/dataSaver.ts`) — semuanya berupa modul kecil dengan
//   `useSyncExternalStore` dan satu kunci `localStorage`. Tema mengikuti pola
//   yang sama supaya tidak ada dua gaya penyimpanan yang berbeda di proyek ini.
//
// MENGAPA SEBAGIAN LOGIKANYA DIJALANKAN SEBELUM REACT (index.html)
//
//   Tema harus sudah terpasang pada <html> SEBELUM halaman pertama digambar.
//   Bila menunggu React, siswa melihat kedipan putih sekejap di mode gelap.
//   Karena itu ada skrip kecil di index.html yang membaca kunci yang SAMA
//   ('resqbox-theme') dan memasang kelasnya lebih dahulu. Modul ini lalu
//   mengambil alih dan menyinkronkan sisanya. Keduanya membaca format yang
//   sama persis: string 'light' atau 'dark'.
//
// NILAI AWAL: MENGIKUTI PENGATURAN SISTEM
//
//   Bila pengguna BELUM pernah memilih, tema mengikuti `prefers-color-scheme`
//   perangkatnya, dan terus mengikuti bila pengaturan sistem berubah
//   (mis. mode gelap menyala otomatis saat matahari terbenam). Begitu pengguna
//   menekan saklar tema sekali saja, pilihannya disimpan dan TIDAK lagi
//   ditimpa oleh perubahan pengaturan sistem.

import { useSyncExternalStore } from 'react';

/**
 * Kunci penyimpanan. Sengaja TIDAK diawali `resqbox-` yang sama dengan
 * `resqbox-mode-tamu` karena kunci itu dibaca penjaga database.
 *
 * Tema bersifat per-perangkat, bukan per-akun: siswa yang berganti akun di
 * laptop yang sama tetap memakai tema pilihannya. Karena itu kuncinya tidak
 * diberi akhiran id pengguna, berbeda dengan `resqbox-unlocked-level_<id>`.
 */
export const KUNCI_TEMA = 'resqbox-theme';

export type Tema = 'light' | 'dark';

/** Preferensi sistem saat ini. Aman dipanggil walau `matchMedia` tidak ada. */
function sistemGelap(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/** Pilihan tersimpan pengguna, atau `null` bila belum pernah memilih. */
function temaTersimpan(): Tema | null {
  try {
    const raw = localStorage.getItem(KUNCI_TEMA);
    if (raw === 'light' || raw === 'dark') return raw;
  } catch {
    /* localStorage tidak tersedia (mode privat / cookie diblokir) */
  }
  return null;
}

/**
 * Apakah pengguna sudah pernah memilih sendiri.
 *
 * Dibedakan dari tema yang sedang aktif karena keduanya berbeda arti:
 * pengguna yang belum memilih tetap ikut perubahan pengaturan sistem,
 * sedangkan yang sudah memilih tidak boleh diganggu.
 */
let pilihanPengguna: Tema | null = temaTersimpan();
let temaSekarang: Tema = pilihanPengguna ?? (sistemGelap() ? 'dark' : 'light');

const pendengar = new Set<() => void>();

function umumkan(): void {
  for (const l of pendengar) l();
}

/**
 * Memasang tema ke dokumen.
 *
 * Kelas `.dark` pada <html> adalah SATU-SATUNYA saklar tema: seluruh token
 * warna di index.css bertukar karenanya. Tidak ada atribut atau kelas lain
 * yang perlu disetel.
 */
function pasangKeDokumen(tema: Tema): void {
  if (typeof document === 'undefined') return;
  const akar = document.documentElement;
  akar.classList.toggle('dark', tema === 'dark');
  // Menandai pilihan pengguna secara eksplisit supaya tema tidak ditimpa
  // pengaturan sistem pada kunjungan berikutnya.
  akar.dataset.tema = tema;

  // Warna bilah peramban di Android/iOS mengikuti tema, bukan tetap gelap.
  // Tanpa ini, bilah alamat tetap hitam di mode terang dan terlihat terputus
  // dari halamannya.
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', tema === 'dark' ? '#0a0f1c' : '#f1f5f9');
}

/** Tema yang sedang aktif. Aman dipanggil dari luar komponen React. */
export function temaAktif(): Tema {
  return temaSekarang;
}

/** Apakah pengguna sudah pernah memilih tema sendiri (bukan ikut sistem). */
export function temaDipilihPengguna(): boolean {
  return pilihanPengguna !== null;
}

/**
 * Mengganti tema dan menyimpannya.
 *
 * @param tema   tema tujuan
 * @param simpan `false` untuk perubahan sementara yang tidak boleh diingat
 *               (dipakai saat mengikuti perubahan pengaturan sistem).
 */
export function pasangTema(tema: Tema, simpan = true): void {
  if (tema !== 'light' && tema !== 'dark') return;
  temaSekarang = tema;
  if (simpan) {
    pilihanPengguna = tema;
    try {
      localStorage.setItem(KUNCI_TEMA, tema);
    } catch {
      /* localStorage penuh atau diblokir — tema tetap berlaku di sesi ini */
    }
  }
  pasangKeDokumen(tema);
  umumkan();
}

/** Membalik tema terang ↔ gelap. */
export function alihkanTema(): Tema {
  const berikutnya: Tema = temaSekarang === 'dark' ? 'light' : 'dark';
  pasangTema(berikutnya);
  return berikutnya;
}

/**
 * Menghapus pilihan pengguna dan kembali mengikuti pengaturan sistem.
 * Dipakai tombol "Ikuti sistem" bila disediakan di pengaturan.
 */
export function ikutiSistem(): Tema {
  pilihanPengguna = null;
  try {
    localStorage.removeItem(KUNCI_TEMA);
  } catch {
    /* abaikan */
  }
  const tema: Tema = sistemGelap() ? 'dark' : 'light';
  temaSekarang = tema;
  pasangKeDokumen(tema);
  umumkan();
  return tema;
}

function berlangganan(listener: () => void): () => void {
  pendengar.add(listener);
  return () => {
    pendengar.delete(listener);
  };
}

function cuplikan(): Tema {
  return temaSekarang;
}

/** Hook React: tema aktif + cara mengubahnya. */
export function useTema(): {
  tema: Tema;
  gelap: boolean;
  pasangTema: (t: Tema) => void;
  alihkanTema: () => Tema;
  ikutiSistem: () => Tema;
} {
  const tema = useSyncExternalStore(berlangganan, cuplikan, cuplikan);
  return {
    tema,
    gelap: tema === 'dark',
    pasangTema,
    alihkanTema,
    ikutiSistem,
  };
}

/**
 * Menyiapkan tema sekali saat aplikasi dimulai.
 *
 * Selama pengguna belum memilih, perubahan pengaturan sistem diteruskan ke
 * halaman secara langsung, sehingga siswa yang mengaktifkan mode gelap dari
 * pengaturan HP-nya tidak perlu memuat ulang aplikasi.
 */
export function initTema(): void {
  pasangKeDokumen(temaSekarang);

  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

  const kueri = window.matchMedia('(prefers-color-scheme: dark)');
  const saatSistemBerubah = (e: MediaQueryListEvent) => {
    // Pilihan pengguna selalu menang atas pengaturan sistem.
    if (pilihanPengguna !== null) return;
    pasangTema(e.matches ? 'dark' : 'light', false);
  };

  if (typeof kueri.addEventListener === 'function') {
    kueri.addEventListener('change', saatSistemBerubah);
  } else if (typeof kueri.addListener === 'function') {
    // Peramban lama (Safari < 14) hanya punya API lama ini.
    kueri.addListener(saatSistemBerubah);
  }
}
