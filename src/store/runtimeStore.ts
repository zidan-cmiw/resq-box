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
  MOTOR: 'OFF' | 'SLOW' | 'MEDIUM' | 'FAST'; // Kipas Ventilasi
}

const DEFAULT_PIN_STATES: PinStates = {
  '10': 'LOW', '11': 'LOW', '12': 'LOW', '13': 'LOW',
  SERVO: 'CLOSED', BUZZER: false, MOTOR: 'OFF',
};

interface RuntimeState {
  isRunning: boolean;
  sensorValues: SensorValues;
  consoleLogs: ConsoleLog[];
  showSensorPanel: boolean;
  showConsole: boolean;
  pinStates: PinStates;

  setRunning: (running: boolean) => void;
  setSensorValue: (pin: keyof SensorValues, value: number | boolean) => void;
  addLog: (text: string, type?: ConsoleLog['type']) => void;
  clearLogs: () => void;
  toggleSensorPanel: () => void;
  toggleConsole: () => void;
  setPinState: (pin: string, state: string) => void;
  resetPinStates: () => void;
}

export const useRuntimeStore = create<RuntimeState>((set) => ({
  isRunning: false,
  sensorValues: {
    A1: 0,
    A2: 512,  // ~25°C default
    D2: false,
    D3: false,
  },
  consoleLogs: [],
  showSensorPanel: false,
  showConsole: true,
  pinStates: { ...DEFAULT_PIN_STATES },

  setRunning: (running) => set({ isRunning: running }),

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
  toggleSensorPanel: () => set((s) => ({ showSensorPanel: !s.showSensorPanel })),
  toggleConsole: () => set((s) => ({ showConsole: !s.showConsole })),

  setPinState: (pin, state) => set((s) => {
    const next = { ...s.pinStates } as any;
    // LED pins
    if (['10','11','12','13'].includes(pin)) {
      next[pin] = state === 'HIGH' ? 'HIGH' : 'LOW';
    }
    // Servo (Pintu Evakuasi)
    if (pin === 'SERVO' || state.includes('Terbuka') || state.includes('Tertutup')) {
      next.SERVO = state.includes('Terbuka') || state === 'OPEN' ? 'OPEN' : 'CLOSED';
    }
    // Buzzer
    if (pin === 'BUZZER') {
      next.BUZZER = state === 'ON';
    }
    // Motor
    if (pin === 'MOTOR') {
      next.MOTOR = state;
    }
    return { pinStates: next };
  }),

  resetPinStates: () => set({ pinStates: { ...DEFAULT_PIN_STATES } }),
}));
