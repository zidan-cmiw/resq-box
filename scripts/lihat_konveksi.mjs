// ── scripts/lihat_konveksi.mjs ───────────────────────────────────────────────
// Membuat gambar dari geometri ilustrasi konveksi mantel, supaya ORIENTASINYA
// dapat DIPERIKSA DENGAN MATA - tanpa perlu membuka aplikasi dan memainkan
// Level 1 sampai zona mantel.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA SKRIP INI ADA
// ═══════════════════════════════════════════════════════════════════════════
//
//   Ilustrasi ini pernah SALAH TIGA KALI - inti terbalik, langit terbaca sebagai
//   lapisan terluar, dan sel konveksi keluar dari badan bumi. Ketiganya LOLOS
//   seluruh pemeriksa kode: typecheck, tes, dan lint tetap hijau, karena tidak
//   satu pun dari mereka melihat gambarnya.
//
//   Kesalahan orientasi sepenuhnya ditentukan oleh ANGKA, jadi menggambar ulang
//   geometrinya dari konstanta yang sama sudah cukup untuk memeriksanya.
//
// ═══════════════════════════════════════════════════════════════════════════
// CARA PAKAI
// ═══════════════════════════════════════════════════════════════════════════
//
//     node scripts/lihat_konveksi.mjs
//
//   Lalu jalankan perintah Edge yang dicetak skrip ini, dan buka berkas PNG-nya.
//
// CATATAN PENTING
//   Skrip ini MENYALIN konstanta dan rumus dari `DiscoveryModal.tsx`, jadi ia
//   TIDAK ikut berubah sendiri bila komponen aslinya diubah. Bila angkanya
//   berubah, salin ulang - dan bila berbeda, anggap komponen aslinya yang benar.

import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// ── Konstanta & rumus: disalin dari MantleConvectionHalfEarth ──────────────
const CX = 280;
const DASAR = 400; // sisi bawah potongan
const R_BUMI = 320;
const Y_BUSUR = 237; // ketinggian ujung busur di tepi kiri & kanan
const CORE_RX = 145;
const CORE_RY = 130;
const INNER_RX = 85;
const INNER_RY = 75;

const busurPermukaan = `M ${CX - 255} ${Y_BUSUR} A ${R_BUMI} ${R_BUMI} 0 0 1 ${CX + 255} ${Y_BUSUR}`;
const badanBumi = `${busurPermukaan} L ${CX + 255} ${DASAR} L ${CX - 255} ${DASAR} Z`;
const kubah = (rx, ry) => `M ${CX - rx} ${DASAR} A ${rx} ${ry} 0 0 1 ${CX + rx} ${DASAR} Z`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 400" width="560" height="400">
  <rect width="560" height="400" fill="#2b9fd8"/>
  <path d="${badanBumi}" fill="#3f6212" opacity="0.55"/>
  <path d="${busurPermukaan}" fill="none" stroke="#365314" stroke-width="12"/>
  <path d="${kubah(CORE_RX, CORE_RY)}" fill="#dc2626"/>
  <path d="${kubah(INNER_RX, INNER_RY)}" fill="#fbbf24"/>
  <ellipse cx="105" cy="300" rx="62" ry="52" fill="none" stroke="#f97316" stroke-width="5"/>
  <ellipse cx="455" cy="300" rx="62" ry="52" fill="none" stroke="#38bdf8" stroke-width="5"/>
  <line x1="0" y1="${DASAR}" x2="560" y2="${DASAR}" stroke="#ffffff" stroke-width="1" stroke-dasharray="5 5"/>
  <text x="12" y="${DASAR - 8}" fill="#ffffff" font-size="15" font-family="monospace">DASAR=${DASAR}</text>
  <text x="12" y="${Y_BUSUR - 6}" fill="#ffffff" font-size="15" font-family="monospace">Y_BUSUR=${Y_BUSUR}</text>
  <text x="12" y="${Y_BUSUR + 22}" fill="#ffffff" font-size="15" font-family="monospace">PERMUKAAN BUMI</text>
  <text x="${CX}" y="${DASAR - 34}" fill="#ffffff" font-size="20" font-family="monospace" text-anchor="middle">INTI BUMI</text>
  <text x="105" y="300" fill="#ffffff" font-size="13" font-family="monospace" text-anchor="middle">naik</text>
  <text x="455" y="300" fill="#ffffff" font-size="13" font-family="monospace" text-anchor="middle">turun</text>
</svg>`;

const svgPath = join(tmpdir(), 'konveksi-rekonstruksi.svg');
const pngPath = join(tmpdir(), 'konveksi-rekonstruksi.png');
writeFileSync(svgPath, svg, 'utf8');

console.log('Geometri ilustrasi konveksi mantel');
console.log('  permukaan bumi (busur)  : y = ' + Y_BUSUR + '  <- di ATAS');
console.log('  sisi bawah potongan     : y = ' + DASAR + '  <- di BAWAH');
console.log('  inti luar (kubah)       : rx=' + CORE_RX + ' ry=' + CORE_RY + ', duduk di y=' + DASAR);
console.log('  inti dalam (kubah)      : rx=' + INNER_RX + ' ry=' + INNER_RY + ', duduk di y=' + DASAR);
console.log('');
console.log('  Yang diperiksa: inti harus berada di BAWAH (y besar) dan berbentuk');
console.log('  kubah yang melengkung KE ATAS, sedangkan permukaan bumi di ATAS.');
console.log('');
console.log('Berkas SVG: ' + svgPath);
console.log('');
console.log('Jalankan perintah ini untuk membuat gambarnya:');
console.log(
  '  msedge --headless=new --disable-gpu --window-size=1120,800 --force-device-scale-factor=2 ' +
    '--screenshot="' + pngPath + '" "file:///' + svgPath.replace(/\\/g, '/') + '"',
);
