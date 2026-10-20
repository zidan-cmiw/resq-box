/**
 * Perhitungan posisi kartu panduan Resqy.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA DIPISAH DARI KOMPONEN
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Keluhan yang dilaporkan pemilik proyek:
 *
 *     "Mending bubble text-nya dikecilin. Soalnya itu TIDAK MENUNJUKKAN di mana
 *      letak level-nya, tapi malah MENUTUPI."
 *
 *   Penyebabnya bukan sekadar ukuran. Versi lama menghitung tinggi kartu
 *   sebagai `winH - edgePad*2` ketika kedua sisi target sama-sama sempit, lalu
 *   menggeser `top` agar kartu tetap muat:
 *
 *       top = min(targetBottom + 12, winH - tinggiAkhir - edgePad)
 *
 *   Ketika kartu setinggi layar, `winH - tinggiAkhir - edgePad` menjadi kecil,
 *   sehingga kartu terdorong ke ATAS dan MENEMBUS kotak target. Kartu yang
 *   seharusnya menjelaskan tombol LEVEL justru menutupinya.
 *
 *   Karena itu aturan pemosisian dipindahkan ke fungsi murni di berkas ini,
 *   supaya:
 *     1. dapat diuji tanpa merender React maupun DOM;
 *     2. dijamin TIDAK PERNAH bertumpuk dengan kotak target, di ukuran layar
 *        mana pun — termasuk iPad portrait 768px dan iPad landscape 1024px.
 *
 *   Berkas ini TIDAK memuat JSX dan tidak mengimpor React.
 */

export type Penempatan = 'right' | 'left' | 'top' | 'bottom' | 'center' | undefined;

export interface KotakTarget {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  height: number;
}

export interface HasilPosisi {
  containerClass: string;
  containerStyle: Record<string, string | number | undefined>;
}

/** Jarak aman kartu dari tepi layar. */
const EDGE_MOBILE = 10;
const EDGE_DESKTOP = 16;

/** Lebar maksimum kartu. Dikecilkan dari 680px agar tidak menutupi layar. */
export const LEBAR_MAKS_KARTU = 420;

/** Ruang samping minimum agar penempatan menyamping dipakai. */
export const LEBAR_MIN_SISI = 300;

/** Lebar layar minimum untuk penempatan menyamping. */
export const LAYAR_MIN_SISI = 860;

/** Jarak kartu dari kotak target. */
const JARAK = 10;

/** Tinggi minimum kartu agar isinya masih terbaca. */
const TINGGI_MIN = 120;

const KELAS_TENGAH =
  'fixed left-1/2 -translate-x-1/2 w-[92%] sm:w-[86%] md:w-[64%] max-w-[420px]';

/**
 * Menghitung posisi kartu panduan.
 *
 * Jaminan yang diberikan fungsi ini:
 *   1. Kotak kartu TIDAK BERTUMPUK dengan kotak target.
 *   2. Kartu tidak keluar dari tepi layar.
 *   3. Bila tidak ada ruang menyamping, kartu diletakkan di sisi vertikal yang
 *      paling lega dan tingginya DIBATASI pada ruang itu (isinya digulir),
 *      bukan ditinggikan sampai menembus target.
 */
export function hitungPosisiKartu(
  winW: number,
  winH: number,
  target: KotakTarget | null,
  penempatan: Penempatan,
): HasilPosisi {
  const isMobile = winW < 640;
  const edgePad = isMobile ? EDGE_MOBILE : EDGE_DESKTOP;

  // ── Langkah pembuka tanpa target: kartu di tengah layar ──
  if (!target) {
    return {
      containerClass:
        'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] sm:w-[86%] md:w-[70%] max-w-[420px]',
      containerStyle: {
        maxHeight: `${Math.min(winH - edgePad * 2, 460)}px`,
      },
    };
  }

  const spaceRight = Math.max(0, winW - target.right - edgePad);
  const spaceLeft = Math.max(0, target.left - edgePad);

  // ── 1. Penempatan menyamping ──
  // Ambang 860px (bukan 1150px) supaya iPad lanskap 1024px ikut memakai
  // penempatan samping, sehingga kartu berada DI SAMPING tombol.
  // 'center' diperlakukan sama seperti tidak menyebut sisi: kartu diletakkan
  // di sisi vertikal yang paling lega, bukan dipaksa ke tengah.
  const bolehSamping = winW >= LAYAR_MIN_SISI && penempatan !== 'center';
  const muatKanan = bolehSamping && spaceRight >= LEBAR_MIN_SISI && penempatan === 'right';
  const muatKiri = bolehSamping && spaceLeft >= LEBAR_MIN_SISI && penempatan === 'left';

  if (muatKanan || muatKiri) {
    const ruang = muatKanan ? spaceRight : spaceLeft;
    const lebarKartu = Math.min(LEBAR_MAKS_KARTU, ruang - 16);
    const tengahTarget = target.top + target.height / 2;

    // Tinggi dibatasi ruang yang tersedia; tidak pernah melebihi layar.
    const tinggiMaks = Math.max(TINGGI_MIN, winH - edgePad * 2);
    const topIdeal = tengahTarget - 140;
    const top = Math.max(edgePad, Math.min(topIdeal, winH - tinggiMaks - edgePad));
    const tinggi = Math.min(tinggiMaks, winH - top - edgePad);

    const left = muatKanan
      ? target.right + 14
      : Math.max(edgePad, target.left - lebarKartu - 14);

    return {
      containerClass: 'fixed',
      containerStyle: {
        left: `${left}px`,
        top: `${top}px`,
        width: `${lebarKartu}px`,
        maxHeight: `${Math.max(TINGGI_MIN, tinggi)}px`,
      },
    };
  }

  // ── 2. Penempatan vertikal ──
  const ruangBawah = Math.max(0, winH - (target.bottom + JARAK) - edgePad);
  const ruangAtas = Math.max(0, target.top - JARAK - edgePad);

  const mauDiBawah =
    penempatan === 'bottom' ? true : penempatan === 'top' ? false : ruangBawah >= ruangAtas;

  /*
    SISI YANG DIMINTA TIDAK SELALU TERSEDIA

    `placement: 'top'` berarti kartu DIMINTA di atas target. Bila target
    menempel di tepi atas layar, tidak ada ruang di atas sama sekali — dan
    kartu akan tergambar di luar layar (top bernilai NEGATIF).

    Karena itu sisi yang diminta hanya dipakai bila ruangnya mencukupi.
    Bila tidak, sisi seberangnya dipakai asalkan lebih lega.
  */
  const ruangDiminta = mauDiBawah ? ruangBawah : ruangAtas;
  const ruangLawan = mauDiBawah ? ruangAtas : ruangBawah;
  const pakaiBawah =
    ruangDiminta >= TINGGI_MIN
      ? mauDiBawah
      : ruangLawan > ruangDiminta
        ? !mauDiBawah
        : mauDiBawah;
  const ruang = pakaiBawah ? ruangBawah : ruangAtas;

  // KUNCI PERBAIKAN: tinggi dibatasi pada ruang sisi itu. Tidak ada lagi
  // `winH - edgePad*2` yang membuat kartu setinggi layar lalu menembus target.
  const tinggi = Math.min(winH - edgePad * 2, Math.max(TINGGI_MIN, ruang));

  return {
    containerClass: KELAS_TENGAH,
    containerStyle: {
      top: pakaiBawah ? `${target.bottom + JARAK}px` : undefined,
      bottom: pakaiBawah ? undefined : `${Math.max(edgePad, winH - target.top + JARAK)}px`,
      maxHeight: `${tinggi}px`,
    },
  };
}

/**
 * Menghitung kotak kartu dari hasil `hitungPosisiKartu`.
 *
 * Dipakai oleh pengujian untuk memastikan kartu tidak bertumpuk dengan target.
 * Lebar kartu diambil dari gaya `width` bila ada; bila tidak, dipakai
 * perkiraan berdasarkan lebar layar (persentase pada `containerClass`).
 */
export function kotakKartu(
  hasil: HasilPosisi,
  winW: number,
  winH: number,
  tinggiIsi: number,
): { top: number; bottom: number; left: number; right: number } {
  const gaya = hasil.containerStyle;
  const edgePad = winW < 640 ? EDGE_MOBILE : EDGE_DESKTOP;

  let lebar: number;
  if (typeof gaya.width === 'string' && gaya.width.endsWith('px')) {
    lebar = parseFloat(gaya.width);
  } else if (winW < 640) {
    lebar = winW * 0.92;
  } else if (winW < 768) {
    lebar = winW * 0.86;
  } else {
    lebar = Math.min(winW * 0.64, LEBAR_MAKS_KARTU);
  }

  let tinggi = Math.min(tinggiIsi, Number(String(gaya.maxHeight).replace('px', '')) || tinggiIsi);
  tinggi = Math.max(tinggi, Math.min(TINGGI_MIN, winH - edgePad * 2));

  let top: number;
  if (typeof gaya.top === 'string') {
    top = parseFloat(gaya.top);
  } else if (typeof gaya.bottom === 'string') {
    top = winH - parseFloat(gaya.bottom) - tinggi;
  } else {
    // Kartu tengah layar (langkah tanpa target).
    top = (winH - tinggi) / 2;
  }

  let left: number;
  if (typeof gaya.left === 'string') {
    left = parseFloat(gaya.left);
  } else {
    left = (winW - lebar) / 2;
  }

  return { top, bottom: top + tinggi, left, right: left + lebar };
}
