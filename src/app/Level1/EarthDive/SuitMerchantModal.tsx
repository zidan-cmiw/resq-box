import React from 'react';
import type { MapObject } from './engine/zones';
import { retroAudio } from '../../../utils/retroAudio';

export interface SuitMerchantModalProps {
  isOpen: boolean;
  merchantNpc: MapObject | null;
  suitType: string;
  playerCrystals: number;
  hasPurchased: boolean;
  isEquipped: boolean;
  onBuyAndEquip: (suitType: string) => void;
  onClose: () => void;
}

interface SuitDetails {
  name: string;
  codeName: string;
  tierLabel: string;
  zoneTarget: string;
  technicianName: string;
  technicianRole: string;
  dialogue: string;
  features: { label: string; desc: string }[];
  accentColor: string;
  /**
   * Warna latar & batas label tier pakaian.
   * Dirancang untuk latar KREM (modal sudah diseragamkan dengan popup materi).
   */
  badgeBg: string;
  /**
   * Warna TEKS pada label tier.
   *
   * MENGAPA TERPISAH DARI badgeBg
   *   Sebelum modal diseragamkan, label ini memakai warna cerah (mis.
   *   text-orange-400) yang cocok untuk latar gelap. Di atas latar krem,
   *   warna cerah itu nyaris tidak terbaca. Karena itu teksnya memakai versi
   *   lebih gelap dari warna yang sama (mis. text-orange-700), sehingga
   *   identitas warna tiap pakaian tetap ada tetapi tetap terbaca.
   */
  badgeTeks: string;
  borderGlow: string;
  suitPreviewSvg: React.ReactNode;
}

const SUIT_CATALOG: Record<string, SuitDetails> = {
  mantle_suit: {
    name: 'Baju Pelindung Termal MK-1',
    codeName: 'THERMAL-HAZARD-MK1',
    tierLabel: 'Setelan Pelindung Biasa',
    zoneTarget: 'Mantel Bumi (Kedalaman 660–2.900 km)',
    technicianName: 'Teknisi Joko',
    technicianRole: 'Pakar Termal Litosfer & Mantel',
    dialogue:
      'Halo penjelajah muda! Bu Tyas sudah memberitahuku. Di bawah sana, Mantel Bumi bersuhu 1.000°C–3.700°C dengan aliran konveksi magma kental! Pakaian biasa akan langsung terbakar. Gunakan 1 Kristal Energimu untuk membeli dan memakai Baju Pelindung Termal MK-1 ini.',
    features: [
      { label: 'Ketahanan Termal', desc: 'Suhu ekstrem s.d 3.700°C tahan leleh silikat' },
      { label: 'Kisi Ventilasi Dada', desc: 'Pendingin sirkulasi fluida aktif pelepasan kalor' },
      { label: 'Helm Silikat Oranye', desc: 'Visor amber anti-radiasi inframerah magma kental' },
    ],
    accentColor: '#f97316',
    badgeBg: 'bg-orange-500/20 border-orange-500/40',
    badgeTeks: 'text-orange-700',
    borderGlow: 'shadow-[0_0_30px_rgba(249,115,22,0.35)] border-orange-500/50',
    suitPreviewSvg: (
      <svg viewBox="0 0 48 48" className="w-20 h-20 filter drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]">
        {/* Helm */}
        <rect x="14" y="6" width="20" height="14" rx="3" fill="#ea580c" stroke="#fed7aa" strokeWidth="1.5" />
        <rect x="18" y="10" width="12" height="6" rx="2" fill="#fbbf24" opacity="0.9" />
        <line x1="20" y1="12" x2="28" y2="12" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
        {/* Bodi Baju */}
        <rect x="12" y="20" width="24" height="16" rx="3" fill="#334155" stroke="#f97316" strokeWidth="1.5" />
        <rect x="16" y="22" width="16" height="12" rx="2" fill="#e2e8f0" />
        {/* Kisi Termal */}
        <rect x="21" y="25" width="6" height="6" rx="1" fill="#f97316" />
        <line x1="22" y1="28" x2="26" y2="28" stroke="#ffffff" strokeWidth="1" />
        {/* Kaki / Boots */}
        <rect x="14" y="36" width="8" height="8" rx="2" fill="#1e293b" stroke="#f97316" strokeWidth="1" />
        <rect x="26" y="36" width="8" height="8" rx="2" fill="#1e293b" stroke="#f97316" strokeWidth="1" />
      </svg>
    ),
  },
  outer_core_suit: {
    name: 'Baju Pelindung Elektromagnetik MK-2',
    codeName: 'ELECTROMAGNETIC-MK2',
    tierLabel: 'Setelan Canggih Fluks Dinamo',
    zoneTarget: 'Inti Luar (Kedalaman 2.900–5.150 km)',
    technicianName: 'Teknisi Rudi',
    technicianRole: 'Pakar Dinamo Magnetik Bumi',
    dialogue:
      'Hebat kamu berhasil menuntaskan mantel bumi! Namun Inti Luar adalah samudra besi-nikel cair 5.000°C dengan radiasi pusaran dinamo medan magnet berkekuatan raksasa. Baju pelindung lamamu tidak akan sanggup menahannya. Beli setelan elektromagnetik canggih ini sebelum melangkah ke portal!',
    features: [
      { label: 'Isolator Dinamo Logam Cair', desc: 'Pelindung arus medan konveksi besi-nikel 5.000°C' },
      { label: 'Visor HUD Cyan Elektrik', desc: 'Sensor visual garis fluks magnetik geomagnetik bumi' },
      { label: 'Reaktor Daya Dada', desc: 'Penetral lompatan listrik induksi elektromagnetik' },
    ],
    accentColor: '#00e5ff',
    badgeBg: 'bg-cyan-500/20 border-cyan-500/40',
    badgeTeks: 'text-cyan-700',
    borderGlow: 'shadow-[0_0_30px_rgba(0,229,255,0.35)] border-cyan-500/50',
    suitPreviewSvg: (
      <svg viewBox="0 0 48 48" className="w-20 h-20 filter drop-shadow-[0_0_12px_rgba(0,229,255,0.7)]">
        {/* Helm Titanium */}
        <rect x="13" y="5" width="22" height="15" rx="3" fill="#1e293b" stroke="#00e5ff" strokeWidth="1.5" />
        {/* Sirip Fluks */}
        <rect x="9" y="8" width="4" height="8" rx="1" fill="#0284c7" />
        <rect x="35" y="8" width="4" height="8" rx="1" fill="#0284c7" />
        {/* Visor Neon */}
        <rect x="17" y="9" width="14" height="6" rx="2" fill="#00e5ff" />
        <line x1="19" y1="12" x2="29" y2="12" stroke="#ffffff" strokeWidth="1.5" />
        {/* Bodi Baju */}
        <rect x="11" y="20" width="26" height="16" rx="3" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />
        {/* Core Reactor */}
        <circle cx="24" cy="27" r="4.5" fill="#00e5ff" stroke="#ffffff" strokeWidth="1" />
        <circle cx="24" cy="27" r="2" fill="#ffffff" />
        {/* Boots */}
        <rect x="13" y="36" width="9" height="8" rx="2" fill="#0f172a" stroke="#00e5ff" strokeWidth="1" />
        <rect x="26" y="36" width="9" height="8" rx="2" fill="#0f172a" stroke="#00e5ff" strokeWidth="1" />
      </svg>
    ),
  },
  inner_core_suit: {
    name: 'Exo-Suit Hiper-Tekanan Adamantine MK-3',
    codeName: 'ADAMANTINE-CORE-MK3',
    tierLabel: 'Setelan Paling Canggih Multi-Lapisan',
    zoneTarget: 'Inti Dalam (Kedalaman 5.150–6.371 km)',
    technicianName: 'Teknisi Dian',
    technicianRole: 'Spesialis Hiper-Tekanan Pusat Bumi',
    dialogue:
      'Selangkah lagi menuju titik terdalam bumi! Inti Dalam menyimpan suhu 6.000°C sepanas matahari dengan tekanan kompresi maha dahsyat 3,6 juta atmosfer. Hanya Exo-Suit Hiper-Tekanan Adamantine ini yang sanggup menahan beban gravitasi pusat planet kita!',
    features: [
      { label: 'Eksoskeleton Adamantine Emas', desc: 'Menahan kompresi litostatik 3,6 juta atmosfer bumi' },
      { label: 'Visor Prisma Surya Emas', desc: 'Anti-silau prisma kristal besi padat 6.000°C' },
      { label: 'Singularitas Anti-Gravitasi', desc: 'Penyeimbang gaya resultan gravitasi nol di titik pusat' },
    ],
    accentColor: '#facc15',
    badgeBg: 'bg-yellow-500/20 border-yellow-500/40',
    badgeTeks: 'text-yellow-700',
    borderGlow: 'shadow-[0_0_35px_rgba(250,204,21,0.4)] border-yellow-500/60',
    suitPreviewSvg: (
      <svg viewBox="0 0 48 48" className="w-20 h-20 filter drop-shadow-[0_0_14px_rgba(250,204,21,0.8)]">
        {/* Mahkota Emas */}
        <polygon points="17,5 24,1 31,5" fill="#facc15" />
        {/* Helm Kristal */}
        <rect x="13" y="6" width="22" height="14" rx="3" fill="#854d0e" stroke="#facc15" strokeWidth="2" />
        <rect x="16" y="9" width="16" height="7" rx="2" fill="#fef08a" />
        <line x1="18" y1="12" x2="30" y2="12" stroke="#ffffff" strokeWidth="1.5" />
        {/* Bodi Adamantine */}
        <rect x="10" y="20" width="28" height="16" rx="4" fill="#451a03" stroke="#facc15" strokeWidth="2" />
        {/* Shoulder Plates */}
        <polygon points="8,22 12,20 12,28 8,26" fill="#facc15" />
        <polygon points="40,22 36,20 36,28 40,26" fill="#facc15" />
        {/* Inti Singularity Dada */}
        <polygon points="24,23 28,27 24,31 20,27" fill="#ffffff" stroke="#facc15" strokeWidth="1.5" />
        {/* Boots */}
        <rect x="13" y="36" width="9" height="8" rx="2" fill="#713f12" stroke="#facc15" strokeWidth="1.5" />
        <rect x="26" y="36" width="9" height="8" rx="2" fill="#713f12" stroke="#facc15" strokeWidth="1.5" />
      </svg>
    ),
  },
  diver_suit: {
    name: 'Baju Penyelam Samudra Kedalaman',
    codeName: 'DEEP-SEA-DIVER-SCUBA',
    tierLabel: 'Setelan Penyelam Kedalaman Samudra',
    zoneTarget: 'Batas Divergen (Palung Samudra Kedalaman 5.000m)',
    technicianName: 'Teknisi Arya',
    technicianRole: 'Pakar Oseanografi Palung Tektonik',
    dialogue:
      'Perjalanan interior bumu telah tuntas! Kini ekspedisi beralih ke dasar samudra di Batas Divergen (Punggung Tengah Samudra). Kamu akan menyelam di air laut bertekanan hidrostatik tinggi. Kenakan Baju Selam ini untuk bernapas dan bermanuver di dalam air laut!',
    features: [
      { label: 'Tangki O2 Sirkulasi Ganda', desc: 'Pasokan oksigen respirasi penyelaman laut dalam' },
      { label: 'Kubah Helm Kaca Penyelam', desc: 'Jarak pandang luas di kedalaman laut gelap gulita' },
      { label: 'Propulsor Fin Hidrodinamik', desc: 'Kemudahan berenang melintasi rekahan magma bawah laut' },
    ],
    accentColor: '#38bdf8',
    badgeBg: 'bg-sky-500/20 border-sky-500/40',
    badgeTeks: 'text-sky-700',
    borderGlow: 'shadow-[0_0_30px_rgba(56,189,248,0.35)] border-sky-500/50',
    suitPreviewSvg: (
      <svg viewBox="0 0 48 48" className="w-20 h-20 filter drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]">
        {/* Tangki Oksigen di belakang */}
        <rect x="8" y="16" width="6" height="18" rx="3" fill="#e2e8f0" stroke="#0284c7" strokeWidth="1" />
        <rect x="34" y="16" width="6" height="18" rx="3" fill="#e2e8f0" stroke="#0284c7" strokeWidth="1" />
        {/* Helm Bulat Penyelam */}
        <circle cx="24" cy="14" r="9" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
        <circle cx="24" cy="14" r="6" fill="#7dd3fc" opacity="0.85" />
        <circle cx="22" cy="12" r="2" fill="#ffffff" />
        {/* Bodi Scuba */}
        <rect x="13" y="23" width="22" height="14" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
        <rect x="18" y="25" width="12" height="10" rx="2" fill="#0284c7" />
        {/* Sabuk Fin */}
        <rect x="14" y="37" width="8" height="7" rx="2" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
        <rect x="26" y="37" width="8" height="7" rx="2" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
      </svg>
    ),
  },
};

export const SuitMerchantModal: React.FC<SuitMerchantModalProps> = ({
  isOpen,
  merchantNpc: _merchantNpc,
  suitType,
  playerCrystals,
  hasPurchased,
  isEquipped,
  onBuyAndEquip,
  onClose,
}) => {
  if (!isOpen) return null;

  const suit = SUIT_CATALOG[suitType] || SUIT_CATALOG['mantle_suit'];
  const canAfford = playerCrystals >= 1;

  const handleAction = () => {
    if (isEquipped) {
      retroAudio.playSelect();
      onClose();
      return;
    }
    if (hasPurchased || canAfford) {
      onBuyAndEquip(suitType);
      onClose();
    } else {
      retroAudio.playError();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans select-none">
      <div
        className={`relative w-full max-w-2xl bg-[#fef3c7] border-4 border-[#78350f] rounded-2xl p-5 sm:p-6 md:p-7 text-[#291305] ${suit.borderGlow} transition-all duration-300 overflow-hidden shadow-[0_6px_0_#451a03,0_16px_36px_rgba(0,0,0,0.65)]`}
      >
        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(120,53,15,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(120,53,15,0.12) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Header Modal */}
        <div className="relative flex items-start justify-between pb-3 border-b-2 border-[#b45309]/30 gap-3">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#fffbeb] border-2 border-[#b45309]/50 shadow-inner shrink-0">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={suit.accentColor} strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={`text-[12.5px] sm:text-[13.5px] font-black uppercase tracking-wider px-3 py-1 rounded-full border-2 ${suit.badgeBg} ${suit.badgeTeks}`}>
                  {suit.tierLabel}
                </span>
                <span className="text-[12.5px] sm:text-[13.5px] text-[#78350f] font-mono tracking-tight font-semibold">{suit.codeName}</span>
              </div>
              <h2 className="font-pixel text-[17px] sm:text-[21px] font-black tracking-tight text-[#2e0e02] mt-1 leading-tight break-words">
                {suit.name}
              </h2>
            </div>
          </div>

          <button aria-label="Tutup"
            onClick={() => {
              retroAudio.playSelect();
              onClose();
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-amber-100 border-2 border-[#451a03] flex items-center justify-center transition-colors text-[15px] font-bold cursor-pointer"
            title="Tutup [ESC]"
          >
            ✕
          </button>
        </div>

        {/* Showcase Baju & Fitur Ilmiah */}
        <div className="relative grid grid-cols-1 sm:grid-cols-12 gap-5 my-5">
          {/* Visual Avatar / Suit Sprite Box
              SENGAJA tetap gelap: pratinjau pakaian memakai warna terang
              (ivory, putih, neon) sehingga di atas latar krem gambarnya tidak
              terlihat. Warna gelapnya dibuat hangat (coklat tua) agar tetap
              selaras dengan palet aplikasi, bukan biru keabu-abuan. */}
          <div className="sm:col-span-4 rounded-2xl bg-[#2b1204] border-2 border-[#78350f] p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group">
            <div
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${suit.accentColor} 0%, transparent 70%)`,
              }}
            />
            <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
              {suit.suitPreviewSvg}
            </div>
            <div className="relative z-10 mt-4 font-mono font-black text-[15px] uppercase text-[#291305] tracking-wider">
              {isEquipped ? 'STATUS: AKTIF' : hasPurchased ? 'SUDAH DIMILIKI' : 'SIAP DIBELI'}
            </div>
            <div className="relative z-10 text-[13px] text-[#78350f] mt-1 font-semibold">
              Target: {suit.zoneTarget.split(' ')[0]} {suit.zoneTarget.split(' ')[1] || ''}
            </div>
          </div>

          {/* Fitur Sains & Spesifikasi */}
          <div className="sm:col-span-8 flex flex-col justify-between gap-3">
            <div className="text-[15px] sm:text-base font-black text-[#291305] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: suit.accentColor }} />
              Spesifikasi Proteksi Geologis:
            </div>
            <div className="space-y-2.5">
              {suit.features.map((f, idx) => (
                <div key={idx} className="p-3 sm:p-3.5 rounded-xl bg-[#fffbeb]/90 border border-[#b45309]/25 flex items-start gap-3 shadow-sm">
                  <span className="text-base sm:text-lg shrink-0 mt-0.5 font-medium" style={{ color: suit.accentColor }}>✦</span>
                  <div className="text-left">
                    <span className="font-black text-[15px] sm:text-base text-[#291305] block leading-snug">{f.label}</span>
                    <span className="text-[13px] sm:text-[15px] text-[#3f1d06] font-medium leading-relaxed block mt-0.5">{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Saldo Kristal & Bar Aksi Pembelian */}
        <div className="relative pt-5 border-t border-[#b45309]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status Saldo Kristal Pemain */}
          <div className="flex items-center gap-3.5 w-full sm:w-auto bg-[#fffbeb]/90 px-4 py-2.5 rounded-xl border border-[#b45309]/25 shadow-inner">
            <div className="flex items-center gap-2.5">
              <svg className="w-6 h-6 text-cyan-400 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
              </svg>
              <div className="flex flex-col">
                <span className="text-[13px] uppercase font-extrabold text-[#92400e] tracking-wider">Saldo Kristal</span>
                <span className="text-base sm:text-lg font-black text-cyan-300 font-mono leading-tight">
                  {playerCrystals} Kristal Energi
                </span>
              </div>
            </div>
            <div className="h-7 w-px bg-white/25 mx-1" />
            <div className="flex flex-col">
              <span className="text-[13px] uppercase font-extrabold text-[#92400e] tracking-wider">Harga Baju</span>
              <span className="text-base sm:text-lg font-black text-amber-300 font-mono leading-tight">1 Kristal</span>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                retroAudio.playSelect();
                onClose();
              }}
              className="px-4 sm:px-5 py-3 rounded-xl bg-[#fde68a] hover:bg-[#fcd34d] text-[#3f1d06] font-bold text-[15px] sm:text-base border-2 border-[#b45309]/50 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Nanti Saja
            </button>

            {isEquipped ? (
              <button
                disabled
                className="px-5 sm:px-6 py-3 rounded-xl bg-emerald-600/70 text-emerald-100 font-black text-[15px] sm:text-base border border-emerald-400/60 cursor-default flex items-center gap-2 shadow-lg"
              >
                <span>✓</span> SEDANG DIPAKAI (AKTIF)
              </button>
            ) : hasPurchased ? (
              <button
                onClick={handleAction}
                className="px-5 sm:px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-[#291305] font-black text-[15px] sm:text-base border border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>⚡</span> KENAKAN SEKARANG
              </button>
            ) : canAfford ? (
              <button
                onClick={handleAction}
                className="px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-[#451a03] font-black text-[15px] sm:text-base border border-yellow-300 shadow-[0_0_25px_rgba(245,158,11,0.6)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                BELI & LANGSUNG PAKAI (1 KRISTAL)
              </button>
            ) : (
              <button
                disabled
                className="px-5 sm:px-6 py-3 rounded-xl bg-red-950/70 text-red-200/90 font-bold text-[13px] sm:text-[15px] border border-red-500/40 cursor-not-allowed flex items-center gap-2"
              >
  KRISTAL KURANG (CARI DI AREA INI)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
