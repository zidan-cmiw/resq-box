import { useState, useEffect, useRef } from 'react';
import { PageFlip } from 'page-flip';
import { retroAudio } from '../../utils/retroAudio';
import PixelIcon from './PixelIcons';
import PixelEarthExploded from './PixelEarthExploded';
import PixelTypewriter from '../../components/PixelTypewriter';

export interface GeologicalDetail {
  id: string;
  name: string;
  category: string;
  nameEn: string;
  depth: string;
  temp: string;
  thickness: string;
  composition: string;
  summary: string;
  funFact: string;
  iconName: string;
}

export const GEOLOGY_DATA: Record<string, GeologicalDetail> = {
  'kerak-benua': {
    id: 'kerak-benua',
    name: 'Kerak Benua (Daratan)',
    category: '1. Litosfer (Kerak Kaku Terluar)',
    nameEn: 'Continental Crust',
    depth: '0 – 70 km',
    temp: 'Hingga 400°C',
    thickness: '30 – 70 km',
    composition: 'Silikat Aluminium (SiAl) & Batuan Granit',
    summary:
      'Kerak yang membentuk daratan dan benua tempat kita tinggal. Lebih tebal dari kerak samudra dan mengalami pergerakan aktif (lempeng tektonik) akibat dorongan arus konveksi panas dari astenosfer di bawahnya.',
    funFact: 'Batuan tertua di kerak benua berumur lebih dari 3,8 miliar tahun!',
    iconName: 'mountain',
  },
  'kerak-samudra': {
    id: 'kerak-samudra',
    name: 'Kerak Samudra (Lautan)',
    category: '1. Litosfer (Kerak Kaku Terluar)',
    nameEn: 'Oceanic Crust',
    depth: '0 – 10 km',
    temp: 'Hingga 300°C',
    thickness: '5 – 10 km',
    composition: 'Silikat Magnesium (SiMa) & Batuan Basalt Padat',
    summary:
      'Kerak yang menyelimuti dasar cekungan samudra luas. Sangat padat dan berat (~3,0 g/cm³), sehingga mudah menunjam ke bawah kerak benua saat bertumbukan (zona subduksi pemicu gempa).',
    funFact: 'Kerak samudra terus diperbarui melalui proses pemekaran lantai samudra.',
    iconName: 'ocean',
  },
  'mantel-atas': {
    id: 'mantel-atas',
    name: 'Mantel Bumi Atas (Astenosfer)',
    category: '2. Astenosfer (Zona Magma Plastis)',
    nameEn: 'Upper Mantle / Asthenosphere',
    depth: '100 – 700 km',
    temp: '1.000 – 1.400°C',
    thickness: '~600 km',
    composition: 'Batuan Semi-Cair Peridotit Magma',
    summary:
      'Zona mantel bumi yang bersifat plastis dan lentur. Panas ekstrem menyebabkan terjadinya arus konveksi magma raksasa yang menjadi mesin penggerak utama lempeng-lempeng tektonik bumi.',
    funFact: 'Arus konveksi magma di mantel atas bergerak 2 hingga 10 cm per tahun.',
    iconName: 'volcano',
  },
  'mantel-bawah': {
    id: 'mantel-bawah',
    name: 'Mantel Bawah (Mesosfer 2.900 km)',
    category: '2. Astenosfer (Mantel Bumi Dalam)',
    nameEn: 'Lower Mantle / Mesosphere',
    depth: '700 – 2.900 km',
    temp: '1.400 – 3.700°C',
    thickness: '~2.200 km',
    composition: 'Mineral Bridgmanite Padat Berdensitas Tinggi',
    summary:
      'Lapisan mantel terdalam sebelum menyentuh batas inti bumi. Suhunya sangat tinggi, namun materialnya tetap padat karena tekanan yang luar biasa dari lapisan di atasnya.',
    funFact: 'Mantel bumi menyumbang lebih dari 80% volume keseluruhan planet Bumi.',
    iconName: 'mantle',
  },
  'inti-luar': {
    id: 'inti-luar',
    name: 'Inti Luar Cair (5.100 km)',
    category: '3. Barisfer (Inti Logam Bumi)',
    nameEn: 'Liquid Outer Core',
    depth: '2.900 – 5.150 km',
    temp: '4.000 – 5.000°C',
    thickness: '~2.250 km',
    composition: 'Paduan Logam Besi & Nikel Cair',
    summary:
      'Cairan logam panas yang berputar kencang mengikuti rotasi bumi. Putaran dinamo logam cair ini membangkitkan medan magnet pelindung bumi (magnetosfer) dari radiasi badai matahari.',
    funFact: 'Tanpa putaran inti luar cair, atmosfer bumi akan tersapu radiasi kosmik!',
    iconName: 'outer-core',
  },
  'inti-dalam': {
    id: 'inti-dalam',
    name: 'Inti Dalam Padat (Pusat Bumi)',
    category: '3. Barisfer (Inti Logam Bumi)',
    nameEn: 'Solid Inner Core',
    depth: '5.150 – 6.371 km',
    temp: '5.400 – 6.000°C',
    thickness: '~1.221 km',
    composition: 'Kristal Besi & Nikel Padat Murni',
    summary:
      'Pusat terdalam bumi berupa bola logam padat seukuran bulan. Suhunya setara dengan permukaan matahari (~6.000°C), namun tetap padat murni karena tekanan ekstrem sebesar 3,6 juta atmosfer.',
    funFact: 'Inti dalam berputar sedikit lebih cepat dari permukaan bumi kita.',
    iconName: 'inner-core',
  },
};

export default function StrukturBumi() {
  const [currentPage, setCurrentPage] = useState<number>(0);

  // State Halaman Eksplorasi 3D
  const [isExploded, setIsExploded] = useState(false);
  const [selectedLayerId, setSelectedLayerId] = useState<string>('kerak-benua');
  const [chestOpen, setChestOpen] = useState(false);

  // State Pertanyaan Pemantik Interaktif (Berdasarkan Sketsa Alur Diagram Kertas)
  const [pemantikStep, setPemantikStep] = useState<'initial' | 'tebak' | 'tebak_berhasil' | 'ingin_tahu'>('initial');
  const [tebakWrong, setTebakWrong] = useState(false);

  // Ref container untuk PageFlip
  const bookContainerRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);

  const currentDetail = GEOLOGY_DATA[selectedLayerId] || GEOLOGY_DATA['kerak-benua'];

  // Inisialisasi library PageFlip untuk 1 BUKU UTUH (Sampul + Isi + Animasi Buka Lembaran)
  useEffect(() => {
    if (!bookContainerRef.current) return;
    if (pageFlipRef.current) return;

    const timer = setTimeout(() => {
      if (!bookContainerRef.current) return;

      try {
        const pageFlip = new PageFlip(bookContainerRef.current, {
          width: 490,
          height: 590,
          size: 'fixed',
          minWidth: 320,
          maxWidth: 520,
          minHeight: 450,
          maxHeight: 630,
          drawShadow: true,
          flippingTime: 800,
          usePortrait: false, // Tampilan 2 halaman terbuka (landscape spread)
          startZIndex: 5,
          autoSize: false,
          maxShadowOpacity: 0.5,
          showCover: true, // Halaman 0 sebagai Sampul Depan Hardcover 3D
          mobileScrollSupport: false,
          clickEventForward: true,
          disableFlipByClick: true, // Nonaktifkan balik halaman saat klik di sembarang area kertas
          showPageCorners: false, // Nonaktifkan lipatan sudut mouse hover agar tidak menghalangi tombol
          useMouseEvents: false, // Nonaktifkan event mouse global page-flip agar semua tombol dalam halaman berfungsi 100%
        });

        // Monkey patch checkTarget agar klik pada tombol, SVG, dan input form tidak di-preventDefault
        if ((pageFlip as any).ui) {
          (pageFlip as any).ui.checkTarget = (target: any) => {
            const el = target as Element;
            if (
              el?.closest &&
              el.closest(
                'button, a, svg, .cursor-pointer, input, select, textarea, [role="button"], .layer-interactive'
              )
            ) {
              return false;
            }
            return true;
          };
        }

        const pages = bookContainerRef.current.querySelectorAll<HTMLElement>('.pixel-page-item');
        if (pages.length > 0) {
          pageFlip.loadFromHTML(pages);
        }

        pageFlip.on('flip', (e: any) => {
          retroAudio.playHover();
          const pageIdx = typeof e.data === 'number' ? e.data : 0;
          setCurrentPage(pageIdx);
        });

        pageFlipRef.current = pageFlip;

        // Trigger update to ensure geometry is painted
        setTimeout(() => {
          try {
            (pageFlip as any).ui?.update();
          } catch {
            // ignore
          }
        }, 100);
      } catch (err) {
        console.error('Error initializing PageFlip:', err);
      }
    }, 60);

    return () => {
      clearTimeout(timer);
      if (pageFlipRef.current) {
        try {
          (pageFlipRef.current as any).ui?.clear();
          pageFlipRef.current.destroy();
        } catch {
          // ignore
        }
        pageFlipRef.current = null;
      }
    };
  }, []);

  // Handler Navigasi Tombol
  const handleTurnNext = () => {
    retroAudio.playHover();
    pageFlipRef.current?.flipNext();
  };

  const handleTurnPrev = () => {
    retroAudio.playHover();
    pageFlipRef.current?.flipPrev();
  };

  const handleOpenCover = () => {
    retroAudio.playSelect();
    pageFlipRef.current?.flipNext();
  };

  // Handler Layer Bumi
  const handleSelectArea = (layerId: string) => {
    retroAudio.playSelect();
    setSelectedLayerId(layerId);
    setChestOpen(false);
  };

  // Helper persentase gauge suhu & kedalaman
  const getGauges = () => {
    if (!isExploded) {
      return {
        temp: 0,
        depth: 0,
        tempText: '0°C',
        depthText: '0 km',
      };
    }
    switch (selectedLayerId) {
      case 'kerak-samudra':
        return { temp: 8, depth: 4, tempText: 'Hingga 300°C', depthText: '0 – 10 km' };
      case 'kerak-benua':
        return { temp: 12, depth: 7, tempText: 'Hingga 400°C', depthText: '0 – 70 km' };
      case 'mantel-atas':
        return { temp: 28, depth: 22, tempText: '1.000 – 1.400°C', depthText: '100 – 700 km' };
      case 'mantel-bawah':
        return { temp: 62, depth: 52, tempText: '1.400 – 3.700°C', depthText: '700 – 2.900 km' };
      case 'inti-luar':
        return { temp: 84, depth: 82, tempText: '4.000 – 5.000°C', depthText: '2.900 – 5.150 km' };
      case 'inti-dalam':
        return { temp: 100, depth: 100, tempText: '5.400 – 6.000°C', depthText: '5.150 – 6.371 km' };
      default:
        return { temp: 0, depth: 0, tempText: '0°C', depthText: '0 km' };
    }
  };

  const {
    temp: tempGaugePercent,
    depth: depthGaugePercent,
    tempText: currentTempText,
    depthText: currentDepthText,
  } = getGauges();

  return (
    <div className="w-full flex flex-col items-center select-none font-pixel py-1 sm:py-2">
      {/* ── 1. TOP CENTER NAVIGATION TOOLBAR (PREV & NEXT DI TENGAH ATAS) ── */}
      <div className="w-full flex justify-center items-center gap-3 mb-3 z-40">
        <button
          onClick={handleTurnPrev}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-amber-200 hover:bg-amber-300 disabled:opacity-30 disabled:cursor-not-allowed text-amber-950 border-2 border-amber-950 rounded-xl font-pixel-title text-[9.5px] cursor-pointer shadow-[0_3px_0_#78350f] active:translate-y-0.5 transition-all flex items-center gap-1.5"
          title="Halaman Sebelumnya"
        >
          <span>◀ PREV</span>
        </button>

        <button
          onClick={handleTurnNext}
          disabled={currentPage >= 5}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-30 disabled:cursor-not-allowed text-amber-950 border-2 border-amber-950 rounded-xl font-pixel-title text-[9.5px] font-bold cursor-pointer shadow-[0_3px_0_#451a03] active:translate-y-0.5 transition-all flex items-center gap-1.5"
          title="Halaman Selanjutnya"
        >
          <span>NEXT ▶</span>
        </button>
      </div>

      {/* ── 2. UNIFIED 3D BOOK STAGE WITH PAGE-FLIP LIBRARY ANIMATION ── */}
      <div className="w-full flex justify-center overflow-x-hidden">
        <div
          ref={bookContainerRef}
          className="transition-transform duration-700 ease-out"
          style={{
            width: '980px',
            height: '590px',
            minHeight: '590px',
            transform:
              currentPage === 0
                ? 'translateX(-245px)'
                : currentPage >= 5
                  ? 'translateX(245px)'
                  : 'translateX(0px)',
          }}
        >
          {/* ══════════════════════════════════════════════════════════════
              HALAMAN 0: SAMPUL DEPAN BUKU (HARDCOVER 3D)
             ══════════════════════════════════════════════════════════════ */}
          <div className="pixel-page-item pixel-book-cover-page" data-density="hard">
            <div className="h-full flex flex-col justify-between p-6 sm:p-8 select-none text-amber-100 relative">
              {/* Hardcover Spine Texture on Left */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#170801] via-[#3a1502] to-transparent border-r-2 border-[#b45309]/60 pointer-events-none" />

              {/* Top Header & Corner Rivets */}
              <div className="flex justify-between items-center pl-4 relative z-10">
                <div className="w-3.5 h-3.5 bg-amber-400 border border-amber-950 shadow-[1px_1px_0_#451a03]" />
                <div className="w-3.5 h-3.5 bg-amber-400 border border-amber-950 shadow-[1px_1px_0_#451a03]" />
              </div>

              {/* Center Title & Emblem */}
              <div className="flex flex-col items-center text-center my-auto pl-4 space-y-10 relative z-10">
                <div className="w-22 h-22 rounded-full border-4 border-amber-400 bg-sky-950 flex items-center justify-center shadow-[0_6px_0_#1a0a01] hover:scale-105 transition-transform">
                  <PixelIcon name="volcano" size={48} className="text-amber-400" />
                </div>

                <div className="space-y-20">
                  <div className="font-pixel-title text-amber-300 text-xs sm:text-sm tracking-wider drop-shadow-[0_2px_0_#1a0a01]">
                    PETUALANGAN GEOLOGIS
                  </div>
                  <h1 className="font-pixel-title text-amber-100 text-base sm:text-lg leading-snug drop-shadow-[0_3px_0_#1a0a01]">
                    STRUKTUR BUMI
                  </h1>
                  <div className="inline-block px-3.5 py-1 bg-amber-500 text-amber-950 font-pixel-title text-[10px] sm:text-[11px] rounded border-2 border-amber-950 shadow-[0_2px_0_#451a03] font-bold">
                    SIAP TANGGUHKAN
                  </div>
                </div>

              </div>

              {/* Bottom Button Prompt */}
              <div className="flex flex-col items-center pl-4 pt-3 border-t border-amber-500/30 relative z-10">
                <button
                  onClick={handleOpenCover}
                  className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-pixel-title text-xs font-bold border-2 border-amber-950 shadow-[0_4px_0_#451a03] flex items-center gap-2 animate-pulse cursor-pointer active:translate-y-0.5 transition-all"
                >
                  <span>KLIK UNTUK MEMBUKA BUKU</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              HALAMAN 1 (SPREAD 1 - SISI KIRI): JURNAL EKSPEDISI & ROADMAP
             ══════════════════════════════════════════════════════════════ */}
          <div className="pixel-page-item pixel-book-page-left" data-density="soft">
            <div className="pixel-book-scroll h-full flex flex-col justify-between p-4 sm:p-5 text-amber-950 select-none">
              <div>
                <div className="flex items-center gap-1.5 pb-2 border-b border-amber-950/20">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                  <span className="text-[8px] font-pixel-title text-amber-800 uppercase tracking-wider">
                    JURNAL EKSPEDISI • RESQ-BOX
                  </span>
                </div>

                <h2 className="font-pixel-title text-xs sm:text-sm text-amber-950 leading-snug mt-2.5">
                  CATATAN PERJALANAN GEOLOGIS TARUNA
                </h2>
                <p className="text-[10.5px] text-amber-900 mt-1 leading-relaxed font-pixel">
                  Selamat datang di modul geologis RESQ-BOX. Di dalam jurnal ini, kita akan menembus lapisan-lapisan interior bumi untuk memahami fenomena gempa, pergerakan lempeng, dan kesiapsiagaan bencana.
                </p>
              </div>

              {/* Roadmap Bab Ekspedisi */}
              <div className="space-y-2 my-auto py-2">
                <div className="p-2.5 bg-amber-100 rounded-xl border-2 border-amber-950 flex items-center gap-2.5 shadow-[0_2px_0_#78350f]">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-amber-950 font-pixel-title text-[9px] font-bold shrink-0">
                    01
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-pixel-title text-amber-950 block truncate">
                      STRUKTUR LAPISAN BUMI
                    </span>
                    <span className="text-[8px] text-amber-700 font-pixel block">
                      Litosfer, Astenosfer, & Barisfer
                    </span>
                  </div>
                  <span className="text-[7.5px] bg-amber-950 text-amber-300 font-pixel-title px-1.5 py-0.5 rounded">
                    AKTIF
                  </span>
                </div>

                <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-950/30 flex items-center gap-2.5 opacity-80">
                  <div className="w-7 h-7 rounded-lg bg-amber-200 flex items-center justify-center text-amber-800 font-pixel-title text-[9px] font-bold shrink-0">
                    02
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-pixel-title text-amber-800 block truncate">
                      DINAMIKA LEMPENG TEKTONIK
                    </span>
                    <span className="text-[8px] text-amber-600 font-pixel block">
                      Konvergen, Divergen, & Transform
                    </span>
                  </div>
                  <PixelIcon name="lock" size={14} className="text-amber-700" />
                </div>

                <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-950/30 flex items-center gap-2.5 opacity-80">
                  <div className="w-7 h-7 rounded-lg bg-amber-200 flex items-center justify-center text-amber-800 font-pixel-title text-[9px] font-bold shrink-0">
                    03
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-pixel-title text-amber-800 block truncate">
                      QUEST KATA GEOLOGI
                    </span>
                    <span className="text-[8px] text-amber-600 font-pixel block">
                      Evaluasi Pemahaman Istilah IPA
                    </span>
                  </div>
                  <PixelIcon name="lock" size={14} className="text-amber-700" />
                </div>
              </div>

              <div className="text-left text-[7.5px] font-pixel-title text-amber-800/60 pt-1">
                <span>◤ HALAMAN 1</span>
              </div>
            </div>
          </div>


          <div className="pixel-page-item pixel-book-page-right" data-density="soft">
            <div className="pixel-book-scroll h-full flex flex-col justify-between p-4 sm:p-5 text-amber-950 select-none">
              <div className="space-y-3">
                {/* Header Bab */}
                <div className="flex items-center justify-between pb-1.5 border-b border-amber-950/20">
                  <div className="flex items-center gap-1.5">
                    <PixelIcon name="bulb" size={14} className="text-amber-800" />
                    <span className="text-[8px] font-pixel-title text-amber-800 uppercase tracking-wider">
                      PERTANYAAN PEMANTIK
                    </span>
                  </div>
                </div>

                {/* Kotak Pertanyaan Utama dengan Maskot Avatar */}
                <div className="p-3 bg-amber-100/95 rounded-xl border-2 border-amber-950 shadow-[0_2px_0_#78350f] flex items-start gap-3">
                  {/* Maskot Avatar Taruna Geologis */}
                  <div className="w-12 h-12 rounded-full border-2 border-amber-950 bg-amber-300 flex items-center justify-center shadow-[0_2px_0_#78350f] shrink-0 overflow-hidden mt-0.5">
                    <svg width="34" height="34" viewBox="0 0 16 16" shapeRendering="crispEdges">
                      {/* Safety Helmet */}
                      <rect x="4" y="2" width="8" height="4" fill="#ea580c" />
                      <rect x="3" y="5" width="10" height="2" fill="#c2410c" />
                      <rect x="7" y="3" width="2" height="2" fill="#fed7aa" />
                      {/* Face */}
                      <rect x="4" y="7" width="8" height="6" fill="#fde047" />
                      {/* Eyes */}
                      <rect x="5" y="9" width="2" height="2" fill="#1e293b" />
                      <rect x="9" y="9" width="2" height="2" fill="#1e293b" />
                      {/* Smile */}
                      <rect x="7" y="11" width="2" height="1" fill="#b45309" />
                      {/* Cheeks */}
                      <rect x="4" y="10" width="1" height="1" fill="#f87171" />
                      <rect x="11" y="10" width="1" height="1" fill="#f87171" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[7.5px] font-pixel-title text-amber-800 uppercase block mb-1">
                      PERTANYAAN PEMANTIK
                    </span>
                    <h2 className="font-pixel-title text-xs sm:text-[11.5px] text-amber-950 leading-snug">
                      "Tahukah kamu bagaimana struktur lapisan bumi secara geologis dikategorikan?"
                    </h2>
                  </div>
                </div>

                {/* ── ALUR INTERAKTIF (BERDASARKAN SKETSA DIAGRAM KERTAS) ── */}

                {/* 1. STATE INITIAL: Dua Tombol [Tahu!] vs [Saya ingin tahu.] */}
                {pemantikStep === 'initial' && (
                  <div className="space-y-3 pt-2">
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-950/20 text-center">
                      <p className="font-pixel text-[11px] text-amber-900 leading-relaxed mb-3">
                        Pilih salah satu untuk memulai penjelajahan geologismu:
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                        <button
                          onClick={() => {
                            retroAudio.playSelect();
                            setPemantikStep('tebak');
                            setTebakWrong(false);
                          }}
                          className="w-full sm:w-1/2 py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-amber-950 font-pixel-title text-[10px] font-bold rounded-xl border-2 border-amber-950 shadow-[0_2px_0_#451a03] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Tahu!</span>
                          <span>💡</span>
                        </button>

                        <button
                          onClick={() => {
                            retroAudio.playSelect();
                            setPemantikStep('ingin_tahu');
                          }}
                          className="w-full sm:w-1/2 py-2.5 px-3 bg-orange-200 hover:bg-orange-300 text-orange-950 font-pixel-title text-[10px] font-bold rounded-xl border-2 border-amber-950 shadow-[0_2px_0_#78350f] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Saya ingin tahu.</span>
                          <span>🔍</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. STATE INGIN TAHU: [Saya ingin tahu.] -> Ayo kita cari tahu! Sudah siap? -> [Siap!] */}
                {pemantikStep === 'ingin_tahu' && (
                  <div className="space-y-3 pt-1">
                    <div className="p-3.5 bg-orange-50/95 rounded-xl border-2 border-amber-950 shadow-[0_2px_0_#78350f] text-center space-y-2.5">
                      <div className="inline-block px-2.5 py-0.5 bg-orange-400 text-orange-950 font-pixel-title text-[8px] rounded border border-amber-950 uppercase font-bold">
                        EKSPLORASI BERSAMA
                      </div>
                      <h3 className="font-pixel-title text-xs text-amber-950">
                        "Ayo, kita cari tahu!"
                      </h3>
                      <p className="font-pixel text-[11px] text-amber-900 leading-relaxed max-w-[280px] mx-auto">
                        Bumi kita tersusun dari lapisan Litosfer, Astenosfer, hingga Barisfer di intinya. Sudah siap membedahnya?
                      </p>
                      <div className="font-pixel-title text-[11px] text-amber-950 pt-1">
                        Sudah siap?
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        retroAudio.playSelect();
                        handleTurnNext();
                      }}
                      className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-amber-950 font-pixel-title text-[11px] font-bold rounded-xl border-2 border-amber-950 shadow-[0_3px_0_#451a03] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2 animate-pulse"
                    >
                      <span>Siap!</span>
                      <span>➔</span>
                    </button>

                    <div className="text-center">
                      <button
                        onClick={() => setPemantikStep('initial')}
                        className="text-[8px] font-pixel-title text-amber-800/80 hover:text-amber-950 underline cursor-pointer"
                      >
                        ↺ Pilih Opsi Lain
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. STATE TEBAK: [Tahu!] -> arahin ke tebak-tebakan susunan bumi */}
                {pemantikStep === 'tebak' && (
                  <div className="space-y-2.5 pt-1">
                    <div className="p-2.5 bg-amber-100/90 rounded-xl border-2 border-amber-950 shadow-[0_2px_0_#78350f] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[7.5px] font-pixel-title text-amber-800 uppercase">
                          TEBAK SUSUNAN BUMI
                        </span>
                      </div>
                      <p className="font-pixel text-[10.5px] text-amber-950 leading-snug">
                        Lapisan batuan padat terluar tempat benua & samudra berada disebut...
                      </p>
                    </div>

                    {/* Opsi Tebakan */}
                    <div className="space-y-1.5">
                      <button
                        onClick={() => {
                          retroAudio.playSuccess();
                          setTebakWrong(false);
                          setPemantikStep('tebak_berhasil');
                        }}
                        className="w-full p-2 bg-amber-50 hover:bg-amber-200 text-amber-950 rounded-lg border-2 border-amber-950 text-left flex items-center gap-2 font-pixel-title text-[9px] shadow-[0_1.5px_0_#78350f] active:translate-y-0.5 transition-all cursor-pointer"
                      >
                        <span className="w-5 h-5 rounded bg-amber-400 flex items-center justify-center text-amber-950 text-[8px] font-bold border border-amber-950 shrink-0">
                          A
                        </span>
                        <span className="flex-1">Litosfer (Kerak Padat Terluar)</span>
                        <PixelIcon name="star" size={12} className="text-amber-600" />
                      </button>

                      <button
                        onClick={() => {
                          retroAudio.playHover();
                          setTebakWrong(true);
                        }}
                        className="w-full p-2 bg-amber-50 hover:bg-amber-200 text-amber-950 rounded-lg border border-amber-950/40 text-left flex items-center gap-2 font-pixel-title text-[9px] active:translate-y-0.5 transition-all cursor-pointer"
                      >
                        <span className="w-5 h-5 rounded bg-amber-200 flex items-center justify-center text-amber-800 text-[8px] font-bold border border-amber-950/40 shrink-0">
                          B
                        </span>
                        <span className="flex-1">Astenosfer (Mantel Magma)</span>
                      </button>

                      <button
                        onClick={() => {
                          retroAudio.playHover();
                          setTebakWrong(true);
                        }}
                        className="w-full p-2 bg-amber-50 hover:bg-amber-200 text-amber-950 rounded-lg border border-amber-950/40 text-left flex items-center gap-2 font-pixel-title text-[9px] active:translate-y-0.5 transition-all cursor-pointer"
                      >
                        <span className="w-5 h-5 rounded bg-amber-200 flex items-center justify-center text-amber-800 text-[8px] font-bold border border-amber-950/40 shrink-0">
                          C
                        </span>
                        <span className="flex-1">Barisfer (Inti Logam)</span>
                      </button>
                    </div>

                    {tebakWrong && (
                      <div className="p-1.5 bg-rose-100 rounded-lg border border-rose-950/40 text-rose-900 font-pixel text-[9px] text-center">
                        Ups, belum tepat! Petunjuk: Lapisan batuan kaku terluar. Coba lagi!
                      </div>
                    )}

                    <div className="text-center pt-0.5">
                      <button
                        onClick={() => setPemantikStep('initial')}
                        className="text-[8px] font-pixel-title text-amber-800/80 hover:text-amber-950 underline cursor-pointer"
                      >
                        ↺ Kembali ke Pilihan
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. STATE TEBAK BERHASIL: [Berhasil] -> [Kamu hebat!] -> Ayo dalami lagi bersamaku... -> Sudah siap? -> [Siap!] */}
                {pemantikStep === 'tebak_berhasil' && (
                  <div className="space-y-2.5 pt-1">
                    <div className="p-3 bg-emerald-50 rounded-xl border-2 border-emerald-950 shadow-[0_2px_0_#064e3b] text-center space-y-1.5">
                      <div className="inline-block px-2 py-0.5 bg-emerald-400 text-emerald-950 font-pixel-title text-[8px] rounded border border-emerald-950 uppercase font-bold">
                        ✓ Berhasil!
                      </div>
                      <h3 className="font-pixel-title text-xs text-emerald-950">
                        "Kamu hebat!"
                      </h3>
                      <p className="font-pixel text-[10.5px] text-emerald-900 leading-relaxed max-w-[280px] mx-auto">
                        Tebakanmu tepat! Litosfer adalah lapisan batuan padat terluar bumi.
                      </p>
                      <p className="font-pixel text-[10.5px] text-amber-950 leading-relaxed font-bold pt-0.5">
                        Ayo dalami lagi bersamaku, kita bedah interior bumi lebih jauh!
                      </p>
                      <div className="font-pixel-title text-[11px] text-amber-950 pt-1">
                        Sudah siap?
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        retroAudio.playSelect();
                        handleTurnNext();
                      }}
                      className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-amber-950 font-pixel-title text-[11px] font-bold rounded-xl border-2 border-amber-950 shadow-[0_3px_0_#451a03] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2 animate-pulse"
                    >
                      <span>Siap!</span>
                      <span>➔</span>
                    </button>

                    <div className="text-center">
                      <button
                        onClick={() => {
                          setPemantikStep('initial');
                          setTebakWrong(false);
                        }}
                        className="text-[8px] font-pixel-title text-amber-800/80 hover:text-amber-950 underline cursor-pointer"
                      >
                        ↺ Ulangi Tantangan
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Navigasi Halaman */}
              <div className="pt-2 border-t border-amber-950/20 flex justify-between items-center text-[7px] font-pixel-title text-amber-800/60">
                <span>◢ HALAMAN 2</span>
                <span>GUNAKAN TOMBOL DI ATAS</span>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              HALAMAN 3 (SPREAD 2 - SISI KIRI): SIMULATOR IRISAN BUMI 3D
             ══════════════════════════════════════════════════════════════ */}
          <div className="pixel-page-item pixel-book-page-left" data-density="soft">
            <div className="pixel-book-scroll h-full flex flex-col justify-between p-2.5 sm:p-3.5 bg-slate-950 text-amber-100 select-none">
              <div className="flex items-center justify-between px-1 pb-1 border-b border-slate-800">
                <span className="text-[8px] font-pixel-title text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SIMULATOR IRISAN BUMI 3D
                </span>
              </div>

              {/* Main Stage with Retro Pixel Gauges & Exploded Earth */}
              <div className="flex items-center justify-between gap-1 sm:gap-2 my-auto py-1">
                {/* Retro Pixel Gauge Suhu */}
                <div className="flex flex-col items-center justify-between py-1 shrink-0 w-12 sm:w-14">
                  <div className="relative w-4 sm:w-5 h-36 sm:h-44 bg-slate-950 border-2 border-amber-950 shadow-[inset_0_0_0_1px_#1e293b,2px_2px_0_#231206] flex flex-col justify-end p-0.5">
                    <div className="absolute -left-1.5 top-2 w-1.5 h-0.5 bg-rose-500/70 pointer-events-none" />
                    <div className="absolute -left-1.5 top-1/4 w-1.5 h-0.5 bg-amber-500/70 pointer-events-none" />
                    <div className="absolute -left-1.5 top-2/4 w-1.5 h-0.5 bg-amber-500/70 pointer-events-none" />
                    <div className="absolute -left-1.5 top-3/4 w-1.5 h-0.5 bg-sky-500/70 pointer-events-none" />
                    <div className="absolute -left-1.5 bottom-2 w-1.5 h-0.5 bg-sky-500/70 pointer-events-none" />

                    <div
                      className="w-full transition-all duration-300 ease-out bg-gradient-to-t from-blue-500 via-amber-500 to-rose-500 border-t border-rose-300"
                      style={{ height: `${tempGaugePercent}%` }}
                    />
                  </div>
                  <div className="text-center mt-1.5">
                    <span className="text-[7px] font-pixel-title text-rose-400 block uppercase font-bold">SUHU</span>
                    <span className="text-[7.5px] sm:text-[8px] font-pixel font-bold text-rose-200 block leading-tight mt-0.5">
                      {currentTempText}
                    </span>
                  </div>
                </div>

                {/* Center 3D Earth */}
                <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
                  <PixelEarthExploded
                    isExploded={isExploded}
                    activeLayerId={selectedLayerId}
                    onToggleExplode={() => {
                      retroAudio.playHover();
                      setIsExploded(!isExploded);
                    }}
                    onSelectLayer={handleSelectArea}
                  />
                </div>

                {/* Retro Pixel Gauge Kedalaman */}
                <div className="flex flex-col items-center justify-between py-1 shrink-0 w-12 sm:w-14">
                  <div className="relative w-4 sm:w-5 h-36 sm:h-44 bg-slate-950 border-2 border-amber-950 shadow-[inset_0_0_0_1px_#1e293b,2px_2px_0_#231206] flex flex-col justify-end p-0.5">
                    <div className="absolute -right-1.5 top-2 w-1.5 h-0.5 bg-amber-400/70 pointer-events-none" />
                    <div className="absolute -right-1.5 top-1/4 w-1.5 h-0.5 bg-amber-500/70 pointer-events-none" />
                    <div className="absolute -right-1.5 top-2/4 w-1.5 h-0.5 bg-amber-600/70 pointer-events-none" />
                    <div className="absolute -right-1.5 top-3/4 w-1.5 h-0.5 bg-slate-400/70 pointer-events-none" />
                    <div className="absolute -right-1.5 bottom-2 w-1.5 h-0.5 bg-slate-500/70 pointer-events-none" />

                    <div
                      className="w-full transition-all duration-300 ease-out bg-gradient-to-t from-slate-600 via-amber-600 to-amber-400 border-t border-amber-300"
                      style={{ height: `${depthGaugePercent}%` }}
                    />
                  </div>
                  <div className="text-center mt-1.5">
                    <span className="text-[7px] font-pixel-title text-amber-400 block uppercase font-bold">KEDALAMAN</span>
                    <span className="text-[7.5px] sm:text-[8px] font-pixel font-bold text-amber-200 block leading-tight mt-0.5">
                      {currentDepthText}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[7.5px] text-slate-400 py-1 border-t border-slate-800">
                <span>◤ HALAMAN 3</span>
                <span>KLIK PADA LAPISAN BUMI UNTUK MEMILIH MATERI</span>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              HALAMAN 4 (SPREAD 2 - SISI KANAN): DOSSIER GEOLOGI & PETI FAKTA
             ══════════════════════════════════════════════════════════════ */}
          <div className="pixel-page-item pixel-book-page-right" data-density="soft">
            <div className="pixel-book-scroll h-full flex flex-col justify-between p-3.5 sm:p-4 text-amber-950 select-none space-y-2">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-pixel-title text-amber-800 uppercase tracking-wider">
                    {!isExploded ? 'BOLA BUMI UTUH' : currentDetail.category}
                  </span>
                </div>

                <h2 className="font-pixel-title text-xs sm:text-sm text-amber-950 mt-1">
                  {!isExploded ? 'Planet Bumi (Globe)' : currentDetail.name}
                </h2>
                <span className="text-[8px] text-amber-800 font-pixel font-bold block mb-1">
                  {!isExploded ? 'Planet Ketiga dari Matahari' : currentDetail.nameEn}
                </span>

                {/* Summary dengan Typewriter */}
                <div className="text-[11px] sm:text-[11.5px] leading-relaxed text-amber-950 bg-amber-50/95 p-2 rounded-lg border-2 border-amber-950/20 shadow-inner min-h-[58px]">
                  <PixelTypewriter
                    key={isExploded ? selectedLayerId : 'globe'}
                    text={
                      !isExploded
                        ? 'Planet Bumi adalah dunia batuan dinamis dengan struktur lapisan konsentris. Klik pada bola bumi atau tombol bedah di sebelah kiri untuk membedah irisan 3D dan mempelajari lapisan internalnya!'
                        : currentDetail.summary
                    }
                    speed={12}
                  />
                </div>

                {/* Catatan Hierarki */}
                <div className="mt-1 p-1.5 bg-amber-200/70 rounded-lg border border-amber-950/20 text-[9px] text-amber-950 leading-snug">
                  <strong className="text-amber-900 font-bold">Catatan Geologi: </strong>
                  {!isExploded
                    ? 'Bumi memiliki jari-jari rata-rata sekitar 6.371 km yang tersusun atas 3 kesatuan geologis: Litosfer, Astenosfer, dan Barisfer.'
                    : selectedLayerId.includes('kerak')
                      ? 'Area Benua dan Area Samudra keduanya merupakan bagian dari LAPISAN LITOSFER (kerak kaku terluar).'
                      : selectedLayerId.includes('mantel')
                        ? 'Mantel Atas dan Mantel Bawah/Mesosfer keduanya merupakan bagian dari LAPISAN ASTENOSFER (mantel bumi).'
                        : 'Inti Luar Cair dan Inti Dalam Padat keduanya merupakan bagian dari LAPISAN BARISFER (inti terdalam bumi).'}
                </div>
              </div>

              {/* 3 Metrics Cards */}
              <div className="grid grid-cols-3 gap-1.5">
                <div className="p-1.5 bg-amber-200/80 rounded-lg border-2 border-amber-950/40 text-center shadow-[0_2px_0_#78350f]">
                  <span className="text-[7px] font-pixel-title text-amber-800 block uppercase">KEDALAMAN</span>
                  <span className="text-[8px] font-bold text-amber-950 block mt-0.5 font-pixel-title">
                    {!isExploded ? '0 km' : currentDetail.depth}
                  </span>
                </div>
                <div className="p-1.5 bg-rose-200/80 rounded-lg border-2 border-rose-950/40 text-center shadow-[0_2px_0_#881337]">
                  <span className="text-[7px] font-pixel-title text-rose-800 block uppercase">SUHU</span>
                  <span className="text-[8px] font-bold text-rose-900 block mt-0.5 font-pixel-title">
                    {!isExploded ? '0°C' : currentDetail.temp}
                  </span>
                </div>
                <div className="p-1.5 bg-cyan-200/80 rounded-lg border-2 border-cyan-950/40 text-center shadow-[0_2px_0_#164e63]">
                  <span className="text-[7px] font-pixel-title text-cyan-800 block uppercase">
                    {!isExploded ? 'DIAMETER' : 'TEBAL'}
                  </span>
                  <span className="text-[8px] font-bold text-cyan-950 block mt-0.5 font-pixel-title">
                    {!isExploded ? '12.742 km' : currentDetail.thickness}
                  </span>
                </div>
              </div>

              {/* Material Pill */}
              <div className="px-2 py-1 bg-amber-200/70 rounded-lg border-2 border-amber-950/30 flex items-center gap-1.5">
                <span className="text-[7.5px] font-pixel-title text-amber-800 uppercase shrink-0">MATERIAL:</span>
                <span className="text-[9px] font-bold text-amber-950 truncate">
                  {!isExploded ? 'Kerak Silikat, Mantel Batuan, & Inti Logam' : currentDetail.composition}
                </span>
              </div>

              {/* Fun Fact Chest */}
              <div className="p-2 bg-amber-950 text-amber-100 rounded-lg border-2 border-amber-500 shadow-[0_3px_0_#231206]">
                <div className="flex items-start gap-2">
                  <button
                    onClick={() => {
                      retroAudio.playUnlock();
                      setChestOpen(!chestOpen);
                    }}
                    className="cursor-pointer shrink-0 mt-0.5"
                    title="Klik untuk membuka peti fakta"
                  >
                    <PixelIcon name={chestOpen ? 'chest-open' : 'chest-closed'} size={18} />
                  </button>
                  <div className="flex-1">
                    <span className="text-[7.5px] font-pixel-title text-amber-400 block">
                      FAKTA GEOLOGI {chestOpen ? 'TERBUKA' : '(KLIK PETI)'}
                    </span>
                    <div className="text-[9px] text-amber-200 mt-0.5 leading-snug font-pixel min-h-[24px]">
                      {chestOpen ? (
                        <PixelTypewriter
                          key={`fact-${selectedLayerId}-${isExploded}`}
                          text={
                            !isExploded
                              ? 'Bumi adalah satu-satunya planet di tata surya dengan air cair melimpah dan lempeng tektonik aktif yang mendukung seluruh ekosistem kehidupan!'
                              : currentDetail.funFact
                          }
                          speed={12}
                        />
                      ) : (
                        'Buka peti harta karun untuk membaca rahasia geologi!'
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Page 4 Corner & Prev page button */}
              <div className="flex justify-between items-center pt-1 border-t border-amber-950/20">
                <button
                  onClick={handleTurnPrev}
                  className="px-2 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-pixel-title text-[8px] rounded border border-amber-950/40 cursor-pointer flex items-center gap-1 active:translate-y-0.5"
                >
                  <span>◀ KEMBALI KE PEMANTIK</span>
                </button>

                <span className="text-[7.5px] font-pixel-title text-amber-800/60">
                  ◢ HALAMAN 4
                </span>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              HALAMAN 5: SAMPUL BELAKANG (HARDCOVER 3D)
             ══════════════════════════════════════════════════════════════ */}
          <div className="pixel-page-item pixel-book-cover-page" data-density="hard">
            <div className="h-full flex flex-col justify-between p-6 select-none text-amber-100 relative">
              <div className="flex justify-between items-center">
                <div className="w-3 h-3 bg-amber-400 border border-amber-950" />
                <span className="text-[8px] font-pixel-title text-amber-400">RESQ-BOX TARUNA</span>
                <div className="w-3 h-3 bg-amber-400 border border-amber-950" />
              </div>

              <div className="flex flex-col items-center text-center my-auto space-y-3">
                <div className="w-14 h-14 rounded-full border-3 border-amber-400 bg-amber-950/90 flex items-center justify-center">
                  <PixelIcon name="compass" size={28} className="text-amber-400" />
                </div>
                <div className="font-pixel-title text-xs text-amber-300">
                  MODUL GEOLOGI SELESAI
                </div>
                <p className="text-[10px] text-amber-200/80 max-w-[220px]">
                  Kamu telah mempelajari Struktur Lapisan Bumi. Lanjutkan ekspedisi ke Dinamika Lempeng Tektonik!
                </p>
              </div>

              <div className="text-center text-[7.5px] text-amber-400/60 border-t border-amber-500/30 pt-2 font-pixel">
                RESQ-BOX • DIVISI IPDP LIDM 2026
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
