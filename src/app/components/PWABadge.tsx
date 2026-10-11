import { useRegisterSW } from 'virtual:pwa-register/react';

export default function PWABadge() {
  // Check for updates every hour
  const period = 60 * 60 * 1000;

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, r) {
      if (period <= 0) return;
      if (r?.active?.state === 'activated') {
        setInterval(() => r!.update(), period);
      } else if (r?.installing) {
        r.installing.addEventListener('statechange', (e: Event) => {
          const sw = e.target as ServiceWorker;
          if (sw.state === 'activated') {
            setInterval(() => r!.update(), period);
          }
        });
      }
    },
  });

  function close() {
    setOfflineReady(false);
    setNeedRefresh(false);
  }

  if (!offlineReady && !needRefresh) return null;

  /*
    UKURAN DI HP

    ═══════════════════════════════════════════════════════════════════════
    MASALAH YANG DIPERBAIKI
    ═══════════════════════════════════════════════════════════════════════

      Kartu ini memakai `w-72` (288px) dengan `p-4` dan teks berukuran tetap.
      Diukur pada HP selebar 390px:

          lebar kartu  : 288px  = 74% lebar layar
          tinggi kartu : 186px  = 22% tinggi layar

      Karena diletakkan di `top-4 right-4`, kartu ini MENUTUPI bagian kanan
      atas layar — termasuk judul besar "RESQ-BOX" dan tombol menu di
      Dashboard. Pada tangkapan layar HP, judulnya benar-benar tidak terlihat.

      Di laptop ukuran itu wajar; di HP ia mengambil hampir seluruh lebar
      layar untuk sekadar memberi tahu bahwa aplikasi siap dipakai luring.

    CARA MEMPERBAIKI

      1. Kartu dibuat lebih kecil di layar sempit: jarak, teks, dan tombol
         diperkecil pada breakpoint `sm` ke bawah.
      2. Lebarnya dibatasi 88% layar, sehingga selalu tersisa ruang di sisi
         kiri dan tidak pernah menutupi seluruh lebar.
      3. Letaknya dipindah ke BAWAH layar pada HP. Bagian atas layar adalah
         tempat judul dan navigasi — bagian yang paling sering dipakai —
         sedangkan bagian bawah lebih longgar.
  */
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:bottom-auto sm:left-auto sm:top-4 sm:right-4 z-50 p-3 sm:p-4 bg-surface-container-high border border-outline-variant rounded-xl sm:rounded-2xl shadow-xl flex flex-col gap-2 sm:gap-3 w-auto sm:w-72 max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-2rem)]">
      <div className="flex items-start gap-2.5 sm:gap-3">
        <span className="material-symbols-outlined text-primary text-[20px] sm:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          {needRefresh ? 'system_update' : 'cloud_done'}
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-label-lg font-bold text-on-surface text-[15px] sm:text-base">
            {needRefresh ? 'Update Tersedia' : 'Siap Offline'}
          </div>
          <div className="font-label-sm text-on-surface-variant mt-0.5 sm:mt-1 text-[13px] sm:text-sm leading-snug">
            {needRefresh
              ? 'Ada pembaruan baru untuk RESQ-BOX. Muat ulang untuk memperbarui.'
              : 'Aplikasi sudah diunduh dan bisa dibuka tanpa koneksi internet!'}
          </div>
        </div>
      </div>
      <div className="flex gap-2 sm:gap-3 mt-0.5 sm:mt-1">
        {needRefresh && (
          <button
            onClick={() => updateServiceWorker(true)}
            className="flex-1 py-2 sm:py-1.5 px-3 sm:px-4 bg-primary text-on-primary rounded-lg font-label-md font-semibold hover:bg-primary/90 transition-colors text-[13px] sm:text-sm"
          >
            Muat Ulang
          </button>
        )}
        <button
          onClick={close}
          className="flex-1 py-1.5 px-4 bg-surface-container-highest text-on-surface rounded-lg font-label-md font-semibold hover:bg-surface-container-highest/80 transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
