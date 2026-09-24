// ── src/app/Level2/index.tsx ─────────────────────────────────────────
// LEVEL 2: DISASTER ANALYST (Simulasi & Mitigasi Kebencanaan Geologis)
// Menampilkan petualangan eksplorasi 2D pixel art:
// Area 1: Mitigasi Gempa Bumi (Ruang Kelas SMP & Kesiapsiagaan 72 Jam)
// Area 2: Mitigasi Erupsi Vulkanik (Lereng Gunung Merapi & Status PVMBG)

import { Component, type ReactNode, type ErrorInfo } from 'react';
import TectonicGame from './engine/TectonicGame';
import { clearLevel2Progress } from './engine/gameEngine';
import PixelIcon from '../../components/PixelIcon';
import { useAuthStore } from '../../store/teacherStore';

interface ErrorBoundaryProps {
  children: ReactNode;
  activeUserId?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class Level2ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Level 2 Error Caught]', error, errorInfo);
  }

  handleResetAndReload = () => {
    clearLevel2Progress(this.props.activeUserId);
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 w-screen h-screen bg-[#1c1917] flex items-center justify-center p-6 text-amber-100 font-pixel z-50">
          <div className="max-w-md w-full bg-[#0f172a] border-4 border-rose-600 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 animate-pulse">
              <PixelIcon name="warning" size={26} className="text-rose-400" />
            </div>
            <h2 className="font-pixel-title text-sm sm:text-base text-rose-400 font-bold">
              GANGGUAN TRANSMISI GEOLOGIS
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Terjadi anomali saat memuat ekspedisi Level 2. Sistem keamanan Siaga telah menstabilkan layar.
            </p>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-left overflow-x-auto text-[10px] text-rose-300 font-mono">
              {this.state.error?.message || 'Unknown Error'}
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-amber-950 font-pixel-title text-xs font-bold shadow-md cursor-pointer active:translate-y-0.5"
              >
                MUAT ULANG
              </button>
              <button
                onClick={this.handleResetAndReload}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-pixel text-xs cursor-pointer active:translate-y-0.5"
              >
                RESET DATA
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-900/80 hover:bg-rose-800 text-rose-200 border border-rose-700 font-pixel text-xs cursor-pointer active:translate-y-0.5"
              >
                BERANDA
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function Level2() {
  const student = useAuthStore((state) => state.student);
  const currentUser = useAuthStore((state) => state.currentUser);
  const activeUserId = student?.id || currentUser?.id || currentUser?.username || 'guest';

  return (
    <Level2ErrorBoundary activeUserId={activeUserId}>
      <div className="fixed inset-0 w-screen h-screen select-none bg-[#1c1917] overflow-hidden font-pixel">
        <TectonicGame />
      </div>
    </Level2ErrorBoundary>
  );
}
