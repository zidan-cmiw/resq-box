// ── EvacuationCanvas.tsx ──────────────────────────────────────────
// Komponen utama game: mengelola game loop (RAF), membaca pinStates
// dari Zustand Store (Digital Twin), dan memanggil renderer.

import { useEffect, useRef, useState } from 'react';
import { useRuntimeStore } from '../../store/runtimeStore';
import { renderMap } from './engine/renderer';
import type { RenderState } from './engine/renderer';
import { createNPCs, updateNPCs } from './engine/npc';
import type { NPC } from './engine/npc';
import { NPC_SPAWN_POINTS } from './mapData';

const ORIGIN_X_FACTOR = 0.5; // canvas center
const ORIGIN_Y_FACTOR = 0.28; // lower offset to prevent clipping tall buildings

export default function EvacuationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const npcsRef = useRef<NPC[]>(createNPCs(NPC_SPAWN_POINTS));
  const frameRef = useRef(0);
  const shakeRef = useRef({ x: 0, y: 0, timer: 0 });
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  const pinStates = useRuntimeStore((s) => s.pinStates);
  const sensorValues = useRuntimeStore((s) => s.sensorValues);
  const isRunning = useRuntimeStore((s) => s.isRunning);

  const [stats, setStats] = useState({ safe: 0, total: NPC_SPAWN_POINTS.length, blocked: 0 });

  const ledBahaya = pinStates['10'] === 'HIGH';
  const ledAman = pinStates['11'] === 'HIGH';
  const gateOpen = pinStates.SERVO === 'OPEN';
  const buzzerOn = pinStates.BUZZER;
  const isEmergency = ledBahaya || buzzerOn || sensorValues.A1 > 500 || sensorValues.A2 > 700;

  // Reset NPCs ketika simulasi dimulai dari awal
  useEffect(() => {
    if (isRunning) {
      npcsRef.current = createNPCs(NPC_SPAWN_POINTS);
      setStats({ safe: 0, total: NPC_SPAWN_POINTS.length, blocked: 0 });
    }
  }, [isRunning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;

    const startLoop = () => {
      cancelAnimationFrame(rafId);

      const gameLoop = () => {
        frameRef.current++;
        const frame = frameRef.current;

        // Canvas size check (skip if not visible yet)
        if (canvas.width === 0 || canvas.height === 0) {
          rafId = requestAnimationFrame(gameLoop);
          return;
        }

        // Screen shake saat gempa kuat
        const a1 = useRuntimeStore.getState().sensorValues.A1;
        const shakeIntensity = a1 > 700 ? 4 : a1 > 500 ? 2 : 0;
        if (shakeIntensity > 0) {
          shakeRef.current.x = (Math.random() - 0.5) * shakeIntensity;
          shakeRef.current.y = (Math.random() - 0.5) * shakeIntensity;
        } else {
          shakeRef.current.x *= 0.8;
          shakeRef.current.y *= 0.8;
        }

        // Update NPC AI — read latest pin states each frame
        const pins = useRuntimeStore.getState().pinStates;
        const sensors = useRuntimeStore.getState().sensorValues;
        const emergency = pins['10'] === 'HIGH' || pins.BUZZER || sensors.A1 > 500 || sensors.A2 > 700;
        const gate = pins.SERVO === 'OPEN';
        npcsRef.current = updateNPCs(npcsRef.current, emergency, gate, 1);

        // Update stats
        if (frame % 10 === 0) {
          const safe = npcsRef.current.filter(n => n.state === 'safe').length;
          const blocked = npcsRef.current.filter(n => n.state === 'blocked').length;
          setStats({ safe, total: NPC_SPAWN_POINTS.length, blocked });
        }

        // Render
        const cx = canvas.width * ORIGIN_X_FACTOR;
        const cy = canvas.height * ORIGIN_Y_FACTOR;

        // Clear the entire canvas BEFORE applying any transformations (pan/zoom)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(cx + transformRef.current.x, cy + transformRef.current.y);
        ctx.scale(transformRef.current.scale, transformRef.current.scale);

        // originX/Y are 0 because we translated context. Just pass shake.
        const originX = shakeRef.current.x;
        const originY = shakeRef.current.y;

        const renderState: RenderState = {
          volcanoFrame: frameRef.current,
          ledBahaya: pins['10'] === 'HIGH',
          ledAman: pins['11'] === 'HIGH',
          buzzerOn: pins.BUZZER,
          gateOpen: pins.SERVO === 'OPEN',
          earthquakeIntensity: sensors.A1,
          temperature: sensors.A2,
          shakeX: shakeRef.current.x,
          shakeY: shakeRef.current.y,
        };

        try {
          renderMap(ctx, originX, originY, renderState, npcsRef.current);
        } catch (e) {
          console.error('Render error:', e);
        }
        
        ctx.restore();

        rafId = requestAnimationFrame(gameLoop);
      };

      rafId = requestAnimationFrame(gameLoop);
    };

    // Use ResizeObserver for reliable canvas sizing
    const ro = new ResizeObserver(() => {
      canvas.width = canvas.clientWidth || canvas.offsetWidth;
      canvas.height = canvas.clientHeight || canvas.offsetHeight;
    });
    ro.observe(canvas);

    // Wheel event for Zoom (must be non-passive)
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSensitivity = 0.0015;
      const delta = -e.deltaY * zoomSensitivity;
      let newScale = transformRef.current.scale * Math.exp(delta);
      newScale = Math.max(0.3, Math.min(newScale, 3));
      transformRef.current.scale = newScale;
    };
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    // Initial sizing
    canvas.width = canvas.clientWidth || canvas.offsetWidth || 320;
    canvas.height = canvas.clientHeight || canvas.offsetHeight || 480;

    startLoop();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)', touchAction: 'none' }}
        onPointerDown={(e) => {
          isDraggingRef.current = true;
          lastMouseRef.current = { x: e.clientX, y: e.clientY };
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!isDraggingRef.current) return;
          const dx = e.clientX - lastMouseRef.current.x;
          const dy = e.clientY - lastMouseRef.current.y;
          transformRef.current.x += dx;
          transformRef.current.y += dy;
          lastMouseRef.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          isDraggingRef.current = false;
          (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        }}
      />

      {/* HUD Overlay */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
        {/* Status Panel */}
        <div className="bg-black/60 backdrop-blur rounded-xl px-4 py-3 border border-white/10 text-white text-sm">
          <p className="font-bold text-xs text-white/60 uppercase tracking-wider mb-2">🗺️ Status Evakuasi</p>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">{stats.safe}</p>
              <p className="text-xs text-white/60">Selamat</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">{stats.total - stats.safe - stats.blocked}</p>
              <p className="text-xs text-white/60">Dalam Evakuasi</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{stats.blocked}</p>
              <p className="text-xs text-white/60">Terblokir</p>
            </div>
          </div>
        </div>

        {/* Emergency Banner */}
        {isEmergency && (
          <div className="bg-red-500/80 backdrop-blur rounded-xl px-4 py-2 border border-red-400 text-white animate-pulse">
            <p className="font-bold text-sm">🚨 KONDISI DARURAT AKTIF</p>
            <p className="text-xs opacity-80">NPC sedang mencari jalur evakuasi...</p>
          </div>
        )}

        {/* Gate Status */}
        <div className={`rounded-xl px-3 py-2 backdrop-blur border text-xs font-semibold ${
          gateOpen
            ? 'bg-emerald-500/70 border-emerald-400 text-white'
            : 'bg-red-900/70 border-red-700 text-white'
        }`}>
          {gateOpen ? '🚪 Gerbang Evakuasi TERBUKA' : '🔒 Gerbang Evakuasi TERTUTUP'}
        </div>
      </div>

      {/* Pin States Display (bottom-right) */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1 pointer-events-none">
        <div className="bg-black/60 backdrop-blur rounded-xl px-3 py-2 border border-white/10 text-xs text-white">
          <p className="font-bold text-white/50 uppercase text-xs mb-1">Status Sistem</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span className={ledBahaya ? 'text-red-400' : 'text-white/30'}>🔴 LED Bahaya: {ledBahaya ? 'ON' : 'OFF'}</span>
            <span className={ledAman ? 'text-emerald-400' : 'text-white/30'}>🟢 LED Aman: {ledAman ? 'ON' : 'OFF'}</span>
            <span className={buzzerOn ? 'text-amber-400' : 'text-white/30'}>🔊 Sirine: {buzzerOn ? 'ON' : 'OFF'}</span>
            <span className={gateOpen ? 'text-emerald-400' : 'text-red-400'}>🚪 Pintu: {gateOpen ? 'TERBUKA' : 'TERTUTUP'}</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur rounded-xl px-3 py-2 border border-white/10 text-xs text-white pointer-events-none">
        <p className="font-bold text-white/50 uppercase text-xs mb-1">Legenda NPC</p>
        <div className="flex flex-col gap-1">
          <span>🟠 Panik / Menghitung rute</span>
          <span>🔵 Bergerak menuju titik kumpul</span>
          <span>🟢 Selamat di titik kumpul</span>
          <span>🔴 Terblokir (gerbang tertutup!)</span>
        </div>
      </div>
    </div>
  );
}
