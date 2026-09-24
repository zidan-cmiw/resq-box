import { useRef, useEffect, useState, lazy, Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';

const EvacuationCanvas = lazy(() => import('../EvacuationGame/EvacuationCanvas'));
import { useNavigate, useSearchParams } from 'react-router-dom';
import BlockEditor from './BlockEditor';
import MissionPanel from './MissionPanel';
import SensorPanel from './SensorPanel';
import ConsoleOutput from './ConsoleOutput';
import { MISSIONS } from '../../missions/data/missions';
import { useMissionStore } from '../../store/missionStore';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useRuntimeStore } from '../../store/runtimeStore';
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
      await connectSerial(9600);
      setSerialStatus('connected');
      addLog('[USB] Diorama Fisik Terhubung via kabel USB! Sinyal siap dikirim.', 'success');
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
    sendSerial(cmd);
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
      sendHardware('PIN:ALL:OFF');
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
        // Digital Twin: detect servo/motor state from print messages
        const store = useRuntimeStore.getState();
        // Digital Twin + kirim ke hardware fisik (WiFi/USB) untuk servo/buzzer/motor.
        if (text.includes('Pintu Evakuasi Terbuka')) { store.setPinState('SERVO', 'OPEN'); sendHardware('PIN:SERVO:OPEN'); }
        if (text.includes('Pintu Evakuasi Tertutup') || text.includes('Pintu Evakuasi Setengah')) { store.setPinState('SERVO', 'CLOSED'); sendHardware('PIN:SERVO:CLOSED'); }
        if (text.includes('Sirine berbunyi')) { store.setPinState('BUZZER', 'ON'); sendHardware('PIN:BUZZER:ON'); }
        if (text.includes('Sirine berhenti')) { store.setPinState('BUZZER', 'OFF'); sendHardware('PIN:BUZZER:OFF'); }
        if (text.includes('Kipas Ventilasi Kencang')) { store.setPinState('MOTOR', 'FAST'); sendHardware('PIN:MOTOR:FAST'); }
        if (text.includes('Kipas Ventilasi Sedang')) { store.setPinState('MOTOR', 'MEDIUM'); sendHardware('PIN:MOTOR:MEDIUM'); }
        if (text.includes('Kipas Ventilasi Pelan')) { store.setPinState('MOTOR', 'SLOW'); sendHardware('PIN:MOTOR:SLOW'); }
        if (text.includes('Kipas Ventilasi Mati')) { store.setPinState('MOTOR', 'OFF'); sendHardware('PIN:MOTOR:OFF'); }
      },
      setPin: (_pin: string, _state: string) => {
        // Kirim ke ESP32/Arduino (Diorama Fisik) via WiFi (WebSocket) & USB (Web Serial)
        sendHardware(`PIN:${_pin}:${_state}`);
        // Digital Twin: update pinStates in store
        useRuntimeStore.getState().setPinState(_pin, _state);
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
    <div className="h-screen w-full flex flex-col bg-surface text-on-surface">
      {/* Workspace Header */}
      <header className="h-14 bg-surface-container border-b border-outline-variant flex items-center px-md justify-between shrink-0">
        <div className="flex items-center gap-md">
          <button
            onClick={() => navigate('/')}
            className="p-sm hover:bg-surface-container-high rounded-full transition-colors flex items-center justify-center text-on-surface-variant"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-outline-variant" />
          <div>
            <h1 className="font-title-md text-title-md font-bold text-primary">
              {activeMission ? activeMission.title : 'Ruang Simulasi'}
            </h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              {activeMission ? (activeMission.category === 'proyek' ? `Kasus ${activeMission.level}` : `Skenario ${activeMission.level}`) : 'Susun Langkah Penyelamatan'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-sm">
          {/* Sambungkan Maket Button */}
          <div className="relative">
            <button
              onClick={() => wsStatus === 'connected' ? disconnectMaket() : setShowWsModal(!showWsModal)}
              className={`flex items-center gap-xs px-sm py-xs rounded-full border font-label-sm text-label-sm transition-all
                ${wsStatus === 'connected'
                  ? 'bg-[#16A34A] text-white border-[#16A34A]'
                  : wsStatus === 'connecting'
                    ? 'bg-yellow-500 text-white border-yellow-500'
                    : 'bg-surface-container-high border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                {wsStatus === 'connected' ? 'link' : 'memory'}
              </span>
              {wsStatus === 'connected' ? 'Diorama Terhubung' : wsStatus === 'connecting' ? 'Menghubungkan...' : 'Sambungkan Diorama Fisik'}
            </button>

            {/* IP Input Modal */}
            {showWsModal && wsStatus !== 'connected' && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg p-md z-50">
                <h4 className="font-title-sm text-title-sm text-on-surface mb-2">Alamat IP Diorama (WiFi)</h4>
                <p className="text-xs text-on-surface-variant mb-sm">
                  Lihat alamat IP pada layar OLED SSD1306 ESP32 atau Serial Monitor (misal: 192.168.1.15 atau 192.168.4.1). Port default: 81.
                </p>
                <div className="flex flex-col gap-sm">
                  <input
                    type="text"
                    value={wsIp}
                    onChange={(e) => setWsIp(e.target.value)}
                    className="w-full bg-surface px-sm py-xs border border-outline-variant rounded font-body-sm text-on-surface focus:outline-none focus:border-primary"
                    placeholder="192.168.x.x"
                    disabled={wsStatus === 'connecting'}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowWsModal(false)}
                      className="text-xs text-on-surface-variant hover:text-on-surface py-1 px-2"
                    >
                      Batal
                    </button>
                    <button
                      onClick={connectMaket}
                      disabled={wsStatus === 'connecting'}
                      className="bg-primary text-on-primary text-xs py-1 px-3 rounded hover:opacity-90 disabled:opacity-50"
                    >
                      Koneksikan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sambungkan via USB (Web Serial) */}
          <button
            onClick={connectSerialPort}
            className={`flex items-center gap-xs px-sm py-xs rounded-full border font-label-sm text-label-sm transition-all
              ${serialStatus === 'connected'
                ? 'bg-[#2563EB] text-white border-[#2563EB]'
                : serialStatus === 'connecting'
                  ? 'bg-yellow-500 text-white border-yellow-500'
                  : 'bg-surface-container-high border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
              }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>usb</span>
            {serialStatus === 'connected' ? 'USB Terhubung' : serialStatus === 'connecting' ? 'Menghubungkan...' : 'Sambungkan USB'}
          </button>

          {/* Tes Perangkat (kirim perintah manual) */}
          <div className="relative">
            <button
              onClick={() => setShowTestPanel(!showTestPanel)}
              className={`flex items-center gap-xs px-sm py-xs rounded-full border font-label-sm text-label-sm transition-all
                ${showTestPanel
                  ? 'bg-secondary-container text-on-secondary-container border-secondary-container'
                  : 'bg-surface-container-high border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>tune</span>
              Tes Perangkat
            </button>

            {showTestPanel && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg p-md z-50">
                <h4 className="font-title-sm text-title-sm text-on-surface mb-1">Tes Diorama Fisik ESP32</h4>
                <p className="text-xs text-on-surface-variant mb-sm">
                  {wsStatus === 'connected' || serialStatus === 'connected'
                    ? 'Klik tombol untuk menguji respon perangkat secara langsung.'
                    : 'Hubungkan WiFi (WebSocket) atau USB dulu agar perintah terkirim.'}
                </p>
                <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                  <button onClick={() => testSend('PIN:10:HIGH', 'LED Bahaya (Merah) ON')} className="text-xs py-1 px-2 rounded bg-red-500/10 text-red-600 border border-red-500/30 hover:bg-red-500/20">Merah ON</button>
                  <button onClick={() => testSend('PIN:10:LOW', 'LED Bahaya OFF')} className="text-xs py-1 px-2 rounded bg-surface-container border border-outline-variant hover:bg-surface-container-high">Merah OFF</button>
                  <button onClick={() => testSend('PIN:11:HIGH', 'LED Aman (Hijau) ON')} className="text-xs py-1 px-2 rounded bg-green-500/10 text-green-600 border border-green-500/30 hover:bg-green-500/20">Hijau ON</button>
                  <button onClick={() => testSend('PIN:11:LOW', 'LED Aman OFF')} className="text-xs py-1 px-2 rounded bg-surface-container border border-outline-variant hover:bg-surface-container-high">Hijau OFF</button>
                  <button onClick={() => testSend('PIN:12:HIGH', 'LED Info (Biru) ON')} className="text-xs py-1 px-2 rounded bg-blue-500/10 text-blue-600 border border-blue-500/30 hover:bg-blue-500/20">Biru ON</button>
                  <button onClick={() => testSend('PIN:12:LOW', 'LED Info OFF')} className="text-xs py-1 px-2 rounded bg-surface-container border border-outline-variant hover:bg-surface-container-high">Biru OFF</button>
                  <button onClick={() => testSend('PIN:BUZZER:ON', 'Alarm Buzzer ON')} className="text-xs py-1 px-2 rounded bg-amber-500/10 text-amber-600 border border-amber-500/30 hover:bg-amber-500/20">Buzzer ON</button>
                  <button onClick={() => testSend('PIN:BUZZER:OFF', 'Alarm Buzzer OFF')} className="text-xs py-1 px-2 rounded bg-surface-container border border-outline-variant hover:bg-surface-container-high">Buzzer OFF</button>
                  <button onClick={() => testSend('PIN:MOTOR:FAST', 'Mist Maker (Asap) ON')} className="text-xs py-1 px-2 rounded bg-purple-500/10 text-purple-600 border border-purple-500/30 hover:bg-purple-500/20">Mist (Asap) ON</button>
                  <button onClick={() => testSend('PIN:MOTOR:OFF', 'Mist Maker OFF')} className="text-xs py-1 px-2 rounded bg-surface-container border border-outline-variant hover:bg-surface-container-high">Mist OFF</button>
                  <button onClick={() => testSend('play 1', 'Audio DFPlayer Track 1')} className="text-xs py-1 px-2 rounded bg-teal-500/10 text-teal-600 border border-teal-500/30 hover:bg-teal-500/20">Audio Track 1</button>
                  <button onClick={() => testSend('stop', 'Audio Stop')} className="text-xs py-1 px-2 rounded bg-surface-container border border-outline-variant hover:bg-surface-container-high">Audio Stop</button>
                  <button onClick={() => testSend('PIN:SERVO:OPEN', 'Pintu Terbuka')} className="text-xs py-1 px-2 rounded bg-indigo-500/10 text-indigo-600 border border-indigo-500/30 hover:bg-indigo-500/20">Pintu Buka</button>
                  <button onClick={() => testSend('PIN:SERVO:CLOSED', 'Pintu Tertutup')} className="text-xs py-1 px-2 rounded bg-surface-container border border-outline-variant hover:bg-surface-container-high">Pintu Tutup</button>
                  <button onClick={() => testSend('PIN:ALL:OFF', 'Semua Output Mati')} className="col-span-2 text-xs py-1.5 px-2 rounded bg-surface-container-high border border-outline-variant hover:bg-error/10 hover:text-error hover:border-error/40 font-bold">Matikan Semua Output</button>
                </div>
              </div>
            )}
          </div>

          {/* Sensor Panel Toggle */}
          <button
            onClick={toggleSensorPanel}
            className={`flex items-center gap-xs px-sm py-xs rounded-full border font-label-sm text-label-sm transition-all
              ${showSensorPanel
                ? 'bg-secondary-container text-on-secondary-container border-secondary-container'
                : 'bg-surface-container-high border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
              }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>sensors</span>
            Sensor
          </button>

          {/* Run / Stop */}
          <button
            onClick={toggleSimulation}
            className={`flex items-center gap-xs px-md py-xs rounded-full font-label-lg shadow-sm tactile-btn transition-colors
              ${isRunning
                ? 'bg-error text-on-error hover:opacity-90'
                : 'bg-[#16A34A] text-white hover:opacity-90'
              }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              {isRunning ? 'stop' : 'play_arrow'}
            </span>
            {isRunning ? 'Berhenti' : 'Mulai'}
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden relative">
        {activeMission && <MissionPanel missionId={activeMission.id} />}

        {/* RIGHT SIDE: Top/Bottom Split */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* TOP: Evacuation Game View */}
          <section className="h-[35vh] w-full shrink-0 border-b-2 border-outline-variant shadow-sm relative z-10">
            <Suspense fallback={
              <div className="flex items-center justify-center h-full text-on-surface-variant text-xs flex-col gap-2">
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Memuat peta...
              </div>
            }>
              <EvacuationCanvas />
            </Suspense>
          </section>

          {/* BOTTOM: Blockly Editor & Console */}
          <section className="flex-1 flex overflow-hidden relative bg-surface-container-lowest">
            {/* Blockly Editor */}
            <div className="flex-1 overflow-hidden relative">
              <BlockEditor />
            </div>

            {/* Right Console Panel */}
            <aside className="w-80 shrink-0 border-l border-outline-variant overflow-hidden flex flex-col bg-surface">
              <div className="flex shrink-0 border-b border-outline-variant bg-surface-container-low">
                <div className="flex-1 py-sm text-xs font-semibold flex items-center justify-center gap-2 text-primary border-b-2 border-primary">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>receipt_long</span>
                  Monitor Aktivitas
                </div>
              </div>
              <div className="flex-1 overflow-hidden relative">
                <ConsoleOutput />
              </div>
            </aside>
          </section>
        </div>

        {/* Floating Sensor Panel */}
        <SensorPanel />
      </main>
    </div>
  );
}
