// ── src/app/Level2/DiscoveryModal.tsx ────────────────────────────────
// Modal Pop-Up Temuan Sains Geologis Level 2 (Discovery Point)
// Menampilkan diagram sains interaktif 2D retro pixel art:
// 1. 'wegener-pangea': 4 Tahap Apungan Benua (Pangea -> Laurasia/Gondwana -> Pemisahan -> Modern)
// 2. 'twin-mountains': Bukti Rantai Pegunungan Kembar (Appalachian & Caledonian) dengan peta benua realistis
// 3. 'divergent-anim': Simulator Batas Divergen (Pemekaran Pelan & Magma Muncrat ke Atas)

import { useState, useEffect } from 'react';
import type { DiscoveryPointL2 } from './level2Data';
import { retroAudio } from '../../utils/retroAudio';
import PixelIcon from '../../components/PixelIcon';

interface DiscoveryModalProps {
  discovery: DiscoveryPointL2;
  areaName: string;
  location: string;
  onClose: () => void;
}

export default function DiscoveryModal({
  discovery,
  areaName,
  location,
  onClose,
}: DiscoveryModalProps) {
  const [isSimulating, setIsSimulating] = useState(false);

  const handleTriggerSimulate = () => {
    retroAudio.playSelect();
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm select-none animate-fadeIn font-pixel">
      {/* Main Parchment Board (100% Selaras Level 1) */}
      <div className="relative w-full max-w-4xl bg-[#fef3c7] border-4 border-[#451a03] rounded-2xl p-4 sm:p-6 shadow-[0_12px_0_#1c0d02] text-[#451a03] font-pixel max-h-[96vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-3 border-[#78350f] pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#b45309]/20 border border-[#b45309] flex items-center justify-center shrink-0">
              <PixelIcon name="search" size={16} className="text-[#92400e]" />
            </div>
            <div>
              <span className="text-[10px] text-[#b45309] uppercase tracking-widest block font-pixel">
                {areaName} • {location}
              </span>
              <h2 className="text-xs sm:text-sm md:text-base text-[#451a03] font-pixel-title font-bold">
                {discovery.title}
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              retroAudio.playSelect();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-amber-100 border-2 border-[#451a03] font-pixel-title text-xs flex items-center justify-center cursor-pointer active:translate-y-0.5 shadow-[0_2px_0_#451a03] shrink-0"
            title="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Visual Illustration Area (Dimensi Presisi Level 1) */}
        <div className="w-full h-[380px] sm:h-[450px] md:h-[500px] bg-[#0c0a09] border-3 border-[#78350f] rounded-xl overflow-hidden relative mb-3.5 flex items-center justify-center shadow-inner">
          {renderIllustration(discovery.illustrationType, isSimulating, handleTriggerSimulate)}
        </div>

        {/* ── SCIENCE FACT CONTENT (100% 2D PIXEL FONT PERSIS LEVEL 1) ── */}
        <div className="space-y-2.5 text-xs sm:text-sm text-[#291305]">
          <div className="bg-[#fde68a]/80 p-3 rounded-xl border-2 border-[#b45309]/50 shadow-xs">
            <p className="font-pixel text-xs sm:text-sm leading-relaxed text-[#291305] font-medium">
              {discovery.shortDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-[#fffbeb] p-2.5 rounded-lg border-2 border-[#d97706]/40">
              <div className="flex items-center gap-1.5 mb-1">
                <PixelIcon name="mountain" size={12} className="text-[#b45309]" />
                <span className="font-pixel-title text-[9px] text-[#b45309]">
                  LOKASI PENELITIAN
                </span>
              </div>
              <p className="font-pixel text-xs text-[#451a03] leading-normal font-semibold">
                {location}
              </p>
            </div>

            <div className="bg-[#fffbeb] p-2.5 rounded-lg border-2 border-[#d97706]/40">
              <div className="flex items-center gap-1.5 mb-1">
                <PixelIcon name="bulb" size={12} className="text-[#b45309]" />
                <span className="font-pixel-title text-[9px] text-[#b45309]">
                  FAKTA SAINS RESMI
                </span>
              </div>
              <p className="font-pixel text-xs text-[#451a03] leading-normal italic">
                {discovery.fact}
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-4 pt-3 border-t-2 border-[#b45309]/40 flex justify-end">
          <button
            onClick={() => {
              retroAudio.playSelect();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-50 border-3 border-[#451a03] shadow-[0_4px_0_#231206] text-xs font-pixel-title cursor-pointer active:translate-y-0.5 flex items-center gap-2"
          >
            <PixelIcon name="check" size={13} className="text-amber-200" />
            <span>SAYA MENGERTI!</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── RENDER ILUSTRASI DIAGRAM SAINS RETRO PIXEL ──
function renderIllustration(
  type: DiscoveryPointL2['illustrationType'],
  isSimulating: boolean,
  onSimulate: () => void
) {
  switch (type) {
    // ═════════════════════════════════════════════════════════════════════════
    // 1. TEORI APUNGAN BENUA (4 TAHAP EVOLUSI PANGEA - SESUAI GAMBAR REFERENSI)
    // ═════════════════════════════════════════════════════════════════════════
    case 'wegener-pangea':
      return <PangeaIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 2. BUKTI RANTAI PEGUNUNGAN KEMBAR (PETA BENUA REALISTIS DENGAN KONTUR BENAR)
    // ═════════════════════════════════════════════════════════════════════════
    case 'twin-mountains':
      return (
        <svg viewBox="0 0 600 320" className="w-full h-full object-contain" shapeRendering="crispEdges">
          {/* Lautan Samudra Luas */}
          <rect x="0" y="0" width="600" height="320" fill="#082f49" />

          {/* Garis Grid Kartografi */}
          <line x1="0" y1="160" x2="600" y2="160" stroke="#0284c7" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
          <line x1="300" y1="0" x2="300" y2="320" stroke="#0284c7" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />

          {/* Banner Judul */}
          <rect x="50" y="8" width="500" height="24" rx="4" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="300" y="24" textAnchor="middle" fill="#fef08a" fontSize="8" fontWeight="bold">
            REKONSTRUKSI PANGEA: PENYATUAN AMERIKA UTARA, EROPA, &amp; AFRIKA
          </text>

          {/* ── 1. BENUA AMERIKA UTARA (KONTUR GEOGRAFIS NYATA DENGAN LABRADOR, EAST COAST, FLORIDA) ── */}
          <path
            d="M 50 140 
               L 80 100 L 110 70 L 150 50 L 190 40 L 220 55 L 245 45 
               L 255 75 L 245 95 L 235 125 L 225 155 L 205 190 L 195 225 
               L 165 240 L 135 220 L 110 185 L 85 180 L 60 165 Z"
            fill="#15803d"
            stroke="#166534"
            strokeWidth="2"
          />
          {/* Label Amerika Utara */}
          <text x="130" y="140" fill="#ffffff" fontSize="9" fontWeight="bold">
            AMERIKA UTARA
          </text>
          <text x="130" y="152" fill="#bbf7d0" fontSize="6.5">
            (Pesisir Timur / Pangea)
          </text>

          {/* ── 2. BENUA EROPA (KONTUR NYATA DENGAN INGGRIS, SKANDINAVIA, & IBERIA) ── */}
          <path
            d="M 260 45 
               L 310 35 L 355 45 L 395 70 L 420 50 L 450 75 L 430 110 
               L 390 125 L 360 135 L 330 120 L 305 130 L 275 110 L 260 75 Z"
            fill="#166534"
            stroke="#14532d"
            strokeWidth="2"
          />
          <text x="360" y="85" fill="#ffffff" fontSize="9" fontWeight="bold">
            EROPA
          </text>
          <text x="360" y="97" fill="#bbf7d0" fontSize="6.5">
            (Inggris, Skotlandia, &amp; Skandinavia)
          </text>

          {/* ── 3. BENUA AFRIKA (KONTUR NYATA DENGAN MAROKO & BULGE AFRIKA BARAT) ── */}
          <path
            d="M 235 160 
               L 275 135 L 335 140 L 385 170 L 420 215 L 390 270 
               L 330 285 L 285 270 L 255 235 L 235 190 Z"
            fill="#9a3412"
            stroke="#78350f"
            strokeWidth="2"
          />
          <text x="310" y="210" fill="#ffffff" fontSize="9" fontWeight="bold">
            AFRIKA
          </text>
          <text x="310" y="222" fill="#fed7aa" fontSize="6.5">
            (Pesisir Barat Laut Afrika)
          </text>

          {/* ══════════════════════════════════════════════════════════════════
              SABUK RANTAI PEGUNUNGAN KEMBAR TERSAMBUNG KONTINU (OROGENESA)
              ══════════════════════════════════════════════════════════════════ */}
          {/* Jalur orogenik menghubungkan Appalachian -> British Isles -> Caledonian */}
          <path
            d="M 175 230 
               Q 205 180, 230 130 
               Q 250 95, 275 80 
               Q 310 65, 365 55 
               L 375 68 
               Q 320 80, 285 96 
               Q 260 115, 240 145 
               Q 215 195, 185 240 Z"
            fill="#ea580c"
            stroke="#facc15"
            strokeWidth="2"
          />

          {/* Simbol Puncak Pegunungan (Gold Peaks) */}
          <polygon points="182,215 188,198 194,215" fill="#fef08a" />
          <polygon points="208,175 215,158 222,175" fill="#fef08a" />
          <polygon points="230,135 238,118 246,135" fill="#fef08a" />
          <polygon points="268,95 275,78 282,95" fill="#fef08a" />
          <polygon points="305,78 313,62 321,78" fill="#fef08a" />
          <polygon points="345,68 353,52 361,68" fill="#fef08a" />

          {/* Kotak Callout 1: Appalachian */}
          <rect x="15" y="235" width="205" height="38" rx="4" fill="#0f172a" stroke="#facc15" strokeWidth="1.5" />
          <text x="117" y="250" textAnchor="middle" fill="#facc15" fontSize="7.5" fontWeight="bold">
            PEG. APPALACHIAN (AMERIKA)
          </text>
          <text x="117" y="264" textAnchor="middle" fill="#cbd5e1" fontSize="6.5">
            Batuan Paleozoikum &amp; Umur Sama
          </text>
          <line x1="160" y1="235" x2="185" y2="215" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 2" />

          {/* Kotak Callout 2: Caledonian */}
          <rect x="360" y="115" width="225" height="38" rx="4" fill="#0f172a" stroke="#facc15" strokeWidth="1.5" />
          <text x="472" y="130" textAnchor="middle" fill="#facc15" fontSize="7.5" fontWeight="bold">
            PEG. CALEDONIAN (EROPA/UK)
          </text>
          <text x="472" y="144" textAnchor="middle" fill="#cbd5e1" fontSize="6.5">
            Struktur Lipatan Identik Sempurna
          </text>
          <line x1="390" y1="115" x2="330" y2="85" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 2" />

          {/* Footer Callout */}
          <rect x="40" y="285" width="520" height="24" rx="4" fill="#18181b" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="300" y="301" textAnchor="middle" fill="#38bdf8" fontSize="7.5" fontWeight="bold">
            FAKTA: JIKA BENUA DISATUKAN, KEDUA RANTAI MEMBENTUK SATU SABUK UTUH!
          </text>
        </svg>
      );

    // ═════════════════════════════════════════════════════════════════════════
    // 3. SIMULATOR BATAS DIVERGEN (GERAK PELAN & MAGMA MUNCRAT / MENYEMBUR NAIK)
    // ═════════════════════════════════════════════════════════════════════════
    case 'divergent-anim':
      return (
        <div className="w-full h-full relative flex flex-col items-center justify-between p-2">
          {/* Top Bar Button */}
          <div className="w-full flex items-center justify-between px-2 pb-1 border-b border-slate-800 z-10">
            <span className="text-[9px] font-pixel-title text-orange-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              SIMULATOR PEMEKARAN DIVERGEN (LEMPENG SALING MEMISAH)
            </span>
            <button
              onClick={onSimulate}
              disabled={isSimulating}
              className={`px-4 py-1.5 rounded text-white text-[9px] font-bold border-2 cursor-pointer font-pixel-title active:translate-y-0.5 transition-all flex items-center gap-1.5 ${isSimulating
                ? 'bg-orange-900 border-orange-950 opacity-80'
                : 'bg-orange-600 hover:bg-orange-500 border-orange-950 shadow-[0_3px_0_#7c2d12]'
                }`}
            >
              <PixelIcon name="zap" size={13} />
              <span>{isSimulating ? 'LEMPENG SEDANG MEMISAH...' : 'SIMULASI PEMISAHAN'}</span>
            </button>
          </div>

          {/* SVG Canvas Simulator */}
          <svg viewBox="0 0 540 240" className="w-full h-full object-contain" shapeRendering="crispEdges">
            {/* Mantle Asthenosphere Base (Lapisan Mantel Panas) */}
            <rect x="0" y="110" width="540" height="130" fill="#451a03" />
            <rect x="0" y="150" width="540" height="90" fill="#7c2d12" />

            {/* Kolom Air Samudra di Atas Kerak */}
            <rect x="0" y="30" width="540" height="50" fill="#0369a1" opacity="0.35" />
            <line x1="0" y1="30" x2="540" y2="30" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="8 4" />
            <text x="20" y="45" fill="#7dd3fc" fontSize="7" fontWeight="bold">SAMUDRA LAUTAN DALAM</text>

            {/* ── ARUS KONVEKSI MANTEL PEMISAH ── */}
            <path d="M 150 185 A 35 35 0 0 1 95 150" fill="none" stroke="#ea580c" strokeWidth="3" strokeDasharray="6 3" />
            <polygon points="90,152 96,140 104,150" fill="#ea580c" />
            <text x="135" y="210" fill="#fed7aa" fontSize="7.5" fontWeight="bold" textAnchor="middle">
              ARUS KONVEKSI &lt;&lt;
            </text>

            <path d="M 390 185 A 35 35 0 0 0 445 150" fill="none" stroke="#ea580c" strokeWidth="3" strokeDasharray="6 3" />
            <polygon points="450,152 444,140 436,150" fill="#ea580c" />
            <text x="405" y="210" fill="#fed7aa" fontSize="7.5" fontWeight="bold" textAnchor="middle">
              &gt;&gt; ARUS KONVEKSI
            </text>

            {/* ── ZONA LEMBAH RETAKAN TENGAH (RIFT VALLEY FISSURE) ── */}
            <rect x="235" y="80" width="70" height="40" fill="#1c1917" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="270" y1="75" x2="270" y2="120" stroke="#78350f" strokeWidth="1.5" strokeDasharray="4 3" />

            {/* ── LEMPENG A (KIRI) — BERGERAK PELAN KE KIRI ── */}
            <g
              style={{
                transform: isSimulating ? 'translateX(-34px)' : 'translateX(0)',
                transition: 'transform 3.5s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            >
              <rect x="20" y="75" width="220" height="45" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
              <rect x="20" y="75" width="220" height="8" fill="#475569" />
              <polygon points="50,60 25,68 50,76" fill="#facc15" />
              <rect x="50" y="64" width="45" height="8" fill="#facc15" />
              <text x="65" y="105" fill="#ffffff" fontSize="8.5" fontWeight="bold">
                LEMPENG A (MEMISAH KE KIRI)
              </text>
            </g>

            {/* ── LEMPENG B (KANAN) — BERGERAK PELAN KE KANAN ── */}
            <g
              style={{
                transform: isSimulating ? 'translateX(34px)' : 'translateX(0)',
                transition: 'transform 3.5s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            >
              <rect x="300" y="75" width="220" height="45" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
              <rect x="300" y="75" width="220" height="8" fill="#475569" />
              <polygon points="490,68 465,60 465,76" fill="#facc15" />
              <rect x="445" y="64" width="25" height="8" fill="#facc15" />
              <text x="315" y="105" fill="#ffffff" fontSize="8.5" fontWeight="bold">
                LEMPENG B (MEMISAH KE KANAN)
              </text>
            </g>

            {/* Banner Keterangan Dinamika */}
            <rect x="110" y="125" width="320" height="24" rx="4" fill="#0f172a" stroke="#ea580c" strokeWidth="1.5" />
            <text x="270" y="141" fill="#fef08a" fontSize="7.5" fontWeight="bold" textAnchor="middle">
              LEMPENG SALING MEMISAH MEMBENTUK LEMBAH RETAKAN (RIFT VALLEY)
            </text>
          </svg>
        </div>
      );

    // ═════════════════════════════════════════════════════════════════════════
    // 4. ANIMASI 2D PIXEL SUBDUKSI KONVERGEN (PERSIS SEPERTI LEVEL 1)
    // ═════════════════════════════════════════════════════════════════════════
    case 'convergent-subduction':
      return <ConvergentSubductionIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 5. TIGA BENTANG ALAM GEOLOGIS HASIL TUMBUKAN KONVERGEN
    // ═════════════════════════════════════════════════════════════════════════
    case 'convergent-landforms':
      return <ConvergentLandformsIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 6. SIMULATOR SESAR MEGATHRUST & GELOMBANG GEMPA DAHSYAT
    // ═════════════════════════════════════════════════════════════════════════
    case 'megathrust-earthquake':
      return <MegathrustIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 7. SISMOGRAF MEKANIK KE SINYAL LISTRIK & BUKTI 20 LEMPENG TEKTONIK
    // ═════════════════════════════════════════════════════════════════════════
    case 'seismograph-plates':
      return <SeismographPlatesIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 8. BATAS TRANSFORM & SESAR SAN ANDREAS (OFFSET STREAM KALIFORNIA)
    // ═════════════════════════════════════════════════════════════════════════
    case 'transform-sanandreas':
      return <TransformSanAndreasIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 9. MITIGASI GEMPA: TAS SIAGA BENCANA 72 JAM
    // ═════════════════════════════════════════════════════════════════════════
    case 'earthquake-prep':
      return <EarthquakePrepIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 10. MITIGASI GEMPA: STANDAR DROP, COVER, HOLD ON
    // ═════════════════════════════════════════════════════════════════════════
    case 'earthquake-action':
      return <EarthquakeActionIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 11. MITIGASI ERUPSI: 4 TINGKAT STATUS PVMBG & KRB MERAPI
    // ═════════════════════════════════════════════════════════════════════════
    case 'volcano-status':
      return <VolcanoStatusIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 12. MITIGASI ERUPSI: PROTOKOL EVAKUASI, MASKER & ANCAMAN LAHAR
    // ═════════════════════════════════════════════════════════════════════════
    case 'volcano-response':
      return <VolcanoResponseIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 13. PASCABENCANA: PROSEDUR KESELAMATAN & MEDIS DARURAT (BNPB)
    // ═════════════════════════════════════════════════════════════════════════
    case 'earthquake-post-safety':
      return <EarthquakePostSafetyIllustration />;

    // ═════════════════════════════════════════════════════════════════════════
    // 14. PASCABENCANA: MANAJEMEN TITIK KUMPUL & KOMUNIKASI RESMI (BNPB/BMKG)
    // ═════════════════════════════════════════════════════════════════════════
    case 'earthquake-post-coordination':
      return <EarthquakePostCoordinationIllustration />;

    default:
      return null;
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: PANGEA SUPERCONTINENT MAP (PERSIS DENGAN GAMBAR 4 & GAMBAR 5)
// ═════════════════════════════════════════════════════════════════════════════
function PangeaIllustration() {
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null);

  const colors = {
    ocean: '#93c5fd', // Light Azure Ocean
    shelf: '#475569', // Dark Gray Continental Shelf
    eurasia: '#c084fc', // Purple (Image 5)
    northAmerica: '#fb923c', // Coral Orange (Image 5)
    southAmerica: '#facc15', // Gold Yellow (Image 5)
    africa: '#84cc16', // Lime Green (Image 5)
    india: '#2dd4bf', // Turquoise (Image 5)
    antarctica: '#ea580c', // Deep Orange (Image 5)
    australia: '#3b82f6', // Royal Blue (Image 5)
    stroke: '#0f172a',
  };

  const plateDetails: Record<string, { title: string; desc: string }> = {
    eurasia: {
      title: 'EURASIA (Eropa & Asia)',
      desc: 'Massa daratan raksasa utara Pangea. Teluk Samudra Tethys menjorok ke sisi selatannya, dengan semenanjung panjang melengkung ke timur.',
    },
    northAmerica: {
      title: 'AMERIKA UTARA',
      desc: 'Menyatu erat dengan Eurasia di timur laut dan berhadapan langsung dengan pesisir barat laut Afrika.',
    },
    southAmerica: {
      title: 'AMERIKA SELATAN',
      desc: 'Bukti paling ikonik: Tonjolan timur Brasil mengunci secara presisi ke dalam Teluk Guinea di pesisir barat Afrika seperti teka-teki (puzzle)!',
    },
    africa: {
      title: 'AFRIKA',
      desc: 'Pusat poros Pangea! Bersentuhan langsung dengan Amerika Utara, Amerika Selatan, Eurasia, India, dan Antartika.',
    },
    india: {
      title: 'INDIA',
      desc: 'Kepingan benua yang terjepit di antara Afrika dan Antartika sebelum bergerak cepat melintasi Samudra Hindia menabrak Eurasia.',
    },
    antarctica: {
      title: 'ANTARTIKA',
      desc: 'Massa daratan di kutub selatan Pangea, dahulu beriklim tropis-hangat dan bersatu rapat dengan Australia.',
    },
    australia: {
      title: 'AUSTRALIA',
      desc: 'Melekat di pesisir timur benua Antartika sebelum retakan divergen memisahkannya ratusan juta tahun kemudian.',
    },
  };

  const activePlateInfo = selectedPlate ? plateDetails[selectedPlate] : null;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between bg-[#09090b] select-none p-1 sm:p-2 font-pixel">
      {/* Top Header Mode Toggle */}
      <div className="w-full flex items-center justify-between px-2.5 py-1 bg-slate-900/90 border border-amber-800/60 rounded-xl text-[10px] z-10 shadow-sm">
        <span className="text-amber-300 font-pixel-title font-bold flex items-center gap-1.5">
          <PixelIcon name="globe" size={14} className="text-amber-400" />
          <span>SUPERKONTINEN PANGEA (250 JUTA TAHUN LALU)</span>
        </span>
      </div>

      {/* Main SVG Pangea Map matching Image 4 & Image 5 */}
      <div className="w-full flex-1 relative flex items-center justify-center overflow-hidden my-1">
        <svg
          viewBox="0 0 540 500"
          className="w-full h-full max-h-[300px] sm:max-h-[320px] object-contain drop-shadow-xl"
        >
          {/* Lautan Samudra Panthalassa */}
          <rect x="0" y="0" width="540" height="500" fill={colors.ocean} rx="12" />

          {/* Garis Grid Samudra Halus */}
          <line x1="0" y1="250" x2="540" y2="250" stroke="#60a5fa" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
          <line x1="270" y1="0" x2="270" y2="500" stroke="#60a5fa" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
          <text x="525" y="246" fill="#1e3a8a" fontSize="8" fontStyle="italic" textAnchor="end" opacity="0.6">Khatulistiwa Purba</text>
          <text x="25" y="35" fill="#1e3a8a" fontSize="10" fontWeight="bold" opacity="0.7">SAMUDRA PANTHALASSA</text>

          {/* Teluk Tethys Label */}
          <g transform="translate(345, 235)">
            <text x="0" y="0" fill="#1e3a8a" fontSize="9" fontWeight="bold" opacity="0.75" fontStyle="italic">
              Teluk Tethys
            </text>
            <path d="M -10 6 Q 15 2, 40 6" fill="none" stroke="#2563eb" strokeWidth="1.5" opacity="0.6" />
          </g>

          {/* ── 1. CONTINENTAL SHELF MARGIN (ABU-ABU SESUAI GAMBAR 5) ── */}
          <path
            d="M 170 30 C 220 20, 280 20, 340 38 C 390 55, 420 90, 440 120 C 465 145, 455 175, 430 185 C 405 190, 375 190, 340 205 C 310 220, 290 240, 280 265 C 310 285, 345 310, 360 335 C 385 370, 385 405, 360 440 C 335 465, 290 480, 240 475 C 195 470, 160 450, 140 430 C 110 400, 80 355, 65 310 C 55 265, 60 220, 60 175 C 60 135, 80 100, 110 75 C 135 55, 150 40, 170 30 Z"
            fill={colors.shelf}
            stroke={colors.stroke}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* ── 2. INDIVIDUAL CONTINENTAL PLATES WITH ACCURATE CONTOURS ── */}

          {/* 2a. EURASIA (Purple in Image 5, Pale Green in Image 4) */}
          <g
            onMouseEnter={() => setSelectedPlate('eurasia')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('eurasia')}
            className="cursor-pointer transition-all hover:brightness-110"
          >
            {/* Single continuous natural contour without diamond splits */}
            <path
              d="M 145 68 C 165 48, 195 35, 230 30 C 275 25, 325 35, 365 60 C 395 80, 420 110, 435 135 C 450 160, 445 185, 425 190 C 410 190, 400 175, 380 170 C 350 175, 320 185, 290 195 C 260 205, 240 210, 230 205 C 215 200, 205 185, 190 165 C 175 145, 160 120, 145 95 C 140 85, 138 75, 145 68 Z"
              fill={colors.eurasia}
              stroke={selectedPlate === 'eurasia' ? '#fbbf24' : colors.stroke}
              strokeWidth={selectedPlate === 'eurasia' ? '3.5' : '2'}
              strokeLinejoin="round"
            />
            {/* Label Eurasia */}
            <text x="290" y="95" fill="#0f172a" fontSize="13" fontWeight="bold" textAnchor="middle" filter="drop-shadow(0px 1px 1px #fff)">
              Eurasia
            </text>
          </g>

          {/* 2b. NORTH AMERICA (Coral Orange in Image 5, Pale Green in Image 4) */}
          <g
            onMouseEnter={() => setSelectedPlate('northAmerica')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('northAmerica')}
            className="cursor-pointer transition-all hover:brightness-110"
          >
            <path
              d="M 145 68 C 130 78, 110 78, 95 88 C 75 103, 65 128, 70 158 C 60 188, 65 218, 75 248 C 80 263, 90 278, 105 283 C 125 283, 140 278, 150 263 C 160 243, 155 218, 170 183 C 175 163, 165 138, 155 115 C 150 95, 140 80, 145 68 Z"
              fill={colors.northAmerica}
              stroke={selectedPlate === 'northAmerica' ? '#fbbf24' : colors.stroke}
              strokeWidth={selectedPlate === 'northAmerica' ? '3.5' : '2'}
              strokeLinejoin="round"
            />
            {/* Label North America */}
            <text x="105" y="195" fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle" filter="drop-shadow(0px 1px 1px #fff)">
              North
            </text>
            <text x="105" y="210" fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle" filter="drop-shadow(0px 1px 1px #fff)">
              America
            </text>
          </g>

          {/* 2c. SOUTH AMERICA (Golden Yellow in Image 5, Pale Green in Image 4) */}
          <g
            onMouseEnter={() => setSelectedPlate('southAmerica')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('southAmerica')}
            className="cursor-pointer transition-all hover:brightness-110"
          >
            {/* Notice the prominent Eastern Bulge (Brazil) fitting into Africa's Gulf of Guinea */}
            <path
              d="M 105 283 C 85 288, 70 303, 75 328 C 80 353, 90 383, 110 413 C 125 433, 145 438, 155 428 C 165 408, 160 378, 170 348 C 180 328, 185 308, 175 293 C 165 278, 145 273, 125 283 Z"
              fill={colors.southAmerica}
              stroke={selectedPlate === 'southAmerica' ? '#fbbf24' : colors.stroke}
              strokeWidth={selectedPlate === 'southAmerica' ? '3.5' : '2'}
              strokeLinejoin="round"
            />
            {/* Label South America */}
            <text x="110" y="340" fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle" filter="drop-shadow(0px 1px 1px #fff)">
              South
            </text>
            <text x="110" y="355" fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle" filter="drop-shadow(0px 1px 1px #fff)">
              America
            </text>
          </g>

          {/* 2d. AFRICA (Lime Green in Image 5, Pale Green in Image 4) */}
          <g
            onMouseEnter={() => setSelectedPlate('africa')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('africa')}
            className="cursor-pointer transition-all hover:brightness-110"
          >
            {/* West coast Gulf of Guinea matches South America's bulge */}
            <path
              d="M 150 263 C 165 278, 175 293, 170 328 C 160 358, 165 388, 180 413 C 200 423, 225 408, 245 383 C 265 358, 285 328, 280 298 C 275 268, 255 243, 245 223 C 240 208, 220 208, 195 203 C 170 218, 160 243, 150 263 Z"
              fill={colors.africa}
              stroke={selectedPlate === 'africa' ? '#fbbf24' : colors.stroke}
              strokeWidth={selectedPlate === 'africa' ? '3.5' : '2'}
              strokeLinejoin="round"
            />
            {/* Label Africa */}
            <text x="210" y="315" fill="#0f172a" fontSize="12" fontWeight="bold" textAnchor="middle" filter="drop-shadow(0px 1px 1px #fff)">
              Africa
            </text>
          </g>

          {/* 2e. INDIA (Turquoise/Cyan in Image 5, Pale Green in Image 4) */}
          <g
            onMouseEnter={() => setSelectedPlate('india')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('india')}
            className="cursor-pointer transition-all hover:brightness-110"
          >
            <path
              d="M 280 298 C 295 303, 315 318, 320 338 C 315 358, 295 363, 280 358 C 265 353, 265 328, 280 298 Z"
              fill={colors.india}
              stroke={selectedPlate === 'india' ? '#fbbf24' : colors.stroke}
              strokeWidth={selectedPlate === 'india' ? '3.5' : '2'}
              strokeLinejoin="round"
            />
            {/* Label India */}
            <text x="295" y="338" fill="#0f172a" fontSize="9" fontWeight="bold" textAnchor="middle" filter="drop-shadow(0px 1px 1px #fff)">
              India
            </text>
          </g>

          {/* 2f. ANTARCTICA (Deep Orange in Image 5, Pale Green in Image 4) */}
          <g
            onMouseEnter={() => setSelectedPlate('antarctica')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('antarctica')}
            className="cursor-pointer transition-all hover:brightness-110"
          >
            <path
              d="M 180 413 C 205 428, 235 438, 270 448 C 310 453, 340 438, 345 408 C 345 378, 330 358, 310 358 C 295 363, 280 358, 265 358 C 245 383, 225 408, 180 413 Z"
              fill={colors.antarctica}
              stroke={selectedPlate === 'antarctica' ? '#fbbf24' : colors.stroke}
              strokeWidth={selectedPlate === 'antarctica' ? '3.5' : '2'}
              strokeLinejoin="round"
            />
            {/* Label Antarctica */}
            <text x="260" y="420" fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle" filter="drop-shadow(0px 1px 1px #fff)">
              Antarctica
            </text>
          </g>

          {/* 2g. AUSTRALIA (Royal Blue in Image 5, Pale Green in Image 4) */}
          <g
            onMouseEnter={() => setSelectedPlate('australia')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('australia')}
            className="cursor-pointer transition-all hover:brightness-110"
          >
            <path
              d="M 320 338 C 345 348, 375 373, 375 403 C 370 428, 345 438, 340 408 C 335 388, 330 358, 320 338 Z"
              fill={colors.australia}
              stroke={selectedPlate === 'australia' ? '#fbbf24' : colors.stroke}
              strokeWidth={selectedPlate === 'australia' ? '3.5' : '2'}
              strokeLinejoin="round"
            />
            {/* Label Australia (rotated along the plate angle) */}
            <g transform="translate(345, 395) rotate(-35)">
              <text x="0" y="0" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" filter="drop-shadow(0px 1px 1px #000)">
                Australia
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Bottom Interactive Educational Banner */}
      <div className="w-full bg-[#0f172a] border-2 border-amber-500/70 rounded-xl p-2 sm:p-2.5 text-slate-200 text-[10px] sm:text-xs z-10 flex items-center justify-between gap-2 shadow-md">
        {activePlateInfo ? (
          <div className="flex items-center gap-2 animate-fadeIn">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-pixel-title font-bold text-[10px] border border-amber-500/50 whitespace-nowrap">
              {activePlateInfo.title}
            </span>
            <span className="text-slate-300 font-medium leading-tight">
              {activePlateInfo.desc}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 italic">
            <PixelIcon name="bulb" size={12} className="text-amber-400" />
            <span className="text-amber-400 font-bold">PETUNJUK:</span>
            <span>Arahkan kursor atau sentuh tiap benua di atas untuk mempelajari kepingan Pangea!</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 4. SUB-KOMPONEN: ANIMASI 2D PIXEL SUBDUKSI KONVERGEN (PERSIS SEPERTI LEVEL 1)
// ═════════════════════════════════════════════════════════════════════════════
function ConvergentSubductionIllustration() {
  return (
    <div className="w-full h-full relative flex flex-col items-center justify-between p-1.5 sm:p-2 select-none">
      <div className="w-full flex items-center justify-between px-2 pb-1 border-b border-slate-800 z-10">
        <span className="text-[9px] font-pixel-title text-amber-400 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          PENAMPANG 3D SUBDUKSI &amp; PELEBURAN LEMPENG
        </span>
        <span className="text-[8px] text-slate-400 font-pixel">
          BATAS KONVERGEN: SAMUDRA vs BENUA
        </span>
      </div>

      <div className="w-full flex-1 min-h-0 relative flex items-center justify-center overflow-hidden my-1">
        <svg
          viewBox="0 0 560 250"
          className="w-full h-full object-contain drop-shadow-xl"
          shapeRendering="geometricPrecision"
        >
          <style>{`
            @keyframes subductSmoke {
              0% { transform: translateY(0px) scale(0.9); opacity: 0.8; }
              50% { transform: translateY(-7px) scale(1.15); opacity: 0.95; }
              100% { transform: translateY(-15px) scale(1.3); opacity: 0; }
            }
            @keyframes magmaMeltRise {
              0% { transform: translateY(0px); opacity: 0.3; }
              50% { opacity: 1; }
              100% { transform: translateY(-22px); opacity: 0.2; }
            }
            @keyframes arrowMoveRight {
              0%, 100% { transform: translateX(0px); filter: drop-shadow(0 0 2px rgba(255,255,255,0.4)); }
              50% { transform: translateX(12px); filter: drop-shadow(0 0 6px rgba(255,255,255,0.9)); }
            }
            @keyframes arrowMoveLeft {
              0%, 100% { transform: translateX(0px); filter: drop-shadow(0 0 2px rgba(255,255,255,0.4)); }
              50% { transform: translateX(-12px); filter: drop-shadow(0 0 6px rgba(255,255,255,0.9)); }
            }
            @keyframes waterGleam {
              0%, 100% { opacity: 0.45; }
              50% { opacity: 0.85; }
            }
            .anim-smoke-1 { animation: subductSmoke 2.6s ease-out infinite; transform-origin: 330px 55px; }
            .anim-smoke-2 { animation: subductSmoke 2.6s ease-out infinite 0.9s; transform-origin: 330px 55px; }
            .anim-smoke-3 { animation: subductSmoke 2.6s ease-out infinite 1.7s; transform-origin: 330px 55px; }
            .anim-magma-drip { animation: magmaMeltRise 2.2s linear infinite; }
            .anim-magma-drip-2 { animation: magmaMeltRise 2.2s linear infinite 0.7s; }
            .anim-magma-drip-3 { animation: magmaMeltRise 2.2s linear infinite 1.4s; }
            .anim-arrow-right { animation: arrowMoveRight 1.5s ease-in-out infinite; }
            .anim-arrow-left { animation: arrowMoveLeft 1.5s ease-in-out infinite; }
            .anim-water-ripple { animation: waterGleam 3s ease-in-out infinite; }
          `}</style>

          <defs>
            {/* Ocean water surface gradient */}
            <linearGradient id="oceanTopWater" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            {/* Ocean front water slice gradient */}
            <linearGradient id="oceanFrontWater" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
            </linearGradient>

            {/* Ocean left side water slice gradient */}
            <linearGradient id="oceanSideWater" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0369a1" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
            </linearGradient>

            {/* Asthenosphere Mantle (Front) */}
            <linearGradient id="asthenoFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="40%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>

            {/* Asthenosphere Mantle (Right 3D Face) */}
            <linearGradient id="asthenoSide" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c2410c" />
              <stop offset="100%" stopColor="#7c2d12" />
            </linearGradient>

            {/* Continental Land Surface (Top) */}
            <linearGradient id="contLandTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2d4be" />
              <stop offset="50%" stopColor="#d4b896" />
              <stop offset="100%" stopColor="#bfa07a" />
            </linearGradient>

            {/* Continental Crust (Front) */}
            <linearGradient id="contCrustFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78716c" />
              <stop offset="100%" stopColor="#57534e" />
            </linearGradient>

            {/* Continental Lithosphere (Front) */}
            <linearGradient id="contLithoFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            {/* Oceanic Lithosphere (Front) */}
            <linearGradient id="oceanLithoFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            {/* Volcano Cone Gradient */}
            <linearGradient id="volcanoConeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78716c" />
              <stop offset="40%" stopColor="#57534e" />
              <stop offset="100%" stopColor="#292524" />
            </linearGradient>

            {/* Magma Chamber Radial */}
            <radialGradient id="magmaGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#f97316" />
              <stop offset="80%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </radialGradient>
          </defs>

          {/* Sky Canvas Background */}
          <rect x="0" y="0" width="560" height="250" fill="#09090b" rx="8" />

          {/* ── 1. RIGHT 3D SIDE CUTAWAY FACE ── */}
          <g id="right-3d-side-face">
            {/* Asthenosphere Side Cutaway */}
            <polygon points="440,175 550,115 550,175 440,245" fill="url(#asthenoSide)" stroke="#431407" strokeWidth="1.5" />
            {/* Continental Lithosphere Side Cutaway */}
            <polygon points="440,140 550,85 550,115 440,175" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
            {/* Continental Crust Side Cutaway */}
            <polygon points="440,105 550,55 550,85 440,140" fill="#3f3f46" stroke="#18181b" strokeWidth="1.5" />
          </g>

          {/* ── 2. FRONT FACE: ASTHENOSPHERE (WARM ORANGE BASE LAYER - FILLS ENTIRE MANTLE DEPTH WITHOUT GAPS) ── */}
          <polygon points="15,130 440,130 440,245 15,245" fill="url(#asthenoFront)" stroke="#9a3412" strokeWidth="1.5" />

          {/* ── 3. FRONT FACE: CONTINENTAL LITHOSPHERE & CRUST ── */}
          <polygon points="215,140 440,140 440,175 275,175" fill="url(#contLithoFront)" stroke="#64748b" strokeWidth="1.5" />
          <polygon points="215,105 440,105 440,140 215,140" fill="url(#contCrustFront)" stroke="#292524" strokeWidth="1.5" />

          {/* ── 4. SUBDUCTING OCEANIC SLAB ── */}
          <path
            d="M 15,130 L 175,130 Q 200,132 230,160 L 330,245 L 270,245 L 180,165 Q 160,150 145,150 L 15,150 Z"
            fill="url(#oceanLithoFront)"
            stroke="#64748b"
            strokeWidth="1.5"
          />
          <path
            d="M 15,123 L 178,123 Q 205,125 235,155 L 336,245 L 330,245 L 230,160 Q 200,132 175,130 L 15,130 Z"
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="1.5"
          />

          {/* ── 5. TOP ISOMETRIC SURFACE: CONTINENTAL LANDMASS, VOLCANIC ARC & CRATER ── */}
          <polygon points="215,105 440,105 550,55 320,55" fill="url(#contLandTop)" stroke="#78350f" strokeWidth="1.5" />

          {/* Mountain Ridges / Volcanic Arc in the Background */}
          <polygon points="360,55 385,38 410,55" fill="#a88a68" stroke="#78350f" strokeWidth="1.2" />
          <polygon points="385,38 410,55 398,55" fill="#785938" />
          <polygon points="420,55 450,32 480,55" fill="#bfa07a" stroke="#78350f" strokeWidth="1.2" />
          <polygon points="450,32 480,55 465,55" fill="#8c6b45" />
          <polygon points="485,55 515,36 545,55" fill="#a88a68" stroke="#78350f" strokeWidth="1.2" />
          <polygon points="515,36 545,55 530,55" fill="#785938" />

          {/* Midground Hills around volcano */}
          <polygon points="280,75 305,58 330,75" fill="#bfa07a" stroke="#78350f" strokeWidth="1.2" />
          <polygon points="305,58 330,75 320,75" fill="#8c6b45" />

          {/* Active Stratovolcano Cone */}
          <polygon points="280,105 320,68 340,68 380,105" fill="url(#volcanoConeGrad)" stroke="#1c1917" strokeWidth="1.5" />
          <polygon points="330,68 380,105 355,105" fill="#1c1917" opacity="0.6" />
          <path d="M 326,70 Q 320,85 310,105" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 326,70 Q 320,85 310,105" fill="none" stroke="#fef08a" strokeWidth="1" strokeLinecap="round" />

          {/* Volcano Crater Rim & Magma Pool */}
          <ellipse cx="330" cy="68" rx="12" ry="4" fill="#0f172a" stroke="#78350f" strokeWidth="1.2" />
          <ellipse cx="330" cy="68.5" rx="8" ry="2.5" fill="#dc2626" />
          <ellipse cx="330" cy="68.5" rx="4" ry="1.2" fill="#fef08a" />

          {/* Billowing Ash Cloud & Smoke Plumes */}
          <g id="volcanic-smoke">
            <circle cx="330" cy="54" r="9" fill="#475569" opacity="0.9" className="anim-smoke-1" />
            <circle cx="322" cy="45" r="12" fill="#334155" opacity="0.92" className="anim-smoke-2" />
            <circle cx="338" cy="40" r="13" fill="#1e293b" opacity="0.95" className="anim-smoke-3" />
            <circle cx="325" cy="30" r="15" fill="#334155" opacity="0.9" className="anim-smoke-1" />
            <circle cx="342" cy="24" r="16" fill="#1e293b" opacity="0.85" className="anim-smoke-2" />
            <circle cx="328" cy="58" r="1.5" fill="#fef08a" />
            <circle cx="334" cy="52" r="1.2" fill="#f97316" />
            <circle cx="324" cy="46" r="1.5" fill="#ef4444" />
          </g>

          {/* ── 6. MAGMA CONDUIT, MAGMA CHAMBER & MELTING DROPLETS ── */}
          <path d="M 330,70 L 330,120" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
          <path d="M 330,70 L 330,120" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />

          {/* Magma Chamber Bulb */}
          <ellipse cx="330" cy="122" rx="16" ry="11" fill="url(#magmaGlow)" stroke="#7f1d1d" strokeWidth="1.5" />
          <ellipse cx="330" cy="122" rx="10" ry="6" fill="#fef08a" opacity="0.85" />

          {/* Rising Magma Droplets */}
          <g id="magma-melting-droplets">
            <circle cx="318" cy="142" r="3" fill="#ef4444" className="anim-magma-drip" />
            <circle cx="318" cy="142" r="1.5" fill="#fef08a" className="anim-magma-drip" />

            <circle cx="332" cy="148" r="3.5" fill="#dc2626" className="anim-magma-drip-2" />
            <circle cx="332" cy="148" r="1.8" fill="#fef08a" className="anim-magma-drip-2" />

            <circle cx="324" cy="160" r="2.8" fill="#ef4444" className="anim-magma-drip-3" />
            <circle cx="338" cy="168" r="3.2" fill="#ea580c" className="anim-magma-drip" />
            <circle cx="316" cy="175" r="2.5" fill="#f97316" className="anim-magma-drip-2" />
            <circle cx="330" cy="184" r="3" fill="#ef4444" className="anim-magma-drip-3" />
            <circle cx="322" cy="195" r="2.5" fill="#facc15" className="anim-magma-drip" />

            <line x1="316" y1="185" x2="318" y2="145" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
            <line x1="330" y1="195" x2="332" y2="140" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.75" />
            <line x1="338" y1="180" x2="336" y2="145" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.6" />
          </g>

          {/* ── 7. TOP ISOMETRIC SURFACE: OCEAN WATER BLOCK & TRENCH ── */}
          <polygon points="15,105 215,105 320,55 120,55" fill="url(#oceanTopWater)" stroke="#38bdf8" strokeWidth="1.5" />

          {/* Ocean Waves */}
          <g opacity="0.65" className="anim-water-ripple">
            <path d="M 40,95 Q 60,93 80,95 Q 100,97 120,95" fill="none" stroke="#e0f2fe" strokeWidth="1.2" />
            <path d="M 135,90 Q 155,88 175,90 Q 195,92 215,90" fill="none" stroke="#e0f2fe" strokeWidth="1.2" />
            <path d="M 70,80 Q 90,78 110,80 Q 130,82 150,80" fill="none" stroke="#bae6fd" strokeWidth="1.2" />
            <path d="M 160,75 Q 180,73 200,75 Q 220,77 240,75" fill="none" stroke="#bae6fd" strokeWidth="1.2" />
            <path d="M 110,65 Q 130,63 150,65 Q 170,67 190,65" fill="none" stroke="#ffffff" strokeWidth="1" />
          </g>

          {/* Coastline / Beach & Trench Boundary */}
          <path
            d="M 215,105 Q 235,95 250,85 Q 275,75 320,55"
            fill="none"
            stroke="#fde68a"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 215,105 Q 235,95 250,85 Q 275,75 320,55"
            fill="none"
            stroke="#0284c7"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Front Cutaway Water Slice */}
          <polygon points="15,105 215,105 215,123 15,123" fill="url(#oceanFrontWater)" stroke="#0284c7" strokeWidth="1.5" />

          {/* Left Side Cutaway Water Slice */}
          <polygon points="15,105 120,55 120,68 15,123" fill="url(#oceanSideWater)" stroke="#0369a1" strokeWidth="1.5" />

          {/* ── 8. WHITE MOVEMENT ARROWS (PLATE DYNAMICS - NO TEXT ON DIAGRAM) ── */}
          {/* Arrow 1: Oceanic Lithosphere Moving Right (➔) */}
          <g id="arrow-oceanic" className="anim-arrow-right" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))">
            <polygon points="85,137 125,137 125,131 145,142 125,153 125,147 85,147" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
          </g>

          {/* Arrow 2: Continental Lithosphere Moving Left (⬅) */}
          <g id="arrow-continental" className="anim-arrow-left" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))">
            <polygon points="385,155 345,155 345,149 325,160 345,171 345,165 385,165" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
          </g>
        </svg>
      </div>

      <div className="w-full bg-[#0f172a] border border-amber-500/50 rounded-xl p-2 text-slate-300 text-[10px] flex items-center justify-between gap-2 shadow">
        <span className="font-bold text-amber-400 shrink-0">INTI SAINS:</span>
        <span className="leading-tight">
          Lempeng samudra yang padat menunjam (subduksi) ke astenosfer mantel di bawah lempeng benua. Panas mantel bumi meleburkan batuan menjadi magma pijar yang naik ke atas melahirkan barisan gunung berapi aktif!
        </span>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 5. SUB-KOMPONEN: TIGA BENTANG ALAM GEOLOGIS HASIL TUMBUKAN KONVERGEN
// ═════════════════════════════════════════════════════════════════════════════
function ConvergentLandformsIllustration() {
  const [selectedLandform, setSelectedLandform] = useState<'trench' | 'mountains' | 'volcano'>('trench');

  const landformDetails = {
    trench: {
      title: '1. PALUNG LAUT DALAM (DEEP SEA TRENCH)',
      subtitle: 'Ngarai Dasar Laut Terdalam di Bumi',
      points: [
        { icon: 'arrow-down', text: 'Terbentuk saat lempeng samudra yang berat menunjam curam ke bawah lempeng benua.' },
        { icon: 'search', text: 'Kedalaman 7.000 - 11.000 m! Palung Mariana adalah titik terdalam di dunia (11.034 m).' },
        { icon: 'bulb', text: 'Fakta: Gunung Everest (8.848 m) masih tenggelam >2.000 m jika dimasukkan ke palung ini!' },
      ],
      badgeColor: 'border-cyan-500 bg-cyan-950/90 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)]',
      textColor: 'text-cyan-400',
    },
    mountains: {
      title: '2. RANTAI PEGUNUNGAN LIPATAN (FOLDED MOUNTAINS)',
      subtitle: 'Daratan Terangkat Akibat Tumbukan Lempeng',
      points: [
        { icon: 'layers', text: 'Dua lempeng saling menekan kuat, meremas dan melipat lapisan batuan kerak benua ke atas.' },
        { icon: 'flag', text: 'Puncak lipatan disebut Antiklin, sedangkan lembah cekungannya disebut Sinklin.' },
        { icon: 'check', text: 'Contoh nyata: Pegunungan Bukit Barisan di Sumatra dan Pegunungan Himalaya di Asia.' },
      ],
      badgeColor: 'border-amber-500 bg-amber-950/90 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
      textColor: 'text-amber-400',
    },
    volcano: {
      title: '3. BUSUR GUNUNG BERAPI AKTIF (VOLCANIC ARC)',
      subtitle: 'Jalur Erupsi Magma Peleburan Lempeng',
      points: [
        { icon: 'zap', text: 'Lempeng yang menunjam meleleh di mantel bumi bersuhu >1.200°C menjadi batuan cair (magma).' },
        { icon: 'arrow-up', text: 'Magma panas yang lebih ringan mendesak naik ke permukaan membentuk kantung magma.' },
        { icon: 'shield', text: 'Melahirkan jalur gunung berapi aktif Nusantara seperti Gunung Merapi, Semeru, & Krakatau.' },
      ],
      badgeColor: 'border-rose-500 bg-rose-950/90 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.25)]',
      textColor: 'text-rose-400',
    },
  };

  const current = landformDetails[selectedLandform];

  return (
    <div className="w-full h-full relative flex flex-col justify-between select-none">
      {/* Tab Switcher Top - Padding cukup agar tombol atas tidak terpotong */}
      <div className="w-full pt-2.5 px-2 sm:px-3 pb-2 flex items-center justify-between border-b border-slate-800 bg-slate-950/95 z-20 shrink-0 gap-1 overflow-x-auto">
        <span className="text-[8.5px] sm:text-[9.5px] font-pixel-title text-amber-400 font-bold shrink-0 flex items-center gap-1.5">
          <PixelIcon name="layers" size={13} className="text-amber-400" />
          <span className="hidden sm:inline">PILIH BENTANG ALAM:</span>
          <span className="sm:hidden">BENTANG ALAM:</span>
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              retroAudio.playSelect();
              setSelectedLandform('trench');
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[8px] sm:text-[9px] font-pixel-title cursor-pointer transition-colors border-2 ${selectedLandform === 'trench'
              ? 'bg-cyan-600 text-white border-cyan-300 shadow-[0_2px_0_#083344]'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
              }`}
          >
            [1. PALUNG LAUT]
          </button>
          <button
            onClick={() => {
              retroAudio.playSelect();
              setSelectedLandform('mountains');
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[8px] sm:text-[9px] font-pixel-title cursor-pointer transition-colors border-2 ${selectedLandform === 'mountains'
              ? 'bg-amber-600 text-white border-amber-300 shadow-[0_2px_0_#451a03]'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
              }`}
          >
            [2. PEGUNUNGAN]
          </button>
          <button
            onClick={() => {
              retroAudio.playSelect();
              setSelectedLandform('volcano');
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[8px] sm:text-[9px] font-pixel-title cursor-pointer transition-colors border-2 ${selectedLandform === 'volcano'
              ? 'bg-rose-600 text-white border-rose-300 shadow-[0_2px_0_#4c0519]'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
              }`}
          >
            [3. GUNUNG BERAPI]
          </button>
        </div>
      </div>

      {/* Main Illustration Canvas: Berganti Penuh Sesuai Tab Terpilih */}
      <div className="w-full flex-1 min-h-0 relative flex items-center justify-center overflow-hidden">
        {selectedLandform === 'trench' && <TrenchIllustration />}
        {selectedLandform === 'mountains' && <FoldedMountainsIllustration />}
        {selectedLandform === 'volcano' && <VolcanoIllustration />}
      </div>

      {/* Dynamic Detail Card with bite-sized points for SMP Kelas 8 */}
      <div className={`w-full border-t-2 sm:border-2 sm:rounded-xl p-2 sm:p-2.5 text-xs z-10 flex flex-col gap-1 shadow-lg shrink-0 ${current.badgeColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <PixelIcon name="bulb" size={14} className={current.textColor} />
            <span className="font-pixel-title text-[9px] sm:text-[10px] font-bold">
              {current.title}
            </span>
          </div>
          <span className="text-[8px] opacity-80 font-mono uppercase hidden sm:inline">
            {current.subtitle}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 pt-0.5">
          {current.points.map((pt, idx) => (
            <div key={idx} className="bg-black/35 rounded-lg p-1.5 border border-white/10 flex items-start gap-1.5">
              <PixelIcon name={pt.icon as any} size={11} className={`shrink-0 mt-0.5 ${current.textColor}`} />
              <span className="text-[8.5px] sm:text-[9px] leading-snug text-slate-100 font-medium">
                {pt.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GAMBAR 1: PALUNG LAUT DALAM (DEEP SEA TRENCH) — SESUAI 4 FOTO REFERENSI
// Kapal riset permukaan, jurang karang terjal, kapsul selam lampu sorot, skala kedalaman & komparasi Mt. Everest
// ─────────────────────────────────────────────────────────────────────────────
function TrenchIllustration() {
  return (
    <svg viewBox="0 0 560 250" className="w-full h-full object-contain" shapeRendering="geometricPrecision">
      <defs>
        {/* Sky gradient */}
        <linearGradient id="tSkyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>

        {/* Ocean water layers gradient */}
        <linearGradient id="tWaterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="15%" stopColor="#0369a1" />
          <stop offset="40%" stopColor="#1e3a8a" />
          <stop offset="70%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        {/* Headlight cone of yellow research submersible */}
        <linearGradient id="subLightCone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
          <stop offset="40%" stopColor="#7dd3fc" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
        </linearGradient>

        {/* Continental rock wall gradient */}
        <linearGradient id="rockWallGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#44403c" />
          <stop offset="50%" stopColor="#292524" />
          <stop offset="100%" stopColor="#1c1917" />
        </linearGradient>

        {/* Mount Everest Underwater Depth Overlay Gradient */}
        <linearGradient id="everestDepthTint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
          <stop offset="35%" stopColor="#0284c7" stopOpacity="0.25" />
          <stop offset="70%" stopColor="#0f172a" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0.92" />
        </linearGradient>

        {/* Himalayan Rock Strata (Yellow Band) Gradient */}
        <linearGradient id="yellowBandGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a8a29e" />
          <stop offset="40%" stopColor="#d6d3d1" />
          <stop offset="70%" stopColor="#78716c" />
          <stop offset="100%" stopColor="#57534e" />
        </linearGradient>

        {/* Sunlit Snow Gradient */}
        <linearGradient id="sunlitSnowGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#f0f9ff" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>

        {/* Shaded Snow / Ice Gradient */}
        <linearGradient id="shadedIceGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>

      {/* 1. Langit Permukaan Laut */}
      <rect x="0" y="0" width="560" height="38" fill="url(#tSkyGrad)" />
      {/* Matahari & Cahaya Permukaan */}
      <circle cx="280" cy="12" r="9" fill="#fef08a" />
      <circle cx="280" cy="12" r="16" fill="#fde047" opacity="0.3" />
      {/* Burung Camar Kecil */}
      <path d="M 120,12 Q 124,8 128,12 Q 132,8 136,12" fill="none" stroke="#0369a1" strokeWidth="1" />
      <path d="M 390,14 Q 394,10 398,14 Q 402,10 406,14" fill="none" stroke="#0369a1" strokeWidth="1" />

      {/* 2. Kolom Air Samudra Biru hingga Jurang Hitam */}
      <rect x="0" y="38" width="560" height="212" fill="url(#tWaterGrad)" />

      {/* Berkas Sinar Matahari Tembus Air (Sunbeams 0 - 200m) */}
      <polygon points="260,38 275,38 295,95 240,95" fill="#bae6fd" opacity="0.18" />
      <polygon points="285,38 298,38 340,95 290,95" fill="#bae6fd" opacity="0.15" />

      {/* Permukaan Air Laut Beriak */}
      <line x1="0" y1="38" x2="560" y2="38" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 3" />

      {/* 3. Kapal Riset Kelautan (Sesuai Foto Referensi 2) */}
      <g>
        {/* Lambung Kapal Putih & Garis Biru */}
        <polygon points="190,26 248,26 242,38 196,38" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
        <line x1="192" y1="31" x2="246" y2="31" stroke="#1d4ed8" strokeWidth="1.5" />
        <line x1="196" y1="38" x2="242" y2="38" stroke="#dc2626" strokeWidth="1.5" />
        {/* Anjungan & Radar Kapal */}
        <rect x="202" y="18" width="22" height="8" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
        <rect x="204" y="20" width="4" height="3" fill="#38bdf8" />
        <rect x="210" y="20" width="4" height="3" fill="#38bdf8" />
        <rect x="216" y="20" width="4" height="3" fill="#38bdf8" />
        <line x1="213" y1="18" x2="213" y2="12" stroke="#475569" strokeWidth="1" />
        <circle cx="213" cy="11" r="2" fill="#e2e8f0" />
        {/* Crane Belakang & Kabel Winch ke Laut */}
        <polygon points="234,26 238,18 240,18 238,26" fill="#334155" />
        <line x1="239" y1="18" x2="239" y2="135" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
        {/* Bendera Riset Merah Putih */}
        <rect x="200" y="14" width="4" height="2" fill="#ef4444" />
        <rect x="200" y="16" width="4" height="2" fill="#ffffff" />
      </g>

      {/* 4. Dinding Tebing Karang Ngarai Palung (Sesuai Foto Referensi 2 & 3) */}
      {/* Tebing Kiri: Landasan & Lereng Benua Curam */}
      <polygon
        points="55,55 110,65 145,100 170,140 195,190 220,246 0,246 0,55"
        fill="url(#rockWallGrad)"
        stroke="#1c1917"
        strokeWidth="1.5"
      />
      {/* Garis-Garis Fissure Batuan Karang Kiri */}
      <path d="M 60,65 L 105,72 L 135,115 L 165,155 L 190,210" fill="none" stroke="#57534e" strokeWidth="1" />
      <path d="M 95,95 L 125,105 L 140,145 L 175,195" fill="none" stroke="#1c1917" strokeWidth="1.5" />
      <text x="65" y="70" fill="#a8a29e" fontSize="6.5" fontWeight="bold">LANDASAN BENUA</text>
      <text x="105" y="115" fill="#78716c" fontSize="6" fontWeight="bold">LERENG BENUA</text>

      {/* Tebing Kanan: Lempeng Samudra & Ngarai Menjorok */}
      <polygon
        points="370,110 330,125 295,160 265,210 245,246 560,246 560,110"
        fill="url(#rockWallGrad)"
        stroke="#1c1917"
        strokeWidth="1.5"
      />
      {/* Fissure Batuan Tebing Kanan */}
      <path d="M 355,120 L 320,135 L 290,175 L 260,225" fill="none" stroke="#57534e" strokeWidth="1" />
      <path d="M 330,150 L 305,185 L 280,230" fill="none" stroke="#1c1917" strokeWidth="1.5" />

      {/* Dasar Palung Terdalam (V-Shaped Notch Abyss) */}
      <rect x="220" y="244" width="26" height="6" fill="#020617" />
      <line x1="220" y1="246" x2="246" y2="246" stroke="#0ea5e9" strokeWidth="1.5" />

      {/* 5. Lampu Sorot & Kapsul Selam Riset James Cameron (Foto Referensi 2) */}
      {/* Sorotan Lampu Menembus Jurang Gelap */}
      <polygon points="236,146 242,146 270,246 200,246" fill="url(#subLightCone)" />

      {/* Kapsul Selam Kuning (Deepsea Submersible) */}
      <g>
        <rect x="233" y="132" width="12" height="22" rx="5" fill="#facc15" stroke="#713f12" strokeWidth="1.2" />
        {/* Kubah Kaca Pengamat Cyan */}
        <circle cx="239" cy="138" r="3.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" />
        <circle cx="238" cy="137" r="1" fill="#ffffff" />
        {/* Baling-Baling / Pendorong Samping */}
        <rect x="230" y="140" width="3" height="6" rx="1" fill="#475569" />
        <rect x="245" y="140" width="3" height="6" rx="1" fill="#475569" />
        {/* Lampu Sorot Ganda */}
        <circle cx="236" cy="146" r="1.5" fill="#fef08a" />
        <circle cx="242" cy="146" r="1.5" fill="#fef08a" />
      </g>

      {/* 6. Komparasi Gunung Everest Realistis (Sesuai Foto Referensi 3, 4, 5) */}
      <g id="realistic-mount-everest">
        {/* 1. Massive Mountain Base Silhouette (Wide Himalayan Triangle) */}
        <polygon
          points="
            390,78 
            410,95 435,120 460,150 485,185 515,220 530,246
            250,246 265,220 295,185 320,150 345,120 370,95
          "
          fill="#1e293b"
          stroke="#0f172a"
          strokeWidth="1.5"
        />

        {/* 2. Lower Mountain Flanks & Scree Slopes (Dark Rock Base with Snow Patches) */}
        <polygon
          points="250,246 530,246 500,205 440,195 380,210 320,195 270,215"
          fill="#0f172a"
        />
        {/* Lower Glacial Moraine Textures */}
        <polygon points="280,246 320,205 340,246" fill="#334155" opacity="0.7" />
        <polygon points="360,246 390,212 420,246" fill="#334155" opacity="0.7" />
        <polygon points="440,246 470,208 500,246" fill="#334155" opacity="0.7" />

        {/* 3. Broad North Face Mid-Slope Snowfields (Main Ice Body) */}
        <polygon
          points="
            370,95 390,78 410,95 
            425,125 450,165 470,210
            310,210 330,165 355,125
          "
          fill="url(#sunlitSnowGrad)"
        />

        {/* 4. East Face (Right Shaded Flank) */}
        <polygon
          points="390,78 410,95 425,125 450,165 470,210 505,215 485,185 460,150 435,120 410,95"
          fill="url(#shadedIceGrad)"
          opacity="0.85"
        />

        {/* 5. Famous Yellow Band Strata (Horizontal Limestone Cliff across face - Image 4) */}
        <polygon
          points="355,120 435,120 442,132 350,132"
          fill="url(#yellowBandGrad)"
          stroke="#44403c"
          strokeWidth="1"
        />
        {/* Second Step / Dark Rock Band below Yellow Band */}
        <polygon
          points="348,135 444,135 447,144 345,144"
          fill="#334155"
          stroke="#1e293b"
          strokeWidth="0.8"
        />

        {/* 6. Iconic Triangular Summit Horn Pyramid (Everest Peak) */}
        <polygon points="390,78 375,98 405,98" fill="#ffffff" />
        <polygon points="390,78 405,98 395,102 388,88" fill="#0f172a" opacity="0.65" />
        <polygon points="390,78 392,84 388,84" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />

        {/* 7. Main Central Ridge (Northeast Ridge Divider line running down from summit) */}
        <path
          d="M 390,78 L 388,98 L 392,120 L 386,145 L 390,175 L 385,210 L 388,246"
          fill="none"
          stroke="#0f172a"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M 389,78 L 387,98 L 391,120 L 385,145 L 389,175 L 384,210 L 387,246"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* 8. Deep Vertical Snow Couloirs (Norton Couloir & Hornbein Couloir - Image 4) */}
        <path
          d="M 378,98 L 368,145 L 350,185 L 335,225"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.95"
        />
        <path
          d="M 378,98 L 368,145 L 350,185 L 335,225"
          fill="none"
          stroke="#e0f2fe"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 365,115 L 348,155 L 328,195 L 310,235"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M 402,105 L 418,145 L 438,185 L 460,225"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* 9. Rocky Crags and Arêtes across North Face */}
        <polygon points="362,105 372,102 368,115 358,112" fill="#1e293b" />
        <polygon points="378,148 385,145 382,162 375,160" fill="#1e293b" />
        <polygon points="352,165 362,160 358,180 348,178" fill="#1e293b" />
        <polygon points="335,190 348,185 342,208 330,205" fill="#1e293b" />
        <polygon points="410,135 422,130 418,148 408,145" fill="#0f172a" />
        <polygon points="425,168 438,162 432,185 422,182" fill="#0f172a" />
        <polygon points="445,200 460,195 452,220 440,218" fill="#0f172a" />

        {/* 10. Atmospheric Depth Shading (Subtle Underwater Blend) */}
        <polygon
          points="
            390,78 
            410,95 435,120 460,150 485,185 515,220 530,246
            250,246 265,220 295,185 320,150 345,120 370,95
          "
          fill="url(#everestDepthTint)"
        />

        {/* 11. Horizontal Dashed Guide Line from Summit (Y=78) to Depth Ruler */}
        <line
          x1="55"
          y1="78"
          x2="390"
          y2="78"
          stroke="#38bdf8"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          opacity="0.8"
        />

        {/* 12. Summit Elevation Point (Clean static golden dot without any smoke or pulsing) */}
        <circle cx="390" cy="78" r="3" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.2" />

        {/* 13. Information Callout Card above Summit */}
        <g id="everest-callout">
          <rect
            x="270"
            y="42"
            width="240"
            height="28"
            rx="4"
            fill="#082f49"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />
          <text x="390" y="54" fill="#fef08a" fontSize="7" fontWeight="bold" textAnchor="middle">
            ▲ MT. EVEREST (8.848 m)
          </text>
          <text x="390" y="63" fill="#7dd3fc" fontSize="5.2" fontWeight="bold" textAnchor="middle">
            PUNCAK TERTINGGI BUMI TENGGELAM &gt;2.000 m DI PALUNG MARIANA!
          </text>
          <polygon points="386,70 394,70 390,76" fill="#38bdf8" />
        </g>
      </g>

      {/* 7. Biota Laut Dalam (Sesuai Foto Referensi 5) */}
      {/* Ikan Paus (Sperm Whale) di Zona Sedang */}
      <path d="M 85,75 Q 98,70 110,75 Q 115,80 110,83 Q 95,85 85,75 Z" fill="#334155" opacity="0.6" />
      {/* Ikan Sungut Ganda (Anglerfish) dengan Antena Pijar di Zona Gelap */}
      <g transform="translate(170, 160)">
        <ellipse cx="0" cy="0" rx="4" ry="3" fill="#3f3f46" />
        <path d="M 0,-3 Q 3,-6 5,-4" fill="none" stroke="#e4e4e7" strokeWidth="0.8" />
        <circle cx="5" cy="-4" r="1" fill="#fef08a" />
      </g>

      {/* 8. Skala Mistar Kedalaman di Sisi Kiri (Sesuai Foto Referensi 3 & 5) */}
      <g>
        {/* Garis Vertikal Mistar */}
        <line x1="30" y1="38" x2="30" y2="246" stroke="#94a3b8" strokeWidth="1" />

        {/* Tick 0 m */}
        <line x1="26" y1="38" x2="34" y2="38" stroke="#94a3b8" strokeWidth="1" />
        <text x="24" y="41" fill="#bae6fd" fontSize="5.5" textAnchor="end" fontWeight="bold">0 m</text>

        {/* Tick 200 m (Zona Sinar) */}
        <line x1="26" y1="65" x2="34" y2="65" stroke="#94a3b8" strokeWidth="1" />
        <line x1="34" y1="65" x2="180" y2="65" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />
        <text x="24" y="68" fill="#7dd3fc" fontSize="5.5" textAnchor="end">200 m</text>
        <text x="36" y="63" fill="#38bdf8" fontSize="5" opacity="0.8">Zona Terang</text>

        {/* Tick 1.000 m (Zona Senja) */}
        <line x1="26" y1="105" x2="34" y2="105" stroke="#94a3b8" strokeWidth="1" />
        <line x1="34" y1="105" x2="250" y2="105" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.25" />
        <text x="24" y="108" fill="#93c5fd" fontSize="5.5" textAnchor="end">1.000 m</text>

        {/* Tick 4.000 m (Zona Gelap Abisal) */}
        <line x1="26" y1="165" x2="34" y2="165" stroke="#94a3b8" strokeWidth="1" />
        <line x1="34" y1="165" x2="270" y2="165" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.2" />
        <text x="24" y="168" fill="#cbd5e1" fontSize="5.5" textAnchor="end">4.000 m</text>
        <text x="36" y="163" fill="#94a3b8" fontSize="5" opacity="0.8">Zona Gelap Abisal</text>

        {/* Tick 11.000 m (Dasar Palung Mariana) */}
        <line x1="26" y1="246" x2="34" y2="246" stroke="#facc15" strokeWidth="1.5" />
        <text x="24" y="248" fill="#facc15" fontSize="6" textAnchor="end" fontWeight="bold">11.000 m</text>
      </g>

      {/* Label Titik Terdalam Palung */}
      <rect x="180" y="234" width="105" height="12" rx="2" fill="#020617" stroke="#38bdf8" strokeWidth="1" />
      <text x="232" y="242" fill="#38bdf8" fontSize="6" fontWeight="bold" textAnchor="middle">
        CHALLENGER DEEP: 11.034 m
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GAMBAR 2: RANTAI PEGUNUNGAN LIPATAN (FOLDED MOUNTAINS)
// Kompresi mendatar dua lempeng, puncak lipatan antiklin, lembah sinklin & puncak salju
// ─────────────────────────────────────────────────────────────────────────────
function FoldedMountainsIllustration() {
  return (
    <svg viewBox="0 0 560 250" className="w-full h-full object-contain" shapeRendering="geometricPrecision">
      <defs>
        {/* Alpine Sky */}
        <linearGradient id="alpSkyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="60%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>

        {/* Rock layer gradients */}
        <linearGradient id="layerSediment" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ca8a04" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
      </defs>

      {/* 1. Langit Alpin Biru Cerah */}
      <rect x="0" y="0" width="560" height="105" fill="url(#alpSkyGrad)" />
      {/* Matahari Gunung */}
      <circle cx="90" cy="25" r="10" fill="#fef08a" />
      <circle cx="90" cy="25" r="18" fill="#fde047" opacity="0.3" />
      {/* Burung Rajawali Pegunungan */}
      <path d="M 440,25 Q 445,18 450,25 Q 455,18 460,25" fill="none" stroke="#0f172a" strokeWidth="1.2" />

      {/* 2. Pegunungan Latar Belakang (Distant Ranges) */}
      <polygon points="50,105 130,45 210,105" fill="#475569" opacity="0.6" />
      <polygon points="120,52 130,45 140,52" fill="#f8fafc" opacity="0.8" />
      <polygon points="350,105 430,40 510,105" fill="#475569" opacity="0.6" />
      <polygon points="420,48 430,40 440,48" fill="#f8fafc" opacity="0.8" />

      {/* 3. Barisan Puncak Lipatan Depan (Towering Folded Peaks) */}
      {/* Puncak Kiri (Bukit Lipatan Barat) */}
      <polygon points="0,105 90,48 180,105" fill="#64748b" />
      <polygon points="90,48 180,105 150,105" fill="#475569" />
      <polygon points="75,58 90,48 105,58 95,65 85,65" fill="#f8fafc" />

      {/* Puncak Tengah (Puncak Utama Tertinggi - Antiklin Akbar) */}
      <polygon points="170,105 280,24 390,105" fill="#64748b" />
      <polygon points="280,24 390,105 340,105" fill="#334155" />
      {/* Gletser & Topi Salju Abadi */}
      <polygon points="260,38 280,24 300,38 290,48 275,50 268,44" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <polygon points="280,24 300,38 290,48 280,36" fill="#cbd5e1" />

      {/* Puncak Kanan */}
      <polygon points="380,105 460,42 540,105" fill="#64748b" />
      <polygon points="460,42 540,105 500,105" fill="#475569" />
      <polygon points="445,52 460,42 475,52 465,60 455,60" fill="#f8fafc" />

      {/* Hutan Pinus & Lembah Hijau Kaki Gunung */}
      <rect x="0" y="98" width="560" height="7" fill="#15803d" />
      {/* Siluet Pohon Cemara */}
      {[40, 70, 110, 140, 200, 230, 330, 360, 410, 490, 520].map((tx, idx) => (
        <polygon key={idx} points={`${tx},98 ${tx + 3},91 ${tx + 6},98`} fill="#14532d" />
      ))}

      {/* 4. Penampang Bawah Tanah: Lapisan Batuan Terlipat (Antiklin & Sinklin) */}
      {/* Latar Kerak Benua */}
      <rect x="0" y="105" width="560" height="145" fill="#1e293b" />

      {/* Lapisan 1: Sedimen Kuning Emas Terlipat */}
      <path
        d="M 0,105 Q 60,78 120,108 Q 200,150 280,105 Q 360,150 440,108 Q 500,78 560,105 L 560,135 Q 500,108 440,138 Q 360,180 280,135 Q 200,180 120,138 Q 60,108 0,135 Z"
        fill="url(#layerSediment)"
        stroke="#78350f"
        strokeWidth="1.5"
      />

      {/* Lapisan 2: Batu Kapur Biru Abu-Abu Terlipat */}
      <path
        d="M 0,135 Q 60,108 120,138 Q 200,180 280,135 Q 360,180 440,138 Q 500,108 560,135 L 560,165 Q 500,138 440,168 Q 360,210 280,165 Q 200,210 120,168 Q 60,138 0,165 Z"
        fill="#475569"
        stroke="#0f172a"
        strokeWidth="1.5"
      />

      {/* Lapisan 3: Serpih Hijau Zaitun Terlipat */}
      <path
        d="M 0,165 Q 60,138 120,168 Q 200,210 280,165 Q 360,210 440,168 Q 500,138 560,165 L 560,195 Q 500,168 440,198 Q 360,240 280,195 Q 200,240 120,198 Q 60,168 0,195 Z"
        fill="#166534"
        stroke="#052e16"
        strokeWidth="1.5"
      />

      {/* Lapisan 4: Granit Merah Kerak Bawah */}
      <path
        d="M 0,195 Q 60,168 120,198 Q 200,240 280,195 Q 360,240 440,198 Q 500,168 560,195 L 560,250 L 0,250 Z"
        fill="#7f1d1d"
        stroke="#450a0a"
        strokeWidth="1.5"
      />

      {/* 5. Panah Gaya Kompresi Mendatar Lempeng */}
      {/* Panah Kiri Mendorong ke Kanan */}
      <g>
        <rect x="20" y="165" width="60" height="18" rx="3" fill="#ea580c" stroke="#fef08a" strokeWidth="1.5" />
        <text x="32" y="177" fill="#ffffff" fontSize="6.5" fontWeight="bold">TEKANAN</text>
        <polygon points="80,162 94,174 80,186" fill="#facc15" stroke="#78350f" strokeWidth="1" />
      </g>

      {/* Panah Kanan Mendorong ke Kiri */}
      <g>
        <rect x="480" y="165" width="60" height="18" rx="3" fill="#ea580c" stroke="#fef08a" strokeWidth="1.5" />
        <text x="490" y="177" fill="#ffffff" fontSize="6.5" fontWeight="bold">TEKANAN</text>
        <polygon points="480,162 466,174 480,186" fill="#facc15" stroke="#78350f" strokeWidth="1" />
      </g>

      {/* 6. Label Edukatif Antiklin & Sinklin */}
      {/* Callout Antiklin (Puncak Lipatan) */}
      <g>
        <rect x="215" y="70" width="130" height="18" rx="3" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="280" y="82" fill="#fef08a" fontSize="6.5" fontWeight="bold" textAnchor="middle">
          PUNCAK LIPATAN (ANTIKLIN)
        </text>
        <line x1="280" y1="88" x2="280" y2="105" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="280" cy="105" r="3" fill="#fef08a" />
      </g>

      {/* Callout Sinklin (Lembah Lipatan) */}
      <g>
        <rect x="145" y="195" width="125" height="18" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="207" y="207" fill="#7dd3fc" fontSize="6.5" fontWeight="bold" textAnchor="middle">
          LEMBAH LIPATAN (SINKLIN)
        </text>
        <line x1="200" y1="195" x2="200" y2="155" stroke="#38bdf8" strokeWidth="1.5" />
        <circle cx="200" cy="155" r="3" fill="#38bdf8" />
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GAMBAR 3: BUSUR GUNUNG BERAPI AKTIF (VOLCANIC ARC / STRATOVOLCANO)
// Subduksi lempeng, peleburan magma di mantel, dapur magma & erupsi stratovolcano
// ─────────────────────────────────────────────────────────────────────────────
function VolcanoIllustration() {
  return (
    <svg viewBox="0 0 560 250" className="w-full h-full object-contain" shapeRendering="geometricPrecision">
      <defs>
        {/* Sky gradient twilight volcanic */}
        <linearGradient id="volSkyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#18181b" />
          <stop offset="60%" stopColor="#27272a" />
          <stop offset="100%" stopColor="#3f3f46" />
        </linearGradient>

        {/* Magma chamber fiery radial gradient */}
        <radialGradient id="dapurMagmaGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#f97316" />
          <stop offset="75%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>

        {/* Asthenosphere mantle gradient */}
        <linearGradient id="mantelGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#451a03" />
          <stop offset="100%" stopColor="#7c2d12" />
        </linearGradient>
      </defs>

      {/* 1. Langit Erupsi Gelap */}
      <rect x="0" y="0" width="560" height="115" fill="url(#volSkyGrad)" />

      {/* Kolom Awan Abu Panas & Gas Vulkanik (Wedhus Gembel) */}
      <g>
        <circle cx="330" cy="38" r="14" fill="#3f3f46" opacity="0.9" />
        <circle cx="318" cy="24" r="18" fill="#27272a" opacity="0.95" />
        <circle cx="342" cy="20" r="20" fill="#18181b" opacity="0.95" />
        <circle cx="368" cy="14" r="24" fill="#09090b" opacity="0.95" />
        <circle cx="395" cy="10" r="22" fill="#18181b" opacity="0.9" />
        {/* Lontaran Piroklastik Pijar Merah/Kuning */}
        <circle cx="325" cy="32" r="2.5" fill="#fef08a" />
        <circle cx="335" cy="22" r="2" fill="#f97316" />
        <circle cx="310" cy="18" r="1.5" fill="#ef4444" />
        <circle cx="350" cy="12" r="2" fill="#fef08a" />
      </g>

      {/* 2. Kerucut Stratovolcano (Gunung Merapi) */}
      {/* Lereng Gunung */}
      <polygon points="170,115 320,48 340,48 490,115" fill="#1c1917" stroke="#09090b" strokeWidth="1.5" />
      <polygon points="330,48 490,115 420,115" fill="#0f172a" />
      {/* Aliran Lava Pijar Menuruni Lereng */}
      <path d="M 324,50 Q 305,75 285,115" fill="none" stroke="#ef4444" strokeWidth="2.5" />
      <path d="M 324,50 Q 305,75 285,115" fill="none" stroke="#fef08a" strokeWidth="1" />
      <path d="M 336,50 Q 355,80 380,115" fill="none" stroke="#ea580c" strokeWidth="2.5" />
      <path d="M 336,50 Q 355,80 380,115" fill="none" stroke="#facc15" strokeWidth="1" />
      {/* Kawah Puncak Vulkanik */}
      <ellipse cx="330" cy="48" rx="10" ry="3" fill="#ef4444" />
      <ellipse cx="330" cy="48" rx="6" ry="1.5" fill="#fef08a" />

      {/* Kaki Gunung Berumput Hijau */}
      <rect x="0" y="112" width="560" height="6" fill="#15803d" />

      {/* 3. Penampang Bawah Tanah: Mantel & Kerak Benua */}
      <rect x="0" y="118" width="560" height="132" fill="#1e293b" />
      {/* Astenosfer Mantel Bumi Panas (>1200°C) */}
      <rect x="0" y="175" width="560" height="75" fill="url(#mantelGrad)" />
      <text x="15" y="240" fill="#fed7aa" fontSize="6.5" fontWeight="bold">
        ASTENOSFER MANTEL PANAS (SUHU &gt; 1.200°C)
      </text>

      {/* 4. Lempeng Samudra yang Menunjam (Subduksi) */}
      <polygon
        points="0,118 110,118 240,250 180,250 80,140 0,140"
        fill="#166534"
        stroke="#14532d"
        strokeWidth="1.5"
      />
      <text x="15" y="132" fill="#86efac" fontSize="6.5" fontWeight="bold">
        LEMPENG SAMUDRA (MENUNJAM)
      </text>

      {/* Peleburan Batuan & Butiran Magma Naik */}
      <g>
        <circle cx="190" cy="210" r="14" fill="#ea580c" opacity="0.6" />
        <circle cx="190" cy="210" r="7" fill="#fef08a" />
        <text x="210" y="214" fill="#fef08a" fontSize="6" fontWeight="bold">PELEBURAN SLAB</text>

        {/* Magma Naik ke Atas */}
        <path d="M 205,200 Q 240,195 270,185" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="3 2" />
      </g>

      {/* 5. Dapur Magma Raksasa (Magma Chamber) */}
      <g>
        <ellipse cx="330" cy="175" rx="55" ry="26" fill="url(#dapurMagmaGrad)" stroke="#ef4444" strokeWidth="2" />
        {/* Turbulensi Panas di dalam Dapur Magma */}
        <ellipse cx="330" cy="175" rx="28" ry="12" fill="#fef08a" />
        <text x="330" y="178" fill="#450a0a" fontSize="7" fontWeight="bold" textAnchor="middle">
          DAPUR MAGMA (KANTUNG PIJAR)
        </text>
      </g>

      {/* 6. Pipa Magma Utama Menerobos ke Kawah */}
      <polygon points="325,150 335,150 334,50 326,50" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
      <polygon points="328,150 332,150 331,50 329,50" fill="#fef08a" />

      {/* Rekahan Magma Samping */}
      <path d="M 326,110 Q 300,95 295,85" fill="none" stroke="#ef4444" strokeWidth="2" />

      {/* 7. Label-Label Penjelasan Step */}
      <g>
        <rect x="250" y="85" width="160" height="16" rx="3" fill="#450a0a" stroke="#f87171" strokeWidth="1.2" />
        <text x="330" y="96" fill="#fef08a" fontSize="6.5" fontWeight="bold" textAnchor="middle">
          BUSUR STRATOVOLCANO AKTIF MERAPI
        </text>
      </g>
    </svg>
  );
}

function MegathrustIllustration() {
  const [phase, setPhase] = useState<'locked' | 'rupture'>('locked');

  const handleTogglePhase = (targetPhase: 'locked' | 'rupture') => {
    if (targetPhase === 'rupture') {
      retroAudio.playExplosion();
    } else {
      retroAudio.playSelect();
    }
    setPhase(targetPhase);
  };

  const isRupture = phase === 'rupture';

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-between p-2 select-none">
      {/* Top Controller */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 border-b border-slate-800 z-10">
        <span className="text-[9px] font-pixel-title text-rose-400 font-bold flex items-center gap-1.5">
          <PixelIcon name="alert" size={13} className="text-rose-500 animate-pulse" />
          <span>SIMULATOR MEKANISME GEMPA MEGATHRUST &amp; TSUNAMI</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTogglePhase('locked')}
            className={`px-3 py-1 rounded-lg text-[8.5px] font-pixel-title font-bold border-2 cursor-pointer transition-all ${!isRupture
              ? 'bg-amber-600 text-white border-amber-300 shadow-[0_2px_0_#451a03] -translate-y-0.5'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
          >
            [1. FASE TERKUNCI]
          </button>
          <button
            onClick={() => handleTogglePhase('rupture')}
            className={`px-3 py-1 rounded-lg text-[8.5px] font-pixel-title font-bold border-2 cursor-pointer transition-all ${isRupture
              ? 'bg-rose-600 text-white border-rose-300 shadow-[0_2px_0_#4c0519] -translate-y-0.5'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
          >
            [2. RUPTUR &amp; TSUNAMI]
          </button>
        </div>
      </div>

      {/* Simulator SVG Canvas */}
      <svg viewBox="0 0 540 240" className="w-full h-full object-contain" shapeRendering="geometricPrecision">
        <style>{`
          @keyframes shockwavePulse {
            0% { r: 6px; opacity: 1; stroke-width: 3.5px; }
            50% { opacity: 0.8; }
            100% { r: 110px; opacity: 0; stroke-width: 1px; }
          }
          @keyframes tsunamiSurge {
            0% { transform: translateX(0px); }
            50% { transform: translateX(12px); }
            100% { transform: translateX(0px); }
          }
          @keyframes quakeShakeL2 {
            0% { transform: translate(0, 0); }
            25% { transform: translate(-2px, 1.5px); }
            50% { transform: translate(2px, -1.5px); }
            75% { transform: translate(-1.5px, -1px); }
            100% { transform: translate(0, 0); }
          }
          .anim-shockwave-1 { animation: shockwavePulse 1.8s ease-out infinite; }
          .anim-shockwave-2 { animation: shockwavePulse 1.8s ease-out infinite 0.45s; }
          .anim-shockwave-3 { animation: shockwavePulse 1.8s ease-out infinite 0.9s; }
          .anim-tsunami { animation: tsunamiSurge 2.5s ease-in-out infinite; }
          .anim-tremor { animation: quakeShakeL2 0.12s linear infinite; }
        `}</style>

        <defs>
          <linearGradient id="deepOceanTrenchGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="subductingSlabGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="60%" stopColor="#172554" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <rect x="0" y="0" width="540" height="240" fill="#09090b" />

        {/* Asthenosphere Mantle */}
        <rect x="0" y="165" width="540" height="75" fill="#451a03" />
        <rect x="0" y="195" width="540" height="45" fill="#7c2d12" />
        <text x="18" y="230" fill="#fed7aa" fontSize="7" fontWeight="bold">
          ASTENOSFER MANTEL BUMI
        </text>

        {/* ── 1. LEMPENG SAMUDRA MENUNJAM (SUBDUCTING SLAB DIAGONAL) ── */}
        <g>
          <path
            d="M 0,105 L 180,120 L 320,240 L 260,240 L 140,140 L 0,128 Z"
            fill="url(#subductingSlabGrad)"
            stroke="#1e40af"
            strokeWidth="1.5"
          />
          {/* Panah Laju Penunjaman Lempeng Samudra */}
          <polygon points="55,112 85,112 85,109 97,115 85,121 85,118 55,118" fill="#38bdf8" />
          <text x="25" y="140" fill="#93c5fd" fontSize="7" fontWeight="bold">
            LEMPENG SAMUDRA (MENUNJAM)
          </text>
        </g>

        {/* ── 2. LEMPENG BENUA OVERRIDING (Ujung Mengalami Deformasi Fleksi / Rebound) ── */}
        <g className={isRupture ? 'anim-tremor' : ''}>
          {/* Posisi Ujung Kerak Benua: Menekuk ke Bawah (Locked) vs Mencelat Naik (Rupture Rebound) */}
          <path
            d={
              !isRupture
                ? 'M 175,128 Q 230,135 250,165 L 540,165 L 540,55 L 340,55 L 260,85 Q 210,120 175,128 Z'
                : 'M 170,95 Q 225,98 250,150 L 540,150 L 540,55 L 340,55 L 260,75 Q 200,90 170,95 Z'
            }
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="2"
            style={{ transition: 'd 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28)' }}
          />

          {/* Permukaan Daratan Kerak Benua */}
          <path
            d={
              !isRupture
                ? 'M 260,85 L 340,55 L 540,55'
                : 'M 260,75 L 340,55 L 540,55'
            }
            fill="none"
            stroke="#64748b"
            strokeWidth="4"
          />

          {/* Bangunan Kota Pesisir di Daratan Benua */}
          <rect x="420" y="44" width="14" height="11" fill="#475569" stroke="#0f172a" strokeWidth="1" />
          <rect x="440" y="40" width="18" height="15" fill="#334155" stroke="#0f172a" strokeWidth="1" />
          <rect x="465" y="46" width="12" height="9" fill="#475569" stroke="#0f172a" strokeWidth="1" />
          <rect x="485" y="42" width="15" height="13" fill="#334155" stroke="#0f172a" strokeWidth="1" />

          {/* Pohon & Garis Pantai */}
          <rect x="360" y="50" width="8" height="5" fill="#15803d" />
          <rect x="380" y="48" width="10" height="7" fill="#15803d" />

          <text x="440" y="80" fill="#f8fafc" fontSize="8" fontWeight="bold">
            DARATAN KERAK BENUA EURASIA
          </text>
        </g>

        {/* ── 3. SAMUDRA & AIR LAUT (SURUT KETIKA TERKUNCI vs TSUNAMI KETIKA RUPTUR) ── */}
        <g>
          {/* Kolom Air Samudra */}
          <path
            d={
              !isRupture
                ? 'M 0,55 L 260,85 L 250,165 L 175,128 L 0,105 Z'
                : 'M 0,55 L 260,75 L 250,150 L 170,95 L 0,105 Z'
            }
            fill="url(#deepOceanTrenchGrad)"
            opacity="0.75"
            style={{ transition: 'd 0.5s ease' }}
          />

          {/* Permukaan Laut */}
          {!isRupture ? (
            // Air Laut Tenang (Pesisir mengalami sedikit depresi/surut)
            <g>
              <line x1="0" y1="55" x2="260" y2="85" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="6 3" />
              <text x="80" y="50" fill="#7dd3fc" fontSize="7" fontWeight="bold">
                PERMUKAAN AIR LAUT NORMAL
              </text>
            </g>
          ) : (
            // GELOMBANG TSUNAMI DAHSYAT (Bongkahan Air Terangkat Naik Akibat Rebound Seafloor)
            <g className="anim-tsunami">
              <path
                d="M 0,55 L 110,55 Q 165,12 210,35 Q 240,65 260,75"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4"
              />
              <path
                d="M 120,55 Q 165,16 205,38"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
              />
              {/* Buih Puncak Gelombang Tsunami */}
              <circle cx="165" cy="18" r="3" fill="#ffffff" />
              <circle cx="172" cy="19" r="2.5" fill="#ffffff" />
              <circle cx="180" cy="22" r="2" fill="#ffffff" />

              <rect x="110" y="2" width="135" height="18" rx="4" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="177" y="14" fill="#fef08a" fontSize="7" fontWeight="bold" textAnchor="middle">
                GELOMBANG TSUNAMI MEGATHRUST &gt;&gt;
              </text>
            </g>
          )}
        </g>

        {/* ── 4. BIDANG KONTAK SESAR MEGATHRUST (FAULT CONTACT ZONE) ── */}
        <g>
          {/* Garis Sesar Kontak Antar Lempeng */}
          <line
            x1="175"
            y1={!isRupture ? 128 : 100}
            x2="245"
            y2={!isRupture ? 165 : 150}
            stroke={!isRupture ? '#f59e0b' : '#ef4444'}
            strokeWidth={!isRupture ? '4' : '6'}
            strokeLinecap="round"
            style={{ transition: 'all 0.5s ease' }}
          />

          {!isRupture ? (
            // Indikator Fase Terkunci: Gesekan & Akumulasi Tegangan
            <g>
              <circle cx="210" cy="146" r="10" fill="#dc2626" opacity="0.3" />
              <circle cx="210" cy="146" r="4" fill="#f59e0b" />
              {/* Panah Tegangan Terkunci Menekan Ujung Benua ke Bawah */}
              <polygon points="190,110 205,130 198,134 215,145 222,126 215,130 200,110" fill="#ef4444" />

              <rect x="255" y="110" width="160" height="22" rx="4" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="335" y="124" fill="#fef08a" fontSize="6.5" fontWeight="bold" textAnchor="middle">
                BIDANG SESAR TERKUNCI (LOCKED)
              </text>
              <line x1="255" y1="121" x2="225" y2="142" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
            </g>
          ) : (
            // Indikator Fase Ruptur: Gempa Dahsyat & Gelombang Seismik Meledak
            <g>
              {/* Gelombang Seismik P & S Raksasa Merambat Keluar dari Hiposentrum */}
              <circle cx="210" cy="125" r="15" fill="none" stroke="#fef08a" className="anim-shockwave-1" />
              <circle cx="210" cy="125" r="30" fill="none" stroke="#f97316" className="anim-shockwave-2" />
              <circle cx="210" cy="125" r="50" fill="none" stroke="#ef4444" className="anim-shockwave-3" />

              {/* Titik Hiposentrum Gempa Megathrust */}
              <circle cx="210" cy="125" r="7" fill="#fef08a" />
              <circle cx="210" cy="125" r="4" fill="#dc2626" />

              {/* Panah Rebound Elastis Melesat ke Atas */}
              <polygon points="160,115 160,85 152,85 165,70 178,85 170,85 170,115" fill="#22c55e" />
              <text x="120" y="85" fill="#86efac" fontSize="7" fontWeight="bold">
                REBOUND ELASTIS!
              </text>

              {/* Callout Hiposentrum */}
              <rect x="235" y="105" width="175" height="24" rx="4" fill="#450a0a" stroke="#ef4444" strokeWidth="2" />
              <text x="322" y="117" fill="#fef08a" fontSize="7" fontWeight="bold" textAnchor="middle">
                HIPOSENTRUM GEMPA MEGATHRUST
              </text>
              <text x="322" y="125" fill="#fca5a5" fontSize="5.5" textAnchor="middle">
                Pelepasan Energi Dahsyat M &gt; 8.5
              </text>
            </g>
          )}
        </g>
      </svg>

      {/* Bottom Educational Summary */}
      <div className="w-full bg-[#0f172a] border-2 border-rose-500/80 rounded-xl p-2.5 text-slate-200 text-xs flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-rose-600/30 text-rose-300 font-pixel-title text-[9px] border border-rose-500 font-bold whitespace-nowrap">
            {!isRupture ? 'FASE 1: AKUMULASI TEGANGAN' : 'FASE 2: PELEPASAN & TSUNAMI'}
          </span>
          <p className="text-[10px] sm:text-[11px] leading-snug text-slate-300">
            {!isRupture
              ? 'Selama puluhan tahun, bidang kontak terkunci menahan gesekan. Ujung lempeng benua tertekuk ke bawah dan menyimpan tegangan elastis raksasa.'
              : 'Ketika batas elastis terlampaui, batuan patah mendadak! Ujung lempeng benua terpelanting naik (<Rebound Elastis>), mendesak miliaran kubik air laut membentuk Tsunami!'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: SISMOGRAF MEKANIK KE SINYAL LISTRIK & BUKTI 20 LEMPENG BUMI
// ═════════════════════════════════════════════════════════════════════════════
export function SeismographPlatesIllustration() {
  const [activeTab, setActiveTab] = useState<'seismograph' | 'plates'>('seismograph');

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between bg-[#09090b] select-none p-1 sm:p-2 font-pixel">
      {/* Top Header Mode Switcher (Tab Anti-Clipping) */}
      <div className="w-full flex items-center justify-between px-2 pt-2 pb-1.5 bg-slate-950/95 border-b border-amber-800/60 text-[10px] z-10 shadow-sm gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              retroAudio.playSelect();
              setActiveTab('seismograph');
            }}
            className={`pt-2 px-3 pb-1.5 rounded-t-lg font-pixel-title text-[9px] font-bold cursor-pointer transition-all border-t-2 border-x-2 ${activeTab === 'seismograph'
              ? 'bg-[#1e1b4b] text-cyan-300 border-cyan-500 shadow-[0_-2px_6px_rgba(6,182,212,0.3)]'
              : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
          >
            [1. INSTRUMEN SISMOGRAF 3D]
          </button>
          <button
            onClick={() => {
              retroAudio.playSelect();
              setActiveTab('plates');
            }}
            className={`pt-2 px-3 pb-1.5 rounded-t-lg font-pixel-title text-[9px] font-bold cursor-pointer transition-all border-t-2 border-x-2 ${activeTab === 'plates'
              ? 'bg-[#1e1b4b] text-amber-300 border-amber-500 shadow-[0_-2px_6px_rgba(245,158,11,0.3)]'
              : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
          >
            [2. PETA 20 LEMPENG BUMI]
          </button>
        </div>
        <span className="text-[8px] text-slate-400 hidden sm:inline">
          INSTRUMEN PENCATAT GELOMBANG SEISMIK
        </span>
      </div>

      {/* SVG Canvas Simulator 3D Mechanical Seismograph */}
      {activeTab === 'seismograph' ? (
        <svg viewBox="0 0 560 250" className="w-full h-full object-contain" shapeRendering="geometricPrecision">
          <defs>
            <linearGradient id="seismoBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#090d16" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#090d16" />
            </linearGradient>

            <linearGradient id="basePlateTop" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="35%" stopColor="#cbd5e1" />
              <stop offset="70%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <linearGradient id="basePlateFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            <linearGradient id="basePlateLeft" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            <linearGradient id="cFrameFront" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="40%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>

            <linearGradient id="cFrameSide" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            <linearGradient id="cFrameTop" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            <linearGradient id="inertiaBobTop" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <linearGradient id="inertiaBobBody" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="25%" stopColor="#cbd5e1" />
              <stop offset="60%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            <linearGradient id="drumPaper" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#f8fafc" />
              <stop offset="70%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            <linearGradient id="drumCap" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <linearGradient id="drumMount" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <radialGradient id="boltGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="45%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#334155" />
            </radialGradient>

            <radialGradient id="baseShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.7)" />
              <stop offset="80%" stopColor="rgba(0,0,0,0.3)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>

          <rect width="560" height="250" fill="url(#seismoBg)" rx="8" />
          <ellipse cx="280" cy="222" rx="255" ry="24" fill="url(#baseShadow)" />

          {/* 1. Pelat Dasar Logam Tebal Berbaut (Base Plate 3D) */}
          <polygon points="25,170 280,218 535,170 535,182 280,230 25,182" fill="url(#basePlateFront)" stroke="#0f172a" strokeWidth="1" />
          <polygon points="25,170 25,182 280,230 280,218" fill="url(#basePlateLeft)" />
          <polygon points="215,82 535,170 280,218 25,170" fill="url(#basePlateTop)" stroke="#64748b" strokeWidth="1.2" />

          {/* 4 Baut Sudut Baja (Bolts) */}
          <ellipse cx="50" cy="170" rx="9" ry="5.5" fill="url(#boltGrad)" stroke="#1e293b" strokeWidth="0.8" />
          <ellipse cx="280" cy="211" rx="9" ry="5.5" fill="url(#boltGrad)" stroke="#1e293b" strokeWidth="0.8" />
          <ellipse cx="510" cy="170" rx="9" ry="5.5" fill="url(#boltGrad)" stroke="#1e293b" strokeWidth="0.8" />
          <ellipse cx="225" cy="89" rx="8" ry="5" fill="url(#boltGrad)" stroke="#1e293b" strokeWidth="0.8" opacity="0.85" />

          {/* 2. Dudukan Poros Belakang Silinder Drum */}
          <polygon points="175,115 188,111 188,155 175,159" fill="#334155" stroke="#1e293b" strokeWidth="1" />
          <polygon points="162,118 175,115 175,159 162,162" fill="url(#drumMount)" stroke="#1e293b" strokeWidth="1" />

          {/* 3. Silinder Drum Horizontal & Kertas Seismogram */}
          <line x1="160" y1="124" x2="385" y2="175" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
          <g id="seismograph-drum">
            <ellipse cx="188" cy="122" rx="14" ry="26" fill="url(#drumCap)" stroke="#475569" strokeWidth="1" />
            <path
              d="M 188,96 L 360,140 A 15 28 0 0 1 360,196 L 188,148 A 15 28 0 0 1 188,96 Z"
              fill="url(#drumPaper)"
              stroke="#64748b"
              strokeWidth="1"
            />
            <ellipse cx="360" cy="168" rx="15" ry="28" fill="url(#drumCap)" stroke="#334155" strokeWidth="1.2" />
            <ellipse cx="360" cy="168" rx="13" ry="25" fill="#e2e8f0" opacity="0.6" />

            {/* Grid Garis Kertas Seismogram */}
            <path d="M 188,109 L 360,153" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.8" />
            <path d="M 188,122 L 360,166" stroke="#94a3b8" strokeWidth="1" opacity="0.9" />
            <path d="M 188,135 L 360,179" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.8" />

            {/* Rekaman Grafik Gelombang Gempa (Seismogram Waveform Trace P & S Waves) */}
            <path
              d="
                M 195,123 
                L 220,128 L 225,130 L 230,126 L 234,131 L 238,128 
                L 242,125 L 245,137 L 248,122 L 252,143 L 255,118 L 258,152 L 261,112 
                L 264,162 L 267,105 L 271,170 L 275,108 L 279,165 L 283,118 L 287,156 
                L 291,126 L 295,150 L 300,132 L 305,145 L 310,138 L 320,148 L 335,155 L 355,162
              "
              fill="none"
              stroke="#0f172a"
              strokeWidth="1.6"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>

          {/* Dudukan Poros Depan Silinder Drum */}
          <polygon points="380,145 394,141 394,198 380,203" fill="#334155" stroke="#1e293b" strokeWidth="1" />
          <polygon points="364,149 380,145 380,203 364,208" fill="url(#drumMount)" stroke="#1e293b" strokeWidth="1" />
          <circle cx="372" cy="176" r="3.5" fill="url(#boltGrad)" stroke="#1e293b" strokeWidth="0.8" />

          {/* 4. Rangka Baja Bentuk C (C-Frame Stand) */}
          <polygon points="90,45 110,38 110,172 90,165" fill="url(#cFrameSide)" stroke="#1e293b" strokeWidth="1" />
          <polygon points="110,38 135,46 135,180 110,172" fill="url(#cFrameFront)" stroke="#334155" strokeWidth="1" />
          <polygon points="135,150 160,170 160,186 135,180" fill="url(#cFrameFront)" stroke="#1e293b" strokeWidth="1" />

          <polygon points="110,38 310,38 310,54 135,54 135,46 110,38" fill="url(#cFrameFront)" stroke="#334155" strokeWidth="1" />
          <polygon points="90,28 290,28 310,38 110,38" fill="url(#cFrameTop)" stroke="#94a3b8" strokeWidth="1" />
          <polygon points="290,28 310,38 310,54 290,44" fill="url(#cFrameSide)" stroke="#1e293b" strokeWidth="1" />

          {/* 5. Kawat Suspensi, Beban Silinder Inersia & Jarum Pena Pencatat */}
          <line x1="240" y1="38" x2="240" y2="72" stroke="#64748b" strokeWidth="2" />
          <line x1="240" y1="38" x2="240" y2="72" stroke="#f1f5f9" strokeWidth="1" />

          <g id="inertia-pendulum-bob">
            <path
              d="M 200,82 L 280,82 L 280,104 A 40 14 0 0 1 200,104 Z"
              fill="url(#inertiaBobBody)"
              stroke="#1e293b"
              strokeWidth="1.2"
            />
            <ellipse cx="240" cy="82" rx="40" ry="14" fill="url(#inertiaBobTop)" stroke="#64748b" strokeWidth="1" />
            <ellipse cx="240" cy="82" rx="6" ry="2.5" fill="url(#boltGrad)" stroke="#1e293b" strokeWidth="0.8" />

            {/* Jarum Pena Pencatat Menyentuh Permukaan Kertas Drum */}
            <line x1="240" y1="104" x2="240" y2="135" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="240" y1="104" x2="240" y2="135" stroke="#f1f5f9" strokeWidth="1" strokeLinecap="round" />
            <circle cx="240" cy="135" r="1.5" fill="#dc2626" />
          </g>
        </svg>
      ) : (
        /* Peta 20 Lempeng Tektonik Global & Seismisitas */
        <svg viewBox="0 0 560 250" className="w-full h-full object-contain" shapeRendering="crispEdges">
          {/* World Projection Base (Lautan Samudra Biru Tua) */}
          <rect x="0" y="0" width="560" height="250" fill="#0c4a6e" />

          {/* Benua-Benua Utama (Siluet Hijau/Krem Retro) */}
          {/* Amerika Utara & Selatan */}
          <path d="M 60 40 L 120 30 L 160 50 L 140 100 L 110 120 L 130 150 L 145 200 L 115 220 L 95 160 L 80 120 L 60 70 Z" fill="#15803d" stroke="#166534" strokeWidth="1.5" />
          {/* Eurasia */}
          <path d="M 260 30 L 380 25 L 450 40 L 480 80 L 440 110 L 360 100 L 300 115 L 250 80 Z" fill="#166534" stroke="#14532d" strokeWidth="1.5" />
          {/* Afrika */}
          <path d="M 240 90 L 310 95 L 340 140 L 310 200 L 260 190 L 230 140 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
          {/* India & Australia */}
          <path d="M 370 110 L 405 115 L 390 145 Z" fill="#047857" stroke="#065f46" strokeWidth="1.5" />
          <path d="M 420 160 L 480 155 L 490 200 L 430 210 Z" fill="#15803d" stroke="#166534" strokeWidth="1.5" />
          {/* Antartika */}
          <rect x="80" y="235" width="400" height="15" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />

          {/* ── BATAS 20 LEMPENG TEKTONIK (GARIS MERAH / EMAS BERSAMBUNGAN) ── */}
          {/* Cincin Api Pasifik (Ring of Fire) */}
          <path d="M 120 35 L 60 80 L 70 150 L 90 220" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5 3" />
          <path d="M 480 45 L 460 110 L 420 150 L 430 210" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5 3" />
          {/* Pematang Tengah Atlantik (Mid-Atlantic Ridge) */}
          <path d="M 190 20 Q 210 80, 195 140 Q 220 180, 200 230" fill="none" stroke="#f97316" strokeWidth="2.5" strokeDasharray="6 3" />
          {/* Sabuk Mediterania - Himalaya - Indonesia */}
          <path d="M 220 90 L 270 95 L 350 115 L 420 140 L 470 170" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="5 3" />

          {/* Label Nama Lempeng Tektonik Utama */}
          <text x="50" y="110" fill="#fef08a" fontSize="7" fontWeight="bold">LEMPENG PASIFIK</text>
          <text x="90" y="65" fill="#ffffff" fontSize="7" fontWeight="bold">AMERIKA UTARA</text>
          <text x="110" y="175" fill="#ffffff" fontSize="7" fontWeight="bold">AMERIKA SELATAN</text>
          <text x="340" y="60" fill="#ffffff" fontSize="7" fontWeight="bold">LEMPENG EURASIA</text>
          <text x="270" y="150" fill="#ffffff" fontSize="7" fontWeight="bold">LEMPENG AFRIKA</text>
          <text x="430" y="185" fill="#ffffff" fontSize="7" fontWeight="bold">INDO-AUSTRALIA</text>
          <text x="280" y="243" fill="#0f172a" fontSize="6.5" fontWeight="bold">LEMPENG ANTARTIKA</text>

          {/* Titik-Titik Episentrum Gempa (Membuktikan Batas Lempeng) */}
          {[
            [120, 35], [95, 60], [75, 100], [80, 130], [90, 170], [100, 200],
            [190, 30], [200, 70], [205, 105], [198, 140], [210, 180], [205, 215],
            [235, 92], [275, 96], [320, 105], [370, 118], [405, 130], [440, 148], [465, 168],
            [475, 55], [455, 95], [435, 130], [425, 165], [450, 195]
          ].map(([gx, gy], i) => (
            <g key={i}>
              <circle cx={gx} cy={gy} r="4" fill="#ef4444" opacity="0.4" className="animate-ping" />
              <circle cx={gx} cy={gy} r="2.5" fill="#fef08a" stroke="#dc2626" strokeWidth="1" />
            </g>
          ))}

          {/* Callout Titik Gempa Memetakan Lempeng */}
          <rect x="140" y="10" width="280" height="20" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="280" y="23" fill="#fde68a" fontSize="7" fontWeight="bold" textAnchor="middle">
            ● TITIK EPISENTRUM GEMPA MEMETAKAN ~20 LEMPENG TEKTONIK
          </text>
        </svg>
      )}

      {/* 3-Card Scientific Explanation for SMP Kelas 8 */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
        <div className="bg-[#0f172a] border-2 border-cyan-500/80 rounded-xl p-2.5 text-slate-200 text-xs shadow-md">
          <div className="flex items-center gap-1.5 mb-1 text-cyan-300 font-pixel-title text-[9px] font-bold">
            <PixelIcon name="shield" size={13} />
            <span>1. INERSIA MASSA</span>
          </div>
          <p className="text-[10px] sm:text-[11px] leading-snug text-slate-300">
            Bandul berat tetap diam di posisinya karena gaya inersia saat rangka penopang dan tanah bergetar hebat.
          </p>
        </div>

        <div className="bg-[#0f172a] border-2 border-amber-500/80 rounded-xl p-2.5 text-slate-200 text-xs shadow-md">
          <div className="flex items-center gap-1.5 mb-1 text-amber-300 font-pixel-title text-[9px] font-bold">
            <PixelIcon name="zap" size={13} />
            <span>2. SINYAL LISTRIK</span>
          </div>
          <p className="text-[10px] sm:text-[11px] leading-snug text-slate-300">
            Gerak relatif bandul dan magnet menginduksi arus listrik di koil kawat, direkam sebagai grafik seismogram (Gelombang P & S).
          </p>
        </div>

        <div className="bg-[#0f172a] border-2 border-rose-500/80 rounded-xl p-2.5 text-slate-200 text-xs shadow-md">
          <div className="flex items-center gap-1.5 mb-1 text-rose-300 font-pixel-title text-[9px] font-bold">
            <PixelIcon name="globe" size={13} />
            <span>3. 20 LEMPENG BUMI</span>
          </div>
          <p className="text-[10px] sm:text-[11px] leading-snug text-slate-300">
            Titik-titik gempa global memetakan sekitar 20 keping lempeng tektonik yang bergerak di atas arus konveksi mantel bumi.
          </p>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: BATAS TRANSFORM & SESAR SAN ANDREAS (3D SOLID CUBES BERGESER)
// ═════════════════════════════════════════════════════════════════════════════
export function TransformSanAndreasIllustration() {
  const [slip, setSlip] = useState(0); // 0 = menyatu utuh, 1 = pergeseran maksimum

  // Animasi Langsung Otomatis & Berulang Mulus:
  // 0 - 1200ms  : Menyatu utuh sebagai satu daratan (slip = 0)
  // 1200 - 3200ms: Bergeser perlahan ke atas & bawah (slip: 0 -> 1)
  // 3200 - 4500ms: Tahan di posisi pergeseran maksimum (slip = 1, tegangan gempa)
  // 4500 - 6000ms: Kembali menyatu perlahan (slip: 1 -> 0)
  useEffect(() => {
    let animId: number;
    const startTime = performance.now();
    const totalCycle = 6000;

    const tick = (now: number) => {
      const elapsed = (now - startTime) % totalCycle;
      let s = 0;
      if (elapsed < 1200) {
        s = 0;
      } else if (elapsed < 3200) {
        const p = (elapsed - 1200) / 2000;
        s = 0.5 - 0.5 * Math.cos(p * Math.PI);
      } else if (elapsed < 4400) {
        s = 1;
      } else {
        const p = (elapsed - 4400) / 1600;
        s = 0.5 + 0.5 * Math.cos(p * Math.PI);
      }

      setSlip(s);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Geometri 3D Solid Cubes / Blocks (Isometric Oblique Projection)
  const W = 145; // Lebar balok
  const H = 100; // Tinggi balok
  const h1 = 28; // Lapisan 1: Kerak Atas (Tan Sandy Soil)
  const h2 = 34; // Lapisan 2: Kerak Tengah (Batuan Beku Cokelat)

  // Vektor Kedalaman Sesar (Depth Vector)
  const Dx = 80;
  const Dy = -48;

  // Nilai pergeseran relatif sepanjang vektor sesar
  const maxSlip = 32;
  const sx = slip * maxSlip * (80 / 93.3);
  const sy = slip * maxSlip * (48 / 93.3);

  // Titik temu sesar di tengah saat netral (slip = 0)
  const cx = 275;
  const cy = 135;

  // Koordinat Balok Kiri (Kerak Kiri - Meluncur ke Depan / Bawah-Kiri)
  const L_front_tl: [number, number] = [cx - W - sx, cy + sy];
  const L_front_tr: [number, number] = [cx - sx, cy + sy];
  const L_top_back_l: [number, number] = [cx - W - sx + Dx, cy + sy + Dy];
  const L_top_back_r: [number, number] = [cx - sx + Dx, cy + sy + Dy];

  // Koordinat Balok Kanan (Kerak Kanan - Meluncur ke Belakang / Atas-Kanan)
  const R_front_tl: [number, number] = [cx + sx, cy - sy];
  const R_front_tr: [number, number] = [cx + W + sx, cy - sy];
  const R_top_back_l: [number, number] = [cx + sx + Dx, cy - sy + Dy];
  const R_top_back_r: [number, number] = [cx + W + sx + Dx, cy - sy + Dy];

  // Mapping Parametris Panah Merah 3D di Permukaan Atas
  const getParamPoint = (front_tl: [number, number], u: number, v: number): string => {
    const px = front_tl[0] + u * W + v * Dx;
    const py = front_tl[1] + v * Dy;
    return `${px.toFixed(1)},${py.toFixed(1)}`;
  };

  // Panah Balok Kiri (Menunjuk ke Bawah-Depan sepanjang arah patahan)
  const leftArrowUV: [number, number][] = [
    [0.54, 0.74],
    [0.46, 0.74],
    [0.46, 0.46],
    [0.36, 0.49],
    [0.50, 0.18],
    [0.64, 0.49],
    [0.54, 0.46],
  ];
  const leftArrowPoints = leftArrowUV.map(([u, v]) => getParamPoint(L_front_tl, u, v)).join(' ');

  // Panah Balok Kanan (Menunjuk ke Atas-Belakang sepanjang arah patahan)
  const rightArrowUV: [number, number][] = [
    [0.46, 0.26],
    [0.54, 0.26],
    [0.54, 0.54],
    [0.64, 0.51],
    [0.50, 0.82],
    [0.36, 0.51],
    [0.46, 0.54],
  ];
  const rightArrowPoints = rightArrowUV.map(([u, v]) => getParamPoint(R_front_tl, u, v)).join(' ');

  // Titik Pin "Gerak Transform" di Pusat Patahan
  const pinX = cx + Dx * 0.45;
  const pinY = cy + Dy * 0.45;

  // Status Teks Edukatif
  let statusText = 'LEMPENG MENYATU (KONDISI AWAL)';
  let statusColor = 'text-sky-400';
  let dotColor = 'bg-sky-400';
  if (slip > 0.05 && slip < 0.9) {
    statusText = 'LEMPENG SEDANG BERGESER (SESAR AKTIF)';
    statusColor = 'text-amber-400';
    dotColor = 'bg-amber-400 animate-pulse';
  } else if (slip >= 0.9) {
    statusText = 'TEGANGAN GESER MAKSIMUM (GEMPA DANGKAL)';
    statusColor = 'text-rose-400';
    dotColor = 'bg-rose-500 animate-ping';
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between bg-[#09090b] select-none p-1 sm:p-2 font-pixel">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between px-2 pt-2 pb-1.5 bg-slate-950/95 border-b border-amber-800/60 text-[10px] z-10 shadow-sm gap-2">
        <span className="text-amber-300 font-pixel-title text-[9px] font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          BATAS TRANSFORM: SESAR GESER (3D CRUSTAL BLOCKS)
        </span>
        <span className={`text-[8px] font-bold flex items-center gap-1 ${statusColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          {statusText}
        </span>
      </div>

      {/* SVG Canvas Simulator: 2 Balok Kubus 3D Pejal Menyatu & Bergeser */}
      <div className="w-full flex-1 min-h-0 relative flex items-center justify-center overflow-hidden my-1">
        <svg
          viewBox="0 0 600 270"
          className="w-full h-full object-contain drop-shadow-2xl"
          shapeRendering="geometricPrecision"
        >
          <defs>
            <linearGradient id="transCanvasBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0b0f19" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#0b0f19" />
            </linearGradient>

            {/* Permukaan Atas Pasir Gurun (Top Surface) */}
            <linearGradient id="topSurfaceGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e2ba7d" />
              <stop offset="100%" stopColor="#c99c56" />
            </linearGradient>

            {/* Dinding Depan: 3 Lapisan Strata Geologis */}
            <linearGradient id="strataL1Front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b8936f" />
              <stop offset="100%" stopColor="#a47e5b" />
            </linearGradient>
            <linearGradient id="strataL2Front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#734522" />
              <stop offset="100%" stopColor="#5c3417" />
            </linearGradient>
            <linearGradient id="strataL3Front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#db5a38" />
              <stop offset="100%" stopColor="#be4424" />
            </linearGradient>

            {/* Dinding Samping / Bayangan Perspektif: 3 Lapisan Strata */}
            <linearGradient id="strataL1Side" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8c6646" />
              <stop offset="100%" stopColor="#704e33" />
            </linearGradient>
            <linearGradient id="strataL2Side" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4e2c14" />
              <stop offset="100%" stopColor="#3d210d" />
            </linearGradient>
            <linearGradient id="strataL3Side" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a63a1c" />
              <stop offset="100%" stopColor="#82280f" />
            </linearGradient>

            {/* Efek Bayangan Lembut Panah */}
            <filter id="arrowDropGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.5)" />
            </filter>
          </defs>

          {/* Latar Belakang Kanvas */}
          <rect width="600" height="270" fill="url(#transCanvasBg)" rx="8" />

          {/* Bayangan Tanah 3D di Bawah Kedua Balok */}
          <polygon
            points={`
              ${L_front_tl[0] - 8},${L_front_tl[1] + H + 10} 
              ${R_front_tr[0] + 12},${R_front_tr[1] + H + 10} 
              ${R_top_back_r[0] + 12},${R_top_back_r[1] + H + 6} 
              ${L_top_back_l[0] - 8},${L_top_back_l[1] + H + 6}
            `}
            fill="rgba(0,0,0,0.4)"
          />

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* 1. BALOK KANAN (SOLID 3D CUBE - BERGERAK KE ATAS/BELAKANG)    */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <g id="right-crust-block">
            {/* Dinding Samping Luar Kanan (3 Strata Bertingkat) */}
            <polygon
              points={`
                ${R_front_tr[0]},${R_front_tr[1]} 
                ${R_top_back_r[0]},${R_top_back_r[1]} 
                ${R_top_back_r[0]},${R_top_back_r[1] + h1} 
                ${R_front_tr[0]},${R_front_tr[1] + h1}
              `}
              fill="url(#strataL1Side)"
              stroke="#3d210d"
              strokeWidth="0.8"
            />
            <polygon
              points={`
                ${R_front_tr[0]},${R_front_tr[1] + h1} 
                ${R_top_back_r[0]},${R_top_back_r[1] + h1} 
                ${R_top_back_r[0]},${R_top_back_r[1] + h1 + h2} 
                ${R_front_tr[0]},${R_front_tr[1] + h1 + h2}
              `}
              fill="url(#strataL2Side)"
              stroke="#3d210d"
              strokeWidth="0.8"
            />
            <polygon
              points={`
                ${R_front_tr[0]},${R_front_tr[1] + h1 + h2} 
                ${R_top_back_r[0]},${R_top_back_r[1] + h1 + h2} 
                ${R_top_back_r[0]},${R_top_back_r[1] + H} 
                ${R_front_tr[0]},${R_front_tr[1] + H}
              `}
              fill="url(#strataL3Side)"
              stroke="#3d210d"
              strokeWidth="0.8"
            />

            {/* Dinding Muka Depan Balok Kanan (3 Strata Horizontal) */}
            <polygon
              points={`
                ${R_front_tl[0]},${R_front_tl[1]} 
                ${R_front_tr[0]},${R_front_tr[1]} 
                ${R_front_tr[0]},${R_front_tr[1] + h1} 
                ${R_front_tl[0]},${R_front_tl[1] + h1}
              `}
              fill="url(#strataL1Front)"
              stroke="#451a03"
              strokeWidth="0.8"
            />
            <polygon
              points={`
                ${R_front_tl[0]},${R_front_tl[1] + h1} 
                ${R_front_tr[0]},${R_front_tr[1] + h1} 
                ${R_front_tr[0]},${R_front_tr[1] + h1 + h2} 
                ${R_front_tl[0]},${R_front_tl[1] + h1 + h2}
              `}
              fill="url(#strataL2Front)"
              stroke="#451a03"
              strokeWidth="0.8"
            />
            <polygon
              points={`
                ${R_front_tl[0]},${R_front_tl[1] + h1 + h2} 
                ${R_front_tr[0]},${R_front_tr[1] + h1 + h2} 
                ${R_front_tr[0]},${R_front_tr[1] + H} 
                ${R_front_tl[0]},${R_front_tl[1] + H}
              `}
              fill="url(#strataL3Front)"
              stroke="#451a03"
              strokeWidth="0.8"
            />

            {/* Permukaan Atas Balok Kanan (Top Surface) */}
            <polygon
              points={`
                ${R_front_tl[0]},${R_front_tl[1]} 
                ${R_front_tr[0]},${R_front_tr[1]} 
                ${R_top_back_r[0]},${R_top_back_r[1]} 
                ${R_top_back_l[0]},${R_top_back_l[1]}
              `}
              fill="url(#topSurfaceGrad)"
              stroke="#784824"
              strokeWidth="1.2"
            />

            {/* Panah Merah Balok Kanan (Menunjuk ke Atas-Belakang) */}
            <polygon
              points={rightArrowPoints}
              fill="#dc2626"
              stroke="#7f1d1d"
              strokeWidth="1.2"
              filter="url(#arrowDropGlow)"
            />
          </g>

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* 2. BIDANG SESAR TERBUKA (EXPOSED FAULT STEP WALL)             */}
          {/* Muncul saat balok bergeser relatif (slip > 0.005)            */}
          {/* ═════════════════════════════════════════════════════════════ */}
          {slip > 0.005 ? (
            <g id="exposed-fault-plane">
              {/* Dinding Gesekan Sesar: 3 Strata Bersambung Sempurna */}
              <polygon
                points={`
                  ${L_front_tr[0]},${L_front_tr[1]} 
                  ${R_front_tl[0]},${R_front_tl[1]} 
                  ${R_front_tl[0]},${R_front_tl[1] + h1} 
                  ${L_front_tr[0]},${L_front_tr[1] + h1}
                `}
                fill="url(#strataL1Side)"
                stroke="#3d210d"
                strokeWidth="0.8"
              />
              <polygon
                points={`
                  ${L_front_tr[0]},${L_front_tr[1] + h1} 
                  ${R_front_tl[0]},${R_front_tl[1] + h1} 
                  ${R_front_tl[0]},${R_front_tl[1] + h1 + h2} 
                  ${L_front_tr[0]},${L_front_tr[1] + h1 + h2}
                `}
                fill="url(#strataL2Side)"
                stroke="#3d210d"
                strokeWidth="0.8"
              />
              <polygon
                points={`
                  ${L_front_tr[0]},${L_front_tr[1] + h1 + h2} 
                  ${R_front_tl[0]},${R_front_tl[1] + h1 + h2} 
                  ${R_front_tl[0]},${R_front_tl[1] + H} 
                  ${L_front_tr[0]},${L_front_tr[1] + H}
                `}
                fill="url(#strataL3Side)"
                stroke="#3d210d"
                strokeWidth="0.8"
              />

              {/* Garis batas sesar alami */}
              <line
                x1={L_front_tr[0]}
                y1={L_front_tr[1]}
                x2={R_front_tl[0]}
                y2={R_front_tl[1]}
                stroke="#3d210d"
                strokeWidth="0.8"
              />
            </g>
          ) : (
            /* Garis Batas Patahan Halus Saat Kedua Balok Menyatu Utuh */
            <g id="fault-seam-unified">
              <line
                x1={cx}
                y1={cy}
                x2={cx}
                y2={cy + H}
                stroke="#451a03"
                strokeWidth="1.8"
                strokeDasharray="4,3"
              />
              <line
                x1={cx}
                y1={cy}
                x2={cx + Dx}
                y2={cy + Dy}
                stroke="#451a03"
                strokeWidth="1.8"
                strokeDasharray="4,3"
              />
            </g>
          )}

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* 3. BALOK KIRI (SOLID 3D CUBE - BERGERAK KE BAWAH/DEPAN)       */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <g id="left-crust-block">
            {/* Dinding Muka Depan Balok Kiri (3 Strata Horizontal) */}
            <polygon
              points={`
                ${L_front_tl[0]},${L_front_tl[1]} 
                ${L_front_tr[0]},${L_front_tr[1]} 
                ${L_front_tr[0]},${L_front_tr[1] + h1} 
                ${L_front_tl[0]},${L_front_tl[1] + h1}
              `}
              fill="url(#strataL1Front)"
              stroke="#451a03"
              strokeWidth="0.8"
            />
            <polygon
              points={`
                ${L_front_tl[0]},${L_front_tl[1] + h1} 
                ${L_front_tr[0]},${L_front_tr[1] + h1} 
                ${L_front_tr[0]},${L_front_tr[1] + h1 + h2} 
                ${L_front_tl[0]},${L_front_tl[1] + h1 + h2}
              `}
              fill="url(#strataL2Front)"
              stroke="#451a03"
              strokeWidth="0.8"
            />
            <polygon
              points={`
                ${L_front_tl[0]},${L_front_tl[1] + h1 + h2} 
                ${L_front_tr[0]},${L_front_tr[1] + h1 + h2} 
                ${L_front_tr[0]},${L_front_tr[1] + H} 
                ${L_front_tl[0]},${L_front_tl[1] + H}
              `}
              fill="url(#strataL3Front)"
              stroke="#451a03"
              strokeWidth="0.8"
            />

            {/* Permukaan Atas Balok Kiri (Top Surface) */}
            <polygon
              points={`
                ${L_front_tl[0]},${L_front_tl[1]} 
                ${L_front_tr[0]},${L_front_tr[1]} 
                ${L_top_back_r[0]},${L_top_back_r[1]} 
                ${L_top_back_l[0]},${L_top_back_l[1]}
              `}
              fill="url(#topSurfaceGrad)"
              stroke="#784824"
              strokeWidth="1.2"
            />

            {/* Panah Merah Balok Kiri (Menunjuk ke Bawah-Depan) */}
            <polygon
              points={leftArrowPoints}
              fill="#dc2626"
              stroke="#7f1d1d"
              strokeWidth="1.2"
              filter="url(#arrowDropGlow)"
            />
          </g>

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* 4. PIN GANTUNG "Gerak Transform" DI ATAS PATAHAN              */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <g id="transform-callout-pin">
            {/* Kotak Putih Label Pin */}
            <rect
              x={pinX - 65}
              y={16}
              width="130"
              height="30"
              rx="6"
              fill="#ffffff"
              stroke="#e2e8f0"
              strokeWidth="1.5"
              filter="url(#arrowDropGlow)"
            />
            <text
              x={pinX}
              y={36}
              fill="#0f172a"
              fontSize="12"
              fontFamily="'Segoe UI', Inter, sans-serif"
              fontWeight="bold"
              textAnchor="middle"
            >
              Gerak Transform
            </text>

            {/* Tiang Penusuk Pin */}
            <line
              x1={pinX}
              y1={46}
              x2={pinX}
              y2={pinY - 6}
              stroke="#ffffff"
              strokeWidth="2.5"
            />

            {/* Kepala Pin Hijau */}
            <circle
              cx={pinX}
              cy={pinY}
              r="8"
              fill="#15803d"
              stroke="#ffffff"
              strokeWidth="2.5"
              filter="url(#arrowDropGlow)"
            />
            <circle cx={pinX - 2} cy={pinY - 2} r="2.5" fill="#86efac" />
          </g>
        </svg>
      </div>


      {/* 3-Card Scientific Explanation for SMP Kelas 8 */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="bg-[#0f172a] border-2 border-amber-500/80 rounded-xl p-2.5 text-slate-200 text-xs shadow-md">
          <div className="flex items-center gap-1.5 mb-1 text-amber-300 font-pixel-title text-[9px] font-bold">
            <PixelIcon name="compass" size={13} />
            <span>1. GERAK MENDATAR</span>
          </div>
          <p className="text-[10px] sm:text-[11px] leading-snug text-slate-300">
            Dua lempeng bergesekan mendatar (horizontal) saling berlawanan arah secara sejajar sepanjang bidang sesar.
          </p>
        </div>

        <div className="bg-[#0f172a] border-2 border-cyan-500/80 rounded-xl p-2.5 text-slate-200 text-xs shadow-md">
          <div className="flex items-center gap-1.5 mb-1 text-cyan-300 font-pixel-title text-[9px] font-bold">
            <PixelIcon name="shield" size={13} />
            <span>2. KONSERVATIF</span>
          </div>
          <p className="text-[10px] sm:text-[11px] leading-snug text-slate-300">
            Tidak ada pembentukan lempeng baru dan tidak ada penghancuran kerak bumi (berbeda dari divergen & konvergen).
          </p>
        </div>

        <div className="bg-[#0f172a] border-2 border-rose-500/80 rounded-xl p-2.5 text-slate-200 text-xs shadow-md">
          <div className="flex items-center gap-1.5 mb-1 text-rose-300 font-pixel-title text-[9px] font-bold">
            <PixelIcon name="zap" size={13} />
            <span>3. GEMPA DANGKAL</span>
          </div>
          <p className="text-[10px] sm:text-[11px] leading-snug text-slate-300">
            Gesekan batuan yang saling mengunci melepaskan energi elastis secara tiba-tiba melahirkan gempa bumi dangkal destruktif.
          </p>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: TAS SIAGA BENCANA 72 JAM (AREA 4 TEMUAN 1)
// ═════════════════════════════════════════════════════════════════════════════
// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: TAS SIAGA BENCANA 72 JAM (AREA 4 TEMUAN 1)
// ═════════════════════════════════════════════════════════════════════════════
function EarthquakePrepIllustration() {
  const [activeItem, setActiveItem] = useState<'air' | 'p3k' | 'senter' | 'dokumen'>('air');

  const itemDetails = {
    air: {
      title: 'AIR MINUM & RANSUM ENERGI',
      desc: 'Minimal 3 liter air per orang per hari serta ransum biskuit/makanan kaleng tahan lama berkalori tinggi yang cukup untuk bertahan hidup mandiri minimal 72 jam pertama.',
      color: '#38bdf8',
    },
    p3k: {
      title: 'KOTAK P3K & OBAT PRIBADI',
      desc: 'Kasa steril, perban, plester, cairan antiseptik luka, obat pereda nyeri, dan obat-obatan rutin pribadi yang tersimpan rapat dalam wadah anti-air.',
      color: '#ef4444',
    },
    senter: {
      title: 'SENTER LED & PELUIT DARURAT',
      desc: 'Senter tahan air dengan baterai cadangan untuk penerangan saat listrik padam total, serta peluit darurat untuk memanggil tim SAR tanpa menguras tenaga vokal.',
      color: '#facc15',
    },
    dokumen: {
      title: 'DOKUMEN PENTING & UANG TUNAI',
      desc: 'Fotokopi Kartu Keluarga, ijazah, akta lahir, KTP, kartu identitas, dan uang tunai secukupnya yang terlindungi aman dalam kantung ziplock kedap air.',
      color: '#10b981',
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 font-pixel">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 border-b border-slate-800">
        <span className="text-[9px] font-pixel-title text-sky-400 font-bold flex items-center gap-1.5">
          <PixelIcon name="shield" size={13} />
          TAS SIAGA BENCANA (SURVIVAL KIT 72 JAM)
        </span>
        <span className="text-[9px] text-slate-400 font-pixel">
          STANDAR BNPB &amp; BPBD
        </span>
      </div>

      {/* SVG Backpack & Items Visual (High-Detail Pixel Art, NO text inside image) */}
      <div className="w-full flex-1 flex items-center justify-center p-2">
        <svg viewBox="0 0 540 220" className="w-full h-full object-contain" shapeRendering="crispEdges">
          {/* Background Room Corner */}
          <rect x="0" y="0" width="540" height="220" fill="#0b0f19" />
          {/* Floor & Wall Line */}
          <rect x="0" y="0" width="540" height="175" fill="#0f172a" />
          <line x1="0" y1="175" x2="540" y2="175" stroke="#1e293b" strokeWidth="3" />
          <rect x="0" y="175" width="540" height="45" fill="#1e293b" />
          {/* Lantai Kayu Planks */}
          <line x1="120" y1="175" x2="100" y2="220" stroke="#0f172a" strokeWidth="2" />
          <line x1="260" y1="175" x2="240" y2="220" stroke="#0f172a" strokeWidth="2" />
          <line x1="400" y1="175" x2="380" y2="220" stroke="#0f172a" strokeWidth="2" />

          {/* ── DETAIL PIXEL BACKPACK (KIRI) ── */}
          <g transform="translate(45, 18)">
            {/* Bayangan Tas di Lantai */}
            <ellipse cx="65" cy="165" rx="55" ry="10" fill="#070b12" opacity="0.7" />

            {/* Matras Darurat Gulung di Atas Tas (Thermal Sleeping Mat Roll) */}
            <g transform="translate(18, 0)">
              <rect x="0" y="2" width="94" height="20" rx="6" fill="#0284c7" stroke="#0c4a6e" strokeWidth="2" />
              <rect x="4" y="6" width="86" height="4" fill="#38bdf8" />
              <circle cx="8" cy="12" r="6" fill="#0369a1" />
              <circle cx="8" cy="12" r="3" fill="#075985" />
              {/* Tali Pengikat Matras */}
              <rect x="24" y="0" width="6" height="24" fill="#1e293b" />
              <rect x="23" y="10" width="8" height="4" fill="#94a3b8" />
              <rect x="68" y="0" width="6" height="24" fill="#1e293b" />
              <rect x="67" y="10" width="8" height="4" fill="#94a3b8" />
            </g>

            {/* Tali Bahu Ransel Padded Straps Belakang */}
            <rect x="22" y="18" width="10" height="45" rx="4" fill="#7f1d1d" stroke="#450a0a" strokeWidth="2" />
            <rect x="98" y="18" width="10" height="45" rx="4" fill="#7f1d1d" stroke="#450a0a" strokeWidth="2" />

            {/* Bodi Utama Tas Ransel Merah BPBD */}
            <rect x="18" y="24" width="94" height="135" rx="14" fill="#b91c1c" stroke="#450a0a" strokeWidth="3" />
            <rect x="24" y="30" width="82" height="123" rx="10" fill="#dc2626" />

            {/* Highlight Sisi Atas Tas */}
            <path d="M 28 32 Q 65 28 102 32" stroke="#f87171" strokeWidth="2" fill="none" />

            {/* Kompartemen Depan Atas */}
            <rect x="28" y="42" width="74" height="32" rx="6" fill="#991b1b" stroke="#450a0a" strokeWidth="2" />
            <rect x="32" y="46" width="66" height="24" rx="4" fill="#b91c1c" />
            {/* Resleting Atas */}
            <line x1="36" y1="44" x2="94" y2="44" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3 2" />
            <rect x="60" y="41" width="5" height="4" fill="#facc15" />

            {/* Kompartemen Depan Utama Bawah */}
            <rect x="26" y="82" width="78" height="70" rx="8" fill="#991b1b" stroke="#450a0a" strokeWidth="2" />
            <rect x="30" y="86" width="70" height="62" rx="6" fill="#b91c1c" />
            {/* Resleting Bawah */}
            <path d="M 32 90 L 98 90" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3 2" />
            <rect x="62" y="87" width="6" height="5" fill="#facc15" />

            {/* Pita Scotlight Reflektor Kuning-Fluorescent */}
            <rect x="22" y="104" width="86" height="10" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
            <rect x="24" y="106" width="82" height="3" fill="#fef08a" />

            {/* Lambang Palang Putih Medis/Siaga (Tanpa Teks!) */}
            <rect x="58" y="122" width="14" height="18" rx="2" fill="#ffffff" />
            <rect x="52" y="125" width="26" height="12" rx="2" fill="#ffffff" />
            <rect x="60" y="124" width="10" height="14" fill="#dc2626" />
            <rect x="54" y="127" width="22" height="8" fill="#dc2626" />

            {/* Kantong Jaring Samping Kiri (Tempat Botol Air) */}
            <rect x="6" y="75" width="14" height="60" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
            {/* Botol Air di Samping */}
            <rect x="8" y="52" width="10" height="30" rx="3" fill="#0284c7" />
            <rect x="10" y="46" width="6" height="7" fill="#38bdf8" />
            <rect x="11" y="43" width="4" height="4" fill="#e0f2fe" />
            {/* Pola Jaring Mesh */}
            <line x1="6" y1="85" x2="20" y2="95" stroke="#475569" strokeWidth="1" />
            <line x1="6" y1="95" x2="20" y2="105" stroke="#475569" strokeWidth="1" />
            <line x1="6" y1="105" x2="20" y2="115" stroke="#475569" strokeWidth="1" />

            {/* Kantong Jaring Samping Kanan (Tempat Senter) */}
            <rect x="110" y="75" width="14" height="60" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="113" y="56" width="8" height="25" rx="2" fill="#334155" />
            <rect x="112" y="52" width="10" height="5" fill="#facc15" />

            {/* Pegangan Atas Tas (Top Grab Handle) */}
            <rect x="50" y="18" width="30" height="10" rx="4" fill="none" stroke="#7f1d1d" strokeWidth="4" />
          </g>

          {/* ── DETAIL GEAR SHOWCASE (KANAN) - 100% BEBAS TEKS DALAM GAMBAR ── */}
          <g transform="translate(205, 16)">
            {/* Frame Wadah Peralatan */}
            <rect x="0" y="0" width="315" height="175" rx="10" fill="#0f172a" stroke={itemDetails[activeItem].color} strokeWidth="2.5" />
            <rect x="0" y="0" width="315" height="28" rx="10" fill="#1e293b" />
            <text x="14" y="18" fill={itemDetails[activeItem].color} fontSize="8.5" fontWeight="bold" fontFamily="'Press Start 2P', monospace">
              {itemDetails[activeItem].title}
            </text>

            {/* 1. VISUAL AIR & RANSUM ENERGI (BEBAS TEKS) */}
            {activeItem === 'air' && (
              <g transform="translate(18, 42)">
                {/* Botol Air Tritan Transparan dengan Skala Ukur */}
                <g transform="translate(0, 0)">
                  <rect x="4" y="24" width="36" height="76" rx="8" fill="#0369a1" stroke="#38bdf8" strokeWidth="2.5" />
                  {/* Air di dalam botol (Efek Gelombang & Gradien) */}
                  <rect x="8" y="38" width="28" height="58" rx="5" fill="#38bdf8" opacity="0.85" />
                  <line x1="8" y1="38" x2="36" y2="38" stroke="#ffffff" strokeWidth="1.5" />
                  {/* Pantulan Cahaya Botol */}
                  <line x1="12" y1="44" x2="12" y2="88" stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round" />
                  {/* Garis Ukur Mililiter di Samping */}
                  <line x1="30" y1="50" x2="34" y2="50" stroke="#0c4a6e" strokeWidth="1.5" />
                  <line x1="28" y1="62" x2="34" y2="62" stroke="#0c4a6e" strokeWidth="1.5" />
                  <line x1="30" y1="74" x2="34" y2="74" stroke="#0c4a6e" strokeWidth="1.5" />
                  {/* Leher & Tutup Botol dengan Tali Gantungan */}
                  <rect x="12" y="12" width="20" height="14" rx="2" fill="#075985" stroke="#38bdf8" strokeWidth="1.5" />
                  <rect x="10" y="6" width="24" height="8" rx="2" fill="#0284c7" />
                  <path d="M 32 10 Q 42 16 40 28" fill="none" stroke="#0284c7" strokeWidth="2" />
                </g>

                {/* Kemasan Ransum Biskuit Kalori Foil Emas (Tanpa Tulisan) */}
                <g transform="translate(56, 15)">
                  <rect x="0" y="8" width="62" height="42" rx="4" fill="#d97706" stroke="#f59e0b" strokeWidth="2.5" />
                  {/* Segel Gigi Foil Atas & Bawah */}
                  <line x1="0" y1="12" x2="62" y2="12" stroke="#fef3c7" strokeWidth="1.5" strokeDasharray="3 2" />
                  <line x1="0" y1="46" x2="62" y2="46" stroke="#fef3c7" strokeWidth="1.5" strokeDasharray="3 2" />
                  {/* Emboss Grid Tekstur Biskuit */}
                  <rect x="8" y="18" width="46" height="22" rx="2" fill="#b45309" />
                  <circle cx="16" cy="24" r="2" fill="#fde68a" />
                  <circle cx="26" cy="24" r="2" fill="#fde68a" />
                  <circle cx="36" cy="24" r="2" fill="#fde68a" />
                  <circle cx="46" cy="24" r="2" fill="#fde68a" />
                  <circle cx="16" cy="34" r="2" fill="#fde68a" />
                  <circle cx="26" cy="34" r="2" fill="#fde68a" />
                  <circle cx="36" cy="34" r="2" fill="#fde68a" />
                  <circle cx="46" cy="34" r="2" fill="#fde68a" />
                </g>

                {/* Makanan Kaleng Darurat (Pull-Ring Tin Can) */}
                <g transform="translate(58, 65)">
                  <ellipse cx="28" cy="10" rx="26" ry="8" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />
                  <rect x="2" y="10" width="52" height="25" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
                  <ellipse cx="28" cy="35" rx="26" ry="8" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                  {/* Cincin Pembuka Tutup Kaleng */}
                  <circle cx="24" cy="9" r="4" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
                  <rect x="28" y="8" width="6" height="2" fill="#e2e8f0" />
                </g>
              </g>
            )}

            {/* 2. VISUAL KOTAK P3K & OBAT MEDIS (BEBAS TEKS) */}
            {activeItem === 'p3k' && (
              <g transform="translate(16, 40)">
                {/* Kotak Medis Merah dengan Palang Putih Timbul */}
                <g transform="translate(0, 5)">
                  <rect x="0" y="8" width="68" height="52" rx="6" fill="#dc2626" stroke="#991b1b" strokeWidth="2.5" />
                  <rect x="4" y="12" width="60" height="44" rx="4" fill="#ef4444" />
                  {/* Pegangan Koper Medis */}
                  <rect x="24" y="0" width="20" height="9" rx="3" fill="none" stroke="#dc2626" strokeWidth="3" />
                  {/* Lambang Palang Putih Bersih */}
                  <rect x="28" y="22" width="12" height="24" fill="#ffffff" />
                  <rect x="22" y="28" width="24" height="12" fill="#ffffff" />
                </g>

                {/* Botol Antiseptik dengan Pipet Tetes */}
                <g transform="translate(76, 5)">
                  <rect x="4" y="18" width="24" height="42" rx="4" fill="#92400e" stroke="#78350f" strokeWidth="2" />
                  <rect x="8" y="24" width="16" height="22" fill="#fef3c7" rx="2" />
                  <circle cx="16" cy="35" r="3" fill="#dc2626" />
                  {/* Leher & Pipet */}
                  <rect x="10" y="10" width="12" height="8" fill="#1e293b" />
                  <ellipse cx="16" cy="8" rx="6" ry="4" fill="#0f172a" />
                </g>

                {/* Strip Blister Obat Kapsul 6 Butir */}
                <g transform="translate(4, 68)">
                  <rect x="0" y="0" width="62" height="34" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
                  {/* Kapsul 1, 2, 3 */}
                  <rect x="6" y="5" width="14" height="8" rx="4" fill="#3b82f6" />
                  <rect x="13" y="5" width="7" height="8" rx="4" fill="#ffffff" />
                  <rect x="24" y="5" width="14" height="8" rx="4" fill="#ef4444" />
                  <rect x="31" y="5" width="7" height="8" rx="4" fill="#ffffff" />
                  <rect x="42" y="5" width="14" height="8" rx="4" fill="#22c55e" />
                  <rect x="49" y="5" width="7" height="8" rx="4" fill="#ffffff" />
                  {/* Kapsul 4, 5, 6 */}
                  <rect x="6" y="19" width="14" height="8" rx="4" fill="#eab308" />
                  <rect x="13" y="19" width="7" height="8" rx="4" fill="#ffffff" />
                  <rect x="24" y="19" width="14" height="8" rx="4" fill="#a855f7" />
                  <rect x="31" y="19" width="7" height="8" rx="4" fill="#ffffff" />
                  <rect x="42" y="19" width="14" height="8" rx="4" fill="#06b6d4" />
                  <rect x="49" y="19" width="7" height="8" rx="4" fill="#ffffff" />
                </g>

                {/* Gulungan Perban Kasa Steril */}
                <g transform="translate(74, 58)">
                  <ellipse cx="20" cy="22" rx="16" ry="16" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                  <ellipse cx="20" cy="22" rx="8" ry="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                  <path d="M 28 32 L 38 40" stroke="#f8fafc" strokeWidth="4" />
                </g>
              </g>
            )}

            {/* 3. VISUAL SENTER TAKTIS & PELUIT SAR (BEBAS TEKS) */}
            {activeItem === 'senter' && (
              <g transform="translate(18, 40)">
                {/* Senter Taktis Logam dengan Sorot Lampu */}
                <g transform="translate(0, 8)">
                  {/* Sorot Cahaya Terang */}
                  <polygon points="45,18 115,0 115,50 45,30" fill="url(#senterBeamGrad)" opacity="0.65" />
                  {/* Kepala Senter Bezel */}
                  <polygon points="30,12 45,8 45,40 30,36" fill="#475569" stroke="#64748b" strokeWidth="2" />
                  <rect x="44" y="8" width="4" height="32" rx="2" fill="#38bdf8" />
                  {/* Bodi Tabung Senter Bertekstur Knurling */}
                  <rect x="0" y="17" width="30" height="14" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                  <line x1="6" y1="17" x2="6" y2="31" stroke="#475569" strokeWidth="1" />
                  <line x1="12" y1="17" x2="12" y2="31" stroke="#475569" strokeWidth="1" />
                  <line x1="18" y1="17" x2="18" y2="31" stroke="#475569" strokeWidth="1" />
                  <line x1="24" y1="17" x2="24" y2="31" stroke="#475569" strokeWidth="1" />
                  {/* Tombol Saklar Oranye */}
                  <rect x="12" y="13" width="6" height="4" rx="1" fill="#f97316" />
                </g>

                {/* Peluit Darurat Oranye Terang dengan Tali Gantungan */}
                <g transform="translate(10, 60)">
                  {/* Tali Gantungan Lanyard */}
                  <path d="M 12 18 Q 0 35 20 45 Q 40 50 35 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeDasharray="4 2" />
                  {/* Bodi Peluit */}
                  <rect x="25" y="12" width="35" height="16" rx="4" fill="#ea580c" stroke="#9a3412" strokeWidth="2" />
                  <rect x="48" y="15" width="18" height="10" fill="#f97316" />
                  {/* Lubang Udara & Bola Peluit */}
                  <rect x="36" y="9" width="8" height="6" fill="#431407" />
                  <circle cx="34" cy="20" r="4" fill="#ffffff" opacity="0.8" />
                </g>

                {/* 2 Baterai Cadangan AA */}
                <g transform="translate(78, 60)">
                  {/* Baterai 1 */}
                  <rect x="0" y="4" width="14" height="32" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  <rect x="0" y="4" width="14" height="8" fill="#d97706" />
                  <rect x="4" y="0" width="6" height="4" fill="#d97706" />
                  {/* Baterai 2 */}
                  <rect x="18" y="4" width="14" height="32" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  <rect x="18" y="4" width="14" height="8" fill="#d97706" />
                  <rect x="22" y="0" width="6" height="4" fill="#d97706" />
                </g>
              </g>
            )}

            {/* 4. VISUAL DOKUMEN PENTING & UANG (BEBAS TEKS) */}
            {activeItem === 'dokumen' && (
              <g transform="translate(16, 38)">
                {/* Kantong Ziplock Kedap Air (Waterproof Pouch) */}
                <rect x="0" y="4" width="105" height="74" rx="6" fill="#047857" opacity="0.25" stroke="#10b981" strokeWidth="2" strokeDasharray="5 3" />
                {/* Segel Klip Biru Ziplock */}
                <rect x="0" y="4" width="105" height="8" rx="2" fill="#0284c7" />
                <line x1="4" y1="8" x2="101" y2="8" stroke="#38bdf8" strokeWidth="2" />

                {/* Lembar Dokumen / Sertifikat Berlipat di Dalam Pouch */}
                <g transform="translate(10, 16)">
                  <rect x="0" y="0" width="55" height="54" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                  {/* Pita / Lambang Segel Garuda Merah */}
                  <circle cx="28" cy="14" r="6" fill="#dc2626" />
                  {/* Baris Dokumen Abstrak (Bukan Huruf/Kata) */}
                  <line x1="8" y1="26" x2="47" y2="26" stroke="#475569" strokeWidth="2" />
                  <line x1="8" y1="33" x2="42" y2="33" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="8" y1="40" x2="47" y2="40" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="8" y1="47" x2="35" y2="47" stroke="#94a3b8" strokeWidth="1.5" />
                </g>

                {/* Kartu Identitas / KTP dengan Foto Siluet */}
                <g transform="translate(48, 30)">
                  <rect x="0" y="0" width="46" height="30" rx="3" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
                  {/* Foto Siluet */}
                  <rect x="4" y="5" width="14" height="20" rx="2" fill="#0369a1" />
                  <circle cx="11" cy="11" r="3.5" fill="#bae6fd" />
                  <path d="M 6 23 Q 11 17 16 23" fill="#bae6fd" />
                  {/* Garis Data ID */}
                  <line x1="22" y1="8" x2="40" y2="8" stroke="#0284c7" strokeWidth="2" />
                  <line x1="22" y1="14" x2="38" y2="14" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="22" y1="20" x2="35" y2="20" stroke="#64748b" strokeWidth="1.5" />
                </g>

                {/* Gulungan Uang Tunai Pecahan Kecil dengan Karet Gelang */}
                <g transform="translate(18, 72)">
                  <ellipse cx="14" cy="15" rx="10" ry="14" fill="#15803d" stroke="#16a34a" strokeWidth="1.5" />
                  <rect x="14" y="1" width="48" height="28" fill="#16a34a" stroke="#22c55e" strokeWidth="1.5" />
                  <ellipse cx="62" cy="15" rx="10" ry="14" fill="#22c55e" stroke="#4ade80" strokeWidth="1.5" />
                  {/* Karet Gelang Pengikat Merah */}
                  <rect x="36" y="0" width="5" height="30" fill="#dc2626" />
                </g>
              </g>
            )}

            {/* Panel Teks Deskripsi (Di Sebelah Kanan Grafis) */}
            <foreignObject x="145" y="38" width="160" height="125">
              <p className="text-[10px] text-slate-200 leading-relaxed font-pixel select-none">
                {itemDetails[activeItem].desc}
              </p>
            </foreignObject>
          </g>

          {/* Gradients */}
          <defs>
            <linearGradient id="senterBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#fef08a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Button Switcher Item */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
        <button
          onClick={() => setActiveItem('air')}
          className={`px-2 py-1.5 rounded-lg border-2 text-[9px] font-pixel-title cursor-pointer transition-all ${activeItem === 'air'
            ? 'bg-sky-500 text-slate-950 border-sky-300 font-bold'
            : 'bg-slate-800 text-sky-300 border-slate-700 hover:border-sky-500'}`}
        >
          1. AIR &amp; RANSUM
        </button>
        <button
          onClick={() => setActiveItem('p3k')}
          className={`px-2 py-1.5 rounded-lg border-2 text-[9px] font-pixel-title cursor-pointer transition-all ${activeItem === 'p3k'
            ? 'bg-rose-500 text-slate-950 border-rose-300 font-bold'
            : 'bg-slate-800 text-rose-300 border-slate-700 hover:border-rose-500'}`}
        >
          2. KOTAK P3K
        </button>
        <button
          onClick={() => setActiveItem('senter')}
          className={`px-2 py-1.5 rounded-lg border-2 text-[9px] font-pixel-title cursor-pointer transition-all ${activeItem === 'senter'
            ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
            : 'bg-slate-800 text-amber-300 border-slate-700 hover:border-amber-400'}`}
        >
          3. SENTER &amp; PELUIT
        </button>
        <button
          onClick={() => setActiveItem('dokumen')}
          className={`px-2 py-1.5 rounded-lg border-2 text-[9px] font-pixel-title cursor-pointer transition-all ${activeItem === 'dokumen'
            ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-bold'
            : 'bg-slate-800 text-emerald-300 border-slate-700 hover:border-emerald-500'}`}
        >
          4. MAP DOKUMEN
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: STANDAR AKSI KESELAMATAN GEMPA BUMI (AREA 1 TEMUAN 2)
// GAMBAR MANUSIA PROPORSIONAL & REALISTIS: SISWA SMP SERAGAM PUTIH-BIRU
// ═════════════════════════════════════════════════════════════════════════════
// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: POSTER STANDAR AKSI KESELAMATAN GEMPA BUMI (AREA 1 TEMUAN 2)
// 100% MENGIKUTI POSTER MITIGASI: MERUNDUK, LINDUNGI DIRI, BERTAHAN PEGANG ERAT,
// SERTA TETAP TENANG & EVAKUASI DENGAN 4 KARTU BERBINGKAI KUNING EMAS
// ═════════════════════════════════════════════════════════════════════════════
function EarthquakeActionIllustration() {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4 | 'all'>(1);

  const cards = [
    {
      id: 1 as const,
      tabTitle: '1. MERUNDUK',
      title: 'MERUNDUK',
      desc: 'Jatuhkan badan ke posisi merangkak. Agar tidak terjatuh dan memudahkan bergerak merangkak menuju tempat berlindung.',
      themeColor: '#dc2626',
      badgeBg: 'bg-red-600',
    },
    {
      id: 2 as const,
      tabTitle: '2. LINDUNGI DIRI',
      title: 'LINDUNGI DIRI',
      desc: 'Lindungi kepala dan leher dengan satu tangan. Jika ada meja atau bangku yang kuat, merangkaklah ke bawahnya.',
      themeColor: '#eab308',
      badgeBg: 'bg-amber-500',
    },
    {
      id: 3 as const,
      tabTitle: '3. BERTAHAN',
      title: 'BERTAHAN PEGANG ERAT',
      desc: 'Pegang erat meja atau benda yang menutupimu agar tetap aman. Jika meja bergeser, ikut bergerak bersamanya sambil tetap berlindung.',
      themeColor: '#ca8a04',
      badgeBg: 'bg-yellow-600',
    },
    {
      id: 4 as const,
      tabTitle: '4. EVAKUASI & TENANG',
      title: 'TETAP TENANG & EVAKUASI',
      desc: 'Jangan panik, supaya bisa berpikir jernih. Setelah gempa reda, segera evakuasi tertib ke titik kumpul dengan melindungi kepala.',
      themeColor: '#16a34a',
      badgeBg: 'bg-emerald-600',
    },
  ];

  // Helper untuk merender grafik 2D PIXEL ART murni tanpa teks di setiap kartu
  const renderCardGraphic = (cardId: 1 | 2 | 3 | 4, _isCompact = false) => {
    switch (cardId) {
      // ═════════════════════════════════════════════════════════════════════════
      // 1. MERUNDUK (DROP): SISWA SMP MERANGKAK MENUJU KOLONG MEJA KAYU
      // ═════════════════════════════════════════════════════════════════════════
      case 1:
        return (
          <svg
            viewBox="0 0 200 110"
            className="w-full h-full object-contain"
            shapeRendering="crispEdges"
          >
            {/* ── LATAR RUANG KELAS & LANTAI KAYU PARQUET ── */}
            <rect x="0" y="0" width="200" height="84" fill="#f8fafc" />
            {/* Dinding bawah / Wainscoting lis kayu */}
            <rect x="0" y="80" width="200" height="4" fill="#78350f" />
            <rect x="0" y="84" width="200" height="26" fill="#e2e8f0" />
            <line x1="0" y1="84" x2="200" y2="84" stroke="#94a3b8" strokeWidth="1" />
            {/* Nat Ubin Keramik Bersih */}
            <line x1="50" y1="84" x2="40" y2="110" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="110" y1="84" x2="100" y2="110" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="170" y1="84" x2="160" y2="110" stroke="#cbd5e1" strokeWidth="1" />

            {/* ── MEJA BELAJAR SISWA SMP KOKOH (SISI KANAN) ── */}
            <g transform="translate(116, 24)">
              {/* Bayangan Meja di Lantai */}
              <rect x="0" y="60" width="70" height="4" fill="#0f172a" opacity="0.2" />

              {/* Kaki Meja Belakang (Warna Lebih Gelap) */}
              <rect x="14" y="10" width="5" height="50" fill="#5c2605" />
              <rect x="58" y="10" width="5" height="50" fill="#5c2605" />

              {/* Laci / Kolong Meja Buku */}
              <rect x="6" y="8" width="60" height="9" fill="#78350f" stroke="#451a03" strokeWidth="1" />
              <rect x="16" y="11" width="14" height="4" fill="#0284c7" />
              <rect x="34" y="11" width="18" height="4" fill="#f59e0b" />

              {/* Kaki Meja Depan Kayu Solid */}
              <rect x="4" y="8" width="7" height="52" fill="#92400e" />
              <rect x="4" y="8" width="2" height="52" fill="#b45309" />
              <rect x="62" y="8" width="7" height="52" fill="#92400e" />
              <rect x="62" y="8" width="2" height="52" fill="#b45309" />
              <rect x="4" y="44" width="65" height="3" fill="#78350f" />

              {/* Daun Meja Kayu Jati Kokoh */}
              <rect x="0" y="0" width="74" height="8" rx="1" fill="#b45309" stroke="#451a03" strokeWidth="1" />
              <rect x="2" y="1" width="70" height="2" fill="#d97706" />
            </g>

            {/* ── KARAKTER SISWA SMP 2D PIXEL: MERUNDUK & MERANGKAK BERTUMPU TANGAN & LUTUT ── */}
            <g transform="translate(16, 42)">
              {/* Bayangan Tubuh Siswa */}
              <ellipse cx="44" cy="42" rx="34" ry="4" fill="#0f172a" opacity="0.25" />

              {/* Kaki Belakang (Sepatu Kets Hitam & Kaus Kaki Putih) */}
              <rect x="2" y="38" width="8" height="4" fill="#0f172a" />
              <rect x="2" y="41" width="8" height="1" fill="#ffffff" />
              <rect x="8" y="35" width="4" height="4" fill="#f8fafc" />

              {/* Tungkai Bawah Kaki Belakang Melipat */}
              <rect x="10" y="32" width="12" height="6" fill="#172554" />

              {/* Kaki Depan (Lutut Kanan Menapak Kokoh di Lantai) */}
              <rect x="28" y="38" width="7" height="3" fill="#f5af7e" />
              <rect x="18" y="34" width="13" height="6" fill="#1e3a8a" />

              {/* Celana Pendek / Panjang Biru SMP & Sabuk */}
              <rect x="16" y="24" width="16" height="12" fill="#1e3a8a" />
              <rect x="18" y="24" width="14" height="3" fill="#2563eb" />
              <rect x="28" y="24" width="3" height="12" fill="#0f172a" />
              <rect x="29" y="28" width="2" height="2" fill="#cbd5e1" />

              {/* Tubuh / Kemeja Putih Seragam SMP Condong Rendah ke Depan */}
              <rect x="30" y="16" width="24" height="14" fill="#ffffff" />
              <rect x="32" y="26" width="20" height="4" fill="#cbd5e1" />
              {/* Saku Dada & Badge OSIS Biru */}
              <rect x="44" y="20" width="3" height="4" fill="#1e3a8a" />
              <rect x="45" y="21" width="1" height="2" fill="#ffffff" />
              {/* Dasi Biru SMP */}
              <rect x="50" y="20" width="3" height="8" fill="#1e3a8a" />

              {/* Lengan Kiri (Lengan Belakang) Menumpu Lantai */}
              <rect x="42" y="22" width="4" height="18" fill="#cbd5e1" />
              <rect x="41" y="40" width="6" height="2" fill="#f5af7e" />

              {/* Lengan Kanan (Lengan Depan) Menumpu Beban Tubuh */}
              <rect x="50" y="18" width="6" height="6" fill="#ffffff" />
              <rect x="52" y="24" width="5" height="16" fill="#f5af7e" />
              <rect x="52" y="24" width="1" height="16" fill="#e07a5f" />
              {/* Telapak & Jari-Jari Tangan Menapak di Lantai */}
              <rect x="52" y="40" width="8" height="2" fill="#f5af7e" />
              <rect x="54" y="40" width="1" height="2" fill="#b45309" />
              <rect x="57" y="40" width="1" height="2" fill="#b45309" />

              {/* Leher & Kepala Siswa Menatap ke Kolong Meja */}
              <rect x="52" y="14" width="6" height="5" fill="#f5af7e" />
              <rect x="54" y="6" width="13" height="11" fill="#f5af7e" />
              {/* Mata Siswa Fokus Rendah */}
              <rect x="62" y="9" width="2" height="2" fill="#0f172a" />
              <rect x="63" y="9" width="1" height="1" fill="#ffffff" />
              {/* Hidung & Telinga */}
              <rect x="67" y="11" width="1" height="2" fill="#e07a5f" />
              <rect x="55" y="9" width="2" height="3" fill="#e07a5f" />
              {/* Rambut Siswa SMP Hitam Rapi Bervolume */}
              <rect x="53" y="3" width="14" height="6" fill="#0f172a" />
              <rect x="53" y="3" width="3" height="9" fill="#0f172a" />
              <rect x="58" y="3" width="8" height="2" fill="#334155" />
              <rect x="63" y="6" width="3" height="3" fill="#0f172a" />
            </g>

            {/* Indikator Panah Gravitasi Rendah Pixel (Aman / Stabil) */}
            <g transform="translate(94, 60)">
              <rect x="2" y="0" width="3" height="12" fill="#f59e0b" />
              <polygon points="0,12 7,12 3.5,17" fill="#f59e0b" />
            </g>
          </svg>
        );

      // ═════════════════════════════════════════════════════════════════════════
      // 2. LINDUNGI DIRI (COVER): SISWA MERINGKUK DI KOLONG MEJA MENDEKAP KEPALA
      // ═════════════════════════════════════════════════════════════════════════
      case 2:
        return (
          <svg
            viewBox="0 0 200 110"
            className="w-full h-full object-contain"
            shapeRendering="crispEdges"
          >
            {/* Latar Ruang Kelas & Lantai Keramik */}
            <rect x="0" y="0" width="200" height="84" fill="#f8fafc" />
            <rect x="0" y="80" width="200" height="4" fill="#78350f" />
            <rect x="0" y="84" width="200" height="26" fill="#e2e8f0" />
            <line x1="0" y1="84" x2="200" y2="84" stroke="#94a3b8" strokeWidth="1" />
            <line x1="60" y1="84" x2="50" y2="110" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="140" y1="84" x2="130" y2="110" stroke="#cbd5e1" strokeWidth="1" />

            {/* Partikel Reruntuhan Langit-Langit Terbentur Daun Meja (Aman Terlindungi) */}
            <rect x="94" y="10" width="3" height="3" fill="#94a3b8" />
            <rect x="112" y="14" width="2" height="2" fill="#cbd5e1" />
            <rect x="80" y="12" width="2" height="3" fill="#cbd5e1" />
            {/* Percikan debu terpental dari atas meja */}
            <rect x="92" y="17" width="2" height="2" fill="#cbd5e1" />
            <rect x="100" y="16" width="3" height="1" fill="#94a3b8" />
            <rect x="116" y="18" width="2" height="2" fill="#cbd5e1" />

            {/* ── MEJA BELAJAR SISWA SMP KOKOH (DI TENGAH) ── */}
            <g transform="translate(45, 20)">
              {/* Bayangan Meja di Lantai */}
              <rect x="2" y="64" width="106" height="5" fill="#0f172a" opacity="0.25" />

              {/* Kaki Meja Belakang */}
              <rect x="18" y="10" width="6" height="54" fill="#5c2605" />
              <rect x="88" y="10" width="6" height="54" fill="#5c2605" />

              {/* Laci / Rak Buku Bawah Daun Meja */}
              <rect x="8" y="9" width="94" height="12" fill="#78350f" stroke="#451a03" strokeWidth="1" />
              <rect x="22" y="13" width="24" height="5" fill="#0284c7" />
              <rect x="52" y="13" width="28" height="5" fill="#f59e0b" />

              {/* ── SISWA SMP MERINGKUK DI KOLONG MEJA ── */}
              <g transform="translate(26, 26)">
                {/* Bayangan Siswa */}
                <ellipse cx="28" cy="38" rx="26" ry="4" fill="#070b12" opacity="0.35" />

                {/* Sepatu Sekolah Hitam & Kaus Kaki Putih */}
                <rect x="0" y="34" width="8" height="4" fill="#0f172a" />
                <rect x="0" y="37" width="8" height="1" fill="#ffffff" />
                <rect x="6" y="32" width="4" height="3" fill="#f8fafc" />

                {/* Kaki & Lutut Melipat di Kolong (Celana Biru SMP) */}
                <rect x="8" y="28" width="14" height="10" fill="#172554" />
                <rect x="18" y="32" width="12" height="6" fill="#1e3a8a" />

                {/* Punggung Melengkung Rendah (Kemeja Putih SMP) */}
                <rect x="14" y="18" width="22" height="14" fill="#ffffff" />
                <rect x="16" y="24" width="20" height="6" fill="#cbd5e1" />
                <rect x="12" y="26" width="6" height="6" fill="#1e3a8a" />

                {/* Kepala Menunduk Rapat Dekat Dada */}
                <rect x="32" y="20" width="12" height="12" fill="#f5af7e" />
                <rect x="32" y="18" width="12" height="8" fill="#0f172a" />
                <rect x="42" y="24" width="2" height="2" fill="#0f172a" />

                {/* KEDUA LENGAN MELINGKARI TENGKUK & KEPALA (STANDAR COVER BAKU) */}
                <rect x="26" y="16" width="8" height="8" fill="#ffffff" />
                <rect x="30" y="13" width="14" height="5" fill="#f5af7e" />
                <rect x="30" y="13" width="14" height="1" fill="#fed7aa" />
                {/* Tangan Mengunci Erat di Belakang Tengkuk */}
                <rect x="40" y="15" width="6" height="5" fill="#e07a5f" />
                <rect x="41" y="16" width="4" height="1" fill="#f5af7e" />
                <rect x="41" y="18" width="4" height="1" fill="#f5af7e" />

                {/* Lengan Lainnya Menopang Keseimbangan di Lantai */}
                <rect x="36" y="28" width="4" height="10" fill="#f5af7e" />
                <rect x="36" y="37" width="6" height="2" fill="#f5af7e" />
              </g>

              {/* Kaki Meja Depan Kayu Solid */}
              <rect x="6" y="8" width="8" height="56" fill="#92400e" />
              <rect x="6" y="8" width="2" height="56" fill="#b45309" />
              <rect x="96" y="8" width="8" height="56" fill="#92400e" />
              <rect x="96" y="8" width="2" height="56" fill="#b45309" />
              <rect x="6" y="50" width="98" height="3" fill="#78350f" />

              {/* Daun Meja Kayu Jati Kokoh Tebal */}
              <rect x="0" y="0" width="110" height="9" rx="1" fill="#b45309" stroke="#451a03" strokeWidth="1" />
              <rect x="2" y="1" width="106" height="2" fill="#d97706" />
            </g>

            {/* Perisai Garis Putus-Putus Cyan Menunjukkan Zona Aman Terlindungi */}
            <rect x="74" y="44" width="56" height="38" rx="4" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.8" />
          </svg>
        );

      // ═════════════════════════════════════════════════════════════════════════
      // 3. BERTAHAN (HOLD ON): SISWA MENCENGKERAM ERAT KAKI MEJA
      // ═════════════════════════════════════════════════════════════════════════
      case 3:
        return (
          <svg
            viewBox="0 0 200 110"
            className="w-full h-full object-contain"
            shapeRendering="crispEdges"
          >
            {/* Latar Ruang Kelas & Lantai Keramik */}
            <rect x="0" y="0" width="200" height="84" fill="#f8fafc" />
            <rect x="0" y="80" width="200" height="4" fill="#78350f" />
            <rect x="0" y="84" width="200" height="26" fill="#e2e8f0" />
            <line x1="0" y1="84" x2="200" y2="84" stroke="#94a3b8" strokeWidth="1" />
            <line x1="60" y1="84" x2="50" y2="110" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="140" y1="84" x2="130" y2="110" stroke="#cbd5e1" strokeWidth="1" />

            {/* Efek Garis Getar Dinamis (Goncangan Meja Bergerak Bersama) */}
            <g opacity="0.6">
              <line x1="38" y1="22" x2="43" y2="22" stroke="#f59e0b" strokeWidth="1.5" />
              <line x1="158" y1="22" x2="163" y2="22" stroke="#f59e0b" strokeWidth="1.5" />
              <line x1="40" y1="50" x2="45" y2="50" stroke="#f59e0b" strokeWidth="1.5" />
              <line x1="156" y1="50" x2="161" y2="50" stroke="#f59e0b" strokeWidth="1.5" />
            </g>

            {/* ── MEJA BELAJAR SISWA SMP KOKOH ── */}
            <g transform="translate(45, 20)">
              {/* Bayangan Meja */}
              <rect x="2" y="64" width="106" height="5" fill="#0f172a" opacity="0.25" />

              {/* Kaki Meja Belakang */}
              <rect x="18" y="10" width="6" height="54" fill="#5c2605" />
              <rect x="88" y="10" width="6" height="54" fill="#5c2605" />
              <rect x="8" y="9" width="94" height="12" fill="#78350f" stroke="#451a03" strokeWidth="1" />

              {/* ── SISWA SMP BERTAHAN & MEMEGANG ERAT KAKI MEJA ── */}
              <g transform="translate(24, 26)">
                {/* Bayangan Siswa */}
                <ellipse cx="32" cy="38" rx="28" ry="4" fill="#070b12" opacity="0.35" />

                {/* Sepatu & Kaki Melipat */}
                <rect x="0" y="34" width="8" height="4" fill="#0f172a" />
                <rect x="0" y="37" width="8" height="1" fill="#ffffff" />
                <rect x="6" y="32" width="4" height="3" fill="#f8fafc" />
                <rect x="8" y="28" width="14" height="10" fill="#172554" />
                <rect x="18" y="32" width="14" height="6" fill="#1e3a8a" />

                {/* Punggung & Tubuh Condong Maju Menjangkau Kaki Meja */}
                <rect x="14" y="18" width="24" height="14" fill="#ffffff" />
                <rect x="16" y="24" width="22" height="6" fill="#cbd5e1" />
                <rect x="12" y="26" width="6" height="6" fill="#1e3a8a" />

                {/* Kepala Menunduk Fokus */}
                <rect x="34" y="18" width="12" height="12" fill="#f5af7e" />
                <rect x="34" y="16" width="12" height="8" fill="#0f172a" />
                <rect x="44" y="22" width="2" height="2" fill="#0f172a" />

                {/* Tangan Kiri Melindungi Belakang Kepala */}
                <rect x="28" y="14" width="12" height="5" fill="#f5af7e" />
                <rect x="38" y="15" width="4" height="4" fill="#e07a5f" />

                {/* LENGAN KANAN MENJANGKAU KE DEPAN & MENCENGKERAM KAKI MEJA DEPAN */}
                <rect x="28" y="18" width="8" height="8" fill="#ffffff" />
                <rect x="34" y="22" width="38" height="6" fill="#f5af7e" />
                <rect x="34" y="26" width="38" height="1" fill="#e07a5f" />

                {/* JARI-JARI TANGAN MELINGKARI KAKI MEJA KAYU SOLID (GRIP TIGHT) */}
                <rect x="70" y="20" width="8" height="10" rx="1" fill="#f5af7e" stroke="#b45309" strokeWidth="1" />
                <rect x="72" y="21" width="5" height="2" fill="#e07a5f" />
                <rect x="72" y="24" width="5" height="2" fill="#e07a5f" />
                <rect x="72" y="27" width="5" height="2" fill="#e07a5f" />

                {/* Pendaran Hijau Tanda Cengkeraman Erat Terkunci */}
                <rect x="68" y="18" width="12" height="14" rx="2" fill="none" stroke="#10b981" strokeWidth="1.5" />
              </g>

              {/* Kaki Meja Depan Kayu Solid */}
              <rect x="6" y="8" width="8" height="56" fill="#92400e" />
              <rect x="6" y="8" width="2" height="56" fill="#b45309" />
              <rect x="96" y="8" width="8" height="56" fill="#92400e" />
              <rect x="96" y="8" width="2" height="56" fill="#b45309" />
              <rect x="6" y="50" width="98" height="3" fill="#78350f" />

              {/* Daun Meja Kayu Jati Kokoh Tebal */}
              <rect x="0" y="0" width="110" height="9" rx="1" fill="#b45309" stroke="#451a03" strokeWidth="1" />
              <rect x="2" y="1" width="106" height="2" fill="#d97706" />
            </g>
          </svg>
        );

      // ═════════════════════════════════════════════════════════════════════════
      // 4. EVAKUASI TERTIB (EVACUATE): SISWA BERDIRI MEMAKAI TAS PELINDUNG KEPALA
      // ═════════════════════════════════════════════════════════════════════════
      case 4:
        return (
          <svg
            viewBox="0 0 200 110"
            className="w-full h-full object-contain"
            shapeRendering="crispEdges"
          >
            {/* Latar Ruang Kelas & Lantai Keramik Menuju Pintu Keluar */}
            <rect x="0" y="0" width="200" height="84" fill="#f8fafc" />
            <rect x="0" y="80" width="200" height="4" fill="#78350f" />
            <rect x="0" y="84" width="200" height="26" fill="#e2e8f0" />
            <line x1="0" y1="84" x2="200" y2="84" stroke="#94a3b8" strokeWidth="1" />
            <line x1="50" y1="84" x2="40" y2="110" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="110" y1="84" x2="100" y2="110" stroke="#cbd5e1" strokeWidth="1" />

            {/* ── PINTU KELUAR RUANG KELAS TERBUKA MENUJU TITIK KUMPUL (SISI KANAN) ── */}
            <g transform="translate(148, 8)">
              {/* Kusen Pintu Kayu Jati */}
              <rect x="0" y="0" width="46" height="76" fill="#78350f" stroke="#451a03" strokeWidth="1" />

              {/* Rambu Hijau Darurat Evakuasi Tanpa Tulisan (Ikon Orang Lari & Panah Putih) */}
              <rect x="6" y="4" width="34" height="12" rx="2" fill="#16a34a" stroke="#15803d" strokeWidth="1" />
              {/* Sosok Siluet Putih Orang Berlari di Rambu */}
              <circle cx="16" cy="9" r="1.5" fill="#ffffff" />
              <rect x="15" y="11" width="3" height="3" fill="#ffffff" />
              <rect x="18" y="11" width="2" height="2" fill="#ffffff" />
              <rect x="14" y="14" width="2" height="2" fill="#ffffff" />
              {/* Panah Putih Keluar ➔ */}
              <rect x="25" y="9" width="7" height="2" fill="#ffffff" />
              <polygon points="32,7 36,10 32,13" fill="#ffffff" />

              {/* Bukaan Pintu Keluar dengan Cahaya Koridor Terang */}
              <rect x="4" y="18" width="38" height="58" fill="#bae6fd" />
              <rect x="4" y="18" width="10" height="58" fill="#7dd3fc" />
              <rect x="4" y="66" width="38" height="10" fill="#e2e8f0" />
            </g>

            {/* ── KARAKTER SISWA SMP 2D PIXEL: BERJALAN TERTIB MELINDUNGI KEPALA DENGAN TAS ── */}
            <g transform="translate(74, 18)">
              {/* Bayangan Siswa Melangkah di Lantai */}
              <ellipse cx="20" cy="66" rx="16" ry="4" fill="#0f172a" opacity="0.25" />

              {/* Kaki Belakang (Melangkah Celana Biru SMP & Sepatu) */}
              <rect x="8" y="48" width="6" height="16" fill="#172554" />
              <rect x="6" y="64" width="8" height="4" fill="#0f172a" />
              <rect x="6" y="67" width="8" height="1" fill="#ffffff" />

              {/* Kaki Depan (Melangkah Maju Menuju Pintu) */}
              <rect x="20" y="48" width="6" height="16" fill="#1e3a8a" />
              <rect x="22" y="64" width="8" height="4" fill="#0f172a" />
              <rect x="22" y="67" width="8" height="1" fill="#ffffff" />

              {/* Pinggul & Sabuk Siswa SMP */}
              <rect x="10" y="44" width="16" height="5" fill="#1e3a8a" />
              <rect x="10" y="44" width="16" height="2" fill="#0f172a" />
              <rect x="16" y="44" width="3" height="2" fill="#cbd5e1" />

              {/* Tubuh Tegak Berbusana Kemeja Putih Seragam SMP */}
              <rect x="10" y="24" width="16" height="20" fill="#ffffff" />
              <rect x="10" y="38" width="16" height="6" fill="#cbd5e1" />
              {/* Dasi Biru SMP */}
              <rect x="17" y="26" width="3" height="10" fill="#1e3a8a" />
              {/* Badge OSIS */}
              <rect x="12" y="28" width="2" height="3" fill="#1e3a8a" />

              {/* Kepala Siswa Terlindungi di Bawah Tas Ransel */}
              <rect x="13" y="16" width="11" height="10" fill="#f5af7e" />
              {/* Mata Siswa Menatap Tenang ke Depan */}
              <rect x="20" y="18" width="2" height="2" fill="#0f172a" />
              <rect x="21" y="18" width="1" height="1" fill="#ffffff" />
              {/* Rambut Siswa Rapi */}
              <rect x="12" y="15" width="12" height="4" fill="#0f172a" />
              <rect x="11" y="15" width="3" height="7" fill="#0f172a" />

              {/* TAS RANSEL MERAH DIANGKAT DI ATAS KEPALA (PERISAI JATUHAN) */}
              <rect x="2" y="0" width="30" height="14" rx="2" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
              <rect x="6" y="3" width="22" height="3" fill="#facc15" />
              <rect x="10" y="9" width="14" height="2" fill="#7f1d1d" />

              {/* Kedua Tangan Memegang Erat Sisi Kiri & Kanan Tas di Atas Kepala */}
              <rect x="4" y="12" width="6" height="4" fill="#f5af7e" />
              <rect x="24" y="12" width="6" height="4" fill="#f5af7e" />

              {/* Lengan Kiri & Kanan Terangkat Menopang Tas */}
              <rect x="6" y="16" width="5" height="12" fill="#ffffff" />
              <rect x="23" y="16" width="5" height="12" fill="#ffffff" />
            </g>

            {/* Jejak Kaki Panah Hijau Halus di Lantai Menuju Pintu */}
            <g transform="translate(116, 92)" fill="#16a34a" opacity="0.8">
              <polygon points="0,4 6,2 6,6" />
              <polygon points="12,4 18,2 18,6" />
              <polygon points="24,4 30,2 30,6" />
            </g>
          </svg>
        );
    }
  };

  const currentCard = typeof activeTab === 'number' ? cards.find((c) => c.id === activeTab)! : cards[0];

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 font-pixel bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 select-none">
      {/* 1. Bar Navigasi Switcher Langkah & Tampilan Poster Lengkap */}
      <div className="w-full flex items-center justify-between px-1 pb-1 border-b border-slate-800 shrink-0 gap-2">
        <span className="text-[9px] font-pixel-title text-amber-400 font-bold flex items-center gap-1.5 truncate">
          <PixelIcon name="zap" size={13} className="shrink-0" />
          POSTER AKSI KESELAMATAN GEMPA BUMI
        </span>
        <button
          onClick={() => {
            retroAudio.playSelect();
            setActiveTab(activeTab === 'all' ? 1 : 'all');
          }}
          className={`px-2.5 py-1 rounded-lg border-2 text-[8.5px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 shrink-0 ${
            activeTab === 'all'
              ? 'bg-amber-400 text-slate-950 border-amber-200 font-bold shadow-[0_2px_0_#92400e]'
              : 'bg-slate-800 text-amber-300 border-amber-600/60 hover:bg-slate-700'
          }`}
        >
          {activeTab === 'all' ? '🔍 LIHAT PER LANGKAH' : '📑 POSTER 4 KARTU'}
        </button>
      </div>

      {/* 2. Switcher 4 Tombol Tab di Bagian Atas */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1.5 py-1 shrink-0 z-10">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => {
              retroAudio.playSelect();
              setActiveTab(card.id);
            }}
            className={`px-2 py-1.5 rounded-lg border-2 text-[8.5px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 flex items-center justify-center gap-1.5 ${
              activeTab === card.id
                ? 'bg-amber-400 text-slate-950 border-amber-200 font-bold shadow-[0_2px_0_#92400e]'
                : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:border-amber-400 hover:text-white'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${card.badgeBg} shrink-0`} />
            <span className="truncate">{card.tabTitle}</span>
          </button>
        ))}
      </div>

      {/* 3. Area Visual Utama: Single Card Zoom ATAU 4-Card Poster Grid */}
      <div className="w-full flex-1 min-h-[170px] max-h-[260px] flex items-center justify-center p-1 overflow-y-auto">
        {activeTab === 'all' ? (
          /* ── TAMPILAN POSTER LENGKAP 4 KARTU (PERSIS SEPERTI GAMBAR PENGGUNA) ── */
          <div className="w-full h-full grid grid-cols-2 gap-2 p-1 max-w-2xl">
            {cards.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  retroAudio.playSelect();
                  setActiveTab(c.id);
                }}
                className="bg-white rounded-xl border-2 border-[#facc15] shadow-md p-2 flex flex-col items-center justify-between text-center cursor-pointer hover:scale-[1.02] transition-transform group"
                title={`Klik untuk memperbesar ${c.title}`}
              >
                {/* Judul Kartu */}
                <h4 className="font-bold text-[#0f172a] text-[9px] sm:text-[10px] tracking-wider uppercase font-sans mb-1 line-clamp-1">
                  {c.title}
                </h4>

                {/* Grafik Vektor Sesuai Poster */}
                <div className="w-full h-16 sm:h-20 flex items-center justify-center my-0.5">
                  {renderCardGraphic(c.id, true)}
                </div>

                {/* Keterangan Teks Singkat */}
                <p className="text-[7.5px] sm:text-[8.5px] text-[#334155] leading-tight font-sans font-medium line-clamp-2 px-1">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        ) : (
          /* ── TAMPILAN SATU KARTU BESAR BERBINGKAI KUNING EMAS (PERSIS DESAIN POSTER) ── */
          <div className="w-full max-w-md h-full bg-white rounded-2xl border-3 border-[#facc15] shadow-2xl p-3 sm:p-4 flex flex-col items-center justify-between text-center animate-fadeIn relative">
            {/* Nomor Urut Badge */}
            <div className="absolute top-2.5 left-3 w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-pixel-title text-[9px] font-bold flex items-center justify-center border border-amber-500 shadow-sm">
              {currentCard.id}
            </div>

            {/* Judul Kartu Resmi Poster */}
            <h3 className="font-bold text-[#0f172a] text-xs sm:text-sm tracking-wider uppercase font-sans mt-0.5 px-6">
              {currentCard.title}
            </h3>

            {/* Ilustrasi Vektor Siluet Realistis Sesuai Poster */}
            <div className="w-full flex-1 max-h-[140px] flex items-center justify-center my-1">
              {renderCardGraphic(currentCard.id, false)}
            </div>

            {/* Teks Penjelasan Edukasi Baku Sesuai Poster */}
            <div className="w-full bg-amber-50/70 rounded-xl p-2 border border-amber-200/60 mt-1">
              <p className="text-[10px] sm:text-[11px] text-[#1e293b] leading-relaxed font-sans font-medium">
                {currentCard.desc}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Footer Kontrol Cepat Sebelumnya / Selanjutnya */}
      {typeof activeTab === 'number' && (
        <div className="w-full flex items-center justify-between px-2 pt-1 border-t border-slate-800 shrink-0">
          <button
            onClick={() => {
              retroAudio.playSelect();
              setActiveTab((prev) => (prev === 1 ? 4 : ((prev as number) - 1) as any));
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[8.5px] font-pixel cursor-pointer active:translate-y-0.5 flex items-center gap-1"
          >
            <span>◀ SEBELUMNYA</span>
          </button>
          <span className="text-[8.5px] text-amber-400 font-pixel">
            LANGKAH {activeTab} DARI 4
          </span>
          <button
            onClick={() => {
              retroAudio.playSelect();
              setActiveTab((prev) => (prev === 4 ? 1 : ((prev as number) + 1) as any));
            }}
            className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white border border-amber-400 text-[8.5px] font-pixel cursor-pointer active:translate-y-0.5 flex items-center gap-1"
          >
            <span>SELANJUTNYA ▶</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: 4 STATUS TINGKAT AKTIVITAS PVMBG & KRB (AREA 5 TEMUAN 1)
// ═════════════════════════════════════════════════════════════════════════════
function VolcanoStatusIllustration() {
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3 | 4>(4);

  const levels = [
    {
      lvl: 1,
      name: 'NORMAL (LEVEL I)',
      color: '#22c55e',
      border: '#15803d',
      desc: 'Aktivitas dasar vulkanik. Tidak ada peningkatan aktivitas kegempaan visual maupun seismik. Kawasan aman untuk aktivitas rutin masyarakat.',
      radius: 'Radius aman 0 - 2 km (Kubah aman)',
    },
    {
      lvl: 2,
      name: 'WASPADA (LEVEL II)',
      color: '#eab308',
      border: '#a16207',
      desc: 'Mulai terjadi kenaikan aktivitas seismik & gempa vulkanik dangkal. Mulai teramati asap kawah solfatara tipis. Warga dilarang mendekati kawah.',
      radius: 'Radius bahaya 2 - 3 km dari kawah',
    },
    {
      lvl: 3,
      name: 'SIAGA (LEVEL III)',
      color: '#f97316',
      border: '#c2410c',
      desc: 'Peningkatan seismik sangat intensif dan kubah lava membesar aktif. Berpotensi erupsi eksplosif atau awan panas. Posko evakuasi mulai siaga penuh.',
      radius: 'Radius bahaya 3 - 5 km dari kawah',
    },
    {
      lvl: 4,
      name: 'AWAS (LEVEL IV)',
      color: '#ef4444',
      border: '#991b1b',
      desc: 'Letusan utama sedang atau segera berlangsung! Luncuran awan panas wedhus gembel & batu pijar mengancam. Warga di KRB III wajib evakuasi total.',
      radius: 'Radius bahaya > 5 - 10 km (KRB III Wajib Mengungsi)',
    },
  ];

  const current = levels.find((l) => l.lvl === activeLevel)!;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 font-pixel">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 border-b border-slate-800">
        <span className="text-[9px] font-pixel-title text-rose-400 font-bold flex items-center gap-1.5">
          <PixelIcon name="volcano" size={13} />
          TINGKAT AKTIVITAS GUNUNG API PVMBG &amp; KRB MERAPI
        </span>
        <span className="text-[9px] text-slate-400 font-pixel">
          STANDAR RESMI KESDM / PVMBG
        </span>
      </div>

      {/* SVG Merapi Cross-Section & KRB Zones */}
      <div className="w-full flex-1 flex items-center justify-center p-2">
        <svg viewBox="0 0 540 210" className="w-full h-full object-contain" shapeRendering="crispEdges">
          <rect x="0" y="0" width="540" height="210" fill="#090505" />

          {/* Siluet Gunung Stratovolcano Merapi */}
          <polygon points="40,185 270,40 500,185" fill="#1c0c08" stroke="#451a03" strokeWidth="3" />

          {/* Dapur Magma & Pipa Kepundan */}
          <rect x="264" y="55" width="12" height="130" fill="#ea580c" />
          <ellipse cx="270" cy="180" rx="35" ry="15" fill="#dc2626" />

          {/* Kubah Lava Puncak & Asap Sesuai Level */}
          {activeLevel >= 2 && (
            <ellipse cx="270" cy="40" rx="14" ry="6" fill={current.color} />
          )}
          {activeLevel >= 3 && (
            <g>
              <ellipse cx="270" cy="25" rx="18" ry="10" fill="rgba(239, 68, 68, 0.4)" />
              <line x1="270" y1="35" x2="270" y2="15" stroke="#f97316" strokeWidth="2" strokeDasharray="3 2" />
            </g>
          )}

          {/* Zona Kawasan Rawan Bencana (KRB) Merapi */}
          {/* KRB III (Merah - Paling Bahaya) */}
          <polygon points="210,185 270,40 330,185" fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
          {/* KRB II (Kuning/Oranye) */}
          <polygon points="130,185 270,40 410,185" fill="rgba(249, 115, 22, 0.15)" stroke="#f97316" strokeWidth="1" strokeDasharray="6 3" />
          {/* KRB I (Hijau/Kuning - Alur Lahar) */}
          <polygon points="60,185 270,40 480,185" fill="rgba(34, 197, 94, 0.08)" stroke="#22c55e" strokeWidth="1" />

          {/* Label Zona KRB */}
          <text x="270" y="115" textAnchor="middle" fill="#ef4444" fontSize="7.5" fontWeight="bold">KRB III</text>
          <text x="200" y="145" textAnchor="middle" fill="#f97316" fontSize="7" fontWeight="bold">KRB II</text>
          <text x="120" y="170" textAnchor="middle" fill="#22c55e" fontSize="7" fontWeight="bold">KRB I</text>

          {/* Box Status Panel Informasi */}
          <g transform="translate(340, 20)">
            <rect x="0" y="0" width="190" height="155" rx="6" fill="#18181b" stroke={current.color} strokeWidth="2" />
            <rect x="0" y="0" width="190" height="26" rx="6" fill={current.color} />
            <text x="95" y="17" textAnchor="middle" fill="#09090b" fontSize="8" fontWeight="bold" fontFamily="'Press Start 2P', monospace">
              {current.name}
            </text>

            <foreignObject x="10" y="34" width="170" height="85">
              <p className="text-[9px] text-slate-200 leading-relaxed font-pixel">
                {current.desc}
              </p>
            </foreignObject>

            {/* Radius Pill */}
            <rect x="10" y="125" width="170" height="20" rx="3" fill="#27272a" stroke={current.border} strokeWidth="1" />
            <text x="95" y="139" textAnchor="middle" fill={current.color} fontSize="6.5" fontWeight="bold">
              {current.radius}
            </text>
          </g>
        </svg>
      </div>

      {/* 4 Status Buttons Selector */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
        {levels.map((l) => (
          <button
            key={l.lvl}
            onClick={() => setActiveLevel(l.lvl as any)}
            className={`px-2 py-1.5 rounded-lg border-2 text-[9px] font-pixel-title cursor-pointer transition-all ${activeLevel === l.lvl
              ? 'text-slate-950 font-bold scale-102'
              : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'}`}
            style={{
              backgroundColor: activeLevel === l.lvl ? l.color : undefined,
              borderColor: activeLevel === l.lvl ? l.border : undefined,
            }}
          >
            LV.{l.lvl} {l.name.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: PROTOKOL PENYELAMATAN ERUPSI & LAHAR (AREA 5 TEMUAN 2)
// ═════════════════════════════════════════════════════════════════════════════
function VolcanoResponseIllustration() {
  const [activeTab, setActiveTab] = useState<'apd' | 'awanpanas' | 'lahar'>('apd');

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 font-pixel">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 border-b border-slate-800">
        <span className="text-[9px] font-pixel-title text-amber-400 font-bold flex items-center gap-1.5">
          <PixelIcon name="shield" size={13} />
          MITIGASI ERUPSI: ALAT PELINDUNG DIRI &amp; BAHAYA SEGUNDER
        </span>
        <span className="text-[9px] text-slate-400 font-pixel">
          STANDAR KESELAMATAN VULKANIK
        </span>
      </div>

      {/* SVG Canvas Content based on Tab */}
      <div className="w-full flex-1 flex items-center justify-center p-2">
        <svg viewBox="0 0 540 210" className="w-full h-full object-contain" shapeRendering="crispEdges">
          <rect x="0" y="0" width="540" height="210" fill="#0c0a09" />

          {activeTab === 'apd' && (
            <g>
              {/* Header Box APD */}
              <rect x="20" y="15" width="500" height="26" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="270" y="32" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">
                ALAT PELINDUNG DIRI (APD) WAJIB SAAT HUJAN ABU VULKANIK
              </text>

              {/* Item 1: Masker Partikulat */}
              <g transform="translate(40, 55)">
                <rect x="0" y="0" width="140" height="135" rx="6" fill="#18181b" stroke="#ef4444" strokeWidth="2" />
                <rect x="0" y="0" width="140" height="22" fill="#ef4444" rx="6" />
                <text x="70" y="15" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">1. MASKER N95 / KAIN</text>
                {/* Visual Masker */}
                <ellipse cx="70" cy="55" rx="30" ry="18" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                <line x1="40" y1="55" x2="20" y2="48" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="100" y1="55" x2="120" y2="48" stroke="#cbd5e1" strokeWidth="2" />
                <foreignObject x="8" y="82" width="124" height="50">
                  <p className="text-[8px] text-slate-300 leading-tight">
                    Mencegah partikel abu silika tajam masuk ke paru-paru yang dapat memicu penyakit infeksi pernapasan akut (ISPA).
                  </p>
                </foreignObject>
              </g>

              {/* Item 2: Kacamata Goggle */}
              <g transform="translate(200, 55)">
                <rect x="0" y="0" width="140" height="135" rx="6" fill="#18181b" stroke="#f59e0b" strokeWidth="2" />
                <rect x="0" y="0" width="140" height="22" fill="#f59e0b" rx="6" />
                <text x="70" y="15" textAnchor="middle" fill="#000000" fontSize="7" fontWeight="bold">2. KACAMATA TUTUP</text>
                {/* Visual Goggle */}
                <rect x="35" y="45" width="28" height="20" rx="4" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
                <rect x="77" y="45" width="28" height="20" rx="4" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
                <line x1="63" y1="55" x2="77" y2="55" stroke="#0284c7" strokeWidth="3" />
                <foreignObject x="8" y="82" width="124" height="50">
                  <p className="text-[8px] text-slate-300 leading-tight">
                    Hindari memakai lensa kontak! Abu vulkanik adalah serpihan kaca silika yang dapat merobek kornea mata.
                  </p>
                </foreignObject>
              </g>

              {/* Item 3: Pakaian Panjang Tertutup */}
              <g transform="translate(360, 55)">
                <rect x="0" y="0" width="140" height="135" rx="6" fill="#18181b" stroke="#10b981" strokeWidth="2" />
                <rect x="0" y="0" width="140" height="22" fill="#10b981" rx="6" />
                <text x="70" y="15" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">3. BAJU PANJANG</text>
                {/* Visual Jaket */}
                <rect x="45" y="42" width="50" height="30" rx="3" fill="#047857" />
                <line x1="70" y1="42" x2="70" y2="72" stroke="#6ee7b7" strokeWidth="2" />
                <foreignObject x="8" y="82" width="124" height="50">
                  <p className="text-[8px] text-slate-300 leading-tight">
                    Gunakan baju lengan panjang, celana panjang, topi, dan sepatu tertutup untuk melindungi kulit dari iritasi abu panas.
                  </p>
                </foreignObject>
              </g>
            </g>
          )}

          {activeTab === 'awanpanas' && (
            <g>
              <rect x="20" y="15" width="500" height="26" rx="4" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" />
              <text x="270" y="32" textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="bold">
                BAHAYA PRIMER: AWAN PANAS GUGURAN (WEDHUS GEMBEL)
              </text>
              {/* Ilustrasi Merapi Meluncurkan Awan Panas */}
              <polygon points="40,190 200,60 360,190" fill="#1c0c08" stroke="#7f1d1d" strokeWidth="2" />
              <ellipse cx="200" cy="55" rx="15" ry="8" fill="#ef4444" />
              {/* Gulungan Awan Panas Meluncur ke Lembah */}
              <circle cx="230" cy="80" r="16" fill="#78716c" opacity="0.8" />
              <circle cx="260" cy="110" r="24" fill="#a8a29e" opacity="0.85" />
              <circle cx="300" cy="145" r="34" fill="#57534e" opacity="0.9" />
              {/* Callout Box */}
              <g transform="translate(350, 60)">
                <rect x="0" y="0" width="170" height="130" rx="5" fill="#1c1917" stroke="#ea580c" strokeWidth="2" />
                <text x="10" y="20" fill="#f97316" fontSize="7.5" fontWeight="bold">KARAKTERISTIK:</text>
                <text x="10" y="36" fill="#fef08a" fontSize="7">• Suhu: 300°C - 800°C</text>
                <text x="10" y="52" fill="#fef08a" fontSize="7">• Kecepatan: &gt; 100 km/jam</text>
                <text x="10" y="68" fill="#fef08a" fontSize="7">• Gas beracun &amp; batu pijar</text>
                <text x="10" y="90" fill="#f87171" fontSize="7" fontWeight="bold">TINDAKAN MITIGASI:</text>
                <text x="10" y="106" fill="#cbd5e1" fontSize="6.5">Tidak bisa ditunggu! Evakuasi</text>
                <text x="10" y="118" fill="#cbd5e1" fontSize="6.5">sebelum erupsi terjadi!</text>
              </g>
            </g>
          )}

          {activeTab === 'lahar' && (
            <g>
              <rect x="20" y="15" width="500" height="26" rx="4" fill="#172554" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="270" y="32" textAnchor="middle" fill="#93c5fd" fontSize="8" fontWeight="bold">
                BAHAYA SEKUNDER: BANJIR LAHAR HUJAN (LAHAR DINGIN)
              </text>
              {/* Alur Sungai Lembah Lahar */}
              <path d="M 40,60 Q 180,110 270,140 T 500,195" fill="none" stroke="#64748b" strokeWidth="40" />
              <path d="M 40,60 Q 180,110 270,140 T 500,195" fill="none" stroke="#475569" strokeWidth="25" />
              {/* Batu-Batu Besar Terbawa Arus */}
              <circle cx="120" cy="85" r="9" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="230" cy="125" r="12" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="380" cy="165" r="15" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
              {/* Callout Box */}
              <g transform="translate(30, 115)">
                <rect x="0" y="0" width="220" height="75" rx="5" fill="#0f172a" stroke="#60a5fa" strokeWidth="1.5" />
                <text x="10" y="18" fill="#60a5fa" fontSize="7.5" fontWeight="bold">WASPADA DI LEMBAH SUNGAI:</text>
                <p className="text-[7.5px] text-slate-300">
                  Lahar hujan mengalir menerjang alur sungai (Kali Opak, Boyong, Gendol, Krasak). Jauhi jembatan dan tebing sungai saat hujan deras di puncak!
                </p>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Tabs Switcher */}
      <div className="w-full grid grid-cols-3 gap-2 pt-1">
        <button
          onClick={() => setActiveTab('apd')}
          className={`px-3 py-1.5 rounded-lg border-2 text-[9px] font-pixel-title cursor-pointer transition-all ${activeTab === 'apd'
            ? 'bg-sky-500 text-slate-950 border-sky-300 font-bold'
            : 'bg-slate-800 text-sky-300 border-slate-700 hover:border-sky-500'}`}
        >
          1. APD MASKER &amp; GOGGLE
        </button>
        <button
          onClick={() => setActiveTab('awanpanas')}
          className={`px-3 py-1.5 rounded-lg border-2 text-[9px] font-pixel-title cursor-pointer transition-all ${activeTab === 'awanpanas'
            ? 'bg-rose-500 text-slate-950 border-rose-300 font-bold'
            : 'bg-slate-800 text-rose-300 border-slate-700 hover:border-rose-500'}`}
        >
          2. BAHAYA AWAN PANAS
        </button>
        <button
          onClick={() => setActiveTab('lahar')}
          className={`px-3 py-1.5 rounded-lg border-2 text-[9px] font-pixel-title cursor-pointer transition-all ${activeTab === 'lahar'
            ? 'bg-blue-500 text-slate-950 border-blue-300 font-bold'
            : 'bg-slate-800 text-blue-300 border-slate-700 hover:border-blue-500'}`}
        >
          3. ANCAMAN LAHAR HUJAN
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: PROSEDUR KESELAMATAN & MEDIS PASCABENCANA (AREA 3 MODUL 1)
// Diselaraskan 100% dengan Buku Saku BNPB: Waspada Susulan, Utilitas, P3K, & Tandu
// ═════════════════════════════════════════════════════════════════════════════
function EarthquakePostSafetyIllustration() {
  const [activeTab, setActiveTab] = useState<'susulan' | 'utilitas' | 'p3k' | 'tandu'>('susulan');

  const tabDetails = {
    susulan: {
      title: 'WASPADA GEMPA SUSULAN (AFTERSHOCK)',
      badge: 'BAHAYA LANJUTAN',
      color: '#f97316',
      desc: 'Gempa susulan sering terjadi beberapa menit hingga beberapa hari setelah gempa utama. Gedung yang sudah retak sangat rapuh dan dapat roboh tiba-tiba. Tetaplah berada di ruang terbuka dan jangan pernah kembali ke dalam gedung sebelum ada izin tim ahli!',
    },
    utilitas: {
      title: 'PEMUTUSAN SAKELAR LISTRIK & GAS',
      badge: 'PENCEGAHAN KEBAKARAN',
      color: '#eab308',
      desc: 'Guncangan gempa sering merusak kabel instalasi dan mematahkan sambungan pipa gas. Segera matikan MCB utama listrik dan tutup rapat katup tabung gas/kompor untuk mencegah terjadinya kebakaran sekunder pascabencana.',
    },
    p3k: {
      title: 'PERTOLONGAN PERTAMA P3K & LUKA RINGAN',
      badge: 'PENANGANAN MEDIS',
      color: '#ef4444',
      desc: 'Lakukan pembersihan luka lecet dan gores menggunakan cairan antiseptik steril, lalu balut dengan kasa bersih. Berikan air minum kepada korban yang syok ringan dan pastikan kotak P3K tersedia di posko darurat.',
    },
    tandu: {
      title: 'PROSEDUR TANDU & LARANGAN MEMINDAHKAN KORBAN',
      badge: 'STANDAR MEDIS KRUSIAL',
      color: '#3b82f6',
      desc: 'JANGAN PERNAH memindahkan atau menggeser korban yang dicurigai mengalami cedera tulang leher, tulang belakang, atau patah tulang berat sendirian tanpa tandu darurat dan pendampingan tim medis. Salah mengangkat dapat menyebabkan kelumpuhan permanen!',
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 font-pixel">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 border-b border-slate-800">
        <span className="text-[9px] font-pixel-title text-amber-400 font-bold flex items-center gap-1.5">
          <PixelIcon name="shield" size={13} />
          SOP KESELAMATAN &amp; MEDIS PASCABENCANA
        </span>
        <span className="text-[9px] text-slate-400 font-pixel">
          STANDAR BNPB &amp; PMI
        </span>
      </div>

      {/* SVG Canvas Area */}
      <div className="w-full flex-1 flex items-center justify-center p-2">
        <svg viewBox="0 0 540 220" className="w-full h-full object-contain" shapeRendering="crispEdges">
          {/* Background Room/Area */}
          <rect x="0" y="0" width="540" height="220" fill="#0b0f19" />
          <rect x="0" y="0" width="540" height="170" fill="#0f172a" />
          <line x1="0" y1="170" x2="540" y2="170" stroke="#1e293b" strokeWidth="2" />
          <rect x="0" y="170" width="540" height="50" fill="#1e293b" />

          {/* 1. VISUAL GEMPA SUSULAN (AFTERSHOCK) */}
          {activeTab === 'susulan' && (
            <g transform="translate(30, 20)">
              {/* Gedung Retak Berbahaya */}
              <rect x="20" y="10" width="140" height="135" fill="#334155" stroke="#475569" strokeWidth="2" />
              <rect x="35" y="25" width="25" height="30" fill="#64748b" />
              <rect x="75" y="25" width="25" height="30" fill="#64748b" />
              <rect x="115" y="25" width="25" height="30" fill="#64748b" />
              <rect x="35" y="75" width="25" height="30" fill="#64748b" />
              <rect x="75" y="75" width="25" height="30" fill="#64748b" />
              <rect x="115" y="75" width="25" height="30" fill="#64748b" />

              {/* Garis Retakan Merah Bahaya */}
              <path d="M 65 10 L 78 45 L 60 85 L 85 125 L 80 145" stroke="#ef4444" strokeWidth="3" fill="none" />
              <path d="M 120 40 L 105 75 L 125 105" stroke="#ef4444" strokeWidth="2" fill="none" />

              {/* Reruntuhan jatuh di bawah */}
              <rect x="50" y="148" width="12" height="8" fill="#475569" />
              <rect x="90" y="152" width="10" height="6" fill="#64748b" />

              {/* Pita Kuning Peringatan DILARANG MENDEKAT */}
              <rect x="10" y="125" width="160" height="12" fill="#eab308" />
              <line x1="10" y1="131" x2="170" y2="131" stroke="#000000" strokeWidth="2" strokeDasharray="8 6" />

              {/* Panah Evakuasi Menjauh ke Lapangan */}
              <path d="M 185 85 L 215 85 L 215 75 L 235 95 L 215 115 L 215 105 L 185 105 Z" fill="#22c55e" />
              <circle cx="210" cy="50" r="16" fill="#ef4444" opacity="0.2" />
              <text x="210" y="55" fill="#ef4444" fontSize="14" fontWeight="bold" textAnchor="middle">!</text>
            </g>
          )}

          {/* 2. VISUAL PEMUTUSAN LISTRIK & GAS */}
          {activeTab === 'utilitas' && (
            <g transform="translate(30, 20)">
              {/* Panel Box Listrik MCB */}
              <rect x="20" y="15" width="70" height="110" rx="4" fill="#334155" stroke="#64748b" strokeWidth="2" />
              <rect x="28" y="25" width="54" height="45" fill="#1e293b" />
              {/* Sakelar MCB (Posisi OFF ke bawah) */}
              <rect x="42" y="32" width="10" height="30" fill="#475569" />
              <rect x="40" y="44" width="14" height="15" rx="2" fill="#ef4444" />
              <rect x="58" y="32" width="10" height="30" fill="#475569" />
              <rect x="56" y="44" width="14" height="15" rx="2" fill="#ef4444" />
              <text x="55" y="86" fill="#facc15" fontSize="7" fontWeight="bold" textAnchor="middle">MCB: OFF</text>

              {/* Tabung Gas LPG dengan Katup Tertutup */}
              <rect x="110" y="45" width="55" height="80" rx="8" fill="#15803d" stroke="#16a34a" strokeWidth="2" />
              <rect x="125" y="28" width="25" height="17" rx="3" fill="#334155" />
              <circle cx="137" cy="22" r="7" fill="#dc2626" />
              <text x="137" y="95" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">GAS</text>

              {/* Tabung APAR Pemadam Api */}
              <rect x="185" y="35" width="30" height="90" rx="5" fill="#dc2626" stroke="#b91c1c" strokeWidth="2" />
              <rect x="195" y="20" width="10" height="15" fill="#1e293b" />
              <rect x="188" y="16" width="24" height="6" fill="#475569" />
              <text x="200" y="85" fill="#ffffff" fontSize="6.5" fontWeight="bold" textAnchor="middle">APAR</text>
            </g>
          )}

          {/* 3. VISUAL PERTOLONGAN PERTAMA P3K */}
          {activeTab === 'p3k' && (
            <g transform="translate(30, 20)">
              {/* Kotak P3K Terbuka */}
              <rect x="20" y="30" width="100" height="95" rx="6" fill="#dc2626" stroke="#b91c1c" strokeWidth="2" />
              <rect x="25" y="35" width="90" height="85" rx="4" fill="#ef4444" />
              {/* Palang Putih P3K */}
              <rect x="62" y="55" width="16" height="45" fill="#ffffff" />
              <rect x="47" y="70" width="46" height="16" fill="#ffffff" />

              {/* Botol Antiseptik & Kasa */}
              <rect x="135" y="40" width="35" height="75" rx="4" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
              <rect x="145" y="25" width="15" height="15" fill="#e0f2fe" />
              <text x="152" y="80" fill="#ffffff" fontSize="6.5" fontWeight="bold" textAnchor="middle">ANTISEPTIK</text>

              {/* Roll Perban Kasa */}
              <circle cx="205" cy="85" r="26" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="205" cy="85" r="10" fill="#94a3b8" />
              <rect x="195" y="105" width="30" height="12" fill="#f8fafc" stroke="#cbd5e1" />
            </g>
          )}

          {/* 4. VISUAL TANDU MEDIS KESELAMATAN */}
          {activeTab === 'tandu' && (
            <g transform="translate(30, 20)">
              {/* Tandu Medis Lipat (Rescue Stretcher) */}
              <rect x="20" y="75" width="195" height="24" rx="4" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
              <rect x="15" y="82" width="205" height="10" fill="#475569" />
              {/* Kaki Tandu */}
              <rect x="35" y="99" width="6" height="30" fill="#334155" />
              <rect x="190" y="99" width="6" height="30" fill="#334155" />

              {/* Bantal Leher Penopang (Cervical Collar / Head Immobilizer) */}
              <rect x="30" y="65" width="28" height="12" rx="3" fill="#ef4444" />
              {/* Sabuk Pengaman Tubuh (Safety Straps) */}
              <rect x="75" y="73" width="8" height="28" fill="#1e293b" />
              <rect x="135" y="73" width="8" height="28" fill="#1e293b" />

              {/* Tanda Peringatan: JANGAN ANGKAT TANPA TANDU */}
              <rect x="40" y="20" width="160" height="26" rx="4" fill="#ef4444" stroke="#dc2626" strokeWidth="1.5" />
              <text x="120" y="36" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">
                WAJIB TANDU &amp; TIM MEDIS!
              </text>
            </g>
          )}

          {/* Panel Deskripsi Kanan (Selaras untuk semua tab) */}
          <g transform="translate(285, 25)">
            <rect x="0" y="0" width="230" height="150" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <rect x="10" y="10" width="95" height="16" rx="3" fill={tabDetails[activeTab].color} />
            <text x="15" y="21" fill="#0f172a" fontSize="7" fontWeight="bold">
              {tabDetails[activeTab].badge}
            </text>

            <text x="10" y="42" fill="#f8fafc" fontSize="8.5" fontWeight="bold">
              {tabDetails[activeTab].title}
            </text>

            <foreignObject x="10" y="52" width="210" height="90">
              <p className="text-[9.5px] text-slate-300 leading-relaxed font-pixel select-none">
                {tabDetails[activeTab].desc}
              </p>
            </foreignObject>
          </g>
        </svg>
      </div>

      {/* Button Switcher Tabs */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
        <button
          onClick={() => setActiveTab('susulan')}
          className={`px-2 py-1.5 rounded-lg border-2 text-[8.5px] font-pixel-title cursor-pointer transition-all ${
            activeTab === 'susulan'
              ? 'bg-orange-500 text-slate-950 border-orange-300 font-bold'
              : 'bg-slate-800 text-orange-300 border-slate-700 hover:border-orange-500'
          }`}
        >
          1. GEMPA SUSULAN
        </button>
        <button
          onClick={() => setActiveTab('utilitas')}
          className={`px-2 py-1.5 rounded-lg border-2 text-[8.5px] font-pixel-title cursor-pointer transition-all ${
            activeTab === 'utilitas'
              ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
              : 'bg-slate-800 text-amber-300 border-slate-700 hover:border-amber-400'
          }`}
        >
          2. LISTRIK &amp; GAS
        </button>
        <button
          onClick={() => setActiveTab('p3k')}
          className={`px-2 py-1.5 rounded-lg border-2 text-[8.5px] font-pixel-title cursor-pointer transition-all ${
            activeTab === 'p3k'
              ? 'bg-rose-500 text-slate-950 border-rose-300 font-bold'
              : 'bg-slate-800 text-rose-300 border-slate-700 hover:border-rose-500'
          }`}
        >
          3. PERTOLONGAN P3K
        </button>
        <button
          onClick={() => setActiveTab('tandu')}
          className={`px-2 py-1.5 rounded-lg border-2 text-[8.5px] font-pixel-title cursor-pointer transition-all ${
            activeTab === 'tandu'
              ? 'bg-sky-500 text-slate-950 border-sky-300 font-bold'
              : 'bg-slate-800 text-sky-300 border-slate-700 hover:border-sky-500'
          }`}
        >
          4. PROSEDUR TANDU
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: MANAJEMEN TITIK KUMPUL & KOMUNIKASI RESMI (AREA 3 MODUL 2)
// Diselaraskan 100% dengan Buku Saku BNPB: Lapangan, Presensi, BMKG & Jalur Evakuasi
// ═════════════════════════════════════════════════════════════════════════════
function EarthquakePostCoordinationIllustration() {
  const [activeTab, setActiveTab] = useState<'lapangan' | 'presensi' | 'bmkg' | 'evakuasi'>('lapangan');

  const tabDetails = {
    lapangan: {
      title: 'ZONA LAPANGAN TERBUKA (TITIK KUMPUL)',
      badge: 'AREA AMAN',
      color: '#22c55e',
      desc: 'Lapangan terbuka adalah lokasi paling ideal sebagai titik kumpul pasca-evakuasi gempa bumi. Area ini bebas dari ancaman tertimpa reruntuhan genteng, kaca jendela pecah, pohon tumbang, serta kabel dan tiang listrik yang putus.',
    },
    presensi: {
      title: 'PRESENSI & PENDATAAN WARGA SEKOLAH',
      badge: 'MANAJEMEN KELAS',
      color: '#3b82f6',
      desc: 'Setibanya di titik kumpul, ketua regu PMR/OSIS dan wali kelas segera melakukan absensi menyeluruh. Jika ada rekan yang belum tiba atau tertinggal di dalam gedung, segera laporkan ke tim SAR/BPBD tanpa mencoba masuk kembali sendiri!',
    },
    bmkg: {
      title: 'INFORMASI RESMI BMKG & KANAL BPBD',
      badge: 'SUMBER TERPERCAYA',
      color: '#f59e0b',
      desc: 'Hanya dengarkan siaran resmi dari BMKG (Badan Meteorologi, Klimatologi, dan Geofisika) serta BPBD setempat melalui radio siaran darurat atau aplikasi resmi. Jangan menyebarkan informasi kabar burung atau pesan berantai hoaks yang menimbulkan kepanikan!',
    },
    evakuasi: {
      title: 'JALUR EVAKUASI LANJUTAN & AMBULANS',
      badge: 'LOGISTIK TRANSIT',
      color: '#ec4899',
      desc: 'Tetap berada di lapangan hingga pihak berwenang membuka jalur evakuasi akhir. Pasien yang terluka parah akan dirujuk menggunakan ambulans posko, sedangkan siswa yang sehat menunggu konfirmasi penjemputan aman oleh orang tua.',
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 font-pixel">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 border-b border-slate-800">
        <span className="text-[9px] font-pixel-title text-emerald-400 font-bold flex items-center gap-1.5">
          <PixelIcon name="shield" size={13} />
          MANAJEMEN TITIK KUMPUL &amp; INFORMASI RESMI
        </span>
        <span className="text-[9px] text-slate-400 font-pixel">
          STANDAR BNPB &amp; BMKG
        </span>
      </div>

      {/* SVG Canvas Area */}
      <div className="w-full flex-1 flex items-center justify-center p-2">
        <svg viewBox="0 0 540 220" className="w-full h-full object-contain" shapeRendering="crispEdges">
          {/* Background */}
          <rect x="0" y="0" width="540" height="220" fill="#0b0f19" />
          <rect x="0" y="0" width="540" height="170" fill="#0f172a" />
          <line x1="0" y1="170" x2="540" y2="170" stroke="#1e293b" strokeWidth="2" />
          <rect x="0" y="170" width="540" height="50" fill="#1e293b" />

          {/* 1. VISUAL LAPANGAN TERBUKA (ASSEMBLY POINT) */}
          {activeTab === 'lapangan' && (
            <g transform="translate(30, 20)">
              {/* Lapangan Hijau & Paving */}
              <rect x="15" y="70" width="220" height="85" rx="6" fill="#15803d" stroke="#16a34a" strokeWidth="2" />
              <rect x="25" y="80" width="200" height="65" fill="#166534" />

              {/* Rambu Hijau Titik Kumpul Resmi */}
              <rect x="110" y="15" width="40" height="40" rx="3" fill="#15803d" stroke="#ffffff" strokeWidth="2" />
              <rect x="127" y="55" width="6" height="35" fill="#64748b" />
              {/* Ikon 4 Panah ke Tengah */}
              <path d="M 116 21 L 123 27 M 144 21 L 137 27 M 116 49 L 123 43 M 144 49 L 137 43" stroke="#ffffff" strokeWidth="2" />
              <circle cx="130" cy="35" r="4" fill="#ffffff" />

              {/* Rerumputan & Siluet Murid Berkumpul Tertib di Lapangan */}
              <circle cx="65" cy="100" r="4" fill="#86efac" />
              <rect x="62" y="104" width="6" height="12" fill="#86efac" rx="1" />

              <circle cx="95" cy="98" r="4.5" fill="#86efac" />
              <rect x="91" y="103" width="8" height="14" fill="#86efac" rx="1" />

              <circle cx="125" cy="102" r="4" fill="#86efac" />
              <rect x="122" y="106" width="6" height="11" fill="#86efac" rx="1" />

              <circle cx="160" cy="99" r="4.5" fill="#86efac" />
              <rect x="156" y="104" width="8" height="13" fill="#86efac" rx="1" />
            </g>
          )}

          {/* 2. VISUAL PRESENSI & MEGAPHONE */}
          {activeTab === 'presensi' && (
            <g transform="translate(30, 20)">
              {/* Clipboard Papan Presensi */}
              <rect x="20" y="20" width="95" height="130" rx="6" fill="#78350f" stroke="#451a03" strokeWidth="2" />
              <rect x="52" y="12" width="30" height="15" rx="3" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />
              <rect x="26" y="30" width="83" height="112" rx="2" fill="#f8fafc" />

              {/* Baris Nama Siswa & Centang Hijau */}
              <line x1="34" y1="45" x2="80" y2="45" stroke="#475569" strokeWidth="2" />
              <path d="M 90 44 L 94 48 L 102 38" stroke="#16a34a" strokeWidth="2" fill="none" />

              <line x1="34" y1="65" x2="80" y2="65" stroke="#475569" strokeWidth="2" />
              <path d="M 90 64 L 94 68 L 102 58" stroke="#16a34a" strokeWidth="2" fill="none" />

              <line x1="34" y1="85" x2="80" y2="85" stroke="#475569" strokeWidth="2" />
              <path d="M 90 84 L 94 88 L 102 78" stroke="#16a34a" strokeWidth="2" fill="none" />

              <line x1="34" y1="105" x2="80" y2="105" stroke="#475569" strokeWidth="2" />
              <path d="M 90 104 L 94 108 L 102 98" stroke="#16a34a" strokeWidth="2" fill="none" />

              {/* Megaphone TOA Komando */}
              <g transform="translate(130, 60)">
                <path d="M 20 20 L 70 5 L 70 55 L 20 40 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
                <rect x="5" y="24" width="16" height="12" rx="2" fill="#dc2626" />
                <path d="M 10 36 L 5 56 L 15 56 L 18 36 Z" fill="#334155" />
                <ellipse cx="70" cy="30" rx="6" ry="25" fill="#dc2626" />
                <text x="45" y="33" fill="#dc2626" fontSize="7" fontWeight="bold">TOA</text>
              </g>
            </g>
          )}

          {/* 3. VISUAL RADIO & MONITOR RESMI BMKG */}
          {activeTab === 'bmkg' && (
            <g transform="translate(30, 20)">
              {/* Monitor Seismik Digital BMKG */}
              <rect x="20" y="25" width="125" height="85" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <rect x="26" y="31" width="113" height="73" rx="3" fill="#0f172a" />
              {/* Gelombang Seismik Kuning */}
              <path d="M 32 68 L 55 68 L 60 45 L 66 90 L 72 50 L 78 78 L 84 65 L 130 68" stroke="#facc15" strokeWidth="2" fill="none" />
              <text x="32" y="42" fill="#38bdf8" fontSize="7" fontWeight="bold">BMKG: RESMI</text>
              <text x="32" y="98" fill="#4ade80" fontSize="6.5">STATUS: AMAN</text>

              {/* Radio Siaran Darurat Portabel */}
              <rect x="160" y="45" width="75" height="70" rx="5" fill="#334155" stroke="#475569" strokeWidth="2" />
              {/* Antena Radio */}
              <line x1="170" y1="45" x2="160" y2="15" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="160" cy="15" r="3" fill="#ef4444" />
              {/* Speaker Grill */}
              <circle cx="185" cy="80" r="18" fill="#1e293b" />
              <line x1="172" y1="80" x2="198" y2="80" stroke="#475569" strokeWidth="1.5" />
              <line x1="175" y1="74" x2="195" y2="74" stroke="#475569" strokeWidth="1.5" />
              <line x1="175" y1="86" x2="195" y2="86" stroke="#475569" strokeWidth="1.5" />
              <rect x="210" y="65" width="18" height="10" fill="#facc15" />
            </g>
          )}

          {/* 4. VISUAL AMBULANS & JALUR EVAKUASI LANJUTAN */}
          {activeTab === 'evakuasi' && (
            <g transform="translate(30, 20)">
              {/* Mobil Ambulans Medis */}
              <rect x="20" y="55" width="116" height="65" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
              <rect x="136" y="75" width="28" height="45" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Kaca Depan Kabin & Kaca Pasien Samping (Presisi Tanpa Menggantung di Udara) */}
              <rect x="100" y="60" width="30" height="18" rx="2" fill="#38bdf8" />
              <rect x="42" y="60" width="46" height="18" rx="2" fill="#38bdf8" />

              {/* Garis Oranye & Merah Tanggap Bencana */}
              <rect x="20" y="90" width="144" height="8" fill="#f97316" />
              <rect x="20" y="98" width="144" height="4" fill="#ef4444" />

              {/* Simbol Palang Biru Ambulans */}
              <rect x="62" y="68" width="6" height="18" fill="#0284c7" />
              <rect x="56" y="74" width="18" height="6" fill="#0284c7" />

              {/* Roda Ambulans */}
              <circle cx="50" cy="120" r="14" fill="#0f172a" />
              <circle cx="50" cy="120" r="5" fill="#94a3b8" />
              <circle cx="128" cy="120" r="14" fill="#0f172a" />
              <circle cx="128" cy="120" r="5" fill="#94a3b8" />

              {/* Lampu Sirine Strobo */}
              <rect x="88" y="47" width="14" height="8" rx="1" fill="#ef4444" />
              <rect x="102" y="47" width="14" height="8" rx="1" fill="#38bdf8" />

              {/* Panah Rambu Jalur Evakuasi Hijau */}
              <rect x="180" y="60" width="55" height="45" rx="4" fill="#15803d" stroke="#22c55e" strokeWidth="2" />
              <path d="M 190 82 L 210 82 L 210 75 L 225 82 L 210 90 L 210 82 Z" fill="#ffffff" />
              <text x="207" y="73" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">POSKO</text>
            </g>
          )}

          {/* Panel Deskripsi Kanan (Selaras untuk semua tab) */}
          <g transform="translate(285, 25)">
            <rect x="0" y="0" width="230" height="150" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <rect x="10" y="10" width="95" height="16" rx="3" fill={tabDetails[activeTab].color} />
            <text x="15" y="21" fill="#0f172a" fontSize="7" fontWeight="bold">
              {tabDetails[activeTab].badge}
            </text>

            <text x="10" y="42" fill="#f8fafc" fontSize="8.5" fontWeight="bold">
              {tabDetails[activeTab].title}
            </text>

            <foreignObject x="10" y="52" width="210" height="90">
              <p className="text-[9.5px] text-slate-300 leading-relaxed font-pixel select-none">
                {tabDetails[activeTab].desc}
              </p>
            </foreignObject>
          </g>
        </svg>
      </div>

      {/* Button Switcher Tabs */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
        <button
          onClick={() => setActiveTab('lapangan')}
          className={`px-2 py-1.5 rounded-lg border-2 text-[8.5px] font-pixel-title cursor-pointer transition-all ${
            activeTab === 'lapangan'
              ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-bold'
              : 'bg-slate-800 text-emerald-300 border-slate-700 hover:border-emerald-500'
          }`}
        >
          1. ZONA LAPANGAN
        </button>
        <button
          onClick={() => setActiveTab('presensi')}
          className={`px-2 py-1.5 rounded-lg border-2 text-[8.5px] font-pixel-title cursor-pointer transition-all ${
            activeTab === 'presensi'
              ? 'bg-sky-500 text-slate-950 border-sky-300 font-bold'
              : 'bg-slate-800 text-sky-300 border-slate-700 hover:border-sky-500'
          }`}
        >
          2. PRESENSI KELAS
        </button>
        <button
          onClick={() => setActiveTab('bmkg')}
          className={`px-2 py-1.5 rounded-lg border-2 text-[8.5px] font-pixel-title cursor-pointer transition-all ${
            activeTab === 'bmkg'
              ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
              : 'bg-slate-800 text-amber-300 border-slate-700 hover:border-amber-400'
          }`}
        >
          3. INFO BMKG RESMI
        </button>
        <button
          onClick={() => setActiveTab('evakuasi')}
          className={`px-2 py-1.5 rounded-lg border-2 text-[8.5px] font-pixel-title cursor-pointer transition-all ${
            activeTab === 'evakuasi'
              ? 'bg-pink-500 text-slate-950 border-pink-300 font-bold'
              : 'bg-slate-800 text-pink-300 border-slate-700 hover:border-pink-500'
          }`}
        >
          4. AMBULANS TRANSIT
        </button>
      </div>
    </div>
  );
}
