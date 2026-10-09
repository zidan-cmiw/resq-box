import { create } from 'zustand';

export interface ConsoleLog {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'system';
  timestamp: string;
}

interface SensorValues {
  A1: number;   // Vibration sensor (0-1023)
  A2: number;   // Temperature (mapped to 0-1023, e.g. LM35)
  D2: boolean;  // Button 1
  D3: boolean;  // Button 2
}

// ── Digital Twin Pin States ───────────────────────────────────────
export interface PinStates {
  '10': 'HIGH' | 'LOW';   // LED Bahaya (Merah)
  '11': 'HIGH' | 'LOW';   // LED Aman (Hijau)
  '12': 'HIGH' | 'LOW';   // LED Info (Kuning)
  '13': 'HIGH' | 'LOW';   // LED Bawaan
  SERVO: 'OPEN' | 'CLOSED'; // Pintu Evakuasi
  BUZZER: boolean;           // Sirine
  MOTOR: 'OFF' | 'SLOW' | 'MEDIUM' | 'FAST'; // Kipas Ventilasi / Getar
}

const DEFAULT_PIN_STATES: PinStates = {
  '10': 'LOW', '11': 'LOW', '12': 'LOW', '13': 'LOW',
  SERVO: 'CLOSED', BUZZER: false, MOTOR: 'OFF',
};

export type SeismicLevel = 0 | 1 | 2 | 3;
export type VolcanoStatus = 'NORMAL' | 'WASPADA' | 'SIAGA' | 'AWAS';
export type EruptionType = 'NONE' | 'EKSPLOSIF' | 'EFUSIF';
export type EvacuationCommand =
  | 'NONE'
  | 'KELUAR_BANGUNAN'
  | 'TANAH_LAPANG'
  | 'KRB2'
  | 'KRB1'
  | 'LUAR_MAP'
  | 'JAUHI_SUNGAI';

interface RuntimeState {
  isRunning: boolean;
  sensorValues: SensorValues;
  consoleLogs: ConsoleLog[];
  showConsole: boolean;
  pinStates: PinStates;

  // Telemetri Digital Twin Bencana & Mitigasi
  seismicLevel: SeismicLevel;
  richterScale: number;
  volcanoStatus: VolcanoStatus;
  volcanoTemp: number;
  eruptionType: EruptionType;
  selectedRoute: string;
  activeShelter: string;
  activeEvacCommand: EvacuationCommand;
  oledMessage: string;
  locationContext: string;
  rgbColor: 'green' | 'yellow' | 'orange' | 'red' | 'off';
  mistActive: boolean;
  isMapExpanded: boolean;
  disasterResetCounter: number;

  setRunning: (running: boolean) => void;
  setSensorValue: (pin: keyof SensorValues, value: number | boolean) => void;
  addLog: (text: string, type?: ConsoleLog['type']) => void;
  clearLogs: () => void;
  toggleConsole: () => void;
  toggleMapExpanded: () => void;
  triggerDisasterReset: () => void;

  setPinState: (pin: string, state: string) => void;
  resetPinStates: () => void;

  setSeismicSimulation: (level: SeismicLevel) => void;
  setVolcanoSimulation: (status: VolcanoStatus, type?: EruptionType) => void;
  setEvacuationRoute: (route: string) => void;
  setActiveShelter: (shelter: string) => void;
  setEvacuationCommand: (cmd: EvacuationCommand) => void;
  setOledMessage: (msg: string) => void;
  setLocationContext: (loc: string) => void;
  setRgbColor: (color: 'green' | 'yellow' | 'orange' | 'red' | 'off') => void;
  setMistActive: (active: boolean) => void;
}

export const useRuntimeStore = create<RuntimeState>((set) => ({
  isRunning: false,
  sensorValues: {
    A1: 0,
    A2: 275,  // ~27°C normal
    D2: false,
    D3: false,
  },
  consoleLogs: [],
  showConsole: true,
  pinStates: { ...DEFAULT_PIN_STATES },

  // Initial disaster states
  seismicLevel: 0,
  richterScale: 0.0,
  volcanoStatus: 'NORMAL',
  volcanoTemp: 27.5,
  eruptionType: 'NONE',
  selectedRoute: 'Belum Ditentukan',
  activeShelter: 'Belum Diaktifkan',
  activeEvacCommand: 'NONE',
  oledMessage: 'SISTEM SIAP: MENUNGGU...',
  locationContext: 'Pemukiman Warga',
  rgbColor: 'off',
  mistActive: false,
  isMapExpanded: false,
  disasterResetCounter: 0,

  setRunning: (running) => set({ isRunning: running }),
  triggerDisasterReset: () => set((s) => ({ disasterResetCounter: s.disasterResetCounter + 1 })),

  setSensorValue: (pin, value) =>
    set((s) => ({
      sensorValues: { ...s.sensorValues, [pin]: value },
    })),

  addLog: (text, type = 'info') => {
    const log: ConsoleLog = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      type,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    set((s) => ({ consoleLogs: [...s.consoleLogs, log] }));
  },

  clearLogs: () => set({ consoleLogs: [] }),
  toggleConsole: () => set((s) => ({ showConsole: !s.showConsole })),
  toggleMapExpanded: () => set((s) => ({ isMapExpanded: !s.isMapExpanded })),


  setPinState: (pin, state) => set((s) => {
    const next = { ...s.pinStates } as any;
    if (['10','11','12','13'].includes(pin)) {
      next[pin] = state === 'HIGH' ? 'HIGH' : 'LOW';
    }
    if (pin === 'SERVO' || state.includes('Terbuka') || state.includes('Tertutup')) {
      next.SERVO = state.includes('Terbuka') || state === 'OPEN' ? 'OPEN' : 'CLOSED';
    }
    if (pin === 'BUZZER') {
      next.BUZZER = state === 'ON';
    }
    if (pin === 'MOTOR') {
      next.MOTOR = state;
    }
    return { pinStates: next };
  }),

  setSeismicSimulation: (level) => set((s) => {
    let richter = 0.0;
    let a1Val = 0;
    if (level === 1) { richter = 3.4; a1Val = 350; }
    else if (level === 2) { richter = 5.6; a1Val = 620; }
    else if (level === 3) { richter = 7.4; a1Val = 920; }

    return {
      seismicLevel: level,
      richterScale: richter,
      sensorValues: { ...s.sensorValues, A1: a1Val }
    };
  }),

  setVolcanoSimulation: (status, type = 'NONE') => set((s) => {
    let temp = 27.5;
    let rgb: 'green' | 'yellow' | 'orange' | 'red' | 'off' = 'off';
    let mist = false;
    let seismic: SeismicLevel = s.seismicLevel;
    let richter = s.richterScale;
    let a1Val = s.sensorValues.A1;

    if (status === 'NORMAL') {
      temp = 27.5;
      rgb = 'off';
      mist = false;
      seismic = 0;
      richter = 0.0;
      a1Val = 0;
    } else if (status === 'WASPADA') {
      temp = 43.8;
      rgb = 'yellow';
      mist = false;
      // Fase 1: Tidak ada gempa
      seismic = 0;
      richter = 0.0;
      a1Val = 0;
    } else if (status === 'SIAGA') {
      temp = 68.4;
      rgb = 'orange';
      mist = false;
      // Fase 2: Tidak ada gempa
      seismic = 0;
      richter = 0.0;
      a1Val = 0;
    } else if (status === 'AWAS') {
      temp = 94.6;
      rgb = 'red';
      mist = true;
      // Fase 3: Gempa aktif, baik di tipe Eksplosif maupun Efusif
      if (type === 'EFUSIF') {
        // Erupsi Efusif: Gempa tremor vulkanik sedang
        seismic = 1;
        richter = 3.6;
        a1Val = 380;
      } else {
        // Erupsi Eksplosif: Gempa tremor vulkanik kuat terus-menerus
        seismic = 3;
        richter = 6.2;
        a1Val = 850;
      }
    }

    const rawA2 = Math.round((temp / 100) * 1023);

    return {
      volcanoStatus: status,
      volcanoTemp: temp,
      eruptionType: type,
      rgbColor: rgb,
      mistActive: mist,
      seismicLevel: seismic,
      richterScale: richter,
      sensorValues: { ...s.sensorValues, A1: a1Val, A2: rawA2 }
    };
  }),

  setEvacuationRoute: (route) => set({ selectedRoute: route }),
  setActiveShelter: (shelter) => set({ activeShelter: shelter }),
  setEvacuationCommand: (cmd) => set({ activeEvacCommand: cmd }),
  setOledMessage: (msg) => set({ oledMessage: msg }),
  setLocationContext: (loc) => set({ locationContext: loc }),
  setRgbColor: (color) => set({ rgbColor: color }),
  setMistActive: (active) => set({ mistActive: active }),

  resetPinStates: () => set({
    pinStates: { ...DEFAULT_PIN_STATES },
    seismicLevel: 0,
    richterScale: 0.0,
    volcanoStatus: 'NORMAL',
    volcanoTemp: 27.5,
    eruptionType: 'NONE',
    selectedRoute: 'Belum Ditentukan',
    activeShelter: 'Belum Diaktifkan',
    activeEvacCommand: 'NONE',
    oledMessage: 'SISTEM SIAP: MENUNGGU...',
    rgbColor: 'off',
    mistActive: false,
  }),
}));
