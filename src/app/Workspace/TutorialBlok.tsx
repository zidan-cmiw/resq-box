import { useCallback, useEffect, useRef, useState } from 'react';
import type * as Blockly from 'blockly/core';
import PixelIcon from '../../components/PixelIcon';
import { isTutorialCompleted } from '../../components/Tutorial/tutorialConfig';

/**
 * TUTORIAL BLOK BERPANAH — SEKALI SAJA DI AWAL LEVEL 3.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA TUTORIAL INI ADA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Sebelum ini, siswa yang baru pertama kali membuka Action Lab langsung
 *   dihadapkan pada kanvas Blockly kosong dengan panduan tertulis di panel
 *   kiri. Panduan itu menjelaskan APA yang harus diambil, tetapi tidak
 *   MENUNJUKKAN di mana bloknya berada dan ke mana harus diseret. Akibatnya
 *   banyak siswa berhenti di langkah pertama.
 *
 *   Tutorial ini meniru cara game (mis. Clash of Clans) mengajari pemain baru:
 *   satu langkah kecil, satu panah yang menunjuk, satu penjelasan singkat —
 *   dan siswa benar-benar MELAKUKAN tindakannya, bukan hanya membacanya.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * CARA PANAH MENEMPEL PADA BLOK YANG BENAR
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Panah TIDAK diletakkan pada koordinat tebakan. Blok Blockly memiliki
 *   elemen SVG sendiri (`block.getSvgRoot()`), sehingga posisi aslinya di layar
 *   dapat dibaca langsung dengan `getBoundingClientRect()`.
 *
 *   Karena siswa dapat menggeser (pan) dan memperbesar (zoom) kanvas, posisi
 *   itu dibaca ulang setiap frame selama tutorial aktif — sehingga panah selalu
 *   mengikuti blok yang ditunjuk, tidak tertinggal di tempat lama.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * LANGKAHNYA SENGAJA MEMAKAI BLOK YANG PALING MUDAH
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Blok yang dilatih adalah "Atur Lampu Status" (Kategori Peringatan & EWS) —
 *   blok paling sederhana yang ada di toolbox dan dipakai oleh misi pertama.
 *   Tujuannya hanya satu: siswa berhasil memindahkan satu blok ke dalam blok
 *   "Sistem Mitigasi" dan memahami mengapa blok itu harus berada di dalamnya.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * HANYA SEKALI
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Penanda "sudah pernah" disimpan per akun siswa di localStorage
 *   (`resqbox_tutorial_blok_<userId>`), jadi tutorial tidak muncul lagi di
 *   kunjungan berikutnya. Siswa tetap dapat memanggil ulang panduan lewat
 *   tombol Panduan Resqy yang sudah ada.
 */

const BLOCK_PROGRAM = 'resq_program';
const BLOCK_LAMPU = 'resq_lampu_status';

const kunciPenyimpanan = (userId: string) => `resqbox_tutorial_blok_${userId}`;

/** Apakah siswa ini sudah pernah menuntaskan tutorial blok? */
function sudahMenuntaskanTutorialBlok(userId: string): boolean {
  try {
    return localStorage.getItem(kunciPenyimpanan(userId)) === '1';
  } catch {
    // localStorage tidak tersedia — anggap belum, supaya tutorial tetap tampil.
    return false;
  }
}

function tandaiTutorialSelesai(userId: string): void {
  try {
    localStorage.setItem(kunciPenyimpanan(userId), '1');
  } catch {
    // Tidak dapat disimpan — tutorial akan muncul lagi lain kali. Bukan masalah.
  }
}

/**
 * Boleh mulai hanya bila DUA syarat terpenuhi:
 *
 *   1. Tutorial blok ini belum pernah dituntaskan akun ini, DAN
 *   2. Panduan Resqy untuk halaman Workspace sudah dituntaskan lebih dulu.
 *
 * Syarat kedua penting: kalau keduanya muncul bersamaan, siswa melihat DUA
 * lapisan panduan sekaligus dan tidak tahu mana yang harus diikuti. Urutan yang
 * benar adalah: kenali halaman dulu (Panduan Resqy), baru berlatih bloknya.
 */
function bolehMulai(userId: string): boolean {
  if (sudahMenuntaskanTutorialBlok(userId)) return false;
  return isTutorialCompleted('workspace', userId);
}

interface Kotak {
  x: number;
  y: number;
  lebar: number;
  tinggi: number;
}

interface Langkah {
  judul: string;
  teks: string;
  /** Panah menunjuk ke blok ini, atau ke panel toolbox di kiri kanvas. */
  tunjuk: 'program' | 'toolbox' | 'lampu';
  /** Teks tombol; bila kosong, langkah maju sendiri setelah aksinya dilakukan. */
  tombol?: string;
}

const LANGKAH: Langkah[] = [
  {
    judul: 'Selamat datang di Action Lab!',
    teks: 'Semua rangkaian blokmu dimulai dari blok besar ini: "Sistem Mitigasi". Blok apa pun yang kamu susun harus dimasukkan KE DALAMNYA, supaya bisa dijalankan.',
    tunjuk: 'program',
    tombol: 'Mengerti',
  },
  {
    judul: 'Ambil satu blok dari toolbox',
    teks: 'Buka kategori "Peringatan & EWS" di panel kiri (ikon tosca), lalu seret blok "Atur Lampu Status" ke kanvas.',
    tunjuk: 'toolbox',
  },
  {
    judul: 'Masukkan blok itu ke dalam Sistem Mitigasi',
    teks: 'Sekarang seret blok "Atur Lampu Status" tadi KE DALAM bagian "Mulai Saat Dihidupkan" pada blok Sistem Mitigasi. Perhatikan panahnya berpindah ke sana.',
    tunjuk: 'program',
  },
  {
    judul: 'Berhasil! Ini artinya',
    teks: 'Blok yang berada DI DALAM "Mulai Saat Dihidupkan" akan dijalankan sekali saat simulasi dimulai. Blok lampu tadi akan menyalakan lampu indikator status — itulah cara warga desa tahu kondisi saat ini. Tekan "MULAI" kapan saja untuk mencobanya.',
    tunjuk: 'lampu',
    tombol: 'Selesai',
  },
];

interface Props {
  /** Instance workspace Blockly; null selama belum siap. */
  workspace: Blockly.WorkspaceSvg | null;
  userId: string;
  /** Dipanggil setelah siswa menuntaskan tutorial. */
  onSelesai?: () => void;
}

export default function TutorialBlok({ workspace, userId, onSelesai }: Props) {
  const [aktif, setAktif] = useState(() => bolehMulai(userId));
  const [tahap, setTahap] = useState(0);
  const [kotak, setKotak] = useState<Kotak | null>(null);
  const wadahRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const langkah = LANGKAH[tahap];

  // Catatan: TIDAK ada efek yang menyetel ulang keadaan saat `userId` berganti.
  // Penggantian akun ditangani dengan memberi `key={userId}` pada komponen ini
  // di `BlocklyComponent`, sehingga React memasang ulang komponennya dan
  // `useState` di atas terinisialisasi dari awal. Cara itu lebih sederhana dan
  // tidak memicu penyetelan state di dalam efek.

  const selesaikan = useCallback(() => {
    tandaiTutorialSelesai(userId);
    setAktif(false);
    onSelesai?.();
  }, [userId, onSelesai]);

  /**
   * Hitung posisi kotak yang ditunjuk, RELATIF terhadap wadah tutorial.
   *
   * Dibaca dari elemen SVG blok aslinya, bukan dari koordinat tebakan, supaya
   * panah tetap menempel walau kanvas digeser atau di-zoom.
   */
  const hitungKotak = useCallback((): Kotak | null => {
    const wadah = wadahRef.current;
    if (!wadah || !workspace) return null;

    const wadahRect = wadah.getBoundingClientRect();

    if (langkah.tunjuk === 'toolbox') {
      // Utamakan elemen toolbox yang BENAR-BENAR ada di DOM, supaya panahnya
      // menunjuk panel yang sesungguhnya - bukan kotak perkiraan.
      const elToolbox = document.querySelector('.blocklyToolboxDiv') as HTMLElement | null;
      if (elToolbox) {
        const r = elToolbox.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          return {
            x: r.left - wadahRect.left,
            y: r.top - wadahRect.top,
            lebar: r.width,
            tinggi: r.height,
          };
        }
      }

      // Cadangan bila toolbox tidak ditemukan: perkirakan dari lebar wadah.
      const lebar = Math.min(220, wadahRect.width * 0.32);
      return { x: 0, y: 0, lebar, tinggi: wadahRect.height };
    }

    const jenis = langkah.tunjuk === 'program' ? BLOCK_PROGRAM : BLOCK_LAMPU;
    const blok = workspace.getBlocksByType(jenis, false)[0];
    if (!blok) return null;

    // `getSvgRoot()` hanya ada pada blok yang benar-benar tampil di layar
    // (`BlockSvg`), bukan pada tipe `Block` dasar — jadi tipenya dipersempit
    // di sini. Blok dari workspace ini selalu dirender, jadi aman.
    const blokTampil = blok as unknown as Blockly.BlockSvg;
    const svgRoot = blokTampil.getSvgRoot() as unknown as Element | null;
    if (!svgRoot) return null;

    const r = svgRoot.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return null;

    return {
      x: r.left - wadahRect.left,
      y: r.top - wadahRect.top,
      lebar: r.width,
      tinggi: r.height,
    };
  }, [workspace, langkah]);

  // ── Ikuti posisi blok selama tutorial aktif (kanvas bisa di-pan / di-zoom) ──
  useEffect(() => {
    if (!aktif) return;

    const loop = () => {
      const k = hitungKotak();
      setKotak((lama) => {
        if (!k) return null;
        if (
          lama &&
          Math.abs(lama.x - k.x) < 0.5 &&
          Math.abs(lama.y - k.y) < 0.5 &&
          Math.abs(lama.lebar - k.lebar) < 0.5 &&
          Math.abs(lama.tinggi - k.tinggi) < 0.5
        ) {
          return lama; // tidak berubah — hindari render ulang tiap frame
        }
        return k;
      });
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [aktif, hitungKotak]);

  // ── Sorot blok yang sedang ditunjuk memakai API Blockly sendiri ─────────────
  useEffect(() => {
    if (!aktif || !workspace) return;

    const jenis =
      langkah.tunjuk === 'program' ? BLOCK_PROGRAM : langkah.tunjuk === 'lampu' ? BLOCK_LAMPU : null;
    if (!jenis) return;

    const blok = workspace.getBlocksByType(jenis, false)[0];
    if (!blok) return;

    workspace.highlightBlock(blok.id);
    return () => {
      try {
        workspace.highlightBlock(null);
      } catch {
        // Workspace sudah dibuang (halaman ditinggalkan) — abaikan.
      }
    };
  }, [aktif, workspace, langkah]);

  // ── Langkah maju OTOMATIS setelah siswa benar-benar melakukan aksinya ──────
  useEffect(() => {
    if (!aktif || !workspace) return;
    if (langkah.tombol) return; // langkah ini maju lewat tombol

    const periksa = () => {
      const lampu = workspace.getBlocksByType(BLOCK_LAMPU, false);

      if (tahap === 1) {
        // Berhasil bila blok lampu sudah ADA di kanvas (artinya ia membuka
        // kategori dan menyeretnya keluar).
        if (lampu.length > 0) setTahap(2);
        return;
      }

      if (tahap === 2) {
        // Berhasil bila blok lampu sudah TERSAMBUNG ke dalam blok program.
        const sudahMasuk = lampu.some((b) => {
          let induk = b.getParent();
          while (induk) {
            if (induk.type === BLOCK_PROGRAM) return true;
            induk = induk.getParent();
          }
          return false;
        });
        if (sudahMasuk) setTahap(3);
      }
    };

    periksa(); // periksa sekali saat langkah dibuka
    const pendengar = () => periksa();
    workspace.addChangeListener(pendengar);
    return () => workspace.removeChangeListener(pendengar);
  }, [aktif, workspace, tahap, langkah]);

  if (!aktif) return null;

  // Panah diletakkan di sisi kotak target.
  //
  // Untuk blok (program & lampu), panah ada di sisi KIRI kotak dan menunjuk ke
  // KANAN. Tetapi untuk panel toolbox, kotaknya menempel di tepi paling kiri
  // layar - sehingga panah di sisi kirinya jatuh DI LUAR layar dan tidak pernah
  // terlihat. Karena itu untuk toolbox panah diletakkan di sisi KANAN panel dan
  // menunjuk ke KIRI, tepat mengarah ke panelnya.
  const panahDiKiri = langkah.tunjuk !== 'toolbox';
  const panahKiri = kotak ? (panahDiKiri ? Math.max(0, kotak.x - 46) : kotak.x + kotak.lebar + 10) : 0;
  const panahAtas = kotak ? kotak.y + kotak.tinggi / 2 - 16 : 0;

  return (
    <div ref={wadahRef} className="absolute inset-0 z-[60] pointer-events-none">
      {/* Lubang sorot pada target.
          Peredupan seluruh layar dibuat oleh `boxShadow` raksasa pada elemen
          ini (bukan oleh lapisan gelap terpisah), supaya tidak ada dua
          peredupan yang saling menumpuk. Elemen ini punya
          `pointer-events: none` dari induknya, sehingga siswa TETAP dapat
          menyeret blok di kanvas yang berada di bawahnya — itulah inti
          tutorial ini. */}
      {kotak ? (
        <div
          className="absolute rounded-xl ring-4 ring-amber-400 transition-all duration-500 ease-out"
          style={{
            left: kotak.x - 6,
            top: kotak.y - 6,
            width: kotak.lebar + 12,
            height: kotak.tinggi + 12,
            boxShadow: '0 0 0 9999px rgba(15,23,42,0.62), 0 0 28px rgba(251,191,36,0.9)',
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-slate-950/62" />
      )}

      {/* Panah penunjuk — bergerak halus saat target berpindah */}
      {kotak && (
        <div
          className="absolute flex items-center transition-all duration-500 ease-out"
          style={{ left: panahKiri, top: panahAtas }}
        >
          <span className="text-3xl text-amber-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] animate-pulse">
            {panahDiKiri ? '➤' : '◀'}
          </span>
        </div>
      )}

      {/* Balon percakapan */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-3 w-[min(94vw,720px)] px-2 pointer-events-auto">
        <div className="bg-slate-950/97 border-2 border-amber-400 rounded-2xl px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
          <div className="flex items-start gap-3">
            <PixelIcon name="bulb" size={22} className="text-amber-300 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-pixel-title text-[13px] sm:text-[15px] text-amber-300 font-black tracking-wide">
                {langkah.judul}
              </p>
              <p className="mt-1 font-pixel text-[13px] sm:text-[14.5px] text-amber-50 leading-relaxed">
                {langkah.teks}
              </p>

              <div className="mt-2.5 flex items-center justify-between gap-3 flex-wrap">
                <span className="font-pixel text-[12.5px] text-amber-200/70 font-semibold">
                  Langkah {tahap + 1} dari {LANGKAH.length}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={selesaikan}
                    className="px-3 py-1.5 rounded-lg border-2 border-amber-700/60 bg-amber-950/60 text-amber-200 font-pixel text-[12.5px] font-bold hover:brightness-125 cursor-pointer"
                  >
                    Lewati tutorial
                  </button>
                  {langkah.tombol && (
                    <button
                      onClick={() => (tahap === LANGKAH.length - 1 ? selesaikan() : setTahap(tahap + 1))}
                      className="px-4 py-1.5 rounded-lg border-2 border-amber-300 bg-amber-400 text-slate-950 font-pixel text-[12.5px] font-black hover:brightness-110 cursor-pointer"
                    >
                      {langkah.tombol}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
