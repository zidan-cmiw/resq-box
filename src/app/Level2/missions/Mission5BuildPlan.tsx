// ── src/app/Level2/missions/Mission5BuildPlan.tsx ────────────────────
// MISI 5: BUILD YOUR MITIGATION PLAN (Perancang Tata Ruang Keselamatan Kota)
// Siswa menempatkan fasilitas mitigasi di peta kota:
// 1. Sirine EWS (dekat zona patahan & lereng)
// 2. Posko Medis Darurat (dekat jalan utama)
// 3. Titik Kumpul Aman (lapangan terbuka)
// 4. Rambu Barikade (menutup jalur dekat jurang lahar)
// Lalu menekan tombol "TEST PLAN" untuk melihat simulasi NPC warga bergerak ke Safe Zone!

import { useState } from 'react';
import PixelIcon from '../../../components/PixelIcon';
import { retroAudio } from '../../../utils/retroAudio';

interface Mission5Props {
  onComplete: (pointsEarned: number, badge?: string) => void;
  isAlreadyCompleted?: boolean;
}

interface FacilitySlot {
  id: string;
  name: string;
  recommendedRole: string;
  assignedType: string | null;
  idealType: string;
}

const FACILITY_SLOTS: FacilitySlot[] = [
  {
    id: 'slot_north_hill',
    name: 'Zona Utara (Kaki Lereng Merapi)',
    recommendedRole: 'Peringatan Dini Suara Nyaring saat Aktivitas Vulkanik Meningkat',
    assignedType: null,
    idealType: 'siren',
  },
  {
    id: 'slot_mid_intersection',
    name: 'Zona Tengah (Simpang Jalan Utama)',
    recommendedRole: 'Pengalihan Lalu Lintas Menjauhi Jalur Patahan Retak',
    assignedType: null,
    idealType: 'barricade',
  },
  {
    id: 'slot_east_clinic',
    name: 'Zona Timur (Dekat Puskesmas)',
    recommendedRole: 'Penanganan Korban Cedera & Pembagian Oksigen / Masker N95',
    assignedType: null,
    idealType: 'medic',
  },
  {
    id: 'slot_south_field',
    name: 'Zona Selatan (Lapangan Terbuka)',
    recommendedRole: 'Pusat Berkumpul Ribuan Warga Bebas Runtuhan Gedung & Pohon',
    assignedType: null,
    idealType: 'safe_zone',
  },
];

const AVAILABLE_ITEMS = [
  { id: 'siren', name: 'Sirine EWS (Peringatan Dini)', desc: 'Alarm berkekuatan 120 dB yang dapat didengar radius 5 km.' },
  { id: 'barricade', name: 'Rambu Barikade & Jalur Alternatif', desc: 'Menutup jalan yang terancam retakan sesar tektonik.' },
  { id: 'medic', name: 'Pos Medis & Tenda Triase P3K', desc: 'Tempat penanganan cepat korban sebelum dirujuk ke RS.' },
  { id: 'safe_zone', name: 'Titik Kumpul Lapangan Aman', desc: 'Area luas berumput bebas bahaya listrik dan kaca gedung.' },
];

export default function Mission5BuildPlan({ onComplete, isAlreadyCompleted = false }: Mission5Props) {
  const [slots, setSlots] = useState<FacilitySlot[]>(FACILITY_SLOTS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<{
    totalResidents: number;
    safeCount: number;
    delayedCount: number;
    scorePercent: number;
  } | null>(null);

  const handleAssignItem = (slotId: string, itemType: string) => {
    retroAudio.playSelect();
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, assignedType: itemType } : s))
    );
    setSimResult(null);
  };

  const handleTestPlan = () => {
    retroAudio.playPowerup();
    setIsSimulating(true);

    setTimeout(() => {
      setIsSimulating(false);
      // Count correct placements
      let correctMatches = 0;
      slots.forEach((s) => {
        if (s.assignedType === s.idealType) correctMatches++;
      });

      const totalResidents = 40;
      const safeCount = 28 + correctMatches * 3; // up to 40
      const delayedCount = totalResidents - safeCount;
      const scorePercent = Math.round((safeCount / totalResidents) * 100);

      setSimResult({
        totalResidents,
        safeCount,
        delayedCount,
        scorePercent,
      });

      if (scorePercent >= 80) {
        retroAudio.playWin();
        onComplete(10, 'Safety Planner');
      } else {
        retroAudio.playHover();
      }
    }, 2000);
  };

  const allAssigned = slots.every((s) => Boolean(s.assignedType));

  return (
    <div className="flex flex-col gap-6 text-amber-950 font-pixel">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-amber-100/90 border-2 border-amber-900/40 p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-amber-900 text-amber-100 flex items-center justify-center font-pixel-title text-[13px] font-bold">
            5
          </span>
          <span className="font-pixel-title text-[13px] md:text-[15px] font-bold text-amber-950">
            MISI 5: BUILD YOUR MITIGATION PLAN (TATA RUANG KESELAMATAN KOTA)
          </span>
        </div>
        <span className="px-3 py-1 rounded bg-slate-800 text-amber-300 font-pixel-title text-[13.5px] font-semibold">
          SIMULASI EVAKUASI WARGA (NPC)
        </span>
      </div>

      {/* Narrative Explanation */}
      <div className="bg-amber-950/5 border-2 border-amber-900/30 rounded-2xl p-4">
        <h3 className="text-[13px] md:text-[15px] font-bold text-amber-950 mb-1 flex items-center gap-2">
          <PixelIcon name="map" size={18} />
          <span>Rancang Tata Letak Fasilitas Mitigasi Bencana</span>
        </h3>
        <p className="text-[14.5px] text-amber-900 leading-relaxed font-semibold">
          Sebagai Chief Disaster Analyst, rancang posisi 4 fasilitas keselamatan di titik strategis Disaster City.
          Setelah selesai, jalankan <strong>TEST PLAN</strong> untuk mensimulasikan rute evakuasi 40 warga menuju Titik Kumpul Aman!
        </p>
      </div>

      {/* Grid of 4 City Zones / Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {slots.map((slot) => {
          return (
            <div
              key={slot.id}
              className="p-4 rounded-xl border-2 border-amber-900/30 bg-amber-50/90 flex flex-col justify-between"
            >
              <div>
                <span className="text-[13px] font-bold text-amber-950 block mb-1">{slot.name}</span>
                <p className="text-[13.5px] text-amber-800 mb-3 italic font-semibold">Tugas: {slot.recommendedRole}</p>

                {/* Assigned item badge */}
                <div className="p-2.5 rounded-lg bg-white border border-amber-900/20 mb-3">
                  <span className="text-[13.5px] text-slate-500 font-bold block mb-0.5">Fasilitas Terpasang:</span>
                  <span className="text-[13px] font-bold text-amber-950">
                    {slot.assignedType ? (
                      AVAILABLE_ITEMS.find((i) => i.id === slot.assignedType)?.name
                    ) : (
                      <span className="text-rose-700 italic">[Belum Ditentukan]</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Selector buttons */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-amber-900/10">
                <span className="text-[12.5px] text-amber-900 font-bold self-center">Pilih:</span>
                {AVAILABLE_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleAssignItem(slot.id, item.id)}
                    className={`px-2 py-1 rounded text-[12.5px] font-bold transition-all cursor-pointer ${
                      slot.assignedType === item.id
                        ? 'bg-amber-900 text-white shadow'
                        : 'bg-amber-200 hover:bg-amber-300 text-amber-950'
                    }`}
                  >
                    {item.name.split(' ')[0]} {item.name.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulation Result Modal */}
      {simResult && (
        <div className="p-4 rounded-xl bg-slate-950 border-2 border-amber-500 text-slate-100 animate-fade-in space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-pixel-title text-[13px] text-amber-400 font-bold">
              HASIL EVALUASI SIMULASI EVAKUASI KOTA (TEST PLAN RESULT)
            </span>
            <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-pixel-title text-[13.5px] font-bold border border-amber-500/40">
              SKOR MITIGASI: {simResult.scorePercent}%
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[13.5px] text-slate-400 block font-semibold">Total Warga Terancam</span>
              <span className="text-base font-bold text-slate-100">{simResult.totalResidents} Warga</span>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-950 border border-emerald-500/40">
              <span className="text-[13.5px] text-emerald-400 block font-semibold">Berhasil Mencapai Safe Zone</span>
              <span className="text-base font-bold text-emerald-300">✓ {simResult.safeCount} Warga</span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-950 border border-amber-500/40">
              <span className="text-[13.5px] text-amber-400 block font-semibold">Mengalami Keterlambatan</span>
              <span className="text-base font-bold text-amber-300">{simResult.delayedCount} Warga</span>
            </div>
          </div>

          <p className="text-[14.5px] text-slate-300 font-semibold">
            {simResult.scorePercent >= 80
              ? 'Luar biasa! Penempatan fasilitas mitigasi sangat strategis. Sebagian besar warga berhasil menyelamatkan diri sebelum bahaya melanda.'
              : 'Tata letak fasilitas masih menyisakan titik rawan. Evaluasi kembali penempatan sirine EWS di dekat lereng dan pos medis di dekat jalur utama!'}
          </p>
        </div>
      )}

      {/* Footer Action */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-[13px] text-amber-900 font-bold">
          Kelengkapan Fasilitas: {slots.filter((s) => Boolean(s.assignedType)).length} / 4 Terpasang
        </span>

        <div className="flex items-center gap-3">
          <button aria-label="Uji rencana mitigasi"
            onClick={handleTestPlan}
            disabled={!allAssigned || isSimulating}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-pixel-title font-bold border-2 border-amber-950 shadow-[0_4px_0_#78350f] cursor-pointer flex items-center gap-2 active:translate-y-0.5"
          >
            {isSimulating ? (
              <>
                <span className="material-symbols-outlined text-[15px] animate-spin font-semibold">sync</span>
                <span>MENJALANKAN SIMULASI NPC...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[15px] font-semibold">play_arrow</span>
                <span>TEST PLAN (SIMULASIKAN EVAKUASI)</span>
              </>
            )}
          </button>

          {isAlreadyCompleted && (
            <span className="px-4 py-2 rounded-xl bg-emerald-100 border border-emerald-500 text-emerald-800 text-[13px] font-bold">
              ✓ MISI 5 SELESAI (+10 RP)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
