/**
 * Lempeng, Batas, dan Bentuk Lahan — ilustrasi untuk materi Discovery Level 2.
 *
 * Berkas ini dipecah dari DiscoveryModal.tsx. Semua komponen di sini mandiri:
 * tidak menyentuh state DiscoveryModal, hanya menerima props sederhana atau
 * tidak menerima props sama sekali.
 */

import { useState, useEffect } from 'react';
import { retroAudio } from '../../../utils/retroAudio';
import PixelIcon from '../../../components/PixelIcon';

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: PANGEA SUPERCONTINENT MAP (PERSIS DENGAN GAMBAR 4 & GAMBAR 5)
// ═════════════════════════════════════════════════════════════════════════════
export function PangeaIllustration() {
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null);

  const colors = {
    ocean: '#93c5fd', // Pale Azure Ocean (Screenshot 3)
    land: '#8ec591', // Uniform Sage Green (Screenshot 3)
    landHover: '#a7f3d0', // Glowing Luminous Mint on hover
    stroke: '#1e293b', // Slate Charcoal Boundary Lines (Screenshot 3)
    strokeHover: '#047857',
    suture: '#264a38', // Faint internal terrane sutures
  };

  const plateDetails: Record<string, { title: string; desc: string }> = {
    eurasia: {
      title: 'EURASIA (Eropa & Asia)',
      desc: 'Massa daratan raksasa utara Pangea. Teluk Samudra Tethys menjorok ke sisi selatannya, dengan semenanjung panjang melengkung ke timur membungkus teluk purba.',
    },
    northAmerica: {
      title: 'AMERIKA UTARA',
      desc: 'Dahulu menempel erat dengan Eurasia di timur laut (Greenland & Skotlandia) dan berhadapan langsung dengan pesisir barat laut Afrika.',
    },
    southAmerica: {
      title: 'AMERIKA SELATAN',
      desc: 'Bukti puzzle paling ikonik Wegener: Tonjolan timur Brasil mengunci secara presisi ke dalam lekukan Teluk Guinea di pesisir barat Afrika!',
    },
    africa: {
      title: 'AFRIKA',
      desc: 'Pusat poros utama superkontinen Pangea! Bersentuhan langsung dengan Amerika Utara, Amerika Selatan, Eurasia, India, dan Antartika.',
    },
    india: {
      title: 'INDIA',
      desc: 'Kepingan benua yang terjepit di antara Afrika dan Antartika sebelum bergerak cepat melintasi Samudra Hindia menabrak Eurasia membentuk Pegunungan Himalaya.',
    },
    antarctica: {
      title: 'ANTARTIKA',
      desc: 'Massa daratan di kutub selatan Pangea. Dahulu beriklim tropis-hangat (terbukti dari fosil pakis purba Glossopteris) dan bersatu rapat dengan Australia.',
    },
    australia: {
      title: 'AUSTRALIA',
      desc: 'Melekat di pesisir timur benua Antartika sebelum retakan divergen memisahkannya ratusan juta tahun kemudian menuju posisinya saat ini.',
    },
  };

  const activePlateInfo = selectedPlate ? plateDetails[selectedPlate] : null;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between bg-[#93c5fd] select-none p-2 sm:p-3 overflow-hidden rounded-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Top Header Mode Toggle */}
      <div className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-900/95 border border-amber-500/70 rounded-xl z-10 shadow-lg">
        <span className="text-amber-300 font-bold text-[15px] sm:text-base flex items-center gap-2 tracking-wide">
          <PixelIcon name="globe" size={18} className="text-amber-400" />
          <span>SUPERKONTINEN PANGEA (~250 JUTA TAHUN LALU)</span>
        </span>
        <span className="hidden sm:inline-block text-[14.5px] text-slate-300 font-semibold bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
          Teori Alfred Wegener (1912)
        </span>
      </div>

      {/* Main SVG Pangea Map matching Screenshot 3 */}
      <div className="w-full flex-1 relative flex items-center justify-center overflow-hidden my-1">
        <svg
          viewBox="30 20 540 600"
          className="w-full h-full object-contain drop-shadow-xl"
        >
          {/* Lautan Samudra Panthalassa */}
          <rect x="-50" y="-50" width="700" height="720" fill={colors.ocean} />

          {/* Garis Grid Samudra Halus */}
          <line x1="0" y1="300" x2="600" y2="300" stroke="#60a5fa" strokeWidth="1" opacity="0.45" />
          <line x1="280" y1="0" x2="280" y2="640" stroke="#60a5fa" strokeWidth="1" opacity="0.45" />
          <text x="560" y="295" fill="#1e3a8a" fontSize="10" fontStyle="italic" textAnchor="end" opacity="0.75" fontWeight="600">
            Khatulistiwa Purba
          </text>
          <text x="45" y="45" fill="#1e3a8a" fontSize="12" fontWeight="800" opacity="0.8" letterSpacing="1">
            SAMUDRA PANTHALASSA
          </text>

          {/* Teluk Tethys Label */}
          <g transform="translate(390, 290)">
            <text x="0" y="0" fill="#1e3a8a" fontSize="12" fontWeight="bold" opacity="0.85" fontStyle="italic">
              Teluk Tethys
            </text>
            <path d="M -15 6 Q 25 1, 65 6" fill="none" stroke="#2563eb" strokeWidth="1.8" opacity="0.7" />
          </g>

          {/* ── 1. EURASIA (Bagian Utara & Ekor Semenanjung Melengkung) ── */}
          <g
            onMouseEnter={() => setSelectedPlate('eurasia')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('eurasia')}
            className="cursor-pointer transition-all"
          >
            <path
              d="M 185 115 
                 C 195 85, 235 52, 295 44 
                 C 355 42, 415 62, 455 95 
                 C 485 125, 498 155, 488 190 
                 C 478 215, 505 208, 528 230 
                 C 538 244, 532 258, 518 258 
                 C 495 245, 475 235, 450 230 
                 C 415 232, 375 245, 335 245 
                 C 295 245, 270 240, 252 235 
                 C 240 225, 230 212, 222 195 
                 C 212 180, 198 160, 188 140 
                 C 182 128, 182 120, 185 115 Z"
              fill={selectedPlate === 'eurasia' ? colors.landHover : colors.land}
              stroke={selectedPlate === 'eurasia' ? colors.strokeHover : colors.stroke}
              strokeWidth={selectedPlate === 'eurasia' ? '3.5' : '2.4'}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Pulau Kecil / Fragmen di Ujung Semenanjung Eurasia (Persis Screenshot 3) */}
            <path
              d="M 536 270 C 546 260, 554 270, 548 285 C 542 295, 532 290, 536 270 Z"
              fill={selectedPlate === 'eurasia' ? colors.landHover : colors.land}
              stroke={selectedPlate === 'eurasia' ? colors.strokeHover : colors.stroke}
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            {/* Garis Sutur/Patahan Internal Eurasia (Persis Tekstur Screenshot 3) */}
            <path d="M 255 52 C 272 82, 290 120, 308 145" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />
            <path d="M 345 46 C 362 85, 370 135, 375 180" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />
            <path d="M 420 72 C 435 110, 438 160, 432 200" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />
            <path d="M 220 78 C 240 95, 245 115, 255 135" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />

            <text x="340" y="135" fill="#0f172a" fontSize="18" fontWeight="800" textAnchor="middle">
              Eurasia
            </text>
          </g>

          {/* ── 2. NORTH AMERICA (Kiri Atas Pangea) ── */}
          <g
            onMouseEnter={() => setSelectedPlate('northAmerica')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('northAmerica')}
            className="cursor-pointer transition-all"
          >
            <path
              d="M 185 115 
                 C 165 98, 138 105, 118 120 
                 C 92 142, 78 175, 82 215 
                 C 72 245, 78 285, 92 315 
                 C 108 335, 132 340, 158 340 
                 C 178 330, 192 310, 202 280 
                 C 212 250, 222 195, 202 162 
                 C 192 145, 185 125, 185 115 Z"
              fill={selectedPlate === 'northAmerica' ? colors.landHover : colors.land}
              stroke={selectedPlate === 'northAmerica' ? colors.strokeHover : colors.stroke}
              strokeWidth={selectedPlate === 'northAmerica' ? '3.5' : '2.4'}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Garis Sutur Internal Amerika Utara (Persis Screenshot 3) */}
            <path d="M 152 125 C 158 165, 162 210, 168 250" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />
            <path d="M 118 190 C 138 210, 158 230, 172 270" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />

            <text x="135" y="240" fill="#0f172a" fontSize="15" fontWeight="800" textAnchor="middle">
              North
            </text>
            <text x="135" y="260" fill="#0f172a" fontSize="15" fontWeight="800" textAnchor="middle">
              America
            </text>
          </g>

          {/* ── 3. SOUTH AMERICA (Kiri Bawah Pangea, Mengunci dengan Afrika) ── */}
          <g
            onMouseEnter={() => setSelectedPlate('southAmerica')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('southAmerica')}
            className="cursor-pointer transition-all"
          >
            <path
              d="M 158 340 
                 C 128 345, 102 360, 88 390 
                 C 78 430, 82 470, 98 510 
                 C 112 545, 132 570, 152 580 
                 C 168 580, 178 570, 182 555 
                 C 188 525, 192 490, 198 460 
                 C 212 440, 228 420, 232 395 
                 C 228 370, 208 355, 188 345 
                 C 172 340, 158 340, 158 340 Z"
              fill={selectedPlate === 'southAmerica' ? colors.landHover : colors.land}
              stroke={selectedPlate === 'southAmerica' ? colors.strokeHover : colors.stroke}
              strokeWidth={selectedPlate === 'southAmerica' ? '3.5' : '2.4'}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Garis Sutur Internal Amerika Selatan (Persis Screenshot 3) */}
            <path d="M 138 370 C 148 420, 152 480, 148 540" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />

            <text x="145" y="440" fill="#0f172a" fontSize="15" fontWeight="800" textAnchor="middle">
              South
            </text>
            <text x="145" y="460" fill="#0f172a" fontSize="15" fontWeight="800" textAnchor="middle">
              America
            </text>
          </g>

          {/* ── 4. AFRICA (Pusat Poros Tengah Pangea) ── */}
          <g
            onMouseEnter={() => setSelectedPlate('africa')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('africa')}
            className="cursor-pointer transition-all"
          >
            <path
              d="M 188 345 
                 C 198 320, 212 280, 222 245 
                 C 238 235, 258 235, 278 245 
                 C 298 255, 322 280, 342 320 
                 C 358 360, 368 400, 358 440 
                 C 348 460, 328 480, 308 500 
                 C 288 520, 262 535, 238 545 
                 C 222 545, 208 530, 198 495 
                 C 202 460, 218 435, 232 395 
                 C 228 370, 208 355, 188 345 Z"
              fill={selectedPlate === 'africa' ? colors.landHover : colors.land}
              stroke={selectedPlate === 'africa' ? colors.strokeHover : colors.stroke}
              strokeWidth={selectedPlate === 'africa' ? '3.5' : '2.4'}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Garis Sutur Internal Afrika (Persis Screenshot 3) */}
            <path d="M 252 240 C 262 300, 278 370, 288 440" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />
            <path d="M 288 320 C 308 360, 318 410, 322 460" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />

            <text x="275" y="400" fill="#0f172a" fontSize="17" fontWeight="800" textAnchor="middle">
              Africa
            </text>
          </g>

          {/* ── 5. INDIA (Kepingan Sudut di antara Afrika & Antartika) ── */}
          <g
            onMouseEnter={() => setSelectedPlate('india')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('india')}
            className="cursor-pointer transition-all"
          >
            <path
              d="M 358 440 
                 C 348 465, 332 485, 318 505 
                 C 332 520, 352 530, 372 525 
                 C 382 495, 378 465, 358 440 Z"
              fill={selectedPlate === 'india' ? colors.landHover : colors.land}
              stroke={selectedPlate === 'india' ? colors.strokeHover : colors.stroke}
              strokeWidth={selectedPlate === 'india' ? '3.5' : '2.4'}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <text x="352" y="490" fill="#0f172a" fontSize="12" fontWeight="800" textAnchor="middle">
              India
            </text>
          </g>

          {/* ── 6. ANTARCTICA (Kutub Selatan Pangea / Lengkungan Bawah) ── */}
          <g
            onMouseEnter={() => setSelectedPlate('antarctica')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('antarctica')}
            className="cursor-pointer transition-all"
          >
            <path
              d="M 182 555 
                 C 188 560, 202 560, 218 550 
                 C 238 545, 268 530, 292 520 
                 C 318 505, 342 515, 372 525 
                 C 392 525, 412 535, 428 550 
                 C 422 575, 392 595, 348 605 
                 C 298 605, 242 595, 202 580 
                 C 188 570, 182 560, 182 555 Z"
              fill={selectedPlate === 'antarctica' ? colors.landHover : colors.land}
              stroke={selectedPlate === 'antarctica' ? colors.strokeHover : colors.stroke}
              strokeWidth={selectedPlate === 'antarctica' ? '3.5' : '2.4'}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Garis Sutur Transantarktika (Persis Screenshot 3) */}
            <path d="M 258 560 C 288 570, 328 575, 368 565" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />

            <text x="295" y="575" fill="#0f172a" fontSize="16" fontWeight="800" textAnchor="middle">
              Antarctica
            </text>
          </g>

          {/* ── 7. AUSTRALIA (Tenggara Pangea Menempel di Antartika) ── */}
          <g
            onMouseEnter={() => setSelectedPlate('australia')}
            onMouseLeave={() => setSelectedPlate(null)}
            onClick={() => setSelectedPlate('australia')}
            className="cursor-pointer transition-all"
          >
            <path
              d="M 372 525 
                 C 392 525, 412 535, 428 550 
                 C 452 560, 478 545, 482 515 
                 C 472 480, 452 455, 422 445 
                 C 402 455, 382 485, 372 525 Z"
              fill={selectedPlate === 'australia' ? colors.landHover : colors.land}
              stroke={selectedPlate === 'australia' ? colors.strokeHover : colors.stroke}
              strokeWidth={selectedPlate === 'australia' ? '3.5' : '2.4'}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Garis Sutur Internal Australia (Persis Screenshot 3) */}
            <path d="M 422 450 C 438 485, 448 520, 452 550" fill="none" stroke={colors.suture} strokeWidth="1.4" opacity="0.6" />

            <g transform="translate(432, 508) rotate(-35)">
              <text x="0" y="0" fill="#0f172a" fontSize="14" fontWeight="800" textAnchor="middle">
                Australia
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Bottom Interactive Educational Banner */}
      <div className="w-full bg-[#0f172a] border-2 border-emerald-500/60 rounded-xl p-3 sm:p-3.5 text-slate-200 z-10 flex items-center justify-between gap-3 shadow-lg">
        {activePlateInfo ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 animate-fadeIn w-full">
            <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[13px] sm:text-[15px] border border-emerald-500/50 whitespace-nowrap shadow-sm">
              {activePlateInfo.title}
            </span>
            <span className="text-slate-100 font-medium text-[13px] sm:text-[15px] leading-relaxed">
              {activePlateInfo.desc}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 text-slate-200 font-semibold text-[13px] sm:text-[15px]">
            <PixelIcon name="bulb" size={18} className="text-amber-400 shrink-0" />
            <span className="text-amber-400 font-bold text-[13px] sm:text-[15px]">PETUNJUK:</span>
            <span>Arahkan kursor atau sentuh tiap benua di atas untuk mempelajari kepingan Pangea!</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: REALISTIK 3D ISOMETRIK BATAS KONVERGEN (SUBDUKSI LEMPENG)
// Model Blok 3D Pejal Kedap Celah (Watertight Solid 3D Cutaway Block)
// Animasi 60 FPS: Lempeng Saling Menumbuk, Menunjam ke Bawah & Melebur Magma
// ═════════════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: REALISTIK 3D ISOMETRIK BATAS KONVERGEN (SUBDUKSI LEMPENG)
// Model Blok 3D Pejal Kedap Celah (Watertight Solid 3D Cutaway Block)
// Animasi 60 FPS: Lempeng Saling Menumbuk, Menunjam ke Bawah & Melebur Magma
// ═════════════════════════════════════════════════════════════════════════════
export function ConvergentSubductionIllustration() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [animTime, setAnimTime] = useState(0);

  // Siklus Tektonik Otomatis 8000 ms:
  // 0 - 2400ms (0 - 30%): Tahap 1 - Kedua lempeng bergerak saling mendekat & bertabrakan
  // 2400 - 5400ms (30 - 67.5%): Tahap 2 - Lempeng samudra yang berat menunjam ke bawah astenosfer & palung terbentuk
  // 5400 - 7200ms (67.5 - 90%): Tahap 3 - Peleburan magma di mantel dalam, magma naik & letusan gunung api
  // 7200 - 8000ms (90 - 100%): Tahap 4 - Transisi mulus reset siklus alami
  useEffect(() => {
    let animId: number;
    let lastNow = performance.now();

    const loop = (now: number) => {
      const dt = now - lastNow;
      lastNow = now;

      if (isPlaying) {
        setAnimTime((prev) => (prev + dt) % 8000);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const handleTriggerSubduction = () => {
    retroAudio.playExplosion();
    setAnimTime(2400);
    setIsPlaying(true);
  };

  const t = animTime;
  const isApproaching = t < 2400;
  const isSubducting = t >= 2400 && t < 5400;
  const isMelting = t >= 5400 && t < 7200;
  const isResetting = t >= 7200;

  // 1. Kedalaman Penunjaman Lempeng Samudra (Subduction Depth 0 -> 1)
  let subduct = 0;
  if (isApproaching) {
    subduct = t > 1600 ? ((t - 1600) / 800) * 0.08 : 0;
  } else if (isSubducting) {
    const p = (t - 2400) / 3000;
    subduct = 0.08 + 0.92 * (0.5 - 0.5 * Math.cos(p * Math.PI));
  } else if (isMelting) {
    subduct = 1;
  } else if (isResetting) {
    const p = (t - 7200) / 800;
    subduct = 0.5 + 0.5 * Math.cos(p * Math.PI);
  }

  // 2. Elevasi Terangkatnya Gunung Api Benua (Orogenic Uplift)
  const mountainLift = subduct * 16;

  // 3. Peleburan Magma & Erupsi Vulkanik
  let magmaIntensity = 0;
  let ashPlumeScale = 0;
  if (isSubducting) {
    const p = (t - 2400) / 3000;
    magmaIntensity = p > 0.55 ? (p - 0.55) / 0.45 : 0;
  } else if (isMelting) {
    magmaIntensity = 1;
    ashPlumeScale = Math.min(1, (t - 5400) / 450);
  } else if (isResetting) {
    const p = (t - 7200) / 800;
    magmaIntensity = Math.max(0, 1 - p * 2);
    ashPlumeScale = Math.max(0, 1 - p * 2);
  }

  // Posisi Gelembung Magma Naik Melalui Diapir / Pipa Vulkanik
  const magmaBubbleY1 = 205 - ((t * 0.055) % 80);
  const magmaBubbleY2 = 205 - (((t * 0.055) + 40) % 80);

  // Status & Label HUD
  let statusBadge = '1. TUMBUKAN LEMPENG (SALING MENDEKATI & BERTABRAKAN)';
  let badgeStyle = 'text-cyan-300 bg-cyan-950/80 border-cyan-500/70';
  let dotAnim = 'bg-cyan-400 animate-pulse';

  if (isSubducting) {
    statusBadge = '2. PENUNJAMAN LEMPENG SAMUDRA KE BAWAH LEMPENG BENUA';
    badgeStyle = 'text-amber-300 bg-amber-950/80 border-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
    dotAnim = 'bg-amber-400 animate-ping';
  } else if (isMelting) {
    statusBadge = '3. PELEBURAN MAGMA DI MANTEL & LETUSAN GUNUNG API';
    badgeStyle = 'text-rose-200 bg-rose-950/90 border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse';
    dotAnim = 'bg-rose-400 animate-ping';
  } else if (isResetting) {
    statusBadge = 'SIKLUS TEKTONIK SUBDUKSI BERULANG SECARA ALAMI';
    badgeStyle = 'text-emerald-300 bg-emerald-950/80 border-emerald-500/70';
    dotAnim = 'bg-emerald-400';
  }

  // Koordinat Ujung Slab yang Menunjam (Dijaga selalu di dalam blok pejal Y <= 242 < 265)
  const tipX = 240 + subduct * 115;
  const tipY = 173 + subduct * 68;

  // Variasi Kedalaman Palung
  const trenchDepth = subduct * 14;

  // Posisi Puncak Kawah Gunung Api 3D
  const volcanoPeakX = 350;
  const volcanoPeakY = 104 - mountainLift;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between bg-[#050811] select-none font-pixel overflow-hidden">
      {/* ── TOP CONTROL & STATUS HEADER (TANPA TAB SELECTOR) ── */}
      <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-950/95 border-b border-amber-800/60 z-20 shadow-md gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-amber-300 font-pixel-title text-[13px] sm:text-[15px] font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            DINAMIKA BATAS KONVERGEN: SUBDUKSI
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded-full border text-[13.5px] sm:text-[13px] font-bold flex items-center gap-1.5 ${badgeStyle}`}>
            <span className={`w-2 h-2 rounded-full ${dotAnim}`} />
            <span>{statusBadge}</span>
          </div>

          <button
            onClick={handleTriggerSubduction}
            className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 text-[13px] font-bold transition-all active:scale-95 border border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)] cursor-pointer hidden sm:flex items-center gap-1"
            title="Klik untuk memicu proses penunjaman dan peleburan magma"
          >
            <span>Picu Subduksi</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[13px] font-bold border border-slate-600 transition-all cursor-pointer"
          >
            {isPlaying ? '⏸ Jeda' : '▶ Putar'}
          </button>
        </div>
      </div>

      {/* ── FULL-HEIGHT 3D ISOMETRIC SOLID BLOCK CANVAS (60 FPS) ── */}
      <div className="w-full flex-1 min-h-0 relative flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 640 280"
          className="w-full h-full object-contain drop-shadow-2xl"
          shapeRendering="geometricPrecision"
        >
          <defs>
            {/* Langit Latar Belakang */}
            <linearGradient id="skyConvGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="60%" stopColor="#0b1329" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Air Samudra (Permukaan Atas 3D) */}
            <linearGradient id="oceanSurfaceGrad" x1="0" y1="0" x2="1" y2="0.6">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="60%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>

            {/* Kerak Samudra (Lapisan Hijau Basaltik sesuai Gambar Referensi) */}
            <linearGradient id="oceanCrustGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Litosfer Mantel Samudra (Lapisan Cokelat Litosfer) */}
            <linearGradient id="oceanLithoGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#5c260a" />
            </linearGradient>

            {/* Astenosfer (Mantel Panas Merah-Oranye Sesuai Gambar Referensi) */}
            <linearGradient id="astheGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="40%" stopColor="#dc2626" />
              <stop offset="80%" stopColor="#991b1b" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>

            {/* Kerak Benua (Lapisan Pasir/Granit Cokelat Muda Berbatu Sesuai Gambar Referensi) */}
            <linearGradient id="contCrustGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>

            {/* Permukaan Atas Daratan Benua 3D */}
            <linearGradient id="contTopSurfaceGrad" x1="0" y1="0" x2="1" y2="0.5">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="45%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* Lereng Gunung Api Sisi Terang (Barat) */}
            <linearGradient id="volcanoWestGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Lereng Gunung Api Sisi Bayangan (Timur) */}
            <linearGradient id="volcanoEastGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            {/* Dinding Potongan Samping Kanan (3D Side Face) */}
            <linearGradient id="sideCrustGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="sideLithoGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5c260a" />
              <stop offset="100%" stopColor="#351404" />
            </linearGradient>
            <linearGradient id="sideAstheGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>

            {/* Kantung Magma Melebur & Pipa Saluran Vulkanik */}
            <radialGradient id="magmaChamberGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
            </radialGradient>

            {/* Asap Vulkanik Gunung Berapi */}
            <linearGradient id="volcanoAshGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#475569" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="convGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Shadow Blok 3D */}
            <filter id="convBlockShadow" x="-10%" y="-10%" width="125%" height="130%">
              <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#000000" floodOpacity="0.85" />
            </filter>
          </defs>

          {/* Latar Belakang Kanvas */}
          <rect width="640" height="280" fill="url(#skyConvGrad)" />

          {/* Bayangan Blok Geologis 3D di Bagian Bawah (Kedap Celah) */}
          <polygon
            points="55,270 495,270 610,215 170,215"
            fill="#020617"
            opacity="0.8"
            filter="url(#convBlockShadow)"
          />

          {/* ══════════════════════════════════════════════════════════════════
              1. ASTENOSFER (MANTEL BUMI PANAS PEJAL - LAPISAN DASAR DI BAWAH)
              Terpasang solid dari X=65 sampai X=485, Y=195 sampai Y=265
              ══════════════════════════════════════════════════════════════════ */}
          <g id="asthenosphere-mantle">
            <polygon
              points="65,195 485,195 485,265 65,265"
              fill="url(#astheGrad)"
              stroke="#450a0a"
              strokeWidth="0.8"
            />
            {/* Gelombang Arus Konveksi Panas Mantel */}
            <path
              d="M 85,220 Q 140,240 200,225 Q 260,210 320,230 Q 380,250 440,235"
              fill="none"
              stroke="#fb923c"
              strokeWidth="1.5"
              opacity="0.3"
            />
            <path
              d="M 110,245 Q 170,255 230,240 Q 290,225 350,245 Q 410,260 470,245"
              fill="none"
              stroke="#fca5a5"
              strokeWidth="1.2"
              opacity="0.25"
            />
          </g>

          {/* ══════════════════════════════════════════════════════════════════
              2. PENAMPANG DEPAN: LEMPENG BENUA (LITOSFER & KERAK BENUA)
              Rapat presisi dari garis pantai X=240 sampai dinding kanan X=485
              ══════════════════════════════════════════════════════════════════ */}
          <g id="continental-plate-cross-section">
            {/* Litosfer Mantel Benua (Cokelat Tua) */}
            <polygon
              points="240,188 485,188 485,195 240,195"
              fill="#5c260a"
              stroke="#351404"
              strokeWidth="0.8"
            />

            {/* Kerak Benua Tebal (Cokelat Muda / Tan) */}
            <polygon
              points="240,145 485,145 485,188 240,188"
              fill="url(#contCrustGrad)"
              stroke="#78350f"
              strokeWidth="0.8"
            />

            {/* Tekstur Batuan Granit & Lapisan Geologis Benua */}
            <line x1="245" y1="162" x2="480" y2="162" stroke="#f59e0b" strokeWidth="1" opacity="0.35" strokeDasharray="6 3" />
            <line x1="245" y1="176" x2="480" y2="176" stroke="#fef08a" strokeWidth="0.8" opacity="0.3" />
          </g>

          {/* ══════════════════════════════════════════════════════════════════
              3. PENAMPANG DEPAN: LEMPENG SAMUDRA & SLAB MENUNJAM KE BAWAH
              Air rapat presisi ke garis pantai X=240, Y=145 tanpa celah/takikan!
              ══════════════════════════════════════════════════════════════════ */}
          <g id="oceanic-plate-cross-section">
            {/* Air Samudra (Potongan Depan) - Rapat sempurna ke X=240 */}
            <polygon
              points="65,145 240,145 240,161 65,161"
              fill="#0284c7"
              stroke="#0369a1"
              strokeWidth="0.8"
            />

            {/* Kerak Samudra (Lapisan Hijau Basaltik) yang Menunjam ke Bawah */}
            <path
              d={`
                M 65,161 
                L 215,161 
                Q 240,${162 + trenchDepth * 0.4} ${tipX},${tipY} 
                L ${tipX - 7},${tipY + 10} 
                Q 235,${174 + trenchDepth * 0.4} 215,173 
                L 65,173 
                Z
              `}
              fill="url(#oceanCrustGrad)"
              stroke="#065f46"
              strokeWidth="1"
            />

            {/* Litosfer Mantel Samudra (Lapisan Cokelat Litosfer) di Bawah Kerak */}
            <path
              d={`
                M 65,173 
                L 215,173 
                Q 235,${174 + trenchDepth * 0.4} ${tipX - 7},${tipY + 10} 
                L ${tipX - 18},${tipY + 24} 
                Q 230,${194 + trenchDepth * 0.4} 215,195 
                L 65,195 
                Z
              `}
              fill="url(#oceanLithoGrad)"
              stroke="#451a03"
              strokeWidth="1"
            />

            {/* Panah Dinamis pada Slab yang Menunjam ke Bawah-Kanan */}
            {subduct > 0.35 && (
              <g
                transform={`translate(${245 + subduct * 50}, ${182 + subduct * 30}) rotate(30)`}
                filter="url(#convGlow)"
              >
                <polygon
                  points="0,-4 14,-4 14,-8 24,0 14,8 14,4 0,4"
                  fill="#facc15"
                  stroke="#78350f"
                  strokeWidth="1.2"
                />
              </g>
            )}
          </g>

          {/* ══════════════════════════════════════════════════════════════════
              4. PELEBURAN MAGMA & PIPA SALURAN VULKANIK KE GUNUNG API
              ══════════════════════════════════════════════════════════════════ */}
          {magmaIntensity > 0.05 && (
            <g id="magma-melting-system" opacity={magmaIntensity}>
              {/* Kantung Peleburan Magma Primer di Atas Slab Menunjam */}
              <ellipse
                cx="320"
                cy="208"
                rx="22"
                ry="12"
                fill="url(#magmaChamberGlow)"
                filter="url(#convGlow)"
              />
              <ellipse
                cx="320"
                cy="208"
                rx="12"
                ry="6"
                fill="#ffffff"
                filter="url(#convGlow)"
              />

              {/* Saluran Pipa Magma Menembus Kerak Benua Menuju Gunung Api */}
              <path
                d={`
                  M 320,202 
                  Q 335,165 ${volcanoPeakX},${volcanoPeakY + 25} 
                  L ${volcanoPeakX},${volcanoPeakY + 5}
                `}
                fill="none"
                stroke="#f97316"
                strokeWidth="5"
                strokeLinecap="round"
                filter="url(#convGlow)"
              />
              <path
                d={`
                  M 320,202 
                  Q 335,165 ${volcanoPeakX},${volcanoPeakY + 25} 
                  L ${volcanoPeakX},${volcanoPeakY + 5}
                `}
                fill="none"
                stroke="#fef08a"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Gelembung Magma Pijar yang Bergerak Naik */}
              <circle
                cx={328 + (1 - (magmaBubbleY1 - 125) / 80) * 17}
                cy={magmaBubbleY1}
                r="3.5"
                fill="#ffffff"
                filter="url(#convGlow)"
              />
              <circle
                cx={328 + (1 - (magmaBubbleY2 - 125) / 80) * 17}
                cy={magmaBubbleY2}
                r="3"
                fill="#fef08a"
                filter="url(#convGlow)"
              />

              {/* Dapur Magma Sekunder di Bawah Gunung Api */}
              <ellipse
                cx={volcanoPeakX}
                cy={volcanoPeakY + 35}
                rx="15"
                ry="8"
                fill="url(#magmaChamberGlow)"
                filter="url(#convGlow)"
              />
            </g>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              5. PERMUKAAN ATAS ISOMETRIK 3D (OCEAN, TRENCH & CONTINENT)
              100% Solid & Kedap Celah (Unbroken Watertight Surfaces)
              ══════════════════════════════════════════════════════════════════ */}
          {/* A. Permukaan Air Samudra 3D (Sisi Kiri) */}
          <polygon
            points="65,145 180,90 355,90 240,145"
            fill="url(#oceanSurfaceGrad)"
            stroke="#0369a1"
            strokeWidth="1"
          />

          {/* Garis Gelombang Samudra Halus */}
          <line x1="95" y1="130" x2="185" y2="130" stroke="#38bdf8" strokeWidth="1.2" opacity="0.6" />
          <line x1="140" y1="112" x2="235" y2="112" stroke="#7dd3fc" strokeWidth="1" opacity="0.5" />
          <line x1="190" y1="98" x2="280" y2="98" stroke="#bae6fd" strokeWidth="0.8" opacity="0.4" />

          {/* Panah Samudra Bergerak ke Kanan (Tumbukan) */}
          <g transform="translate(155, 118)">
            <polygon
              points="0,-4 20,-4 20,-9 32,0 20,9 20,4 0,4"
              fill="#dc2626"
              stroke="#7f1d1d"
              strokeWidth="1.2"
              filter="url(#convGlow)"
            />
          </g>

          {/* B. Palung Laut (Garis Batas Pertemuan Lempeng Rapat & Arsir Kedalaman) */}
          <line x1="240" y1="145" x2="355" y2="90" stroke="#0369a1" strokeWidth="2" />
          <line x1="250" y1="140" x2="256" y2="143" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />
          <line x1="270" y1="130" x2="276" y2="133" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />
          <line x1="290" y1="120" x2="296" y2="123" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />
          <line x1="310" y1="110" x2="316" y2="113" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />
          <line x1="330" y1="100" x2="336" y2="103" stroke="#38bdf8" strokeWidth="1.2" opacity="0.8" />

          {/* C. Permukaan Dasar Daratan Benua 3D (Solid Quad Tanpa Celah, Rapat ke X=240) */}
          <polygon
            points="240,145 355,90 600,90 485,145"
            fill="url(#contTopSurfaceGrad)"
            stroke="#b45309"
            strokeWidth="1"
          />

          {/* D. Tubuh Kerucut Gunung Berapi 3D di Atas Daratan Benua (Simetris & Bersih) */}
          {/* Lereng Belakang Kerucut Gunung Api (Menghubungkan ke Puncak tanpa Sirip Liar) */}
          <path
            d={`
              M ${volcanoPeakX - 11},${volcanoPeakY} 
              Q ${volcanoPeakX},${volcanoPeakY - 4} ${volcanoPeakX + 11},${volcanoPeakY} 
              L 395,134 
              Q ${volcanoPeakX},116 295,134 
              Z
            `}
            fill="#854d0e"
            opacity="0.9"
          />

          {/* Lereng Barat Gunung Api (Sisi Terang Menghadap Samudra) */}
          <path
            d={`
              M ${volcanoPeakX - 11},${volcanoPeakY} 
              L 295,134 
              Q ${volcanoPeakX},150 ${volcanoPeakX},145 
              L ${volcanoPeakX},${volcanoPeakY + 4} 
              Z
            `}
            fill="url(#volcanoWestGrad)"
            stroke="#b45309"
            strokeWidth="0.8"
          />

          {/* Lereng Timur Gunung Api (Sisi Bayangan Menghadap Daratan) */}
          <path
            d={`
              M ${volcanoPeakX},${volcanoPeakY + 4} 
              L ${volcanoPeakX},145 
              Q ${volcanoPeakX},150 395,134 
              L ${volcanoPeakX + 11},${volcanoPeakY} 
              Z
            `}
            fill="url(#volcanoEastGrad)"
            stroke="#78350f"
            strokeWidth="0.8"
          />

          {/* Kawah Gunung Berapi di Puncak */}
          <ellipse
            cx={volcanoPeakX}
            cy={volcanoPeakY}
            rx="11"
            ry="5"
            fill={magmaIntensity > 0.3 ? '#ef4444' : '#451a03'}
            stroke="#991b1b"
            strokeWidth="1.2"
          />
          {magmaIntensity > 0.3 && (
            <ellipse
              cx={volcanoPeakX}
              cy={volcanoPeakY}
              rx="6.5"
              ry="2.8"
              fill="#fef08a"
              filter="url(#convGlow)"
            />
          )}

          {/* Letusan & Semburan Asap Vulkanik di Puncak Gunung */}
          {ashPlumeScale > 0.05 && (
            <g transform={`translate(${volcanoPeakX}, ${volcanoPeakY}) scale(${ashPlumeScale})`}>
              <ellipse cx="0" cy="-16" rx="13" ry="16" fill="url(#volcanoAshGrad)" />
              <ellipse cx="-7" cy="-28" rx="15" ry="13" fill="#334155" opacity="0.75" />
              <ellipse cx="7" cy="-32" rx="17" ry="14" fill="#475569" opacity="0.7" />
              <ellipse cx="0" cy="-45" rx="20" ry="15" fill="#64748b" opacity="0.5" />
              <circle cx="-3" cy="-5" r="2.5" fill="#facc15" filter="url(#convGlow)" />
              <circle cx="4" cy="-8" r="2" fill="#ef4444" filter="url(#convGlow)" />
            </g>
          )}

          {/* Panah Benua Bergerak ke Kiri (Tumbukan) */}
          <g transform="translate(470, 115)">
            <polygon
              points="0,-4 -20,-4 -20,-9 -32,0 -20,9 -20,4 0,4"
              fill="#dc2626"
              stroke="#7f1d1d"
              strokeWidth="1.2"
              filter="url(#convGlow)"
            />
          </g>

          {/* ══════════════════════════════════════════════════════════════════
              6. POTONGAN SAMPING KANAN BLOK 3D (SOLID WATERTIGHT SIDE FACE)
              Terpasang solid dari X=485 sampai X=600, menempel sempurna ke penampang depan
              ══════════════════════════════════════════════════════════════════ */}
          <g id="right-side-3d-cutaway">
            {/* Kerak Benua Samping Kanan */}
            <polygon
              points="485,145 600,90 600,133 485,188"
              fill="url(#sideCrustGrad)"
              stroke="#451a03"
              strokeWidth="0.8"
            />
            {/* Litosfer Mantel Samping Kanan */}
            <polygon
              points="485,188 600,133 600,140 485,195"
              fill="url(#sideLithoGrad)"
              stroke="#351404"
              strokeWidth="0.8"
            />
            {/* Astenosfer Samping Kanan */}
            <polygon
              points="485,195 600,140 600,210 485,265"
              fill="url(#sideAstheGrad)"
              stroke="#450a0a"
              strokeWidth="0.8"
            />
          </g>

          {/* ══════════════════════════════════════════════════════════════════
              7. INDIKATOR TITIK GEMPA MEGATHRUST
              ══════════════════════════════════════════════════════════════════ */}
          {subduct > 0.25 && (
            <g id="megathrust-hypocenters">
              <circle
                cx={240 + subduct * 26}
                cy={175 + subduct * 15}
                r="4.5"
                fill="#ffffff"
                stroke="#ef4444"
                strokeWidth="1.5"
                className="animate-ping"
              />
              <circle
                cx={240 + subduct * 26}
                cy={175 + subduct * 15}
                r="3"
                fill="#facc15"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

// 5. SUB-KOMPONEN: TIGA BENTANG ALAM GEOLOGIS HASIL TUMBUKAN KONVERGEN
// ═════════════════════════════════════════════════════════════════════════════
// 5. DATA & SUB-KOMPONEN: TIGA BENTANG ALAM GEOLOGIS HASIL TUMBUKAN KONVERGEN
// ═════════════════════════════════════════════════════════════════════════════

// 5. SUB-KOMPONEN: TIGA BENTANG ALAM GEOLOGIS HASIL TUMBUKAN KONVERGEN
// ═════════════════════════════════════════════════════════════════════════════
// 5. DATA & SUB-KOMPONEN: TIGA BENTANG ALAM GEOLOGIS HASIL TUMBUKAN KONVERGEN
// ═════════════════════════════════════════════════════════════════════════════
export const CONVERGENT_LANDFORMS_DATA = {
  trench: {
    tabLabel: '1. PALUNG LAUT',
    title: '1. PALUNG LAUT DALAM (DEEP SEA TRENCH)',
    subtitle: 'Ngarai Dasar Laut Terdalam di Bumi',
    points: [
      { icon: 'arrow-down', text: 'Terbentuk saat lempeng samudra yang berat menunjam curam ke bawah lempeng benua.' },
      { icon: 'search', text: 'Kedalaman 7.000 - 11.000 m! Palung Mariana adalah titik terdalam di dunia (11.034 m).' },
      { icon: 'bulb', text: 'Fakta: Gunung Everest (8.848 m) masih tenggelam >2.000 m jika dimasukkan ke palung ini!' },
    ],
  },
  mountains: {
    tabLabel: '2. PEGUNUNGAN',
    title: '2. RANTAI PEGUNUNGAN LIPATAN (FOLDED MOUNTAINS)',
    subtitle: 'Daratan Terangkat Akibat Tumbukan Lempeng',
    points: [
      { icon: 'layers', text: 'Dua lempeng saling menekan kuat, meremas dan melipat lapisan batuan kerak benua ke atas.' },
      { icon: 'flag', text: 'Puncak lipatan disebut Antiklin, sedangkan lembah cekungannya disebut Sinklin.' },
      { icon: 'check', text: 'Contoh nyata: Pegunungan Bukit Barisan di Sumatra dan Pegunungan Himalaya di Asia.' },
    ],
  },
  volcano: {
    tabLabel: '3. GUNUNG BERAPI',
    title: '3. BUSUR GUNUNG BERAPI AKTIF (VOLCANIC ARC)',
    subtitle: 'Jalur Erupsi Magma Peleburan Lempeng',
    points: [
      { icon: 'zap', text: 'Lempeng yang menunjam meleleh di mantel bumi bersuhu >1.200°C menjadi batuan cair (magma).' },
      { icon: 'arrow-up', text: 'Magma panas yang lebih ringan mendesak naik ke permukaan membentuk kantung magma.' },
      { icon: 'shield', text: 'Melahirkan jalur gunung berapi aktif Nusantara seperti Gunung Merapi, Semeru, & Krakatau.' },
    ],
  },
};

export function ConvergentLandformsIllustration({
  selectedLandform = 'trench',
  onSelectLandform,
}: {
  selectedLandform?: 'trench' | 'mountains' | 'volcano';
  onSelectLandform?: (lf: 'trench' | 'mountains' | 'volcano') => void;
}) {
  const [internalLandform, setInternalLandform] = useState<'trench' | 'mountains' | 'volcano'>('trench');
  const activeLandform = onSelectLandform ? selectedLandform : internalLandform;
  const handleSelect = (lf: 'trench' | 'mountains' | 'volcano') => {
    retroAudio.playSelect();
    if (onSelectLandform) {
      onSelectLandform(lf);
    } else {
      setInternalLandform(lf);
    }
  };

  return (
    <div className="w-full h-full relative flex flex-col justify-between select-none">
      {/* Tab Switcher Top - Padding cukup agar tombol atas tidak terpotong */}
      <div className="w-full pt-2.5 px-2 sm:px-3 pb-2 flex items-center justify-between border-b border-slate-800 bg-slate-950/95 z-20 shrink-0 gap-1 overflow-x-auto">
        <span className="text-[13px] sm:text-[15px] font-pixel-title text-amber-400 font-bold shrink-0 flex items-center gap-1.5">
          <PixelIcon name="layers" size={14} className="text-amber-400" />
          <span className="hidden sm:inline">PILIH BENTANG ALAM:</span>
          <span className="sm:hidden">BENTANG ALAM:</span>
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => handleSelect('trench')}
            className={`px-3 py-1.5 rounded-lg text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-colors border-2 ${activeLandform === 'trench'
              ? 'bg-cyan-600 text-white border-cyan-300 shadow-[0_2px_0_#083344]'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
              } font-semibold`}
          >
            [1. PALUNG LAUT]
          </button>
          <button
            onClick={() => handleSelect('mountains')}
            className={`px-3 py-1.5 rounded-lg text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-colors border-2 ${activeLandform === 'mountains'
              ? 'bg-amber-600 text-white border-amber-300 shadow-[0_2px_0_#451a03]'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
              } font-semibold`}
          >
            [2. PEGUNUNGAN]
          </button>
          <button
            onClick={() => handleSelect('volcano')}
            className={`px-3 py-1.5 rounded-lg text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-colors border-2 ${activeLandform === 'volcano'
              ? 'bg-rose-600 text-white border-rose-300 shadow-[0_2px_0_#4c0519]'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
              } font-semibold`}
          >
            [3. GUNUNG BERAPI]
          </button>
        </div>
      </div>

      {/* Main Illustration Canvas: Berganti Penuh Sesuai Tab Terpilih */}
      <div className="w-full flex-1 min-h-0 relative flex items-center justify-center overflow-hidden p-2 sm:p-4">
        {activeLandform === 'trench' && <TrenchIllustration />}
        {activeLandform === 'mountains' && <FoldedMountainsIllustration />}
        {activeLandform === 'volcano' && <VolcanoIllustration />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GAMBAR 1: PALUNG LAUT DALAM (DEEP SEA TRENCH) — SESUAI 4 FOTO REFERENSI
// Kapal riset permukaan, jurang karang terjal, kapsul selam lampu sorot, skala kedalaman & komparasi Mt. Everest
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// GAMBAR 1: PALUNG LAUT DALAM (DEEP SEA TRENCH) — SESUAI 4 FOTO REFERENSI
// Kapal riset permukaan, jurang karang terjal, kapsul selam lampu sorot, skala kedalaman & komparasi Mt. Everest
// ─────────────────────────────────────────────────────────────────────────────
export function TrenchIllustration() {
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
      <line x1="0" y1="38" x2="560" y2="38" stroke="#38bdf8" strokeWidth="1.5" />

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
        <line x1="239" y1="18" x2="239" y2="135" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
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
        <line x1="34" y1="65" x2="180" y2="65" stroke="#38bdf8" strokeWidth="0.8" opacity="0.3" />
        <text x="24" y="68" fill="#7dd3fc" fontSize="5.5" textAnchor="end">200 m</text>
        <text x="36" y="63" fill="#38bdf8" fontSize="5" opacity="0.8">Zona Terang</text>

        {/* Tick 1.000 m (Zona Senja) */}
        <line x1="26" y1="105" x2="34" y2="105" stroke="#94a3b8" strokeWidth="1" />
        <line x1="34" y1="105" x2="250" y2="105" stroke="#38bdf8" strokeWidth="0.8" opacity="0.25" />
        <text x="24" y="108" fill="#93c5fd" fontSize="5.5" textAnchor="end">1.000 m</text>

        {/* Tick 4.000 m (Zona Gelap Abisal) */}
        <line x1="26" y1="165" x2="34" y2="165" stroke="#94a3b8" strokeWidth="1" />
        <line x1="34" y1="165" x2="270" y2="165" stroke="#38bdf8" strokeWidth="0.8" opacity="0.2" />
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

// ─────────────────────────────────────────────────────────────────────────────
// GAMBAR 2: RANTAI PEGUNUNGAN LIPATAN (FOLDED MOUNTAINS)
// Kompresi mendatar dua lempeng, puncak lipatan antiklin, lembah sinklin & puncak salju
// ─────────────────────────────────────────────────────────────────────────────
export function FoldedMountainsIllustration() {
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

// ─────────────────────────────────────────────────────────────────────────────
// GAMBAR 3: BUSUR GUNUNG BERAPI AKTIF (VOLCANIC ARC / STRATOVOLCANO)
// Subduksi lempeng, peleburan magma di mantel, dapur magma & erupsi stratovolcano
// ─────────────────────────────────────────────────────────────────────────────
export function VolcanoIllustration() {
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
        <path d="M 205,200 Q 240,195 270,185" fill="none" stroke="#f97316" strokeWidth="2" />
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

export function MegathrustIllustration() {
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
        <span className="text-[12.5px] font-pixel-title text-rose-400 font-bold flex items-center gap-1.5">
          <PixelIcon name="alert" size={13} className="text-rose-500 animate-pulse" />
          <span>SIMULATOR MEKANISME GEMPA MEGATHRUST &amp; TSUNAMI</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTogglePhase('locked')}
            className={`px-3 py-1 rounded-lg text-[12.5px] font-pixel-title font-bold border-2 cursor-pointer transition-all ${!isRupture
              ? 'bg-amber-600 text-white border-amber-300 shadow-[0_2px_0_#451a03] -translate-y-0.5'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
          >
            [1. FASE TERKUNCI]
          </button>
          <button
            onClick={() => handleTogglePhase('rupture')}
            className={`px-3 py-1 rounded-lg text-[12.5px] font-pixel-title font-bold border-2 cursor-pointer transition-all ${isRupture
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
              <line x1="0" y1="55" x2="260" y2="85" stroke="#38bdf8" strokeWidth="2.5" />
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
              <line x1="255" y1="121" x2="225" y2="142" stroke="#f59e0b" strokeWidth="1.5" />
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
      <div className="w-full bg-[#0f172a] border-2 border-rose-500/80 rounded-xl p-2.5 text-slate-200 text-[13px] flex items-center justify-between gap-3 shadow-lg font-semibold">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-rose-600/30 text-rose-300 font-pixel-title text-[12.5px] border border-rose-500 font-bold whitespace-nowrap">
            {!isRupture ? 'FASE 1: AKUMULASI TEGANGAN' : 'FASE 2: PELEPASAN & TSUNAMI'}
          </span>
          <p className="text-[13.5px] sm:text-[14.5px] leading-snug text-slate-300 font-semibold">
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

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: SISMOGRAF MEKANIK KE SINYAL LISTRIK & BUKTI 20 LEMPENG BUMI
// ═════════════════════════════════════════════════════════════════════════════
export function SeismographPlatesIllustration() {
  const [activeTab, setActiveTab] = useState<'seismograph' | 'plates'>('seismograph');

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between bg-[#09090b] select-none p-1 sm:p-2 font-pixel">
      {/* Top Header Mode Switcher (Tab Anti-Clipping) */}
      <div className="w-full flex items-center justify-between px-2 pt-2 pb-1.5 bg-slate-950/95 border-b border-amber-800/60 text-[13.5px] z-10 shadow-sm gap-2 font-semibold">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              retroAudio.playSelect();
              setActiveTab('seismograph');
            }}
            className={`pt-2 px-3 pb-1.5 rounded-t-lg font-pixel-title text-[12.5px] font-bold cursor-pointer transition-all border-t-2 border-x-2 ${activeTab === 'seismograph'
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
            className={`pt-2 px-3 pb-1.5 rounded-t-lg font-pixel-title text-[12.5px] font-bold cursor-pointer transition-all border-t-2 border-x-2 ${activeTab === 'plates'
              ? 'bg-[#1e1b4b] text-amber-300 border-amber-500 shadow-[0_-2px_6px_rgba(245,158,11,0.3)]'
              : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
          >
            [2. PETA 20 LEMPENG BUMI]
          </button>
        </div>
        <span className="text-[12px] text-slate-400 hidden sm:inline font-semibold">
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
            <path d="M 188,109 L 360,153" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.8" />
            <path d="M 188,122 L 360,166" stroke="#94a3b8" strokeWidth="1" opacity="0.9" />
            <path d="M 188,135 L 360,179" stroke="#cbd5e1" strokeWidth="0.8" opacity="0.8" />

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
          <path d="M 120 35 L 60 80 L 70 150 L 90 220" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
          <path d="M 480 45 L 460 110 L 420 150 L 430 210" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
          {/* Pematang Tengah Atlantik (Mid-Atlantic Ridge) */}
          <path d="M 190 20 Q 210 80, 195 140 Q 220 180, 200 230" fill="none" stroke="#f97316" strokeWidth="2.5" />
          {/* Sabuk Mediterania - Himalaya - Indonesia */}
          <path d="M 220 90 L 270 95 L 350 115 L 420 140 L 470 170" fill="none" stroke="#ef4444" strokeWidth="2.5" />

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
        <div className="bg-[#0f172a] border-2 border-cyan-500/80 rounded-xl p-2.5 text-slate-200 text-[13px] shadow-md font-semibold">
          <div className="flex items-center gap-1.5 mb-1.5 text-cyan-300 font-pixel-title text-[14px] sm:text-[13px] font-bold">
            <PixelIcon name="shield" size={14} />
            <span>1. INERSIA MASSA</span>
          </div>
          <p className="text-[13px] sm:text-[16px] leading-relaxed text-slate-100 font-sans font-medium">
            Bandul berat tetap diam di posisinya karena gaya inersia saat rangka penopang dan tanah bergetar hebat.
          </p>
        </div>

        <div className="bg-[#0f172a] border-2 border-amber-500/80 rounded-xl p-2.5 text-slate-200 text-[13px] shadow-md font-semibold">
          <div className="flex items-center gap-1.5 mb-1.5 text-amber-300 font-pixel-title text-[14px] sm:text-[13px] font-bold">
            <PixelIcon name="zap" size={14} />
            <span>2. SINYAL LISTRIK</span>
          </div>
          <p className="text-[13px] sm:text-[16px] leading-relaxed text-slate-100 font-sans font-medium">
            Gerak relatif bandul dan magnet menginduksi arus listrik di koil kawat, direkam sebagai grafik seismogram (Gelombang P &amp; S).
          </p>
        </div>

        <div className="bg-[#0f172a] border-2 border-rose-500/80 rounded-xl p-2.5 text-slate-200 text-[13px] shadow-md font-semibold">
          <div className="flex items-center gap-1.5 mb-1.5 text-rose-300 font-pixel-title text-[14px] sm:text-[13px] font-bold">
            <PixelIcon name="globe" size={14} />
            <span>3. 20 LEMPENG BUMI</span>
          </div>
          <p className="text-[13px] sm:text-[16px] leading-relaxed text-slate-100 font-sans font-medium">
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

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: BATAS TRANSFORM & SESAR SAN ANDREAS (3D SOLID CUBES BERGESER)
// ═════════════════════════════════════════════════════════════════════════════
export const TRANSFORM_POINTS_DATA = [
  {
    icon: 'compass',
    title: '1. GERAK MENDATAR',
    text: 'Dua lempeng bergesekan mendatar (horizontal) saling berlawanan arah secara sejajar sepanjang bidang sesar.',
  },
  {
    icon: 'shield',
    title: '2. BATAS KONSERVATIF',
    text: 'Tidak ada pembentukan lempeng baru dan tidak ada penghancuran kerak bumi (berbeda dari divergen & konvergen).',
  },
  {
    icon: 'zap',
    title: '3. GEMPA BUMI DANGKAL',
    text: 'Gesekan batuan yang saling mengunci melepaskan energi elastis secara tiba-tiba melahirkan gempa bumi dangkal destruktif.',
  },
];

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
      <div className="w-full flex items-center justify-between px-2 pt-2 pb-1.5 bg-slate-950/95 border-b border-amber-800/60 text-[13.5px] z-10 shadow-sm gap-2 font-semibold">
        <span className="text-amber-300 font-pixel-title text-[12.5px] font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          BATAS TRANSFORM: SESAR GESER (3D CRUSTAL BLOCKS)
        </span>
        <span className={`text-[12px] font-bold flex items-center gap-1 ${statusColor}`}>
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
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: TAS SIAGA BENCANA 72 JAM (AREA 4 TEMUAN 1)
// ═════════════════════════════════════════════════════════════════════════════
