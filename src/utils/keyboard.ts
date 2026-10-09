/**
 * Utilitas aksesibilitas keyboard untuk elemen yang dapat diklik.
 *
 * MASALAH YANG DISELESAIKAN
 *   Beberapa elemen memakai `<div onClick={...}>` sebagai tombol. Bagi pengguna
 *   tetikus itu bekerja, tetapi bagi pengguna keyboard elemen seperti itu
 *   TIDAK DAPAT DIJANGKAU: menekan Tab tidak berhenti di sana, sehingga fitur
 *   tersebut sama sekali tidak dapat dipakai tanpa tetikus.
 *
 *   Ini bukan sekadar soal kepatuhan aturan. Untuk siswa yang hanya bisa
 *   memakai keyboard — karena keterbatasan motorik, atau karena memakai
 *   pembaca layar — fitur yang tidak dapat dijangkau keyboard berarti fitur
 *   yang tidak ada.
 *
 * CARA PAKAI
 *   ```tsx
 *   <div
 *     role="button"
 *     tabIndex={0}
 *     aria-label="Buka misi Job 1"
 *     onClick={bukaMisi}
 *     onKeyDown={tombolPapanKetik(bukaMisi)}
 *   >
 *   ```
 *
 * MENGAPA onKeyDown PERLU, BUKAN CUKUP tabIndex
 *   `tabIndex={0}` membuat elemen dapat dijangkau Tab, tetapi menekan Enter
 *   atau Spasi tidak otomatis memicu `onClick` pada elemen non-tombol.
 *   Penanganan tombol harus ditulis eksplisit — itulah tugas fungsi ini.
 *
 * CATATAN SPASI
 *   Pada tombol asli, Spasi memicu klik saat TOMBOL DILEPAS, bukan ditekan.
 *   Fungsi ini meniru perilaku itu, sekaligus mencegah halaman menggulir ke
 *   bawah — perilaku bawaan Spasi pada peramban yang akan mengganggu.
 */
import type { KeyboardEvent } from 'react';

/** Tombol yang memicu aksi: Enter dan Spasi. */
const TOMBOL_AKSI = new Set(['Enter', ' ']);

/**
 * Bungkus fungsi aksi menjadi penanganan `onKeyDown`.
 *
 * @param aksi   Fungsi yang sama dengan yang dipakai `onClick`.
 * @param aktif  Setel `false` untuk menonaktifkan (mis. saat tombol disabled).
 */
export function tombolPapanKetik<E extends HTMLElement>(
  aksi: () => void,
  aktif = true,
) {
  return (e: KeyboardEvent<E>) => {
    if (!aktif) return;
    if (!TOMBOL_AKSI.has(e.key)) return;

    // Cegah peramban menggulir halaman saat Spasi ditekan
    e.preventDefault();
    // Cegah aksi ikut terpicu pada elemen induk yang juga punya onClick
    e.stopPropagation();
    aksi();
  };
}

/**
 * Penanganan tombol untuk elemen yang hanya boleh ditekan lewat keyboard
 * tertentu. Dipakai bila aksi tidak boleh terpicu oleh Spasi.
 */
export function tombolEnterSaja<E extends HTMLElement>(aksi: () => void) {
  return (e: KeyboardEvent<E>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    e.stopPropagation();
    aksi();
  };
}

/**
 * Sifat-sifat standar untuk elemen yang berperan sebagai tombol.
 *
 * Mengembalikan objek siap-sebar sehingga setiap pemakaian tidak perlu
 * menulis `role`, `tabIndex`, dan `onKeyDown` satu per satu — dan tidak
 * ada yang terlewat.
 */
export function sifatTombol(
  aksi: () => void,
  label: string,
  opsi: { aktif?: boolean; pakaiSpasi?: boolean } = {},
) {
  const { aktif = true, pakaiSpasi = true } = opsi;
  return {
    role: 'button' as const,
    tabIndex: aktif ? 0 : -1,
    'aria-label': label,
    'aria-disabled': aktif ? undefined : true,
    onKeyDown: pakaiSpasi ? tombolPapanKetik(aksi, aktif) : tombolEnterSaja(aksi),
  };
}

/**
 * Penanganan tombol untuk lapisan latar modal yang menutup modal saat diklik.
 *
 * KENAPA DIPERLUKAN
 *   Modal yang menutup saat latarnya diklik dapat dipakai dengan tetikus,
 *   tetapi TIDAK dengan keyboard — pengguna keyboard tidak dapat menutup
 *   modal itu tanpa mencari tombol tutup. Untuk modal yang tidak punya tombol
 *   tutup sama sekali, modal itu menjadi jalan buntu.
 *
 * PERILAKU
 *   - Escape menutup modal. Ini kebiasaan yang diharapkan pengguna keyboard.
 *   - Enter dan Spasi juga menutup, supaya latar yang tampak seperti tombol
 *     berperilaku seperti tombol.
 *
 * CATATAN
 *   Fungsi ini TIDAK memanggil `preventDefault` untuk Escape, agar penanganan
 *   Escape lain di halaman tetap dapat berjalan bila ada.
 */
export function tutupModalDenganKeyboard<E extends HTMLElement>(tutup: () => void) {
  return (e: KeyboardEvent<E>) => {
    if (e.key === 'Escape') {
      tutup();
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      tutup();
    }
  };
}

/**
 * Penghenti rambatan untuk pembungkus yang hanya mencegah aksi induk terpicu.
 *
 * KENAPA ADA
 *   Beberapa elemen memakai `onClick={(e) => e.stopPropagation()}` semata-mata
 *   agar klik pada isinya tidak ikut memicu aksi elemen induk — misalnya agar
 *   menekan tombol di toolbar tidak dianggap "lanjut dialog".
 *
 *   Elemen seperti itu BUKAN tombol dan tidak melakukan apa pun saat ditekan.
 *   Memberinya `role` dan `tabIndex` justru keliru: pengguna keyboard akan
 *   berhenti di elemen yang tidak bereaksi apa-apa.
 *
 *   Meski demikian, ia tetap perlu menahan rambatan tombol. Bila tidak,
 *   menekan Enter pada tombol di dalamnya akan menggelembung ke induk dan
 *   memicu aksi induk — sehingga satu penekanan memicu DUA aksi.
 */
export function blokirRambatanTombol<E extends HTMLElement>() {
  return (e: KeyboardEvent<E>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
    }
  };
}
