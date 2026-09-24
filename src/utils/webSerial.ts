// ── webSerial.ts ───────────────────────────────────────────────────────────
// Helper Web Serial API untuk mengontrol diorama fisik (ESP32/Arduino) via
// kabel USB, tanpa server/internet.
//
// Catatan penting:
//  - Hanya didukung di Chrome / Edge (desktop).
//  - Hanya jalan di konteks aman: https:// atau http://localhost (npm run dev).
//  - Satu port hanya bisa dibuka oleh satu aplikasi. Jadi TUTUP Serial Monitor
//    di Arduino IDE dulu sebelum menghubungkan dari web.

type SerialConnectionListener = (connected: boolean) => void;
type SerialDataListener = (line: string) => void;

interface SerialPortLike {
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
  readable: ReadableStream<Uint8Array> | null;
  writable: WritableStream<Uint8Array> | null;
}

let port: SerialPortLike | null = null;
let writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
let keepReading = false;
const listeners = new Set<SerialConnectionListener>();
const dataListeners = new Set<SerialDataListener>();

function notify(connected: boolean) {
  listeners.forEach((cb) => cb(connected));
}

/** Daftarkan callback perubahan status koneksi. Mengembalikan fungsi unsubscribe. */
export function onSerialConnectionChange(cb: SerialConnectionListener): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** Daftarkan callback untuk setiap baris data yang diterima dari hardware. */
export function onSerialData(cb: SerialDataListener): () => void {
  dataListeners.add(cb);
  return () => {
    dataListeners.delete(cb);
  };
}

// Loop pembacaan data masuk dari hardware, dipecah per baris (dipisah '\n').
async function readLoop(): Promise<void> {
  if (!port?.readable) return;
  keepReading = true;
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    reader = port.readable.getReader();
    while (keepReading) {
      const { value, done } = await reader.read();
      if (done) break;
      if (!value) continue;
      buffer += decoder.decode(value, { stream: true });
      let idx: number;
      while ((idx = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 1);
        if (line) dataListeners.forEach((cb) => cb(line));
      }
    }
  } catch {
    // Pembacaan dibatalkan / koneksi terputus; abaikan.
  } finally {
    try {
      reader?.releaseLock();
    } catch {
      // ignore
    }
    reader = null;
  }
}

/** Apakah browser mendukung Web Serial API? */
export function isWebSerialSupported(): boolean {
  return typeof navigator !== 'undefined' && 'serial' in navigator;
}

/** Apakah port serial saat ini terhubung? */
export function isSerialConnected(): boolean {
  return writer !== null;
}

/** Buka dialog pemilihan port lalu hubungkan. Baud rate harus sama dengan sketch Arduino. */
export async function connectSerial(baudRate = 9600): Promise<void> {
  if (!isWebSerialSupported()) {
    throw new Error('Browser tidak mendukung Web Serial. Gunakan Chrome atau Edge.');
  }
  const nav = navigator as unknown as {
    serial: { requestPort(): Promise<SerialPortLike> };
  };
  port = await nav.serial.requestPort();
  await port.open({ baudRate });
  if (!port.writable) {
    throw new Error('Port tidak dapat ditulis (writable stream tidak tersedia).');
  }
  writer = port.writable.getWriter();
  // Mulai membaca data masuk dari hardware (berjalan di background).
  void readLoop();
  notify(true);
}

/** Kirim satu perintah teks (otomatis ditambah newline). No-op jika belum terhubung. */
export async function sendSerial(command: string): Promise<void> {
  if (!writer) return;
  try {
    const data = new TextEncoder().encode(command + '\n');
    await writer.write(data);
  } catch {
    // Koneksi mungkin terputus di tengah jalan; abaikan agar UI tidak crash.
  }
}

/** Putuskan koneksi dan lepaskan port. */
export async function disconnectSerial(): Promise<void> {
  keepReading = false;
  try {
    await reader?.cancel();
  } catch {
    // ignore
  }
  try {
    writer?.releaseLock();
  } catch {
    // ignore
  }
  writer = null;
  try {
    await port?.close();
  } catch {
    // ignore
  }
  port = null;
  notify(false);
}
