// ── src/app/Level2/SeismographModal.tsx ──────────────────────────────
// Modal Interaktif Pembelajaran Instrumen Seismograf & 4 Bentuk Gelombang Status Merapi
// Sesuai Arahan Pengguna:
// 1. SEMUA EMOTIKON/EMOJI DIHAPUS (Gunakan PixelIcon / tipografi retro bersih)
// 2. TULISAN MENUMPUK DI DIAGRAM DIPERBAIKI (Layout lapang, zero overlap, callout terpisah rapi)
// 3. BENTUK GELOMBANG DISESUAIKAN DENGAN SKETSA (Normal: landai renggang, Waspada: sedang berdenyut, Siaga: rapat frekuensi tinggi, Awas: tremor menerus sangat rapat tiada henti)

import { useState } from 'react';
import { retroAudio } from '../../utils/retroAudio';
import PixelIcon from '../../components/PixelIcon';

interface SeismographModalProps {
  onClose: () => void;
}

// ── GENERATOR BENTUK GELOMBANG IDENTIK DENGAN SKETSA GAMBAR 2 ─────────
// Row 1 (Normal): Gelombang sangat landai, tenang, renggang (3-4 puncak lembut)
// Row 2 (Waspada): Gelombang berdenyut sedang teratur (7-9 puncak sedang)
// Row 3 (Siaga): Gelombang rapat berfrekuensi tinggi (22-25 puncak cepat)
// Row 4 (Awas): Tremor menerus sangat rapat tiada henti (Continuous Tremor rapat)
function generateSeismoPath(width: number, height: number, level: 1 | 2 | 3 | 4): string {
  const midY = height / 2;
  const pts: string[] = [];

  if (level === 1) {
    // [I] Normal: Sangat landai, tenang, renggang
    const amp = height * 0.22;
    for (let x = 0; x <= width; x += 3) {
      const y = midY - Math.sin((x / width) * Math.PI * 7) * amp;
      pts.push(`${x === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
  } else if (level === 2) {
    // [II] Waspada: Gelombang berdenyut sedang teratur
    const baseAmp = height * 0.28;
    for (let x = 0; x <= width; x += 2.5) {
      const mod = 1 + 0.22 * Math.sin((x / width) * Math.PI * 2);
      const y = midY - Math.sin((x / width) * Math.PI * 16) * baseAmp * mod;
      pts.push(`${x === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
  } else if (level === 3) {
    // [III] Siaga: Gelombang rapat berfrekuensi tinggi
    const baseAmp = height * 0.35;
    for (let x = 0; x <= width; x += 2) {
      const mod = 1 + 0.18 * Math.sin((x / width) * Math.PI * 4);
      const y = midY - Math.sin((x / width) * Math.PI * 48) * baseAmp * mod;
      pts.push(`${x === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
  } else {
    // [IV] Awas: Tremor Menerus Sangat Rapat (Continuous Tremor)
    const amp = height * 0.42;
    let up = true;
    for (let x = 0; x <= width; x += 4.5) {
      const jitter = ((x * 17) % 9) - 4;
      const y = midY + (up ? -amp : amp) + jitter;
      pts.push(`${x === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
      up = !up;
    }
  }

  return pts.join(' ');
}

export default function SeismographModal({ onClose }: SeismographModalProps) {
  const [activeTab, setActiveTab] = useState<'waveforms' | 'comparison' | 'instrument'>('waveforms');
  const [activeStatusLvl, setActiveStatusLvl] = useState<1 | 2 | 3 | 4>(4);

  const statusWaveforms = [
    {
      lvl: 1 as const,
      code: 'I',
      name: 'NORMAL (LEVEL I)',
      short: 'NORMAL',
      color: '#22c55e',
      border: '#15803d',
      bgBadge: '#dcfce7',
      textBadge: '#166534',
      amplitude: '1 - 2 mm (Rendah & Tenang)',
      frequency: 'Sangat Renggang & Landai',
      waveType: 'Garis gelombang landai tenang berjarak sangat renggang',
      desc: 'Magma berada tenang di kedalaman mantel bumi tanpa pergerakan signifikan. Tidak ada desakan fluida vulkanik ke permukaan.',
      hazardNote: 'Zona lereng aman untuk seluruh aktivitas masyarakat (> 2 km dari kawah puncak).',
    },
    {
      lvl: 2 as const,
      code: 'II',
      name: 'WASPADA (LEVEL II)',
      short: 'WASPADA',
      color: '#eab308',
      border: '#a16207',
      bgBadge: '#fef9c3',
      textBadge: '#854d0e',
      amplitude: '5 - 10 mm (Sedang)',
      frequency: 'Mulai Muncul Berdenyut',
      waveType: 'Gelombang berdenyut teratur dengan frekuensi sedang',
      desc: 'Fluida magma mulai mendesak mencari celah rekahan batuan litosfer. Suhu kawah meningkat dan gempa vulkanik tercatat berkala.',
      hazardNote: 'Radius bahaya 2 - 3 km dari kawah puncak. Dilarang mendekati kawah aktif!',
    },
    {
      lvl: 3 as const,
      code: 'III',
      name: 'SIAGA (LEVEL III)',
      short: 'SIAGA',
      color: '#f97316',
      border: '#c2410c',
      bgBadge: '#ffedd5',
      textBadge: '#9a3412',
      amplitude: '15 - 25 mm (Tinggi)',
      frequency: 'Semakin Rapat & Frekuensi Naik',
      waveType: 'Gelombang rapat berfrekuensi tinggi & berdenyut cepat',
      desc: 'Magma mendesak kuat ke leher kawah dan membentuk kubah lava yang tumbuh sangat cepat. Struktur kubah labil dan rawan guguran lava pijar.',
      hazardNote: 'Radius bahaya 3 - 5 km. Posko evakuasi siaga penuh dan kelompok rentan diungsikan.',
    },
    {
      lvl: 4 as const,
      code: 'IV',
      name: 'AWAS (LEVEL IV)',
      short: 'AWAS',
      color: '#ef4444',
      border: '#991b1b',
      bgBadge: '#fee2e2',
      textBadge: '#991b1b',
      amplitude: '> 30 mm (Ekstrem / Overscale)',
      frequency: 'SANGAT RAPAT & KONTINU TANPA JEDA',
      waveType: 'Tremor Menerus Sangat Rapat & Padat Tiada Henti',
      desc: 'Gelombang getaran terekam SANGAT RAPAT dan TERUS MENERUS tanpa jeda (Continuous Tremor)! Ini tanda pasti magma mendobrak puncak kawah dan letusan utama berlangsung.',
      hazardNote: 'Letusan utama sedang atau berpeluang besar segera terjadi! Seluruh warga Kawasan Rawan Bencana III (KRB III) wajib segera evakuasi mandiri!',
    },
  ];

  const currentStatus = statusWaveforms.find((s) => s.lvl === activeStatusLvl) || statusWaveforms[3];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md select-none animate-fadeIn font-pixel">
      {/* Board Kontainer Bergaya Perkamen Retro */}
      <div className="relative w-full max-w-5xl xl:max-w-6xl bg-[#fef3c7] border-4 sm:border-[5px] border-[#451a03] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 shadow-[0_12px_0_#1c0d02] text-[#451a03] font-pixel max-h-[96vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b-3 border-[#78350f] pb-3 sm:pb-4 mb-3 sm:mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-700/20 border-2 border-orange-700 flex items-center justify-center shrink-0 shadow-inner">
              <PixelIcon name="volcano" size={24} className="text-orange-800" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#451a03] font-pixel-title font-bold tracking-wide">
                SEISMOGRAF &amp; 4 BENTUK GELOMBANG STATUS MERAPI
              </h2>
              <p className="text-[13px] sm:text-[15px] font-sans font-bold text-[#78350f] mt-0.5">
                Laboratorium Pos Pengamatan Gunung Api (PGA) PVMBG • Badan Geologi KESDM
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              retroAudio.playSelect();
              onClose();
            }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#b45309] hover:bg-[#92400e] text-amber-100 border-2 border-[#451a03] font-pixel-title text-[15px] sm:text-base flex items-center justify-center cursor-pointer active:translate-y-0.5 shadow-[0_3px_0_#451a03] shrink-0 transition-colors font-medium"
            title="Tutup"
          >
            <PixelIcon name="cross" size={18} />
          </button>
        </div>

        {/* Tab Navigasi Utama - Ikon Pixel Art (Pengganti Emoji OS) */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
          <button
            onClick={() => {
              retroAudio.playSelect();
              setActiveTab('waveforms');
            }}
            className={`px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl border-2 font-pixel-title text-[13px] sm:text-[15px] cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'waveforms'
                ? 'bg-orange-600 text-amber-50 border-orange-800 shadow-[0_3px_0_#7c2d12] font-bold'
                : 'bg-amber-200/80 text-[#78350f] border-amber-800/40 hover:bg-amber-200'
            }`}
          >
            <PixelIcon name="chart" size={16} />
            <span>4 BENTUK GELOMBANG STATUS</span>
          </button>
          <button
            onClick={() => {
              retroAudio.playSelect();
              setActiveTab('comparison');
            }}
            className={`px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl border-2 font-pixel-title text-[13px] sm:text-[15px] cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'comparison'
                ? 'bg-orange-600 text-amber-50 border-orange-800 shadow-[0_3px_0_#7c2d12] font-bold'
                : 'bg-amber-200/80 text-[#78350f] border-amber-800/40 hover:bg-amber-200'
            }`}
          >
            <PixelIcon name="search" size={16} />
            <span>KOMPARASI SEJAJAR</span>
          </button>
          <button
            onClick={() => {
              retroAudio.playSelect();
              setActiveTab('instrument');
            }}
            className={`px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl border-2 font-pixel-title text-[13px] sm:text-[15px] cursor-pointer transition-all flex items-center gap-2 ${
              activeTab === 'instrument'
                ? 'bg-orange-600 text-amber-50 border-orange-800 shadow-[0_3px_0_#7c2d12] font-bold'
                : 'bg-amber-200/80 text-[#78350f] border-amber-800/40 hover:bg-amber-200'
            }`}
          >
            <PixelIcon name="gear" size={16} />
            <span>ALAT SEISMOGRAF</span>
          </button>
        </div>

        {/* Visual Content Canvas Area */}
        <div className="w-full bg-[#0c0a09] border-3 sm:border-4 border-[#78350f] rounded-xl sm:rounded-2xl overflow-hidden relative mb-3 sm:mb-4 p-3 sm:p-5 shadow-inner">
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 1: 4 BENTUK GELOMBANG STATUS INTERAKTIF                         */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'waveforms' && (
            <div className="w-full flex flex-col gap-3.5">
              {/* Tombol Pemilih Level Status */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {statusWaveforms.map((st) => (
                  <button
                    key={st.lvl}
                    onClick={() => {
                      retroAudio.playSelect();
                      setActiveStatusLvl(st.lvl);
                    }}
                    className={`py-2.5 px-3 rounded-xl border-2 text-[13px] sm:text-[15px] font-pixel-title cursor-pointer transition-all flex items-center justify-center gap-2 ${
                      activeStatusLvl === st.lvl
                        ? 'text-white border-white shadow-[0_3px_0_rgba(0,0,0,0.5)] font-bold scale-[1.02]'
                        : 'text-slate-300 border-slate-700 bg-slate-900/80 hover:border-slate-500'
                    }`}
                    style={{
                      backgroundColor: activeStatusLvl === st.lvl ? st.color : undefined,
                    }}
                  >
                    <span>[{st.code}]</span>
                    <span>{st.short}</span>
                  </button>
                ))}
              </div>

              {/* Monitor Tampilan Seismogram Gelombang */}
              <div className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl p-3 sm:p-4 shadow-inner relative overflow-hidden">
                {/* Header Oscilloscope */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2.5 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full animate-ping" style={{ backgroundColor: currentStatus.color }} />
                    <span className="text-[13px] sm:text-base font-pixel-title font-bold text-slate-100">
                      REKAMAN SEISMOGRAM: {currentStatus.name}
                    </span>
                  </div>
                  <span
                    className="text-[13px] sm:text-[15px] font-sans px-3 py-1 rounded-lg font-bold shadow"
                    style={{ backgroundColor: currentStatus.color, color: currentStatus.lvl === 2 ? '#000' : '#fff' }}
                  >
                    {currentStatus.waveType}
                  </span>
                </div>

                {/* Gelombang SVG Monitor (Sesuai Sketsa Gambar 2) */}
                <svg viewBox="0 0 760 140" className="w-full h-32 sm:h-40 md:h-44 object-contain" shapeRendering="geometricPrecision">
                  <defs>
                    <pattern id="seismoGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="20" y2="0" stroke="#1e293b" strokeWidth="0.8" />
                      <line x1="0" y1="0" x2="0" y2="20" stroke="#1e293b" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="760" height="140" fill="url(#seismoGrid)" />
                  {/* Garis Dasar Baseline Tengah */}
                  <line x1="0" y1="70" x2="760" y2="70" stroke="#334155" strokeWidth="1.2" strokeDasharray="4 4" />

                  {/* Render Jalur Gelombang Matematik Sesuai Gambar Sketsa */}
                  <path
                    d={generateSeismoPath(760, 140, currentStatus.lvl)}
                    fill="none"
                    stroke={currentStatus.color}
                    strokeWidth={currentStatus.lvl === 4 ? 3.2 : 3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* 3 Kartu Indikator Teknis Yang Jelas & Terbaca */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-slate-800">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                    <span className="text-[13px] sm:text-[15px] font-bold text-slate-300 block mb-1">AMPLITUDO GETARAN</span>
                    <span className="font-sans text-base sm:text-lg font-bold text-slate-100">{currentStatus.amplitude}</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                    <span className="text-[13px] sm:text-[15px] font-bold text-slate-300 block mb-1">KERAPATAN GELOMBANG</span>
                    <span className="font-sans text-base sm:text-lg font-bold" style={{ color: currentStatus.color }}>
                      {currentStatus.frequency}
                    </span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                    <span className="text-[13px] sm:text-[15px] font-bold text-slate-300 block mb-1">RADIUS ZONA BAHAYA</span>
                    <span className="font-sans text-[15px] sm:text-base font-bold text-amber-300 leading-tight block">
                      {currentStatus.hazardNote}
                    </span>
                  </div>
                </div>

                {/* Deskripsi Karakteristik Magma */}
                <div className="mt-3 bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                  <p className="font-sans text-[15px] sm:text-base md:text-[19px] text-slate-100 leading-relaxed font-medium">
                    <strong className="text-amber-400 font-bold">Deskripsi Geologis:</strong> {currentStatus.desc}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 2: KOMPARASI SEJAJAR KEEMPAT BENTUK GELOMBANG (SKETSA 4 BARIS)   */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'comparison' && (
            <div className="w-full flex flex-col gap-3">
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <span className="text-[13px] sm:text-[15px] font-pixel-title text-amber-300 font-bold">
                  KOMPARASI KERAPATAN GELOMBANG SEISMOGRAM (LEVEL I - IV)
                </span>
                <span className="text-[13px] font-sans text-slate-300 font-semibold">
                  Prinsip: Dari atas (Normal) ke bawah (Awas), gelombang semakin rapat dan padat!
                </span>
              </div>

              {/* 4 Strip Gelombang Ditumpuk Vertikal Persis Gambar Sketsa 2 */}
              <div className="flex flex-col gap-3 bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800">
                {/* 1. Normal (Atas) - Landai Renggang */}
                <div className="flex items-center gap-3">
                  <span className="w-24 sm:w-28 text-[13px] font-pixel-title font-bold text-emerald-400 shrink-0">
                    [I] NORMAL:
                  </span>
                  <svg viewBox="0 0 600 36" className="w-full h-9 bg-slate-900 rounded-lg border border-slate-800">
                    <line x1="0" y1="18" x2="600" y2="18" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                    <path
                      d={generateSeismoPath(600, 36, 1)}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 text-[13px] font-sans font-bold border border-emerald-800 shrink-0">
                    Sangat Renggang
                  </span>
                </div>

                {/* 2. Waspada - Sedang Berdenyut */}
                <div className="flex items-center gap-3">
                  <span className="w-24 sm:w-28 text-[13px] font-pixel-title font-bold text-yellow-400 shrink-0">
                    [II] WASPADA:
                  </span>
                  <svg viewBox="0 0 600 36" className="w-full h-9 bg-slate-900 rounded-lg border border-slate-800">
                    <line x1="0" y1="18" x2="600" y2="18" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                    <path
                      d={generateSeismoPath(600, 36, 2)}
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="px-2.5 py-1 rounded-md bg-yellow-950 text-yellow-300 text-[13px] font-sans font-bold border border-yellow-800 shrink-0">
                    Mulai Berdenyut
                  </span>
                </div>

                {/* 3. Siaga - Rapat Frekuensi Tinggi */}
                <div className="flex items-center gap-3">
                  <span className="w-24 sm:w-28 text-[13px] font-pixel-title font-bold text-orange-400 shrink-0">
                    [III] SIAGA:
                  </span>
                  <svg viewBox="0 0 600 36" className="w-full h-9 bg-slate-900 rounded-lg border border-slate-800">
                    <line x1="0" y1="18" x2="600" y2="18" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                    <path
                      d={generateSeismoPath(600, 36, 3)}
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="px-2.5 py-1 rounded-md bg-orange-950 text-orange-300 text-[13px] font-sans font-bold border border-orange-800 shrink-0">
                    Makin Rapat
                  </span>
                </div>

                {/* 4. Awas (Bawah) - Tremor Menerus Sangat Rapat */}
                <div className="flex items-center gap-3">
                  <span className="w-24 sm:w-28 text-[13px] font-pixel-title font-bold text-red-400 shrink-0">
                    [IV] AWAS:
                  </span>
                  <svg viewBox="0 0 600 36" className="w-full h-9 bg-slate-900 rounded-lg border border-red-900">
                    <line x1="0" y1="18" x2="600" y2="18" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                    <path
                      d={generateSeismoPath(600, 36, 4)}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="px-2.5 py-1 rounded-md bg-red-950 text-red-300 text-[13px] font-sans font-bold border border-red-800 shrink-0">
                    SANGAT RAPAT!
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 3: INSTRUMEN SEISMOGRAF MEKANIK (ZERO TULISAN MENUMPUK)       */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'instrument' && (
            <div className="w-full flex flex-col gap-4">
              {/* DIAGRAM BESAR INSTRUMEN SEISMOGRAF DENGAN ZONA TERPISAH BERSIH */}
              <div className="w-full bg-slate-950 p-4 sm:p-5 rounded-2xl border-2 border-slate-700 shadow-xl flex flex-col items-center">
                <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="text-[13px] sm:text-[15px] font-pixel-title text-amber-300 font-bold">
                    BAGIAN-BAGIAN UTAMA ALAT SEISMOGRAF MEKANIK
                  </span>
                  <span className="text-[13px] font-sans text-slate-400 font-semibold">
                    Prinsip: Kelembaman (Inersia) Beban Berat
                  </span>
                </div>

                <svg viewBox="0 0 740 330" className="w-full h-64 sm:h-72 md:h-80 object-contain" shapeRendering="geometricPrecision">
                  {/* ── 1. BATUAN DASAR / TANAH (BAGIAN PALING BAWAH, y: 265 - 325) ── */}
                  <rect x="20" y="265" width="700" height="55" fill="#1e293b" rx="6" stroke="#334155" strokeWidth="1.5" />
                  
                  {/* Label Batuan Dasar di Kiri (Tidak Bertumpuk dengan Garis Gelombang) */}
                  <rect x="35" y="278" width="220" height="28" rx="6" fill="#0f172a" stroke="#475569" strokeWidth="1" />
                  <text x="145" y="296" fill="#cbd5e1" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">
                    BATUAN DASAR LERENG MERAPI
                  </text>

                  {/* Garis Getaran Seismik Tanah di Kanan (Lapang & Terbaca Sempurna) */}
                  <text x="280" y="288" fill="#f59e0b" fontSize="10" fontWeight="bold" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">
                    GETARAN SEISMIK TANAH:
                  </text>
                  <path
                    d="M 280 304 Q 300 290 320 304 T 360 304 T 400 304 T 440 304 T 480 304 T 520 304 T 560 304 T 600 304 T 640 304 T 680 304 T 700 304"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />

                  {/* ── 2. MEJA LABORATORIUM & DUDUKAN ALAT (y: 235 - 265) ── */}
                  <rect x="50" y="235" width="640" height="26" fill="#334155" stroke="#475569" strokeWidth="2" rx="4" />
                  <rect x="80" y="261" width="24" height="6" fill="#0f172a" />
                  <rect x="635" y="261" width="24" height="6" fill="#0f172a" />

                  {/* ── 3. RANGKA BESI PENYANGGA SEISMOGRAF ── */}
                  {/* Tiang Vertikal Kiri */}
                  <rect x="75" y="55" width="22" height="180" fill="#475569" stroke="#64748b" strokeWidth="2" />
                  {/* Balok Horizontal Atas */}
                  <rect x="75" y="55" width="225" height="18" fill="#475569" stroke="#64748b" strokeWidth="2" />

                  {/* ── [CALLOUT PIN ②: PEGAS SUSPENSI] (Posisi Lapang Atas) ── */}
                  <rect x="185" y="16" width="150" height="26" rx="6" fill="#334155" stroke="#cbd5e1" strokeWidth="1.5" />
                  <text x="260" y="33" fill="#ffffff" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">
                    ② PEGAS SUSPENSI
                  </text>
                  <line x1="260" y1="42" x2="260" y2="73" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 2" />

                  {/* Pegas Spiral Suspensi */}
                  <path
                    d="M 260 73 L 260 88 Q 248 95 272 102 Q 248 109 272 116 Q 248 123 272 130 L 260 142"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="3.5"
                  />

                  {/* ── [CALLOUT PIN ①: BANDUL INERSIA] (Posisi Lapang di Kiri) ── */}
                  <rect x="25" y="152" width="165" height="26" rx="6" fill="#ca8a04" stroke="#fef08a" strokeWidth="1.5" />
                  <text x="107.5" y="169" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">
                    ① BANDUL INERSIA (DIAM)
                  </text>
                  <line x1="190" y1="165" x2="228" y2="165" stroke="#facc15" strokeWidth="2" strokeDasharray="3 2" />

                  {/* Beban Inersia / Bandul Berat (Kuning Emas Bersinar) */}
                  <circle cx="260" cy="165" r="30" fill="#eab308" stroke="#fef08a" strokeWidth="3" />
                  <circle cx="260" cy="165" r="22" fill="#ca8a04" />
                  <text x="260" y="169" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">
                    INERSIA
                  </text>

                  {/* Batang Lengan Stylus Terhubung ke Bandul */}
                  <line x1="260" y1="165" x2="290" y2="165" stroke="#cbd5e1" strokeWidth="3" />
                  <rect x="290" y="162" width="135" height="6" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />

                  {/* ── [CALLOUT PIN ④: PENA STYLUS PENCATAT] (Posisi Lapang Bawah) ── */}
                  <rect x="275" y="196" width="160" height="26" rx="6" fill="#dc2626" stroke="#fca5a5" strokeWidth="1.5" />
                  <text x="355" y="213" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">
                    ④ PENA STYLUS PENCATAT
                  </text>
                  <line x1="410" y1="196" x2="432" y2="173" stroke="#f87171" strokeWidth="1.5" strokeDasharray="3 2" />

                  {/* Jarum Pena Stylus Pencatat (Merah Menyala) */}
                  <polygon points="418,165 436,159 436,171" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" />
                  <circle cx="436" cy="165" r="3.5" fill="#ef4444" />
                  <line x1="436" y1="165" x2="446" y2="165" stroke="#dc2626" strokeWidth="3" />

                  {/* ── [CALLOUT PIN ③: DRUM SILINDER] (Posisi Lapang Atas Drum) ── */}
                  <rect x="475" y="16" width="200" height="26" rx="6" fill="#0284c7" stroke="#bae6fd" strokeWidth="1.5" />
                  <text x="575" y="33" fill="#ffffff" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">
                    ③ DRUM KERTAS (BERPUTAR)
                  </text>
                  <line x1="575" y1="42" x2="575" y2="60" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 2" />

                  {/* ── 4. SILINDER DRUM PEREKAM PUTIH DENGAN KERTAS SEISMOGRAM ── */}
                  <rect x="446" y="65" width="230" height="155" rx="8" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3" />
                  {/* Poros As Atas & Bawah Drum */}
                  <rect x="555" y="48" width="12" height="18" fill="#475569" />
                  <rect x="555" y="220" width="12" height="15" fill="#475569" />

                  {/* Garis Grid Kertas Seismogram di Drum */}
                  <line x1="446" y1="90" x2="676" y2="90" stroke="#93c5fd" strokeWidth="1" strokeDasharray="4 3" />
                  <line x1="446" y1="115" x2="676" y2="115" stroke="#93c5fd" strokeWidth="1" strokeDasharray="4 3" />
                  <line x1="446" y1="140" x2="676" y2="140" stroke="#93c5fd" strokeWidth="1" strokeDasharray="4 3" />
                  <line x1="446" y1="165" x2="676" y2="165" stroke="#93c5fd" strokeWidth="1" strokeDasharray="4 3" />
                  <line x1="446" y1="190" x2="676" y2="190" stroke="#93c5fd" strokeWidth="1" strokeDasharray="4 3" />

                  {/* Gelombang Seismik Tergores di Kertas Drum (Persis Pola Rekaman Nyata) */}
                  <path
                    d="M 446 165 
                       L 465 165 L 472 155 L 478 175 L 485 152 L 492 178 L 499 158 L 506 172 L 513 165 
                       L 535 165 L 545 142 L 553 186 L 561 138 L 569 190 L 577 148 L 585 178 L 593 165 
                       L 615 165 L 625 152 L 633 176 L 641 165 L 676 165"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Indikator Arah Putaran Drum (Tanpa Teks Menumpuk) */}
                  <path d="M 660 78 A 14 14 0 0 1 672 96" fill="none" stroke="#0284c7" strokeWidth="2.2" />
                  <polygon points="675,98 668,93 674,88" fill="#0284c7" />
                  <text x="655" y="76" fill="#0369a1" fontSize="9" fontWeight="bold" textAnchor="end" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif">
                    Arah Putar
                  </text>
                </svg>
              </div>

              {/* 3 URAIAN CARA KERJA DENGAN FONT BESAR & JELAS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-100 font-sans">
                <div className="bg-slate-900 border-2 border-amber-500/40 p-4 rounded-xl shadow-md">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[15px]">
                      1
                    </span>
                    <h4 className="font-pixel-title text-amber-300 font-bold text-[15px] sm:text-base">
                      PRINSIP HUKUM KELEMBAMAN
                    </h4>
                  </div>
                  <p className="text-slate-200 text-[15px] sm:text-[17px] leading-relaxed font-medium">
                    Saat tanah bergetar akibat desakan magma, <strong>Bandul Berat (Inersia)</strong> cenderung <strong>TETAP DIAM</strong> di tempatnya karena sifat kelembaman massanya.
                  </p>
                </div>

                <div className="bg-slate-900 border-2 border-sky-500/40 p-4 rounded-xl shadow-md">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="w-7 h-7 rounded-full bg-sky-500 text-slate-950 font-bold flex items-center justify-center text-[15px]">
                      2
                    </span>
                    <h4 className="font-pixel-title text-sky-300 font-bold text-[15px] sm:text-base">
                      PENCATATAN PADA DRUM
                    </h4>
                  </div>
                  <p className="text-slate-200 text-[15px] sm:text-[17px] leading-relaxed font-medium">
                    <strong>Drum kertas berputar terus-menerus</strong> dan ikut bergerak bersama tanah. <strong>Pena Stylus</strong> yang terhubung ke bandul akan otomatis menggoreskan garis gelombang getaran.
                  </p>
                </div>

                <div className="bg-slate-900 border-2 border-emerald-500/40 p-4 rounded-xl shadow-md">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[15px]">
                      3
                    </span>
                    <h4 className="font-pixel-title text-emerald-300 font-bold text-[15px] sm:text-base">
                      SENSOR GEOFON &amp; TELEMETRI
                    </h4>
                  </div>
                  <p className="text-slate-200 text-[15px] sm:text-[17px] leading-relaxed font-medium">
                    Di puncak Merapi, getaran mikro dideteksi oleh <strong>Sensor Geofon</strong> dan ditransmisikan lewat <strong>antena radio telemetri</strong> langsung ke monitor Pos Pengamatan PVMBG 24 jam!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Kotak Materi Edukasi & Fakta Kunci (Teks Jelas, Besar & Kontras) */}
        <div className="bg-[#fef9c3] p-4 sm:p-6 rounded-2xl border-3 border-[#b45309]/60 shadow-md text-[#291305] space-y-2.5 sm:space-y-3.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3.5 py-1.5 rounded-lg bg-[#b45309] text-amber-50 font-pixel-title text-[13px] sm:text-[15px] font-bold tracking-wider shadow">
              MATERI PEMBELAJARAN
            </span>
            <span className="text-[15px] sm:text-base font-pixel font-bold text-[#78350f]">
              HUBUNGAN KERAPATAN GELOMBANG DENGAN TINGKAT STATUS MERAPI
            </span>
          </div>
          <p className="font-sans text-base sm:text-lg md:text-[21px] leading-relaxed text-[#291305] font-semibold">
            Semakin dekat magma ke permukaan kawah, getaran tanah akan terekam <strong>semakin rapat dan padat</strong> pada kertas seismogram. Saat gunung berapi mencapai <strong>Status Level IV (AWAS)</strong>, grafik berubah menjadi <strong>Tremor Menerus (Continuous Tremor)</strong> yang sangat rapat tiada henti!
          </p>
          <div className="pt-3 border-t-2 border-[#b45309]/25 flex items-start gap-3">
            <span className="px-3 py-1.5 rounded-lg bg-amber-700/20 text-[#78350f] border border-[#b45309]/40 font-pixel-title text-[13px] sm:text-[15px] font-bold shrink-0 mt-0.5">
              FAKTA KUNCI
            </span>
            <p className="font-sans text-[15px] sm:text-base md:text-lg leading-relaxed text-[#451a03] font-bold italic">
              "Bentuk gelombang yang SANGAT RAPAT dan BERAMPLITUDO TINGGI KONTINU adalah ciri khas Status AWAS. Ingat bentuk ini saat menjawab kuis pintu keluar nanti!"
            </p>
          </div>
        </div>

        {/* Tombol Aksi Penutup */}
        <div className="mt-4 pt-3 border-t-2 border-[#b45309]/40 flex justify-end">
          <button
            onClick={() => {
              retroAudio.playSelect();
              onClose();
            }}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-50 border-3 border-[#451a03] shadow-[0_5px_0_#231206] text-[13px] sm:text-[15px] md:text-base font-pixel-title cursor-pointer active:translate-y-1 flex items-center gap-2.5 transition-all font-medium"
          >
            <PixelIcon name="check" size={20} className="text-amber-200" />
            <span>SAYA MENGERTI!</span>
          </button>
        </div>
      </div>
    </div>
  );
}
