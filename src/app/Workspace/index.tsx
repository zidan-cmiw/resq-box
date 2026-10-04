import { useRef, useEffect, useState, lazy, Suspense } from 'react';

const EvacuationCanvas = lazy(() => import('../EvacuationGame/EvacuationCanvas'));
import { useNavigate, useSearchParams } from 'react-router-dom';
import BlockEditor from './BlockEditor';
import MissionPanel from './MissionPanel';
import SensorPanel from './SensorPanel';
import ConsoleOutput from './ConsoleOutput';
import { MISSIONS } from '../../missions/data/missions';
import { retroAudio } from '../../utils/retroAudio';
import { useMissionStore } from '../../store/missionStore';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useRuntimeStore } from '../../store/runtimeStore';
import { useAuthStore } from '../../store/teacherStore';
import { sanitizeCode } from '../../engine/codeSanitizer';
import {
  connectSerial,
  disconnectSerial,
  sendSerial,
  onSerialData,
  isWebSerialSupported,
} from '../../utils/webSerial';


// Parse satu baris data dari hardware (serial/websocket) → perbarui Digital Twin.
// Format dari ESP32: "SENSOR:A1:750", "SENSOR:A2:600", "SENSOR:D2:1", "SENSOR:D3:0"
function handleHardwareLine(line: string) {
  const parts = line.trim().split(':');
  if (parts[0] !== 'SENSOR' || parts.length < 3) return;
  const pin = parts[1];
  const raw = parts[2];
  const store = useRuntimeStore.getState();
  if (pin === 'A1' || pin === 'A2') {
    const num = parseInt(raw, 10);
    if (!Number.isNaN(num)) store.setSensorValue(pin, num);
  } else if (pin === 'D2' || pin === 'D3') {
    const on = raw === '1' || raw.toUpperCase() === 'HIGH' || raw.toUpperCase() === 'ON';
    store.setSensorValue(pin, on);
  }
}

export default function Workspace() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const missionParam = searchParams.get('mission');

  const student = useAuthStore((state) => state.student);
  const currentUser = useAuthStore((state) => state.currentUser);

  // Ensure stores are synced to the active user on mount
  useEffect(() => {
    const activeId = student?.id || currentUser?.id || 'guest';
    useMissionStore.getState().syncUser(activeId);
    useWorkspaceStore.getState().syncUser(activeId);
  }, [student?.id, currentUser?.id]);

  const { setActiveMission, resetValidation, isUnlocked } = useMissionStore();
  const { setActiveContext, getActiveDraft } = useWorkspaceStore();
  const generatedJsCode = getActiveDraft()?.generatedJsCode ?? '';
  const {
    isRunning, setRunning,
    addLog, clearLogs,
    showSensorPanel, toggleSensorPanel,
  } = useRuntimeStore();

  const runningRef = useRef(false);

  // ── WebSocket Hardware Integration ─────────────────────────────
  const [showWsModal, setShowWsModal] = useState(false);
  const [wsIp, setWsIp] = useState('192.168.');
  const [wsStatus, setWsStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const wsRef = useRef<WebSocket | null>(null);

  const connectMaket = () => {
    if (!wsIp) return;
    setWsStatus('connecting');
    addLog(`[SISTEM] Menghubungkan ke Diorama Fisik (${wsIp})...`, 'system');

    try {
      const ws = new WebSocket(`ws://${wsIp}:81`);

      ws.onopen = () => {
        setWsStatus('connected');
        setShowWsModal(false);
        addLog(`[DIORAMA] Diorama Fisik Terhubung! Sinyal siap dikirim.`, 'success');
      };

      ws.onmessage = (event) => {
        // Data sensor/tombol dari hardware via WiFi → perbarui Digital Twin.
        String(event.data).split('\n').forEach((line) => {
          if (line.trim()) handleHardwareLine(line);
        });
      };

      ws.onclose = () => {
        setWsStatus('idle');
        addLog(`[DIORAMA] Diorama Fisik Terputus.`, 'warn');
        wsRef.current = null;
      };

      ws.onerror = (err) => {
        console.error('WS Error:', err);
        setWsStatus('idle');
        addLog(`[DIORAMA] Gagal terhubung ke Diorama Fisik.`, 'error');
        ws.close();
      };

      wsRef.current = ws;
    } catch (e: any) {
      setWsStatus('idle');
      addLog(`[DIORAMA] Format IP salah: ${e.message}`, 'error');
    }
  };

  const disconnectMaket = () => {
    if (wsRef.current) wsRef.current.close();
  };
  // ─────────────────────────────────────────────────────────────

  // ── Web Serial (Kabel USB) Hardware Integration ────────────────
  const [serialStatus, setSerialStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const [showTestPanel, setShowTestPanel] = useState(false);

  const connectSerialPort = async () => {
    if (!isWebSerialSupported()) {
      addLog('[USB] Browser tidak mendukung Web Serial. Gunakan Chrome atau Edge.', 'error');
      return;
    }
    if (serialStatus === 'connected') {
      await disconnectSerial();
      setSerialStatus('idle');
      addLog('[USB] Diorama (USB) terputus.', 'warn');
      return;
    }
    try {
      setSerialStatus('connecting');
      addLog('[USB] Membuka port... pilih port ESP32/Arduino di popup.', 'system');
      await connectSerial(115200);
      setSerialStatus('connected');
      addLog('[USB] Diorama Fisik Terhubung via kabel USB (115200 baud)! Sinyal siap dikirim.', 'success');
    } catch (e) {
      setSerialStatus('idle');
      const msg = e instanceof Error ? e.message : 'dibatalkan pengguna.';
      addLog(`[USB] Gagal terhubung: ${msg}`, 'error');
    }
  };

  // Kirim perintah ke SEMUA hardware yang terhubung (WiFi + USB).
  const sendHardware = (cmd: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(cmd.endsWith('\n') ? cmd : cmd + '\n');
    }
    sendSerial(cmd.endsWith('\n') ? cmd : cmd + '\n');
  };

  // Tombol tes manual: kirim perintah langsung tanpa perlu menyusun Blockly.
  const testSend = (cmd: string, label: string) => {
    sendHardware(cmd);
    addLog(`[TES] ${label} → ${cmd}`, 'system');
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
      disconnectSerial();
    };
  }, []);

  // Baca data sensor/tombol dari hardware → perbarui Digital Twin (runtimeStore).
  // Format baris dari ESP32: "SENSOR:A1:750", "SENSOR:A2:600", "SENSOR:D2:1", "SENSOR:D3:0"
  useEffect(() => {
    const unsub = onSerialData(handleHardwareLine);
    return unsub;
  }, []);
  // ─────────────────────────────────────────────────────────────

  const activeMission = missionParam
    ? MISSIONS.find((m) => m.id === missionParam) ?? null
    : null;

  // ── Security Guard: redirect if mission is locked ─────────────
  useEffect(() => {
    if (activeMission && !isUnlocked(activeMission.id)) {
      // Mission is locked — redirect to dashboard
      navigate('/', { replace: true });
    }
  }, [activeMission?.id, isUnlocked, navigate]);

  useEffect(() => {
    // Set the active context in the store so BlocklyComponent knows which draft to load/save
    const contextId = activeMission ? activeMission.id : (searchParams.get('project') ?? 'free_workspace');
    setActiveContext(contextId);

    if (activeMission) setActiveMission(activeMission.id);
    else setActiveMission(null);
    resetValidation();

    // Clear logs and stop any running simulation on mission change
    clearLogs();
    setRunning(false);
    runningRef.current = false;

    return () => {
      clearLogs();
      setRunning(false);
      runningRef.current = false;
    };
  }, [activeMission?.id]);

  // ── Code Executor ─────────────────────────────────────────────
  const toggleSimulation = async () => {
    if (isRunning) {
      setRunning(false);
      runningRef.current = false;
      addLog('[INFO] Simulasi dihentikan.', 'warn');
      sendHardware('stopall');
      useRuntimeStore.getState().resetPinStates();
      return;
    }

    clearLogs();
    setRunning(true);
    runningRef.current = true;
    useRuntimeStore.getState().resetPinStates();

    // Build the runtime API
    const api = {
      print: (text: string, type: string = 'info') => {
        useRuntimeStore.getState().addLog(text, type as any);
      },
      setPin: (_pin: string, _state: string) => {
        sendHardware(`PIN:${_pin}:${_state}`);
        useRuntimeStore.getState().setPinState(_pin, _state);
      },
      setRgb: (color: string) => {
        const validColor = ['green', 'yellow', 'orange', 'red', 'off'].includes(color) ? color : 'green';
        useRuntimeStore.getState().setRgbColor(validColor as any);
        sendHardware(`rgb ${validColor}`);
      },
      setBuzzer: (on: boolean) => {
        useRuntimeStore.getState().setPinState('BUZZER', on ? 'ON' : 'OFF');
        sendHardware(`buzzer ${on ? 'on' : 'off'}`);
      },
      simGempa: (level: number) => {
        const lvl = Math.max(1, Math.min(3, level));
        useRuntimeStore.getState().setSeismicSimulation(lvl as any);
        sendHardware(`gempa ${lvl}`);
      },
      simGunung: (status: string, tipe: string = 'EKSPLOSIF') => {
        const lvl = status === 'AWAS' ? 3 : status === 'SIAGA' ? 2 : 1;
        useRuntimeStore.getState().setVolcanoSimulation(status as any, tipe as any);
        sendHardware(`gunung ${lvl}`);
        if (tipe === 'EKSPLOSIF' || status === 'AWAS') {
          sendHardware('mist on');
        }
      },
      setEvacRoute: (route: string) => {
        useRuntimeStore.getState().setEvacuationRoute(route);
      },
      setActiveShelter: (shelter: string) => {
        useRuntimeStore.getState().setActiveShelter(shelter);
      },
      setOledMessage: (msg: string) => {
        useRuntimeStore.getState().setOledMessage(msg);
        sendHardware('oled');
      },
      setMist: (on: boolean) => {
        useRuntimeStore.getState().setMistActive(on);
        sendHardware(on ? 'mist on' : 'mist off');
      },
      playAudio: (track: number) => {
        sendHardware(track > 0 ? `play ${track}` : 'stop');
      },
      stopAudio: () => {
        sendHardware('stop');
      },
      setMotor: (speed: string | number) => {
        if (speed === '0' || speed === 0) {
          useRuntimeStore.getState().setPinState('MOTOR', 'OFF');
          sendHardware('stopall');
        } else {
          useRuntimeStore.getState().setPinState('MOTOR', 'FAST');
          sendHardware('gempa 2');
        }
      },
      stopAll: () => {
        sendHardware('stopall');
        useRuntimeStore.getState().resetPinStates();
      },
      setLocation: (loc: string) => {
        useRuntimeStore.getState().setLocationContext(loc);
      },
      getPin: (pin: string) => {
        const s = useRuntimeStore.getState().sensorValues;
        return (s as any)[pin] ?? false;
      },
      getSensor: (pin: string) => {
        const s = useRuntimeStore.getState().sensorValues;
        return (s as any)[pin] ?? 0;
      },
      delay: (ms: number) => new Promise<void>((resolve, reject) => {
        if (!runningRef.current) return reject(new Error('SIMULATION_STOPPED'));
        let elapsed = 0;
        const interval = setInterval(() => {
          if (!runningRef.current) {
            clearInterval(interval);
            return reject(new Error('SIMULATION_STOPPED'));
          }
          elapsed += 50;
          if (elapsed >= ms) {
            clearInterval(interval);
            resolve();
          }
        }, 50);
      }),
    };

    try {
      // ── Security: sanitize generated code ──
      if (!sanitizeCode(generatedJsCode)) {
        addLog('[KEAMANAN] Simulasi diblokir karena alasan keamanan. Hapus draft yang rusak.', 'error');
        setRunning(false);
        runningRef.current = false;
        return;
      }

      const AsyncFn = Object.getPrototypeOf(async function () { }).constructor;
      const runnerCode = `
        async function setup() { await api.print('[STATUS] Sistem peringatan aktif', 'system'); }
        async function loop() { await api.delay(100); }
        ${generatedJsCode}
        return { setup, loop };
      `;
      const fn = new AsyncFn('api', runnerCode);
      const { setup, loop } = await fn(api);

      if (typeof setup === 'function') await setup();

      const startTime = Date.now();
      const MAX_SIMULATION_DURATION_MS = 60000; // 60s max per simulation run

      while (runningRef.current) {
        if (Date.now() - startTime > MAX_SIMULATION_DURATION_MS) {
          addLog('[TIMEOUT] Simulasi otomatis dihentikan setelah batas waktu 60 detik.', 'system');
          setRunning(false);
          runningRef.current = false;
          break;
        }
        if (typeof loop === 'function') await loop();
        await api.delay(10);
      }
    } catch (err: any) {
      if (err?.message === 'SIMULATION_STOPPED') {
        // Silently abort, user pressed stop during a delay
        return;
      }
      console.error('Runtime error:', err);
      addLog(`[ERROR] Error: ${err?.message ?? 'Unknown error'}`, 'error');
      setRunning(false);
      runningRef.current = false;
    }
  };

  // State rightPanel dihapus karena sekarang game selalu tampil di atas

  return (
    <div className="h-screen w-full flex flex-col bg-[#fefce8] text-[#1c1917] font-pixel overflow-hidden">
      {/* ── Retro Header Bar (SS 3 Warm Parchment & Wood Palette) ── */}
      <header className="h-14 bg-[#fef3c7] border-b-4 border-[#78350f] flex items-center px-3 sm:px-4 justify-between shrink-0 shadow-md z-30">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              retroAudio.playSelect();
              navigate('/level3');
            }}
            className="pixel-btn-wood-compact text-[10px] sm:text-xs py-1.5 px-3 text-amber-100 hover:text-white flex items-center gap-1.5 shrink-0 shadow-sm"
            title="Kembali ke Peta Level 3"
          >
            <span>◀</span>
            <span className="hidden sm:inline">PETA LEVEL 3</span>
          </button>

          <div className="h-6 w-px bg-[#b45309]/30 hidden sm:block" />

          {/* Kotak Info Level (SS 3 Warm Parchment Card) */}
          <div className="bg-[#fffbeb] border-2 border-[#b45309] px-3 py-1 rounded-xl shadow-sm flex items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xs sm:text-sm font-bold text-[#451a03] font-sans tracking-wide leading-tight">
                  {activeMission ? activeMission.title : 'Ruang Simulasi Sandbox'}
                </h1>
                {activeMission && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#b45309] text-white font-pixel uppercase shadow-sm">
                    {activeMission.category === 'proyek' ? `Kasus ${activeMission.level}` : `Level ${activeMission.level}`}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#78350f]/80 hidden sm:block font-sans truncate max-w-xs md:max-w-md font-medium">
                {activeMission ? activeMission.scenario : 'Rancang dan uji logika sistem mitigasi'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sambungkan Diorama WiFi Button */}
          <div className="relative">
            <button
              onClick={() => {
                retroAudio.playSelect();
                wsStatus === 'connected' ? disconnectMaket() : setShowWsModal(!showWsModal);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 text-[11px] font-bold transition-all shadow-sm ${
                wsStatus === 'connected'
                  ? 'bg-[#f0fdf4] text-[#15803d] border-[#16a34a]'
                  : wsStatus === 'connecting'
                  ? 'bg-[#fef3c7] text-[#b45309] border-[#d97706] animate-pulse'
                  : 'bg-[#fffbeb] border-[#b45309] text-[#78350f] hover:bg-[#fef3c7]'
              }`}
              title="Sambungkan Diorama Fisik ESP32 via WiFi"
            >
              <span className={`w-2 h-2 rounded-full ${wsStatus === 'connected' ? 'bg-[#10b981] shadow-[0_0_6px_#10b981]' : wsStatus === 'connecting' ? 'bg-[#f59e0b]' : 'bg-[#a8a29e]'}`} />
              <span className="hidden md:inline">{wsStatus === 'connected' ? 'Diorama WiFi: OK' : wsStatus === 'connecting' ? 'Menghubungkan...' : 'Diorama WiFi'}</span>
              <span className="md:hidden">WiFi</span>
            </button>

            {/* IP Input Modal (SS 3 Warm Parchment) */}
            {showWsModal && wsStatus !== 'connected' && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-[#fffbeb] border-2 border-[#b45309] rounded-xl shadow-2xl p-3.5 z-50 font-sans text-[#1c1917]">
                <h4 className="font-bold text-xs text-[#78350f] mb-1 font-pixel">Alamat IP Diorama (WiFi)</h4>
                <p className="text-[10px] text-[#451a03] mb-2 leading-relaxed font-medium">
                  Lihat IP pada layar OLED ESP32 atau Serial Monitor (contoh: 192.168.1.15). Port: 81.
                </p>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={wsIp}
                    onChange={(e) => setWsIp(e.target.value)}
                    className="w-full bg-[#fefce8] px-2.5 py-1.5 border border-[#b45309] rounded-lg text-[#451a03] text-xs outline-none focus:ring-1 focus:ring-[#d97706] font-mono font-bold"
                    placeholder="192.168.x.x"
                    disabled={wsStatus === 'connecting'}
                  />
                  <div className="flex justify-end gap-2 pt-1 font-pixel">
                    <button
                      onClick={() => setShowWsModal(false)}
                      className="text-[11px] text-[#78716c] hover:text-[#1c1917] px-2 py-1 font-bold"
                    >
                      Batal
                    </button>
                    <button
                      onClick={connectMaket}
                      disabled={wsStatus === 'connecting'}
                      className="bg-[#c2410c] hover:bg-[#ea580c] text-white text-[11px] py-1 px-3 rounded-lg font-bold shadow-md border border-[#7c2d12]"
                    >
                      Koneksikan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sambungkan USB Serial Button */}
          <button
            onClick={() => {
              retroAudio.playSelect();
              connectSerialPort();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 text-[11px] font-bold transition-all shadow-sm ${
              serialStatus === 'connected'
                ? 'bg-[#eff6ff] text-[#1d4ed8] border-[#3b82f6]'
                : serialStatus === 'connecting'
                ? 'bg-[#fef3c7] text-[#b45309] border-[#d97706] animate-pulse'
                : 'bg-[#fffbeb] border-[#b45309] text-[#78350f] hover:bg-[#fef3c7]'
            }`}
            title="Sambungkan via Kabel USB (Web Serial)"
          >
            <span className={`w-2 h-2 rounded-full ${serialStatus === 'connected' ? 'bg-[#3b82f6] shadow-[0_0_6px_#3b82f6]' : serialStatus === 'connecting' ? 'bg-[#f59e0b]' : 'bg-[#a8a29e]'}`} />
            <span className="hidden md:inline">{serialStatus === 'connected' ? 'USB: OK' : serialStatus === 'connecting' ? 'Menghubungkan...' : 'USB Serial'}</span>
            <span className="md:hidden">USB</span>
          </button>

          {/* Tes Perangkat Manual Button */}
          <div className="relative">
            <button
              onClick={() => {
                retroAudio.playSelect();
                setShowTestPanel(!showTestPanel);
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border-2 text-[11px] font-bold transition-all shadow-sm ${
                showTestPanel
                  ? 'bg-[#faf5ff] text-[#7e22ce] border-[#a855f7]'
                  : 'bg-[#fffbeb] border-[#b45309] text-[#78350f] hover:bg-[#fef3c7]'
              }`}
              title="Panel Uji Output ESP32"
            >
              <span>🎛️</span>
              <span className="hidden lg:inline">Tes Perangkat</span>
            </button>

            {showTestPanel && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-[#fffbeb] border-2 border-[#b45309] rounded-xl shadow-2xl p-3 z-50 font-sans text-[#1c1917]">
                <div className="flex items-center justify-between mb-1.5 border-b border-[#b45309]/30 pb-1">
                  <h4 className="font-bold text-xs text-[#78350f] font-pixel">Tes Diorama ESP32</h4>
                  <button onClick={() => setShowTestPanel(false)} className="text-[#78716c] hover:text-[#1c1917] text-xs font-bold">✕</button>
                </div>
                <p className="text-[10px] text-[#451a03] mb-2 leading-relaxed font-medium">
                  {wsStatus === 'connected' || serialStatus === 'connected'
                    ? 'Klik tombol di bawah untuk menyalakan/mematikan output hardware secara langsung.'
                    : 'Hubungkan WiFi atau USB terlebih dahulu agar sinyal hardware terkirim.'}
                </p>
                <div className="grid grid-cols-2 gap-1.5 max-h-72 overflow-y-auto pr-1 text-[11px]">
                  <button onClick={() => testSend('gempa 1', 'Simulasi Gempa Ringan')} className="py-1 px-2 rounded bg-amber-100 text-amber-900 border border-amber-400 hover:bg-amber-200 font-bold">Gempa Ringan</button>
                  <button onClick={() => testSend('gempa 3', 'Simulasi Gempa Kuat')} className="py-1 px-2 rounded bg-red-100 text-red-900 border border-red-400 hover:bg-red-200 font-bold">Gempa Kuat</button>
                  <button onClick={() => testSend('gunung 1', 'Gunung Waspada')} className="py-1 px-2 rounded bg-yellow-100 text-yellow-900 border border-yellow-400 hover:bg-yellow-200 font-bold">Gunung Waspada</button>
                  <button onClick={() => testSend('gunung 3', 'Gunung Awas Erupsi')} className="py-1 px-2 rounded bg-rose-100 text-rose-900 border border-rose-400 hover:bg-rose-200 font-bold">Gunung Awas</button>
                  <button onClick={() => testSend('rgb red', 'LED RGB Merah')} className="py-1 px-2 rounded bg-rose-100 text-rose-800 border border-rose-400 hover:bg-rose-200 font-bold">RGB Merah</button>
                  <button onClick={() => testSend('rgb green', 'LED RGB Hijau')} className="py-1 px-2 rounded bg-emerald-100 text-emerald-800 border border-emerald-400 hover:bg-emerald-200 font-bold">RGB Hijau</button>
                  <button onClick={() => testSend('rgb yellow', 'LED RGB Kuning')} className="py-1 px-2 rounded bg-amber-100 text-amber-800 border border-amber-400 hover:bg-amber-200 font-bold">RGB Kuning</button>
                  <button onClick={() => testSend('rgb orange', 'LED RGB Oranye')} className="py-1 px-2 rounded bg-orange-100 text-orange-800 border border-orange-400 hover:bg-orange-200 font-bold">RGB Oranye</button>
                  <button onClick={() => testSend('buzzer on', 'Sirine EWS ON')} className="py-1 px-2 rounded bg-amber-100 text-amber-800 border border-amber-400 hover:bg-amber-200 font-bold">Sirine ON</button>
                  <button onClick={() => testSend('buzzer off', 'Sirine EWS OFF')} className="py-1 px-2 rounded bg-stone-100 text-stone-700 border border-stone-300 hover:bg-stone-200 font-semibold">Sirine OFF</button>
                  <button onClick={() => testSend('mist on', 'Humidifier Asap ON')} className="py-1 px-2 rounded bg-purple-100 text-purple-800 border border-purple-400 hover:bg-purple-200 font-bold">Mist Asap ON</button>
                  <button onClick={() => testSend('mist off', 'Humidifier Asap OFF')} className="py-1 px-2 rounded bg-stone-100 text-stone-700 border border-stone-300 hover:bg-stone-200 font-semibold">Mist Asap OFF</button>
                  <button onClick={() => testSend('stopall', 'Hentikan Semua Simulasi')} className="col-span-2 py-1.5 px-2 rounded bg-red-600 text-white border border-red-800 hover:bg-red-700 font-bold mt-1 text-center shadow-sm">Matikan Semua Output (STOP ALL)</button>
                </div>
              </div>
            )}
          </div>

          {/* Sensor Panel Toggle */}
          <button
            onClick={() => {
              retroAudio.playSelect();
              toggleSensorPanel();
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border-2 text-[11px] font-bold transition-all shadow-sm ${
              showSensorPanel
                ? 'bg-[#fef3c7] text-[#b45309] border-[#d97706]'
                : 'bg-[#fffbeb] border-[#b45309] text-[#78350f] hover:bg-[#fef3c7]'
            }`}
            title="Buka Panel Slider Sensor Bencana"
          >
            <span>📡</span>
            <span className="hidden sm:inline">Sensor</span>
          </button>

          {/* Run / Stop Simulation Button */}
          <button
            onClick={() => {
              retroAudio.playSelect();
              toggleSimulation();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all border-2 ${
              isRunning
                ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white border-red-800 animate-pulse'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white border-emerald-800'
            }`}
          >
            <span>{isRunning ? '⏹' : '▶'}</span>
            <span>{isRunning ? 'BERHENTI' : 'MULAI'}</span>
          </button>
        </div>
      </header>

      {/* ── Main Layout: Mission Panel on Left + Split Canvas/Editor on Right ── */}
      <main className="flex-1 flex overflow-hidden relative bg-[#fefce8]">
        {activeMission && <MissionPanel missionId={activeMission.id} />}

        {/* RIGHT SIDE: Evacuation Digital Twin (Top) & Blockly/Console (Bottom) */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* TOP: Evacuation Game View (Area 6 Shelter Map) */}
          <section className="h-[35vh] w-full shrink-0 border-b-4 border-[#78350f] shadow-md relative z-10 bg-[#e0f2fe]">
            <Suspense fallback={
              <div className="flex items-center justify-center h-full text-[#78350f] text-xs flex-col gap-2 font-pixel">
                <span>MEMUAT PETA BARAK PENGUNGSIAN...</span>
              </div>
            }>
              <EvacuationCanvas />
            </Suspense>
          </section>

          {/* BOTTOM: Blockly Workspace & Right Activity Console */}
          <section className="flex-1 flex overflow-hidden relative bg-[#fefce8]">
            {/* Blockly Editor */}
            <div className="flex-1 overflow-hidden relative">
              <BlockEditor />
            </div>

            {/* Right Activity Console Panel */}
            <aside aria-label="Monitor Aktivitas" className="w-80 shrink-0 border-l-4 border-[#78350f] overflow-hidden flex flex-col bg-[#fffbeb] shadow-lg">
              <ConsoleOutput />
            </aside>
          </section>
        </div>

        {/* Floating Sensor Panel Slider */}
        <SensorPanel />
      </main>
    </div>
  );
}
