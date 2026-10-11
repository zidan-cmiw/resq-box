import { useCallback, useEffect, useRef, type RefObject } from 'react';

/**
 * Menjaga ukuran kanvas tetap sama dengan ukuran wadahnya.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA KAIT INI ADA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Dilaporkan dari HP: setelah membuka panel samping peramban lalu
 *   menutupnya kembali, sebagian layar permainan menjadi HITAM.
 *
 *   Versi sebelumnya mengambil ukuran dari `window.innerWidth` dan
 *   `window.innerHeight`, lalu hanya mendengarkan peristiwa `resize`.
 *   Dua kelemahan pada pendekatan itu:
 *
 *   1. Di Safari iOS, peristiwa `resize` TIDAK SELALU TERKIRIM ketika panel
 *      samping dibuka atau ditutup, ketika bilah alamat berubah, maupun saat
 *      papan ketik muncul. Akibatnya kanvas tetap sebesar ukuran lama
 *      sementara wadahnya sudah berubah — dan bagian yang tidak tergambar
 *      terlihat hitam.
 *
 *   2. `window.innerWidth`/`innerHeight` mengukur JENDELA, bukan ruang yang
 *      benar-benar tersedia untuk kanvas. Keduanya dapat berbeda.
 *
 *   Kait ini memperbaiki keduanya:
 *
 *   - Ukurannya diambil dari ELEMEN INDUK kanvas, sehingga selalu sebesar
 *     ruang yang benar-benar tersedia.
 *   - Perubahan dipantau lewat EMPAT cara sekaligus, karena masing-masing
 *     dapat gagal sendiri-sendiri:
 *       a. `ResizeObserver` pada induk — paling dapat diandalkan, mengamati
 *          elemennya langsung, tidak bergantung peristiwa jendela
 *       b. `resize` jendela
 *       c. `orientationchange` — putar layar
 *       d. `visualViewport` resize & scroll — bilah peramban, panel samping,
 *          dan papan ketik
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * MENGAPA PERUBAHANNYA DITUNDA SATU BINGKAI
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   Membuka panel samping peramban mengirim BEBERAPA peristiwa berturut-turut
 *   sambil panelnya beranimasi. Mengubah ukuran kanvas pada setiap peristiwa
 *   membuat kanvas berkedip dan menggambar berkali-kali untuk perubahan yang
 *   sama. Menundanya satu bingkai membuat hanya perubahan TERAKHIR yang
 *   dipakai.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * CARA PAKAI
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   const canvasRef = useRef<HTMLCanvasElement>(null);
 *   useUkuranKanvas(canvasRef);
 *
 *   Kanvas harus berada di dalam wadah yang sudah punya ukuran pasti
 *   (mis. kontainer `fixed inset-0`). Kait ini TIDAK mengubah tata letak;
 *   ia hanya menyesuaikan ukuran Gambar kanvas.
 *
 * @param canvasRef Rujukan ke elemen kanvas.
 * @returns Fungsi untuk memaksa penyesuaian ukuran saat itu juga.
 */
export function useUkuranKanvas(
  canvasRef: RefObject<HTMLCanvasElement | null>
): () => void {
  // Bingkai penyesuaian yang ditunda.
  const bingkaiRef = useRef<number>(0);

  const terapkan = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Ukuran wadah — sumber kebenaran, bukan ukuran jendela.
    const induk = canvas.parentElement;
    const cssW = Math.round((induk?.clientWidth || 0) || window.innerWidth);
    const cssH = Math.round((induk?.clientHeight || 0) || window.innerHeight);

    // Jangan menyentuh kanvas bila wadahnya belum punya ukuran. Ini terjadi
    // pada bingkai pertama sebelum tata letak selesai; menetapkan ukuran 0
    // akan menghapus isi kanvas.
    if (cssW < 1 || cssH < 1) return;

    // Dibatasi 2.5 supaya layar berkerapatan sangat tinggi tidak meminta
    // kanvas raksasa yang memperlambat penggambaran tanpa manfaat terlihat.
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const pixelW = Math.round(cssW * dpr);
    const pixelH = Math.round(cssH * dpr);

    if (canvas.width !== pixelW || canvas.height !== pixelH) {
      canvas.width = pixelW;
      canvas.height = pixelH;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
    }
  }, [canvasRef]);

  const jadwalkan = useCallback(() => {
    if (bingkaiRef.current) cancelAnimationFrame(bingkaiRef.current);
    bingkaiRef.current = requestAnimationFrame(() => {
      bingkaiRef.current = 0;
      terapkan();
    });
  }, [terapkan]);

  useEffect(() => {
    terapkan();

    window.addEventListener('resize', jadwalkan);
    window.addEventListener('orientationchange', jadwalkan);

    const vv = window.visualViewport;
    vv?.addEventListener('resize', jadwalkan);
    vv?.addEventListener('scroll', jadwalkan);

    // Pemantau ukuran wadah. Inilah yang paling dapat diandalkan, karena ia
    // mengamati elemennya langsung — bukan mengandalkan peristiwa jendela
    // yang bisa saja tidak terkirim.
    let pengamat: ResizeObserver | undefined;
    const induk = canvasRef.current?.parentElement;
    if (induk && typeof ResizeObserver !== 'undefined') {
      pengamat = new ResizeObserver(jadwalkan);
      pengamat.observe(induk);
    }

    return () => {
      window.removeEventListener('resize', jadwalkan);
      window.removeEventListener('orientationchange', jadwalkan);
      vv?.removeEventListener('resize', jadwalkan);
      vv?.removeEventListener('scroll', jadwalkan);
      pengamat?.disconnect();
      if (bingkaiRef.current) cancelAnimationFrame(bingkaiRef.current);
    };
  }, [canvasRef, terapkan, jadwalkan]);

  return jadwalkan;
}

export default useUkuranKanvas;
