// ── engine/draw/base.ts ───────────────────────────────────────────────────
// Fungsi gambar DASAR yang dipakai lintas tema di Level 2.
//
// MENGAPA DIPISAH
//   Keduanya dipanggil dari banyak modul tema:
//     • drawRoundedBadgeL2         — 9 pemanggil
//     • drawRealisticVolcanicSmoke — 7 pemanggil
//
//   Menempatkannya di sini membuat aturan ketergantungan menjadi jelas:
//   modul ini adalah LAPISAN PALING DASAR dan **tidak boleh mengimpor apa pun
//   dari modul tema** (classroom, volcano, assembly, merapi, facilities,
//   overlay). Tema boleh mengimpor dari sini, bukan sebaliknya. Tanpa aturan
//   ini, pemecahan berkas besar akan menghasilkan impor melingkar.
//
//   Kedua fungsi bersifat MURNI terhadap canvas: hanya memakai
//   CanvasRenderingContext2D dan argumennya, tanpa state modul. Karena itu
//   pemindahannya tidak mengubah perilaku sama sekali.

// ═══════════════════════════════════════════════════════════════════════════
// KARTU POPUP LEVEL 2 — SATU GAYA UNTUK SEMUA KARTU SIMULASI
// ═══════════════════════════════════════════════════════════════════════════
//
// MENGAPA SATU FUNGSI
//
//   Sebelumnya tiap kartu digambar oleh fungsinya sendiri dengan angka yang
//   diketik ulang di masing-masing tempat: ada yang memakai judul 20 px, 21,
//   22, 23, atau 26 px; tinggi kartu 136, 168, 192, 220 px; isian panel
//   `rgba(11,17,32,0.97)`, `rgba(10,16,30,0.96)`, `#0b1120`, atau `#064e3b`.
//   Akibatnya kartu-kartu yang muncul di layar yang sama terlihat berbeda
//   gaya, dan setiap kali sebuah teks bertambah panjang, teks itu meluber
//   keluar kartu karena ukurannya angka tetap.
//
//   Sekarang SELURUH kartu popup simulasi Level 2 digambar lewat
//   `gambarKartuL2()` di bawah ini. Yang membedakan satu kartu dari yang lain
//   hanyalah ISINYA (judul, baris, bilah) dan AKSEN warna maknanya — bukan
//   lagi ukuran, tata letak, atau susunannya.
//
// KARTU ACUAN (bentuk bakunya)
//
//   Kartu QTE gempa "GEMPA SEDANG! AMBIL TAS & EVAKUASI!" di `overlay.ts`.
//   Susunannya: judul tebal di tengah, bilah tombol aksi amber besar, lalu
//   bilah waktu. Semua angka pada `UKURAN_LEBAR` diambil dari kartu itu, jadi
//   kartu acuan tetap tampil sama:
//     • panel gelap `rgba(11, 17, 32, 0.97)` + bingkai 4 px + sudut retro
//     • judul    : 900 24 px, baseline 44 px dari tepi atas kartu
//     • baris    : mulai 64 px dari tepi atas kartu, bilah tombol tinggi 62 px
//     • bilah    : tinggi 30 px, jarak 16 px di bawah baris terakhir
//     • tepi     : 28 px kiri-kanan; lebar isi dibatasi 800 px
//
//   Satu-satunya angka yang berbeda dari kartu acuan: jarak bawah kartu 32 px
//   (dulu 48 px) supaya tinggi kartu yang isinya sedikit tidak menyisakan
//   ruang kosong besar. Tinggi kartu TIDAK LAGI angka tetap per kartu,
//   melainkan dihitung dari isinya.
//
// UKURAN FONT MENGIKUTI ISI
//
//   Ukuran font tiap teks dicari dengan `ukuranFontPasL2()`: dimulai dari
//   ukuran terbesar (angka gaya di bawah), lalu diturunkan 0,5 px sampai
//   teksnya muat di dalam kartu. Bila pada ukuran terkecil pun masih terlalu
//   panjang, teks dipecah menjadi dua baris (barisnya bertambah tinggi).
//   Inilah yang membuat "perbesar fontnya" tidak pernah membuat tulisan
//   keluar dari kartu.
//
// PEMAKAI
//   `overlay.ts` (3 kartu simulasi gempa) dan `locations.ts` (7 kartu
//   simulasi erupsi). Keduanya memanggil dengan `y` dari `atasKartuAmanL2()`
//   supaya kartu tidak pernah menutupi pita tracker progres.

/** Aksen warna kartu popup Level 2 (bukan sekadar hiasan: mengikuti maknanya). */
export type AksenKartuL2 = 'amber' | 'kuning' | 'oranye' | 'merah' | 'hijau';

/** Warna-warna satu kartu popup. */
export interface PaletKartuL2 {
  /** Bingkai kartu saat tidak berdenyut. */
  tepi: string;
  /** Bingkai kartu saat berdenyut (bergantian dengan `tepi`). */
  tepiDenyut: string;
  /** Aksen sudut retro di keempat pojok. */
  sudut: string;
  /** Warna teks judul. */
  judul: string;
}

/**
 * Palet kartu. `amber` adalah warna kartu acuan; sisanya adalah varian yang
 * sudah ada di kartu acuan (versi gempa besar) dan tingkat status PVMBG.
 */
export const PALET_KARTU_L2: Record<AksenKartuL2, PaletKartuL2> = {
  amber: { tepi: '#d97706', tepiDenyut: '#fde047', sudut: '#facc15', judul: '#fef08a' },
  kuning: { tepi: '#facc15', tepiDenyut: '#fde047', sudut: '#fde047', judul: '#fef08a' },
  oranye: { tepi: '#ea580c', tepiDenyut: '#fb923c', sudut: '#fb923c', judul: '#fed7aa' },
  merah: { tepi: '#dc2626', tepiDenyut: '#f87171', sudut: '#f87171', judul: '#fca5a5' },
  hijau: { tepi: '#059669', tepiDenyut: '#34d399', sudut: '#34d399', judul: '#6ee7b7' },
};

/** Isian panel gelap kartu (sama untuk semua kartu). */
export const ISI_PANEL_KARTU_L2 = 'rgba(11, 17, 32, 0.97)';

/** Jenis baris di dalam kartu. */
export type JenisBarisKartuL2 =
  | 'tombol' // bilah aksi amber besar ala kartu acuan (teks di tengah)
  | 'cek'    // baris daftar periksa (teks rata kiri di dalam kotaknya)
  | 'teks';  // baris keterangan biasa (tanpa kotak)

export interface BarisKartuL2 {
  teks: string;
  jenis: JenisBarisKartuL2;
  /** Warna teks; bawaan mengikuti jenisnya. */
  warnaTeks?: string;
  /** Isian kotak baris (warna atau gradien); bawaan mengikuti jenisnya. */
  isi?: string | CanvasGradient;
  /** Warna tepi kotak baris; bawaan mengikuti jenisnya. */
  tepi?: string;
}

export interface BilahKartuL2 {
  teks: string;
  /** 0..1 — panjang isian bilah. */
  progres: number;
  /** Warna/gradien isian bilah; bawaan hijau bila progres > 0,35, selain itu amber. */
  isi?: string | CanvasGradient;
}

export interface OpsiKartuL2 {
  /**
   * Tepi atas kartu dalam piksel KANVAS. Pemanggil WAJIB mengambilnya dari
   * `atasKartuAmanL2(ctx, ...)` agar kartu tidak menutupi pita tracker.
   */
  y: number;
  judul: string;
  /** Bawaan: `amber` (kartu acuan). */
  aksen?: AksenKartuL2;
  /** Menimpa warna judul dari palet (mis. judul bahaya tetap merah). */
  warnaJudul?: string;
  /** Bingkai berkedip bergantian tiap 15 tick, seperti kartu acuan. */
  berdenyut?: boolean;
  /** Tick animasi untuk kedipan bingkai. */
  tick?: number;
  baris?: BarisKartuL2[];
  bilah?: BilahKartuL2 | null;
}

export interface KotakKartuL2 {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Angka gaya kartu untuk layar lebar (>= 800 px). */
const UKURAN_LEBAR = {
  lebarMaksKartu: 860,
  tepiLayar: 24,
  padSamping: 28,
  padJudul: 14,
  lebarMaksBaris: 800,
  padDalamBaris: 16,
  tinggiJudul: 64,
  tengahJudul: 36,
  padBawah: 32,
  tinggiTombol: 62,
  tinggiCek: 38,
  tinggiTeks: 30,
  tinggiBilah: 30,
  jarakBaris: 12,
  jarakBilah: 16,
  tinggiBarisTambahan: 26,
  fontJudul: 24,
  fontJudulMin: 18,
  fontTombol: 22,
  fontCek: 18,
  fontTeks: 18,
  fontBilah: 16,
  fontBarisMin: 13,
  fontBilahMin: 11,
  sudutW: 13,
  sudutT: 4,
  tebalTepi: 4,
  tebalTepiBaris: 3.5,
} as const;

/** Angka gaya kartu untuk layar sempit (< 800 px). */
const UKURAN_SEMPIT = {
  lebarMaksKartu: 520,
  tepiLayar: 24,
  padSamping: 14,
  padJudul: 10,
  lebarMaksBaris: 800,
  padDalamBaris: 12,
  tinggiJudul: 48,
  tengahJudul: 26,
  padBawah: 24,
  tinggiTombol: 48,
  tinggiCek: 32,
  tinggiTeks: 24,
  tinggiBilah: 24,
  jarakBaris: 8,
  jarakBilah: 10,
  tinggiBarisTambahan: 20,
  fontJudul: 16,
  fontJudulMin: 12,
  fontTombol: 15,
  fontCek: 15,
  fontTeks: 14,
  fontBilah: 12,
  fontBarisMin: 11,
  fontBilahMin: 9,
  sudutW: 10,
  sudutT: 3,
  tebalTepi: 3,
  tebalTepiBaris: 2.5,
} as const;

/** Baris yang sudah dihitung: ukuran font, potongan teks, dan tingginya. */
interface BarisTerhitung {
  baris: BarisKartuL2;
  font: number;
  potongan: string[];
  tinggi: number;
}

/** Tebal huruf seluruh kartu popup Level 2. */
const BOBOT_FONT_KARTU_L2 = 900;

function fontKartuL2(ukuran: number): string {
  return `${BOBOT_FONT_KARTU_L2} ${ukuran}px "Plus Jakarta Sans", sans-serif`;
}

/**
 * Lebar teks yang sudah diukur, disimpan per (ukuran font, teks).
 *
 * MENGAPA DISIMPAN
 *   Pencarian ukuran font memanggil `measureText` berpuluh kali, dan kartu
 *   digambar 60 kali per detik. Tanpa simpanan, pekerjaan itu diulang setiap
 *   bingkai untuk teks yang sama persis.
 *
 *   Simpanan DIKOSONGKAN setelah font web selesai dimuat (`document.fonts`),
 *   karena lebar teks yang diukur sebelum font selesai dimuat dihitung dengan
 *   font cadangan — angkanya berbeda setelah font aslinya siap.
 */
const simpananLebarTeksL2 = new Map<string, number>();

if (typeof document !== 'undefined' && document.fonts && typeof document.fonts.ready?.then === 'function') {
  document.fonts.ready.then(() => simpananLebarTeksL2.clear()).catch(() => { /* diabaikan: tanpa font web, ukuran memakai font cadangan */ });
}

/** Lebar `teks` pada ukuran font kartu (dengan simpanan di atas). */
function lebarTeksL2(ctx: CanvasRenderingContext2D, teks: string, ukuran: number): number {
  const kunci = `${ukuran}|${teks}`;
  const tersimpan = simpananLebarTeksL2.get(kunci);
  if (tersimpan !== undefined) return tersimpan;

  ctx.font = fontKartuL2(ukuran);
  const lebar = ctx.measureText(teks).width;
  if (simpananLebarTeksL2.size < 4000) simpananLebarTeksL2.set(kunci, lebar);
  return lebar;
}

/**
 * Ukuran font terbesar (mulai `maks`, turun 0,5 px) yang membuat `teks` muat
 * dalam `lebar`. Mengembalikan 0 bila bahkan `min` tidak muat.
 */
function ukuranFontPasL2(
  ctx: CanvasRenderingContext2D,
  teks: string,
  maks: number,
  min: number,
  lebar: number
): number {
  for (let f = maks; f > min; f -= 0.5) {
    if (lebarTeksL2(ctx, teks, f) <= lebar) return f;
  }
  return lebarTeksL2(ctx, teks, min) <= lebar ? min : 0;
}

/**
 * Pecah `teks` menjadi DUA baris pada spasi yang paling mendekati tengah,
 * dengan syarat kedua baris muat pada `ukuran` font yang diberikan.
 * Mengembalikan null bila tidak ada pecahan yang muat.
 */
function pecahDuaBarisL2(
  ctx: CanvasRenderingContext2D,
  teks: string,
  ukuran: number,
  lebar: number
): string[] | null {
  const kata = teks.split(' ');
  if (kata.length < 2) return null;

  let terbaik: string[] | null = null;
  let selisihTerbaik = Number.POSITIVE_INFINITY;
  for (let i = 1; i < kata.length; i += 1) {
    const kiri = kata.slice(0, i).join(' ');
    const kanan = kata.slice(i).join(' ');
    const lebarKiri = lebarTeksL2(ctx, kiri, ukuran);
    const lebarKanan = lebarTeksL2(ctx, kanan, ukuran);
    if (lebarKiri <= lebar && lebarKanan <= lebar) {
      const selisih = Math.abs(lebarKiri - lebarKanan);
      if (selisih < selisihTerbaik) {
        selisihTerbaik = selisih;
        terbaik = [kiri, kanan];
      }
    }
  }
  return terbaik;
}

/**
 * Tentukan ukuran font + potongan baris untuk satu teks.
 *
 * Satu baris dipakai bila ukuran terbesarnya masih "besar" (>= `ambang` kali
 * ukuran gaya); kalau tidak, dua baris dipakai supaya hurufnya tetap besar dan
 * terbaca. Bila keduanya tidak muat, teks dibiarkan pada ukuran terkecil.
 *
 * `ambang` 0,75 dipakai untuk baris isi (lebih suka satu baris yang sedikit
 * lebih kecil), dan 0,9 untuk judul (lebih suka dua baris daripada mengecil).
 */
function pilihTeksBarisL2(
  ctx: CanvasRenderingContext2D,
  teks: string,
  maks: number,
  min: number,
  lebar: number,
  ambang: number = 0.75
): { font: number; potongan: string[] } {
  const muatSatuBaris = ukuranFontPasL2(ctx, teks, maks, 0, lebar);
  if (muatSatuBaris > 0 && muatSatuBaris >= maks * ambang) {
    return { font: muatSatuBaris, potongan: [teks] };
  }

  // Langkah 1 px (bukan 0,5 px) supaya pencarian dua baris tidak terlalu mahal.
  for (let f = maks; f >= min; f -= 1) {
    const potongan = pecahDuaBarisL2(ctx, teks, f, lebar);
    if (potongan) return { font: f, potongan };
  }

  return { font: Math.max(min, muatSatuBaris), potongan: [teks] };
}

/**
 * Gambar SATU kartu popup Level 2 dengan gaya baku (lihat penjelasan di atas).
 *
 * @returns kotak kartu yang benar-benar digambar, dalam piksel kanvas —
 *          dipakai pengukuran otomatis supaya tumpang tindih dengan pita
 *          tracker dapat diperiksa dengan angka, bukan perkiraan.
 */
export function gambarKartuL2(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  opsi: OpsiKartuL2
): KotakKartuL2 {
  const U = viewW < 800 ? UKURAN_SEMPIT : UKURAN_LEBAR;
  const palet = PALET_KARTU_L2[opsi.aksen ?? 'amber'];
  const baris = opsi.baris ?? [];

  const w = Math.min(viewW - U.tepiLayar, U.lebarMaksKartu);
  const x = Math.round((viewW - w) / 2);
  const y = Math.round(opsi.y);
  const lebarBaris = Math.min(w - U.padSamping * 2, U.lebarMaksBaris);
  const lebarTeksBaris = lebarBaris - U.padDalamBaris * 2;
  const lebarJudul = w - U.padJudul * 2;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // ── 1. Hitung ukuran font & tinggi tiap baris DULU, supaya tinggi kartu
  //       dapat dihitung dari isinya (bukan angka tetap per kartu). ──
  // Judul pun mengikuti aturan yang sama: diutamakan satu baris, dan bila
  // kalimatnya panjang (judul fase di layar sempit), dipecah dua baris supaya
  // hurufnya tidak perlu mengecil sampai sulit dibaca.
  const judul = pilihTeksBarisL2(ctx, opsi.judul, U.fontJudul, U.fontJudulMin, lebarJudul, 0.9);
  const fontJudul = judul.font;
  const tinggiJudul = U.tinggiJudul + (judul.potongan.length - 1) * U.tinggiBarisTambahan;

  const terhitung: BarisTerhitung[] = [];
  // Baris 'cek' memakai SATU ukuran font yang sama supaya daftar periksa
  // tidak terlihat naik-turun ukurannya antar baris.
  const barisCek = baris.filter((b) => b.jenis === 'cek');
  let fontCek: number = U.fontCek;
  for (const b of barisCek) {
    const pas = ukuranFontPasL2(ctx, b.teks, U.fontCek, U.fontBarisMin, lebarTeksBaris);
    fontCek = Math.min(fontCek, pas > 0 ? pas : U.fontBarisMin);
  }

  for (const b of baris) {
    let font: number;
    let potongan: string[];
    if (b.jenis === 'cek') {
      potongan = lebarTeksL2(ctx, b.teks, fontCek) <= lebarTeksBaris
        ? [b.teks]
        : (pecahDuaBarisL2(ctx, b.teks, fontCek, lebarTeksBaris) ?? [b.teks]);
      font = fontCek;
    } else {
      const maks = b.jenis === 'tombol' ? U.fontTombol : U.fontTeks;
      const dipilih = pilihTeksBarisL2(ctx, b.teks, maks, U.fontBarisMin, lebarTeksBaris);
      font = dipilih.font;
      potongan = dipilih.potongan;
    }
    const tinggiDasar = b.jenis === 'tombol' ? U.tinggiTombol : b.jenis === 'cek' ? U.tinggiCek : U.tinggiTeks;
    terhitung.push({
      baris: b,
      font,
      potongan,
      tinggi: tinggiDasar + (potongan.length - 1) * U.tinggiBarisTambahan,
    });
  }

  const fontBilah = opsi.bilah
    ? ukuranFontPasL2(ctx, opsi.bilah.teks, U.fontBilah, U.fontBilahMin, lebarBaris - U.padDalamBaris) || U.fontBilahMin
    : U.fontBilah;

  // ── 2. Tata letak tegak: judul, lalu baris, lalu bilah. ──
  const tempatBaris: number[] = [];
  let kursor = y + tinggiJudul;
  for (let i = 0; i < terhitung.length; i += 1) {
    tempatBaris.push(kursor);
    kursor += terhitung[i].tinggi;
    const masihAdaLanjutan = i < terhitung.length - 1 || !!opsi.bilah;
    if (masihAdaLanjutan) kursor += (i === terhitung.length - 1 && opsi.bilah) ? U.jarakBilah : U.jarakBaris;
  }
  let bilahY = 0;
  if (opsi.bilah) {
    bilahY = kursor;
    kursor += U.tinggiBilah;
  }
  const h = Math.round(kursor + U.padBawah - y);

  // ── 3. Panel gelap + bingkai + sudut retro (sama untuk semua kartu). ──
  ctx.fillStyle = ISI_PANEL_KARTU_L2;
  ctx.fillRect(x, y, w, h);

  const berdenyut = !!opsi.berdenyut && Math.floor((opsi.tick ?? 0) / 15) % 2 === 0;
  ctx.strokeStyle = berdenyut ? palet.tepiDenyut : palet.tepi;
  ctx.lineWidth = U.tebalTepi;
  ctx.strokeRect(x, y, w, h);

  const sW = U.sudutW;
  const sT = U.sudutT;
  ctx.fillStyle = palet.sudut;
  ctx.fillRect(x + 4, y + 4, sW, sT);
  ctx.fillRect(x + 4, y + 4, sT, sW);
  ctx.fillRect(x + w - 4 - sW, y + 4, sW, sT);
  ctx.fillRect(x + w - 4 - sT, y + 4, sT, sW);
  ctx.fillRect(x + 4, y + h - 4 - sT, sW, sT);
  ctx.fillRect(x + 4, y + h - 4 - sW, sT, sW);
  ctx.fillRect(x + w - 4 - sW, y + h - 4 - sT, sW, sT);
  ctx.fillRect(x + w - 4 - sT, y + h - 4 - sW, sT, sW);

  // ── 4. Judul (boleh dua baris bila kalimatnya panjang). ──
  ctx.font = fontKartuL2(fontJudul);
  ctx.fillStyle = opsi.warnaJudul ?? palet.judul;
  for (let p = 0; p < judul.potongan.length; p += 1) {
    ctx.fillText(judul.potongan[p], x + w / 2, y + U.tengahJudul + p * U.tinggiBarisTambahan);
  }

  // ── 5. Baris isi. ──
  for (let i = 0; i < terhitung.length; i += 1) {
    const t = terhitung[i];
    const barisY = tempatBaris[i];
    const tengahY = barisY + t.tinggi / 2;
    const garisPertamaY = tengahY - ((t.potongan.length - 1) * U.tinggiBarisTambahan) / 2;

    if (t.baris.jenis !== 'teks') {
      const bawaan =
        t.baris.jenis === 'tombol'
          ? { isi: '#d97706', tepi: '#fef08a', teks: '#ffffff', tebal: U.tebalTepiBaris }
          : { isi: 'rgba(249, 115, 22, 0.22)', tepi: '#f97316', teks: '#fef08a', tebal: 2 };
      ctx.fillStyle = t.baris.isi ?? bawaan.isi;
      ctx.fillRect(x + (w - lebarBaris) / 2, barisY, lebarBaris, t.tinggi);
      ctx.strokeStyle = t.baris.tepi ?? bawaan.tepi;
      ctx.lineWidth = bawaan.tebal;
      ctx.strokeRect(x + (w - lebarBaris) / 2, barisY, lebarBaris, t.tinggi);
      ctx.fillStyle = t.baris.warnaTeks ?? bawaan.teks;
    } else {
      ctx.fillStyle = t.baris.warnaTeks ?? '#e2e8f0';
    }

    ctx.font = fontKartuL2(t.font);
    if (t.baris.jenis === 'cek') {
      // Daftar periksa dibaca rata kiri supaya mudah dibandingkan antar baris.
      ctx.textAlign = 'left';
      for (let p = 0; p < t.potongan.length; p += 1) {
        ctx.fillText(
          t.potongan[p],
          x + (w - lebarBaris) / 2 + U.padDalamBaris,
          garisPertamaY + p * U.tinggiBarisTambahan
        );
      }
      ctx.textAlign = 'center';
    } else {
      for (let p = 0; p < t.potongan.length; p += 1) {
        ctx.fillText(t.potongan[p], x + w / 2, garisPertamaY + p * U.tinggiBarisTambahan);
      }
    }
  }

  // ── 6. Bilah (waktu / jarak) beserta teksnya. ──
  if (opsi.bilah) {
    const progres = Math.max(0, Math.min(1, opsi.bilah.progres));
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + (w - lebarBaris) / 2, bilahY, lebarBaris, U.tinggiBilah);
    ctx.fillStyle = opsi.bilah.isi ?? (progres > 0.35 ? '#10b981' : '#f59e0b');
    ctx.fillRect(x + (w - lebarBaris) / 2, bilahY, lebarBaris * progres, U.tinggiBilah);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + (w - lebarBaris) / 2, bilahY, lebarBaris, U.tinggiBilah);

    ctx.font = fontKartuL2(fontBilah);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(opsi.bilah.teks, x + w / 2, bilahY + U.tinggiBilah / 2);
  }

  ctx.restore();
  return { x, y, w, h };
}

/**
 * Gambar kotak bersudut tumpul dengan isian dan garis tepi opsional.
 *
 * Memakai `ctx.roundRect` bila peramban mendukungnya (Chrome 99+, Safari 16+),
 * dan jatuh ke kotak bersiku tajam bila tidak — sehingga tampilan tetap benar
 * di peramban sekolah yang lebih tua.
 */
export function drawRoundedBadgeL2(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string | CanvasGradient,
  stroke?: string | CanvasGradient,
  strokeWidth: number = 1
): void {
  ctx.save();
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Gambar kepulan asap/uap vulkanik organik dari puncak gunung.
 *
 * Tiga mode tampilan:
 *   - `white_steam`           uap solfatara putih (kondisi tenang)
 *   - `dark_ash`              gumpalan abu silika gelap + pendaran bara magma
 *   - `post_eruption_distant` abu andesit pasca-erupsi di kejauhan (pudar)
 *
 * Gumpalan dibentuk dari poligon harmonik 10 titik yang bergelombang
 * (harmonic perturbed polygon) dengan gradien radial bertingkat, BUKAN
 * lingkaran kaku bergaris tepi. Ini yang membuat bentuknya terlihat seperti
 * awan cumuliform alami.
 *
 * @param isDarkAsh mode; juga menerima boolean untuk kompatibilitas
 *                  (`true` = abu gelap, `false` = uap putih)
 * @param scale     pengali ukuran keseluruhan (mis. 0.5 untuk gunung kecil)
 */
export function drawRealisticVolcanicSmoke(
  ctx: CanvasRenderingContext2D,
  summitX: number,
  summitY: number,
  animTick: number,
  isDarkAsh: boolean | 'dark_ash' | 'white_steam' | 'post_eruption_distant' = false,
  scale: number = 1.0
): void {
  const mode = typeof isDarkAsh === 'string'
    ? isDarkAsh
    : isDarkAsh ? 'dark_ash' : 'white_steam';

  ctx.save();
  const isPost = mode === 'post_eruption_distant';
  const isDark = mode === 'dark_ash' || isPost;
  const puffCount = isPost ? 20 : isDark ? 26 : 16;
  const maxRise = (isPost ? 115 : isDark ? 165 : 95) * scale;
  const windDrift = (isPost ? 46 : isDark ? 62 : 36) * scale;

  for (let i = 0; i < puffCount; i++) {
    // Progres naik dari 0 (kawah) sampai 1 (udara tinggi)
    const speed = isPost ? 0.0038 : isDark ? 0.0055 : 0.0048;
    const progress = ((animTick * speed + i / puffCount) % 1);

    // Meliuk alami tertiup angin lereng gunung (turbulensi fluida non-linear)
    const sway = Math.sin(animTick * 0.022 + i * 1.35) * (7 + progress * 22) * scale;
    const px = summitX + progress * windDrift + sway;
    const py = summitY - progress * maxRise;

    // Radius mengembang bertahap saat naik karena penurunan tekanan udara
    const baseR = (isPost ? 6 : isDark ? 10 : 8) * scale;
    const expandR = (isPost ? 28 : isDark ? 44 : 26) * scale;
    const r = baseR + progress * expandR;

    // Transparansi memudar di puncak plume (Gaussian falloff envelope)
    let alpha: number;
    if (progress < 0.12) {
      alpha = (progress / 0.12) * (isPost ? 0.75 : isDark ? 0.9 : 0.65);
    } else {
      alpha = Math.max(0, Math.pow(1 - progress, 1.25) * (isPost ? 0.75 : isDark ? 0.9 : 0.65));
    }
    if (alpha <= 0.01) continue;

    // Gambar gumpalan awan organik berlobus amorf (Cauliflower / Cumuliform Billow)
    // Menggunakan kontur poligon harmonik 10-titik bergelombang + multi-stop radial gradient
    // BUKAN lingkaran kaku dengan garis tepi!
    const lobeCount = isPost ? 5 : 6;
    const puffSeed = i * 3.14159;
    const rotSpeed = animTick * 0.012 * (i % 2 === 0 ? 1 : -1);

    for (let l = 0; l < lobeCount; l++) {
      const angle = (l / lobeCount) * Math.PI * 2 + rotSpeed + puffSeed;
      const dist = r * (0.34 + Math.sin(puffSeed + l * 2.1) * 0.12);
      const lx = px + Math.cos(angle) * dist;
      const ly = py + Math.sin(angle) * dist * 0.78; // Sedikit pipih secara vertikal
      const lr = r * (0.55 + Math.sin(puffSeed * 1.4 + l) * 0.18);

      const radGrad = ctx.createRadialGradient(
        lx - lr * 0.28, ly - lr * 0.28, lr * 0.05,
        lx, ly, lr
      );

      if (isDark) {
        if (progress < 0.18 && l % 2 === 0 && !isPost) {
          // Pendaran bara magma / uap belerang membara dekat mulut kawah
          radGrad.addColorStop(0, `rgba(251, 146, 60, ${alpha * 0.85})`);
          radGrad.addColorStop(0.35, `rgba(194, 65, 12, ${alpha * 0.6})`);
          radGrad.addColorStop(0.7, `rgba(67, 20, 7, ${alpha * 0.3})`);
          radGrad.addColorStop(1, 'rgba(30, 20, 15, 0)');
        } else if (isPost) {
          // Asap abu pasca erupsi di kejauhan (warna andesit & slate lembut pudar)
          radGrad.addColorStop(0, `rgba(100, 116, 139, ${alpha * 0.88})`);
          radGrad.addColorStop(0.35, `rgba(71, 85, 105, ${alpha * 0.72})`);
          radGrad.addColorStop(0.7, `rgba(51, 65, 85, ${alpha * 0.42})`);
          radGrad.addColorStop(0.9, `rgba(30, 41, 59, ${alpha * 0.15})`);
          radGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        } else {
          // Gumpalan abu silika gelap & jelaga andesit pekat
          radGrad.addColorStop(0, `rgba(120, 113, 108, ${alpha * 0.95})`);
          radGrad.addColorStop(0.3, `rgba(68, 64, 60, ${alpha * 0.85})`);
          radGrad.addColorStop(0.65, `rgba(41, 37, 36, ${alpha * 0.6})`);
          radGrad.addColorStop(0.88, `rgba(28, 25, 23, ${alpha * 0.25})`);
          radGrad.addColorStop(1, 'rgba(12, 10, 9, 0)');
        }
      } else {
        // Kepulan Uap Solfatara Putih Halus Alami (Tenang)
        radGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.92})`);
        radGrad.addColorStop(0.35, `rgba(241, 245, 249, ${alpha * 0.75})`);
        radGrad.addColorStop(0.7, `rgba(203, 213, 225, ${alpha * 0.4})`);
        radGrad.addColorStop(0.9, `rgba(203, 213, 225, ${alpha * 0.15})`);
        radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }

      ctx.fillStyle = radGrad;
      // Kontur organik amorf bergelombang (Harmonic Perturbed Polygon)
      ctx.beginPath();
      const numPts = 10;
      for (let p = 0; p <= numPts; p++) {
        const theta = (p / numPts) * Math.PI * 2;
        const pert = 1 + 0.22 * Math.sin(theta * 3 + puffSeed + l)
          + 0.12 * Math.cos(theta * 4 - puffSeed);
        const ptX = lx + Math.cos(theta) * lr * pert;
        const ptY = ly + Math.sin(theta) * lr * pert * 0.85;
        if (p === 0) ctx.moveTo(ptX, ptY);
        else ctx.lineTo(ptX, ptY);
      }
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
}
