import { useRuntimeStore } from '../../store/runtimeStore';

// Sensor definitions for the floating panel
const SENSORS = [
  {
    pin: 'A1' as const,
    label: 'Intensitas Gempa',
    subtitle: 'Aman → Waspada → Kuat',
    min: 0,
    max: 1023,
    unit: '',
    color: '#F59E0B',
    isAnalog: true,
    minLabel: 'Aman',
    maxLabel: 'Kuat',
  },
  {
    pin: 'A2' as const,
    label: 'Suhu Lingkungan',
    subtitle: 'Normal → Panas → Berbahaya',
    min: 0,
    max: 1023,
    unit: `°C`,
    color: '#EF4444',
    isAnalog: true,
    minLabel: 'Normal',
    maxLabel: '~100°C',
  },
];

const BUTTONS = [
  { pin: 'D2' as const, label: 'Tombol Darurat 1', subtitle: 'Tekan saat bahaya' },
  { pin: 'D3' as const, label: 'Tombol Darurat 2', subtitle: 'Tekan saat bahaya' },
];

export default function SensorPanel() {
  const { sensorValues, setSensorValue, showSensorPanel } = useRuntimeStore();

  if (!showSensorPanel) return null;

  const tempCelsius = ((sensorValues.A2 as number) / 1023 * 100).toFixed(1);

  return (
    <div
      className="absolute bottom-4 right-[336px] z-50 w-72 bg-surface-container rounded-2xl border border-outline-variant shadow-2xl overflow-hidden"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      {/* Panel header */}
      <div className="px-md py-sm bg-surface-container-high border-b border-outline-variant flex items-center gap-sm">
        <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
          eco
        </span>
        <div>
          <div className="font-label-lg font-semibold text-on-surface">Pemantauan Kondisi Alam</div>
          <div className="font-label-sm text-label-sm text-on-surface-variant">Atur kondisi simulasi bencana</div>
        </div>
      </div>

      <div className="p-md flex flex-col gap-md">
        {/* Analog sensors with sliders */}
        {SENSORS.map((sensor) => {
          const rawVal = sensorValues[sensor.pin] as number;

          return (
            <div key={sensor.pin}>
              <div className="flex justify-between items-center mb-xs">
                <div>
                  <div className="font-label-md font-semibold text-on-surface">{sensor.label}</div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-xs">
                    {sensor.subtitle}
                    {sensor.pin === 'A2' && <span className="font-bold text-error">({tempCelsius}°C)</span>}
                  </div>
                </div>
                <input
                  type="number"
                  min={sensor.min}
                  max={sensor.max}
                  value={rawVal}
                  onChange={(e) => {
                    if (e.target.value === '') {
                      setSensorValue(sensor.pin, 0);
                    } else {
                      let val = parseInt(e.target.value);
                      if (val > sensor.max) val = sensor.max;
                      if (val < sensor.min) val = sensor.min;
                      setSensorValue(sensor.pin, val);
                    }
                  }}
                  className="font-code-sm text-code-sm px-xs py-[2px] rounded-md border border-outline-variant font-bold w-[72px] text-center focus:border-primary outline-none bg-surface-container-lowest"
                  style={{ color: sensor.color }}
                />
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={sensor.min}
                  max={sensor.max}
                  value={rawVal}
                  onChange={(e) => setSensorValue(sensor.pin, parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${sensor.color} 0%, ${sensor.color} ${(rawVal / sensor.max) * 100}%, #e2e8f0 ${(rawVal / sensor.max) * 100}%, #e2e8f0 100%)`
                  }}
                />
              </div>
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mt-xs">
                <span>{sensor.minLabel}</span>
                <span>{sensor.maxLabel}</span>
              </div>
            </div>
          );
        })}

        {/* Digital buttons */}
        <div>
          <div className="font-label-md font-semibold text-on-surface mb-sm">Tombol Darurat</div>
          <div className="flex gap-sm">
            {BUTTONS.map((btn) => {
              const isPressed = sensorValues[btn.pin] as boolean;
              return (
                <button
                  key={btn.pin}
                  onMouseDown={() => setSensorValue(btn.pin, true)}
                  onMouseUp={() => setSensorValue(btn.pin, false)}
                  onMouseLeave={() => setSensorValue(btn.pin, false)}
                  onTouchStart={() => setSensorValue(btn.pin, true)}
                  onTouchEnd={() => setSensorValue(btn.pin, false)}
                  className={`flex-1 py-sm rounded-xl border-2 font-label-sm text-label-sm transition-all active:scale-95 select-none
                    ${isPressed
                      ? 'bg-primary border-primary text-on-primary shadow-inner'
                      : 'bg-surface border-outline-variant text-on-surface-variant hover:border-primary'
                    }`}
                >
                  {btn.label}
                  <div className="text-xs opacity-70">{isPressed ? 'AKTIF' : 'Tekan & Tahan'}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
