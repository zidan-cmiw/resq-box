// ── src/app/Level2/VolcanoPhaseModal.tsx ─────────────────────────────────────
// Modal Popup Transisi 4 Fase Status Gunung Merapi (Normal, Waspada, Siaga, Awas)
// Didesain dengan palet warna Perkamen Krem Hangat & Bingkai Kayu Retro Jati (100% Serasi Discovery Modal)
// Menyediakan ukuran font besar, keterbacaan tinggi, serta poin edukasi mitigasi resmi BNPB/PVMBG.

import React from 'react';
import { retroAudio } from '../../utils/retroAudio';
import PixelIcon from '../../components/PixelIcon';

export type VolcanoPhaseType = 'NORMAL' | 'WASPADA' | 'SIAGA' | 'AWAS';

interface VolcanoPhaseModalProps {
  phase: VolcanoPhaseType;
  scenario?: 'explosive' | 'effusive';
  onContinue: () => void;
}

export const VolcanoPhaseModal: React.FC<VolcanoPhaseModalProps> = ({
  phase,
  scenario = 'explosive',
  onContinue,
}) => {
  const handleProceed = () => {
    retroAudio.playSelect();
    onContinue();
  };

  const getPhaseData = () => {
    switch (phase) {
      case 'NORMAL':
        return {
          pill: '▼ STATUS GUNUNG API: FASE I ▼',
          title: 'FASE 1: STATUS NORMAL (LEVEL I)',
          subtitle: 'KONDISI GUNUNG MERAPI TENANG TANPA GEJALA AKTIVITAS VULKANIK MENONJOL',
          characteristics: [
            'Tidak terdeteksi aktivitas magma yang membahayakan',
            'Gunung tidak mengeluarkan asap pekat / abu vulkanik',
            'Aktivitas masyarakat, pertanian, dan pariwisata berjalan normal',
            'Pemandangan alam lereng Merapi asri, sejuk, dan damai',
          ],
          actionTitle: 'Apa yang Harus Dilakukan?',
          actionItems: [
            'Menikmati keindahan alam lereng gunung dengan tenang',
            'Mengenali jalur evakuasi dan rambu-rambu kebencanaan',
            'Tetap memantau informasi resmi berkala dari pos PGA / PVMBG',
          ],
          buttonText: 'LIHAT KONDISI GUNUNG',
        };

      case 'WASPADA':
        return {
          pill: '▼ PERINGATAN DINI BPBD & PVMBG: FASE II ▼',
          title: 'FASE 2: STATUS WASPADA (LEVEL II)',
          subtitle: 'TERJADI PENINGKATAN SUHU, GEMPA RINGAN, DAN KELUARNYA ASAP DARI KAWAH',
          characteristics: [
            'Terdeteksi gempa vulkanik ringan berulang kali',
            'Peningkatan suhu kawah dan sumber mata air panas lereng',
            'Asap solfatara putih mulai mengepul keluar dari kubah kawah',
            'Aktivitas magma mulai bergerak naik menuju permukaan',
          ],
          actionTitle: 'Apa yang Harus Dilakukan?',
          actionItems: [
            'Menjauh dari area lereng sejauh minimal 2 kilometer',
            'Melakukan edukasi peringatan dini kepada seluruh warga dusun',
            'Tetap tenang, tidak panik, dan mulai bersiap siaga',
          ],
          buttonText: 'EVAKUASI SEJAUH 2 KILOMETER',
        };

      case 'SIAGA':
        return {
          pill: '▼ PERINGATAN DARURAT BPBD & PVMBG: FASE III ▼',
          title: 'FASE 3: STATUS SIAGA (LEVEL III)',
          subtitle: 'DENTUMAN KECIL, ASAP PEKAT, HEWAN TURUN GUNUNG & DAUN MULAI LAYU',
          characteristics: [
            'Gempa vulkanik terasa beberapa kali & terdengar dentuman kecil',
            'Asap mengepul tebal kehitaman membubung tinggi dari puncak',
            'Hewan liar lereng (burung, rusa, kera, macan) bermigrasi turun panik',
            'Dedaunan pohon layu kekeringan & kehadiran hujan abu tipis',
            'Seluruh jalur pendakian ditutup total demi keselamatan',
          ],
          actionTitle: 'Apa yang Harus Dilakukan?',
          actionItems: [
            'Mulai mempersiapkan tas siaga bencana (dokumen, obat, senter)',
            'Memakai masker pelindung pernapasan (N95 / kain rapat) & goggle',
            'Ikuti arahan resmi radio komunikasi BPBD / berita terkini',
            'Mengungsi / meninggalkan area lebih jauh dalam radius 3–5 kilometer dari puncak',
          ],
          buttonText: 'AMBIL TAS SIAGA & EVAKUASI KE RADIUS 3-5 KM',
        };

      case 'AWAS':
        return {
          pill: '▼ STATUS TERTINGGI: DARURAT BENCANA NASIONAL ▼',
          title: scenario === 'explosive' ? 'FASE 4: STATUS AWAS — LETUSAN EKSPLOSIF' : 'FASE 4: STATUS AWAS — ERUPSI EFUSIF',
          subtitle: scenario === 'explosive'
            ? 'TEKANAN GAS TINGGI MEMICU SEMBURAN KUAT, HUJAN ABU & AWAN PANAS!'
            : 'TEKANAN GAS RENDAH, MAGMA ENCER MENCAIR & ALIRAN LAVA MERAYAP LUAS!',
          characteristics: scenario === 'explosive'
            ? [
                'Getaran gempa besar berkekuatan 4,5 – 5,5 SR merusak bangunan',
                'Letusan eksplosif dahsyat menyemburkan bom piroklastik (eflata) & lava kental',
                'Gumpalan awan panas (wedhus gembel) meluncur cepat menuruni lembah',
                'Hujan abu vulkanik lebat menggelapkan langit siang hari',
              ]
            : [
                'Tekanan gas rendah: Kandungan gas relatif sedikit sehingga tidak memicu ledakan vertikal dahsyat',
                'Magma cair & encer: Sifat magma encer membuat lava mudah mengalir menutupi area yang luas',
                'Minim ledakan: Magma keluar berupa lelehan aliran lava disertai asap tipis yang menyebar mendatar',
                'Getaran gempa vulkanik kecil (tremor menerus) mengiringi desakan lelehan magma ke sungai',
              ],
          actionTitle: 'Apa yang Dilakukan?',
          actionItems: [
            'Mengungsi dengan membawa tas siaga bencana yang telah disiapkan',
            'Membunyikan sirine peringatan dini darurat desa di tiang EWS',
            'Membantu evakuasi kelompok rentan (lansia, anak, ibu hamil)',
            'Naik bersama-sama ke Mobil Evakuasi BPBD menuju Tempat Evakuasi Akhir (TEA)',
          ],
          buttonText: 'BUNYIKAN SIRINE & EVAKUASI BERSAMA WARGA',
        };
    }
  };

  const data = getPhaseData();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md select-none animate-fadeIn font-pixel">
      {/* Box Utama: Palet Perkamen Krem Hangat & Bingkai Kayu Retro Jati */}
      <div className="relative w-full max-w-2xl sm:max-w-3xl bg-[#fef3c7] border-4 sm:border-[5px] border-[#451a03] rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-[0_12px_0_#1c0d02] text-[#451a03] flex flex-col gap-4 sm:gap-5">
        {/* Dekorasi Siku Sudut Kayu Retro (Corner Brackets ┌ ┐ └ ┘) */}
        <div className="absolute top-2 left-2 w-4 sm:w-5 h-4 sm:h-5 border-t-3 border-l-3 border-[#78350f] pointer-events-none" />
        <div className="absolute top-2 right-2 w-4 sm:w-5 h-4 sm:h-5 border-t-3 border-r-3 border-[#78350f] pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-4 sm:w-5 h-4 sm:h-5 border-b-3 border-l-3 border-[#78350f] pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-4 sm:w-5 h-4 sm:h-5 border-b-3 border-r-3 border-[#78350f] pointer-events-none" />

        {/* 1. Header Pill */}
        <div className="text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#78350f] border-2 border-[#451a03] text-amber-50 font-pixel-title text-[13px] sm:text-[15px] font-bold tracking-wider uppercase shadow-sm">
            {data.pill}
          </span>
        </div>

        {/* 2. Judul Fase Besar & Jelas (Font Pixel Title & Subtitle Hangat) */}
        <div className="text-center -mt-1 sm:-mt-2">
          <h2 className="font-pixel-title text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-wide text-[#451a03] drop-shadow-sm">
            {data.title}
          </h2>
          <p className="font-pixel text-[13px] sm:text-[15px] md:text-base font-bold text-[#78350f] mt-1.5 uppercase tracking-wide">
            {data.subtitle}
          </p>
        </div>

        {/* 3. Panel Konten: Karakteristik & Tindakan Mitigasi (Sesuai Gaya Kotak Materi & Fakta Kunci) */}
        <div className="flex flex-col gap-3.5 max-h-[54vh] overflow-y-auto pr-1">
          {/* Karakteristik / Tanda-Tanda Geologis */}
          <div className="bg-[#fef9c3] border-3 border-[#b45309]/60 rounded-2xl p-4 sm:p-5 shadow-sm text-[#291305]">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#b45309] text-amber-50 font-pixel-title text-[13px] sm:text-[15px] font-bold tracking-wider shadow-sm">
                <PixelIcon name="volcano" size={17} className="text-amber-200 shrink-0" />
                <span>CIRI &amp; INDIKATOR GEOLOGIS</span>
              </span>
            </div>
            <ul className="grid grid-cols-1 gap-2.5 font-sans text-[15px] sm:text-base md:text-[19px] text-[#291305] font-semibold leading-relaxed">
              {data.characteristics.map((c, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-[#b45309] shrink-0 font-black text-lg select-none leading-none mt-0.5">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Apa Yang Harus Dilakukan? (Tindakan Mitigasi Berlatar Hangat) */}
          <div className="bg-amber-100/90 border-2 border-[#b45309]/50 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#9a3412] text-amber-50 font-pixel-title text-[13px] sm:text-[15px] font-bold tracking-wider shadow-sm">
                <PixelIcon name="alert" size={17} className="text-amber-200 shrink-0" />
                <span>{data.actionTitle.toUpperCase()}</span>
              </span>
            </div>
            <ul className="grid grid-cols-1 gap-2.5 font-sans text-[15px] sm:text-base md:text-[19px] font-bold leading-snug">
              {data.actionItems.map((act, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 bg-[#fffbeb] px-3.5 py-2.5 rounded-xl border border-[#b45309]/40 shadow-xs text-[#291305]"
                >
                  <PixelIcon name="check" size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4. Tombol Aksi / Lanjut (Kayu Retro Jati Amber Bercahaya) */}
        <div className="flex justify-center pt-1.5 border-t-2 border-[#b45309]/30">
          <button
            onClick={handleProceed}
            className="w-full sm:w-auto px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-50 border-3 sm:border-4 border-[#451a03] shadow-[0_5px_0_#231206] text-[15px] sm:text-base md:text-lg font-pixel-title cursor-pointer active:translate-y-1 flex items-center justify-center gap-2.5 transition-all"
          >
            <PixelIcon name="check" size={18} className="text-amber-200" />
            <span>{data.buttonText}</span>
            <span className="text-lg">➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VolcanoPhaseModal;
