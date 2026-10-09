import PixelIcon from '../../../components/PixelIcon';

/**
 * Keterangan gerak lempeng untuk zona batas lempeng.
 *
 * MENGAPA KOMPONEN INI ADA
 *   Di area Batas Divergen, Konvergen, dan Transform, mesin menampilkan animasi
 *   lempeng yang bergerak. Tanpa keterangan, siswa hanya melihat gambar
 *   bergerak tanpa tahu apa yang sedang terjadi — padahal inti materi ada di
 *   situ: lempeng menjauh, lempeng menunjam, atau lempeng bergeser mendatar.
 *
 *   Keterangan ini muncul sebagai satu bilah di atas area animasi, sehingga
 *   siswa dapat membaca "lempeng tektonik sedang menjauh" sambil melihat
 *   lempengnya benar-benar menjauh. Tiga hal ditampilkan sekaligus:
 *
 *     1. Apa yang sedang terjadi  -> "LEMPENG SEDANG MENJAUH"
 *     2. Akibatnya               -> "Lava naik mengisi celah, membentuk kerak baru"
 *     3. Nama jenis batasnya     -> "BATAS DIVERGEN (SALING MENJAUH)"
 *
 *   Sengaja ditaruh di atas, bukan di bawah: bagian tengah-bawah layar dipakai
 *   animasi lempeng dan kartu ajakan berinteraksi, jadi keterangan di sana
 *   akan saling menutupi.
 *
 * Warna mengikuti konvensi yang sudah dipakai aplikasi:
 *   oranye = divergen (panas, magma naik)
 *   merah  = konvergen (tabrakan, subduksi)
 *   biru   = transform (sesar mendatar, tenang)
 */

export interface PlateBoundaryStatusProps {
  /** Indeks zona: 5 = Divergen, 6 = Konvergen, 7 = Transform. */
  zoneIndex: number;
}

interface Keterangan {
  judul: string;
  akibat: string;
  jenis: string;
  ikon: string;
  /** Kelas Tailwind untuk warna batas: border, teks, dan latar. */
  warnaBatas: string;
  warnaTeks: string;
  warnaJudul: string;
}

const KETERANGAN: Record<number, Keterangan> = {
  5: {
    judul: 'LEMPENG SEDANG MENJAUH',
    akibat: 'Magma naik mengisi celah, membentuk kerak samudra baru.',
    jenis: 'BATAS DIVERGEN',
    ikon: 'fire',
    warnaBatas: 'border-orange-400/90',
    warnaTeks: 'text-orange-100',
    warnaJudul: 'text-orange-300',
  },
  6: {
    judul: 'LEMPENG SEDANG BERTUMBUKAN',
    akibat: 'Lempeng samudra menunjam ke bawah lempeng benua — memicu gempa dan gunung api.',
    jenis: 'BATAS KONVERGEN',
    ikon: 'alert',
    warnaBatas: 'border-rose-400/90',
    warnaTeks: 'text-rose-100',
    warnaJudul: 'text-rose-300',
  },
  7: {
    judul: 'LEMPENG SEDANG BERGESER',
    akibat: 'Kedua lempeng bergeser berdampingan secara mendatar — inilah sesar mendatar.',
    jenis: 'BATAS TRANSFORM',
    ikon: 'broadcast',
    warnaBatas: 'border-sky-400/90',
    warnaTeks: 'text-sky-100',
    warnaJudul: 'text-sky-300',
  },
};

export default function PlateBoundaryStatus({ zoneIndex }: PlateBoundaryStatusProps) {
  const k = KETERANGAN[zoneIndex];
  // Hanya muncul di zona batas lempeng. Di zona lain komponen ini tidak
  // merender apa pun, sehingga tidak mengganggu tampilan zona biasa.
  if (!k) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`bg-slate-950/92 backdrop-blur-md border-2 ${k.warnaBatas} rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 shadow-[0_5px_0_rgba(0,0,0,0.55)] select-none pointer-events-none`}
    >
      <div className="flex items-center justify-center gap-2">
        <PixelIcon name={k.ikon} size={15} className={`${k.warnaJudul} shrink-0 animate-pulse`} />
        <span
          className={`font-pixel-title text-[12.5px] sm:text-[14px] ${k.warnaJudul} font-black tracking-wide text-center leading-tight`}
        >
          {k.judul}
        </span>
      </div>

      <p
        className={`mt-1 font-pixel text-[12.5px] sm:text-[13.5px] ${k.warnaTeks} font-bold text-center leading-snug`}
      >
        {k.akibat}
      </p>

      <p
        className={`mt-1 font-pixel-title text-[11px] sm:text-[12px] ${k.warnaJudul} font-bold text-center opacity-90 tracking-wider`}
      >
        {k.jenis}
      </p>
    </div>
  );
}
