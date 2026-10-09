/**
 * Rangkaian Tindakan Gempa — ilustrasi untuk materi Discovery Level 2.
 *
 * Berkas ini dipecah dari DiscoveryModal.tsx. Semua komponen di sini mandiri:
 * tidak menyentuh state DiscoveryModal, hanya menerima props sederhana atau
 * tidak menerima props sama sekali.
 */

import { useState } from 'react';
import { retroAudio } from '../../../utils/retroAudio';
import PixelIcon from '../../../components/PixelIcon';

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: TAS SIAGA BENCANA 72 JAM (AREA 4 TEMUAN 1)
// ═════════════════════════════════════════════════════════════════════════════
export function EarthquakePrepIllustration() {
  const [activeItem, setActiveItem] = useState<'air' | 'p3k' | 'senter' | 'dokumen'>('air');

  const itemDetails = {
    air: {
      title: 'AIR MINUM & RANSUM ENERGI',
      desc: 'Minimal 3 liter air per orang per hari serta ransum biskuit/makanan kaleng tahan lama berkalori tinggi yang cukup untuk bertahan hidup mandiri minimal 72 jam pertama.',
      color: '#38bdf8',
    },
    p3k: {
      title: 'KOTAK P3K & OBAT PRIBADI',
      desc: 'Kasa steril, perban, plester, cairan antiseptik luka, obat pereda nyeri, dan obat-obatan rutin pribadi yang tersimpan rapat dalam wadah anti-air.',
      color: '#ef4444',
    },
    senter: {
      title: 'SENTER LED & PELUIT DARURAT',
      desc: 'Senter tahan air dengan baterai cadangan untuk penerangan saat listrik padam total, serta peluit darurat untuk memanggil tim SAR tanpa menguras tenaga vokal.',
      color: '#facc15',
    },
    dokumen: {
      title: 'DOKUMEN PENTING & UANG TUNAI',
      desc: 'Fotokopi Kartu Keluarga, ijazah, akta lahir, KTP, kartu identitas, dan uang tunai secukupnya yang terlindungi aman dalam kantung ziplock kedap air.',
      color: '#10b981',
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 font-pixel">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 border-b border-slate-800 shrink-0">
        <span className="text-[13px] sm:text-[15px] font-pixel-title text-sky-400 font-bold flex items-center gap-1.5">
          <PixelIcon name="shield" size={14} />
          TAS SIAGA BENCANA (SURVIVAL KIT 72 JAM)
        </span>
        <span className="text-[13.5px] sm:text-[13px] text-slate-400 font-pixel font-semibold">
          STANDAR BNPB &amp; BPBD
        </span>
      </div>

      {/* Button Switcher Item (Di Atas - 100% Selalu Terlihat, Tidak Akan Terpotong!) */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1.5 py-1.5 shrink-0 z-10">
        <button
          onClick={() => {
            retroAudio.playSelect?.();
            setActiveItem('air');
          }}
          className={`px-2 py-1.5 sm:py-2 rounded-lg border-2 text-[13px] sm:text-[13px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 flex items-center justify-center gap-1.5 ${activeItem === 'air'
            ? 'bg-sky-500 text-slate-950 border-sky-300 font-bold shadow-[0_2px_0_#0369a1]'
            : 'bg-slate-800/90 text-sky-300 border-slate-700 hover:border-sky-500 hover:text-white'}`}
        >
          <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
          <span>1. AIR &amp; RANSUM</span>
        </button>
        <button
          onClick={() => {
            retroAudio.playSelect?.();
            setActiveItem('p3k');
          }}
          className={`px-2 py-1.5 sm:py-2 rounded-lg border-2 text-[13px] sm:text-[13px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 flex items-center justify-center gap-1.5 ${activeItem === 'p3k'
            ? 'bg-rose-500 text-slate-950 border-rose-300 font-bold shadow-[0_2px_0_#991b1b]'
            : 'bg-slate-800/90 text-rose-300 border-slate-700 hover:border-rose-500 hover:text-white'}`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
          <span>2. KOTAK P3K</span>
        </button>
        <button
          onClick={() => {
            retroAudio.playSelect?.();
            setActiveItem('senter');
          }}
          className={`px-2 py-1.5 sm:py-2 rounded-lg border-2 text-[13px] sm:text-[13px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 flex items-center justify-center gap-1.5 ${activeItem === 'senter'
            ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-[0_2px_0_#92400e]'
            : 'bg-slate-800/90 text-amber-300 border-slate-700 hover:border-amber-400 hover:text-white'}`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
          <span>3. SENTER &amp; PELUIT</span>
        </button>
        <button
          onClick={() => {
            retroAudio.playSelect?.();
            setActiveItem('dokumen');
          }}
          className={`px-2 py-1.5 sm:py-2 rounded-lg border-2 text-[13px] sm:text-[13px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 flex items-center justify-center gap-1.5 ${activeItem === 'dokumen'
            ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-bold shadow-[0_2px_0_#065f46]'
            : 'bg-slate-800/90 text-emerald-300 border-slate-700 hover:border-emerald-500 hover:text-white'}`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span>4. DOKUMEN &amp; UANG</span>
        </button>
      </div>

      {/* SVG Backpack & Items Visual (High-Detail Pixel Art, NO text inside image) */}
      <div className="w-full flex-1 min-h-0 flex items-center justify-center p-1 sm:p-2">
        <svg viewBox="0 0 540 220" className="w-full h-full object-contain" shapeRendering="crispEdges">
          {/* Background Room Corner */}
          <rect x="0" y="0" width="540" height="220" fill="#0b0f19" />
          {/* Floor & Wall Line */}
          <rect x="0" y="0" width="540" height="175" fill="#0f172a" />
          <line x1="0" y1="175" x2="540" y2="175" stroke="#1e293b" strokeWidth="3" />
          <rect x="0" y="175" width="540" height="45" fill="#1e293b" />
          {/* Lantai Kayu Planks */}
          <line x1="120" y1="175" x2="100" y2="220" stroke="#0f172a" strokeWidth="2" />
          <line x1="260" y1="175" x2="240" y2="220" stroke="#0f172a" strokeWidth="2" />
          <line x1="400" y1="175" x2="380" y2="220" stroke="#0f172a" strokeWidth="2" />

          {/* ── DETAIL PIXEL BACKPACK (KIRI) ── */}
          <g transform="translate(45, 18)">
            {/* Bayangan Tas di Lantai */}
            <ellipse cx="65" cy="165" rx="55" ry="10" fill="#070b12" opacity="0.7" />

            {/* Matras Darurat Gulung di Atas Tas (Thermal Sleeping Mat Roll) */}
            <g transform="translate(18, 0)">
              <rect x="0" y="2" width="94" height="20" rx="6" fill="#0284c7" stroke="#0c4a6e" strokeWidth="2" />
              <rect x="4" y="6" width="86" height="4" fill="#38bdf8" />
              <circle cx="8" cy="12" r="6" fill="#0369a1" />
              <circle cx="8" cy="12" r="3" fill="#075985" />
              {/* Tali Pengikat Matras */}
              <rect x="24" y="0" width="6" height="24" fill="#1e293b" />
              <rect x="23" y="10" width="8" height="4" fill="#94a3b8" />
              <rect x="68" y="0" width="6" height="24" fill="#1e293b" />
              <rect x="67" y="10" width="8" height="4" fill="#94a3b8" />
            </g>

            {/* Tali Bahu Ransel Padded Straps Belakang */}
            <rect x="22" y="18" width="10" height="45" rx="4" fill="#7f1d1d" stroke="#450a0a" strokeWidth="2" />
            <rect x="98" y="18" width="10" height="45" rx="4" fill="#7f1d1d" stroke="#450a0a" strokeWidth="2" />

            {/* Bodi Utama Tas Ransel Merah BPBD */}
            <rect x="18" y="24" width="94" height="135" rx="14" fill="#b91c1c" stroke="#450a0a" strokeWidth="3" />
            <rect x="24" y="30" width="82" height="123" rx="10" fill="#dc2626" />

            {/* Highlight Sisi Atas Tas */}
            <path d="M 28 32 Q 65 28 102 32" stroke="#f87171" strokeWidth="2" fill="none" />

            {/* Kompartemen Depan Atas */}
            <rect x="28" y="42" width="74" height="32" rx="6" fill="#991b1b" stroke="#450a0a" strokeWidth="2" />
            <rect x="32" y="46" width="66" height="24" rx="4" fill="#b91c1c" />
            {/* Resleting Atas */}
            <line x1="36" y1="44" x2="94" y2="44" stroke="#e2e8f0" strokeWidth="1.5" />
            <rect x="60" y="41" width="5" height="4" fill="#facc15" />

            {/* Kompartemen Depan Utama Bawah */}
            <rect x="26" y="82" width="78" height="70" rx="8" fill="#991b1b" stroke="#450a0a" strokeWidth="2" />
            <rect x="30" y="86" width="70" height="62" rx="6" fill="#b91c1c" />
            {/* Resleting Bawah */}
            <path d="M 32 90 L 98 90" stroke="#e2e8f0" strokeWidth="2" />
            <rect x="62" y="87" width="6" height="5" fill="#facc15" />

            {/* Pita Scotlight Reflektor Kuning-Fluorescent */}
            <rect x="22" y="104" width="86" height="10" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
            <rect x="24" y="106" width="82" height="3" fill="#fef08a" />

            {/* Lambang Palang Putih Medis/Siaga (Tanpa Teks!) */}
            <rect x="58" y="122" width="14" height="18" rx="2" fill="#ffffff" />
            <rect x="52" y="125" width="26" height="12" rx="2" fill="#ffffff" />
            <rect x="60" y="124" width="10" height="14" fill="#dc2626" />
            <rect x="54" y="127" width="22" height="8" fill="#dc2626" />

            {/* Kantong Jaring Samping Kiri (Tempat Botol Air) */}
            <rect x="6" y="75" width="14" height="60" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
            {/* Botol Air di Samping */}
            <rect x="8" y="52" width="10" height="30" rx="3" fill="#0284c7" />
            <rect x="10" y="46" width="6" height="7" fill="#38bdf8" />
            <rect x="11" y="43" width="4" height="4" fill="#e0f2fe" />
            {/* Pola Jaring Mesh */}
            <line x1="6" y1="85" x2="20" y2="95" stroke="#475569" strokeWidth="1" />
            <line x1="6" y1="95" x2="20" y2="105" stroke="#475569" strokeWidth="1" />
            <line x1="6" y1="105" x2="20" y2="115" stroke="#475569" strokeWidth="1" />

            {/* Kantong Jaring Samping Kanan (Tempat Senter) */}
            <rect x="110" y="75" width="14" height="60" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="113" y="56" width="8" height="25" rx="2" fill="#334155" />
            <rect x="112" y="52" width="10" height="5" fill="#facc15" />

            {/* Pegangan Atas Tas (Top Grab Handle) */}
            <rect x="50" y="18" width="30" height="10" rx="4" fill="none" stroke="#7f1d1d" strokeWidth="4" />
          </g>

          {/* ── DETAIL GEAR SHOWCASE (KANAN) - 100% BEBAS TEKS DALAM GAMBAR ── */}
          <g transform="translate(205, 16)">
            {/* Frame Wadah Peralatan */}
            <rect x="0" y="0" width="315" height="175" rx="10" fill="#0f172a" stroke={itemDetails[activeItem].color} strokeWidth="2.5" />
            <rect x="0" y="0" width="315" height="28" rx="10" fill="#1e293b" />
            <text x="14" y="19" fill={itemDetails[activeItem].color} fontSize="11" fontWeight="bold" fontFamily="'Pixelify Sans', sans-serif">
              {itemDetails[activeItem].title}
            </text>

            {/* 1. VISUAL AIR & RANSUM ENERGI (BEBAS TEKS) */}
            {activeItem === 'air' && (
              <g transform="translate(10, 38)">
                {/* Botol Air Tritan Transparan dengan Skala Ukur */}
                <g transform="translate(0, 0)">
                  <rect x="4" y="24" width="36" height="76" rx="8" fill="#0369a1" stroke="#38bdf8" strokeWidth="2.5" />
                  {/* Air di dalam botol (Efek Gelombang & Gradien) */}
                  <rect x="8" y="38" width="28" height="58" rx="5" fill="#38bdf8" opacity="0.85" />
                  <line x1="8" y1="38" x2="36" y2="38" stroke="#ffffff" strokeWidth="1.5" />
                  {/* Pantulan Cahaya Botol */}
                  <line x1="12" y1="44" x2="12" y2="88" stroke="#e0f2fe" strokeWidth="2" strokeLinecap="round" />
                  {/* Garis Ukur Mililiter di Samping */}
                  <line x1="30" y1="50" x2="34" y2="50" stroke="#0c4a6e" strokeWidth="1.5" />
                  <line x1="28" y1="62" x2="34" y2="62" stroke="#0c4a6e" strokeWidth="1.5" />
                  <line x1="30" y1="74" x2="34" y2="74" stroke="#0c4a6e" strokeWidth="1.5" />
                  {/* Leher & Tutup Botol dengan Tali Gantungan */}
                  <rect x="12" y="12" width="20" height="14" rx="2" fill="#075985" stroke="#38bdf8" strokeWidth="1.5" />
                  <rect x="10" y="6" width="24" height="8" rx="2" fill="#0284c7" />
                  <path d="M 32 10 Q 42 16 40 28" fill="none" stroke="#0284c7" strokeWidth="2" />
                </g>

                {/* Kemasan Ransum Biskuit Kalori Foil Emas (Tanpa Tulisan) */}
                <g transform="translate(48, 14)">
                  <rect x="0" y="8" width="62" height="42" rx="4" fill="#d97706" stroke="#f59e0b" strokeWidth="2.5" />
                  {/* Segel Gigi Foil Atas & Bawah */}
                  <line x1="0" y1="12" x2="62" y2="12" stroke="#fef3c7" strokeWidth="1.5" />
                  <line x1="0" y1="46" x2="62" y2="46" stroke="#fef3c7" strokeWidth="1.5" />
                  {/* Emboss Grid Tekstur Biskuit */}
                  <rect x="8" y="18" width="46" height="22" rx="2" fill="#b45309" />
                  <circle cx="16" cy="24" r="2" fill="#fde68a" />
                  <circle cx="26" cy="24" r="2" fill="#fde68a" />
                  <circle cx="36" cy="24" r="2" fill="#fde68a" />
                  <circle cx="46" cy="24" r="2" fill="#fde68a" />
                  <circle cx="16" cy="34" r="2" fill="#fde68a" />
                  <circle cx="26" cy="34" r="2" fill="#fde68a" />
                  <circle cx="36" cy="34" r="2" fill="#fde68a" />
                  <circle cx="46" cy="34" r="2" fill="#fde68a" />
                </g>

                {/* Makanan Kaleng Darurat (Pull-Ring Tin Can) */}
                <g transform="translate(50, 64)">
                  <ellipse cx="28" cy="10" rx="26" ry="8" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />
                  <rect x="2" y="10" width="52" height="25" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
                  <ellipse cx="28" cy="35" rx="26" ry="8" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                  {/* Cincin Pembuka Tutup Kaleng */}
                  <circle cx="24" cy="9" r="4" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
                  <rect x="28" y="8" width="6" height="2" fill="#e2e8f0" />
                </g>
              </g>
            )}

            {/* 2. VISUAL KOTAK P3K & OBAT MEDIS (BEBAS TEKS) */}
            {activeItem === 'p3k' && (
              <g transform="translate(10, 36)">
                {/* Kotak Medis Merah dengan Palang Putih Timbul */}
                <g transform="translate(0, 5)">
                  <rect x="0" y="8" width="68" height="52" rx="6" fill="#dc2626" stroke="#991b1b" strokeWidth="2.5" />
                  <rect x="4" y="12" width="60" height="44" rx="4" fill="#ef4444" />
                  {/* Pegangan Koper Medis */}
                  <rect x="24" y="0" width="20" height="9" rx="3" fill="none" stroke="#dc2626" strokeWidth="3" />
                  {/* Lambang Palang Putih Bersih */}
                  <rect x="28" y="22" width="12" height="24" fill="#ffffff" />
                  <rect x="22" y="28" width="24" height="12" fill="#ffffff" />
                </g>

                {/* Botol Antiseptik dengan Pipet Tetes */}
                <g transform="translate(72, 5)">
                  <rect x="4" y="18" width="24" height="42" rx="4" fill="#92400e" stroke="#78350f" strokeWidth="2" />
                  <rect x="8" y="24" width="16" height="22" fill="#fef3c7" rx="2" />
                  <circle cx="16" cy="35" r="3" fill="#dc2626" />
                  {/* Leher & Pipet */}
                  <rect x="10" y="10" width="12" height="8" fill="#1e293b" />
                  <ellipse cx="16" cy="8" rx="6" ry="4" fill="#0f172a" />
                </g>

                {/* Strip Blister Obat Kapsul 6 Butir */}
                <g transform="translate(2, 68)">
                  <rect x="0" y="0" width="62" height="34" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
                  {/* Kapsul 1, 2, 3 */}
                  <rect x="6" y="5" width="14" height="8" rx="4" fill="#3b82f6" />
                  <rect x="13" y="5" width="7" height="8" rx="4" fill="#ffffff" />
                  <rect x="24" y="5" width="14" height="8" rx="4" fill="#ef4444" />
                  <rect x="31" y="5" width="7" height="8" rx="4" fill="#ffffff" />
                  <rect x="42" y="5" width="14" height="8" rx="4" fill="#22c55e" />
                  <rect x="49" y="5" width="7" height="8" rx="4" fill="#ffffff" />
                  {/* Kapsul 4, 5, 6 */}
                  <rect x="6" y="19" width="14" height="8" rx="4" fill="#eab308" />
                  <rect x="13" y="19" width="7" height="8" rx="4" fill="#ffffff" />
                  <rect x="24" y="19" width="14" height="8" rx="4" fill="#a855f7" />
                  <rect x="31" y="19" width="7" height="8" rx="4" fill="#ffffff" />
                  <rect x="42" y="19" width="14" height="8" rx="4" fill="#06b6d4" />
                  <rect x="49" y="19" width="7" height="8" rx="4" fill="#ffffff" />
                </g>

                {/* Gulungan Perban Kasa Steril */}
                <g transform="translate(70, 58)">
                  <ellipse cx="20" cy="22" rx="16" ry="16" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                  <ellipse cx="20" cy="22" rx="8" ry="8" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                  <path d="M 28 32 L 38 40" stroke="#f8fafc" strokeWidth="4" />
                </g>
              </g>
            )}

            {/* 3. VISUAL SENTER TAKTIS & PELUIT SAR (BEBAS TEKS) */}
            {activeItem === 'senter' && (
              <g transform="translate(10, 36)">
                {/* Senter Taktis Logam dengan Sorot Lampu */}
                <g transform="translate(0, 8)">
                  {/* Sorot Cahaya Terang */}
                  <polygon points="45,18 105,2 105,48 45,30" fill="url(#senterBeamGrad)" opacity="0.65" />
                  {/* Kepala Senter Bezel */}
                  <polygon points="30,12 45,8 45,40 30,36" fill="#475569" stroke="#64748b" strokeWidth="2" />
                  <rect x="44" y="8" width="4" height="32" rx="2" fill="#38bdf8" />
                  {/* Bodi Tabung Senter Bertekstur Knurling */}
                  <rect x="0" y="17" width="30" height="14" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                  <line x1="6" y1="17" x2="6" y2="31" stroke="#475569" strokeWidth="1" />
                  <line x1="12" y1="17" x2="12" y2="31" stroke="#475569" strokeWidth="1" />
                  <line x1="18" y1="17" x2="18" y2="31" stroke="#475569" strokeWidth="1" />
                  <line x1="24" y1="17" x2="24" y2="31" stroke="#475569" strokeWidth="1" />
                  {/* Tombol Saklar Oranye */}
                  <rect x="12" y="13" width="6" height="4" rx="1" fill="#f97316" />
                </g>

                {/* Peluit Darurat Oranye Terang dengan Tali Gantungan */}
                <g transform="translate(6, 60)">
                  {/* Tali Gantungan Lanyard */}
                  <path d="M 12 18 Q 0 35 20 45 Q 40 50 35 24" fill="none" stroke="#f97316" strokeWidth="2.5" />
                  {/* Bodi Peluit */}
                  <rect x="25" y="12" width="35" height="16" rx="4" fill="#ea580c" stroke="#9a3412" strokeWidth="2" />
                  <rect x="48" y="15" width="18" height="10" fill="#f97316" />
                  {/* Lubang Udara & Bola Peluit */}
                  <rect x="36" y="9" width="8" height="6" fill="#431407" />
                  <circle cx="34" cy="20" r="4" fill="#ffffff" opacity="0.8" />
                </g>

                {/* 2 Baterai Cadangan AA */}
                <g transform="translate(74, 60)">
                  {/* Baterai 1 */}
                  <rect x="0" y="4" width="14" height="32" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  <rect x="0" y="4" width="14" height="8" fill="#d97706" />
                  <rect x="4" y="0" width="6" height="4" fill="#d97706" />
                  {/* Baterai 2 */}
                  <rect x="18" y="4" width="14" height="32" rx="2" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  <rect x="18" y="4" width="14" height="8" fill="#d97706" />
                  <rect x="22" y="0" width="6" height="4" fill="#d97706" />
                </g>
              </g>
            )}

            {/* 4. VISUAL DOKUMEN PENTING & UANG (BEBAS TEKS) */}
            {activeItem === 'dokumen' && (
              <g transform="translate(10, 34)">
                {/* Kantong Ziplock Kedap Air (Waterproof Pouch) */}
                <rect x="0" y="4" width="102" height="74" rx="6" fill="#047857" opacity="0.25" stroke="#10b981" strokeWidth="2" />
                {/* Segel Klip Biru Ziplock */}
                <rect x="0" y="4" width="102" height="8" rx="2" fill="#0284c7" />
                <line x1="4" y1="8" x2="98" y2="8" stroke="#38bdf8" strokeWidth="2" />

                {/* Lembar Dokumen / Sertifikat Berlipat di Dalam Pouch */}
                <g transform="translate(8, 16)">
                  <rect x="0" y="0" width="55" height="54" rx="2" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                  {/* Pita / Lambang Segel Garuda Merah */}
                  <circle cx="28" cy="14" r="6" fill="#dc2626" />
                  {/* Baris Dokumen Abstrak (Bukan Huruf/Kata) */}
                  <line x1="8" y1="26" x2="47" y2="26" stroke="#475569" strokeWidth="2" />
                  <line x1="8" y1="33" x2="42" y2="33" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="8" y1="40" x2="47" y2="40" stroke="#94a3b8" strokeWidth="1.5" />
                  <line x1="8" y1="47" x2="35" y2="47" stroke="#94a3b8" strokeWidth="1.5" />
                </g>

                {/* Kartu Identitas / KTP dengan Foto Siluet */}
                <g transform="translate(44, 30)">
                  <rect x="0" y="0" width="46" height="30" rx="3" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
                  {/* Foto Siluet */}
                  <rect x="4" y="5" width="14" height="20" rx="2" fill="#0369a1" />
                  <circle cx="11" cy="11" r="3.5" fill="#bae6fd" />
                  <path d="M 6 23 Q 11 17 16 23" fill="#bae6fd" />
                  {/* Garis Data ID */}
                  <line x1="22" y1="8" x2="40" y2="8" stroke="#0284c7" strokeWidth="2" />
                  <line x1="22" y1="14" x2="38" y2="14" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="22" y1="20" x2="35" y2="20" stroke="#64748b" strokeWidth="1.5" />
                </g>

                {/* Gulungan Uang Tunai Pecahan Kecil dengan Karet Gelang */}
                <g transform="translate(16, 72)">
                  <ellipse cx="14" cy="15" rx="10" ry="14" fill="#15803d" stroke="#16a34a" strokeWidth="1.5" />
                  <rect x="14" y="1" width="48" height="28" fill="#16a34a" stroke="#22c55e" strokeWidth="1.5" />
                  <ellipse cx="62" cy="15" rx="10" ry="14" fill="#22c55e" stroke="#4ade80" strokeWidth="1.5" />
                  {/* Karet Gelang Pengikat Merah */}
                  <rect x="36" y="0" width="5" height="30" fill="#dc2626" />
                </g>
              </g>
            )}

            {/* Panel Teks Deskripsi (Di Sebelah Kanan Grafis - Luas, Terbaca Jelas & Anti-Cutoff) */}
            <foreignObject x="122" y="30" width="186" height="138">
              <div className="w-full h-full flex flex-col justify-center overflow-y-auto pr-1 select-none">
                <p className="text-[14.5px] sm:text-[15px] md:text-[15px] text-slate-100 leading-snug sm:leading-normal font-sans font-medium">
                  {itemDetails[activeItem].desc}
                </p>
              </div>
            </foreignObject>
          </g>

          {/* Gradients */}
          <defs>
            <linearGradient id="senterBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#fef08a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: STANDAR AKSI KESELAMATAN GEMPA BUMI (AREA 1 TEMUAN 2)
// GAMBAR MANUSIA PROPORSIONAL & REALISTIS: SISWA SMP SERAGAM PUTIH-BIRU
// ═════════════════════════════════════════════════════════════════════════════
// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: POSTER STANDAR AKSI KESELAMATAN GEMPA BUMI (AREA 1 TEMUAN 2)
// 100% MENGIKUTI POSTER MITIGASI: MERUNDUK, LINDUNGI DIRI, BERTAHAN PEGANG ERAT,
// SERTA TETAP TENANG & EVAKUASI DENGAN 4 KARTU BERBINGKAI KUNING EMAS
// ═════════════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: STANDAR AKSI KESELAMATAN GEMPA BUMI (AREA 1 TEMUAN 2)
// GAMBAR MANUSIA PROPORSIONAL & REALISTIS: SISWA SMP SERAGAM PUTIH-BIRU
// ═════════════════════════════════════════════════════════════════════════════
// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: POSTER STANDAR AKSI KESELAMATAN GEMPA BUMI (AREA 1 TEMUAN 2)
// 100% MENGIKUTI POSTER MITIGASI: MERUNDUK, LINDUNGI DIRI, BERTAHAN PEGANG ERAT,
// SERTA TETAP TENANG & EVAKUASI DENGAN 4 KARTU BERBINGKAI KUNING EMAS
// ═════════════════════════════════════════════════════════════════════════════
export function EarthquakeActionIllustration() {
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4>(1);

  const cards = [
    {
      id: 1 as const,
      tabTitle: '1. MERUNDUK',
      title: 'MERUNDUK',
      desc: 'Jatuhkan badan ke posisi merangkak. Agar tidak terjatuh dan memudahkan bergerak merangkak menuju tempat berlindung.',
      themeColor: '#dc2626',
      badgeBg: 'bg-red-600',
    },
    {
      id: 2 as const,
      tabTitle: '2. LINDUNGI DIRI',
      title: 'LINDUNGI DIRI',
      desc: 'Lindungi kepala dan leher dengan satu tangan. Jika ada meja atau bangku yang kuat, merangkaklah ke bawahnya.',
      themeColor: '#eab308',
      badgeBg: 'bg-amber-500',
    },
    {
      id: 3 as const,
      tabTitle: '3. BERTAHAN',
      title: 'BERTAHAN PEGANG ERAT',
      desc: 'Pegang erat meja atau benda yang menutupimu agar tetap aman. Jika meja bergeser, ikut bergerak bersamanya sambil tetap berlindung.',
      themeColor: '#ca8a04',
      badgeBg: 'bg-yellow-600',
    },
    {
      id: 4 as const,
      tabTitle: '4. EVAKUASI & TENANG',
      title: 'TETAP TENANG & EVAKUASI',
      desc: 'Jangan panik, supaya bisa berpikir jernih. Setelah gempa reda, segera evakuasi tertib ke titik kumpul dengan melindungi kepala.',
      themeColor: '#16a34a',
      badgeBg: 'bg-emerald-600',
    },
  ];

  // Helper untuk merender grafik 2D PIXEL ART murni tanpa teks di setiap kartu
  const renderCardGraphic = (cardId: 1 | 2 | 3 | 4, _isCompact = false) => {
    switch (cardId) {
      // ═════════════════════════════════════════════════════════════════════════
      // 1. MERUNDUK (DROP): SISWA SMP MERANGKAK MENUJU KOLONG MEJA KAYU
      // ═════════════════════════════════════════════════════════════════════════
      case 1:
        return (
          <svg
            viewBox="0 0 360 120"
            className="w-full h-full object-contain"
            shapeRendering="crispEdges"
          >
            {/* ── LATAR RUANG KELAS & LANTAI KAYU PARQUET ── */}
            <rect x="0" y="0" width="360" height="92" fill="#f8fafc" />
            {/* Dinding bawah / Wainscoting lis kayu */}
            <rect x="0" y="88" width="360" height="4" fill="#78350f" />
            <rect x="0" y="92" width="360" height="28" fill="#e2e8f0" />
            <line x1="0" y1="92" x2="360" y2="92" stroke="#94a3b8" strokeWidth="1" />
            {/* Nat Ubin Keramik Bersih */}
            <line x1="45" y1="92" x2="30" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="105" y1="92" x2="90" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="165" y1="92" x2="150" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="225" y1="92" x2="210" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="285" y1="92" x2="270" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="345" y1="92" x2="330" y2="120" stroke="#cbd5e1" strokeWidth="1" />

            {/* Aksi Skala Penuh & Terpusat (1.32x lebih besar, tegas dan terlihat jelas) */}
            <g transform="translate(44, -15) scale(1.32)">
              {/* ── MEJA BELAJAR SISWA SMP KOKOH (SISI KANAN) ── */}
              <g transform="translate(116, 24)">
                {/* Bayangan Meja di Lantai */}
                <rect x="0" y="60" width="70" height="4" fill="#0f172a" opacity="0.2" />

                {/* Kaki Meja Belakang (Warna Lebih Gelap) */}
                <rect x="14" y="10" width="5" height="50" fill="#5c2605" />
                <rect x="58" y="10" width="5" height="50" fill="#5c2605" />

                {/* Laci / Kolong Meja Buku */}
                <rect x="6" y="8" width="60" height="9" fill="#78350f" stroke="#451a03" strokeWidth="1" />
                <rect x="16" y="11" width="14" height="4" fill="#0284c7" />
                <rect x="34" y="11" width="18" height="4" fill="#f59e0b" />

                {/* Kaki Meja Depan Kayu Solid */}
                <rect x="4" y="8" width="7" height="52" fill="#92400e" />
                <rect x="4" y="8" width="2" height="52" fill="#b45309" />
                <rect x="62" y="8" width="7" height="52" fill="#92400e" />
                <rect x="62" y="8" width="2" height="52" fill="#b45309" />
                <rect x="4" y="44" width="65" height="3" fill="#78350f" />

                {/* Daun Meja Kayu Jati Kokoh */}
                <rect x="0" y="0" width="74" height="8" rx="1" fill="#b45309" stroke="#451a03" strokeWidth="1" />
                <rect x="2" y="1" width="70" height="2" fill="#d97706" />
              </g>

              {/* ── KARAKTER SISWA SMP 2D PIXEL: MERUNDUK & MERANGKAK BERTUMPU TANGAN & LUTUT ── */}
              <g transform="translate(16, 42)">
                {/* Bayangan Tubuh Siswa */}
                <ellipse cx="44" cy="42" rx="34" ry="4" fill="#0f172a" opacity="0.25" />

                {/* Kaki Belakang (Sepatu Kets Hitam & Kaus Kaki Putih) */}
                <rect x="2" y="38" width="8" height="4" fill="#0f172a" />
                <rect x="2" y="41" width="8" height="1" fill="#ffffff" />
                <rect x="8" y="35" width="4" height="4" fill="#f8fafc" />

                {/* Tungkai Bawah Kaki Belakang Melipat */}
                <rect x="10" y="32" width="12" height="6" fill="#172554" />

                {/* Kaki Depan (Lutut Kanan Menapak Kokoh di Lantai) */}
                <rect x="28" y="38" width="7" height="3" fill="#f5af7e" />
                <rect x="18" y="34" width="13" height="6" fill="#1e3a8a" />

                {/* Celana Pendek / Panjang Biru SMP & Sabuk */}
                <rect x="16" y="24" width="16" height="12" fill="#1e3a8a" />
                <rect x="18" y="24" width="14" height="3" fill="#2563eb" />
                <rect x="28" y="24" width="3" height="12" fill="#0f172a" />
                <rect x="29" y="28" width="2" height="2" fill="#cbd5e1" />

                {/* Tubuh / Kemeja Putih Seragam SMP Condong Rendah ke Depan */}
                <rect x="30" y="16" width="24" height="14" fill="#ffffff" />
                <rect x="32" y="26" width="20" height="4" fill="#cbd5e1" />
                {/* Saku Dada & Badge OSIS Biru */}
                <rect x="44" y="20" width="3" height="4" fill="#1e3a8a" />
                <rect x="45" y="21" width="1" height="2" fill="#ffffff" />
                {/* Dasi Biru SMP */}
                <rect x="50" y="20" width="3" height="8" fill="#1e3a8a" />

                {/* Lengan Kiri (Lengan Belakang) Menumpu Lantai */}
                <rect x="42" y="22" width="4" height="18" fill="#cbd5e1" />
                <rect x="41" y="40" width="6" height="2" fill="#f5af7e" />

                {/* Lengan Kanan (Lengan Depan) Menumpu Beban Tubuh */}
                <rect x="50" y="18" width="6" height="6" fill="#ffffff" />
                <rect x="52" y="24" width="5" height="16" fill="#f5af7e" />
                <rect x="52" y="24" width="1" height="16" fill="#e07a5f" />
                {/* Telapak & Jari-Jari Tangan Menapak di Lantai */}
                <rect x="52" y="40" width="8" height="2" fill="#f5af7e" />
                <rect x="54" y="40" width="1" height="2" fill="#b45309" />
                <rect x="57" y="40" width="1" height="2" fill="#b45309" />

                {/* Leher & Kepala Siswa Menatap ke Kolong Meja */}
                <rect x="52" y="14" width="6" height="5" fill="#f5af7e" />
                <rect x="54" y="6" width="13" height="11" fill="#f5af7e" />
                {/* Mata Siswa Fokus Rendah */}
                <rect x="62" y="9" width="2" height="2" fill="#0f172a" />
                <rect x="63" y="9" width="1" height="1" fill="#ffffff" />
                {/* Hidung & Telinga */}
                <rect x="67" y="11" width="1" height="2" fill="#e07a5f" />
                <rect x="55" y="9" width="2" height="3" fill="#e07a5f" />
                {/* Rambut Siswa SMP Hitam Rapi Bervolume */}
                <rect x="53" y="3" width="14" height="6" fill="#0f172a" />
                <rect x="53" y="3" width="3" height="9" fill="#0f172a" />
                <rect x="58" y="3" width="8" height="2" fill="#334155" />
                <rect x="63" y="6" width="3" height="3" fill="#0f172a" />
              </g>

              {/* Indikator Panah Gravitasi Rendah Pixel (Aman / Stabil) */}
              <g transform="translate(94, 60)">
                <rect x="2" y="0" width="3" height="12" fill="#f59e0b" />
                <polygon points="0,12 7,12 3.5,17" fill="#f59e0b" />
              </g>
            </g>
          </svg>
        );

      // ═════════════════════════════════════════════════════════════════════════
      // 2. LINDUNGI DIRI (COVER): SISWA MERINGKUK DI KOLONG MEJA MENDEKAP KEPALA
      // ═════════════════════════════════════════════════════════════════════════
      case 2:
        return (
          <svg
            viewBox="0 0 360 120"
            className="w-full h-full object-contain"
            shapeRendering="crispEdges"
          >
            {/* Latar Ruang Kelas & Lantai Keramik */}
            <rect x="0" y="0" width="360" height="92" fill="#f8fafc" />
            <rect x="0" y="88" width="360" height="4" fill="#78350f" />
            <rect x="0" y="92" width="360" height="28" fill="#e2e8f0" />
            <line x1="0" y1="92" x2="360" y2="92" stroke="#94a3b8" strokeWidth="1" />
            <line x1="45" y1="92" x2="30" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="105" y1="92" x2="90" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="165" y1="92" x2="150" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="225" y1="92" x2="210" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="285" y1="92" x2="270" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="345" y1="92" x2="330" y2="120" stroke="#cbd5e1" strokeWidth="1" />

            <g transform="translate(48, -15) scale(1.32)">
              {/* Partikel Reruntuhan Langit-Langit Terbentur Daun Meja (Aman Terlindungi) */}
              <rect x="94" y="12" width="3" height="3" fill="#94a3b8" />
              <rect x="112" y="14" width="2" height="2" fill="#cbd5e1" />
              <rect x="80" y="13" width="2" height="3" fill="#cbd5e1" />
              {/* Percikan debu terpental dari atas meja */}
              <rect x="92" y="17" width="2" height="2" fill="#cbd5e1" />
              <rect x="100" y="16" width="3" height="1" fill="#94a3b8" />
              <rect x="116" y="18" width="2" height="2" fill="#cbd5e1" />

              {/* ── MEJA BELAJAR SISWA SMP KOKOH (DI TENGAH) ── */}
              <g transform="translate(45, 20)">
                {/* Bayangan Meja di Lantai */}
                <rect x="2" y="64" width="106" height="5" fill="#0f172a" opacity="0.25" />

                {/* Kaki Meja Belakang */}
                <rect x="18" y="10" width="6" height="54" fill="#5c2605" />
                <rect x="88" y="10" width="6" height="54" fill="#5c2605" />

                {/* Laci / Rak Buku Bawah Daun Meja */}
                <rect x="8" y="9" width="94" height="12" fill="#78350f" stroke="#451a03" strokeWidth="1" />
                <rect x="22" y="13" width="24" height="5" fill="#0284c7" />
                <rect x="52" y="13" width="28" height="5" fill="#f59e0b" />

                {/* ── SISWA SMP MERINGKUK DI KOLONG MEJA ── */}
                <g transform="translate(26, 26)">
                  {/* Bayangan Siswa */}
                  <ellipse cx="28" cy="38" rx="26" ry="4" fill="#070b12" opacity="0.35" />

                  {/* Sepatu Sekolah Hitam & Kaus Kaki Putih */}
                  <rect x="0" y="34" width="8" height="4" fill="#0f172a" />
                  <rect x="0" y="37" width="8" height="1" fill="#ffffff" />
                  <rect x="6" y="32" width="4" height="3" fill="#f8fafc" />

                  {/* Kaki & Lutut Melipat di Kolong (Celana Biru SMP) */}
                  <rect x="8" y="28" width="14" height="10" fill="#172554" />
                  <rect x="18" y="32" width="12" height="6" fill="#1e3a8a" />

                  {/* Punggung Melengkung Rendah (Kemeja Putih SMP) */}
                  <rect x="14" y="18" width="22" height="14" fill="#ffffff" />
                  <rect x="16" y="24" width="20" height="6" fill="#cbd5e1" />
                  <rect x="12" y="26" width="6" height="6" fill="#1e3a8a" />

                  {/* Kepala Menunduk Rapat Dekat Dada */}
                  <rect x="32" y="20" width="12" height="12" fill="#f5af7e" />
                  <rect x="32" y="18" width="12" height="8" fill="#0f172a" />
                  <rect x="42" y="24" width="2" height="2" fill="#0f172a" />

                  {/* KEDUA LENGAN MELINGKARI TENGKUK & KEPALA (STANDAR COVER BAKU) */}
                  <rect x="26" y="16" width="8" height="8" fill="#ffffff" />
                  <rect x="30" y="13" width="14" height="5" fill="#f5af7e" />
                  <rect x="30" y="13" width="14" height="1" fill="#fed7aa" />
                  {/* Tangan Mengunci Erat di Belakang Tengkuk */}
                  <rect x="40" y="15" width="6" height="5" fill="#e07a5f" />
                  <rect x="41" y="16" width="4" height="1" fill="#f5af7e" />
                  <rect x="41" y="18" width="4" height="1" fill="#f5af7e" />

                  {/* Lengan Lainnya Menopang Keseimbangan di Lantai */}
                  <rect x="36" y="28" width="4" height="10" fill="#f5af7e" />
                  <rect x="36" y="37" width="6" height="2" fill="#f5af7e" />
                </g>

                {/* Kaki Meja Depan Kayu Solid */}
                <rect x="6" y="8" width="8" height="56" fill="#92400e" />
                <rect x="6" y="8" width="2" height="56" fill="#b45309" />
                <rect x="96" y="8" width="8" height="56" fill="#92400e" />
                <rect x="96" y="8" width="2" height="56" fill="#b45309" />
                <rect x="6" y="50" width="98" height="3" fill="#78350f" />

                {/* Daun Meja Kayu Jati Kokoh Tebal */}
                <rect x="0" y="0" width="110" height="9" rx="1" fill="#b45309" stroke="#451a03" strokeWidth="1" />
                <rect x="2" y="1" width="106" height="2" fill="#d97706" />
              </g>

              {/* Perisai Garis Putus-Putus Cyan Menunjukkan Zona Aman Terlindungi */}
              <rect x="74" y="44" width="56" height="38" rx="4" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.8" />
            </g>
          </svg>
        );

      // ═════════════════════════════════════════════════════════════════════════
      // 3. BERTAHAN (HOLD ON): SISWA MENCENGKERAM ERAT KAKI MEJA
      // ═════════════════════════════════════════════════════════════════════════
      case 3:
        return (
          <svg
            viewBox="0 0 360 120"
            className="w-full h-full object-contain"
            shapeRendering="crispEdges"
          >
            {/* Latar Ruang Kelas & Lantai Keramik */}
            <rect x="0" y="0" width="360" height="92" fill="#f8fafc" />
            <rect x="0" y="88" width="360" height="4" fill="#78350f" />
            <rect x="0" y="92" width="360" height="28" fill="#e2e8f0" />
            <line x1="0" y1="92" x2="360" y2="92" stroke="#94a3b8" strokeWidth="1" />
            <line x1="45" y1="92" x2="30" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="105" y1="92" x2="90" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="165" y1="92" x2="150" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="225" y1="92" x2="210" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="285" y1="92" x2="270" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="345" y1="92" x2="330" y2="120" stroke="#cbd5e1" strokeWidth="1" />

            <g transform="translate(48, -15) scale(1.32)">
              {/* Efek Garis Getar Dinamis (Goncangan Meja Bergerak Bersama) */}
              <g opacity="0.6">
                <line x1="38" y1="22" x2="43" y2="22" stroke="#f59e0b" strokeWidth="1.5" />
                <line x1="158" y1="22" x2="163" y2="22" stroke="#f59e0b" strokeWidth="1.5" />
                <line x1="40" y1="50" x2="45" y2="50" stroke="#f59e0b" strokeWidth="1.5" />
                <line x1="156" y1="50" x2="161" y2="50" stroke="#f59e0b" strokeWidth="1.5" />
              </g>

              {/* ── MEJA BELAJAR SISWA SMP KOKOH ── */}
              <g transform="translate(45, 20)">
                {/* Bayangan Meja */}
                <rect x="2" y="64" width="106" height="5" fill="#0f172a" opacity="0.25" />

                {/* Kaki Meja Belakang */}
                <rect x="18" y="10" width="6" height="54" fill="#5c2605" />
                <rect x="88" y="10" width="6" height="54" fill="#5c2605" />
                <rect x="8" y="9" width="94" height="12" fill="#78350f" stroke="#451a03" strokeWidth="1" />

                {/* ── SISWA SMP BERTAHAN & MEMEGANG ERAT KAKI MEJA ── */}
                <g transform="translate(24, 26)">
                  {/* Bayangan Siswa */}
                  <ellipse cx="32" cy="38" rx="28" ry="4" fill="#070b12" opacity="0.35" />

                  {/* Sepatu & Kaki Melipat */}
                  <rect x="0" y="34" width="8" height="4" fill="#0f172a" />
                  <rect x="0" y="37" width="8" height="1" fill="#ffffff" />
                  <rect x="6" y="32" width="4" height="3" fill="#f8fafc" />
                  <rect x="8" y="28" width="14" height="10" fill="#172554" />
                  <rect x="18" y="32" width="14" height="6" fill="#1e3a8a" />

                  {/* Punggung & Tubuh Condong Maju Menjangkau Kaki Meja */}
                  <rect x="14" y="18" width="24" height="14" fill="#ffffff" />
                  <rect x="16" y="24" width="22" height="6" fill="#cbd5e1" />
                  <rect x="12" y="26" width="6" height="6" fill="#1e3a8a" />

                  {/* Kepala Menunduk Fokus */}
                  <rect x="34" y="18" width="12" height="12" fill="#f5af7e" />
                  <rect x="34" y="16" width="12" height="8" fill="#0f172a" />
                  <rect x="44" y="22" width="2" height="2" fill="#0f172a" />

                  {/* Tangan Kiri Melindungi Belakang Kepala */}
                  <rect x="28" y="14" width="12" height="5" fill="#f5af7e" />
                  <rect x="38" y="15" width="4" height="4" fill="#e07a5f" />

                  {/* LENGAN KANAN MENJANGKAU KE DEPAN & MENCENGKERAM KAKI MEJA DEPAN */}
                  <rect x="28" y="18" width="8" height="8" fill="#ffffff" />
                  <rect x="34" y="22" width="38" height="6" fill="#f5af7e" />
                  <rect x="34" y="26" width="38" height="1" fill="#e07a5f" />

                  {/* JARI-JARI TANGAN MELINGKARI KAKI MEJA KAYU SOLID (GRIP TIGHT) */}
                  <rect x="70" y="20" width="8" height="10" rx="1" fill="#f5af7e" stroke="#b45309" strokeWidth="1" />
                  <rect x="72" y="21" width="5" height="2" fill="#e07a5f" />
                  <rect x="72" y="24" width="5" height="2" fill="#e07a5f" />
                  <rect x="72" y="27" width="5" height="2" fill="#e07a5f" />

                  {/* Pendaran Hijau Tanda Cengkeraman Erat Terkunci */}
                  <rect x="68" y="18" width="12" height="14" rx="2" fill="none" stroke="#10b981" strokeWidth="1.5" />
                </g>

                {/* Kaki Meja Depan Kayu Solid */}
                <rect x="6" y="8" width="8" height="56" fill="#92400e" />
                <rect x="6" y="8" width="2" height="56" fill="#b45309" />
                <rect x="96" y="8" width="8" height="56" fill="#92400e" />
                <rect x="96" y="8" width="2" height="56" fill="#b45309" />
                <rect x="6" y="50" width="98" height="3" fill="#78350f" />

                {/* Daun Meja Kayu Jati Kokoh Tebal */}
                <rect x="0" y="0" width="110" height="9" rx="1" fill="#b45309" stroke="#451a03" strokeWidth="1" />
                <rect x="2" y="1" width="106" height="2" fill="#d97706" />
              </g>
            </g>
          </svg>
        );

      // ═════════════════════════════════════════════════════════════════════════
      // 4. EVAKUASI TERTIB (EVACUATE): SISWA BERDIRI MEMAKAI TAS PELINDUNG KEPALA
      // ═════════════════════════════════════════════════════════════════════════
      case 4:
        return (
          <svg
            viewBox="0 0 360 120"
            className="w-full h-full object-contain"
            shapeRendering="crispEdges"
          >
            {/* Latar Ruang Kelas & Lantai Keramik Menuju Pintu Keluar */}
            <rect x="0" y="0" width="360" height="92" fill="#f8fafc" />
            <rect x="0" y="88" width="360" height="4" fill="#78350f" />
            <rect x="0" y="92" width="360" height="28" fill="#e2e8f0" />
            <line x1="0" y1="92" x2="360" y2="92" stroke="#94a3b8" strokeWidth="1" />
            <line x1="45" y1="92" x2="30" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="105" y1="92" x2="90" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="165" y1="92" x2="150" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="225" y1="92" x2="210" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="285" y1="92" x2="270" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="345" y1="92" x2="330" y2="120" stroke="#cbd5e1" strokeWidth="1" />

            <g transform="translate(18, -10) scale(1.32)">
              {/* ── PINTU KELUAR RUANG KELAS TERBUKA MENUJU TITIK KUMPUL (SISI KANAN) ── */}
              <g transform="translate(148, 8)">
                {/* Kusen Pintu Kayu Jati */}
                <rect x="0" y="0" width="46" height="76" fill="#78350f" stroke="#451a03" strokeWidth="1" />

                {/* Rambu Hijau Darurat Evakuasi Tanpa Tulisan (Ikon Orang Lari & Panah Putih) */}
                <rect x="6" y="4" width="34" height="12" rx="2" fill="#16a34a" stroke="#15803d" strokeWidth="1" />
                {/* Sosok Siluet Putih Orang Berlari di Rambu */}
                <circle cx="16" cy="9" r="1.5" fill="#ffffff" />
                <rect x="15" y="11" width="3" height="3" fill="#ffffff" />
                <rect x="18" y="11" width="2" height="2" fill="#ffffff" />
                <rect x="14" y="14" width="2" height="2" fill="#ffffff" />
                {/* Panah Putih Keluar ➔ */}
                <rect x="25" y="9" width="7" height="2" fill="#ffffff" />
                <polygon points="32,7 36,10 32,13" fill="#ffffff" />

                {/* Bukaan Pintu Keluar dengan Cahaya Koridor Terang */}
                <rect x="4" y="18" width="38" height="58" fill="#bae6fd" />
                <rect x="4" y="18" width="10" height="58" fill="#7dd3fc" />
                <rect x="4" y="66" width="38" height="10" fill="#e2e8f0" />
              </g>

              {/* ── KARAKTER SISWA SMP 2D PIXEL: BERJALAN TERTIB MELINDUNGI KEPALA DENGAN TAS ── */}
              <g transform="translate(74, 18)">
                {/* Bayangan Siswa Melangkah di Lantai */}
                <ellipse cx="20" cy="66" rx="16" ry="4" fill="#0f172a" opacity="0.25" />

                {/* Kaki Belakang (Melangkah Celana Biru SMP & Sepatu) */}
                <rect x="8" y="48" width="6" height="16" fill="#172554" />
                <rect x="6" y="64" width="8" height="4" fill="#0f172a" />
                <rect x="6" y="67" width="8" height="1" fill="#ffffff" />

                {/* Kaki Depan (Melangkah Maju Menuju Pintu) */}
                <rect x="20" y="48" width="6" height="16" fill="#1e3a8a" />
                <rect x="22" y="64" width="8" height="4" fill="#0f172a" />
                <rect x="22" y="67" width="8" height="1" fill="#ffffff" />

                {/* Pinggul & Sabuk Siswa SMP */}
                <rect x="10" y="44" width="16" height="5" fill="#1e3a8a" />
                <rect x="10" y="44" width="16" height="2" fill="#0f172a" />
                <rect x="16" y="44" width="3" height="2" fill="#cbd5e1" />

                {/* Tubuh Tegak Berbusana Kemeja Putih Seragam SMP */}
                <rect x="10" y="24" width="16" height="20" fill="#ffffff" />
                <rect x="10" y="38" width="16" height="6" fill="#cbd5e1" />
                {/* Dasi Biru SMP */}
                <rect x="17" y="26" width="3" height="10" fill="#1e3a8a" />
                {/* Badge OSIS */}
                <rect x="12" y="28" width="2" height="3" fill="#1e3a8a" />

                {/* Kepala Siswa Terlindungi di Bawah Tas Ransel */}
                <rect x="13" y="16" width="11" height="10" fill="#f5af7e" />
                {/* Mata Siswa Menatap Tenang ke Depan */}
                <rect x="20" y="18" width="2" height="2" fill="#0f172a" />
                <rect x="21" y="18" width="1" height="1" fill="#ffffff" />
                {/* Rambut Siswa Rapi */}
                <rect x="12" y="15" width="12" height="4" fill="#0f172a" />
                <rect x="11" y="15" width="3" height="7" fill="#0f172a" />

                {/* TAS RANSEL MERAH DIANGKAT DI ATAS KEPALA (PERISAI JATUHAN) */}
                <rect x="2" y="0" width="30" height="14" rx="2" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
                <rect x="6" y="3" width="22" height="3" fill="#facc15" />
                <rect x="10" y="9" width="14" height="2" fill="#7f1d1d" />

                {/* Kedua Tangan Memegang Erat Sisi Kiri & Kanan Tas di Atas Kepala */}
                <rect x="4" y="12" width="6" height="4" fill="#f5af7e" />
                <rect x="24" y="12" width="6" height="4" fill="#f5af7e" />

                {/* Lengan Kiri & Kanan Terangkat Menopang Tas */}
                <rect x="6" y="16" width="5" height="12" fill="#ffffff" />
                <rect x="23" y="16" width="5" height="12" fill="#ffffff" />
              </g>

              {/* Jejak Kaki Panah Hijau Halus di Lantai Menuju Pintu */}
              <g transform="translate(116, 92)" fill="#16a34a" opacity="0.8">
                <polygon points="0,4 6,2 6,6" />
                <polygon points="12,4 18,2 18,6" />
                <polygon points="24,4 30,2 30,6" />
              </g>
            </g>
          </svg>
        );
    }
  };

  const currentCard = cards.find((c) => c.id === activeTab)!;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-1.5 sm:p-2.5 font-pixel bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 select-none">
      {/* 1. Switcher 4 Tombol Tab di Bagian Paling Atas */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 pb-1.5 sm:pb-2 shrink-0 z-10">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => {
              retroAudio.playSelect?.();
              setActiveTab(card.id);
            }}
            className={`px-2 py-2 sm:py-2.5 rounded-xl border-2 text-[14px] sm:text-[13px] md:text-[15px] font-pixel-title cursor-pointer transition-all active:translate-y-0.5 flex items-center justify-center gap-1.5 sm:gap-2 ${activeTab === card.id
              ? 'bg-amber-400 text-slate-950 border-amber-200 font-bold shadow-[0_3px_0_#92400e]'
              : 'bg-slate-800/95 text-slate-300 border-slate-700 hover:border-amber-400 hover:text-white'
              }`}
          >
            <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${card.badgeBg} shrink-0`} />
            <span className="truncate">{card.tabTitle}</span>
          </button>
        ))}
      </div>

      {/* 2. Kartu Penuh Mengisi Seluruh Kotak (Full Frame) */}
      <div className="w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full bg-white rounded-2xl border-3 sm:border-4 border-[#facc15] shadow-2xl p-3 sm:p-4 md:p-5 flex flex-col items-center justify-between text-center animate-fadeIn relative">
          {/* Header: Nomor Urut Badge & Judul Kartu Resmi Poster */}
          <div className="w-full flex items-center justify-center gap-2.5 mb-1 sm:mb-2 shrink-0">
            <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-400 text-slate-950 font-pixel-title text-[15px] sm:text-base md:text-lg font-bold flex items-center justify-center border-2 border-amber-500 shadow-sm shrink-0">
              {currentCard.id}
            </span>
            <h3 className="font-extrabold text-[#0f172a] text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-wider uppercase font-sans">
              {currentCard.title}
            </h3>
          </div>

          {/* Ilustrasi Vektor Siluet Realistis (Memenuhi Kotak Secara Penuh & Jelas) */}
          <div className="w-full flex-1 min-h-0 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-amber-300/80 bg-[#f8fafc] shadow-inner flex items-center justify-center my-1.5 sm:my-2 relative">
            {renderCardGraphic(currentCard.id, false)}
          </div>

          {/* Teks Penjelasan Edukasi Baku (Font Jauh Lebih Besar, Jelas & Berbobot) */}
          <div className="w-full bg-gradient-to-r from-amber-50 via-amber-100/90 to-amber-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border-2 border-amber-400 shrink-0 shadow-sm">
            <p className="text-[15px] sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#0f172a] leading-relaxed font-sans font-bold text-center">
              {currentCard.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: 4 STATUS TINGKAT AKTIVITAS PVMBG & KRB (AREA 4 TEMUAN 1)
// Desain 100% Selaras Screenshot 2: Normal (tanpa asap), Waspada (asap putih),
// Siaga (asap abu-abu gelap), Awas (magma & lava pijar + awan letusan masif)
// ═════════════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: PROSEDUR KESELAMATAN & MEDIS PASCABENCANA (AREA 3 MODUL 1)
// Diselaraskan 100% dengan Buku Saku BNPB: Waspada Susulan, Utilitas, P3K, & Tandu
// ═════════════════════════════════════════════════════════════════════════════
export function EarthquakePostSafetyIllustration() {
  const [activeTab, setActiveTab] = useState<'susulan' | 'utilitas' | 'p3k' | 'tandu'>('susulan');

  const tabDetails = {
    susulan: {
      title: 'WASPADA GEMPA SUSULAN (AFTERSHOCK)',
      badge: 'BAHAYA LANJUTAN',
      color: '#f97316',
      desc: 'Gempa susulan sering terjadi beberapa menit hingga beberapa hari setelah gempa utama. Gedung yang sudah retak sangat rapuh dan dapat roboh tiba-tiba. Tetaplah berada di ruang terbuka dan jangan pernah kembali ke dalam gedung sebelum ada izin tim ahli!',
    },
    utilitas: {
      title: 'PEMUTUSAN SAKELAR LISTRIK & GAS',
      badge: 'PENCEGAHAN KEBAKARAN',
      color: '#eab308',
      desc: 'Guncangan gempa sering merusak kabel instalasi dan mematahkan sambungan pipa gas. Segera matikan MCB utama listrik dan tutup rapat katup tabung gas/kompor untuk mencegah terjadinya kebakaran sekunder pascabencana.',
    },
    p3k: {
      title: 'PERTOLONGAN PERTAMA P3K & LUKA RINGAN',
      badge: 'PENANGANAN MEDIS',
      color: '#ef4444',
      desc: 'Lakukan pembersihan luka lecet dan gores menggunakan cairan antiseptik steril, lalu balut dengan kasa bersih. Berikan air minum kepada korban yang syok ringan dan pastikan kotak P3K tersedia di posko darurat.',
    },
    tandu: {
      title: 'PROSEDUR TANDU & LARANGAN MEMINDAHKAN KORBAN',
      badge: 'STANDAR MEDIS KRUSIAL',
      color: '#3b82f6',
      desc: 'JANGAN PERNAH memindahkan atau menggeser korban yang dicurigai mengalami cedera tulang leher, tulang belakang, atau patah tulang berat sendirian tanpa tandu darurat dan pendampingan tim medis. Salah mengangkat dapat menyebabkan kelumpuhan permanen!',
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 font-pixel">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 border-b border-slate-800">
        <span className="text-[13px] sm:text-[15px] font-pixel-title text-amber-400 font-bold flex items-center gap-1.5">
          <PixelIcon name="shield" size={14} />
          SOP KESELAMATAN &amp; MEDIS PASCABENCANA
        </span>
        <span className="text-[13.5px] sm:text-[13px] text-slate-400 font-pixel font-semibold">
          STANDAR BNPB &amp; PMI
        </span>
      </div>

      {/* SVG Canvas Area */}
      <div className="w-full flex-1 flex items-center justify-center p-2">
        <svg viewBox="0 0 540 220" className="w-full h-full object-contain" shapeRendering="crispEdges">
          {/* Background Room/Area */}
          <rect x="0" y="0" width="540" height="220" fill="#0b0f19" />
          <rect x="0" y="0" width="540" height="170" fill="#0f172a" />
          <line x1="0" y1="170" x2="540" y2="170" stroke="#1e293b" strokeWidth="2" />
          <rect x="0" y="170" width="540" height="50" fill="#1e293b" />

          {/* 1. VISUAL GEMPA SUSULAN (AFTERSHOCK) */}
          {activeTab === 'susulan' && (
            <g transform="translate(30, 20)">
              {/* Gedung Retak Berbahaya */}
              <rect x="20" y="10" width="140" height="135" fill="#334155" stroke="#475569" strokeWidth="2" />
              <rect x="35" y="25" width="25" height="30" fill="#64748b" />
              <rect x="75" y="25" width="25" height="30" fill="#64748b" />
              <rect x="115" y="25" width="25" height="30" fill="#64748b" />
              <rect x="35" y="75" width="25" height="30" fill="#64748b" />
              <rect x="75" y="75" width="25" height="30" fill="#64748b" />
              <rect x="115" y="75" width="25" height="30" fill="#64748b" />

              {/* Garis Retakan Merah Bahaya */}
              <path d="M 65 10 L 78 45 L 60 85 L 85 125 L 80 145" stroke="#ef4444" strokeWidth="3" fill="none" />
              <path d="M 120 40 L 105 75 L 125 105" stroke="#ef4444" strokeWidth="2" fill="none" />

              {/* Reruntuhan jatuh di bawah */}
              <rect x="50" y="148" width="12" height="8" fill="#475569" />
              <rect x="90" y="152" width="10" height="6" fill="#64748b" />

              {/* Pita Kuning Peringatan DILARANG MENDEKAT */}
              <rect x="10" y="125" width="160" height="12" fill="#eab308" />
              <line x1="10" y1="131" x2="170" y2="131" stroke="#000000" strokeWidth="2" />

              {/* Panah Evakuasi Menjauh ke Lapangan */}
              <path d="M 185 85 L 215 85 L 215 75 L 235 95 L 215 115 L 215 105 L 185 105 Z" fill="#22c55e" />
              <circle cx="210" cy="50" r="16" fill="#ef4444" opacity="0.2" />
              <text x="210" y="55" fill="#ef4444" fontSize="14" fontWeight="bold" textAnchor="middle">!</text>
            </g>
          )}

          {/* 2. VISUAL PEMUTUSAN LISTRIK & GAS */}
          {activeTab === 'utilitas' && (
            <g transform="translate(30, 20)">
              {/* Panel Box Listrik MCB */}
              <rect x="20" y="15" width="70" height="110" rx="4" fill="#334155" stroke="#64748b" strokeWidth="2" />
              <rect x="28" y="25" width="54" height="45" fill="#1e293b" />
              {/* Sakelar MCB (Posisi OFF ke bawah) */}
              <rect x="42" y="32" width="10" height="30" fill="#475569" />
              <rect x="40" y="44" width="14" height="15" rx="2" fill="#ef4444" />
              <rect x="58" y="32" width="10" height="30" fill="#475569" />
              <rect x="56" y="44" width="14" height="15" rx="2" fill="#ef4444" />
              <text x="55" y="86" fill="#facc15" fontSize="7" fontWeight="bold" textAnchor="middle">MCB: OFF</text>

              {/* Tabung Gas LPG dengan Katup Tertutup */}
              <rect x="110" y="45" width="55" height="80" rx="8" fill="#15803d" stroke="#16a34a" strokeWidth="2" />
              <rect x="125" y="28" width="25" height="17" rx="3" fill="#334155" />
              <circle cx="137" cy="22" r="7" fill="#dc2626" />
              <text x="137" y="95" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">GAS</text>

              {/* Tabung APAR Pemadam Api */}
              <rect x="185" y="35" width="30" height="90" rx="5" fill="#dc2626" stroke="#b91c1c" strokeWidth="2" />
              <rect x="195" y="20" width="10" height="15" fill="#1e293b" />
              <rect x="188" y="16" width="24" height="6" fill="#475569" />
              <text x="200" y="85" fill="#ffffff" fontSize="6.5" fontWeight="bold" textAnchor="middle">APAR</text>
            </g>
          )}

          {/* 3. VISUAL PERTOLONGAN PERTAMA P3K */}
          {activeTab === 'p3k' && (
            <g transform="translate(30, 20)">
              {/* Kotak P3K Terbuka */}
              <rect x="20" y="30" width="100" height="95" rx="6" fill="#dc2626" stroke="#b91c1c" strokeWidth="2" />
              <rect x="25" y="35" width="90" height="85" rx="4" fill="#ef4444" />
              {/* Palang Putih P3K */}
              <rect x="62" y="55" width="16" height="45" fill="#ffffff" />
              <rect x="47" y="70" width="46" height="16" fill="#ffffff" />

              {/* Botol Antiseptik & Kasa */}
              <rect x="135" y="40" width="35" height="75" rx="4" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
              <rect x="145" y="25" width="15" height="15" fill="#e0f2fe" />
              <text x="152" y="80" fill="#ffffff" fontSize="6.5" fontWeight="bold" textAnchor="middle">ANTISEPTIK</text>

              {/* Roll Perban Kasa */}
              <circle cx="205" cy="85" r="26" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="205" cy="85" r="10" fill="#94a3b8" />
              <rect x="195" y="105" width="30" height="12" fill="#f8fafc" stroke="#cbd5e1" />
            </g>
          )}

          {/* 4. VISUAL TANDU MEDIS KESELAMATAN */}
          {activeTab === 'tandu' && (
            <g transform="translate(30, 20)">
              {/* Tandu Medis Lipat (Rescue Stretcher) */}
              <rect x="20" y="75" width="195" height="24" rx="4" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
              <rect x="15" y="82" width="205" height="10" fill="#475569" />
              {/* Kaki Tandu */}
              <rect x="35" y="99" width="6" height="30" fill="#334155" />
              <rect x="190" y="99" width="6" height="30" fill="#334155" />

              {/* Bantal Leher Penopang (Cervical Collar / Head Immobilizer) */}
              <rect x="30" y="65" width="28" height="12" rx="3" fill="#ef4444" />
              {/* Sabuk Pengaman Tubuh (Safety Straps) */}
              <rect x="75" y="73" width="8" height="28" fill="#1e293b" />
              <rect x="135" y="73" width="8" height="28" fill="#1e293b" />

              {/* Tanda Peringatan: JANGAN ANGKAT TANPA TANDU */}
              <rect x="40" y="20" width="160" height="26" rx="4" fill="#ef4444" stroke="#dc2626" strokeWidth="1.5" />
              <text x="120" y="36" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">
                WAJIB TANDU &amp; TIM MEDIS!
              </text>
            </g>
          )}

          {/* Panel Deskripsi Kanan (HTML Responsif, Tidak Akan Terpotong / Over) */}
          <foreignObject x="260" y="10" width="270" height="200">
            <div className="w-full h-full bg-[#111827]/95 border-2 border-slate-700/80 rounded-xl p-3 flex flex-col justify-start overflow-y-auto shadow-md">
              <div className="flex items-center gap-1.5 mb-1.5 shrink-0">
                <span
                  className="px-2 py-0.5 rounded text-[13px] font-bold text-slate-950 uppercase tracking-wider shadow-sm"
                  style={{ backgroundColor: tabDetails[activeTab].color }}
                >
                  {tabDetails[activeTab].badge}
                </span>
              </div>
              <h3 className="text-[13px] sm:text-[15.5px] font-bold text-slate-100 leading-snug font-sans tracking-wide mb-2 shrink-0">
                {tabDetails[activeTab].title}
              </h3>
              <p className="text-[14.5px] sm:text-[15px] text-slate-200 leading-relaxed font-sans font-medium">
                {tabDetails[activeTab].desc}
              </p>
            </div>
          </foreignObject>
        </svg>
      </div>

      {/* Button Switcher Tabs */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
        <button
          onClick={() => setActiveTab('susulan')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'susulan'
            ? 'bg-orange-500 text-slate-950 border-orange-300 font-bold'
            : 'bg-slate-800 text-orange-300 border-slate-700 hover:border-orange-500'
            }`}
        >
          1. GEMPA SUSULAN
        </button>
        <button
          onClick={() => setActiveTab('utilitas')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'utilitas'
            ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
            : 'bg-slate-800 text-amber-300 border-slate-700 hover:border-amber-400'
            }`}
        >
          2. LISTRIK &amp; GAS
        </button>
        <button
          onClick={() => setActiveTab('p3k')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'p3k'
            ? 'bg-rose-500 text-slate-950 border-rose-300 font-bold'
            : 'bg-slate-800 text-rose-300 border-slate-700 hover:border-rose-500'
            }`}
        >
          3. PERTOLONGAN P3K
        </button>
        <button
          onClick={() => setActiveTab('tandu')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'tandu'
            ? 'bg-sky-500 text-slate-950 border-sky-300 font-bold'
            : 'bg-slate-800 text-sky-300 border-slate-700 hover:border-sky-500'
            }`}
        >
          4. PROSEDUR TANDU
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: MANAJEMEN TITIK KUMPUL & KOMUNIKASI RESMI (AREA 3 MODUL 2)
// Diselaraskan 100% dengan Buku Saku BNPB: Lapangan, Presensi, BMKG & Jalur Evakuasi
// ═════════════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN: MANAJEMEN TITIK KUMPUL & KOMUNIKASI RESMI (AREA 3 MODUL 2)
// Diselaraskan 100% dengan Buku Saku BNPB: Lapangan, Presensi, BMKG & Jalur Evakuasi
// ═════════════════════════════════════════════════════════════════════════════
export function EarthquakePostCoordinationIllustration() {
  const [activeTab, setActiveTab] = useState<'lapangan' | 'presensi' | 'bmkg' | 'evakuasi'>('lapangan');

  const tabDetails = {
    lapangan: {
      title: 'ZONA LAPANGAN TERBUKA (TITIK KUMPUL)',
      badge: 'AREA AMAN',
      color: '#22c55e',
      desc: 'Lapangan terbuka adalah lokasi paling ideal sebagai titik kumpul pasca-evakuasi gempa bumi. Area ini bebas dari ancaman tertimpa reruntuhan genteng, kaca jendela pecah, pohon tumbang, serta kabel dan tiang listrik yang putus.',
    },
    presensi: {
      title: 'PRESENSI & PENDATAAN WARGA SEKOLAH',
      badge: 'MANAJEMEN KELAS',
      color: '#3b82f6',
      desc: 'Setibanya di titik kumpul, ketua regu PMR/OSIS dan wali kelas segera melakukan absensi menyeluruh. Jika ada rekan yang belum tiba atau tertinggal di dalam gedung, segera laporkan ke tim SAR/BPBD tanpa mencoba masuk kembali sendiri!',
    },
    bmkg: {
      title: 'INFORMASI RESMI BMKG & KANAL BPBD',
      badge: 'SUMBER TERPERCAYA',
      color: '#f59e0b',
      desc: 'Hanya dengarkan siaran resmi dari BMKG (Badan Meteorologi, Klimatologi, dan Geofisika) serta BPBD setempat melalui radio siaran darurat atau aplikasi resmi. Jangan menyebarkan informasi kabar burung atau pesan berantai hoaks yang menimbulkan kepanikan!',
    },
    evakuasi: {
      title: 'JALUR EVAKUASI LANJUTAN & AMBULANS',
      badge: 'LOGISTIK TRANSIT',
      color: '#ec4899',
      desc: 'Tetap berada di lapangan hingga pihak berwenang membuka jalur evakuasi akhir. Pasien yang terluka parah akan dirujuk menggunakan ambulans posko, sedangkan siswa yang sehat menunggu konfirmasi penjemputan aman oleh orang tua.',
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 font-pixel">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between px-2 pb-1.5 border-b border-slate-800">
        <span className="text-[13px] sm:text-[15px] font-pixel-title text-emerald-400 font-bold flex items-center gap-1.5">
          <PixelIcon name="shield" size={14} />
          MANAJEMEN TITIK KUMPUL &amp; INFORMASI RESMI
        </span>
        <span className="text-[13.5px] sm:text-[13px] text-slate-400 font-pixel font-semibold">
          STANDAR BNPB &amp; BMKG
        </span>
      </div>

      {/* SVG Canvas Area */}
      <div className="w-full flex-1 flex items-center justify-center p-2">
        <svg viewBox="0 0 540 220" className="w-full h-full object-contain" shapeRendering="crispEdges">
          {/* Background */}
          <rect x="0" y="0" width="540" height="220" fill="#0b0f19" />
          <rect x="0" y="0" width="540" height="170" fill="#0f172a" />
          <line x1="0" y1="170" x2="540" y2="170" stroke="#1e293b" strokeWidth="2" />
          <rect x="0" y="170" width="540" height="50" fill="#1e293b" />

          {/* 1. VISUAL LAPANGAN TERBUKA (ASSEMBLY POINT) */}
          {activeTab === 'lapangan' && (
            <g transform="translate(30, 20)">
              {/* Lapangan Hijau & Paving */}
              <rect x="15" y="70" width="220" height="85" rx="6" fill="#15803d" stroke="#16a34a" strokeWidth="2" />
              <rect x="25" y="80" width="200" height="65" fill="#166534" />

              {/* Rambu Hijau Titik Kumpul Resmi */}
              <rect x="110" y="15" width="40" height="40" rx="3" fill="#15803d" stroke="#ffffff" strokeWidth="2" />
              <rect x="127" y="55" width="6" height="35" fill="#64748b" />
              {/* Ikon 4 Panah ke Tengah */}
              <path d="M 116 21 L 123 27 M 144 21 L 137 27 M 116 49 L 123 43 M 144 49 L 137 43" stroke="#ffffff" strokeWidth="2" />
              <circle cx="130" cy="35" r="4" fill="#ffffff" />

              {/* Rerumputan & Siluet Murid Berkumpul Tertib di Lapangan */}
              <circle cx="65" cy="100" r="4" fill="#86efac" />
              <rect x="62" y="104" width="6" height="12" fill="#86efac" rx="1" />

              <circle cx="95" cy="98" r="4.5" fill="#86efac" />
              <rect x="91" y="103" width="8" height="14" fill="#86efac" rx="1" />

              <circle cx="125" cy="102" r="4" fill="#86efac" />
              <rect x="122" y="106" width="6" height="11" fill="#86efac" rx="1" />

              <circle cx="160" cy="99" r="4.5" fill="#86efac" />
              <rect x="156" y="104" width="8" height="13" fill="#86efac" rx="1" />
            </g>
          )}

          {/* 2. VISUAL PRESENSI & MEGAPHONE */}
          {activeTab === 'presensi' && (
            <g transform="translate(30, 20)">
              {/* Clipboard Papan Presensi */}
              <rect x="20" y="20" width="95" height="130" rx="6" fill="#78350f" stroke="#451a03" strokeWidth="2" />
              <rect x="52" y="12" width="30" height="15" rx="3" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />
              <rect x="26" y="30" width="83" height="112" rx="2" fill="#f8fafc" />

              {/* Baris Nama Siswa & Centang Hijau */}
              <line x1="34" y1="45" x2="80" y2="45" stroke="#475569" strokeWidth="2" />
              <path d="M 90 44 L 94 48 L 102 38" stroke="#16a34a" strokeWidth="2" fill="none" />

              <line x1="34" y1="65" x2="80" y2="65" stroke="#475569" strokeWidth="2" />
              <path d="M 90 64 L 94 68 L 102 58" stroke="#16a34a" strokeWidth="2" fill="none" />

              <line x1="34" y1="85" x2="80" y2="85" stroke="#475569" strokeWidth="2" />
              <path d="M 90 84 L 94 88 L 102 78" stroke="#16a34a" strokeWidth="2" fill="none" />

              <line x1="34" y1="105" x2="80" y2="105" stroke="#475569" strokeWidth="2" />
              <path d="M 90 104 L 94 108 L 102 98" stroke="#16a34a" strokeWidth="2" fill="none" />

              {/* Megaphone TOA Komando */}
              <g transform="translate(130, 60)">
                <path d="M 20 20 L 70 5 L 70 55 L 20 40 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
                <rect x="5" y="24" width="16" height="12" rx="2" fill="#dc2626" />
                <path d="M 10 36 L 5 56 L 15 56 L 18 36 Z" fill="#334155" />
                <ellipse cx="70" cy="30" rx="6" ry="25" fill="#dc2626" />
                <text x="45" y="33" fill="#dc2626" fontSize="7" fontWeight="bold">TOA</text>
              </g>
            </g>
          )}

          {/* 3. VISUAL RADIO & MONITOR RESMI BMKG */}
          {activeTab === 'bmkg' && (
            <g transform="translate(30, 20)">
              {/* Monitor Seismik Digital BMKG */}
              <rect x="20" y="25" width="125" height="85" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <rect x="26" y="31" width="113" height="73" rx="3" fill="#0f172a" />
              {/* Gelombang Seismik Kuning */}
              <path d="M 32 68 L 55 68 L 60 45 L 66 90 L 72 50 L 78 78 L 84 65 L 130 68" stroke="#facc15" strokeWidth="2" fill="none" />
              <text x="32" y="42" fill="#38bdf8" fontSize="7" fontWeight="bold">BMKG: RESMI</text>
              <text x="32" y="98" fill="#4ade80" fontSize="6.5">STATUS: AMAN</text>

              {/* Radio Siaran Darurat Portabel */}
              <rect x="160" y="45" width="75" height="70" rx="5" fill="#334155" stroke="#475569" strokeWidth="2" />
              {/* Antena Radio */}
              <line x1="170" y1="45" x2="160" y2="15" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="160" cy="15" r="3" fill="#ef4444" />
              {/* Speaker Grill */}
              <circle cx="185" cy="80" r="18" fill="#1e293b" />
              <line x1="172" y1="80" x2="198" y2="80" stroke="#475569" strokeWidth="1.5" />
              <line x1="175" y1="74" x2="195" y2="74" stroke="#475569" strokeWidth="1.5" />
              <line x1="175" y1="86" x2="195" y2="86" stroke="#475569" strokeWidth="1.5" />
              <rect x="210" y="65" width="18" height="10" fill="#facc15" />
            </g>
          )}

          {/* 4. VISUAL AMBULANS & JALUR EVAKUASI LANJUTAN */}
          {activeTab === 'evakuasi' && (
            <g transform="translate(30, 20)">
              {/* Mobil Ambulans Medis */}
              <rect x="20" y="55" width="116" height="65" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
              <rect x="136" y="75" width="28" height="45" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Kaca Depan Kabin & Kaca Pasien Samping (Presisi Tanpa Menggantung di Udara) */}
              <rect x="100" y="60" width="30" height="18" rx="2" fill="#38bdf8" />
              <rect x="42" y="60" width="46" height="18" rx="2" fill="#38bdf8" />

              {/* Garis Oranye & Merah Tanggap Bencana */}
              <rect x="20" y="90" width="144" height="8" fill="#f97316" />
              <rect x="20" y="98" width="144" height="4" fill="#ef4444" />

              {/* Simbol Palang Biru Ambulans */}
              <rect x="62" y="68" width="6" height="18" fill="#0284c7" />
              <rect x="56" y="74" width="18" height="6" fill="#0284c7" />

              {/* Roda Ambulans */}
              <circle cx="50" cy="120" r="14" fill="#0f172a" />
              <circle cx="50" cy="120" r="5" fill="#94a3b8" />
              <circle cx="128" cy="120" r="14" fill="#0f172a" />
              <circle cx="128" cy="120" r="5" fill="#94a3b8" />

              {/* Lampu Sirine Strobo */}
              <rect x="88" y="47" width="14" height="8" rx="1" fill="#ef4444" />
              <rect x="102" y="47" width="14" height="8" rx="1" fill="#38bdf8" />

              {/* Panah Rambu Jalur Evakuasi Hijau */}
              <rect x="180" y="60" width="55" height="45" rx="4" fill="#15803d" stroke="#22c55e" strokeWidth="2" />
              <path d="M 190 82 L 210 82 L 210 75 L 225 82 L 210 90 L 210 82 Z" fill="#ffffff" />
              <text x="207" y="73" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">POSKO</text>
            </g>
          )}

          {/* Panel Deskripsi Kanan (HTML Responsif, Tidak Akan Terpotong / Over) */}
          <foreignObject x="260" y="10" width="270" height="200">
            <div className="w-full h-full bg-[#111827]/95 border-2 border-slate-700/80 rounded-xl p-3 flex flex-col justify-start overflow-y-auto shadow-md">
              <div className="flex items-center gap-1.5 mb-1.5 shrink-0">
                <span
                  className="px-2 py-0.5 rounded text-[13px] font-bold text-slate-950 uppercase tracking-wider shadow-sm"
                  style={{ backgroundColor: tabDetails[activeTab].color }}
                >
                  {tabDetails[activeTab].badge}
                </span>
              </div>
              <h3 className="text-[13px] sm:text-[15.5px] font-bold text-slate-100 leading-snug font-sans tracking-wide mb-2 shrink-0">
                {tabDetails[activeTab].title}
              </h3>
              <p className="text-[14.5px] sm:text-[15px] text-slate-200 leading-relaxed font-sans font-medium">
                {tabDetails[activeTab].desc}
              </p>
            </div>
          </foreignObject>
        </svg>
      </div>

      {/* Button Switcher Tabs */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
        <button
          onClick={() => setActiveTab('lapangan')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'lapangan'
            ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-bold'
            : 'bg-slate-800 text-emerald-300 border-slate-700 hover:border-emerald-500'
            }`}
        >
          1. ZONA LAPANGAN
        </button>
        <button
          onClick={() => setActiveTab('presensi')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'presensi'
            ? 'bg-sky-500 text-slate-950 border-sky-300 font-bold'
            : 'bg-slate-800 text-sky-300 border-slate-700 hover:border-sky-500'
            }`}
        >
          2. PRESENSI KELAS
        </button>
        <button
          onClick={() => setActiveTab('bmkg')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'bmkg'
            ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
            : 'bg-slate-800 text-amber-300 border-slate-700 hover:border-amber-400'
            }`}
        >
          3. INFO BMKG RESMI
        </button>
        <button
          onClick={() => setActiveTab('evakuasi')}
          className={`px-2 py-2 rounded-lg border-2 text-[13px] sm:text-[14.5px] font-pixel-title cursor-pointer transition-all ${activeTab === 'evakuasi'
            ? 'bg-pink-500 text-slate-950 border-pink-300 font-bold'
            : 'bg-slate-800 text-pink-300 border-slate-700 hover:border-pink-500'
            }`}
        >
          4. AMBULANS TRANSIT
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-KOMPONEN 15: PASCABENCANA ERUPSI — PENANGANAN ABU VULKANIK & ATAP (BNPB)
// ═════════════════════════════════════════════════════════════════════════════
