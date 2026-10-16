// ── src/components/TombolTema.tsx ─────────────────────────────────────────
// SAKLAR MODE TERANG / MODE GELAP
//
// Dipasang di empat tempat supaya selalu dapat ditemukan tanpa mencari:
//   • bilah atas beranda (bentuk ikon, berdampingan dengan tombol suara)
//   • halaman Profil Siswa (bentuk baris, ada label lengkap)
//   • halaman Login (bentuk ikon di sudut kanan atas)
//   • Posko Guru (bentuk ikon di bilah kendali)
//
// DUA BENTUK
//   `kompak` — hanya ikon 40x40 px, untuk bilah atas yang sempit. Labelnya
//              tetap ada sebagai `aria-label` dan `title`, sehingga pembaca
//              layar serta tahanan tekan-lama di HP tetap mendapat keterangan.
//   `baris`  — ikon + label teks + keterangan keadaan. Dipakai di halaman
//              pengaturan, tempat pengguna memang sedang mengatur tampilan.
//
// UKURAN SENTUH
//   Keduanya minimal 40x40 px, memenuhi pedoman sasaran sentuh agar dapat
//   ditekan dengan jempol di HP. Tombol `kompak` pada bilah atas berukuran
//   40x40 px, sama dengan tombol suara dan layar penuh di sebelahnya.

import { retroAudio } from '../utils/retroAudio';
import { useTema, type Tema } from '../utils/tema';

interface TombolTemaProps {
  /** `kompak` = ikon saja, `baris` = ikon + label + keadaan. */
  bentuk?: 'kompak' | 'baris';
  /** Kelas tambahan dari halaman pemanggil. */
  className?: string;
  /** Dipanggil setelah tema berganti (mis. untuk memicu animasi). */
  onGanti?: (tema: Tema) => void;
}

/** Ikon matahari & bulan digambar sebagai SVG pixel agar seragam dengan ikon lain. */
function IkonMatahari({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} shapeRendering="crispEdges" aria-hidden="true" className="inline-block">
      <rect x="7" y="0" width="2" height="2" fill="currentColor" />
      <rect x="7" y="14" width="2" height="2" fill="currentColor" />
      <rect x="0" y="7" width="2" height="2" fill="currentColor" />
      <rect x="14" y="7" width="2" height="2" fill="currentColor" />
      <rect x="2" y="2" width="2" height="2" fill="currentColor" />
      <rect x="12" y="2" width="2" height="2" fill="currentColor" />
      <rect x="2" y="12" width="2" height="2" fill="currentColor" />
      <rect x="12" y="12" width="2" height="2" fill="currentColor" />
      <rect x="5" y="4" width="6" height="8" fill="currentColor" />
      <rect x="4" y="5" width="8" height="6" fill="currentColor" />
    </svg>
  );
}

function IkonBulan({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} shapeRendering="crispEdges" aria-hidden="true" className="inline-block">
      <rect x="6" y="1" width="5" height="1" fill="currentColor" />
      <rect x="4" y="2" width="6" height="2" fill="currentColor" />
      <rect x="3" y="4" width="5" height="8" fill="currentColor" />
      <rect x="4" y="12" width="6" height="2" fill="currentColor" />
      <rect x="6" y="14" width="5" height="1" fill="currentColor" />
      <rect x="9" y="4" width="3" height="8" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

export default function TombolTema({ bentuk = 'kompak', className = '', onGanti }: TombolTemaProps) {
  const { gelap, alihkanTema } = useTema();

  const label = gelap ? 'Mode Gelap aktif — tekan untuk Mode Terang' : 'Mode Terang aktif — tekan untuk Mode Gelap';

  const tekan = () => {
    retroAudio.playSelect();
    const berikutnya = alihkanTema();
    onGanti?.(berikutnya);
  };

  if (bentuk === 'baris') {
    return (
      <button
        type="button"
        onClick={tekan}
        onMouseEnter={() => retroAudio.playHover()}
        aria-label={label}
        title={label}
        className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl bg-chrome-raised hover:bg-surface-container-highest text-on-chrome border-2 border-chrome-border shadow-[0_3px_0_var(--shadow-ink)] transition-transform active:translate-y-0.5 cursor-pointer text-left ${className}`}
      >
        <span className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-accent-chip text-on-accent-chip border-2 border-ink flex items-center justify-center shrink-0">
            {gelap ? <IkonBulan size={18} /> : <IkonMatahari size={18} />}
          </span>
          <span className="flex flex-col">
            <span className="font-bold text-[15px] leading-tight">Tema Tampilan</span>
            <span className="text-[13px] text-on-surface-variant leading-tight">
              {gelap ? 'Mode Gelap' : 'Mode Terang'} • tekan untuk berganti
            </span>
          </span>
        </span>
        {/* Saklar bergaya 8-bit: jelas terlihat sedang di posisi mana */}
        <span
          className={`relative w-14 h-7 rounded-full border-2 border-ink shrink-0 transition-colors ${gelap ? 'bg-primary' : 'bg-surface-container-high'}`}
          aria-hidden="true"
        >
          <span
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-on-accent border-2 border-ink transition-all ${gelap ? 'left-7' : 'left-0.5'}`}
          />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={tekan}
      onMouseEnter={() => retroAudio.playHover()}
      aria-label={label}
      title={label}
      className={`w-10 h-10 rounded-lg border-2 border-chrome-border flex items-center justify-center transition-all cursor-pointer active:translate-y-0.5 ${
        gelap
          ? 'bg-chrome-raised text-primary shadow-[0_3px_0_var(--shadow-ink)]'
          : 'bg-accent-chip text-on-accent-chip shadow-[0_3px_0_var(--shadow-warning)]'
      } ${className}`}
    >
      {gelap ? <IkonBulan size={18} /> : <IkonMatahari size={18} />}
    </button>
  );
}
