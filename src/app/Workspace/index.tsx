import { useRef, useEffect, useState, lazy, Suspense, Component, type ReactNode } from 'react';

const EvacuationCanvas = lazy(() => import('../EvacuationGame/EvacuationCanvas'));

class CanvasErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: any) {
    console.error('Canvas rendering error:', err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full text-[#78350f] text-[13px] flex-col gap-2 font-pixel p-4 bg-amber-50 font-semibold">
          <span>TERJADI KENDALA PADA TAMPILAN PETA DIORAMA.</span>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-3 py-1 bg-amber-600 text-white rounded font-sans text-[13px] font-bold hover:bg-amber-700 mt-2"
          >
            Muat Ulang Peta
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import { useNavigate, useSearchParams } from 'react-router-dom';
import BlockEditor from './BlockEditor';
import MissionPanel from './MissionPanel';
import TelemetrySidePanel from './TelemetrySidePanel';
import ConsoleOutput from './ConsoleOutput';
import { MISSIONS } from '../../missions/data/missions';
import { retroAudio } from '../../utils/retroAudio';
import { useMissionStore } from '../../store/missionStore';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useRuntimeStore } from '../../store/runtimeStore';
import { useAuthStore } from '../../store/teacherStore';
import { sanitizeCode } from '../../engine/codeSanitizer';
import ResqyTutorialOverlay from '../../components/Tutorial/ResqyTutorialOverlay';
import { TUTORIAL_TOURS } from '../../components/Tutorial/tutorialConfig';
import {
  connectSerial,
  disconnectSerial,
  sendSerial,
  onSerialData,
  isWebSerialSupported,
  isSerialConnected,
} from '../../utils/webSerial';


// Parse satu baris data dari hardware (serial/websocket) → perbarui Digital Twin.
// Format dari ESP32: "SENSOR:A1:750", "SENSOR:A2:600", "SENSOR:D2:1", "SENSOR:D3:0"
function handleHardwareLine(line: string) {
  const clean = line.trim();
  // Jika ESP32 baru dinyalakan/reboot, pastikan mode Common Anode (default yom.ino) & matikan LED
  if (clean.includes('ESP32') || clean.includes('SISTEM SIAP') || clean.includes('CONNECTED_TO_ESP32')) {
    if (isSerialConnected()) {
      sendSerial('anode\n');
      sendSerial('rgb off\n');
      sendSerial('led off\n');
    }
  }

  const parts = clean.split(':');
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
    isMapExpanded,
  } = useRuntimeStore();

  const runningRef = useRef(false);

  // ── Responsive Layout Mobile/Tablet States ──────────────────────
  const [showMissionPanel, setShowMissionPanel] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : true));
  const [topTabMobile, setTopTabMobile] = useState<'canvas' | 'telemetry'>('canvas');
  const [bottomTabMobile, setBottomTabMobile] = useState<'editor' | 'console'>('editor');

  // ── WebSocket Hardware Integration ─────────────────────────────
  const [showWsModal, setShowWsModal] = useState(false);
  const [wsIp, setWsIp] = useState('192.168.4.1');
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
        // Kunci mode Common Anode (default yom.ino) & matikan LED agar tidak menyala putih saat normal
        ws.send('anode\n');
        ws.send('rgb off\n');
        ws.send('led off\n');
      };

      ws.onmessage = (event) => {
        // Data sensor/tombol dari hardware via WiFi → perbarui Digital Twin.
        String(event.data).split('\n').forEach((line) => {
          const l = line.trim();
          if (l) {
            if (l.includes('CONNECTED_TO_ESP32') || l.includes('ESP32') || l.includes('SISTEM SIAP')) {
              ws.send('anode\n');
              ws.send('rgb off\n');
              ws.send('led off\n');
            }
            handleHardwareLine(l);
          }
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
    } catch (e) {
      setWsStatus('idle');
      addLog(`[DIORAMA] Format IP salah: ${e instanceof Error ? e.message : String(e)}`, 'error');
    }
  };

  const disconnectMaket = () => {
    if (wsRef.current) wsRef.current.close();
  };
  // ─────────────────────────────────────────────────────────────

  // ── Web Serial (Kabel USB) Hardware Integration ────────────────
  const [serialStatus, setSerialStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');

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
      addLog('[USB] Membuka port... pilih port Diorama di popup.', 'system');
      await connectSerial(115200);
      setSerialStatus('connected');
      addLog('[USB] Diorama Fisik Terhubung via kabel USB (115200 baud)! Sinyal siap dikirim.', 'success');
      // Kunci mode Common Anode (default yom.ino) & matikan LED agar tidak menyala putih saat normal
      await sendSerial('anode\n');
      await sendSerial('rgb off\n');
      await sendSerial('led off\n');
    } catch (e) {
      setSerialStatus('idle');
      const msg = e instanceof Error ? e.message : 'dibatalkan pengguna.';
      addLog(`[USB] Gagal terhubung: ${msg}`, 'error');
    }
  };

  // Throttle & deduplikasi pengiriman hardware untuk mencegah banjir paket dan restart ESP32
  const lastCmdTimeRef = useRef<Map<string, number>>(new Map());

  // Kirim perintah ke SEMUA hardware yang terhubung (WiFi + USB).
  const sendHardware = (cmd: string, force = false) => {
    const cleanCmd = cmd.trim();
    if (!cleanCmd) return;

    // Deduplikasi/Throttling: Cegah pengiriman perintah identik dalam rentang < 250ms
    const now = Date.now();
    const lastTime = lastCmdTimeRef.current.get(cleanCmd) || 0;
    if (!force && now - lastTime < 250) {
      return;
    }
    lastCmdTimeRef.current.set(cleanCmd, now);

    let sentWs = false;
    let sentUsb = false;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(cleanCmd + '\n');
      sentWs = true;
    }
    if (isSerialConnected()) {
      sendSerial(cleanCmd + '\n');
      sentUsb = true;
    }

    if (sentWs || sentUsb) {
      const target = sentWs && sentUsb ? 'WiFi & USB' : sentWs ? 'WiFi' : 'USB';
      addLog(`[HARDWARE ➔ ${target}] ${cleanCmd}`, 'system');
    }
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
      retroAudio.stopEwsSiren();
      clearLogs();
      setRunning(false);
      runningRef.current = false;
      useRuntimeStore.getState().setSeismicSimulation(0);
      useRuntimeStore.getState().setVolcanoSimulation('NORMAL', 'NONE');
      useRuntimeStore.getState().setEvacuationCommand('NONE');
      useRuntimeStore.getState().triggerDisasterReset();
    };
  }, [activeMission?.id]);

  // ── Code Executor ─────────────────────────────────────────────
  const toggleSimulation = async () => {
    if (isRunning) {
      retroAudio.stopEwsSiren();
      setRunning(false);
      runningRef.current = false;
      addLog('[INFO] Simulasi dihentikan oleh pengguna.', 'warn');
      addLog('[PETA] Dampak lingkungan pasca-bencana tetap dapat diamati di peta 3D. Klik tombol "↺ Reset Kondisi" di toolbar peta untuk mengembalikan ke kondisi awal.', 'info');
      if (wsRef.current?.readyState === WebSocket.OPEN || isSerialConnected()) {
        sendHardware('stopall', true);
      }
      useRuntimeStore.getState().resetPinStates();
      useRuntimeStore.getState().setSeismicSimulation(0);
      useRuntimeStore.getState().setVolcanoSimulation('NORMAL', 'NONE');
      useRuntimeStore.getState().setEvacuationCommand('NONE');
      return;
    }

    clearLogs();
    setRunning(true);
    runningRef.current = true;
    useRuntimeStore.getState().resetPinStates();

    // Inisialisasi awal hardware: pastikan mode Common Anode & LED mati saat normal/idle
    // Diberi jeda mikro agar buffer ESP32 tidak tersedak sebelum simulasi dimulai
    sendHardware('anode');
    await new Promise((r) => setTimeout(r, 50));
    sendHardware('rgb off');
    sendHardware('led off');
    await new Promise((r) => setTimeout(r, 50));

    // Build the runtime API
    const api = {
      print: (text: string, type: string = 'info') => {
        useRuntimeStore.getState().addLog(text, type as any);
      },
      setPin: (_pin: string, _state: string) => {
        const cur = (useRuntimeStore.getState().pinStates as Record<string, any>)[_pin];
        useRuntimeStore.getState().setPinState(_pin, _state);
        if (cur !== _state) {
          sendHardware(`PIN:${_pin}:${_state}`);
        }
      },
      setRgb: (color: string) => {
        const validColor = ['green', 'yellow', 'orange', 'red', 'off'].includes(color) ? color : 'green';
        const cur = useRuntimeStore.getState().rgbColor;
        useRuntimeStore.getState().setRgbColor(validColor as any);
        if (cur !== validColor) {
          if (validColor === 'off') {
            sendHardware('rgb off');
            sendHardware('led off');
          } else if (validColor === 'red') {
            sendHardware('rgb red');
            sendHardware('led on');
          } else {
            sendHardware(`rgb ${validColor}`);
            sendHardware('led off');
          }
        }
      },
      setBuzzer: (on: boolean) => {
        const cur = !!useRuntimeStore.getState().pinStates.BUZZER;
        useRuntimeStore.getState().setPinState('BUZZER', on ? 'ON' : 'OFF');
        if (cur !== on) {
          sendHardware(`buzzer ${on ? 'on' : 'off'}`);
        }
        if (on) {
          retroAudio.startEwsSiren();
        } else {
          retroAudio.stopEwsSiren();
        }
      },
      simGempa: (level: number) => {
        const lvl = Math.max(1, Math.min(3, level));
        const currentLvl = useRuntimeStore.getState().seismicLevel;
        useRuntimeStore.getState().setSeismicSimulation(lvl as any);
        // Cegah spamming jika level gempa di hardware sudah sama
        if (currentLvl !== lvl) {
          sendHardware(`gempa ${lvl}`);
        }
      },
      simGunung: async (status: string, tipe: string = 'EKSPLOSIF') => {
        const curStatus = useRuntimeStore.getState().volcanoStatus;
        const curType = useRuntimeStore.getState().eruptionType;
        if (curStatus === status && curType === tipe) {
          return; // Status dan jenis letusan sudah sama, abaikan spamming
        }

        if (status === 'AWAS') {
          // Fase 3 (Awas / Erupsi): Gempa bumi & mist maker aktif, baik di letusan eksplosif maupun efusif
          useRuntimeStore.getState().setVolcanoSimulation('AWAS', tipe as any);

          if (tipe === 'EFUSIF') {
            sendHardware('gunung 3 efusif');
          } else {
            sendHardware('gunung 3 eksplosif');
          }

          api.print(`[ERUPSI MERAPI] Status AWAS / Erupsi (Fase 3 - ${tipe}) aktif! Getaran gempa vulkanik dan asap mist menyala!`, 'error');
        } else if (status === 'SIAGA') {
          // Fase 2 (Siaga): Kesiapsiagaan ditingkatkan, TIDAK ADA getaran gempa
          useRuntimeStore.getState().setVolcanoSimulation('SIAGA', tipe as any);
          useRuntimeStore.getState().setSeismicSimulation(0);
          sendHardware('motor off');
          sendHardware('gempa off');
          sendHardware('mist off');
          sendHardware('oled SIAGA (FASE 2)');
          api.print(`[STATUS MERAPI] Status SIAGA (Fase 2) aktif. Kesiapsiagaan ditingkatkan, tanpa getaran gempa.`, 'warn');
        } else if (status === 'WASPADA') {
          // Fase 1 (Waspada): Pemantauan awal kawah, TIDAK ADA getaran gempa
          useRuntimeStore.getState().setVolcanoSimulation('WASPADA', tipe as any);
          useRuntimeStore.getState().setSeismicSimulation(0);
          sendHardware('motor off');
          sendHardware('gempa off');
          sendHardware('mist off');
          sendHardware('oled WASPADA (FASE 1)');
          api.print(`[STATUS MERAPI] Status WASPADA (Fase 1) aktif. Pemantauan kawah dimulai, tanpa getaran gempa.`, 'info');
        } else {
          useRuntimeStore.getState().setVolcanoSimulation('NORMAL', 'NONE');
          sendHardware('stopall');
        }
      },
      setEvacRoute: (route: string) => {
        useRuntimeStore.getState().setEvacuationRoute(route);
      },
      setActiveShelter: (shelter: string) => {
        useRuntimeStore.getState().setActiveShelter(shelter);
      },
      setEvacCommand: (cmd: any) => {
        useRuntimeStore.getState().setEvacuationCommand(cmd);
      },
      setOledMessage: (msg: string) => {
        useRuntimeStore.getState().setOledMessage(msg);
        sendHardware(`oled ${msg}`);
      },
      setMist: (on: boolean) => {
        const cur = useRuntimeStore.getState().mistActive;
        useRuntimeStore.getState().setMistActive(on);
        if (cur !== on) {
          sendHardware(on ? 'mist on' : 'mist off');
        }
      },
      playAudio: (track: number) => {
        sendHardware(track > 0 ? `play ${track}` : 'stop');
      },
      stopAudio: () => {
        sendHardware('stop');
      },
      setMotor: (speed: string | number) => {
        const spd = String(speed);
        const isOff = spd === '0' || speed === 0;
        const cur = useRuntimeStore.getState().pinStates['MOTOR'];
        if (isOff) {
          useRuntimeStore.getState().setPinState('MOTOR', 'OFF');
          if (cur !== 'OFF') sendHardware('motor off');
        } else {
          useRuntimeStore.getState().setPinState('MOTOR', 'FAST');
          if (cur !== 'FAST') sendHardware(`motor ${spd}`);
        }
      },
      stopAll: () => {
        retroAudio.stopEwsSiren();
        if (wsRef.current?.readyState === WebSocket.OPEN || isSerialConnected()) {
          sendHardware('stopall');
        }
        useRuntimeStore.getState().resetPinStates();
      },
      getEruptionType: () => {
        return useRuntimeStore.getState().eruptionType;
      },
      isEruptionType: (t: string) => {
        return useRuntimeStore.getState().eruptionType === t;
      },
      getSeismicLevel: () => {
        return useRuntimeStore.getState().seismicLevel;
      },
      isSeismicLevel: (lvl: number) => {
        return useRuntimeStore.getState().seismicLevel === lvl;
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

      addLog('[SIMULASI] Simulasi bencana aktif. Mengamati respon evakuasi warga dan dampak mitigasi...', 'warn');

      while (runningRef.current) {
        if (typeof loop === 'function') await loop();
        await api.delay(50);
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'SIMULATION_STOPPED') {
        // Silently abort, user pressed stop during a delay
        return;
      }
      console.error('Runtime error:', err);
      addLog(`[ERROR] Error: ${err instanceof Error ? err.message : String(err)}`, 'error');
      setRunning(false);
      runningRef.current = false;
    } finally {
      if (!runningRef.current) {
        retroAudio.stopEwsSiren();
        useRuntimeStore.getState().setSeismicSimulation(0);
        useRuntimeStore.getState().setVolcanoSimulation('NORMAL', 'NONE');
        useRuntimeStore.getState().setEvacuationCommand('NONE');
      }
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
            className="pixel-btn-wood-compact text-[13px] sm:text-[15px] py-2 px-3 text-amber-100 hover:text-white flex items-center gap-1.5 shrink-0 shadow-sm font-semibold"
            title="Kembali ke Peta Level 3"
          >
            <span className="hidden sm:inline">PETA LEVEL 3</span>
          </button>

          {activeMission && (
            <button
              onClick={() => {
                retroAudio.playSelect();
                setShowMissionPanel(!showMissionPanel);
              }}
              className={`pixel-btn-wood-compact text-[13px] sm:text-[15px] py-2 px-2.5 flex items-center gap-1 shrink-0 shadow-sm ${
                showMissionPanel ? '!bg-[#78350f] text-amber-200 ring-2 ring-amber-400' : 'text-amber-100'
              } font-semibold`}
              title="Tampilkan / Sembunyikan Panduan Misi"
            >
              <span className="material-symbols-outlined text-[15px] font-semibold">assignment</span>
              <span className="hidden sm:inline">MISI</span>
            </button>
          )}

          <div className="h-6 w-px bg-[#b45309]/30 hidden sm:block" />

          {/* Kotak Info Level (SS 3 Warm Parchment Card) */}
          <div className="bg-[#fffbeb] border-2 border-[#b45309] px-3.5 py-1.5 rounded-xl shadow-sm flex items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[15px] sm:text-base font-extrabold text-[#451a03] font-sans tracking-wide leading-tight">
                  {activeMission ? activeMission.title : 'Ruang Simulasi Sandbox'}
                </h1>
                {activeMission && (
                  <span className="px-2 py-0.5 rounded text-[14.5px] font-bold bg-[#b45309] text-white font-pixel uppercase shadow-sm">
                    {activeMission.category === 'proyek' ? `Kasus ${activeMission.level}` : `Level ${activeMission.level}`}
                  </span>
                )}
              </div>
              <p className="text-[13px] text-[#78350f]/90 hidden sm:block font-sans truncate max-w-xs md:max-w-md font-semibold">
                {activeMission ? activeMission.scenario : 'Rancang dan uji logika sistem mitigasi'}
              </p>
            </div>
          </div>
        </div>

        <div id="tour-ws-actions" className="flex items-center gap-1.5 sm:gap-2">
          {/* Sambungkan Diorama WiFi Button */}
          <div className="relative">
            <button
              onClick={() => {
                retroAudio.playSelect();
                wsStatus === 'connected' ? disconnectMaket() : setShowWsModal(!showWsModal);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 text-[14.5px] font-bold transition-all shadow-sm ${wsStatus === 'connected'
                ? 'bg-[#f0fdf4] text-[#15803d] border-[#16a34a]'
                : wsStatus === 'connecting'
                  ? 'bg-[#fef3c7] text-[#b45309] border-[#d97706] animate-pulse'
                  : 'bg-[#fffbeb] border-[#b45309] text-[#78350f] hover:bg-[#fef3c7]'
                }`}
              title="Sambungkan Diorama Fisik via WiFi"
            >
              <span className={`w-2 h-2 rounded-full ${wsStatus === 'connected' ? 'bg-[#10b981] shadow-[0_0_6px_#10b981]' : wsStatus === 'connecting' ? 'bg-[#f59e0b]' : 'bg-[#a8a29e]'}`} />
              <span className="hidden md:inline">{wsStatus === 'connected' ? 'Diorama WiFi: OK' : wsStatus === 'connecting' ? 'Menghubungkan...' : 'Diorama WiFi'}</span>
              <span className="md:hidden">WiFi</span>
            </button>

            {/* IP Input Modal (SS 3 Warm Parchment) */}
            {showWsModal && wsStatus !== 'connected' && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-[#fffbeb] border-2 border-[#b45309] rounded-xl shadow-2xl p-3.5 z-50 font-sans text-[#1c1917]">
                <h4 className="font-bold text-[13px] text-[#78350f] mb-1 font-pixel">Alamat IP Diorama (WiFi)</h4>
                <p className="text-[13.5px] text-[#451a03] mb-2 leading-relaxed font-semibold">
                  Hubungkan ke WiFi <b>DIORAMA_ESP32</b> (Pass: 12345678). IP default: <b>192.168.4.1</b> (Port 81).
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={wsIp}
                      onChange={(e) => setWsIp(e.target.value)}
                      className="flex-1 bg-[#fefce8] px-2.5 py-1.5 border border-[#b45309] rounded-lg text-[#451a03] text-[13px] outline-none focus:ring-1 focus:ring-[#d97706] font-mono font-bold"
                      placeholder="192.168.4.1"
                      disabled={wsStatus === 'connecting'}
                    />
                    <button
                      type="button"
                      onClick={() => setWsIp('192.168.4.1')}
                      className="px-2 py-1.5 text-[13.5px] bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] border border-[#b45309] rounded-lg font-bold font-pixel shrink-0"
                      title="Set IP ke 192.168.4.1 (Access Point Diorama)"
                    >
                      AP 4.1
                    </button>
                  </div>
                  <div className="flex justify-end gap-2 pt-1 font-pixel">
                    <button
                      onClick={() => setShowWsModal(false)}
                      className="text-[14.5px] text-[#78716c] hover:text-[#1c1917] px-2 py-1 font-bold"
                    >
                      Batal
                    </button>
                    <button
                      onClick={connectMaket}
                      disabled={wsStatus === 'connecting'}
                      className="bg-[#c2410c] hover:bg-[#ea580c] text-white text-[14.5px] py-1 px-3 rounded-lg font-bold shadow-md border border-[#7c2d12]"
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
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 text-[14.5px] font-bold transition-all shadow-sm ${serialStatus === 'connected'
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

          {/* Run / Stop Simulation Button */}
          <button
            onClick={() => {
              retroAudio.playSelect();
              toggleSimulation();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-[13px] shadow-md transition-all border-2 cursor-pointer ${isRunning
              ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white border-red-800'
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
        {/* Desktop inline mission panel */}
        {activeMission && showMissionPanel && (
          <div className="hidden lg:flex h-full shrink-0 relative z-20 shadow-lg">
            <MissionPanel missionId={activeMission.id} onClose={() => setShowMissionPanel(false)} />
          </div>
        )}

        {/* Mobile / Tablet Drawer Mission Panel */}
        {activeMission && showMissionPanel && (
          <div className="lg:hidden fixed inset-0 z-[100] flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100]"
              onClick={() => setShowMissionPanel(false)}
            />
            <div className="relative z-[101] h-full shadow-2xl">
              <MissionPanel missionId={activeMission.id} onClose={() => setShowMissionPanel(false)} />
            </div>
          </div>
        )}

        {/* RIGHT SIDE: Evacuation Digital Twin (Top) & Blockly/Console (Bottom) */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* TOP: Evacuation Game View (Kiri: Kanvas 3D Merapi, Kanan: Telemetri Digital Twin Sesuai SS 3 & SS 2) */}
          <section className={`${isMapExpanded ? 'h-[72vh]' : 'h-[44vh]'} w-full shrink-0 border-b-4 border-[#78350f] shadow-md relative z-10 bg-[#060913] transition-all duration-300 flex overflow-hidden`}>
            {/* Mobile Tab Switcher for Top Section */}
            <div className="md:hidden absolute top-2 right-2 z-30 flex items-center bg-[#fef3c7] border-2 border-[#78350f] rounded-lg p-0.5 shadow-md text-[13.5px] font-pixel font-semibold">
              <button
                onClick={() => setTopTabMobile('canvas')}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  topTabMobile === 'canvas' ? 'bg-[#b45309] text-white shadow-xs' : 'text-[#78350f]'
                }`}
              >
                PETA 3D
              </button>
              <button
                onClick={() => setTopTabMobile('telemetry')}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  topTabMobile === 'telemetry' ? 'bg-[#b45309] text-white shadow-xs' : 'text-[#78350f]'
                }`}
              >
                TELEMETRI
              </button>
            </div>

            {/* Kiri: Kanvas 3D Merapi */}
            <div id="tour-ws-canvas" className={`flex-1 h-full relative overflow-hidden ${topTabMobile === 'telemetry' ? 'hidden md:block' : 'block'}`}>
              <CanvasErrorBoundary>
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full text-[#78350f] text-[13px] flex-col gap-2 font-pixel font-semibold">
                    <span>MEMUAT PETA DIORAMA 3D MITIGASI BENCANA...</span>
                  </div>
                }>
                  <EvacuationCanvas />
                </Suspense>
              </CanvasErrorBoundary>
            </div>

            {/* Kanan: Telemetri Digital Twin Side Panel (Sesuai Garis Merah SS 3 & Data SS 2) */}
            <aside id="tour-ws-telemetry" aria-label="Telemetri Digital Twin" className={`w-full md:w-80 md:w-84 xl:w-92 h-full shrink-0 md:border-l-4 md:border-[#78350f] bg-[#fffbeb] shadow-xl overflow-hidden z-20 ${topTabMobile === 'canvas' ? 'hidden md:block' : 'block'}`}>
              <TelemetrySidePanel />
            </aside>
          </section>

          {/* BOTTOM: Blockly Workspace & Right Activity Console */}
          <section className="flex-1 flex overflow-hidden relative isolate bg-[#fefce8] z-0">
            {/* Mobile Tab Switcher for Bottom Section */}
            <div className="md:hidden absolute top-2 right-2 z-30 flex items-center bg-[#fef3c7] border-2 border-[#78350f] rounded-lg p-0.5 shadow-md text-[13.5px] font-pixel font-semibold">
              <button
                onClick={() => setBottomTabMobile('editor')}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  bottomTabMobile === 'editor' ? 'bg-[#b45309] text-white shadow-xs' : 'text-[#78350f]'
                }`}
              >
                BALOK
              </button>
              <button
                onClick={() => setBottomTabMobile('console')}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  bottomTabMobile === 'console' ? 'bg-[#b45309] text-white shadow-xs' : 'text-[#78350f]'
                }`}
              >
                KONSOL
              </button>
            </div>

            {/* Blockly Editor */}
            <div id="tour-ws-editor" className={`flex-1 overflow-hidden relative isolate ${bottomTabMobile === 'console' ? 'hidden md:block' : 'block'}`}>
              <BlockEditor />
            </div>

            {/* Right Activity Console Panel */}
            <aside aria-label="Monitor Aktivitas" className={`w-full md:w-80 shrink-0 md:border-l-4 md:border-[#78350f] overflow-hidden flex flex-col bg-[#fffbeb] shadow-lg ${bottomTabMobile === 'editor' ? 'hidden md:flex' : 'flex'}`}>
              <ConsoleOutput />
            </aside>
          </section>
        </div>
      </main>

      {/* ── PANDUAN INTERAKTIF RESQY (ONBOARDING GAME TUTORIAL) ── */}
      <ResqyTutorialOverlay
        tour={TUTORIAL_TOURS.workspace}
        userId={student?.id || currentUser?.id || 'guest'}
      />
    </div>
  );
}
