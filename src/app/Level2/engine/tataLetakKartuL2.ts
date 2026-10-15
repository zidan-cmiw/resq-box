// ── src/app/Level2/engine/tataLetakKartuL2.ts ─────────────────────────────
// Batas AMAN VERTIKAL untuk kartu popup/QTE yang digambar di KANVAS Level 2,
// supaya tidak tertutup oleh TRACKER PROGRES yang berupa elemen HTML.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA BERKAS INI ADA — KEJADIAN NYATA
// ═══════════════════════════════════════════════════════════════════════════
//
//   Seluruh kartu popup simulasi (QTE gempa 10 detik, pengukur guncangan, QTE
//   kentongan, penyelamatan warga, mobil evakuasi, dan papan status gunung)
//   digambar pada bagian ATAS TENGAH layar, mulai `y = 72`–`82` piksel KANVAS.
//
//   Tracker progres (`<JourneyProgressTracker>`) juga berada di atas tengah:
//   pembungkusnya `top-14`/`top-15` (56–60 px CSS). Karena trackernya elemen
//   HTML di atas kanvas, ia MENUTUPI bagian atas kartu QTE — termasuk judul
//   peringatannya.
//
//   Pengukuran nyata sebelum diperbaiki (Chrome, 1440x900, dpr 1):
//     tracker-pembungkus  y 60..156
//     tracker-batang      y 112..132
//     kartu QTE gempa     y 90..310   -> bertumpuk 90..156
//
//   Karena itu kartu-kartu digeser ke BAWAH pita tracker. Angka `156` di bawah
//   berasal dari tepi bawah pembungkus tracker yang diukur, dan berlaku untuk
//   SEMUA ukuran layar karena:
//     • pada layar >= 640 px : 60 (top-15) + 52 (pt-13) + 20 (bar) + 24 (pb-6) = 156
//     • pada layar <  640 px : 56 (top-14) + 44 (pt-11) + 16 (bar) + 20 (pb-5) = 136
//   Nilai TERBESAR (156) dipakai supaya aman di kedua-duanya.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA HARUS DIKONVERSI KE PIKSEl KANVAS
// ═══════════════════════════════════════════════════════════════════════════
//
//   Kartu digambar pada koordinat KANVAS, sedangkan trackernya koordinat CSS.
//   Kanvas Level 2 berukuran `lebar CSS x devicePixelRatio` (lihat
//   `useUkuranKanvas`, dpr dibatasi 2,5), sehingga `y = 156` px CSS setara
//   `156 * dpr` px kanvas. Tanpa konversi ini, pada layar berkerapatan tinggi
//   kartunya justru naik dan kembali tertutup tracker.
//
//   Skalanya dibaca dari kanvas itu sendiri (`canvas.width` dibagi lebar
//   tampilannya) supaya SELALU sama dengan yang dipakai pengubah ukuran kanvas
//   — tidak menebak dari `window.devicePixelRatio`. Hasilnya disimpan sementara
//   per lebar kanvas, karena pembacaan tata letak di dalam gelung 60 FPS mahal.
//
// Pemakai: `draw/overlay.ts` (3 kartu simulasi gempa) dan `draw/locations.ts`
// (6 kartu simulasi erupsi).

/** Tepi bawah pita tracker progres Level 2, dalam piksel CSS. */
export const PITA_TRACKER_L2_CSS = 156;

/** Hasil pembacaan skala terakhir, disimpan per lebar kanvas (piksel perangkat). */
const simpananSkala = new Map<number, number>();

/**
 * Skala kanvas: berapa piksel perangkat untuk satu piksel CSS.
 *
 * Contoh: kanvas 1440 px perangkat yang tampil selebar 1440 px CSS -> 1.
 * Di tablet/HP berkerapatan tinggi nilainya 2 atau 2,5.
 */
export function skalaKanvasL2(ctx: CanvasRenderingContext2D): number {
  const kanvas = ctx?.canvas;
  if (!kanvas) return 1;

  const lebarPerangkat = kanvas.width;
  const tersimpan = simpananSkala.get(lebarPerangkat);
  if (tersimpan !== undefined) return tersimpan;

  let skala = 1;
  try {
    const lebarCss = kanvas.getBoundingClientRect().width;
    if (lebarCss > 0) skala = lebarPerangkat / lebarCss;
  } catch {
    // Lingkungan tanpa tata letak (mis. pengujian) — tetap 1 piksel = 1 piksel.
    skala = 1;
  }

  simpananSkala.set(lebarPerangkat, skala);
  return skala;
}

/** Tepi bawah pita tracker dalam piksel KANVAS (sudah dikalikan skala kanvas). */
export function batasBawahPitaTrackerL2(ctx: CanvasRenderingContext2D): number {
  return Math.round(PITA_TRACKER_L2_CSS * skalaKanvasL2(ctx));
}

/**
 * Atas kartu popup yang aman: tidak lebih tinggi daripada tepi bawah tracker.
 *
 * @param ctx    Konteks kanvas tempat kartu akan digambar.
 * @param bawaan Nilai `y` asli kartu bila pita tracker tidak menghalangi.
 */
export function atasKartuAmanL2(ctx: CanvasRenderingContext2D, bawaan: number): number {
  return Math.max(bawaan, batasBawahPitaTrackerL2(ctx));
}
