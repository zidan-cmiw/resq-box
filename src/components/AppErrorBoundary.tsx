// ── AppErrorBoundary.tsx ──────────────────────────────────────────────────
// Pelindung error tingkat APLIKASI.
//
// MENGAPA INI ADA
//   Sebelumnya hanya Level 2 dan Workspace yang punya ErrorBoundary. Kalau
//   Level 1, Dashboard, atau halaman lain melempar error, React akan
//   meng-unmount SELURUH pohon komponen dan siswa hanya melihat layar putih —
//   tanpa penjelasan dan tanpa jalan keluar.
//
//   Komponen ini menangkap error di mana pun, menampilkan pesan yang ramah,
//   memberi tombol pemulihan, dan melaporkannya ke lapisan monitoring.

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { reportError } from '../utils/monitoring';
import PixelIcon from '../components/PixelIcon';

interface Props {
  children: ReactNode;
  /** Nama area, dipakai sebagai label di laporan error. */
  label?: string;
}

interface State {
  error: Error | null;
  /** Diperbarui saat pengguna menekan "Coba Lagi" untuk mereset boundary. */
  resetKey: number;
}

/** Pola error yang biasanya hilang setelah muat ulang halaman. */
const RECOVERABLE_PATTERNS = [
  /chunk/i, // chunk lazy gagal dimuat (jaringan putus / setelah deploy baru)
  /dynamically imported module/i,
  /Loading chunk/i,
  /Importing a module script failed/i,
  /network/i,
  /Failed to fetch/i,
];

export default class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null, resetKey: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    reportError(error, {
      level: 'fatal',
      scope: `boundary:${this.props.label ?? 'app'}`,
      extra: {
        componentStack: errorInfo.componentStack ?? '',
      },
    });
  }

  private isRecoverable = (): boolean => {
    const msg = this.state.error?.message ?? '';
    return RECOVERABLE_PATTERNS.some((re) => re.test(msg));
  };

  private handleRetry = (): void => {
    // Reset boundary; render ulang anak-anaknya.
    this.setState((s) => ({ error: null, resetKey: s.resetKey + 1 }));
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleHome = (): void => {
    // Coba pulihkan tanpa memuat ulang seluruh halaman.
    this.setState((s) => ({ error: null, resetKey: s.resetKey + 1 }));
    if (window.location.pathname !== '/') {
      window.location.assign('/');
    }
  };

  render(): ReactNode {
    const { error } = this.state;
    if (!error) {
      // `key` memaksa React membangun ulang subtree saat "Coba Lagi" ditekan,
      // sehingga state yang rusak tidak terbawa.
      return <div key={this.state.resetKey} className="contents">{this.props.children}</div>;
    }

    const recoverable = this.isRecoverable();

    return (
      <div className="fixed inset-0 w-screen h-screen bg-[#1c1917] flex items-center justify-center p-4 sm:p-6 z-[9999] overflow-y-auto">
        <div className="pixel-wood-board max-w-lg w-full p-5 sm:p-7 text-[#3e1f07] text-center">
          <div className="flex justify-center mb-3">
            <PixelIcon name="warning" size={44} />
          </div>

          <h1 className="font-pixel-title text-[16px] sm:text-[17px] font-black mb-2 leading-snug">
            {recoverable ? 'KONEKSI TERPUTUS SEBENTAR' : 'ADA GANGGUAN TEKNIS'}
          </h1>

          <p className="font-pixel text-[14.5px] sm:text-[15px] leading-relaxed mb-4 opacity-90 font-semibold">
            {recoverable
              ? 'Aplikasi gagal memuat sebagian materi. Ini biasanya karena koneksi internet terputus atau ada pembaruan versi. Coba muat ulang halaman.'
              : 'Aplikasi mengalami gangguan. Progres belajarmu tetap tersimpan, jadi kamu tidak akan kehilangan nilai atau posisi.'}
          </p>

          {/* Detail teknis: ditampilkan agar guru bisa melaporkan, tapi ringkas. */}
          <details className="mb-4 text-left">
            <summary className="font-pixel text-[13.5px] cursor-pointer opacity-80 hover:opacity-100 font-semibold">
              Lihat detail teknis
            </summary>
            <pre className="mt-2 p-2 bg-[#fef3c7] rounded border-2 border-[#451a03]/30 text-[12.5px] leading-snug whitespace-pre-wrap break-words max-h-32 overflow-y-auto font-semibold">
              {error.message || 'Tanpa pesan'}
            </pre>
          </details>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={this.handleReload}
              className="pixel-btn-wood-plank w-full py-2.5 text-[14.5px] font-semibold"
            >
              MUAT ULANG HALAMAN
            </button>
            {!recoverable && (
              <button
                type="button"
                onClick={this.handleRetry}
                className="pixel-btn-wood-plank w-full py-2.5 text-[14.5px] font-semibold"
              >
                COBA LAGI
              </button>
            )}
            <button
              type="button"
              onClick={this.handleHome}
              className="pixel-btn-wood-plank w-full py-2.5 text-[14.5px] font-semibold"
            >
              KEMBALI KE MENU UTAMA
            </button>
          </div>

          <p className="mt-4 font-pixel text-[12.5px] opacity-70 leading-relaxed font-semibold">
            Bila masalah ini berulang, laporkan kepada gurumu dengan menyebutkan
            tulisan pada bagian &ldquo;detail teknis&rdquo; di atas.
          </p>
        </div>
      </div>
    );
  }
}
