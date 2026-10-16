// ── AppLayout.tsx ────────────────────────────────────────────────
// Full 2D Game Shell — Zero top navbar/header bar across all pages.
// Each page renders full-screen retro pixel scenes directly.

import { Outlet } from 'react-router-dom';
import PWABadge from './components/PWABadge';

export default function AppLayout() {
  // ── MODE TERANG / GELAP ────────────────────────────────────────────────
  //
  // MENGAPA TIDAK ADA APA-APA DI SINI
  //
  //   Sebelumnya berkas ini memaksa mode gelap untuk SELURUH halaman:
  //
  //       useEffect(() => { document.documentElement.classList.add('dark'); }, []);
  //
  //   Akibatnya kelas `dark` terpasang tetap dan pilihan pengguna tidak
  //   mungkin berlaku — mode terang tidak akan pernah bisa dipakai, berapa
  //   kali pun saklarnya ditekan.
  //
  //   Sekarang tema ditentukan `src/utils/tema.ts`, dan kelasnya dipasang oleh
  //   skrip kecil di index.html SEBELUM halaman digambar (supaya tidak ada
  //   kedipan tema yang salah). Berkas ini sengaja tidak menyentuhnya lagi:
  //   satu tempat yang mengatur tema lebih mudah dipercaya daripada dua yang
  //   saling menimpa.
  //
  //   Saklar temanya ada di bilah atas beranda, halaman Profil, halaman Login,
  //   dan Posko Guru — lihat `src/components/TombolTema.tsx`.

  return (
    <>
      <Outlet />
      {/*
        Badge PWA: menampilkan tawaran "muat ulang untuk versi baru" dan
        status siap-luring. Service worker didaftarkan dengan mode `prompt`
        (vite.config.ts), jadi TANPA komponen ini notifikasi pembaruan tidak
        akan pernah sampai ke pengguna.
      */}
      <PWABadge />
    </>
  );
}
