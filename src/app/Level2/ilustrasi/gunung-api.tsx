/**
 * Status dan Penanganan Gunung Api — ilustrasi untuk materi Discovery Level 2.
 *
 * Berkas ini dipecah dari DiscoveryModal.tsx. Semua komponen di sini mandiri:
 * tidak menyentuh state DiscoveryModal, hanya menerima props sederhana atau
 * tidak menerima props sama sekali.
 */

import { useState, useEffect } from 'react';
import { retroAudio } from '../../../utils/retroAudio';
import PixelIcon from '../../../components/PixelIcon';
import { sifatTombol, tutupModalDenganKeyboard, blokirRambatanTombol } from '../../../utils/keyboard';

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: 4 STATUS TINGKAT AKTIVITAS PVMBG & KRB (AREA 4 TEMUAN 1)
// Desain 100% Selaras Screenshot 2: Normal (tanpa asap), Waspada (asap putih),
// Siaga (asap abu-abu gelap), Awas (magma & lava pijar + awan letusan masif)
// ═════════════════════════════════════════════════════════════════════════════
export function VolcanoStatusIllustration() {
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3 | 4 | 'all'>(4);

  const levels = [
    {
      lvl: 1 as const,
      name: 'NORMAL (LEVEL I)',
      shortName: 'NORMAL',
      color: '#22c55e',
      border: '#15803d',
      haloBg: '#e0f2fe',
      haloBorder: '#7dd3fc',
      desc: 'Aktivitas dasar magma stabil dan tenang. Tidak ada ancaman letusan. Seluruh kawasan lereng aman untuk aktivitas masyarakat.',
      radius: 'Zona aman (> 2 km dari kawah puncak)',
      visualFeature: 'Kawah tenang tanpa asap pekat, lereng hijau alami, kondisi stabil.',
    },
    {
      lvl: 2 as const,
      name: 'WASPADA (LEVEL II)',
      shortName: 'WASPADA',
      color: '#eab308',
      border: '#a16207',
      haloBg: '#fef9c3',
      haloBorder: '#fde047',
      desc: 'Peningkatan aktivitas seismik dan visual di atas batas normal. Terdeteksi gempa vulkanik dangkal. Dilarang mendekati kawah puncak.',
      radius: 'Radius bahaya 2 - 3 km dari kawah aktif',
      visualFeature: 'Kolom asap solfatara putih tipis hingga sedang mulai membubung.',
    },
    {
      lvl: 3 as const,
      name: 'SIAGA (LEVEL III)',
      shortName: 'SIAGA',
      color: '#f97316',
      border: '#c2410c',
      haloBg: '#ffedd5',
      haloBorder: '#fb923c',
      desc: 'Peningkatan aktivitas vulkanik sangat nyata. Kubah lava membesar cepat dan rawan longsor. Posko evakuasi mulai siaga penuh.',
      radius: 'Radius bahaya 3 - 5 km dari kawah puncak',
      visualFeature: 'Kubah lava membara & kepulan asap abu-abu pekat membubung tinggi.',
    },
    {
      lvl: 4 as const,
      name: 'AWAS (LEVEL IV)',
      shortName: 'AWAS',
      color: '#ef4444',
      border: '#991b1b',
      haloBg: '#ffe4e6',
      haloBorder: '#fb7185',
      desc: 'Erupsi utama sedang atau berpeluang besar segera terjadi! Semburan lava pijar & awan panas. Seluruh warga KRB III wajib segera evakuasi total!',
      radius: 'Radius bahaya > 5 - 10 km (KRB III Wajib Evakuasi Total)',
      visualFeature: 'Lontaran magma pijar, aliran lava lereng, & awan letusan kolosal.',
    },
  ];

  // Helper render vektor gunung stratovolcano untuk masing-masing level (persis SS 2)
  const renderVolcanoArtwork = (lvl: 1 | 2 | 3 | 4, isCompact: boolean = false) => {
    const cur = levels.find((l) => l.lvl === lvl)!;
    const w = isCompact ? 130 : 250;
    const h = isCompact ? 150 : 200;
    const cx = w / 2;
    const mountainBaseY = h * 0.78;
    const peakY = h * 0.44;

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full object-contain overflow-visible" shapeRendering="geometricPrecision">
        <defs>
          {/* Circular Aura Background Gradient */}
          <radialGradient id={`halo-${lvl}-${isCompact ? 'c' : 'f'}`} cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor={cur.haloBg} />
            <stop offset="95%" stopColor={cur.haloBorder} stopOpacity="0.8" />
            <stop offset="100%" stopColor={cur.haloBorder} stopOpacity="0" />
          </radialGradient>

          {/* Sisi Terang Gunung (Western Slope) */}
          <linearGradient id={`mtn-light-${lvl}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Sisi Bayangan Gunung (Eastern Slope) */}
          <linearGradient id={`mtn-dark-${lvl}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="60%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Magma / Lava Gradient */}
          <linearGradient id="lavaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>

        {/* 1. Lingkaran Halo Latar Belakang (Aura Berwarna Sesuai SS 2) */}
        <circle cx={cx} cy={h * 0.52} r={isCompact ? 54 : 84} fill={`url(#halo-${lvl}-${isCompact ? 'c' : 'f'})`} />

        {/* 2. EFEK ASAP & ERUPSI DI ATAS PUNCAK (SESUAI PERMINTAAN PENGGUNA) */}
        {/* LEVEL 1 (NORMAL): GUNUNG BIASA SAJA, GA ADA ASAP, GA ADA APA-APA */}
        {lvl === 1 && (
          // Tidak ada asap atau magma sama sekali! Bersih dan tenang.
          null
        )}

        {/* LEVEL 2 (WASPADA): GUNUNG MULAI KELUARIN ASAP PUTIH BERGUMPAL (SOLFATARA) */}
        {lvl === 2 && (
          <g>
            {/* Pendaran kawah tipis keemasan */}
            <ellipse cx={cx} cy={peakY} rx={isCompact ? 5 : 8} ry={isCompact ? 2 : 3} fill="#fef08a" opacity="0.9" />

            {/* Kolom kepulan asap putih organik berlapis-lapis membubung ke atas */}
            {/* Puff 1 (Bibir Kawah) */}
            <circle cx={cx - 1} cy={peakY - 6} r={isCompact ? 4 : 7} fill="#ffffff" opacity="0.95" />
            <circle cx={cx + 3} cy={peakY - 7} r={isCompact ? 5 : 8} fill="#f8fafc" opacity="0.9" />

            {/* Puff 2 (Membesar saat naik) */}
            <circle cx={cx + 1} cy={peakY - (isCompact ? 14 : 22)} r={isCompact ? 6 : 11} fill="#ffffff" opacity="0.95" />
            <circle cx={cx - 4} cy={peakY - (isCompact ? 16 : 24)} r={isCompact ? 7 : 12} fill="#f1f5f9" opacity="0.9" />
            <circle cx={cx + 5} cy={peakY - (isCompact ? 17 : 26)} r={isCompact ? 6 : 10} fill="#e2e8f0" opacity="0.85" />

            {/* Puff 3 (Tinggi melayang tertiup angin) */}
            <circle cx={cx + 3} cy={peakY - (isCompact ? 25 : 40)} r={isCompact ? 8 : 14} fill="#ffffff" opacity="0.95" />
            <circle cx={cx - 3} cy={peakY - (isCompact ? 28 : 44)} r={isCompact ? 7 : 13} fill="#f8fafc" opacity="0.9" />
            <circle cx={cx + 8} cy={peakY - (isCompact ? 27 : 42)} r={isCompact ? 7 : 12} fill="#e2e8f0" opacity="0.8" />

            {/* Puff 4 (Puncak asap putih lembut) */}
            <circle cx={cx + 4} cy={peakY - (isCompact ? 36 : 58)} r={isCompact ? 9 : 16} fill="#ffffff" opacity="0.9" />
            <circle cx={cx - 2} cy={peakY - (isCompact ? 39 : 62)} r={isCompact ? 8 : 14} fill="#f1f5f9" opacity="0.85" />
            <circle cx={cx + 10} cy={peakY - (isCompact ? 38 : 60)} r={isCompact ? 7 : 12} fill="#e2e8f0" opacity="0.75" />
          </g>
        )}

        {/* LEVEL 3 (SIAGA): ASAP GUNUNG BERUBAH WARNA JADI ABU-ABU AGAK KEHITAMAN MEMBUBUNG TINGGI */}
        {lvl === 3 && (
          <g>
            {/* Rekahan kawah membara oranye-kuning */}
            <ellipse cx={cx} cy={peakY} rx={isCompact ? 6 : 10} ry={isCompact ? 2.5 : 4} fill="#ea580c" />
            <ellipse cx={cx} cy={peakY} rx={isCompact ? 4 : 7} ry={isCompact ? 1.5 : 2.5} fill="#facc15" />
            <path d={`M ${cx - 3} ${peakY} Q ${cx - 5} ${peakY + 6} ${cx - 8} ${peakY + 12}`} stroke="#f97316" strokeWidth={isCompact ? 1.5 : 2} fill="none" />

            {/* Kolom gumpalan abu vulkanik abu-abu gelap kehitaman */}
            {/* Puff 1 (Dasar Kawah Jelaga) */}
            <circle cx={cx - 2} cy={peakY - 6} r={isCompact ? 5 : 8} fill="#292524" opacity="0.95" />
            <circle cx={cx + 3} cy={peakY - 7} r={isCompact ? 6 : 9} fill="#44403c" opacity="0.95" />
            <circle cx={cx} cy={peakY - 5} r={isCompact ? 3 : 5} fill="#f97316" opacity="0.5" />

            {/* Puff 2 (Abu Vulkanik Gelap Menggumpal) */}
            <circle cx={cx + 2} cy={peakY - (isCompact ? 15 : 23)} r={isCompact ? 8 : 13} fill="#44403c" opacity="0.95" />
            <circle cx={cx - 5} cy={peakY - (isCompact ? 17 : 26)} r={isCompact ? 7 : 12} fill="#292524" opacity="0.95" />
            <circle cx={cx + 6} cy={peakY - (isCompact ? 18 : 28)} r={isCompact ? 7 : 11} fill="#57534e" opacity="0.9" />

            {/* Puff 3 (Lapisan Tengah Abu Silika) */}
            <circle cx={cx + 4} cy={peakY - (isCompact ? 27 : 42)} r={isCompact ? 9 : 15} fill="#57534e" opacity="0.95" />
            <circle cx={cx - 4} cy={peakY - (isCompact ? 30 : 46)} r={isCompact ? 9 : 14} fill="#44403c" opacity="0.95" />
            <circle cx={cx + 9} cy={peakY - (isCompact ? 29 : 44)} r={isCompact ? 8 : 13} fill="#78716c" opacity="0.9" />

            {/* Puff 4 (Puncak Gumpalan Awan Kelabu Kehitaman) */}
            <circle cx={cx + 5} cy={peakY - (isCompact ? 39 : 62)} r={isCompact ? 11 : 18} fill="#44403c" opacity="0.95" />
            <circle cx={cx - 3} cy={peakY - (isCompact ? 43 : 67)} r={isCompact ? 10 : 16} fill="#292524" opacity="0.95" />
            <circle cx={cx + 12} cy={peakY - (isCompact ? 41 : 65)} r={isCompact ? 9 : 15} fill="#57534e" opacity="0.9" />
            <circle cx={cx - 8} cy={peakY - (isCompact ? 40 : 64)} r={isCompact ? 8 : 13} fill="#78716c" opacity="0.85" />
          </g>
        )}

        {/* LEVEL 4 (AWAS): GUNUNG NGELUARIN MAGMA-MAGMA, LELEHAN LAVA PIJAR & AWAN HITAM MASIF */}
        {lvl === 4 && (
          <g>
            {/* Lontaran Air Mancur Magma Pijar Membubung dari Puncak Kawah */}
            <path
              d={`M ${cx - 5} ${peakY} 
                  Q ${cx - 10} ${peakY - (isCompact ? 18 : 28)} ${cx - 16} ${peakY - (isCompact ? 10 : 16)}
                  M ${cx + 5} ${peakY} 
                  Q ${cx + 12} ${peakY - (isCompact ? 20 : 30)} ${cx + 18} ${peakY - (isCompact ? 12 : 18)}
                  M ${cx} ${peakY} 
                  Q ${cx + 2} ${peakY - (isCompact ? 24 : 36)} ${cx + 4} ${peakY - (isCompact ? 8 : 12)}`}
              stroke="#fbbf24"
              strokeWidth={isCompact ? 2 : 3}
              strokeLinecap="round"
              fill="none"
            />
            {/* Percikan Bom Vulkanik Pijar Melayang */}
            <circle cx={cx - 14} cy={peakY - (isCompact ? 12 : 20)} r={isCompact ? 1.5 : 2.5} fill="#ef4444" />
            <circle cx={cx + 16} cy={peakY - (isCompact ? 14 : 22)} r={isCompact ? 1.5 : 2.5} fill="#f59e0b" />
            <circle cx={cx - 8} cy={peakY - (isCompact ? 20 : 32)} r={isCompact ? 1.2 : 2} fill="#fbbf24" />
            <circle cx={cx + 8} cy={peakY - (isCompact ? 22 : 34)} r={isCompact ? 1.5 : 2.5} fill="#ef4444" />

            {/* Kolosal Cauliflower Eruption Ash Cloud (Hitam Pekat Berlapis-lapis) */}
            {/* Ash Core Atas */}
            <circle cx={cx + 6} cy={peakY - (isCompact ? 34 : 52)} r={isCompact ? 14 : 23} fill="#1c1917" opacity="0.98" />
            <circle cx={cx - 8} cy={peakY - (isCompact ? 36 : 56)} r={isCompact ? 13 : 21} fill="#292524" opacity="0.98" />
            <circle cx={cx + 16} cy={peakY - (isCompact ? 32 : 50)} r={isCompact ? 12 : 19} fill="#44403c" opacity="0.95" />
            <circle cx={cx - 18} cy={peakY - (isCompact ? 30 : 48)} r={isCompact ? 11 : 18} fill="#292524" opacity="0.95" />
            {/* Ash Crown Puncak */}
            <circle cx={cx} cy={peakY - (isCompact ? 48 : 74)} r={isCompact ? 15 : 25} fill="#292524" opacity="0.98" />
            <circle cx={cx - 12} cy={peakY - (isCompact ? 46 : 70)} r={isCompact ? 13 : 22} fill="#1c1917" opacity="0.98" />
            <circle cx={cx + 14} cy={peakY - (isCompact ? 47 : 72)} r={isCompact ? 13 : 21} fill="#44403c" opacity="0.95" />
            <circle cx={cx + 2} cy={peakY - (isCompact ? 58 : 88)} r={isCompact ? 12 : 20} fill="#57534e" opacity="0.9" />
          </g>
        )}

        {/* 3. TUBUH KERUCUT GUNUNG STRATOVOLCANO DENGAN FAKET SHADING REALISTIS */}
        {/* Lereng Barat / Sisi Terang (Light Slate Blue) */}
        <path
          d={`M ${cx - (isCompact ? 48 : 78)} ${mountainBaseY}
              L ${cx - (isCompact ? 12 : 20)} ${peakY + (isCompact ? 2 : 3)}
              L ${cx} ${peakY}
              L ${cx} ${mountainBaseY}
              Z`}
          fill={`url(#mtn-light-${lvl})`}
        />
        {/* Lereng Timur / Sisi Bayangan Tebing (Dark Slate) */}
        <path
          d={`M ${cx} ${peakY}
              L ${cx + (isCompact ? 14 : 22)} ${peakY + (isCompact ? 2 : 3)}
              L ${cx + (isCompact ? 48 : 78)} ${mountainBaseY}
              L ${cx} ${mountainBaseY}
              Z`}
          fill={`url(#mtn-dark-${lvl})`}
        />

        {/* Patahan Celah & Alur Lembah Vulkanik (Ridge & Ravines) */}
        <path
          d={`M ${cx} ${peakY}
              L ${cx - (isCompact ? 6 : 10)} ${mountainBaseY * 0.72}
              L ${cx - (isCompact ? 14 : 24)} ${mountainBaseY}`}
          stroke="#1e293b"
          strokeWidth={isCompact ? 1.5 : 2.5}
          fill="none"
        />
        <path
          d={`M ${cx + (isCompact ? 3 : 5)} ${peakY + 2}
              L ${cx + (isCompact ? 8 : 14)} ${mountainBaseY * 0.68}
              L ${cx + (isCompact ? 18 : 30)} ${mountainBaseY}`}
          stroke="#0f172a"
          strokeWidth={isCompact ? 1.5 : 2.5}
          fill="none"
        />
        <path
          d={`M ${cx - (isCompact ? 3 : 5)} ${peakY + 2}
              L ${cx - (isCompact ? 18 : 30)} ${mountainBaseY * 0.8}
              L ${cx - (isCompact ? 28 : 46)} ${mountainBaseY}`}
          stroke="#1e293b"
          strokeWidth={isCompact ? 1 : 1.5}
          fill="none"
        />

        {/* ALIRAN MAGMA / LELEHAN LAVA PIJAR PADA STATUS SIAGA & AWAS */}
        {lvl === 3 && (
          // Rekahan lava kawah menyala pada status Siaga
          <g>
            <path d={`M ${cx - 2} ${peakY} L ${cx - 5} ${peakY + (isCompact ? 8 : 14)}`} stroke="#f97316" strokeWidth={isCompact ? 1.5 : 2.5} fill="none" strokeLinecap="round" />
            <path d={`M ${cx + 1} ${peakY} L ${cx + 4} ${peakY + (isCompact ? 6 : 10)}`} stroke="#fbbf24" strokeWidth={isCompact ? 1.2 : 2} fill="none" strokeLinecap="round" />
          </g>
        )}

        {lvl === 4 && (
          // Lelehan lava pijar menyala merah-emas menuruni lembah pada status Awas (Persis SS 2)
          <g>
            {/* Aliran Lava Utama 1 (Tengah) */}
            <path
              d={`M ${cx} ${peakY} 
                  L ${cx - (isCompact ? 4 : 7)} ${mountainBaseY * 0.65} 
                  L ${cx - (isCompact ? 8 : 14)} ${mountainBaseY * 0.82} 
                  L ${cx - (isCompact ? 12 : 20)} ${mountainBaseY}`}
              stroke="url(#lavaGrad)"
              strokeWidth={isCompact ? 2.5 : 4}
              fill="none"
              strokeLinecap="round"
            />
            {/* Aliran Lava Cabang 2 (Kanan) */}
            <path
              d={`M ${cx + 3} ${peakY + 2} 
                  L ${cx + (isCompact ? 6 : 11)} ${mountainBaseY * 0.68} 
                  L ${cx + (isCompact ? 14 : 24)} ${mountainBaseY}`}
              stroke="#f97316"
              strokeWidth={isCompact ? 2 : 3}
              fill="none"
              strokeLinecap="round"
            />
            {/* Aliran Lava Cabang 3 (Kiri) */}
            <path
              d={`M ${cx - 3} ${peakY + 2} 
                  L ${cx - (isCompact ? 12 : 20)} ${mountainBaseY * 0.75} 
                  L ${cx - (isCompact ? 22 : 36)} ${mountainBaseY}`}
              stroke="#ea580c"
              strokeWidth={isCompact ? 1.8 : 2.8}
              fill="none"
              strokeLinecap="round"
            />
            {/* Kubah Kawah Membara */}
            <ellipse cx={cx} cy={peakY} rx={isCompact ? 6 : 10} ry={isCompact ? 2.5 : 4} fill="#fef08a" />
          </g>
        )}

        {/* 4. RUMPUN HUTAN HIJAU RIMBUN DI DASAR LERENG (LUSH BASE FOREST SKIRT) */}
        {/* Barisan kanopi pohon hijau melingkar di kaki gunung persis SS 2 */}
        <g>
          {/* Lapisan Pohon Hijau Tua (Belakang) */}
          <ellipse cx={cx - (isCompact ? 40 : 65)} cy={mountainBaseY + 2} rx={isCompact ? 12 : 18} ry={isCompact ? 7 : 10} fill="#14532d" />
          <ellipse cx={cx - (isCompact ? 22 : 36)} cy={mountainBaseY} rx={isCompact ? 14 : 22} ry={isCompact ? 8 : 12} fill="#166534" />
          <ellipse cx={cx} cy={mountainBaseY} rx={isCompact ? 16 : 24} ry={isCompact ? 8 : 13} fill="#15803d" />
          <ellipse cx={cx + (isCompact ? 22 : 36)} cy={mountainBaseY} rx={isCompact ? 14 : 22} ry={isCompact ? 8 : 12} fill="#166534" />
          <ellipse cx={cx + (isCompact ? 40 : 65)} cy={mountainBaseY + 2} rx={isCompact ? 12 : 18} ry={isCompact ? 7 : 10} fill="#14532d" />

          {/* Lapisan Pohon Hijau Terang (Depan) */}
          <ellipse cx={cx - (isCompact ? 32 : 52)} cy={mountainBaseY + 6} rx={isCompact ? 11 : 17} ry={isCompact ? 6 : 9} fill="#16a34a" />
          <ellipse cx={cx - (isCompact ? 12 : 20)} cy={mountainBaseY + 5} rx={isCompact ? 13 : 20} ry={isCompact ? 7 : 11} fill="#22c55e" />
          <ellipse cx={cx + (isCompact ? 12 : 20)} cy={mountainBaseY + 5} rx={isCompact ? 13 : 20} ry={isCompact ? 7 : 11} fill="#22c55e" />
          <ellipse cx={cx + (isCompact ? 32 : 52)} cy={mountainBaseY + 6} rx={isCompact ? 11 : 17} ry={isCompact ? 6 : 9} fill="#16a34a" />
        </g>
      </svg>
    );
  };

  const currentLevelData = typeof activeLevel === 'number' ? levels.find((l) => l.lvl === activeLevel)! : levels[3];

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 font-pixel">
      {/* Top Banner Header */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 border-b border-slate-800 shrink-0">
        <span className="text-[13px] sm:text-[15px] font-pixel-title text-rose-400 font-bold flex items-center gap-1.5">
          <PixelIcon name="volcano" size={14} />
          4 TINGKAT STATUS AKTIVITAS GUNUNG API PVMBG &amp; KRB
        </span>
        <span className="text-[13.5px] sm:text-[13px] text-slate-400 font-pixel font-semibold">
          STANDAR RESMI PVMBG / KESDM
        </span>
      </div>

      {/* Main Interactive Illustration Area */}
      <div className="w-full flex-1 flex items-center justify-center p-1.5 overflow-hidden">
        {activeLevel === 'all' ? (
          /* TAMPILAN LENGKAP 4 TINGKAT SEPERTI DI SCREENSHOT 2 (VERTICALLY / HORIZONTALLY STACKED) */
          <div className="w-full h-full grid grid-cols-2 sm:grid-cols-4 gap-2 p-1">
            {levels.map((l) => (
              <div
                key={l.lvl}
                {...sifatTombol(
                  () => {
                    retroAudio.playSelect();
                    setActiveLevel(l.lvl);
                  },
                  `Lihat materi tingkat ${l.lvl} ${l.shortName}`,
                )}
                onClick={() => {
                  retroAudio.playSelect();
                  setActiveLevel(l.lvl);
                }}
                className="bg-slate-900/90 border-2 rounded-xl p-2.5 flex flex-col items-center justify-between cursor-pointer hover:scale-[1.02] transition-transform shadow-lg group relative overflow-hidden"
                style={{ borderColor: l.color }}
              >
                {/* Header Badge */}
                <div
                  className="w-full py-1.5 px-1.5 rounded-md text-slate-950 font-bold text-[13px] sm:text-[14px] font-pixel-title text-center mb-1"
                  style={{ backgroundColor: l.color }}
                >
                  LV.{l.lvl} {l.shortName}
                </div>

                {/* Vektor Gunung Berapi Sesuai SS 2 */}
                <div className="w-full flex-1 flex items-center justify-center my-1 max-h-[140px]">
                  {renderVolcanoArtwork(l.lvl, true)}
                </div>

                {/* Keterangan Karakteristik Visual */}
                <div className="w-full bg-slate-950/80 rounded-md p-1.5 border border-slate-800 text-center">
                  <p className="text-[15.5px] sm:text-[15px] text-slate-100 leading-snug font-sans font-medium line-clamp-3">
                    {l.visualFeature}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* TAMPILAN FOKUS DETAIL LEVEL TERTENTU (HERO VIEW) */
          <div className="w-full h-full flex flex-col md:flex-row items-center justify-between gap-3 p-2 bg-slate-950/70 rounded-xl border border-slate-800">
            {/* Kiri: Artwork Vektor Resolusi Tinggi Gunung Berapi */}
            <div className="w-full md:w-1/2 h-[180px] md:h-full flex items-center justify-center p-2 relative bg-slate-900/50 rounded-lg border border-slate-800/80">
              {renderVolcanoArtwork(activeLevel as 1 | 2 | 3 | 4, false)}
            </div>

            {/* Kanan: Panel Fakta Edukasi & Rekomendasi Resmi PVMBG */}
            <div className="w-full md:w-1/2 h-full flex flex-col justify-between p-2 font-pixel">
              <div>
                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-3.5 py-1.5 rounded-md text-base sm:text-lg font-bold font-pixel-title text-slate-950 shadow-sm"
                    style={{ backgroundColor: currentLevelData.color }}
                  >
                    {currentLevelData.name}
                  </span>
                </div>

                {/* Deskripsi Sains Resmi (Font Besar, Kontras Tinggi & Sangat Mudah Dibaca) */}
                <p className="text-[17px] sm:text-[19px] md:text-[20px] text-slate-100 leading-relaxed mb-3.5 font-sans font-semibold">
                  {currentLevelData.desc}
                </p>

                {/* Gejala Visual Spesifik */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <PixelIcon name="bulb" size={15} className="text-amber-400" />
                    <span className="text-[15px] sm:text-[17px] font-bold text-amber-300 font-pixel-title">
                      KARAKTERISTIK VISUAL:
                    </span>
                  </div>
                  <p className="text-[16px] sm:text-[17.5px] text-slate-100 leading-relaxed font-sans font-medium">
                    {currentLevelData.visualFeature}
                  </p>
                </div>
              </div>

              {/* Radius Bahaya & Tindakan Warga */}
              <div
                className="w-full py-3 px-3.5 rounded-lg border flex items-center justify-between bg-slate-900/90 shrink-0"
                style={{ borderColor: currentLevelData.border }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: currentLevelData.color }}>
                    <PixelIcon name="shield" size={17} />
                  </span>
                  <span className="text-[15px] sm:text-base font-bold text-slate-100 font-sans">
                    ZONA BAHAYA:
                  </span>
                </div>
                <span className="text-[15px] sm:text-base font-bold font-sans" style={{ color: currentLevelData.color }}>
                  {currentLevelData.radius}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4 Status Buttons Selector + Toggle Semua Level */}
      <div className="w-full grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-1.5 pt-1 shrink-0">
        {levels.map((l) => (
          <button
            key={l.lvl}
            onClick={() => {
              retroAudio.playSelect();
              setActiveLevel(l.lvl);
            }}
            className={`px-1.5 py-2.5 rounded-lg border-2 text-[13.5px] sm:text-[13px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 text-center ${activeLevel === l.lvl
              ? 'text-slate-950 font-bold scale-[1.02] shadow-sm'
              : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
            style={{
              backgroundColor: activeLevel === l.lvl ? l.color : undefined,
              borderColor: activeLevel === l.lvl ? l.border : undefined,
            }}
          >
            LV.{l.lvl} {l.shortName}
          </button>
        ))}
        <button
          onClick={() => {
            retroAudio.playSelect();
            setActiveLevel('all');
          }}
          className={`px-1.5 py-2.5 rounded-lg border-2 text-[13.5px] sm:text-[13px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 text-center ${activeLevel === 'all'
            ? 'bg-sky-400 text-slate-950 border-sky-300 font-bold scale-[1.02]'
            : 'bg-slate-800 text-sky-300 border-slate-700 hover:border-sky-400'
            }`}
        >
          SEMUA LEVEL
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: PETA ZONASI KRB MERAPI & PROTOKOL APD (AREA 4 TEMUAN 2)
// Sesuai Arahan Pengguna:
// - 4 Tab: APD, Awan Panas, Lahar Hujan, dan Zonasi KRB Merapi
// - Gambar kiri disesuaikan dengan materi:
//   * Tab APD: Ilustrasi Masker N95, Kacamata Goggle, dan Baju Panjang
//   * Tab Awan Panas: Ilustrasi Gunung Merapi & Wedhus Gembel bergulung
//   * Tab Lahar Hujan: Ilustrasi Alur Lembah Sungai Lahar & Sirine EWS
//   * Tab Zonasi KRB: Peta Resmi Merapi '1.webp' secara statis permanen
// - Gambar kiri dapat diklik untuk membuka modal tampilan penuh (lightbox fullscreen)
// - Panel materi di sebelah kanan dapat di-scroll (overflow-y-auto) dengan rapi
// ═════════════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════════════
// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: PETA ZONASI KRB MERAPI & PROTOKOL APD (AREA 4 TEMUAN 2)
// Sesuai Arahan Pengguna:
// - 4 Tab: APD, Awan Panas, Lahar Hujan, dan Zonasi KRB Merapi
// - Gambar kiri disesuaikan dengan materi:
//   * Tab APD: Ilustrasi Masker N95, Kacamata Goggle, dan Baju Panjang
//   * Tab Awan Panas: Ilustrasi Gunung Merapi & Wedhus Gembel bergulung
//   * Tab Lahar Hujan: Ilustrasi Alur Lembah Sungai Lahar & Sirine EWS
//   * Tab Zonasi KRB: Peta Resmi Merapi '1.webp' secara statis permanen
// - Gambar kiri dapat diklik untuk membuka modal tampilan penuh (lightbox fullscreen)
// - Panel materi di sebelah kanan dapat di-scroll (overflow-y-auto) dengan rapi
// ═════════════════════════════════════════════════════════════════════════════
export function VolcanoResponseIllustration() {
  const [activeTab, setActiveTab] = useState<'apd' | 'awanpanas' | 'lahar' | 'krb'>('apd');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const tabData = {
    apd: {
      title: 'ALAT PELINDUNG DIRI (APD)',
      subtitle: 'Standar Perlindungan Diri Menghadapi Hujan Abu Merapi',
      badge: '1. APD MASKER & BAJU',
      color: '#0ea5e9',
      border: '#bae6fd',
      bgHeader: 'bg-sky-950/90',
      borderHeader: 'border-sky-500',
      titleColor: 'text-sky-300',
      points: [
        {
          title: '• MASKER N95 / PARTIKULAT:',
          desc: 'Abu vulkanik Merapi terdiri dari pecahan kristal silika mikroskopis yang tajam menyerupai serpihan kaca. Wajib gunakan Masker N95 untuk menyaring minimal 95% partikel berukuran < 2.5 µm agar tidak masuk ke alveolus paru-paru (mencegah ISPA akut & silikosis).',
        },
        {
          title: '• KACAMATA GOGGLE RAPAT:',
          desc: 'Gunakan kacamata pelindung tertutup (goggle) yang menutup rapat rongga mata dari debu abrasif. DILARANG KERAS memakai lensa kontak dan DILARANG mengucek mata karena gesekan abu silika dapat merobek kornea mata!',
        },
        {
          title: '• BAJU LENGAN PANJANG & SEPATU:',
          desc: 'Kenakan pakaian tertutup rapat (baju lengan panjang, celana panjang, topi, dan sepatu) untuk melindungi pori-pori kulit dari iritasi kimiawi sulfur serta luka bakar abu panas.',
        },
      ],
      actionLabel: 'TINDAKAN DARURAT HUJAN ABU:',
      actionText:
        'Bilas mata dengan air bersih mengalir jika terkena abu. Tutup rapat tempat penampungan air dan wadah makanan!',
    },
    awanpanas: {
      title: 'AWAN PANAS GUGURAN (WEDHUS GEMBEL)',
      subtitle: 'Pyroclastic Density Current (PDC) — Bahaya Primer Letusan',
      badge: '2. BAHAYA AWAN PANAS',
      color: '#f43f5e',
      border: '#fda4af',
      bgHeader: 'bg-rose-950/90',
      borderHeader: 'border-rose-500',
      titleColor: 'text-rose-300',
      points: [
        {
          title: '• PENYEBAB UTAMA:',
          desc: 'Runtuhnya kubah lava aktif di puncak atau letusan eksplosif yang ambruk meluncur kencang menuruni lereng Merapi mengikuti alur lembah sungai.',
        },
        {
          title: '• KARAKTERISTIK MEMATIKAN:',
          desc: 'Suhu ekstrem mencapai 300°C - 800°C dengan kecepatan luncur 100 - 300 km/jam. Membawa campuran gas beracun, abu pekat, dan bongkahan batu pijar yang mematikan segala makhluk hidup di jalurnya.',
        },
        {
          title: '• ATURAN KESELAMATAN MUTLAK:',
          desc: 'Tidak ada masker atau pakaian yang dapat menahan terpaan awan panas! Satu-satunya cara selamat adalah evakuasi sebelum awan panas meluncur saat status Siaga/Awas diumumkan oleh PVMBG.',
        },
      ],
      actionLabel: 'PRIORITAS EVAKUASI:',
      actionText:
        'Tinggalkan seluruh zona KRB III seketika dan ikuti arahan relawan menuju barak pengungsian resmi di dataran rendah!',
      sourceUrl: 'https://lifestyle.kompas.com/read/2010/10/29/22092982/kecil-peluang-erupsi-merapi-eksplosif',
      sourceText: 'Dokumentasi Erupsi Merapi (Kompas.com)',
      sourceShort: 'Kompas.com',
    },
    lahar: {
      title: 'BANJIR LAHAR HUJAN (LAHAR DINGIN)',
      subtitle: 'Sediment Gravity Flow — Bahaya Sekunder Pasca-Erupsi',
      badge: '3. ANCAMAN LAHAR HUJAN',
      color: '#38bdf8',
      border: '#7dd3fc',
      bgHeader: 'bg-blue-950/90',
      borderHeader: 'border-blue-500',
      titleColor: 'text-blue-300',
      points: [
        {
          title: '• MEKANISME LAHAR HUJAN:',
          desc: 'Jutaan meter kubik material endapan abu, pasir, dan batu besar di puncak Merapi tersapu oleh curah hujan lebat di hulu, bercampur menjadi bubur lumpur pekat dengan massa jenis tinggi.',
        },
        {
          title: '• ANCAMAN BANTARAN SUNGAI:',
          desc: 'Lahar menerjang alur sungai (Kali Gendol, Krasak, Boyong, Bebeng, Woro) dengan kecepatan 40 - 60 km/jam, mampu mengikis tebing, menjebol sabo dam, dan menghancurkan jembatan.',
        },
        {
          title: '• SIRINE SISTEM PERINGATAN DINI (EWS):',
          desc: 'Sensor getaran telemetri di hulu akan membunyikan sirine EWS otomatis di sepanjang bantaran sungai saat lahar melintas. Jika sirine berbunyi, segera lari ke tempat tinggi!',
        },
      ],
      actionLabel: 'PROTOKOL BANTARAN SUNGAI:',
      actionText:
        'DILARANG menonton lahar di atas jembatan! Jauhi sempadan dan tebing sungai minimal 300 - 500 meter saat mendung di hulu!',
      sourceUrl: 'https://news.detik.com/berita/d-7301571/4-fakta-banjir-lahar-dingin-semeru-yang-tewaskan-3-orang',
      sourceText: 'Dokumentasi Banjir Lahar Dingin (Detikcom)',
      sourceShort: 'Detikcom',
    },
    krb: {
      title: 'PETA KAWASAN RAWAN BENCANA (KRB)',
      subtitle: 'Standar Zonasi Kerentanan & Bahaya Resmi PVMBG & BNPB',
      badge: '4. ZONASI KRB MERAPI',
      color: '#facc15',
      border: '#fef08a',
      bgHeader: 'bg-amber-950/90',
      borderHeader: 'border-amber-500',
      titleColor: 'text-amber-300',
      points: [
        {
          title: '• KRB III (ZONA MERAH - LERENG ATAS 0-10 KM):',
          desc: 'Sangat sering terlanda awan panas wedhus gembel, aliran lava, dan lontaran batu pijar. Merupakan ZONA LARANGAN HUNIAN TETAP. Wajib evakuasi total seketika saat status Siaga/Awas.',
        },
        {
          title: '• KRB II (ZONA KUNING - LERENG TENGAH):',
          desc: 'Berpotensi terlanda awan panas guguran berskala besar, lontaran batu pijar, dan hujan abu lebat. Warga wajib siaga evakuasi mandiri dan menyiapkan Tas Siaga Bencana.',
        },
        {
          title: '• KRB I (ZONA HIJAU - LEMBAH & SUNGAI):',
          desc: 'Kawasan di sepanjang sempadan sungai yang rawan terjang banjir lahar hujan dan perluasan luapan air. Jaga jarak aman minimal 300 meter dari sungai saat hujan di puncak.',
        },
      ],
      actionLabel: 'PEDOMAN TANGGAP ZONA:',
      actionText:
        'Kenali status zona tempat tinggalmu pada peta resmi dan selalu patuhi rambu serta radius aman PVMBG!',
      sourceUrl: 'https://syawal88.wordpress.com/2010/11/17/dapatkah-gunung-mati-menjadi-gunung-aktif/',
      sourceText: 'Peta Kawasan Rawan Bencana Merapi (syawal88.wordpress.com)',
      sourceShort: 'syawal88.wordpress.com',
    },
  };

  const currentTab = tabData[activeTab];

  // Helper untuk merender visual (baik di dalam preview maupun di modal fullscreen)
  const renderVisualContent = (tabKey: 'apd' | 'awanpanas' | 'lahar' | 'krb', isExpanded: boolean = false) => {
    switch (tabKey) {
      case 'apd':
        return (
          <svg viewBox="0 0 520 340" className="w-full h-full object-cover" shapeRendering="geometricPrecision">
            <rect x="0" y="0" width="520" height="340" fill="#090d16" />
            <rect x="15" y="14" width="490" height="28" rx="6" fill="#0369a1" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="260" y="32" textAnchor="middle" fill="#7dd3fc" fontSize="11" fontWeight="bold" fontFamily="monospace">
              STANDAR APD WAJIB: PARTIKEL ABU SILIKA MERAPI
            </text>

            {/* 1. MASKER N95 */}
            <g transform="translate(15, 52)">
              <rect x="0" y="0" width="154" height="274" rx="8" fill="#18181b" stroke="#0ea5e9" strokeWidth="2" />
              <rect x="0" y="0" width="154" height="28" rx="8" fill="#0284c7" />
              <text x="77" y="19" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">
                1. MASKER N95
              </text>
              <ellipse cx="77" cy="95" rx="46" ry="34" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2.5" />
              <path d="M 48,78 Q 77,72 106,78" stroke="#ca8a04" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <line x1="33" y1="95" x2="6" y2="85" stroke="#facc15" strokeWidth="2.5" />
              <line x1="121" y1="95" x2="148" y2="85" stroke="#facc15" strokeWidth="2.5" />
              <line x1="33" y1="105" x2="6" y2="115" stroke="#facc15" strokeWidth="2.5" />
              <line x1="121" y1="105" x2="148" y2="115" stroke="#facc15" strokeWidth="2.5" />
              <text x="77" y="118" textAnchor="middle" fill="#0284c7" fontSize="10" fontWeight="bold">N95 FILTER</text>
              <foreignObject x="8" y="152" width="138" height="114">
                <p className="text-[14.5px] sm:text-[13px] text-slate-200 leading-snug font-sans text-center font-semibold">
                  Menyaring <strong className="text-sky-300 font-bold">&ge; 95%</strong> partikel kristal silika tajam &lt; 2.5 µm pencegah silikosis &amp; ISPA akut.
                </p>
              </foreignObject>
            </g>

            {/* 2. KACAMATA GOGGLE */}
            <g transform="translate(183, 52)">
              <rect x="0" y="0" width="154" height="274" rx="8" fill="#18181b" stroke="#f59e0b" strokeWidth="2" />
              <rect x="0" y="0" width="154" height="28" rx="8" fill="#d97706" />
              <text x="77" y="19" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">
                2. KACAMATA GOGGLE
              </text>
              <rect x="22" y="76" width="50" height="36" rx="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />
              <rect x="82" y="76" width="50" height="36" rx="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />
              <line x1="72" y1="94" x2="82" y2="94" stroke="#0284c7" strokeWidth="4" />
              <line x1="22" y1="94" x2="6" y2="94" stroke="#475569" strokeWidth="3.5" />
              <line x1="132" y1="94" x2="148" y2="94" stroke="#475569" strokeWidth="3.5" />
              <circle cx="47" cy="94" r="6" fill="#ffffff" opacity="0.6" />
              <circle cx="107" cy="94" r="6" fill="#ffffff" opacity="0.6" />
              <foreignObject x="8" y="152" width="138" height="114">
                <p className="text-[14.5px] sm:text-[13px] text-slate-200 leading-snug font-sans text-center font-semibold">
                  Menutup rapat rongga mata. <strong className="text-rose-400 font-bold">Dilarang lensa kontak &amp; kucek mata</strong> karena abu adalah serpihan kaca!
                </p>
              </foreignObject>
            </g>

            {/* 3. PAKAIAN TERTUTUP */}
            <g transform="translate(351, 52)">
              <rect x="0" y="0" width="154" height="274" rx="8" fill="#18181b" stroke="#10b981" strokeWidth="2" />
              <rect x="0" y="0" width="154" height="28" rx="8" fill="#059669" />
              <text x="77" y="19" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">
                3. PAKAIAN TERTUTUP
              </text>
              <path d="M 44,70 L 77,64 L 110,70 L 128,98 L 110,106 L 100,90 L 100,124 L 54,124 L 54,90 L 44,106 L 26,98 Z" fill="#047857" stroke="#34d399" strokeWidth="2" />
              <line x1="77" y1="64" x2="77" y2="124" stroke="#a7f3d0" strokeWidth="2.5" />
              <line x1="54" y1="104" x2="100" y2="104" stroke="#facc15" strokeWidth="2.5" />
              <foreignObject x="8" y="152" width="138" height="114">
                <p className="text-[14.5px] sm:text-[13px] text-slate-200 leading-snug font-sans text-center font-semibold">
                  Baju lengan panjang, celana panjang, topi &amp; sepatu tertutup pelindung iritasi sulfur &amp; luka panas.
                </p>
              </foreignObject>
            </g>
          </svg>
        );

      case 'awanpanas':
        return (
          <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-slate-950">
            <img
              src="/wedhus_gembel.jpg"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.tried) {
                  target.dataset.tried = '1';
                  target.src = '/images (1).jpeg';
                }
              }}
              alt="Awan Panas Guguran (Wedhus Gembel) Gunung Merapi Asli"
              className={`w-full h-full object-cover rounded-none ${isExpanded ? 'max-h-[75vh]' : ''}`}
            />
            {!isExpanded && (
              <div className="absolute top-2.5 left-2.5 px-3 py-1.5 rounded-md bg-slate-950/90 backdrop-blur-sm border border-rose-500 text-rose-300 text-[14.5px] sm:text-[13px] font-pixel-title font-bold flex items-center gap-1.5 shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span>● AWAN PANAS GUGURAN (WEDHUS GEMBEL)</span>
              </div>
            )}
            <a
              href="https://lifestyle.kompas.com/read/2010/10/29/22092982/kecil-peluang-erupsi-merapi-eksplosif"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-slate-950/90 backdrop-blur-sm border border-rose-500/80 hover:border-rose-400 text-rose-300 hover:text-rose-200 text-[13.5px] font-sans font-bold flex items-center gap-1.5 shadow-lg transition-all z-10 cursor-pointer hover:bg-slate-900"
              title="Buka sumber dokumentasi: Kompas.com"
            >
              <span>Sumber: Kompas.com ↗</span>
            </a>
          </div>
        );

      case 'lahar':
        return (
          <div className="w-full h-full flex items-center justify-center relative">
            <img
              src="/lahar_dingin.jpg"
              alt="Banjir Lahar Hujan Dingin Kali Gendol & Woro Merapi"
              className={`w-full h-full object-cover rounded-none ${isExpanded ? 'max-h-[75vh]' : ''}`}
            />
            {!isExpanded && (
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-slate-950/90 backdrop-blur-sm border border-sky-400 text-sky-300 text-[13.5px] font-sans font-bold flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                <span>● ALIRAN LAHAR HUJAN DINGIN (ALUR SUNGAI)</span>
              </div>
            )}
            <a
              href="https://news.detik.com/berita/d-7301571/4-fakta-banjir-lahar-dingin-semeru-yang-tewaskan-3-orang"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-slate-950/90 backdrop-blur-sm border border-sky-400/80 hover:border-sky-300 text-sky-300 hover:text-sky-200 text-[13.5px] font-sans font-bold flex items-center gap-1.5 shadow-lg transition-all z-10 cursor-pointer hover:bg-slate-900"
              title="Buka sumber dokumentasi: Detikcom"
            >
              <span>Sumber: Detikcom ↗</span>
            </a>
          </div>
        );

      case 'krb':
        return (
          <div className="w-full h-full flex items-center justify-center relative">
            <img
              src="/1.webp"
              alt="Peta Kawasan Rawan Bencana (KRB) Merapi Resmi"
              className={`w-full h-full object-contain ${isExpanded ? 'max-h-[75vh]' : ''}`}
            />
            {!isExpanded && (
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-slate-950/90 backdrop-blur-sm border border-amber-400 text-amber-300 text-[13.5px] font-pixel-title font-bold flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>● PETA KRB MERAPI (III, II, I)</span>
              </div>
            )}
            <a
              href="https://syawal88.wordpress.com/2010/11/17/dapatkah-gunung-mati-menjadi-gunung-aktif/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-slate-950/90 backdrop-blur-sm border border-amber-400/80 hover:border-amber-300 text-amber-300 hover:text-amber-200 text-[13.5px] font-sans font-bold flex items-center gap-1.5 shadow-lg transition-all z-10 cursor-pointer hover:bg-slate-900"
              title="Buka sumber rujukan peta: syawal88.wordpress.com"
            >
              <span>Sumber: syawal88.wordpress.com ↗</span>
            </a>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 font-pixel relative">
      {/* Main Content Area: Left Image/SVG & Right Scrollable Info Panel */}
      <div className="w-full flex-1 flex flex-col md:flex-row items-center justify-between gap-3 p-1.5 overflow-hidden">
        {/* Kolom Kiri: Visual Gambar / Ilustrasi Sesuai Materi Tab Aktif - Memenuhi Kotak Maksimal & Fullscreen */}
        <div
          {...sifatTombol(
            () => {
              retroAudio.playSelect();
              setIsFullscreen(true);
            },
            'Perbesar gambar ke tampilan penuh',
          )}
          onClick={() => {
            retroAudio.playSelect();
            setIsFullscreen(true);
          }}
          className="w-full md:w-3/5 h-[230px] md:h-full bg-slate-950 rounded-xl border-2 border-slate-700/80 p-0 flex items-center justify-center relative overflow-hidden shadow-inner group cursor-pointer hover:border-amber-400 transition-all"
          title="Klik gambar untuk melihat dalam tampilan penuh (fullscreen)"
        >
          {renderVisualContent(activeTab, false)}

          {/* Badge Tombol Klik Perbesar di Sudut Kanan Bawah */}
          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-slate-950/90 backdrop-blur-sm border border-slate-700 group-hover:border-amber-400 group-hover:text-amber-300 text-slate-300 text-[13px] font-pixel-title font-bold flex items-center gap-1.5 shadow-md transition-all">
            <PixelIcon name="search" size={11} />
            <span>KLIK UNTUK PERBESAR</span>
          </div>
        </div>

        {/* Kolom Kanan: Panel Sains Edukatif Sesuai Tab Terpilih - Font Lebih Besar & Mudah Dibaca */}
        <div className="w-full md:w-2/5 h-full flex flex-col overflow-hidden font-pixel">
          <div className="w-full h-full overflow-y-auto pr-1.5 custom-pixel-scroll space-y-2.5">
            {/* Header Kotak Judul */}
            <div className={`w-full py-2.5 px-3.5 ${currentTab.bgHeader} border-2 ${currentTab.borderHeader} rounded-xl shadow-sm`}>
              <span className={`text-base sm:text-lg md:text-xl ${currentTab.titleColor} font-bold font-pixel-title block leading-snug`}>
                {currentTab.title}
              </span>
              <span className="text-[13px] sm:text-[15px] text-slate-200 font-sans font-medium block mt-1">
                {currentTab.subtitle}
              </span>
            </div>

            {/* Daftar Poin Materi Edukasi */}
            <div className="space-y-2.5 text-slate-200">
              {currentTab.points.map((pt, idx) => (
                <div key={idx} className="bg-slate-900/95 border border-slate-800 rounded-lg p-3 shadow-sm">
                  <span className="font-bold font-pixel-title text-[17px] sm:text-[19px] block mb-1.5" style={{ color: currentTab.color }}>
                    {pt.title}
                  </span>
                  <p className="text-[17px] sm:text-[18px] leading-relaxed text-slate-100 font-medium font-sans">
                    {pt.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Kotak Tindakan / Arahan Keselamatan */}
            <div
              className="p-3 bg-slate-900/95 border-2 rounded-lg text-slate-100 mt-2.5 shadow-sm"
              style={{ borderColor: currentTab.color }}
            >
              <span className="font-bold text-[17px] sm:text-[19px] block mb-1 font-pixel-title" style={{ color: currentTab.color }}>
                {currentTab.actionLabel}
              </span>
              <p className="text-[16.5px] sm:text-[18px] leading-relaxed text-slate-100 font-medium font-sans">
                {currentTab.actionText}
              </p>
            </div>

            {/* Kotak Rujukan / Sumber Materi Edukasi */}
            {(currentTab as any).sourceUrl && (
              <div className="p-2.5 bg-slate-900/95 border border-slate-800 rounded-lg text-slate-200 mt-2 shadow-sm flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="text-amber-400 font-pixel text-[13px] font-bold shrink-0">SUMBER:</span>
                  <span className="text-[13px] text-slate-300 font-sans truncate font-semibold">
                    {(currentTab as any).sourceText}
                  </span>
                </div>
                <a
                  href={(currentTab as any).sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/80 text-amber-300 text-[14.5px] font-sans font-bold rounded flex items-center gap-1 shrink-0 transition-all cursor-pointer"
                  title={`Kunjungi rujukan sumber: ${(currentTab as any).sourceUrl}`}
                >
                  <span>Buka Tautan</span>
                  <span className="text-[13.5px] font-semibold">↗</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Switcher: 4 Tombol Pilihan Materi */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 shrink-0">
        <button
          onClick={() => {
            retroAudio.playSelect();
            setActiveTab('apd');
          }}
          className={`px-2.5 py-2.5 rounded-lg border-2 text-[14.5px] sm:text-[13px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 text-center ${activeTab === 'apd'
            ? 'bg-sky-500 text-slate-950 border-sky-200 font-bold shadow-md scale-[1.02]'
            : 'bg-slate-900 text-sky-300 border-slate-700 hover:border-sky-500'
            }`}
        >
          1. APD MASKER & BAJU
        </button>
        <button
          onClick={() => {
            retroAudio.playSelect();
            setActiveTab('awanpanas');
          }}
          className={`px-2.5 py-2.5 rounded-lg border-2 text-[14.5px] sm:text-[13px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 text-center ${activeTab === 'awanpanas'
            ? 'bg-rose-600 text-white border-rose-300 font-bold shadow-md scale-[1.02]'
            : 'bg-slate-900 text-rose-300 border-slate-700 hover:border-rose-500'
            }`}
        >
          2. BAHAYA AWAN PANAS
        </button>
        <button
          onClick={() => {
            retroAudio.playSelect();
            setActiveTab('lahar');
          }}
          className={`px-2.5 py-2.5 rounded-lg border-2 text-[14.5px] sm:text-[13px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 text-center ${activeTab === 'lahar'
            ? 'bg-blue-600 text-white border-blue-300 font-bold shadow-md scale-[1.02]'
            : 'bg-slate-900 text-blue-300 border-slate-700 hover:border-blue-500'
            }`}
        >
          3. ANCAMAN LAHAR HUJAN
        </button>
        <button
          onClick={() => {
            retroAudio.playSelect();
            setActiveTab('krb');
          }}
          className={`px-2.5 py-2.5 rounded-lg border-2 text-[14.5px] sm:text-[13px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 text-center ${activeTab === 'krb'
            ? 'bg-amber-500 text-slate-950 border-amber-200 font-bold shadow-md scale-[1.02]'
            : 'bg-slate-900 text-amber-300 border-slate-700 hover:border-amber-500'
            }`}
        >
          4. PETA ZONASI KRB
        </button>
      </div>

      {/* Lightbox Modal Fullscreen untuk Gambar/Visual */}
      {isFullscreen && (
        <div onKeyDown={tutupModalDenganKeyboard(() => setIsFullscreen(false))}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-fadeIn font-pixel"
          onClick={() => setIsFullscreen(false)}
        >
          <div onKeyDown={blokirRambatanTombol()}
            className="relative w-full max-w-5xl max-h-[92vh] bg-slate-950 border-3 border-amber-600/90 rounded-2xl p-3 sm:p-5 flex flex-col items-center shadow-[0_0_60px_rgba(0,0,0,0.95)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal Lightbox */}
            <div className="w-full flex items-center justify-between pb-3 mb-2 border-b-2 border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: currentTab.color }} />
                <h3 className="font-pixel-title text-[13px] sm:text-base md:text-lg text-amber-300 font-bold">
                  {currentTab.badge} — {currentTab.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  retroAudio.playSelect();
                  setIsFullscreen(false);
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-pixel-title text-[13px] sm:text-[15px] rounded-lg border-2 border-rose-300 shadow cursor-pointer transition-colors active:translate-y-0.5 font-semibold"
              >
                ✕ TUTUP [ESC]
              </button>
            </div>

            {/* Area Gambar / Visual Ukuran Besar */}
            <div className="w-full flex-1 min-h-0 flex items-center justify-center overflow-auto rounded-xl bg-slate-900/60 p-2">
              <div className="w-full h-full max-h-[76vh] flex items-center justify-center">
                {renderVisualContent(activeTab, true)}
              </div>
            </div>

            {/* Footer Petunjuk & Sumber Rujukan */}
            <div className="w-full pt-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[14.5px] text-slate-300 font-sans shrink-0 border-t border-slate-800/80 mt-1 font-semibold">
              <span className="text-slate-400">Klik tombol Tutup, tekan tombol [ESC], atau klik di luar kotak untuk kembali</span>
              {(currentTab as any).sourceUrl ? (
                <a
                  href={(currentTab as any).sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 hover:text-amber-200 underline font-medium flex items-center gap-1 shrink-0"
                >
                  <span className="font-pixel text-amber-400">Sumber Dokumentasi:</span>
                  <span>{(currentTab as any).sourceText}</span>
                  <span className="text-[13.5px] font-semibold">↗</span>
                </a>
              ) : (
                <span className="text-amber-400 font-pixel font-bold">RESQ-BOX KESIAPSIAGAAN MERAPI</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: PROSEDUR KESELAMATAN & MEDIS PASCABENCANA (AREA 3 MODUL 1)
// Diselaraskan 100% dengan Buku Saku BNPB: Waspada Susulan, Utilitas, P3K, & Tandu
// ═════════════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN 15: PASCABENCANA ERUPSI — PENANGANAN ABU VULKANIK & ATAP (BNPB)
// ═════════════════════════════════════════════════════════════════════════════
export function VolcanoPostAshIllustration() {
  const [activeTab, setActiveTab] = useState<'atap' | 'kendaraan' | 'apd'>('atap');

  const tabDetails = {
    atap: {
      title: 'PEMBERSIHAN TIMBUNAN ABU DI ATAP RUMAH',
      badge: 'STANDAR BNPB — CEGAH ATAP AMBRUK',
      color: '#ea580c',
      desc: 'Buku Saku BNPB menegaskan: Bersihkan atap rumah dari timbunan debu vulkanik tebal secara gotong royong! Endapan abu basah memiliki massa jenis sangat tinggi (>1.500 kg/m³), sehingga beratnya berisiko merobohkan kuda-kuda dan merusak atap bangunan.',
    },
    kendaraan: {
      title: 'LARANGAN BERKENDARA DI JALANAN BERABU',
      badge: 'KESELAMATAN JALAN & MESIN',
      color: '#eab308',
      desc: 'Hindari mengendarai motor atau mobil di kawasan hujan abu vulkanik. Abu bersifat abrasif tajam yang membuat ban kehilangan cengkeraman (sangat licin), serta butiran silika debu akan tersedot menyumbat saringan udara dan merusak piston mesin.',
    },
    apd: {
      title: 'PAKAIAN TERTUTUP & ALAT PELINDUNG DIRI (APD)',
      badge: 'PROTEKSI KULIT & TUBUH',
      color: '#10b981',
      desc: 'Saat membersihkan abu di sekitar pekarangan, selalu kenakan baju lengan panjang, celana panjang, topi pelindung, sarung tangan, dan masker. Hal ini penting guna mencegah iritasi kulit akibat zat asam belerang dan partikel mikro tajam.',
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 font-pixel">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 border-b border-slate-800">
        <span className="text-[13px] sm:text-[15px] font-pixel-title text-amber-400 font-bold flex items-center gap-1.5">
          <PixelIcon name="shield" size={14} />
          PENANGANAN ABU VULKANIK &amp; PERLINDUNGAN ATAP
        </span>
        <span className="text-[13.5px] sm:text-[13px] text-slate-400 font-pixel font-semibold">
          STANDAR RESMI BNPB
        </span>
      </div>

      {/* SVG Canvas Area */}
      <div className="w-full flex-1 flex items-center justify-center p-2">
        <svg viewBox="0 0 540 220" className="w-full h-full object-contain" shapeRendering="crispEdges">
          <rect x="0" y="0" width="540" height="220" fill="#0b0f19" />
          <rect x="0" y="0" width="540" height="170" fill="#0f172a" />
          <line x1="0" y1="170" x2="540" y2="170" stroke="#1e293b" strokeWidth="2" />
          <rect x="0" y="170" width="540" height="50" fill="#1e293b" />

          {/* TAB 1: PEMBERSIHAN ATAP RUMAH */}
          {activeTab === 'atap' && (
            <g transform="translate(20, 15)">
              {/* Dinding Rumah Warga */}
              <rect x="60" y="85" width="160" height="85" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
              <rect x="120" y="115" width="35" height="55" fill="#78350f" />
              <rect x="80" y="105" width="25" height="25" fill="#38bdf8" stroke="#1e293b" strokeWidth="1.5" />
              <rect x="175" y="105" width="25" height="25" fill="#38bdf8" stroke="#1e293b" strokeWidth="1.5" />
              {/* Atap Genteng Segitiga */}
              <polygon points="40,85 140,25 240,85" fill="#b91c1c" stroke="#451a03" strokeWidth="2" />
              {/* Lapisan Endapan Abu Vulkanik Tebal di Atap */}
              <polygon points="42,83 140,27 238,83 234,74 140,19 46,74" fill="#64748b" />
              <rect x="65" y="48" width="150" height="8" fill="#475569" rx="2" />

              {/* Tangga Bambu & Warga Membersihkan Abu */}
              <line x1="225" y1="170" x2="195" y2="55" stroke="#d97706" strokeWidth="3" />
              <line x1="233" y1="170" x2="203" y2="55" stroke="#d97706" strokeWidth="3" />
              {[70, 90, 110, 130, 150].map((stepY) => (
                <line key={stepY} x1={225 - (170 - stepY) * 0.25} y1={stepY} x2={233 - (170 - stepY) * 0.25} y2={stepY} stroke="#b45309" strokeWidth="2" />
              ))}
              {/* Figur Relawan di Tangga */}
              <circle cx="198" cy="45" r="7" fill="#fed7aa" />
              <rect x="194" y="38" width="8" height="4" fill="#facc15" />
              <rect x="194" y="52" width="9" height="18" fill="#ea580c" />
              <line x1="185" y1="48" x2="160" y2="35" stroke="#94a3b8" strokeWidth="2" />
              <rect x="154" y="30" width="8" height="10" fill="#475569" transform="rotate(-20 158 35)" />

              {/* Panel Indikator Tekanan Beban Abu */}
              <g transform="translate(270, 20)">
                <rect x="0" y="0" width="220" height="140" rx="8" fill="#0f172a" stroke="#ea580c" strokeWidth="2" />
                <rect x="10" y="10" width="200" height="24" rx="4" fill="#c2410c" />
                <text x="110" y="26" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">
                  BEBAN ATAP BERAT
                </text>
                <text x="15" y="55" fill="#f8fafc" fontSize="9">
                  • Abu Kering : ~1.000 kg/m³
                </text>
                <text x="15" y="73" fill="#f87171" fontSize="9" fontWeight="bold">
                  • Abu Basah Hujan : &gt;1.500 kg/m³!
                </text>
                <rect x="15" y="85" width="190" height="18" fill="#450a0a" stroke="#dc2626" strokeWidth="1" rx="3" />
                <text x="110" y="97" fill="#fca5a5" fontSize="8" fontWeight="bold" textAnchor="middle">
                  RESIKO STRUKTUR ATAP ROBOH!
                </text>
                <text x="15" y="122" fill="#38bdf8" fontSize="8.5">
                  Gotong royong pakai tangga kokoh
                </text>
              </g>
            </g>
          )}

          {/* TAB 2: LARANGAN BERKENDARA DI JALANAN BERABU */}
          {activeTab === 'kendaraan' && (
            <g transform="translate(20, 15)">
              <rect x="20" y="80" width="240" height="90" fill="#334155" />
              <rect x="20" y="80" width="240" height="12" fill="#64748b" />
              <line x1="20" y1="125" x2="260" y2="125" stroke="#facc15" strokeWidth="2" />

              <circle cx="100" cy="50" r="22" fill="#ffffff" stroke="#dc2626" strokeWidth="5" />
              <line x1="84" y1="36" x2="116" y2="64" stroke="#dc2626" strokeWidth="4" />
              <text x="100" y="55" fill="#0f172a" fontSize="12" fontWeight="bold" textAnchor="middle">
                NGEBUT
              </text>

              <g transform="translate(140, 95)">
                <circle cx="20" cy="40" r="14" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
                <circle cx="70" cy="40" r="14" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
                <path d="M 18 35 L 35 15 L 55 18 L 70 38" stroke="#ef4444" strokeWidth="6" fill="none" />
                <rect x="35" y="8" width="12" height="10" fill="#0284c7" />
                <circle cx="10" cy="42" r="6" fill="#94a3b8" opacity="0.6" />
                <circle cx="0" cy="38" r="8" fill="#94a3b8" opacity="0.4" />
                <text x="45" y="-5" fill="#f87171" fontSize="9" fontWeight="bold">
                  LICIN &amp; MERUSAK MESIN!
                </text>
              </g>

              <g transform="translate(280, 20)">
                <rect x="0" y="0" width="220" height="140" rx="8" fill="#0f172a" stroke="#eab308" strokeWidth="2" />
                <rect x="10" y="10" width="200" height="24" rx="4" fill="#a16207" />
                <text x="110" y="26" fill="#fef08a" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  KERUSAKAN KENDARAAN
                </text>
                <text x="15" y="55" fill="#f8fafc" fontSize="8.5">
                  1. <tspan fill="#facc15" fontWeight="bold">Traksi Ban Nol</tspan>: Sangat licin
                </text>
                <text x="15" y="73" fill="#f8fafc" fontSize="8.5">
                  2. <tspan fill="#facc15" fontWeight="bold">Penyumbatan Udara</tspan>: Filter mampet
                </text>
                <text x="15" y="91" fill="#f8fafc" fontSize="8.5">
                  3. <tspan fill="#f87171" fontWeight="bold">Baret Silinder</tspan>: Piston rusak berat
                </text>
                <rect x="15" y="104" width="190" height="24" fill="#1e293b" rx="4" />
                <text x="110" y="119" fill="#38bdf8" fontSize="8" textAnchor="middle">
                  BNPB: Hindari berkendara di zona abu!
                </text>
              </g>
            </g>
          )}

          {/* TAB 3: ALAT PELINDUNG DIRI (APD) */}
          {activeTab === 'apd' && (
            <g transform="translate(25, 20)">
              <g transform="translate(20, 10)">
                <rect x="0" y="0" width="200" height="130" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
                <text x="100" y="22" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle">
                  APD WAJIB BERSIH ABU
                </text>
                <rect x="15" y="35" width="24" height="16" rx="3" fill="#f8fafc" stroke="#94a3b8" />
                <text x="48" y="47" fill="#f8fafc" fontSize="8.5">
                  Masker N95 / Dobel Medis
                </text>
                <rect x="15" y="60" width="12" height="10" rx="2" fill="#38bdf8" />
                <rect x="29" y="60" width="12" height="10" rx="2" fill="#38bdf8" />
                <line x1="26" y1="65" x2="30" y2="65" stroke="#ffffff" strokeWidth="1" />
                <text x="48" y="68" fill="#f8fafc" fontSize="8.5">
                  Kacamata Goggle Tertutup
                </text>
                <rect x="18" y="82" width="18" height="18" fill="#0284c7" rx="2" />
                <text x="48" y="93" fill="#f8fafc" fontSize="8.5">
                  Baju Lengan Panjang &amp; Celana
                </text>
                <rect x="18" y="105" width="18" height="14" fill="#f59e0b" rx="2" />
                <text x="48" y="115" fill="#f8fafc" fontSize="8.5">
                  Sarung Tangan Karet / Kain
                </text>
              </g>

              <g transform="translate(250, 10)">
                <rect x="0" y="0" width="230" height="130" rx="8" fill="#0f172a" stroke="#059669" strokeWidth="2" />
                <rect x="10" y="10" width="210" height="24" rx="4" fill="#065f46" />
                <text x="115" y="26" fill="#a7f3d0" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  TUJUAN PROTEKSI KESEHATAN
                </text>
                <text x="15" y="55" fill="#f8fafc" fontSize="8.5">
                  • Paru-Paru bebas silika (Cegah ISPA)
                </text>
                <text x="15" y="75" fill="#f8fafc" fontSize="8.5">
                  • Kornea mata terlindung goresan debu
                </text>
                <text x="15" y="95" fill="#f8fafc" fontSize="8.5">
                  • Kulit terhindar dari iritasi asam belerang
                </text>
                <text x="15" y="115" fill="#facc15" fontSize="8.5" fontWeight="bold">
                  Standar Kebersihan Pascabencana BNPB
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Description Box below Canvas */}
      <div className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl p-2.5 mb-2 shadow-inner">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="px-2 py-0.5 rounded text-[12.5px] font-pixel-title text-slate-950 font-bold"
            style={{ backgroundColor: tabDetails[activeTab].color }}
          >
            {tabDetails[activeTab].badge}
          </span>
          <h4 className="text-[13px] sm:text-[15px] font-pixel-title text-amber-300 font-bold">
            {tabDetails[activeTab].title}
          </h4>
        </div>
        <p className="font-sans text-[13px] sm:text-[15px] text-slate-200 leading-relaxed font-medium">
          {tabDetails[activeTab].desc}
        </p>
      </div>

      {/* Tab Switcher Buttons */}
      <div className="w-full grid grid-cols-1 xs:grid-cols-3 gap-2">
        <button
          onClick={() => setActiveTab('atap')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'atap'
            ? 'bg-orange-500 text-slate-950 border-orange-300 font-bold'
            : 'bg-slate-800 text-orange-300 border-slate-700 hover:border-orange-500'
            }`}
        >
          1. BERSIH ATAP RUMAH
        </button>
        <button
          onClick={() => setActiveTab('kendaraan')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'kendaraan'
            ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
            : 'bg-slate-800 text-amber-300 border-slate-700 hover:border-amber-400'
            }`}
        >
          2. LARANGAN BERKENDARA
        </button>
        <button
          onClick={() => setActiveTab('apd')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'apd'
            ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-bold'
            : 'bg-slate-800 text-emerald-300 border-slate-700 hover:border-emerald-500'
            }`}
        >
          3. APD BERSIH ABU
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN 16: PASCABENCANA ERUPSI — KESEHATAN, SANITASI & AIR BERSIH (PMI)
// ═════════════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN 16: PASCABENCANA ERUPSI — KESEHATAN, SANITASI & AIR BERSIH (PMI)
// ═════════════════════════════════════════════════════════════════════════════
export function VolcanoPostSanitationIllustration() {
  const [activeTab, setActiveTab] = useState<'air' | 'silika' | 'mata'>('air');

  const tabDetails = {
    air: {
      title: 'TANDON AIR BERSIH TERTUTUP RAPAT',
      badge: 'SANITASI AIR MINUM',
      color: '#0284c7',
      desc: 'Hujan abu vulkanik mengandung asam kuat dan senyawa belerang. Jika tandon penampungan air minum terbuka, air akan terkontaminasi zat beracun dan memicu keracunan pencernaan akut. Pastikan toren dan sumur selalu ditutup rapat!',
    },
    silika: {
      title: 'BAHAYA KRISTAL SILIKA MIKROSKOPIS BAGI PARU-PARU',
      badge: 'BAHAYA PERNAPASAN & ISPA',
      color: '#ef4444',
      desc: 'Abu vulkanik bukanlah debu tanah halus biasa, melainkan serpihan kaca silika tajam (SiO2). Jika terhirup ke dalam paru-paru, kristal ini merobek dinding alveolus dan memicu batuk berdarah hingga ISPA akut. Selalu gunakan masker penyaring N95!',
    },
    mata: {
      title: 'CUCI MATA DENGAN AIR MENGALIR (JANGAN DIKUCEK)',
      badge: 'PERTOLONGAN PERTAMA MATA',
      color: '#f59e0b',
      desc: 'Saat mata kemasukan debu abu vulkanik, JANGAN PERNAH DIKUCEK! Mengucek mata akan membuat kristal kaca silika menggores dan merusak kornea secara permanen. Segera bilas menggunakan air bersih mengalir atau cairan steril pencuci mata.',
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 font-pixel">
      <div className="w-full flex items-center justify-between px-2 pb-1.5 border-b border-slate-800">
        <span className="text-[13px] sm:text-[15px] font-pixel-title text-sky-400 font-bold flex items-center gap-1.5">
          <PixelIcon name="heart" size={14} />
          SANITASI AIR BERSIH &amp; KESEHATAN PASCABENCANA
        </span>
        <span className="text-[13.5px] sm:text-[13px] text-slate-400 font-pixel font-semibold">
          STANDAR MEDIS PMI &amp; BNPB
        </span>
      </div>

      <div className="w-full flex-1 flex items-center justify-center p-2">
        <svg viewBox="0 0 540 220" className="w-full h-full object-contain" shapeRendering="crispEdges">
          <rect x="0" y="0" width="540" height="220" fill="#0b0f19" />
          <rect x="0" y="0" width="540" height="170" fill="#0f172a" />
          <line x1="0" y1="170" x2="540" y2="170" stroke="#1e293b" strokeWidth="2" />
          <rect x="0" y="170" width="540" height="50" fill="#1e293b" />

          {/* TAB 1: TANDON AIR BERSIH TERTUTUP */}
          {activeTab === 'air' && (
            <g transform="translate(30, 20)">
              {/* Tandon Stainless Besar */}
              <rect x="40" y="30" width="120" height="110" rx="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="3" />
              <rect x="45" y="45" width="110" height="12" fill="#cbd5e1" />
              <rect x="45" y="85" width="110" height="12" fill="#cbd5e1" />
              {/* Tutup Tandon Rapat Bersegel Gembok */}
              <ellipse cx="100" cy="30" rx="55" ry="12" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
              <rect x="90" y="14" width="20" height="12" rx="3" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
              {/* Keran Air Bersih di Bawah */}
              <rect x="160" y="110" width="18" height="8" fill="#64748b" />
              <rect x="172" y="118" width="6" height="14" fill="#0284c7" />
              {/* Air Mengalir Bersih */}
              <path d="M 175 132 Q 175 155 175 165" stroke="#38bdf8" strokeWidth="3" fill="none" />

              {/* Label Status Tandon */}
              <rect x="25" y="145" width="150" height="20" rx="4" fill="#065f46" stroke="#10b981" strokeWidth="1.5" />
              <text x="100" y="159" fill="#a7f3d0" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                AIR BERSIH TERTUTUP AMAN
              </text>

              {/* Panel Bahaya Kontaminasi Asam & Belerang */}
              <g transform="translate(230, 10)">
                <rect x="0" y="0" width="240" height="135" rx="8" fill="#0f172a" stroke="#0284c7" strokeWidth="2" />
                <rect x="10" y="10" width="220" height="24" rx="4" fill="#075985" />
                <text x="120" y="26" fill="#e0f2fe" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  KONTAMINASI AIR TERBUKA
                </text>
                <text x="15" y="55" fill="#f87171" fontSize="8.5" fontWeight="bold">
                  Sumur / Tandon Terbuka:
                </text>
                <text x="25" y="70" fill="#f8fafc" fontSize="8">
                  • Mengandung asam belerang (pH turun drastis)
                </text>
                <text x="25" y="85" fill="#f8fafc" fontSize="8">
                  • Keracunan logam berat vulkanik &amp; diare
                </text>
                <text x="15" y="105" fill="#34d399" fontSize="8.5" fontWeight="bold">
                  Tandon Tertutup di Barak BPBD:
                </text>
                <text x="25" y="120" fill="#a7f3d0" fontSize="8">
                  • 100% Higienis &amp; aman dikonsumsi pengungsi
                </text>
              </g>
            </g>
          )}

          {/* TAB 2: BAHAYA SILIKA MIKROSKOPIS */}
          {activeTab === 'silika' && (
            <g transform="translate(30, 15)">
              {/* Lensa Kaca Pembesar Memperbesar Kristal Silika */}
              <circle cx="100" cy="80" r="60" fill="#020617" stroke="#38bdf8" strokeWidth="4" />
              <line x1="145" y1="125" x2="185" y2="165" stroke="#64748b" strokeWidth="10" strokeLinecap="round" />

              {/* Kristal Silika Runcing Tajam (SiO2) di Dalam Lensa */}
              <polygon points="75,60 95,40 105,65 85,80" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
              <polygon points="105,75 130,55 140,85 115,95" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
              <polygon points="65,95 85,85 95,110 70,120" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
              <polygon points="105,100 125,95 130,125 110,120" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
              <text x="100" y="152" fill="#ef4444" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                KRISTAL KACA TAJAM (SiO2)
              </text>

              {/* Panel Penjelasan Paru-Paru & ISPA */}
              <g transform="translate(240, 10)">
                <rect x="0" y="0" width="230" height="135" rx="8" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
                <rect x="10" y="10" width="210" height="24" rx="4" fill="#991b1b" />
                <text x="115" y="26" fill="#fecaca" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  KERUSAKAN ALVEOLUS PARU
                </text>
                <text x="15" y="55" fill="#f8fafc" fontSize="8.5">
                  1. Ukuran partikel abu: &lt; 2 mikrometer
                </text>
                <text x="15" y="73" fill="#f8fafc" fontSize="8.5">
                  2. Menembus langsung ke kantung alveolus
                </text>
                <text x="15" y="91" fill="#fca5a5" fontSize="8.5" fontWeight="bold">
                  3. Mengakibatkan ISPA akut &amp; batuk darah
                </text>
                <rect x="15" y="104" width="200" height="22" fill="#1e293b" rx="4" />
                <text x="115" y="119" fill="#facc15" fontSize="8" fontWeight="bold" textAnchor="middle">
                  SOLUSI: MASKER N95 (95% FILTER ABU)
                </text>
              </g>
            </g>
          )}

          {/* TAB 3: CUCI MATA DENGAN AIR MENGALIR */}
          {activeTab === 'mata' && (
            <g transform="translate(30, 20)">
              {/* Wastafel Cuci Mata PMI & Aliran Air Bersih */}
              <rect x="40" y="80" width="120" height="60" rx="6" fill="#334155" stroke="#64748b" strokeWidth="2" />
              <rect x="80" y="40" width="40" height="40" fill="#f8fafc" rx="4" />
              {/* Dua Corong Eyewash Menyemprotkan Air ke Atas */}
              <rect x="90" y="60" width="8" height="20" fill="#0284c7" />
              <rect x="102" y="60" width="8" height="20" fill="#0284c7" />
              <path d="M 94 60 Q 94 35 94 25" stroke="#38bdf8" strokeWidth="3" fill="none" />
              <path d="M 106 60 Q 106 35 106 25" stroke="#38bdf8" strokeWidth="3" fill="none" />

              <rect x="30" y="150" width="140" height="20" rx="4" fill="#15803d" stroke="#22c55e" strokeWidth="1" />
              <text x="100" y="164" fill="#bbf7d0" fontSize="8" fontWeight="bold" textAnchor="middle">
                BILAS AIR MENGALIR
              </text>

              {/* Larangan Mengucek Mata */}
              <g transform="translate(230, 10)">
                <rect x="0" y="0" width="240" height="135" rx="8" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                <rect x="10" y="10" width="220" height="24" rx="4" fill="#b45309" />
                <text x="120" y="26" fill="#fef3c7" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  LARANGAN MENGUCEK MATA
                </text>
                <text x="15" y="55" fill="#f87171" fontSize="8.5" fontWeight="bold">
                  DILARANG MENGUCEK MATA!
                </text>
                <text x="25" y="70" fill="#f8fafc" fontSize="8">
                  • Mengucek = menggosok pecahan kaca ke kornea
                </text>
                <text x="25" y="85" fill="#f8fafc" fontSize="8">
                  • Mengakibatkan luka gores &amp; infeksi kebutaan
                </text>
                <text x="15" y="105" fill="#38bdf8" fontSize="8.5" fontWeight="bold">
                  Tindakan Benar Menurut Dokter:
                </text>
                <text x="25" y="120" fill="#e0f2fe" fontSize="8">
                  • Guyur perlahan dengan air bersih mengalir
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      <div className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl p-2.5 mb-2 shadow-inner">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="px-2 py-0.5 rounded text-[12.5px] font-pixel-title text-slate-950 font-bold"
            style={{ backgroundColor: tabDetails[activeTab].color }}
          >
            {tabDetails[activeTab].badge}
          </span>
          <h4 className="text-[13px] sm:text-[15px] font-pixel-title text-amber-300 font-bold">
            {tabDetails[activeTab].title}
          </h4>
        </div>
        <p className="font-sans text-[13px] sm:text-[15px] text-slate-200 leading-relaxed font-medium">
          {tabDetails[activeTab].desc}
        </p>
      </div>

      <div className="w-full grid grid-cols-1 xs:grid-cols-3 gap-2">
        <button
          onClick={() => setActiveTab('air')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'air'
            ? 'bg-sky-500 text-slate-950 border-sky-300 font-bold'
            : 'bg-slate-800 text-sky-300 border-slate-700 hover:border-sky-500'
            }`}
        >
          1. AIR TERTUTUP
        </button>
        <button
          onClick={() => setActiveTab('silika')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'silika'
            ? 'bg-rose-500 text-slate-950 border-rose-300 font-bold'
            : 'bg-slate-800 text-rose-300 border-slate-700 hover:border-rose-500'
            }`}
        >
          2. BAHAYA SILIKA
        </button>
        <button
          onClick={() => setActiveTab('mata')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'mata'
            ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
            : 'bg-slate-800 text-amber-300 border-slate-700 hover:border-amber-400'
            }`}
        >
          3. CUCI MATA AIR
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN 17: PASCABENCANA ERUPSI — BAHAYA SEKUNDER LAHAR DINGIN & EWS
// ═════════════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN 17: PASCABENCANA ERUPSI — BAHAYA SEKUNDER LAHAR DINGIN & EWS
// ═════════════════════════════════════════════════════════════════════════════
export function VolcanoPostLaharIllustration() {
  const [activeTab, setActiveTab] = useState<'lahar' | 'sungai' | 'ews'>('lahar');

  const tabDetails = {
    lahar: {
      title: 'MEKANISME & UNSUR PEMBENTUK BANJIR LAHAR DINGIN',
      badge: 'BAHAYA SEKUNDER PASCA-ERUPSI',
      color: '#059669',
      desc: 'Banjir lahar dingin (lahar hujan) adalah aliran suspensi pekat antara air hujan berintensitas tinggi dengan jutaan meter kubik material vulkanik lepas (pasir, kerikil, dan bongkahan batu andesit) yang menumpuk di kawah puncak Merapi. Slurry pekat ini meluncur dengan kecepatan 40–60 km/jam menerjang lembah sungai dengan daya hancur hidrolik masif.',
      keyTakeaway: 'Kekuatan lahar dingin bukan sekadar air banjir, melainkan "bubur beton cair alami" bermassa jenis 1,8–2,2 ton/m³ yang mampu menggerus tanggul dan menghancurkan jembatan seketika.',
    },
    sungai: {
      title: 'ZONA BAHAYA BANTARAN SUNGAI & FUNGSI SABO DAM',
      badge: 'ZONASI KRB I — RADIUS AMAN SUNGAI',
      color: '#dc2626',
      desc: 'BNPB & PVMBG menetapkan sempadan sungai berhulu di Merapi (Kali Boyong, Kali Krasak, Kali Gendol, Kali Woro) sebagai Zona Merah lahar. Bangunan Sabo Dam Kementerian PUPR berfungsi menahan laju jutaan kubik batu dan pasir besar di hulu, sementara air lumpur disaring perlahan agar tidak meluap ke permukiman.',
      keyTakeaway: 'DILARANG KERAS menonton lahar di atas jembatan atau berada di bantaran sungai saat mendung di hulu! Segera evakuasi tegak lurus ke dataran tinggi minimal 500 meter dari bibir sungai.',
    },
    ews: {
      title: 'JARINGAN TELEMETRI SISTEM PERINGATAN DINI (EWS LAHAR)',
      badge: 'TEKNOLOGI MITIGASI TELEMETRI REAL-TIME',
      color: '#2563eb',
      desc: 'Mitigasi bahaya sekunder lahar didukung jejaring telemetri terpadu: Stasiun Penakar Hujan Otomatis (ARR) di puncak, Sensor Seismik Getaran Aliran di hulu jurang sungai, serta Menara Sirine EWS bertenaga surya di pemukiman warga yang berbunyi kencang (>110 dB) untuk evakuasi mandiri.',
      keyTakeaway: 'Ketika sirine EWS meraung atau terdeteksi hujan lebat di puncak, warga memiliki waktu tanggap darurat (Golden Time) sekitar 10–20 menit untuk menyelamatkan diri ke tempat tinggi.',
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 sm:p-2.5 font-sans">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between px-2 pb-2 border-b border-slate-700/80">
        <span className="text-[13px] sm:text-[15px] font-black text-emerald-400 flex items-center gap-2 tracking-wide font-sans">
          <PixelIcon name="mountain" size={16} />
          BAHAYA SEKUNDER ERUPSI: BANJIR LAHAR DINGIN
        </span>
        <span className="text-[14px] sm:text-[13px] text-amber-300/90 font-bold bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
          MONITORING BNPB, PVMBG &amp; BALAI SABO PUPR
        </span>
      </div>

      {/* Center Interactive SVG Canvas */}
      <div className="w-full flex-1 flex items-center justify-center p-1.5 my-1">
        <svg viewBox="0 0 540 225" className="w-full h-full object-contain rounded-xl overflow-hidden shadow-2xl border border-slate-700/60">
          {/* DEFINITIONS & GRADIENTS */}
          <defs>
            {/* Langit Badai Malam Gelap */}
            <linearGradient id="stormSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#050811" />
              <stop offset="60%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Profil Lereng Gunung Merapi */}
            <linearGradient id="merapiSlopeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="35%" stopColor="#475569" />
              <stop offset="70%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Endapan Tefra & Abu Kawah di Puncak */}
            <linearGradient id="ashCraterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>

            {/* Aliran Bubur Lahar Dingin (Debris Slurry Flow) */}
            <linearGradient id="laharMudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="40%" stopColor="#78350f" />
              <stop offset="75%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* Sabo Dam Beton Bertulang */}
            <linearGradient id="saboConcreteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="40%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Batu Andesit 3D */}
            <radialGradient id="andesiteGrad1" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="60%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>

            <radialGradient id="andesiteGrad2" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#78716c" />
              <stop offset="60%" stopColor="#44403c" />
              <stop offset="100%" stopColor="#1c1917" />
            </radialGradient>

            {/* Awan Kumulonimbus Badai */}
            <linearGradient id="cumulonimbusGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Kilauan / Glow Filter */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKGROUND DASAR */}
          <rect x="0" y="0" width="540" height="225" fill="url(#stormSkyGrad)" />

          {/* Bintang / Ambient Vulkanik Redup di Langit */}
          <circle cx="45" cy="22" r="1" fill="#94a3b8" opacity="0.6" />
          <circle cx="115" cy="18" r="1.5" fill="#fde047" opacity="0.4" />
          <circle cx="210" cy="12" r="1.2" fill="#cbd5e1" opacity="0.5" />
          <circle cx="270" cy="20" r="1" fill="#94a3b8" opacity="0.4" />

          {/* Dasar Dataran Rendah */}
          <rect x="0" y="172" width="540" height="53" fill="#14532d" />
          <rect x="0" y="172" width="540" height="3" fill="#22c55e" opacity="0.4" />
          <rect x="0" y="185" width="540" height="40" fill="#0f172a" opacity="0.4" />

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 1: MEKANISME BANJIR LAHAR DINGIN & SABO DAM                   */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'lahar' && (
            <g>
              {/* Sisi Kiri: Foto Nyata Banjir Lahar Dingin Merapi (Alur Sungai Kali Gendol/Woro) */}
              <g transform="translate(12, 10)">
                <clipPath id="laharPostPhotoClip">
                  <rect x="0" y="0" width="214" height="205" rx="10" />
                </clipPath>
                <rect x="0" y="0" width="214" height="205" rx="10" fill="#0f172a" stroke="#059669" strokeWidth="1.8" />
                <image
                  href="/lahar_dingin.jpg"
                  x="0"
                  y="0"
                  width="214"
                  height="205"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#laharPostPhotoClip)"
                />
                <rect x="0" y="0" width="214" height="205" rx="10" fill="none" stroke="#059669" strokeWidth="1.8" />

                {/* Badge Keterangan Foto di Bawah */}
                <g transform="translate(8, 146)">
                  <rect x="0" y="0" width="198" height="52" rx="6" fill="#0f172a" fillOpacity="0.94" stroke="#34d399" strokeWidth="1.2" />
                  <text x="99" y="13" fill="#a7f3d0" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    BANJIR LAHAR DINGIN MERAPI
                  </text>
                  <text x="99" y="24" fill="#f1f5f9" fontSize="6.8" textAnchor="middle" fontFamily="sans-serif">
                    Aliran Debris Lumpur &amp; Batu Andesit
                  </text>
                  <text x="99" y="33" fill="#38bdf8" fontSize="6.2" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    Kecepatan Arus: 40 — 60 km/jam
                  </text>
                  <a href="https://news.detik.com/berita/d-7301571/4-fakta-banjir-lahar-dingin-semeru-yang-tewaskan-3-orang" target="_blank" rel="noopener noreferrer">
                    <text x="99" y="44" fill="#fbbf24" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" textDecoration="underline" cursor="pointer">
                      Sumber: Detikcom ↗
                    </text>
                  </a>
                </g>
              </g>

              {/* SISI KANAN: PANEL EDUKASI MODERN UNSUR LAHAR */}
              <g transform="translate(236, 10)">
                {/* Background Card Kaca */}
                <rect x="0" y="0" width="294" height="205" rx="10" fill="#0f172a" fillOpacity="0.94" stroke="#059669" strokeWidth="1.8" />
                <rect x="1" y="1" width="292" height="32" rx="9" fill="#064e3b" />

                <text x="147" y="21" fill="#ecfdf5" fontSize="10.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                  UNSUR &amp; PROSES TERJADINYA LAHAR
                </text>

                {/* Point 1: Hujan Deras */}
                <g transform="translate(10, 40)">
                  <rect x="0" y="0" width="274" height="36" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                  <rect x="6" y="6" width="24" height="24" rx="4" fill="#0284c7" />
                  {/* Ikon 2D Pixel: Hujan Ekstrem */}
                  <g transform="translate(11, 10)">
                    <rect x="3" y="1" width="8" height="2" fill="#cbd5e1" />
                    <rect x="1" y="3" width="12" height="4" fill="#94a3b8" />
                    <rect x="2" y="8" width="1.5" height="4" fill="#38bdf8" />
                    <rect x="6" y="9" width="1.5" height="4" fill="#38bdf8" />
                    <rect x="10" y="8" width="1.5" height="4" fill="#38bdf8" />
                  </g>
                  <text x="36" y="16" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    1. Hujan Ekstrem di Hulu (&gt;50 mm/jam)
                  </text>
                  <text x="36" y="28" fill="#cbd5e1" fontSize="7.8" fontFamily="sans-serif">
                    Memicu likuifaksi &amp; menggerus timbunan material di lereng.
                  </text>
                </g>

                {/* Point 2: Jutaan m3 Endapan */}
                <g transform="translate(10, 81)">
                  <rect x="0" y="0" width="274" height="36" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                  <rect x="6" y="6" width="24" height="24" rx="4" fill="#d97706" />
                  {/* Ikon 2D Pixel: Gunung Vulkanik */}
                  <g transform="translate(11, 10)">
                    <polygon points="7,2 1,13 13,13" fill="#78350f" />
                    <rect x="5" y="2" width="4" height="2" fill="#ef4444" />
                    <rect x="6" y="0" width="2" height="2" fill="#f97316" />
                    <rect x="6" y="4" width="2" height="5" fill="#ea580c" />
                  </g>
                  <text x="36" y="16" fill="#fde047" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    2. Endapan Pasir, Kerikil &amp; Tefra Kawah
                  </text>
                  <text x="36" y="28" fill="#cbd5e1" fontSize="7.8" fontFamily="sans-serif">
                    Jutaan m³ material sisa erupsi mencair jadi bubur kental.
                  </text>
                </g>

                {/* Point 3: Batu Andesit Masif */}
                <g transform="translate(10, 122)">
                  <rect x="0" y="0" width="274" height="36" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                  <rect x="6" y="6" width="24" height="24" rx="4" fill="#dc2626" />
                  {/* Ikon 2D Pixel: Batu Andesit Raksasa */}
                  <g transform="translate(11, 10)">
                    <rect x="3" y="2" width="8" height="3" fill="#94a3b8" />
                    <rect x="1" y="5" width="12" height="6" fill="#64748b" />
                    <rect x="2" y="11" width="10" height="2" fill="#334155" />
                    <rect x="4" y="3" width="3" height="2" fill="#cbd5e1" />
                    <rect x="8" y="7" width="3" height="3" fill="#1e293b" />
                  </g>
                  <text x="36" y="16" fill="#fca5a5" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    3. Batu Andesit Raksasa Terbawa Arus
                  </text>
                  <text x="36" y="28" fill="#cbd5e1" fontSize="7.8" fontFamily="sans-serif">
                    Daya dorong hidrolik tinggi menyeret batu sebesar mobil!
                  </text>
                </g>

                {/* Stat Chip Bottom */}
                <g transform="translate(10, 164)">
                  <rect x="0" y="0" width="274" height="32" rx="6" fill="#042f2e" stroke="#10b981" strokeWidth="1.2" />
                  <text x="137" y="14" fill="#a7f3d0" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    DENSITAS SLURRY: 1,8 — 2,2 TON/M³
                  </text>
                  <text x="137" y="25" fill="#ffffff" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">
                    Mampu meruntuhkan jembatan beton &amp; menyapu bibir sungai!
                  </text>
                </g>
              </g>
            </g>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 2: ZONASI BANTARAN SUNGAI & RADIUS AMAN                       */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'sungai' && (
            <g>
              {/* Sisi Kiri: Penampang Lembah Sungai V-Shape & Dataran Tinggi */}
              {/* Tebing Kiri & Jurang Sungai */}
              <polygon points="10,85 70,85 100,165 10,165" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
              {/* Dasar Sungai & Alur Lahar Dingin */}
              <rect x="100" y="152" width="70" height="20" fill="#451a03" />
              <path d="M 100 156 Q 135 164 170 156 L 170 172 L 100 172 Z" fill="#78350f" />
              <line x1="100" y1="154" x2="170" y2="154" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Batu Terbawa di Dasar Sungai */}
              <circle cx="120" cy="162" r="5" fill="url(#andesiteGrad1)" />
              <circle cx="145" cy="164" r="6" fill="url(#andesiteGrad2)" />

              {/* Tebing Kanan Menuju Dataran Tinggi / Tempat Evakuasi */}
              <polygon points="170,165 195,115 235,115 235,172 170,172" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
              {/* Dataran Tinggi Evakuasi Aman (Hijau Aman) */}
              <rect x="195" y="105" width="40" height="12" fill="#15803d" />
              <polygon points="210,95 210,105 220,100" fill="#22c55e" />
              <line x1="210" y1="90" x2="210" y2="105" stroke="#ffffff" strokeWidth="1.5" />
              <rect x="190" y="80" width="44" height="14" rx="3" fill="#0f172a" stroke="#22c55e" strokeWidth="1" />
              <text x="212" y="90" fill="#4ade80" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                BUKIT AMAN
              </text>

              {/* Tanda Panah Evakuasi Lari ke Atas */}
              <path d="M 178 142 L 196 122" stroke="#22c55e" strokeWidth="3" markerEnd="url(#arrow)" />
              <polygon points="198,120 190,123 194,130" fill="#22c55e" />

              {/* Jembatan Rusak / Terlarang di Atas Sungai */}
              <rect x="68" y="100" width="38" height="6" fill="#64748b" />
              <line x1="106" y1="100" x2="135" y2="125" stroke="#dc2626" strokeWidth="3" strokeDasharray="3 2" />
              <circle cx="120" cy="112" r="7" fill="#dc2626" />
              <text x="120" y="116" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle">✕</text>

              {/* Garis Batas Bahaya Merah (Zona Merah < 500m) */}
              <rect x="20" y="42" width="140" height="24" rx="4" fill="#0f172a" stroke="#dc2626" strokeWidth="1.5" />
              <text x="90" y="53" fill="#f87171" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                ZONA MERAH: SEMPADAN SUNGAI
              </text>
              <text x="90" y="62" fill="#fecaca" fontSize="7" textAnchor="middle" fontFamily="sans-serif">
                Radius Bahaya: &lt; 300 - 500 Meter
              </text>

              {/* Rambu Peringatan Lahar Segitiga Kuning */}
              <polygon points="45,115 30,140 60,140" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
              <text x="45" y="136" fill="#0f172a" fontSize="14" fontWeight="black" textAnchor="middle">!</text>

              {/* SISI KANAN: PROTOKOL KESELAMATAN BANTARAN SUNGAI */}
              <g transform="translate(236, 10)">
                <rect x="0" y="0" width="294" height="205" rx="10" fill="#0f172a" fillOpacity="0.94" stroke="#dc2626" strokeWidth="1.8" />
                <rect x="1" y="1" width="292" height="32" rx="9" fill="#7f1d1d" />

                <text x="147" y="21" fill="#fee2e2" fontSize="10.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                  ATURAN KESELAMATAN BANTARAN SUNGAI
                </text>

                {/* Larangan 1 */}
                <g transform="translate(10, 40)">
                  <rect x="0" y="0" width="274" height="42" rx="6" fill="#1e293b" stroke="#7f1d1d" strokeWidth="1" />
                  <rect x="6" y="6" width="30" height="30" rx="4" fill="#991b1b" />
                  {/* Ikon 2D Pixel: Larangan Jembatan */}
                  <g transform="translate(13, 13)">
                    <circle cx="8" cy="8" r="7" fill="none" stroke="#fee2e2" strokeWidth="2.2" />
                    <line x1="3" y1="3" x2="13" y2="13" stroke="#fee2e2" strokeWidth="2.2" />
                  </g>
                  <text x="42" y="17" fill="#f87171" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    Dilarang Menonton di Jembatan!
                  </text>
                  <text x="42" y="30" fill="#cbd5e1" fontSize="7.8" fontFamily="sans-serif">
                    Batu raksasa dapat merubuhkan tiang jembatan seketika tanpa tanda awal.
                  </text>
                </g>

                {/* Larangan 2 */}
                <g transform="translate(10, 87)">
                  <rect x="0" y="0" width="274" height="42" rx="6" fill="#1e293b" stroke="#7f1d1d" strokeWidth="1" />
                  <rect x="6" y="6" width="30" height="30" rx="4" fill="#991b1b" />
                  {/* Ikon 2D Pixel: Rambu Peringatan Bahaya */}
                  <g transform="translate(13, 13)">
                    <polygon points="8,1 1,14 15,14" fill="#facc15" stroke="#78350f" strokeWidth="1" />
                    <rect x="7" y="5" width="2" height="4" fill="#0f172a" />
                    <rect x="7" y="10.5" width="2" height="2" fill="#0f172a" />
                  </g>
                  <text x="42" y="17" fill="#fca5a5" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    Dilarang Beraktivitas di Dasar Sungai
                  </text>
                  <text x="42" y="30" fill="#cbd5e1" fontSize="7.8" fontFamily="sans-serif">
                    Tinggalkan tambang pasir seketika saat langit hulu puncak mendung pekat!
                  </text>
                </g>

                {/* Tanggap Aman (Hijau) */}
                <g transform="translate(10, 134)">
                  <rect x="0" y="0" width="274" height="62" rx="6" fill="#064e3b" stroke="#059669" strokeWidth="1.2" />
                  <rect x="6" y="8" width="30" height="30" rx="4" fill="#047857" />
                  {/* Ikon 2D Pixel: Pelari Evakuasi */}
                  <g transform="translate(14, 15)">
                    <rect x="8" y="1" width="3" height="3" fill="#d1fae5" />
                    <rect x="5" y="4" width="4" height="4" fill="#6ee7b7" />
                    <rect x="9" y="5" width="3" height="2" fill="#d1fae5" />
                    <rect x="2" y="4" width="3" height="2" fill="#34d399" />
                    <rect x="6" y="8" width="2" height="3" fill="#10b981" />
                    <rect x="8" y="10" width="3" height="2" fill="#6ee7b7" />
                    <rect x="3" y="8" width="3" height="2" fill="#10b981" />
                  </g>
                  <text x="42" y="21" fill="#34d399" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif">
                    EVAKUASI TEGAK LURUS KE ATAS!
                  </text>
                  <text x="42" y="35" fill="#ecfdf5" fontSize="8" fontFamily="sans-serif">
                    Jangan lari searah aliran sungai! Naiklah ke dataran tinggi atau bukit terdekat minimal radius 500 meter dari sempadan.
                  </text>
                </g>
              </g>
            </g>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* TAB 3: EARLY WARNING SYSTEM (EWS LAHAR TELEMETRI)                 */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'ews' && (
            <g>
              {/* Sisi Kiri: Diagram Jaringan Sensor Telemetri & Tower Sirine */}
              {/* Stasiun 1: Sensor Hujan Telemetri di Puncak (ARR) */}
              <rect x="20" y="25" width="60" height="42" rx="5" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />
              <text x="50" y="37" fill="#38bdf8" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                STASIUN HUJAN
              </text>
              <rect x="42" y="42" width="16" height="12" fill="#0369a1" />
              <polygon points="40,42 60,42 50,47" fill="#38bdf8" />
              <text x="50" y="62" fill="#fde047" fontSize="6.5" textAnchor="middle" fontFamily="sans-serif">
                &gt;50 mm/jam
              </text>

              {/* Stasiun 2: Seismometer Getaran Lahar di Hulu Jurang */}
              <rect x="20" y="80" width="60" height="42" rx="5" fill="#0f172a" stroke="#d97706" strokeWidth="1.5" />
              <text x="50" y="92" fill="#facc15" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                SENSOR GETARAN
              </text>
              {/* Gelombang Seismik Lahar (10-30 Hz) */}
              <path d="M 28 106 L 34 100 L 40 112 L 46 98 L 52 110 L 58 102 L 64 106 L 72 106" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
              <text x="50" y="117" fill="#fef08a" fontSize="6.5" textAnchor="middle" fontFamily="sans-serif">
                Tremor Aliran Batu
              </text>

              {/* Garis Transmisi Telemetri Radio VHF */}
              <path d="M 80 46 Q 115 65 140 85" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="3 3" fill="none">
                <animate attributeName="stroke-dashoffset" values="0;-16" dur="0.8s" repeatCount="indefinite" />
              </path>
              <path d="M 80 101 Q 115 105 140 115" stroke="#facc15" strokeWidth="1.8" strokeDasharray="3 3" fill="none">
                <animate attributeName="stroke-dashoffset" values="0;-16" dur="0.8s" repeatCount="indefinite" />
              </path>

              {/* TOWER SIRINE EWS TELEMETRI DI DESA */}
              {/* Tiang Kisi Baja EWS */}
              <polygon points="152,172 158,55 166,55 172,172" fill="#475569" stroke="#1e293b" strokeWidth="1" />
              <line x1="154" y1="90" x2="170" y2="130" stroke="#334155" strokeWidth="1.2" />
              <line x1="170" y1="90" x2="154" y2="130" stroke="#334155" strokeWidth="1.2" />

              {/* Antena Telemetri VHF di Pucuk */}
              <line x1="162" y1="55" x2="162" y2="30" stroke="#94a3b8" strokeWidth="2" />
              <line x1="156" y1="36" x2="168" y2="36" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Panel Surya Tenaga Cadangan */}
              <polygon points="144,70 156,66 156,80 144,84" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1" />

              {/* Speaker Sirine Ganda EWS Horn Louder */}
              <polygon points="162,56 146,50 146,62" fill="#eab308" stroke="#78350f" strokeWidth="1" />
              <polygon points="162,56 178,50 178,62" fill="#eab308" stroke="#78350f" strokeWidth="1" />

              {/* Lampu Strobo Berputar EWS Merah-Kuning */}
              <circle cx="162" cy="46" r="6" fill="#ef4444" filter="url(#softGlow)">
                <animate attributeName="fill" values="#ef4444;#facc15;#ef4444" dur="0.6s" repeatCount="indefinite" />
              </circle>

              {/* Gelombang Suara Sirine Menyebar */}
              <path d="M 182 46 A 14 14 0 0 1 182 66" stroke="#facc15" strokeWidth="2" fill="none" opacity="0.9">
                <animate attributeName="stroke-width" values="1;3;1" dur="0.6s" repeatCount="indefinite" />
              </path>
              <path d="M 190 40 A 24 24 0 0 1 190 72" stroke="#ef4444" strokeWidth="2" fill="none" opacity="0.8">
                <animate attributeName="stroke-width" values="1.5;3.5;1.5" dur="0.6s" repeatCount="indefinite" />
              </path>

              {/* Kotak Kontrol Telemetri Bawah */}
              <rect x="154" y="142" width="16" height="24" fill="#0284c7" stroke="#0f172a" strokeWidth="1" />

              {/* Badge Status EWS */}
              <rect x="122" y="176" width="80" height="16" rx="4" fill="#0f172a" stroke="#22c55e" strokeWidth="1.2" />
              <text x="162" y="188" fill="#4ade80" fontSize="7.5" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">
                SIRINE AKTIF: &gt;110 dB
              </text>

              {/* SISI KANAN: ALUR TEKNOLOGI TELEMETRI */}
              <g transform="translate(236, 10)">
                <rect x="0" y="0" width="294" height="205" rx="10" fill="#0f172a" fillOpacity="0.94" stroke="#2563eb" strokeWidth="1.8" />
                <rect x="1" y="1" width="292" height="32" rx="9" fill="#1e3a8a" />

                <text x="147" y="21" fill="#dbeafe" fontSize="10.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                  JARINGAN TELEMETRI EWS PVMBG &amp; BNPB
                </text>

                {/* Langkah 1 */}
                <g transform="translate(10, 40)">
                  <rect x="0" y="0" width="274" height="36" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                  <rect x="6" y="6" width="24" height="24" rx="4" fill="#0284c7" />
                  <text x="18" y="22" fill="#ffffff" fontSize="12" textAnchor="middle">1</text>
                  <text x="36" y="16" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    Deteksi Intensitas Hujan Hulu (ARR)
                  </text>
                  <text x="36" y="28" fill="#cbd5e1" fontSize="7.8" fontFamily="sans-serif">
                    Mencatat ambang batas curah hujan kritis &gt;50 mm/jam di puncak.
                  </text>
                </g>

                {/* Langkah 2 */}
                <g transform="translate(10, 81)">
                  <rect x="0" y="0" width="274" height="36" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                  <rect x="6" y="6" width="24" height="24" rx="4" fill="#0284c7" />
                  <text x="18" y="22" fill="#ffffff" fontSize="12" textAnchor="middle">2</text>
                  <text x="36" y="16" fill="#60a5fa" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    Sensor Seismik Akustik Aliran Lahar
                  </text>
                  <text x="36" y="28" fill="#cbd5e1" fontSize="7.8" fontFamily="sans-serif">
                    Mendeteksi getaran frekuensi rendah tubrukan batu andesit di dasar sungai.
                  </text>
                </g>

                {/* Langkah 3 */}
                <g transform="translate(10, 122)">
                  <rect x="0" y="0" width="274" height="36" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                  <rect x="6" y="6" width="24" height="24" rx="4" fill="#0284c7" />
                  <text x="18" y="22" fill="#ffffff" fontSize="12" textAnchor="middle">3</text>
                  <text x="36" y="16" fill="#93c5fd" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    Peringatan Sirine Otomatis ke Desa
                  </text>
                  <text x="36" y="28" fill="#cbd5e1" fontSize="7.8" fontFamily="sans-serif">
                    Menara sirine bertenaga surya berbunyi lantang untuk evakuasi cepat.
                  </text>
                </g>

                {/* Golden Time Box */}
                <g transform="translate(10, 164)">
                  <rect x="0" y="0" width="274" height="32" rx="6" fill="#172554" stroke="#3b82f6" strokeWidth="1.2" />
                  <text x="137" y="14" fill="#93c5fd" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    GOLDEN TIME EVAKUASI: 10 — 20 MENIT
                  </text>
                  <text x="137" y="25" fill="#ffffff" fontSize="7.5" textAnchor="middle" fontFamily="sans-serif">
                    Waktu krusial warga untuk lari menjauh sebelum lahar menerjang jembatan.
                  </text>
                </g>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Modern Explanatory Information Card */}
      <div className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 my-1.5 shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-[13.5px] sm:text-[13px] font-black text-slate-950 tracking-wider uppercase"
              style={{ backgroundColor: tabDetails[activeTab].color }}
            >
              {tabDetails[activeTab].badge}
            </span>
            <h4 className="text-[13px] sm:text-[15px] font-black text-amber-300 tracking-wide font-sans">
              {tabDetails[activeTab].title}
            </h4>
          </div>
          {activeTab === 'lahar' && (
            <a
              href="https://news.detik.com/berita/d-7301571/4-fakta-banjir-lahar-dingin-semeru-yang-tewaskan-3-orang"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-amber-300 hover:text-amber-200 text-[13.5px] font-sans font-bold flex items-center gap-1 transition-all"
              title="Kunjungi sumber dokumentasi Detikcom"
            >
              <span>Sumber: Detikcom</span>
              <span>↗</span>
            </a>
          )}
        </div>
        <p className="font-sans text-[13px] sm:text-[16px] text-slate-200 leading-relaxed font-semibold mb-2">
          {tabDetails[activeTab].desc}
        </p>
        <div className="bg-slate-950/60 rounded-lg px-2.5 py-1.5 border-l-3 border-amber-400 flex items-start gap-2">
          <span className="text-amber-400 font-bold text-[13px] shrink-0 mt-0.5 flex items-center gap-1">
            <PixelIcon name="bulb" size={13} className="text-amber-400 shrink-0" />
            CATATAN AHLI:
          </span>
          <span className="text-[15px] sm:text-[13px] text-amber-200/90 font-medium italic leading-relaxed">
            {tabDetails[activeTab].keyTakeaway}
          </span>
        </div>
      </div>

      {/* 3 Interactive Tab Control Buttons */}
      <div className="w-full grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-2.5 pt-1">
        <button
          onClick={() => setActiveTab('lahar')}
          className={`px-3 py-2.5 rounded-xl border-2 text-[14.5px] sm:text-[13px] font-bold font-sans cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md ${activeTab === 'lahar'
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-300 font-black shadow-emerald-900/40 scale-[1.02]'
            : 'bg-slate-800/90 text-emerald-300 border-slate-700 hover:border-emerald-500/60 hover:bg-slate-800'
            }`}
        >
          <PixelIcon name="wave" size={14} className="shrink-0" />
          <span>1. MEKANISME LAHAR</span>
        </button>

        <button
          onClick={() => setActiveTab('sungai')}
          className={`px-3 py-2.5 rounded-xl border-2 text-[14.5px] sm:text-[13px] font-bold font-sans cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md ${activeTab === 'sungai'
            ? 'bg-gradient-to-r from-red-500 to-rose-500 text-slate-950 border-red-300 font-black shadow-red-900/40 scale-[1.02]'
            : 'bg-slate-800/90 text-red-300 border-slate-700 hover:border-red-500/60 hover:bg-slate-800'
            }`}
        >
          <PixelIcon name="warning" size={14} className="shrink-0" />
          <span>2. ZONASI SUNGAI</span>
        </button>

        <button
          onClick={() => setActiveTab('ews')}
          className={`px-3 py-2.5 rounded-xl border-2 text-[14.5px] sm:text-[13px] font-bold font-sans cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md ${activeTab === 'ews'
            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-slate-950 border-blue-300 font-black shadow-blue-900/40 scale-[1.02]'
            : 'bg-slate-800/90 text-blue-300 border-slate-700 hover:border-blue-500/60 hover:bg-slate-800'
            }`}
        >
          <PixelIcon name="siren" size={14} className="shrink-0" />
          <span>3. SIRINE EWS</span>
        </button>
      </div>
    </div>
  );
}
