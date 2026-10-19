// ── src/app/Workspace/koneksiDiorama.ts ───────────────────────────────
// KONEKSI DIORAMA FISIK (WiFi / WebSocket) YANG BERTAHAN ANTAR-HALAMAN.
//
// ═══════════════════════════════════════════════════════════════════════
// MENGAPA BERKAS INI ADA
// ═══════════════════════════════════════════════════════════════════════
//
//   Sebelumnya objek WebSocket disimpan di dalam komponen Workspace
//   (`useRef`), DAN komponen itu memutus sambungan saat dibongkar:
//
//       useEffect(() => () => { wsRef.current?.close(); }, []);
//
//   Akibatnya siswa harus menyambungkan ulang diorama SETIAP KALI pindah
//   misi — karena untuk memilih misi berikutnya ia kembali dulu ke peta
//   Level 3, dan Workspace dibongkar lalu dipasang lagi. Untuk seluruh daftar
//   misi, itu berarti menyambungkan ulang berkali-kali tanpa perlu.
//
//   Sekarang objek WebSocket hidup di TINGKAT MODUL, di luar React. Ia
//   bertahan ketika Workspace dibongkar, dan hanya ditutup bila siswa
//   menekan tombol putus atau menutup aplikasi.
//
//   Komponen hanya MENDAFTARKAN penangan (untuk mencatat log dan mengubah
//   tampilan status) setiap kali dipasang, lalu melepasnya saat dibongkar —
//   sambungannya sendiri tidak disentuh.

export type StatusKoneksi = 'idle' | 'connecting' | 'connected';

type PenanganPesan = (baris: string) => void;
type PenanganStatus = (status: StatusKoneksi, kodeTutup: number, ip: string) => void;

let soket: WebSocket | null = null;
let status: StatusKoneksi = 'idle';
let ipAktif = '192.168.4.1';

let penanganPesan: PenanganPesan | null = null;
let penanganStatus: PenanganStatus | null = null;

/** Perintah awal yang selalu dikirim begitu sambungan terbuka. */
const PERINTAH_AWAL = ['anode', 'rgb off', 'led off'];

function kirimAwal() {
  if (!soket || soket.readyState !== WebSocket.OPEN) return;
  for (const p of PERINTAH_AWAL) soket.send(`${p}\n`);
}

function ubahStatus(baru: StatusKoneksi, kodeTutup = 0) {
  status = baru;
  penanganStatus?.(baru, kodeTutup, ipAktif);
}

export const koneksiDiorama = {
  /** Status sambungan saat ini. Dipakai komponen agar tampilan langsung benar. */
  get status(): StatusKoneksi {
    return status;
  },

  /** Alamat IP yang terakhir dipakai. */
  get ip(): string {
    return ipAktif;
  },

  /** Apakah soket benar-benar terbuka dan siap menerima perintah? */
  siap(): boolean {
    return soket?.readyState === WebSocket.OPEN;
  },

  /**
   * Didaftarkan komponen setiap kali dipasang. Penangan lama otomatis
   * diganti, sehingga tidak pernah ada dua penangan aktif sekaligus.
   */
  daftarkan(penangan: { pesan: PenanganPesan; status: PenanganStatus }) {
    penanganPesan = penangan.pesan;
    penanganStatus = penangan.status;
  },

  /** Dilepas saat komponen dibongkar. Sambungan TIDAK ditutup. */
  lepas() {
    penanganPesan = null;
    penanganStatus = null;
  },

  sambung(ip: string) {
    if (!ip) return;

    // Sudah tersambung ke alamat yang sama: jangan buat soket kedua.
    if (soket && soket.readyState === WebSocket.OPEN && ip === ipAktif) {
      ubahStatus('connected');
      return;
    }

    // Bersihkan soket lama bila ada (mis. ganti alamat IP).
    if (soket) {
      try {
        soket.close();
      } catch {
        /* diabaikan */
      }
      soket = null;
    }

    ipAktif = ip;
    ubahStatus('connecting');

    let ws: WebSocket;
    try {
      ws = new WebSocket(`ws://${ip}:81`);
    } catch {
      ubahStatus('idle');
      return;
    }
    soket = ws;

    ws.onopen = () => {
      ubahStatus('connected');
      kirimAwal();
    };

    ws.onmessage = (event) => {
      String(event.data)
        .split('\n')
        .forEach((baris) => {
          const l = baris.trim();
          if (!l) return;
          // ESP32 mengirim penanda sambungan; kunci ulang mode anode saat itu.
          if (l.includes('CONNECTED_TO_ESP32') || l.includes('ESP32') || l.includes('SISTEM SIAP')) {
            kirimAwal();
          }
          penanganPesan?.(l);
        });
    };

    ws.onclose = (ev) => {
      soket = null;
      ubahStatus('idle', ev.code);
    };

    ws.onerror = () => {
      // Peristiwa `error` tidak membawa keterangan apa pun menurut standar.
      // Keterangan yang berguna ada pada `onclose`.
      ubahStatus('idle');
    };
  },

  putus() {
    if (!soket) return;
    try {
      soket.close();
    } catch {
      /* diabaikan */
    }
    soket = null;
    ubahStatus('idle', 1000);
  },

  /** Kirim satu perintah. Mengembalikan true bila benar-benar terkirim. */
  kirim(teks: string): boolean {
    if (soket?.readyState !== WebSocket.OPEN) return false;
    soket.send(teks);
    return true;
  },
};
