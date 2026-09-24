import { useState, useEffect, useRef } from 'react';

const VOLCANO_PARTS = [
  { id: 'kawah', name: 'Kawah', desc: 'Lubang besar di puncak gunung tempat keluarnya material vulkanik saat erupsi.', y: 12 },
  { id: 'saluran', name: 'Saluran Utama', desc: 'Pipa vertikal yang menghubungkan dapur magma ke kawah. Tempat magma naik ke permukaan.', y: 45 },
  { id: 'magma-chamber', name: 'Dapur Magma', desc: 'Ruang besar di bawah gunung berisi batuan cair bersuhu sangat tinggi (magma).', y: 85 },
  { id: 'lereng', name: 'Lereng Gunung', desc: 'Sisi gunung tempat material erupsi mengalir turun — termasuk awan panas dan lahar.', y: 40 },
];

const WARNING_SIGNS = [
  { icon: 'vibration', title: 'Gempa Vulkanik', desc: 'Getaran berulang dari dalam gunung, semakin sering menjelang erupsi.', color: '#f59e0b' },
  { icon: 'thermometer', title: 'Suhu Meningkat', desc: 'Suhu di kawah dan sekitar gunung naik secara drastis.', color: '#ef4444' },
  { icon: 'water_drop', title: 'Mata Air Kering', desc: 'Sumber air di lereng gunung mendadak kering atau berubah warna.', color: '#3b82f6' },
  { icon: 'cloud', title: 'Asap Membesar', desc: 'Kolom asap dari kawah semakin tinggi dan tebal.', color: '#a8a29e' },
  { icon: 'volcano', title: 'Erupsi!', desc: 'Letusan terjadi — lontaran material, awan panas, dan hujan abu.', color: '#dc2626' },
];

const DANGER_ZONES = [
  { id: 'red', name: 'Zona Merah', radius: '0–5 km', color: '#dc2626', opacity: 0.35, r: 28, desc: 'Bahaya langsung: awan panas, lontaran batu, aliran lava. DILARANG ada aktivitas.' },
  { id: 'yellow', name: 'Zona Kuning', radius: '5–10 km', color: '#eab308', opacity: 0.2, r: 50, desc: 'Bahaya abu vulkanik tebal, lahar dingin saat hujan. Siaga evakuasi.' },
  { id: 'green', name: 'Zona Hijau', radius: '>10 km', color: '#22c55e', opacity: 0.1, r: 75, desc: 'Relatif aman. Tetap waspada dan ikuti arahan BPBD.' },
];

function EruptionSimulator() {
  const [phase, setPhase] = useState(-1); // -1 = idle, 0-4 = phases
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const startEruption = () => {
    setPhase(0);
  };

  useEffect(() => {
    if (phase >= 0 && phase < 5) {
      timerRef.current = setTimeout(() => setPhase(p => p + 1), 2000);
    }
    if (phase >= 5) {
      timerRef.current = setTimeout(() => setPhase(-1), 4000);
    }
    return () => clearTimeout(timerRef.current);
  }, [phase]);

  const isActive = phase >= 0;
  const shakeClass = phase >= 0 && phase <= 1 ? 'animate-shake' : phase >= 2 ? 'animate-shake-heavy' : '';

  return (
    <div className="w-full">
      <div className={`rounded-2xl overflow-hidden bg-gradient-to-b from-sky-950 via-sky-900 to-stone-900 border border-outline-variant/20 relative ${shakeClass}`}>
        <svg viewBox="0 0 400 220" className="w-full h-48">
          {/* Sky */}
          <rect x="0" y="0" width="400" height="100" fill="url(#sky-grad)" />
          <defs>
            <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={phase >= 3 ? '#44403c' : '#0c4a6e'} />
              <stop offset="100%" stopColor={phase >= 3 ? '#78716c' : '#0369a1'} />
            </linearGradient>
          </defs>

          {/* Ground */}
          <rect x="0" y="160" width="400" height="60" fill="#365314" opacity="0.4" />

          {/* Volcano body */}
          <polygon points="100,160 200,50 300,160" fill="#57534e" />
          <polygon points="130,160 200,65 270,160" fill="#78716c" />

          {/* Magma chamber (always visible, glows when active) */}
          <ellipse cx="200" cy="190" rx="40" ry="20" fill="#dc2626" opacity={isActive ? 0.5 : 0.2}>
            {isActive && <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1s" repeatCount="indefinite" />}
          </ellipse>

          {/* Magma conduit */}
          <rect x="195" y="70" width="10" height="120" fill="#ef4444" opacity={isActive ? 0.4 : 0.1} />

          {/* Phase 0: Tremors - small vibration lines */}
          {phase >= 0 && (
            <g>
              {[150, 200, 250].map((x, i) => (
                <line key={i} x1={x} y1="155" x2={x} y2="165" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6">
                  <animate attributeName="x1" values={`${x};${x + 3};${x - 3};${x}`} dur="0.3s" repeatCount="indefinite" />
                  <animate attributeName="x2" values={`${x};${x - 3};${x + 3};${x}`} dur="0.3s" repeatCount="indefinite" />
                </line>
              ))}
            </g>
          )}

          {/* Phase 1+: Growing smoke */}
          {phase >= 1 && (
            <g>
              {[0, 1, 2].map((i) => (
                <circle key={`smoke-${i}`} cx={195 + i * 5} cy="48" r={8 + phase * 4} fill="#a8a29e" opacity={0.3 + phase * 0.05}>
                  <animate attributeName="cy" from="48" to={-10 - phase * 15} dur={`${3 - phase * 0.3}s`} repeatCount="indefinite" />
                  <animate attributeName="r" from={8 + phase * 3} to={20 + phase * 8} dur={`${3 - phase * 0.3}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" from={0.4} to="0" dur={`${3 - phase * 0.3}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </g>
          )}

          {/* Phase 2+: Lava eruption */}
          {phase >= 2 && (
            <g>
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = -90 + (i - 3.5) * 20;
                const rad = (angle * Math.PI) / 180;
                const endX = 200 + Math.cos(rad) * (60 + i * 8);
                const endY = 50 + Math.sin(rad) * (60 + i * 8);
                return (
                  <circle key={`rock-${i}`} cx="200" cy="50" r={2 + Math.random() * 2} fill={i % 2 === 0 ? '#ef4444' : '#f97316'}>
                    <animate attributeName="cx" from="200" to={endX} dur={`${1 + i * 0.2}s`} repeatCount="indefinite" />
                    <animate attributeName="cy" from="50" to={endY} dur={`${1 + i * 0.2}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" from="1" to="0" dur={`${1 + i * 0.2}s`} repeatCount="indefinite" />
                  </circle>
                );
              })}
            </g>
          )}

          {/* Phase 3+: Pyroclastic flow (awan panas) */}
          {phase >= 3 && (
            <g>
              <ellipse cx="200" cy="130" rx="20" ry="15" fill="#ef4444" opacity="0.4">
                <animate attributeName="cx" from="200" to="100" dur="3s" repeatCount="indefinite" />
                <animate attributeName="rx" from="20" to="60" dur="3s" repeatCount="indefinite" />
                <animate attributeName="cy" from="100" to="155" dur="3s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="200" cy="130" rx="20" ry="15" fill="#f97316" opacity="0.3">
                <animate attributeName="cx" from="200" to="310" dur="3.5s" repeatCount="indefinite" />
                <animate attributeName="rx" from="20" to="55" dur="3.5s" repeatCount="indefinite" />
                <animate attributeName="cy" from="100" to="155" dur="3.5s" repeatCount="indefinite" />
              </ellipse>
            </g>
          )}

          {/* Phase 4+: Ash fall */}
          {phase >= 4 && (
            <g>
              {Array.from({ length: 30 }).map((_, i) => (
                <circle
                  key={`ash-${i}`}
                  cx={Math.random() * 400}
                  cy={-10}
                  r={1 + Math.random()}
                  fill="#a8a29e"
                  opacity="0.5"
                >
                  <animate attributeName="cy" from={-10 - Math.random() * 30} to="220" dur={`${2 + Math.random() * 3}s`} repeatCount="indefinite" />
                  <animate attributeName="cx" values={`${Math.random() * 400};${Math.random() * 400}`} dur={`${3 + Math.random() * 2}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </g>
          )}

          {/* Phase label */}
          {phase >= 0 && phase < 5 && (
            <g>
              <rect x="10" y="5" width="180" height="22" fill="rgba(0,0,0,0.6)" rx="6" />
              <text x="20" y="20" fontSize="10" fill="white" fontWeight="bold">
                {phase === 0 && 'Fase 1: Gempa Vulkanik'}
                {phase === 1 && 'Fase 2: Asap Membesar'}
                {phase === 2 && 'Fase 3: Lontaran Material'}
                {phase === 3 && 'Fase 4: Awan Panas (Wedhus Gembel)'}
                {phase === 4 && 'Fase 5: Hujan Abu Vulkanik'}
              </text>
            </g>
          )}
        </svg>
      </div>

      <button
        onClick={startEruption}
        disabled={isActive}
        className={`mt-3 w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
          isActive
            ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
            : 'bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-500 hover:to-orange-400 shadow-lg hover:shadow-xl'
        }`}
      >
        <span className="material-symbols-outlined text-lg">volcano</span>
        {isActive ? `Erupsi berlangsung... (Fase ${phase + 1}/5)` : 'Simulasikan Erupsi!'}
      </button>
    </div>
  );
}

export default function GunungMerapi() {
  const [activePart, setActivePart] = useState<string | null>(null);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [activeSign, setActiveSign] = useState(0);

  const part = VOLCANO_PARTS.find(p => p.id === activePart);

  return (
    <div className="py-4 max-w-3xl mx-auto flex flex-col gap-6">
      {/* Hero banner */}
      <div className="relative h-32 rounded-2xl overflow-hidden bg-gradient-to-r from-stone-900 to-stone-800 flex items-center justify-center">
        <svg viewBox="0 0 400 120" className="absolute inset-0 w-full h-full opacity-40">
          <polygon points="50,120 180,30 Q200,15 220,30 350,120" fill="#44403c" />
          <polygon points="170,50 Q200,25 230,50 L200,120 Z" fill="#ef4444" className="animate-pulse" />
          {[0, 1, 2].map(i => (
            <circle key={i} cx={195 + i * 10} cy={20 - i * 5} r={8 + i * 5} fill="#78716c" opacity={0.4}>
              <animate attributeName="cy" from={20 - i * 5} to={-20 - i * 10} dur={`${3 + i}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.4" to="0" dur={`${3 + i}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>
        <div className="relative z-10 text-center">
          <h3 className="text-2xl font-black text-white drop-shadow-md">Gunung Merapi</h3>
          <p className="text-white/70 text-sm font-medium">Gunung Api Paling Aktif di Indonesia</p>
        </div>
      </div>

      {/* Interactive Volcano Anatomy */}
      <div>
        <h4 className="text-sm font-bold text-on-surface mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">science</span>
          Anatomi Gunung Api (Klik bagian untuk menjelajahi)
        </h4>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-64 shrink-0">
            <svg viewBox="0 0 200 140" className="w-full rounded-2xl bg-gradient-to-b from-sky-950 to-stone-900">
              {/* Ground */}
              <rect x="0" y="100" width="200" height="40" fill="#365314" opacity="0.3" />

              {/* Volcano body */}
              <polygon points="30,100 100,20 170,100" fill="#57534e" />
              <polygon points="50,100 100,30 150,100" fill="#78716c" />

              {/* Kawah */}
              <ellipse
                cx="100" cy="22" rx="15" ry="5"
                fill={activePart === 'kawah' ? '#ef4444' : '#44403c'}
                stroke={activePart === 'kawah' ? 'white' : 'transparent'}
                strokeWidth="1.5"
                className="cursor-pointer transition-all duration-300"
                onClick={() => setActivePart(activePart === 'kawah' ? null : 'kawah')}
              />

              {/* Saluran */}
              <rect
                x="96" y="27" width="8" height="65"
                fill={activePart === 'saluran' ? '#ef4444' : '#ef4444'}
                opacity={activePart === 'saluran' ? 0.7 : 0.25}
                stroke={activePart === 'saluran' ? 'white' : 'transparent'}
                strokeWidth="1.5"
                className="cursor-pointer transition-all duration-300"
                onClick={() => setActivePart(activePart === 'saluran' ? null : 'saluran')}
              />

              {/* Magma chamber */}
              <ellipse
                cx="100" cy="110" rx="35" ry="18"
                fill={activePart === 'magma-chamber' ? '#dc2626' : '#dc2626'}
                opacity={activePart === 'magma-chamber' ? 0.6 : 0.2}
                stroke={activePart === 'magma-chamber' ? 'white' : 'transparent'}
                strokeWidth="1.5"
                className="cursor-pointer transition-all duration-300"
                onClick={() => setActivePart(activePart === 'magma-chamber' ? null : 'magma-chamber')}
              >
                <animate attributeName="opacity" values={activePart === 'magma-chamber' ? '0.5;0.7;0.5' : '0.15;0.25;0.15'} dur="2s" repeatCount="indefinite" />
              </ellipse>

              {/* Lereng clickable */}
              <polygon
                points="30,100 65,55 100,30 100,100"
                fill={activePart === 'lereng' ? 'rgba(255,255,255,0.15)' : 'transparent'}
                stroke={activePart === 'lereng' ? 'white' : 'transparent'}
                strokeWidth="1"
                strokeDasharray="3 2"
                className="cursor-pointer"
                onClick={() => setActivePart(activePart === 'lereng' ? null : 'lereng')}
              />

              {/* Smoke */}
              <circle cx="100" cy="15" r="5" fill="#a8a29e" opacity="0.3">
                <animate attributeName="cy" from="15" to="-5" dur="3s" repeatCount="indefinite" />
                <animate attributeName="r" from="5" to="12" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.3" to="0" dur="3s" repeatCount="indefinite" />
              </circle>

              {/* Hint pulse */}
              {!activePart && (
                <circle cx="100" cy="22" r="8" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5">
                  <animate attributeName="r" from="8" to="20" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
            </svg>
          </div>

          {/* Part info */}
          <div className="flex-1 min-w-0">
            {part ? (
              <div className="animate-fade-in p-4 rounded-xl bg-surface-variant/30 border border-outline-variant/30">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-on-surface">{part.name}</h4>
                  <button onClick={() => setActivePart(null)} className="p-1 rounded-full hover:bg-surface-variant">
                    <span className="material-symbols-outlined text-sm text-on-surface-variant">close</span>
                  </button>
                </div>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">{part.desc}</p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-4 rounded-xl border border-dashed border-outline-variant/30 text-center">
                <p className="text-xs text-on-surface-variant">Klik bagian gunung api pada diagram untuk melihat penjelasan.</p>
              </div>
            )}

            {/* Quick buttons */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              {VOLCANO_PARTS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActivePart(activePart === p.id ? null : p.id)}
                  className={`text-xs font-bold py-2 px-3 rounded-lg transition-all ${
                    activePart === p.id ? 'bg-primary text-on-primary' : 'bg-surface-variant/40 text-on-surface-variant hover:bg-surface-variant/60'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Eruption Simulator */}
      <div>
        <h4 className="text-sm font-bold text-on-surface mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">volcano</span>
          Simulasi Erupsi
        </h4>
        <EruptionSimulator />
      </div>

      {/* Danger Zone Map */}
      <div>
        <h4 className="text-sm font-bold text-on-surface mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">crisis_alert</span>
          Zona Bahaya Gunung Merapi
        </h4>
        <div className="rounded-2xl bg-gradient-to-b from-stone-900 to-stone-800 border border-outline-variant/20 p-4">
          <svg viewBox="0 0 300 200" className="w-full h-44 mx-auto">
            {/* Concentric danger zones */}
            {[...DANGER_ZONES].reverse().map(z => (
              <circle
                key={z.id}
                cx="150" cy="90"
                r={z.r}
                fill={z.color}
                opacity={activeZone === z.id ? z.opacity + 0.15 : z.opacity}
                stroke={activeZone === z.id ? 'white' : z.color}
                strokeWidth={activeZone === z.id ? 1.5 : 0.5}
                className="cursor-pointer transition-all duration-300"
                onClick={() => setActiveZone(activeZone === z.id ? null : z.id)}
              />
            ))}

            {/* Volcano icon center */}
            <polygon points="143,85 150,70 157,85" fill="#78716c" />
            <circle cx="150" cy="68" r="3" fill="#a8a29e" opacity="0.5">
              <animate attributeName="cy" from="68" to="60" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* Zone labels */}
            {DANGER_ZONES.map(z => (
              <text
                key={`label-${z.id}`}
                x="150" y={90 + z.r - 8}
                textAnchor="middle"
                fontSize="7"
                fill={z.color}
                fontWeight="bold"
                className="select-none pointer-events-none"
                opacity="0.8"
              >
                {z.radius}
              </text>
            ))}
          </svg>

          {/* Zone buttons */}
          <div className="flex gap-2 mt-2">
            {DANGER_ZONES.map(z => (
              <button
                key={z.id}
                onClick={() => setActiveZone(activeZone === z.id ? null : z.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[11px] font-bold transition-all duration-300 border ${
                  activeZone === z.id ? 'bg-white/10 border-white/30' : 'border-transparent hover:bg-white/5'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: z.color }} />
                {z.name}
              </button>
            ))}
          </div>

          {/* Zone detail */}
          {activeZone && (
            <div className="mt-3 p-3 rounded-xl bg-black/30 border border-white/10 animate-fade-in">
              <p className="text-xs text-white/80 leading-relaxed">
                {DANGER_ZONES.find(z => z.id === activeZone)?.desc}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Warning Signs Timeline */}
      <div>
        <h4 className="text-sm font-bold text-on-surface mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">timeline</span>
          Tanda-tanda Erupsi
        </h4>
        <div className="relative">
          {/* Timeline bar */}
          <div className="flex items-center gap-0 mb-4">
            {WARNING_SIGNS.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center relative">
                {/* Connector line */}
                {i < WARNING_SIGNS.length - 1 && (
                  <div className={`absolute top-4 left-1/2 w-full h-0.5 ${i < activeSign ? 'bg-primary' : 'bg-outline-variant/30'} transition-colors duration-500`} />
                )}
                {/* Dot */}
                <button
                  onClick={() => setActiveSign(i)}
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    i === activeSign ? 'scale-125 shadow-lg' : i < activeSign ? 'scale-100' : 'scale-90 opacity-50'
                  }`}
                  style={{ backgroundColor: i <= activeSign ? s.color : 'rgba(255,255,255,0.1)' }}
                >
                  <span className="material-symbols-outlined text-white text-sm">{s.icon}</span>
                </button>
                <span className={`text-[9px] mt-1.5 font-bold text-center leading-tight ${i === activeSign ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>

          {/* Detail card */}
          <div key={activeSign} className="p-4 rounded-xl border animate-fade-in" style={{ borderColor: WARNING_SIGNS[activeSign].color + '40', backgroundColor: WARNING_SIGNS[activeSign].color + '10' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-lg" style={{ color: WARNING_SIGNS[activeSign].color }}>{WARNING_SIGNS[activeSign].icon}</span>
              <span className="font-bold text-on-surface text-sm">{WARNING_SIGNS[activeSign].title}</span>
              <span className="ml-auto text-[10px] text-on-surface-variant font-bold">Fase {activeSign + 1}/{WARNING_SIGNS.length}</span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">{WARNING_SIGNS[activeSign].desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
