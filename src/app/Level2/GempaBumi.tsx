import { useState, useRef, useCallback } from 'react';
import InteractiveCard from '../components/InteractiveCard';

const RICHTER_DATA = [
  { max: 2, label: 'Mikro', desc: 'Tidak terasa oleh manusia.', damage: 'Tidak ada', buildingState: 0 },
  { max: 4, label: 'Ringan', desc: 'Terasa oleh beberapa orang di dalam ruangan.', damage: 'Sangat ringan', buildingState: 1 },
  { max: 5, label: 'Sedang', desc: 'Terasa oleh hampir semua orang. Benda-benda kecil bergeser.', damage: 'Ringan', buildingState: 2 },
  { max: 6, label: 'Kuat', desc: 'Kerusakan pada bangunan lemah. Orang sulit berdiri.', damage: 'Sedang', buildingState: 3 },
  { max: 7, label: 'Besar', desc: 'Bangunan hancur. Tanah retak. Longsor.', damage: 'Berat', buildingState: 4 },
  { max: 10, label: 'Dahsyat', desc: 'Kerusakan total. Gelombang terlihat di tanah.', damage: 'Sangat berat', buildingState: 5 },
];

const HISTORICAL_QUAKES = [
  { mag: 5.6, year: 2022, place: 'Cianjur, Jawa Barat' },
  { mag: 6.2, year: 2021, place: 'Mamuju, Sulawesi Barat' },
  { mag: 7.5, year: 2018, place: 'Palu, Sulawesi Tengah' },
  { mag: 9.1, year: 2004, place: 'Aceh (Megathrust)' },
];

function SeismicVisualizer() {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const idRef = useRef(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 400;
    const y = ((e.clientY - rect.top) / rect.height) * 200;
    const id = idRef.current++;
    setRipples((prev) => [...prev.slice(-5), { x, y, id }]);
    // Auto cleanup after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 3000);
  }, []);

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-gradient-to-b from-stone-900 to-stone-800 border border-outline-variant/20">
      <svg
        ref={svgRef}
        viewBox="0 0 400 200"
        className="w-full h-40 cursor-crosshair"
        onClick={handleClick}
      >
        <defs>
          <filter id="gempa-smoke-filter" x="-40%" y="-40%" width="180%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="2.5" />
          </filter>
          <radialGradient id="gempaSmokeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#94a3b8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#64748b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ground surface line */}
        <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <text x="10" y="75" fontSize="8" fill="rgba(255,255,255,0.3)">Permukaan</text>
        <text x="10" y="140" fontSize="8" fill="rgba(255,255,255,0.3)">Kedalaman</text>

        {/* Grid */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1={i * 50} y1="0" x2={i * 50} y2="200" stroke="rgba(255,255,255,0.03)" />
        ))}

        {/* Ripple waves */}
        {ripples.map((r) => (
          <g key={r.id}>
            {[0, 1, 2, 3, 4].map((ring) => (
              <circle
                key={ring}
                cx={r.x}
                cy={r.y}
                r="5"
                fill="none"
                stroke={ring < 2 ? '#ef4444' : '#f97316'}
                strokeWidth={2 - ring * 0.3}
              >
                <animate
                  attributeName="r"
                  from="5"
                  to={80 + ring * 20}
                  dur={`${1.5 + ring * 0.4}s`}
                  begin={`${ring * 0.2}s`}
                  fill="freeze"
                />
                <animate
                  attributeName="opacity"
                  from="0.8"
                  to="0"
                  dur={`${1.5 + ring * 0.4}s`}
                  begin={`${ring * 0.2}s`}
                  fill="freeze"
                />
              </circle>
            ))}
            {/* Epicenter dot */}
            <circle cx={r.x} cy={r.y} r="4" fill="#ef4444">
              <animate attributeName="r" from="4" to="2" dur="0.5s" fill="freeze" />
            </circle>
            <text x={r.x + 8} y={r.y - 8} fontSize="7" fill="#fca5a5" fontWeight="bold">Episentrum</text>
          </g>
        ))}

        {/* Default hint */}
        {ripples.length === 0 && (
          <g>
            <text x="200" y="100" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.4)" fontWeight="bold">
              Klik di mana saja untuk membuat gempa!
            </text>
            <circle cx="200" cy="115" r="3" fill="rgba(255,255,255,0.2)">
              <animate attributeName="r" from="3" to="20" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        )}
      </svg>
    </div>
  );
}

function EarthquakeTypeComparison() {
  const [type, setType] = useState<'tektonik' | 'vulkanik'>('tektonik');

  return (
    <div className="w-full">
      {/* Toggle */}
      <div className="flex rounded-xl bg-surface-variant/40 p-1 mb-4">
        <button
          onClick={() => setType('tektonik')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-[13px] font-bold transition-all duration-300 ${
            type === 'tektonik' ? 'bg-orange-500 text-white shadow-md' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[15px] align-middle mr-1 font-semibold">broken_image</span>
          Gempa Tektonik
        </button>
        <button
          onClick={() => setType('vulkanik')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-[13px] font-bold transition-all duration-300 ${
            type === 'vulkanik' ? 'bg-rose-500 text-white shadow-md' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[15px] align-middle mr-1 font-semibold">volcano</span>
          Gempa Vulkanik
        </button>
      </div>

      {/* Animation */}
      <div key={type} className="rounded-2xl bg-gradient-to-b from-stone-900 to-stone-800 border border-outline-variant/20 overflow-hidden animate-fade-in">
        <svg viewBox="0 0 400 160" className="w-full h-36">
          {/* Underground */}
          <rect x="0" y="60" width="400" height="100" fill="#44403c" opacity="0.5" />
          <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

          {type === 'tektonik' ? (
            <g>
              {/* Two plates colliding */}
              <rect x="20" y="55" width="170" height="20" fill="#3b82f6" rx="3" opacity="0.8">
                <animateTransform attributeName="transform" type="translate" values="0,0;6,0;0,0" dur="3s" repeatCount="indefinite" />
              </rect>
              <rect x="210" y="55" width="170" height="20" fill="#22c55e" rx="3" opacity="0.8">
                <animateTransform attributeName="transform" type="translate" values="0,0;-6,0;0,0" dur="3s" repeatCount="indefinite" />
              </rect>
              <text x="80" y="69" fontSize="8" fill="white" fontWeight="bold">→ Lempeng A</text>
              <text x="270" y="69" fontSize="8" fill="white" fontWeight="bold">Lempeng B ←</text>

              {/* Collision point waves */}
              {[0, 1, 2].map((i) => (
                <circle key={i} cx="200" cy="65" r="5" fill="none" stroke="#ef4444" strokeWidth="1">
                  <animate attributeName="r" from="5" to={40 + i * 15} dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.6" to="0" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
                </circle>
              ))}

              {/* Buildings shaking on surface */}
              {[100, 200, 300].map((x, i) => (
                <g key={x}>
                  <rect x={x - 8} y="38" width="16" height="22" fill="#78716c" rx="2">
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0;2,0;-2,0;1,0;0,0"
                      dur="0.5s"
                      repeatCount="indefinite"
                      begin={`${i * 0.1}s`}
                    />
                  </rect>
                </g>
              ))}

              <text x="200" y="130" textAnchor="middle" fontSize="9" fill="#fca5a5" fontWeight="bold">
                Jangkauan luas • Sering merusak
              </text>
            </g>
          ) : (
            <g>
              {/* Volcano */}
              <polygon points="160,60 200,15 240,60" fill="#57534e" />
              <polygon points="180,60 200,25 220,60" fill="#78716c" />

              {/* Magma rising */}
              <circle cx="200" cy="100" r="8" fill="#ef4444" opacity="0.6">
                <animate attributeName="cy" from="110" to="40" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.8" to="0" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="195" cy="90" r="5" fill="#f97316" opacity="0.5">
                <animate attributeName="cy" from="100" to="45" dur="3.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.7" to="0" dur="3.5s" repeatCount="indefinite" />
              </circle>

              {/* Localized waves from volcano */}
              {[0, 1].map((i) => (
                <circle key={i} cx="200" cy="65" r="5" fill="none" stroke="#f97316" strokeWidth="1">
                  <animate attributeName="r" from="5" to={25 + i * 10} dur={`${1.5 + i * 0.5}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.6" to="0" dur={`${1.5 + i * 0.5}s`} repeatCount="indefinite" />
                </circle>
              ))}

              {/* Realistic Volcanic Smoke Wisp */}
              <g filter="url(#gempa-smoke-filter)">
                <ellipse cx="200" cy="14" rx="8" ry="6" fill="url(#gempaSmokeGrad)" opacity="0.75">
                  <animate attributeName="cy" from="16" to="-12" dur="2.8s" repeatCount="indefinite" />
                  <animate attributeName="rx" from="6" to="18" dur="2.8s" repeatCount="indefinite" />
                  <animate attributeName="ry" from="4" to="12" dur="2.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.75" to="0" dur="2.8s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx="204" cy="10" rx="6" ry="5" fill="url(#gempaSmokeGrad)" opacity="0.6">
                  <animate attributeName="cy" from="14" to="-16" dur="3.2s" begin="0.8s" repeatCount="indefinite" />
                  <animate attributeName="rx" from="5" to="16" dur="3.2s" begin="0.8s" repeatCount="indefinite" />
                  <animate attributeName="ry" from="4" to="10" dur="3.2s" begin="0.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.6" to="0" dur="3.2s" begin="0.8s" repeatCount="indefinite" />
                </ellipse>
              </g>

              {/* Magma chamber label */}
              <ellipse cx="200" cy="110" rx="30" ry="15" fill="#dc2626" opacity="0.3" />
              <text x="200" y="115" textAnchor="middle" fontSize="7" fill="#fca5a5">Magma</text>

              <text x="200" y="150" textAnchor="middle" fontSize="9" fill="#fdba74" fontWeight="bold">
                Jangkauan lokal • Tanda erupsi
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

function RichterSlider() {
  const [mag, setMag] = useState(3);

  const level = RICHTER_DATA.find((d) => mag <= d.max) || RICHTER_DATA[RICHTER_DATA.length - 1];
  const nearestHistorical = HISTORICAL_QUAKES.reduce((best, q) =>
    Math.abs(q.mag - mag) < Math.abs(best.mag - mag) ? q : best
  , HISTORICAL_QUAKES[0]);

  // Shake intensity based on magnitude
  const shakeClass = mag >= 7 ? 'animate-shake-heavy' : mag >= 5 ? 'animate-shake' : '';

  return (
    <div className="w-full">
      {/* Slider */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-[13px] font-bold text-on-surface-variant w-8">1.0</span>
        <input
          type="range"
          min="1"
          max="9.5"
          step="0.1"
          value={mag}
          onChange={(e) => setMag(parseFloat(e.target.value))}
          className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #22c55e 0%, #eab308 40%, #ef4444 70%, #7f1d1d 100%)`,
          }}
        />
        <span className="text-[13px] font-bold text-on-surface-variant w-8">9.5</span>
      </div>

      {/* Magnitude display */}
      <div className={`flex items-center justify-between p-4 rounded-2xl bg-surface-variant/30 border border-outline-variant/30 ${shakeClass}`}>
        <div>
          <div className="text-3xl font-black text-on-surface tabular-nums">{mag.toFixed(1)} <span className="text-base font-bold text-on-surface-variant">SR</span></div>
          <div className="text-[15px] font-bold" style={{ color: mag >= 7 ? '#ef4444' : mag >= 5 ? '#f59e0b' : '#22c55e' }}>
            {level.label}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[13px] text-on-surface-variant leading-relaxed max-w-48 font-semibold">{level.desc}</p>
          <p className="text-[13px] text-on-surface-variant mt-1 font-semibold">Kerusakan: <strong>{level.damage}</strong></p>
        </div>
      </div>

      {/* Building visualization */}
      <div className={`mt-3 rounded-xl bg-gradient-to-b from-sky-950 to-sky-900 p-4 overflow-hidden ${shakeClass}`}>
        <svg viewBox="0 0 300 80" className="w-full h-16">
          {/* Ground */}
          <line x1="0" y1="70" x2="300" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

          {/* Buildings with progressive damage */}
          {[50, 110, 170, 230].map((x, i) => {
            const h = 30 + i * 8;
            const dmg = level.buildingState;
            const tilt = dmg >= 4 ? 8 + i * 3 : dmg >= 3 ? 3 + i : 0;
            const cracked = dmg >= 2;

            return (
              <g key={x} transform={`rotate(${tilt}, ${x}, 70)`}>
                <rect
                  x={x - 10}
                  y={70 - h}
                  width="20"
                  height={h}
                  fill={dmg >= 5 ? '#78716c' : dmg >= 3 ? '#a8a29e' : '#d6d3d1'}
                  rx="2"
                  opacity={dmg >= 5 ? 0.4 : 1}
                >
                  {dmg >= 1 && dmg < 5 && (
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values={`0,0;${dmg},0;${-dmg},0;0,0`}
                      dur={`${0.5 - dmg * 0.05}s`}
                      repeatCount="indefinite"
                    />
                  )}
                </rect>
                {/* Windows */}
                {dmg < 5 && [0, 1, 2].map((wi) => (
                  <rect
                    key={wi}
                    x={x - 5}
                    y={70 - h + 5 + wi * 10}
                    width="10"
                    height="6"
                    fill={cracked ? '#ef4444' : '#60a5fa'}
                    opacity={cracked ? 0.3 : 0.5}
                    rx="1"
                  />
                ))}
                {/* Rubble for destroyed */}
                {dmg >= 5 && (
                  <g>
                    <rect x={x - 12} y="65" width="24" height="5" fill="#78716c" rx="1" opacity="0.6" />
                    <rect x={x - 8} y="62" width="6" height="8" fill="#a8a29e" rx="1" opacity="0.4" transform={`rotate(20,${x - 5},66)`} />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Historical reference */}
      <div className="mt-3 p-3 rounded-xl bg-primary/8 border border-primary/15 text-[13px] text-on-surface font-semibold">
        <span className="font-bold text-primary">Referensi:</span> Gempa {nearestHistorical.place} ({nearestHistorical.year}) — {nearestHistorical.mag} SR
      </div>
    </div>
  );
}

export default function GempaBumi() {
  return (
    <div className="py-4 max-w-3xl mx-auto flex flex-col gap-6">
      {/* Intro */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/15">
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-red-500 text-2xl font-medium">sensors</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-on-surface">Apa itu Gempa Bumi?</h3>
          <p className="text-[15px] text-on-surface-variant leading-relaxed font-semibold">
            Getaran permukaan bumi akibat pelepasan energi dari dalam secara tiba-tiba, sering kali dari pergerakan lempeng tektonik.
          </p>
        </div>
      </div>

      {/* Seismic Visualizer */}
      <div>
        <h4 className="text-[15px] font-bold text-on-surface mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg font-medium">radar</span>
          Visualisasi Gelombang Seismik
        </h4>
        <SeismicVisualizer />
      </div>

      {/* Earthquake Type Comparison */}
      <div>
        <h4 className="text-[15px] font-bold text-on-surface mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg font-medium">compare</span>
          Jenis Gempa
        </h4>
        <EarthquakeTypeComparison />
      </div>

      {/* Richter Scale */}
      <div>
        <h4 className="text-[15px] font-bold text-on-surface mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg font-medium">speed</span>
          Skala Richter — Geser untuk Merasakan!
        </h4>
        <RichterSlider />
      </div>

      {/* Safety Flip Cards */}
      <div>
        <h4 className="text-[15px] font-bold text-on-surface mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg font-medium">health_and_safety</span>
          Apa yang Harus Dilakukan? (Klik untuk balik)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <InteractiveCard
            className="h-40"
            frontClassName="bg-gradient-to-br from-blue-500/15 to-blue-500/5 border border-blue-500/20"
            backClassName="bg-gradient-to-br from-blue-600/20 to-blue-500/10 border border-blue-500/30"
            front={
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl text-blue-400 font-medium">home</span>
                <span className="text-[15px] font-bold text-on-surface">Di Dalam Ruangan</span>
                <span className="text-[13.5px] text-on-surface-variant font-semibold">Klik untuk tips</span>
              </div>
            }
            back={
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[13px] font-bold text-blue-400 mb-1">DROP • COVER • HOLD</span>
                <p className="text-[14.5px] text-on-surface leading-relaxed text-center font-semibold">
                  Merunduk, berlindung di bawah meja kokoh, dan pegang kuat-kuat. Jauhi jendela kaca.
                </p>
              </div>
            }
          />
          <InteractiveCard
            className="h-40"
            frontClassName="bg-gradient-to-br from-green-500/15 to-green-500/5 border border-green-500/20"
            backClassName="bg-gradient-to-br from-green-600/20 to-green-500/10 border border-green-500/30"
            front={
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl text-green-400 font-medium">park</span>
                <span className="text-[15px] font-bold text-on-surface">Di Luar Ruangan</span>
                <span className="text-[13.5px] text-on-surface-variant font-semibold">Klik untuk tips</span>
              </div>
            }
            back={
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[13px] font-bold text-green-400 mb-1">JAUHI BANGUNAN</span>
                <p className="text-[14.5px] text-on-surface leading-relaxed text-center font-semibold">
                  Pergi ke area terbuka. Jauhi bangunan, tiang listrik, pohon besar, dan papan reklame.
                </p>
              </div>
            }
          />
          <InteractiveCard
            className="h-40"
            frontClassName="bg-gradient-to-br from-amber-500/15 to-amber-500/5 border border-amber-500/20"
            backClassName="bg-gradient-to-br from-amber-600/20 to-amber-500/10 border border-amber-500/30"
            front={
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl text-amber-400 font-medium">directions_car</span>
                <span className="text-[15px] font-bold text-on-surface">Di Kendaraan</span>
                <span className="text-[13.5px] text-on-surface-variant font-semibold">Klik untuk tips</span>
              </div>
            }
            back={
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[13px] font-bold text-amber-400 mb-1">BERHENTI AMAN</span>
                <p className="text-[14.5px] text-on-surface leading-relaxed text-center font-semibold">
                  Tepi jalan yang aman. Jangan berhenti di bawah jembatan, flyover, atau dekat bangunan tinggi.
                </p>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
