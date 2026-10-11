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

  return (
    <div className="fixed top-4 right-4 z-50 p-4 bg-surface-container-high border border-outline-variant rounded-2xl shadow-xl flex flex-col gap-3 w-72 max-w-[calc(100vw-2rem)]">
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
          {needRefresh ? 'system_update' : 'cloud_done'}
        </span>
        <div className="flex-1">
          <div className="font-label-lg font-bold text-on-surface">
            {needRefresh ? 'Update Tersedia' : 'Siap Offline'}
          </div>
          <div className="font-label-sm text-on-surface-variant mt-1">
            {needRefresh
              ? 'Ada pembaruan baru untuk RESQ-BOX. Muat ulang untuk memperbarui.'
              : 'Aplikasi sudah diunduh dan bisa dibuka tanpa koneksi internet!'}
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-1">
        {needRefresh && (
          <button
            onClick={() => updateServiceWorker(true)}
            className="flex-1 py-1.5 px-4 bg-primary text-on-primary rounded-lg font-label-md font-semibold hover:bg-primary/90 transition-colors"
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
