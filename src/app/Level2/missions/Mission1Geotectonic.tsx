// ── src/app/Level2/missions/Mission1Geotectonic.tsx ───────────────────
// MISI 1: KENALI AKAR ANCAMAN GEOLOGIS (Know the Threat & Geotectonic Roots)
// Materi: Pergeseran Benua (Alfred Wegener & Pangea), Teori Lempeng Tektonik (Konveksi),
// 3 Batas Lempeng (Divergen, Konvergen/Subduksi, Transform/Sesar), dan Seismograf.

import { useState } from 'react';
import PixelIcon from '../../../components/PixelIcon';
import { retroAudio } from '../../../utils/retroAudio';

interface Mission1Props {
  onComplete: (pointsEarned: number, badge: string) => void;
  isAlreadyCompleted?: boolean;
}

type BoundaryType = 'divergen' | 'konvergen' | 'transform';

export default function Mission1Geotectonic({ onComplete, isAlreadyCompleted = false }: Mission1Props) {
  // Sub-phases: 0 = Apersepsi Pangea, 1 = Simulator Batas Lempeng & Seismograf, 2 = Evaluasi Pemahaman
  const [phase, setPhase] = useState<number>(0);

  // Phase 0: Pangea Puzzle interactive state
  const [pangeaMerged, setPangeaMerged] = useState(false);

  // Phase 1: Plate boundary simulation state
  const [activeBoundary, setActiveBoundary] = useState<BoundaryType>('konvergen');
  const [seismicActive, setSeismicActive] = useState(false);

  // Phase 2: Knowledge quiz answers
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResult, setShowResult] = useState(false);

  const handleMergePangea = () => {
    retroAudio.playPowerup();
    setPangeaMerged(true);
  };

  const handleTriggerSeismic = () => {
    retroAudio.playExplosion();
    setSeismicActive(true);
    setTimeout(() => setSeismicActive(false), 2400);
  };

  const handleAnswerSelect = (questionIdx: number, val: string) => {
    retroAudio.playSelect();
    setAnswers((prev) => ({ ...prev, [questionIdx]: val }));
  };

  const handleEvaluateQuiz = () => {
    // Correct answers: Q1 = 'konvergen', Q2 = 'seismograf', Q3 = 'konveksi'
    const isQ1Correct = answers[1] === 'konvergen';
    const isQ2Correct = answers[2] === 'seismograf';
    const isQ3Correct = answers[3] === 'konveksi';

    if (isQ1Correct && isQ2Correct && isQ3Correct) {
      retroAudio.playWin();
      setShowResult(true);
      onComplete(20, 'Hazard Detective');
    } else {
      retroAudio.playHover();
      alert('Ada jawaban yang belum tepat. Coba periksa kembali materi batas lempeng dan seismograf!');
    }
  };

  return (
    <div className="flex flex-col gap-6 text-amber-950 font-pixel">
      {/* Step Indicator */}
      <div className="flex items-center justify-between bg-amber-100/90 border-2 border-amber-900/40 p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-amber-900 text-amber-100 flex items-center justify-center font-pixel-title text-xs font-bold">
            1
          </span>
          <span className="font-pixel-title text-xs md:text-sm font-bold text-amber-950">
            MISI 1: AKAR GEOLOGIS ANCAMAN BUMI
          </span>
        </div>
        <div className="flex gap-1.5">
          {['1. Pangea', '2. Batas Lempeng', '3. Uji Analis'].map((stepName, idx) => (
            <button
              key={idx}
              onClick={() => {
                retroAudio.playSelect();
                setPhase(idx);
              }}
              className={`px-2.5 py-1 rounded-md text-[10px] font-pixel-title font-bold transition-all ${
                phase === idx
                  ? 'bg-amber-900 text-white shadow'
                  : 'bg-amber-200/80 text-amber-900 hover:bg-amber-300'
              }`}
            >
              {stepName}
            </button>
          ))}
        </div>
      </div>

      {/* ── PHASE 0: PANGEA & ALFRED WEGENER ── */}
      {phase === 0 && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-amber-950/5 border-2 border-amber-900/30 rounded-2xl p-5">
            <h3 className="text-sm md:text-base font-bold text-amber-950 flex items-center gap-2 mb-2">
              <PixelIcon name="globe" size={18} />
              <span>Apersepsi: Teka-Teki Kepingan Benua (Pangea)</span>
            </h3>
            <p className="text-xs text-amber-900 leading-relaxed">
              Pernahkah kamu memperhatikan bahwa garis pantai benua di bumi tampak seperti potongan puzzle?
              Pada tahun 1912, seorang ahli meteorologi bernama <strong>Alfred Wegener</strong> mengemukakan
              bahwa seluruh benua dulunya merupakan satu daratan raksasa yang disebut <strong>Pangea</strong>,
              sebelum akhirnya terpecah dan bergerak saling menjauh (<em>Continental Drift</em>).
            </p>
          </div>

          {/* Interactive Continental Puzzle Board */}
          <div className="relative bg-slate-900 border-2 border-amber-900/40 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[260px] text-center overflow-hidden">
            <div className="absolute top-3 left-4 text-left">
              <span className="text-[10px] text-amber-400 font-pixel-title font-bold block">
                BUKTI ILMIAH WEGENER:
              </span>
              <span className="text-[9px] text-slate-300 block">
                • Rangkaian pegunungan Appalachian & Kaledonia identik (usia & jenis batuan sama)
              </span>
              <span className="text-[9px] text-slate-300 block">
                • Fosil tumbuhan purba <em>Glossopteris</em> ditemukan di Amerika Selatan & Afrika
              </span>
            </div>

            {/* Puzzle Continents Visual */}
            <div className="relative w-72 h-40 mt-8 mb-4 flex items-center justify-center">
              {/* South America piece */}
              <div
                className={`w-28 h-36 bg-emerald-700 border-2 border-emerald-400 rounded-2xl flex flex-col items-center justify-center text-white transition-all duration-700 shadow-xl ${
                  pangeaMerged ? 'translate-x-6 rotate-3' : '-translate-x-12 -rotate-6'
                }`}
              >
                <span className="text-[10px] font-bold">AMERIKA</span>
                <span className="text-[9px] text-emerald-200">SELATAN</span>
                <span className="text-[8px] mt-1 text-emerald-300">Fosil Mesosaurus</span>
              </div>

              {/* Africa piece */}
              <div
                className={`w-32 h-36 bg-amber-600 border-2 border-amber-300 rounded-2xl flex flex-col items-center justify-center text-white transition-all duration-700 shadow-xl ${
                  pangeaMerged ? '-translate-x-6 -rotate-2' : 'translate-x-12 rotate-6'
                }`}
              >
                <span className="text-[10px] font-bold">BENUA</span>
                <span className="text-[9px] text-amber-200">AFRIKA</span>
                <span className="text-[8px] mt-1 text-amber-300">Fosil Mesosaurus</span>
              </div>
            </div>

            <button
              onClick={handleMergePangea}
              className={`px-5 py-2 rounded-xl text-xs font-pixel-title font-bold border-2 transition-all cursor-pointer shadow-lg active:translate-y-0.5 ${
                pangeaMerged
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-950 shadow-[0_4px_0_#064e3b]'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-950 shadow-[0_4px_0_#78350f]'
              }`}
            >
              {pangeaMerged ? '✓ PANGEA TERSATUKAN!' : 'GABUNGKAN KEPINGAN BENUA (PANGEA)'}
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                retroAudio.playSelect();
                setPhase(1);
              }}
              className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-100 text-xs font-pixel-title font-bold border-2 border-amber-950 shadow cursor-pointer flex items-center gap-1.5"
            >
              <span>LANJUT: SIMULATOR BATAS LEMPENG</span>
              <span>&gt;</span>
            </button>
          </div>
        </div>
      )}

      {/* ── PHASE 1: 3 PLATE BOUNDARIES & SEISMOGRAPH ── */}
      {phase === 1 && (
        <div className="space-y-4 animate-fade-in">
          {/* Theory card */}
          <div className="bg-amber-950/5 border-2 border-amber-900/30 rounded-2xl p-4">
            <h3 className="text-xs md:text-sm font-bold text-amber-950 mb-1">
              Teori Lempeng Tektonik & Arus Konveksi Mantel
            </h3>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              Kerak bumi terpecah menjadi sekitar <strong>20 segmen lempeng tektonik</strong>. Lempeng ini
              terdiri dari <strong>Lempeng Benua</strong> (tebal ~100 km) dan <strong>Lempeng Samudera</strong>{' '}
              (tebal 5–15 km, namun lebih padat & berat). Lempeng bergerak lambat sepanjang waktu karena didorong
              oleh <strong>arus konveksi panas</strong> di dalam mantel bumi.
            </p>
          </div>

          {/* 3 Boundary Selector Tabs */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'divergen', title: '1. DIVERGEN', sub: 'Saling Menjauh' },
              { id: 'konvergen', title: '2. KONVERGEN', sub: 'Bertabrakan (Subduksi)' },
              { id: 'transform', title: '3. TRANSFORM', sub: 'Bergeser Mendatar' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  retroAudio.playSelect();
                  setActiveBoundary(tab.id as BoundaryType);
                }}
                className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                  activeBoundary === tab.id
                    ? 'bg-amber-900 text-amber-100 border-amber-950 shadow-[0_3px_0_#451a03]'
                    : 'bg-amber-100 text-amber-950 border-amber-900/30 hover:bg-amber-200'
                }`}
              >
                <span className="font-pixel-title text-[11px] block font-bold">{tab.title}</span>
                <span className="text-[9px] opacity-80 block">{tab.sub}</span>
              </button>
            ))}
          </div>

          {/* Plate Boundary Visualizer Box */}
          <div className="bg-slate-950 border-2 border-amber-900/40 rounded-2xl p-4 overflow-hidden relative">
            <div className="w-full aspect-[2/1] max-h-[260px] relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
              <svg viewBox="0 0 600 300" className="w-full h-full" shapeRendering="crispEdges">
                {/* Mantle magma background */}
                <rect x="0" y="160" width="600" height="140" fill="#78350f" opacity="0.8" />
                <text x="20" y="270" fill="#fde68a" fontSize="10" fontWeight="bold">
                  MANTEL BUMI (ARUS KONVEKSI PANAS)
                </text>

                {/* 1. Divergent Boundary Animation */}
                {activeBoundary === 'divergen' && (
                  <g>
                    {/* Left Plate moving left */}
                    <rect x="50" y="80" width="220" height="80" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
                    <text x="100" y="125" fill="#ffffff" fontSize="11" fontWeight="bold">
                      LEMPENG SAMUDERA A
                    </text>
                    {/* Arrow Left */}
                    <polygon points="120,60 90,70 120,80" fill="#facc15" />
                    <rect x="120" y="66" width="40" height="8" fill="#facc15" />

                    {/* Right Plate moving right */}
                    <rect x="330" y="80" width="220" height="80" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
                    <text x="370" y="125" fill="#ffffff" fontSize="11" fontWeight="bold">
                      LEMPENG SAMUDERA B
                    </text>
                    {/* Arrow Right */}
                    <polygon points="480,70 450,60 450,80" fill="#facc15" />
                    <rect x="410" y="66" width="40" height="8" fill="#facc15" />

                    {/* Magma Rising at Mid-Ocean Ridge */}
                    <polygon points="270,160 300,90 330,160" fill="#ea580c" />
                    <rect x="290" y="100" width="20" height="60" fill="#f97316" />
                    <text x="300" y="75" textAnchor="middle" fill="#fb923c" fontSize="10" fontWeight="bold">
                      Punggung Tengah Samudra (Kerak Baru)
                    </text>
                  </g>
                )}

                {/* 2. Convergent Boundary Animation (Subduction & Volcano) */}
                {activeBoundary === 'konvergen' && (
                  <g>
                    {/* Continental Plate (Left - thick) */}
                    <polygon points="40,60 340,60 300,160 40,160" fill="#9a3412" stroke="#78350f" strokeWidth="2" />
                    <text x="70" y="110" fill="#ffffff" fontSize="10" fontWeight="bold">
                      LEMPENG BENUA (EURASIA)
                    </text>
                    {/* Arrow right */}
                    <polygon points="240,45 220,35 220,55" fill="#facc15" />

                    {/* Volcano Merapi on Continental Crust */}
                    <polygon points="180,60 220,10 260,60" fill="#451a03" stroke="#ea580c" strokeWidth="2" />
                    <circle cx="220" cy="10" r="4" fill="#ef4444" />
                    <text x="220" y="4" textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="bold">
                      GUNUNG MERAPI
                    </text>

                    {/* Oceanic Plate (Subducting underneath) */}
                    <polygon
                      points="320,80 560,80 560,150 250,220 230,180"
                      fill="#0369a1"
                      stroke="#0284c7"
                      strokeWidth="2"
                    />
                    <text x="390" y="115" fill="#ffffff" fontSize="10" fontWeight="bold">
                      LEMPENG SAMUDERA (INDO-AUSTRALIA)
                    </text>
                    {/* Arrow diagonally down left */}
                    <polygon points="300,160 320,140 330,160" fill="#facc15" />

                    {/* Subduction Trench & Magma chamber */}
                    <circle cx="260" cy="190" r="22" fill="#ef4444" opacity="0.8" />
                    <path d="M 260,170 Q 240,100 220,15" stroke="#f97316" strokeWidth="6" fill="none" />
                    <text x="260" y="235" textAnchor="middle" fill="#fecaca" fontSize="9" fontWeight="bold">
                      Zona Subduksi & Peleburan Magma
                    </text>
                  </g>
                )}

                {/* 3. Transform Boundary Animation (Strike-Slip Fault) */}
                {activeBoundary === 'transform' && (
                  <g>
                    {/* Top block moving left */}
                    <rect x="60" y="40" width="480" height="55" fill="#334155" stroke="#1e293b" strokeWidth="2" />
                    <text x="180" y="72" fill="#ffffff" fontSize="11" fontWeight="bold">
                      BLOK UTARA (BERGESER KE KIRI &lt;&lt;)
                    </text>
                    <polygon points="120,60 140,50 140,70" fill="#facc15" />

                    {/* Fault Line Fissure */}
                    <line x1="60" y1="95" x2="540" y2="95" stroke="#ef4444" strokeWidth="4" />
                    <text x="300" y="92" textAnchor="middle" fill="#f87171" fontSize="9" fontWeight="bold">
                      GARIS SESAR GESER (STRIKE-SLIP FAULT: SAN ANDREAS / OPAK)
                    </text>

                    {/* Bottom block moving right */}
                    <rect x="60" y="100" width="480" height="55" fill="#475569" stroke="#1e293b" strokeWidth="2" />
                    <text x="180" y="132" fill="#ffffff" fontSize="11" fontWeight="bold">
                      BLOK SELATAN (BERGESER KE KANAN &gt;&gt;)
                    </text>
                    <polygon points="460,130 440,120 440,140" fill="#facc15" />
                  </g>
                )}
              </svg>
            </div>

            {/* Geological Explanation Box */}
            <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-start justify-between gap-4">
              <div>
                <span className="font-bold text-amber-300 block mb-0.5">
                  {activeBoundary === 'divergen' && 'PUNGGUNG TENGAH SAMUDRA (MID-OCEAN RIDGE):'}
                  {activeBoundary === 'konvergen' && 'SUBDUKSI & VULKANISME (PEMICU UTAMA MERAPI):'}
                  {activeBoundary === 'transform' && 'SESAR PATAHAN GESER (PEMICU GEMPA DANGKAL):'}
                </span>
                <p className="text-[10px] text-slate-300">
                  {activeBoundary === 'divergen' &&
                    'Dua lempeng saling menjauh. Magma cair dari mantel bumi naik ke atas membentuk batuan beku basaltik dan kerak baru. Sering menimbulkan retakan dan gempa dangkal.'}
                  {activeBoundary === 'konvergen' &&
                    'Lempeng samudera yang lebih padat dan berat menyelinap di bawah lempeng benua (Subduksi). Selama proses ini, lempeng meleleh kembali ke mantel, memicu magma naik (Gunung Merapi), pegunungan tinggi, palung laut dalam, dan gempa bumi megathrust.'}
                  {activeBoundary === 'transform' &&
                    'Dua lempeng bergesekan ke samping secara horizontal. Gesekan ini menyebabkan tegangan terakumulasi pada zona sesar (seperti San Andreas atau Sesar Opak) yang bergeser ~2 inci setiap tahun, memicu gempa bumi dangkal berkekuatan destruktif.'}
                </p>
              </div>

              <button
                onClick={handleTriggerSeismic}
                className="px-3 py-2 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-pixel-title text-[10px] shrink-0 border border-rose-950 shadow cursor-pointer active:translate-y-0.5"
              >
                PICU GETARAN
              </button>
            </div>

            {/* Seismograph Waveform Monitor */}
            <div className="mt-3 p-3 rounded-xl bg-black border border-emerald-950 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <span className="font-pixel-title text-[10px] text-emerald-400 font-bold block">
                    SEISMOGRAF DIGITAL: BMKG MONITORING
                  </span>
                  <span className="text-[9px] text-emerald-600">
                    Mengubah getaran mekanik bumi menjadi sinyal listrik & seismogram
                  </span>
                </div>
              </div>

              {/* Dynamic Seismograph needle canvas */}
              <div className="w-full md:w-64 h-12 bg-emerald-950/40 rounded border border-emerald-500/30 overflow-hidden relative flex items-center">
                <svg viewBox="0 0 200 40" className="w-full h-full">
                  <path
                    d={
                      seismicActive
                        ? 'M 0 20 L 30 20 L 45 4 L 55 36 L 65 2 L 75 38 L 85 8 L 95 32 L 105 14 L 115 26 L 140 20 L 200 20'
                        : 'M 0 20 L 40 20 L 45 18 L 50 22 L 55 19 L 60 21 L 100 20 L 140 20 L 145 19 L 150 21 L 200 20'
                    }
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    className={seismicActive ? 'animate-pulse' : ''}
                  />
                </svg>
                {seismicActive && (
                  <span className="absolute right-2 text-[8px] text-rose-400 font-bold font-pixel-title">
                    GELOMBANG P & S TERDETEKSI!
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => {
                retroAudio.playSelect();
                setPhase(0);
              }}
              className="px-4 py-2 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-pixel-title font-bold border border-amber-900/30 cursor-pointer"
            >
              &lt; KEMBALI KE PANGEA
            </button>
            <button
              onClick={() => {
                retroAudio.playSelect();
                setPhase(2);
              }}
              className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-100 text-xs font-pixel-title font-bold border-2 border-amber-950 shadow cursor-pointer flex items-center gap-1.5"
            >
              <span>LANJUT KE UJI ANALIS</span>
              <span>&gt;</span>
            </button>
          </div>
        </div>
      )}

      {/* ── PHASE 2: EVALUASI PEMAHAMAN GEOLOGI ── */}
      {phase === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-amber-950/5 border-2 border-amber-900/30 rounded-2xl p-4">
            <h3 className="text-xs md:text-sm font-bold text-amber-950 mb-1">
              Uji Validasi Analis Geologis Kebencanaan
            </h3>
            <p className="text-[11px] text-amber-900">
              Jawab 3 pertanyaan berikut untuk memvalidasi pemahamanmu tentang akar geologis di Disaster City.
            </p>
          </div>

          {/* Question 1 */}
          <div className="bg-white/80 border border-amber-900/20 p-4 rounded-xl space-y-2">
            <span className="text-xs font-bold text-amber-950 block">
              1. Batas lempeng apa yang menyebabkan lempeng samudera menyelinap ke bawah lempeng benua (subduksi) dan memicu lahirnya Gunung Api Merapi?
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              {[
                { id: 'divergen', label: 'A. Batas Divergen (Saling Menjauh)' },
                { id: 'konvergen', label: 'B. Batas Konvergen (Subduksi & Peleburan)' },
                { id: 'transform', label: 'C. Batas Transform (Sesar Patahan)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleAnswerSelect(1, opt.id)}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                    answers[1] === opt.id
                      ? 'bg-amber-900 text-white border-amber-950 shadow'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-900/30'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className="bg-white/80 border border-amber-900/20 p-4 rounded-xl space-y-2">
            <span className="text-xs font-bold text-amber-950 block">
              2. Alat pendeteksi yang bekerja dengan cara mengubah getaran mekanik bumi menjadi sinyal listrik disebut...?
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              {[
                { id: 'barometer', label: 'A. Barometer' },
                { id: 'seismograf', label: 'B. Seismograf' },
                { id: 'termometer', label: 'C. Anemometer' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleAnswerSelect(2, opt.id)}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                    answers[2] === opt.id
                      ? 'bg-amber-900 text-white border-amber-950 shadow'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-900/30'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3 */}
          <div className="bg-white/80 border border-amber-900/20 p-4 rounded-xl space-y-2">
            <span className="text-xs font-bold text-amber-950 block">
              3. Apa tenaga pendorong utama yang membuat 20 lempeng tektonik terus bergerak di atas mantel bumi?
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              {[
                { id: 'angin', label: 'A. Hembusan angin atmosfer' },
                { id: 'konveksi', label: 'B. Arus konveksi panas di mantel bumi' },
                { id: 'gravitasi_bulan', label: 'C. Gravitasi pasang surut bulan' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleAnswerSelect(3, opt.id)}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                    answers[3] === opt.id
                      ? 'bg-amber-900 text-white border-amber-950 shadow'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-900/30'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit / Result */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                retroAudio.playSelect();
                setPhase(1);
              }}
              className="px-4 py-2 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-pixel-title font-bold border border-amber-900/30 cursor-pointer"
            >
              &lt; KEMBALI
            </button>

            {showResult || isAlreadyCompleted ? (
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-lg bg-emerald-100 border border-emerald-500 text-emerald-800 text-xs font-bold">
                  ✓ MISI 1 SELESAI (+20 RP)
                </span>
              </div>
            ) : (
              <button
                onClick={handleEvaluateQuiz}
                disabled={!answers[1] || !answers[2] || !answers[3]}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-pixel-title font-bold border-2 border-amber-950 shadow-[0_4px_0_#78350f] cursor-pointer active:translate-y-0.5"
              >
                SUBMIT JAWABAN MISI 1
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
