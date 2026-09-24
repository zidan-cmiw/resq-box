// ── src/app/Level2/DisasterCityMap.tsx ──────────────────────────────
// Peta Interaktif 2D Pixel Art "Disaster City"
// Menampilkan Gunung Merapi (vulkanik), Zona Sesar Tektonik (patahan lempeng),
// Fasilitas Kota (Sekolah, Rumah, Puskesmas, Jalan), dan Titik Kumpul Aman (Safe Zone).

import { useState } from 'react';
import PixelIcon from '../../components/PixelIcon';
import { retroAudio } from '../../utils/retroAudio';

export type CityStatus = 'calm' | 'tremor' | 'eruption' | 'evacuating' | 'secured';

interface DisasterCityMapProps {
  status: CityStatus;
  activeMission: number;
  onSelectHotspot?: (hotspotId: string) => void;
  placedItems?: Record<string, { type: string; x: number; y: number }>;
  showNpcEvacuation?: boolean;
}

interface Hotspot {
  id: string;
  name: string;
  category: 'vulkanik' | 'sesar' | 'kota' | 'aman';
  x: number; // percentage
  y: number; // percentage
  icon: string;
  badge: string;
  desc: string;
  geologyNote: string;
}

const CITY_HOTSPOTS: Hotspot[] = [
  {
    id: 'merapi-crater',
    name: 'Kawah Aktif Gunung Merapi',
    category: 'vulkanik',
    x: 50,
    y: 16,
    icon: 'volcano',
    badge: 'ZONA BAHAYA KRB III',
    desc: 'Pusat erupsi yang terbentuk dari subduksi lempeng Indo-Australia menyusup ke bawah lempeng Eurasia.',
    geologyNote: 'Peleburan lempeng samudera pada batas konvergen menghasilkan magma andesitik kental kaya gas.',
  },
  {
    id: 'fault-zone',
    name: 'Zona Patahan Sesar Tektonik',
    category: 'sesar',
    x: 46,
    y: 54,
    icon: 'earthquake',
    badge: 'SESAR AKTIF (TRANSFORM)',
    desc: 'Garis patahan dangkal di bawah kota yang bergeser akibat tegangan lempeng tektonik regional.',
    geologyNote: 'Mekanisme sesar geser (strike-slip) bergeser sekitar 2 inci/tahun, memicu gempa bumi dangkal berkekuatan destruktif.',
  },
  {
    id: 'school-sekolah',
    name: 'Sekolah Siaga Bencana',
    category: 'kota',
    x: 28,
    y: 50,
    icon: 'book',
    badge: 'FASILITAS PENDIDIKAN',
    desc: 'Tempat ratusan siswa belajar. Membutuhkan simulasi Drop-Cover-Hold On dan jalur evakuasi bebas kaca.',
    geologyNote: 'Terletak 18 km dari puncak dan 200 m dari jalur patahan. Rentan terhadap guncangan gempa dan hujan abu vulkanik.',
  },
  {
    id: 'hospital-puskesmas',
    name: 'Puskesmas Siaga 24 Jam',
    category: 'kota',
    x: 74,
    y: 48,
    icon: 'shield',
    badge: 'POS MEDIS DARURAT',
    desc: 'Pusat triase medis untuk penanganan cedera, pembagian masker respirator abu, dan oksigen darurat.',
    geologyNote: 'Harus memiliki struktur konstruksi tahan gempa dan cadangan genset saat jaringan listrik kota padam.',
  },
  {
    id: 'residential-warga',
    name: 'Pemukiman Warga Lembah',
    category: 'kota',
    x: 32,
    y: 70,
    icon: 'user',
    badge: 'PEMUKIMAN PADAT',
    desc: 'Kompleks rumah warga. Setiap rumah wajib menyiapkan Tas Siaga 72 Jam dan mengetahui jalur keluar aman.',
    geologyNote: 'Terbangun di atas endapan lahar purba. Sangat rentan terhadap likuefaksi dan gempa dangkal.',
  },
  {
    id: 'safe-assembly-zone',
    name: 'Zona Aman / Titik Kumpul Terbuka',
    category: 'aman',
    x: 70,
    y: 84,
    icon: 'target',
    badge: 'TITIK KUMPUL (SAFE ZONE)',
    desc: 'Lapangan terbuka luas jauh dari lereng terjal, tiang listrik roboh, kaca gedung, dan lembah sungai lahar.',
    geologyNote: 'Lokasi paling aman untuk berkumpul pasca gempa dan evakuasi sementara dari awan panas Merapi.',
  },
];

export default function DisasterCityMap({
  status,
  activeMission,
  onSelectHotspot,
  placedItems = {},
  showNpcEvacuation = false,
}: DisasterCityMapProps) {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [showSubsurface, setShowSubsurface] = useState(false);

  const isShaking = status === 'tremor';
  const isErupting = status === 'eruption';

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-950/40 bg-slate-950 shadow-2xl font-pixel select-none">
      {/* ── Top Command Bar ── */}
      <div className="absolute top-2 left-2 right-2 z-30 flex items-center justify-between pointer-events-none">
        {/* Status Indicator Pill */}
        <div className="pointer-events-auto flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-500/40 shadow-lg">
          <div
            className={`w-2.5 h-2.5 rounded-full ${status === 'calm'
                ? 'bg-emerald-400 animate-pulse'
                : status === 'tremor'
                  ? 'bg-amber-400 animate-ping'
                  : status === 'eruption'
                    ? 'bg-rose-500 animate-ping'
                    : status === 'evacuating'
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-emerald-500'
              }`}
          />
          <span className="font-pixel-title text-[10px] text-amber-300 tracking-wider">
            STATUS [MISI {activeMission}]:{' '}
            <span
              className={
                status === 'calm'
                  ? 'text-emerald-300'
                  : status === 'tremor'
                    ? 'text-amber-300'
                    : status === 'eruption'
                      ? 'text-rose-400'
                      : status === 'evacuating'
                        ? 'text-yellow-300'
                        : 'text-emerald-400'
              }
            >
              {status === 'calm' && 'KONDISI NORMAL (SIAGA HIJAU)'}
              {status === 'tremor' && 'GUNCANGAN GEMPA TEKTONIK AKTIF'}
              {status === 'eruption' && 'ERUPSI MERAPI (AWAN PANAS KELUAR)'}
              {status === 'evacuating' && 'SIMULASI EVAKUASI WARGA BERJALAN'}
              {status === 'secured' && 'KOTA TERLINDUNGI & AMAN'}
            </span>
          </span>
        </div>

        {/* View Toggle (Subsurface vs Surface) */}
        <button
          onClick={() => {
            retroAudio.playSelect();
            setShowSubsurface(!showSubsurface);
          }}
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/90 hover:bg-amber-900 border border-amber-600/60 text-amber-200 text-[10px] font-pixel-title shadow-md cursor-pointer transition-all active:translate-y-0.5"
        >
          <PixelIcon name="layers" size={12} />
          <span>{showSubsurface ? 'TAMPILAN KOTA' : 'X-RAY SUB-SURFACE'}</span>
        </button>
      </div>

      {/* ── Main Map Canvas (SVG 1000 x 600) ── */}
      <div
        className={`relative w-full aspect-[16/9] min-h-[340px] max-h-[540px] overflow-hidden ${isShaking ? 'animate-shake-heavy' : ''
          }`}
      >
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full object-cover select-none"
          shapeRendering="crispEdges"
        >
          <defs>
            {/* Sky Gradients */}
            <linearGradient id="skyCalm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="45%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>

            <linearGradient id="skyCrisis" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#450a0a" />
              <stop offset="40%" stopColor="#7f1d1d" />
              <stop offset="80%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            {/* Volcano Slopes Gradient */}
            <linearGradient id="merapiSlope" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="25%" stopColor="#78350f" />
              <stop offset="60%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>

            {/* Subsurface Crust & Magma Chamber Gradient */}
            <linearGradient id="magmaChamber" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </linearGradient>
          </defs>

          {/* 1. Backdrop Sky */}
          <rect
            width="1000"
            height="600"
            fill={isErupting || isShaking ? 'url(#skyCrisis)' : 'url(#skyCalm)'}
          />

          {!showSubsurface ? (
            <>
              {/* ── 2. DISTANT TERRAIN & MOUNT MERAPI ── */}
              {/* Distant Hills */}
              <polygon
                points="0,320 180,240 380,300 550,220 750,290 1000,230 1000,400 0,400"
                fill="#166534"
                opacity="0.6"
              />

              {/* Gunung Merapi Volcano Peak */}
              <polygon
                points="240,320 500,70 760,320"
                fill="url(#merapiSlope)"
                stroke="#291408"
                strokeWidth="2"
              />

              {/* Merapi Lava Gulley / Jurang Aliran Lahar */}
              <polygon
                points="495,110 505,110 520,220 540,320 480,320 490,220"
                fill="#7f1d1d"
                opacity="0.8"
              />

              {/* Merapi Crater Summit */}
              <polygon points="480,72 520,72 510,85 490,85" fill="#1c1917" />
              <rect x="492" y="70" width="16" height="6" fill="#f97316" />

              {/* Eruption Smoke Plume / Ash Cloud */}
              {isErupting ? (
                <g className="animate-pulse">
                  {/* Huge Ash Cloud billows */}
                  <rect x="440" y="-10" width="120" height="70" rx="20" fill="#292524" opacity="0.9" />
                  <rect x="410" y="20" width="180" height="50" rx="16" fill="#44403c" opacity="0.85" />
                  <rect x="460" y="-30" width="140" height="60" rx="24" fill="#1c1917" opacity="0.95" />
                  {/* Pyroclastic flow glow */}
                  <line x1="500" y1="80" x2="525" y2="280" stroke="#ef4444" strokeWidth="6" strokeDasharray="8 4" />
                  <line x1="495" y1="80" x2="480" y2="260" stroke="#f97316" strokeWidth="4" strokeDasharray="6 3" />
                  {/* Flying volcanic bombs */}
                  <circle cx="430" cy="90" r="4" fill="#ea580c" />
                  <circle cx="560" cy="110" r="5" fill="#ef4444" />
                  <circle cx="470" cy="40" r="3" fill="#facc15" />
                </g>
              ) : (
                /* Calm wispy steam */
                <g opacity="0.6">
                  <rect x="495" y="48" width="12" height="18" fill="#ffffff" rx="4" />
                  <rect x="502" y="28" width="18" height="16" fill="#f1f5f9" rx="6" />
                  <rect x="490" y="12" width="26" height="14" fill="#e2e8f0" rx="6" />
                </g>
              )}

              {/* ── 3. CITY GROUND & VEGETATION ── */}
              {/* Grassy Plain of Disaster City */}
              <rect x="0" y="300" width="1000" height="300" fill="#15803d" />
              <rect x="0" y="300" width="1000" height="15" fill="#4ade80" opacity="0.4" />

              {/* ── 4. FAULT ZONE (SESAR PATAHAN TEKTONIK) ── */}
              <g>
                {/* Fault trench / fissure across city */}
                <polygon
                  points="40,360 480,345 520,355 960,340 960,355 525,370 475,360 40,375"
                  fill="#451a03"
                />
                {isShaking && (
                  <>
                    <polygon
                      points="40,362 480,347 520,357 960,342 960,353 525,368 475,358 40,373"
                      fill="#ef4444"
                      opacity="0.85"
                    />
                    {/* Seismic shockwaves */}
                    <circle cx="500" cy="355" r="40" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
                    <circle cx="500" cy="355" r="90" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 3" />
                  </>
                )}
                {/* Geological Fault Label */}
                <rect x="420" y="335" width="160" height="18" fill="#1c1917" rx="3" stroke="#f59e0b" strokeWidth="1" />
                <text x="500" y="347" textAnchor="middle" fill="#fef08a" fontSize="8" fontWeight="bold">
                  ⚠️ ZONA SESAR AKTIF (TRANSFORM)
                </text>
              </g>

              {/* ── 5. ROAD NETWORK (JALAN RAYA & JALUR EVAKUASI) ── */}
              {/* Main arterial highway */}
              <polygon
                points="240,600 360,370 390,370 320,600"
                fill="#334155"
                stroke="#1e293b"
                strokeWidth="2"
              />
              {/* Cross road towards Safe Zone */}
              <polygon
                points="350,440 820,490 810,530 330,470"
                fill="#475569"
                stroke="#1e293b"
                strokeWidth="1.5"
              />
              {/* Road center dash markings */}
              <line x1="280" y1="580" x2="375" y2="380" stroke="#facc15" strokeWidth="2" strokeDasharray="12 10" />
              <line x1="360" y1="455" x2="780" y2="505" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="8 8" />

              {/* ── 6. BUILDINGS & CITY INFRASTRUCTURE ── */}
              {/* 6a. SEKOLAH (School) */}
              <g transform="translate(230, 270)">
                <rect x="0" y="20" width="85" height="50" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
                {/* Red Roof */}
                <polygon points="-5,20 42,-5 90,20" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
                {/* Clock / Flag tower */}
                <rect x="34" y="-22" width="16" height="18" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
                <rect x="41" y="-32" width="2" height="10" fill="#94a3b8" />
                <rect x="43" y="-30" width="8" height="6" fill="#ef4444" />
                {/* Windows & Doors */}
                <rect x="12" y="32" width="14" height="14" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
                <rect x="34" y="32" width="14" height="14" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
                <rect x="56" y="32" width="14" height="14" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
                <rect x="34" y="52" width="16" height="18" fill="#78350f" />
                <text x="42" y="16" textAnchor="middle" fill="#0f172a" fontSize="7" fontWeight="bold">
                  SEKOLAH SIAGA
                </text>
              </g>

              {/* 6b. PUSKESMAS / RUMAH SAKIT */}
              <g transform="translate(680, 250)">
                <rect x="0" y="20" width="90" height="55" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
                {/* Green cross clinic roof */}
                <polygon points="-5,20 45,0 95,20" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
                {/* Red Cross sign */}
                <rect x="38" y="26" width="14" height="4" fill="#dc2626" />
                <rect x="43" y="21" width="4" height="14" fill="#dc2626" />
                {/* Windows */}
                <rect x="12" y="44" width="16" height="16" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1" />
                <rect x="62" y="44" width="16" height="16" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1" />
                <rect x="38" y="52" width="14" height="23" fill="#334155" />
                <text x="45" y="15" textAnchor="middle" fill="#0369a1" fontSize="7" fontWeight="bold">
                  PUSKESMAS
                </text>
              </g>

              {/* 6c. PEMUKIMAN WARGA (Houses) */}
              <g transform="translate(260, 420)">
                {/* House 1 */}
                <rect x="0" y="15" width="45" height="30" fill="#fed7aa" stroke="#9a3412" strokeWidth="1.5" />
                <polygon points="-4,15 22,0 49,15" fill="#b45309" stroke="#78350f" strokeWidth="1" />
                <rect x="18" y="28" width="10" height="17" fill="#78350f" />
                {/* House 2 */}
                <rect x="55" y="15" width="45" height="30" fill="#e9d5ff" stroke="#7e22ce" strokeWidth="1.5" />
                <polygon points="51,15 77,0 104,15" fill="#6b21a8" stroke="#581c87" strokeWidth="1" />
                <rect x="73" y="28" width="10" height="17" fill="#4c1d95" />
              </g>

              {/* 6d. ZONA AMAN / TITIK KUMPUL (Open grassy field, tents, flag) */}
              <g transform="translate(640, 450)">
                {/* Open Green Lawn */}
                <rect
                  x="0"
                  y="0"
                  width="280"
                  height="110"
                  rx="10"
                  fill="#15803d"
                  stroke="#4ade80"
                  strokeWidth="3"
                  strokeDasharray="8 4"
                />
                {/* Safe Zone Banner */}
                <rect x="40" y="-12" width="200" height="22" rx="4" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
                <text x="140" y="3" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                  ★ TITIK KUMPUL EVAKUASI AMAN ★
                </text>

                {/* Tenda Darurat BNPB / Tim Siaga */}
                <polygon points="40,75 75,35 110,75" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
                <polygon points="65,75 75,55 85,75" fill="#9a3412" />

                <polygon points="120,75 155,35 190,75" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
                <polygon points="145,75 155,55 165,75" fill="#075985" />

                {/* Green Safe Flag Pole */}
                <rect x="220" y="25" width="3" height="55" fill="#cbd5e1" />
                <polygon points="223,27 255,38 223,49" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
                <text x="238" y="41" fill="#ffffff" fontSize="7" fontWeight="bold">
                  SAFE
                </text>
              </g>

              {/* ── 7. PLACED MITIGATION ITEMS (From Mission 5) ── */}
              {Object.entries(placedItems).map(([id, item]) => (
                <g key={id} transform={`translate(${item.x * 10}, ${item.y * 6})`}>
                  <circle cx="0" cy="0" r="14" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                  <rect x="-8" y="-8" width="16" height="16" fill="#1c1917" rx="3" />
                  <text x="0" y="4" textAnchor="middle" fill="#fef08a" fontSize="8" fontWeight="bold">
                    {item.type === 'siren' ? '📢' : item.type === 'zone' ? '📍' : item.type === 'medic' ? '🏥' : '🚧'}
                  </text>
                </g>
              ))}

              {/* ── 8. NPC EVACUATION SIMULATION (When simulating) ── */}
              {showNpcEvacuation && (
                <g className="animate-pulse">
                  {/* Residents running from school along the road */}
                  <circle cx="340" cy="460" r="6" fill="#fef08a" stroke="#0f172a" strokeWidth="1" />
                  <circle cx="380" cy="465" r="6" fill="#fef08a" stroke="#0f172a" strokeWidth="1" />
                  <circle cx="440" cy="470" r="6" fill="#fef08a" stroke="#0f172a" strokeWidth="1" />
                  <circle cx="520" cy="480" r="6" fill="#fef08a" stroke="#0f172a" strokeWidth="1" />
                  <circle cx="610" cy="490" r="6" fill="#4ade80" stroke="#0f172a" strokeWidth="1" />
                  <circle cx="690" cy="500" r="7" fill="#22c55e" stroke="#0f172a" strokeWidth="1.5" />
                  <text x="440" y="455" fill="#fef08a" fontSize="8" fontWeight="bold">
                    JALUR EVAKUASI AKTIF &gt;&gt;&gt;
                  </text>
                </g>
              )}
            </>
          ) : (
            /* ── X-RAY SUB-SURFACE GEOLOGICAL VIEW ── */
            <g>
              {/* Geological Layers */}
              <rect x="0" y="0" width="1000" height="220" fill="#78350f" opacity="0.3" />
              <text x="30" y="40" fill="#fde68a" fontSize="11" fontWeight="bold">
                PENAMPANG GEOLOGIS SUB-SURFACE (LEMPENG TEKTONIK & DAPUR MAGMA)
              </text>

              {/* Continental Crust (Kerak Benua - 100 km tebal) */}
              <rect x="0" y="70" width="550" height="260" fill="#78350f" stroke="#451a03" strokeWidth="2" />
              <text x="50" y="120" fill="#fef08a" fontSize="10" fontWeight="bold">
                LEMPENG BENUA EURASIA (Tebal ~100 km)
              </text>

              {/* Subducting Oceanic Plate (Lempeng Samudera Indo-Australia) */}
              <polygon
                points="550,220 1000,100 1000,300 450,560 380,480"
                fill="#0f766e"
                stroke="#115e59"
                strokeWidth="3"
              />
              <text x="700" y="160" fill="#ccfbf1" fontSize="10" fontWeight="bold">
                LEMPENG SAMUDERA (Menyelinap / Subduksi)
              </text>

              {/* Subduction Zone & Magma Melting Trench */}
              <ellipse cx="440" cy="460" rx="90" ry="50" fill="url(#magmaChamber)" opacity="0.85" />
              <text x="440" y="465" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                ZONA PELEBURAN MAGMA
              </text>

              {/* Magma Conduit rising towards Merapi */}
              <path
                d="M 440,410 Q 470,280 500,70"
                stroke="#f97316"
                strokeWidth="16"
                fill="none"
                strokeLinecap="round"
                opacity="0.9"
              />
              <text x="530" y="240" fill="#f97316" fontSize="9" fontWeight="bold">
                Saluran Magma Menuju Puncak Merapi 🌋
              </text>

              {/* Transform Fault Cut */}
              <line x1="200" y1="70" x2="350" y2="330" stroke="#f43f5e" strokeWidth="6" strokeDasharray="10 5" />
              <text x="140" y="220" fill="#f43f5e" fontSize="9" fontWeight="bold">
                Patahan Sesar Geser (Transform) ⚡
              </text>
            </g>
          )}

          {/* ── 9. CLICKABLE HOTSPOTS PINS ── */}
          {!showSubsurface &&
            CITY_HOTSPOTS.map((h) => {
              const isSelected = selectedHotspot?.id === h.id;
              return (
                <g
                  key={h.id}
                  transform={`translate(${(h.x / 100) * 1000}, ${(h.y / 100) * 600})`}
                  onClick={() => {
                    retroAudio.playSelect();
                    setSelectedHotspot(h);
                    if (onSelectHotspot) onSelectHotspot(h.id);
                  }}
                  className="cursor-pointer transition-transform hover:scale-125"
                >
                  {/* Outer Pulsing Ping */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isSelected ? 18 : 12}
                    fill={h.category === 'vulkanik' ? '#ef4444' : h.category === 'sesar' ? '#f59e0b' : h.category === 'aman' ? '#22c55e' : '#38bdf8'}
                    opacity="0.4"
                    className="animate-ping"
                  />
                  {/* Pin Background Disc */}
                  <circle
                    cx="0"
                    cy="0"
                    r="10"
                    fill={h.category === 'vulkanik' ? '#dc2626' : h.category === 'sesar' ? '#d97706' : h.category === 'aman' ? '#16a34a' : '#0284c7'}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {/* Pin Icon / Number */}
                  <circle cx="0" cy="0" r="3" fill="#ffffff" />
                </g>
              );
            })}
        </svg>
      </div>

      {/* ── 10. HOTSPOT INSPECTOR POPUP MODAL ── */}
      {selectedHotspot && (
        <div className="absolute inset-x-4 bottom-4 z-40 bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border-2 border-amber-500/60 shadow-2xl animate-fade-in flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-left">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-950 border border-amber-500/50 flex items-center justify-center shrink-0">
              <PixelIcon name={selectedHotspot.icon} size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-pixel-title text-[9px] font-bold border border-amber-500/30">
                  {selectedHotspot.badge}
                </span>
                <h4 className="text-xs md:text-sm font-bold text-amber-100">{selectedHotspot.name}</h4>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">{selectedHotspot.desc}</p>
              <p className="text-[10px] text-amber-400/90 font-mono mt-0.5">
                🔬 <strong>Konteks Geologis:</strong> {selectedHotspot.geologyNote}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              retroAudio.playSelect();
              setSelectedHotspot(null);
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-600 text-white font-pixel-title text-[10px] shrink-0 border border-amber-950 shadow cursor-pointer self-end md:self-center"
          >
            TUTUP INFO
          </button>
        </div>
      )}
    </div>
  );
}
