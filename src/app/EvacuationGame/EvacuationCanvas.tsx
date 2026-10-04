// ── EvacuationCanvas.tsx ──────────────────────────────────────────
// Digital Twin Area 6: Barak Pengungsian & Pemulihan (Dataran Rendah KRB I)
// Menampilkan 1 map penuh dari Area 6 Level 2 secara utuh tanpa NPC,
// terintegrasi langsung dengan Runtime Store (LED, Sirine, Pintu, Sensor Bencana).

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRuntimeStore } from '../../store/runtimeStore';
import {
  drawShelterRecoveryAtmosphere,
  drawShelterRecoveryGround,
  drawShelterEntranceBackGate,
  drawFinalEvacuationCapsuleL2,
} from '../Level2/engine/renderer';

const MAP_WIDTH = 2200;
const MAP_HEIGHT = 480;

// Shortcut POI di Area 6 untuk navigasi cepat
const MAP_POIS = [
  { label: 'GAPURA MASUK', x: 0 },
  { label: 'TENDA BPBD', x: 380 },
  { label: 'POSKO MEDIS', x: 860 },
  { label: 'DAPUR TAGANA', x: 1280 },
  { label: 'SIRINE & LAHAR', x: 1680 },
  { label: 'MOBIL RESCUE', x: 1850 },
];

export default function EvacuationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const shakeRef = useRef({ x: 0, y: 0 });
  const camXRef = useRef(150); // Posisi horizontal kamera (dunia pixel)
  const scaleRef = useRef(0.75); // Skala tampilan
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  const pinStates = useRuntimeStore((s) => s.pinStates);
  const sensorValues = useRuntimeStore((s) => s.sensorValues);

  const ledBahaya = pinStates['10'] === 'HIGH';
  const ledAman = pinStates['11'] === 'HIGH';
  const gateOpen = pinStates.SERVO === 'OPEN';
  const buzzerOn = Boolean(pinStates.BUZZER);
  const isEmergency = ledBahaya || buzzerOn || sensorValues.A1 > 512 || sensorValues.A2 > 512;

  const [activePoiIndex, setActivePoiIndex] = useState(0);

  // Jump camera to POI
  const jumpToX = useCallback((targetX: number, idx: number) => {
    setActivePoiIndex(idx);
    camXRef.current = Math.max(0, Math.min(MAP_WIDTH - 600, targetX));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;

    const gameLoop = () => {
      frameRef.current++;
      const frame = frameRef.current;

      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) {
        rafId = requestAnimationFrame(gameLoop);
        return;
      }

      // 1. Kalkulasi Skala & Viewport
      // Sesuaikan skala agar vertikal (480px) pas mengisi tinggi kanvas
      const fitScale = Math.max(0.45, Math.min(1.2, h / MAP_HEIGHT));
      const currentScale = scaleRef.current || fitScale;
      const viewW = w / currentScale;

      // 2. Efek Getaran Layar saat Gempa (Sensor A1)
      const a1 = useRuntimeStore.getState().sensorValues.A1;
      const shakeIntensity = a1 > 700 ? 5 : a1 > 500 ? 2.5 : 0;
      if (shakeIntensity > 0) {
        shakeRef.current.x = (Math.random() - 0.5) * shakeIntensity;
        shakeRef.current.y = (Math.random() - 0.5) * shakeIntensity;
      } else {
        shakeRef.current.x *= 0.8;
        shakeRef.current.y *= 0.8;
      }

      // 3. Batasi jangkauan kamera agar tidak keluar dari map 0 - 2200
      const maxCamX = Math.max(0, MAP_WIDTH - viewW);
      camXRef.current = Math.max(0, Math.min(maxCamX, camXRef.current));
      const camX = camXRef.current;

      // 4. Render Map Area 6
      ctx.clearRect(0, 0, w, h);
      ctx.save();

      // Transformasi Kamera & Skala
      ctx.scale(currentScale, currentScale);
      ctx.translate(-camX + shakeRef.current.x, shakeRef.current.y);

      try {
        // A. Atmosfer, Siluet Merapi, Perbukitan & Bangunan Area 6
        drawShelterRecoveryAtmosphere(ctx, camX, viewW, MAP_HEIGHT, frame);

        // B. Kontur Tanah Rumput, Aspal Evakuasi, Saluran Air & Karung Pasir
        drawShelterRecoveryGround(ctx, camX, viewW, frame);

        // C. Gapura Masuk Dusun Destana di Kiri (px: 60, py: 360)
        drawShelterEntranceBackGate(ctx, 60, 360);

        // D. Mobil Evakuasi BNPB di Kanan (px: 2130, py: 360)
        drawFinalEvacuationCapsuleL2(ctx, 2130, 360, gateOpen, frame);

        // E. Efek Digital Twin Interaktif (Reaksi Terhadap Blok / Hardware)
        const currentPins = useRuntimeStore.getState().pinStates;
        const isBuzzer = Boolean(currentPins.BUZZER);
        const isDangerLed = currentPins['10'] === 'HIGH';
        const isSafeLed = currentPins['11'] === 'HIGH';

        // 1. Sirene Strobo & Gelombang Suara di Rambu Lahar (x: 1910, y: 218)
        if (isBuzzer || isEmergency) {
          ctx.save();
          // Gelombang suara expanding rings
          for (let r = 1; r <= 3; r++) {
            const radius = ((frame * 1.5 + r * 16) % 55) + 8;
            const alpha = Math.max(0, 1 - radius / 60);
            ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(1910, 218, radius, 0, Math.PI * 2);
            ctx.stroke();
          }
          // Kilau Strobo Merah-Oranye
          const flash = Math.floor(frame / 6) % 2 === 0;
          ctx.fillStyle = flash ? '#ef4444' : '#f59e0b';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.arc(1910, 218, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // 2. Lampu Bahaya (LED Merah Pin 10) di Atas Gapura & Tenda BPBD
        if (isDangerLed) {
          ctx.save();
          const dangerFlash = Math.floor(frame / 8) % 2 === 0;
          if (dangerFlash) {
            ctx.shadowColor = '#f43f5e';
            ctx.shadowBlur = 14;
            // Lampu di tiang gapura kiri & kanan
            ctx.fillStyle = '#f43f5e';
            ctx.fillRect(33, 268, 6, 6);
            ctx.fillRect(81, 268, 6, 6);
            // Lampu strobo di spanduk selamat datang
            ctx.fillRect(177, 190, 6, 6);
          }
          ctx.restore();
        }

        // 3. Lampu Aman (LED Hijau Pin 11) di Posko Medis & Tenda BPBD
        if (isSafeLed) {
          ctx.save();
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 12;
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(960, 240, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // 4. Jalur Pintu Evakuasi Terbuka (Servo Open)
        if (gateOpen) {
          ctx.save();
          // Pendaran hijau di gapura dan area mobil rescue
          ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
          ctx.fillRect(20, 350, 80, 16);
          ctx.fillRect(2060, 350, 140, 16);
          ctx.restore();
        }
      } catch (e) {
        console.error('Error rendering Area 6 shelter map:', e);
      }

      ctx.restore();
      rafId = requestAnimationFrame(gameLoop);
    };

    // Auto-resize
    const ro = new ResizeObserver(() => {
      canvas.width = canvas.clientWidth || canvas.offsetWidth;
      canvas.height = canvas.clientHeight || canvas.offsetHeight;
      scaleRef.current = Math.max(0.45, Math.min(1.2, canvas.height / MAP_HEIGHT));
    });
    ro.observe(canvas);

    // Initial sizing
    canvas.width = canvas.clientWidth || canvas.offsetWidth || 800;
    canvas.height = canvas.clientHeight || canvas.offsetHeight || 300;
    scaleRef.current = Math.max(0.45, Math.min(1.2, canvas.height / MAP_HEIGHT));

    // Mouse Wheel Zoom
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSensitivity = 0.0012;
      const delta = -e.deltaY * zoomSensitivity;
      const newScale = Math.max(0.4, Math.min(1.6, scaleRef.current * Math.exp(delta)));
      scaleRef.current = newScale;
    };
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    rafId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [gateOpen, isEmergency]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#e0f2fe]">
      {/* Kanvas 2D Map Area 6 */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        style={{ touchAction: 'none' }}
        onPointerDown={(e) => {
          isDraggingRef.current = true;
          lastMouseRef.current = { x: e.clientX, y: e.clientY };
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!isDraggingRef.current) return;
          const dx = e.clientX - lastMouseRef.current.x;
          camXRef.current -= dx / scaleRef.current;
          lastMouseRef.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          isDraggingRef.current = false;
          (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        }}
      />

      {/* ── TOP LEFT HUD: Status Kesiapsiagaan Barak Pengungsian (SS 3 Color Palette) ── */}
      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 pointer-events-none font-sans z-20">
        <div className="bg-[#fffbeb]/95 backdrop-blur-md rounded-xl px-3 py-2 border-2 border-[#b45309] text-[#1c1917] shadow-xl">
          <div className="flex items-center justify-between gap-3 mb-1 border-b border-[#b45309]/20 pb-1">
            <span className="font-bold text-[10px] text-[#78350f] uppercase tracking-wider flex items-center gap-1 font-pixel">
              <span className="px-1.5 py-0.5 rounded bg-[#fef3c7] border border-[#d97706] text-[#b45309]">KRB I</span>
              BARAK PENGUNGSIAN TERPADU
            </span>
            <span className="text-[10px] text-[#78350f] font-bold">2.200m Wilayah Aman</span>
          </div>

          <div className="flex items-center gap-4 pt-0.5">
            <div className="text-center">
              <p className="text-base font-black text-[#15803d] font-pixel">5 POSKO</p>
              <p className="text-[9px] text-[#166534] font-bold">Titik Evakuasi</p>
            </div>
            <div className="h-6 w-px bg-[#b45309]/30" />
            <div className="text-center">
              <p className="text-base font-black text-[#b45309] font-pixel">
                {gateOpen ? 'TERBUKA' : 'SIAGA'}
              </p>
              <p className="text-[9px] text-[#78350f] font-bold">Gerbang Jalur</p>
            </div>
            <div className="h-6 w-px bg-[#b45309]/30" />
            <div className="text-center">
              <p className={`text-base font-black font-pixel ${isEmergency ? 'text-[#be123c] animate-pulse' : 'text-[#15803d]'}`}>
                {isEmergency ? 'WASPADA' : 'AMAN'}
              </p>
              <p className="text-[9px] text-[#78350f] font-bold">Status Alam</p>
            </div>
          </div>
        </div>

        {/* Peringatan Bahaya Darurat (SS 3 Amber/Rose Badge) */}
        {isEmergency && (
          <div className="bg-[#fff1f2]/95 backdrop-blur-md rounded-xl px-3 py-1.5 border-2 border-[#e11d48] text-[#9f1239] flex items-center gap-2 shadow-lg animate-pulse">
            <span className="text-sm">⚠️</span>
            <div>
              <p className="font-bold text-[11px] font-pixel text-[#be123c]">KONDISI DARURAT AKTIF!</p>
              <p className="text-[10px] text-[#9f1239] font-medium leading-tight">Sirine & sistem mitigasi Merapi sedang beroperasi...</p>
            </div>
          </div>
        )}

        {/* Status Pintu Evakuasi Pill */}
        <div className={`rounded-xl px-2.5 py-1 backdrop-blur-md border-2 text-[10px] font-bold shadow-md flex items-center gap-1.5 font-pixel w-fit ${
          gateOpen
            ? 'bg-[#f0fdf4]/95 border-[#16a34a] text-[#15803d]'
            : 'bg-[#fff1f2]/95 border-[#e11d48] text-[#be123c]'
        }`}>
          <span>{gateOpen ? '🔓' : '🔒'}</span>
          <span>{gateOpen ? 'PINTU EVAKUASI: TERBUKA' : 'PINTU EVAKUASI: TERTUTUP'}</span>
        </div>
      </div>

      {/* ── TOP RIGHT HUD: Legenda Struktur Area 6 (SS 3 Color Palette) ── */}
      <div className="absolute top-2.5 right-2.5 bg-[#fffbeb]/95 backdrop-blur-md rounded-xl px-3 py-2 border-2 border-[#b45309] text-[#1c1917] pointer-events-none shadow-xl font-sans hidden sm:block z-20">
        <p className="font-bold text-[10px] text-[#78350f] uppercase tracking-wider mb-1 font-pixel flex items-center gap-1">
          <span className="px-1 py-0.5 rounded bg-[#fef3c7] border border-[#d97706] text-[#b45309]">MAP</span>
          STRUKTUR BARAK
        </p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] font-semibold text-[#451a03]">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ea580c]" /> Tenda BPBD</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#0284c7]" /> Tandon Air</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#dc2626]" /> Pos Medis PMI</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#2563eb]" /> Dapur Tagana</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#facc15]" /> Rambu Lahar</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#16a34a]" /> Mobil Rescue</span>
        </div>
      </div>

      {/* ── BOTTOM RIGHT HUD: Status Perangkat Hardware (SS 3 Color Palette) ── */}
      <div className="absolute bottom-2.5 right-2.5 flex flex-col gap-1 pointer-events-none font-sans z-20">
        <div className="bg-[#fffbeb]/95 backdrop-blur-md rounded-xl px-3 py-1.5 border-2 border-[#b45309] text-[10px] text-[#1c1917] shadow-xl">
          <p className="font-bold text-[10px] text-[#78350f] uppercase tracking-wider mb-1 flex items-center gap-1 font-pixel">
            <span className="px-1 py-0.5 rounded bg-[#fef3c7] border border-[#d97706] text-[#b45309]">IOT</span>
            STATUS PERANGKAT
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] font-semibold">
            <span className={`flex items-center gap-1 ${ledBahaya ? 'text-[#be123c] font-bold' : 'text-[#78716c]'}`}>
              <span className={`w-2 h-2 rounded-full ${ledBahaya ? 'bg-[#f43f5e] shadow-[0_0_6px_#f43f5e]' : 'bg-[#d6d3d1]'}`} />
              LED Bahaya: {ledBahaya ? 'ON' : 'OFF'}
            </span>
            <span className={`flex items-center gap-1 ${ledAman ? 'text-[#15803d] font-bold' : 'text-[#78716c]'}`}>
              <span className={`w-2 h-2 rounded-full ${ledAman ? 'bg-[#10b981] shadow-[0_0_6px_#10b981]' : 'bg-[#d6d3d1]'}`} />
              LED Aman: {ledAman ? 'ON' : 'OFF'}
            </span>
            <span className={`flex items-center gap-1 ${buzzerOn ? 'text-[#b45309] font-bold' : 'text-[#78716c]'}`}>
              <span className={`w-2 h-2 rounded-full ${buzzerOn ? 'bg-[#f59e0b] shadow-[0_0_6px_#f59e0b]' : 'bg-[#d6d3d1]'}`} />
              Sirine: {buzzerOn ? 'ON' : 'OFF'}
            </span>
            <span className={`flex items-center gap-1 ${gateOpen ? 'text-[#15803d] font-bold' : 'text-[#be123c] font-bold'}`}>
              <span className={`w-2 h-2 rounded-sm ${gateOpen ? 'bg-[#10b981] shadow-[0_0_6px_#10b981]' : 'bg-[#f43f5e] shadow-[0_0_6px_#f43f5e]'}`} />
              Pintu: {gateOpen ? 'BUKA' : 'TUTUP'}
            </span>
          </div>
        </div>
      </div>

      {/* ── BOTTOM CENTER: Quick Nav Bar (Jelajahi Peta 2.200px Tanpa Ribet) ── */}
      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 z-20 pointer-events-auto">
        <div className="bg-[#fffbeb]/95 backdrop-blur-md border-2 border-[#b45309] rounded-xl px-2 py-1 shadow-lg flex items-center gap-1 font-pixel text-[9px]">
          <span className="text-[#78350f] font-bold hidden md:inline mr-1">LOKASI:</span>
          {MAP_POIS.map((poi, idx) => (
            <button
              key={poi.label}
              onClick={() => jumpToX(poi.x, idx)}
              className={`px-2 py-1 rounded-lg transition-all font-bold cursor-pointer ${
                activePoiIndex === idx
                  ? 'bg-[#b45309] text-white shadow-sm ring-1 ring-[#78350f]'
                  : 'bg-[#fef3c7] text-[#78350f] hover:bg-[#fde68a] border border-[#d97706]/40'
              }`}
            >
              {poi.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
