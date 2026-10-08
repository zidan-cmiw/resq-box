// ── src/app/Level2/missions/Mission2Before.tsx ────────────────────────
// MISI 2: BEFORE DISASTER (Mitigasi & Kesiapsiagaan Pra-Bencana)
// Aktivitas:
// 1. Packing Tas Siaga Bencana (72-Hour Emergency Bag)
// 2. Timeline Mitigasi Pra-Bencana: [Kesiapsiagaan] → [Peringatan Dini] → [Pra-Evakuasi]

import { useState } from 'react';
import PixelIcon from '../../../components/PixelIcon';
import { retroAudio } from '../../../utils/retroAudio';

interface Mission2Props {
  onComplete: (pointsEarned: number, badge?: string) => void;
  isAlreadyCompleted?: boolean;
}

interface GoBagItem {
  id: string;
  name: string;
  icon: string;
  isEssential: boolean;
  reason: string;
}

const GO_BAG_ITEMS: GoBagItem[] = [
  { id: 'p3k', name: 'Kotak P3K & Obat', icon: 'shield', isEssential: true, reason: 'Penting untuk penanganan luka darurat saat terjadi reruntuhan gempa.' },
  { id: 'flashlight', name: 'Senter & Baterai', icon: 'bulb', isEssential: true, reason: 'Sumber penerangan saat jaringan listrik PLN padam mendadak.' },
  { id: 'water', name: 'Air Minum Kemasan', icon: 'water', isEssential: true, reason: 'Kebutuhan cairan tubuh paling krusial untuk bertahan 72 jam pertama.' },
  { id: 'food', name: 'Ransum Biskuit Padat', icon: 'sparkle', isEssential: true, reason: 'Makanan tahan lama tanpa perlu dimasak atau didinginkan.' },
  { id: 'whistle', name: 'Peluit Darurat', icon: 'bell', isEssential: true, reason: 'Alat meminta tolong jika terjebak tanpa menghabiskan energi berteriak.' },
  { id: 'mask', name: 'Masker Respirator N95', icon: 'ash', isEssential: true, reason: 'Melindungi saluran pernapasan dari partikel tajam abu vulkanik Merapi.' },
  { id: 'radio', name: 'Radio Saku Baterai', icon: 'broadcast', isEssential: true, reason: 'Mendengarkan instruksi resmi BMKG/BNPB jika sinyal internet seluler mati.' },
  { id: 'documents', name: 'Dokumen Kantong Kedap', icon: 'id-card', isEssential: true, reason: 'Menyimpan identitas, kartu keluarga, dan ijazah agar aman dari air/debu.' },
  // Traps
  { id: 'playstation', name: 'Konsol Game TV', icon: 'dice', isEssential: false, reason: 'Terlalu berat, membutuhkan listrik besar, dan menghambat evakuasi cepat.' },
  { id: 'mattress', name: 'Kasur Busa Tebal', icon: 'door', isEssential: false, reason: 'Sangat besar dan memblokir jalan keluar darurat.' },
];

export default function Mission2Before({ onComplete, isAlreadyCompleted = false }: Mission2Props) {
  const [activeTab, setActiveTab] = useState<'gobag' | 'timeline'>('gobag');

  // Go Bag state
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [bagChecked, setBagChecked] = useState(false);
  const [bagFeedback, setBagFeedback] = useState<string | null>(null);

  // Timeline ordering state
  // Correct order: 0: 'struk', 1: 'ews', 2: 'rute'
  const [timelineSlots, setTimelineSlots] = useState<{ [slotIdx: number]: string }>({});
  const [timelineChecked, setTimelineChecked] = useState(false);

  const toggleItem = (id: string) => {
    retroAudio.playSelect();
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setBagChecked(false);
    setBagFeedback(null);
  };

  const handleCheckBag = () => {
    const essentials = GO_BAG_ITEMS.filter((i) => i.isEssential).map((i) => i.id);
    const nonEssentials = GO_BAG_ITEMS.filter((i) => !i.isEssential).map((i) => i.id);

    const hasAllEssentials = essentials.every((id) => selectedItemIds.includes(id));
    const hasTraps = selectedItemIds.some((id) => nonEssentials.includes(id));

    if (hasAllEssentials && !hasTraps) {
      retroAudio.playPowerup();
      setBagChecked(true);
      setBagFeedback('Sempurna! Seluruh barang di Tas Siaga adalah perlengkapan vital bertahan hidup 72 jam.');
    } else if (hasTraps) {
      retroAudio.playHover();
      setBagChecked(false);
      setBagFeedback('Perhatian: Terdapat barang yang terlalu besar/berat. Barang non-darurat akan menghambat kelincahan evakuasi!');
    } else {
      retroAudio.playHover();
      setBagChecked(false);
      setBagFeedback(`Kamu baru memilih ${selectedItemIds.length} barang. Pastikan seluruh 8 perlengkapan vital darurat terpilih.`);
    }
  };

  const handlePlaceTimeline = (stepId: string, slotIdx: number) => {
    retroAudio.playSelect();
    setTimelineSlots((prev) => ({ ...prev, [slotIdx]: stepId }));
    setTimelineChecked(false);
  };

  const handleVerifyTimeline = () => {
    // Correct timeline:
    // Slot 0 = 'prep' (Kesiapsiagaan Fisik & Bangunan)
    // Slot 1 = 'warning' (Pemantauan Seismograf & Sirine EWS)
    // Slot 2 = 'evac' (Peta Rute Evakuasi & Titik Kumpul)
    const isCorrect =
      timelineSlots[0] === 'prep' &&
      timelineSlots[1] === 'warning' &&
      timelineSlots[2] === 'evac';

    if (isCorrect) {
      retroAudio.playWin();
      setTimelineChecked(true);
      onComplete(20);
    } else {
      retroAudio.playHover();
      alert('Urutan timeline belum tepat. Pikirkan: Persiapan fisik jangka panjang dahulu, lalu sistem peringatan dini, dan penentuan rute evakuasi!');
    }
  };

  return (
    <div className="flex flex-col gap-6 text-amber-950 font-pixel">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-amber-100/90 border-2 border-amber-900/40 p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-amber-900 text-amber-100 flex items-center justify-center font-pixel-title text-[13px] font-bold">
            2
          </span>
          <span className="font-pixel-title text-[13px] md:text-[15px] font-bold text-amber-950">
            MISI 2: BEFORE DISASTER (MITIGASI PRA-BENCANA)
          </span>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => {
              retroAudio.playSelect();
              setActiveTab('gobag');
            }}
            className={`px-3 py-1 rounded-md text-[13.5px] font-pixel-title font-bold transition-all ${
              activeTab === 'gobag'
                ? 'bg-amber-900 text-white shadow'
                : 'bg-amber-200/80 text-amber-900 hover:bg-amber-300'
            }`}
          >
            1. TAS SIAGA 72 JAM
          </button>
          <button
            onClick={() => {
              retroAudio.playSelect();
              setActiveTab('timeline');
            }}
            className={`px-3 py-1 rounded-md text-[13.5px] font-pixel-title font-bold transition-all ${
              activeTab === 'timeline'
                ? 'bg-amber-900 text-white shadow'
                : 'bg-amber-200/80 text-amber-900 hover:bg-amber-300'
            }`}
          >
            2. TIMELINE MITIGASI
          </button>
        </div>
      </div>

      {/* ── SUB-ACTIVITY 1: TAS SIAGA BENCANA (72-HOUR GO-BAG) ── */}
      {activeTab === 'gobag' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-amber-950/5 border-2 border-amber-900/30 rounded-2xl p-4">
            <h3 className="text-[13px] md:text-[15px] font-bold text-amber-950 mb-1 flex items-center gap-2">
              <PixelIcon name="backpack" size={18} />
              <span>Packing Tas Siaga Bencana (Emergency Go-Bag)</span>
            </h3>
            <p className="text-[14.5px] text-amber-900">
              Pilih 8 perlengkapan yang benar-benar vital untuk bertahan hidup mandiri selama 72 jam pertama pasca bencana gempa dan erupsi. Hindari barang berat yang membebani evakuasi!
            </p>
          </div>

          {/* Grid of Item Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {GO_BAG_ITEMS.map((item) => {
              const isSelected = selectedItemIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center text-center transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-950 shadow-[0_3px_0_#451a03] -translate-y-0.5'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-900/30'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-400 text-slate-950 text-[12.5px] font-bold flex items-center justify-center">
                      ✓
                    </span>
                  )}
                  <div className="w-10 h-10 rounded-lg bg-amber-950/10 flex items-center justify-center mb-2">
                    <PixelIcon name={item.icon} size={22} />
                  </div>
                  <span className="font-bold text-[14.5px] leading-tight block">{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback & Verify Button */}
          {bagFeedback && (
            <div
              className={`p-3 rounded-xl border text-[13px] ${
                bagChecked
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                  : 'bg-rose-100 border-rose-500 text-rose-900'
              }`}
            >
              {bagFeedback}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-[13px] text-amber-900 font-bold">
              Item Terpilih: {selectedItemIds.length} / 8 Item Vital
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleCheckBag}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-[13px] font-pixel-title font-bold border-2 border-amber-950 shadow cursor-pointer active:translate-y-0.5"
              >
                PERIKSA ISI TAS SIAGA
              </button>
              {bagChecked && (
                <button
                  onClick={() => {
                    retroAudio.playSelect();
                    setActiveTab('timeline');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-pixel-title font-bold border-2 border-emerald-950 shadow cursor-pointer flex items-center gap-1.5"
                >
                  <span>LANJUT KE TIMELINE</span>
                  <span>&gt;</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── SUB-ACTIVITY 2: TIMELINE MITIGASI PRA-BENCANA ── */}
      {activeTab === 'timeline' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-amber-950/5 border-2 border-amber-900/30 rounded-2xl p-4">
            <h3 className="text-[13px] md:text-[15px] font-bold text-amber-950 mb-1">
              Menyusun Urutan Strategis Mitigasi Pra-Bencana
            </h3>
            <p className="text-[14.5px] text-amber-900">
              Tempatkan kartu strategi berikut ke dalam urutan timeline yang paling logis dan efektif sebelum bencana tiba di Disaster City.
            </p>
          </div>

          {/* Timeline Slots */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { idx: 0, label: 'TAHAP 1: KESIAPSIAGAAN STRUKTURAL' },
              { idx: 1, label: 'TAHAP 2: PERINGATAN DINI GEOLOGIS' },
              { idx: 2, label: 'TAHAP 3: PRA-EVAKUASI & RUTE AMAN' },
            ].map((slot) => {
              const assignedId = timelineSlots[slot.idx];
              return (
                <div
                  key={slot.idx}
                  className="p-4 rounded-xl border-2 border-dashed border-amber-900/40 bg-amber-100/50 flex flex-col items-center justify-center min-h-[140px] text-center"
                >
                  <span className="text-[13.5px] font-pixel-title font-bold text-amber-900 mb-2 block">
                    {slot.label}
                  </span>
                  {assignedId ? (
                    <div className="p-3 rounded-lg bg-amber-900 text-amber-100 border border-amber-950 w-full shadow text-[13px]">
                      <span className="font-bold block">
                        {assignedId === 'prep' && 'Penguatan Bangunan & Tas Siaga'}
                        {assignedId === 'warning' && 'Sensor Seismograf & Sirine EWS'}
                        {assignedId === 'evac' && 'Peta Jalur Evakuasi & Titik Kumpul'}
                      </span>
                      <button
                        onClick={() => {
                          retroAudio.playHover();
                          setTimelineSlots((prev) => {
                            const copy = { ...prev };
                            delete copy[slot.idx];
                            return copy;
                          });
                        }}
                        className="text-[12.5px] text-amber-300 underline mt-1 cursor-pointer block"
                      >
                        [Lepas Kartu]
                      </button>
                    </div>
                  ) : (
                    <span className="text-[13.5px] text-amber-800/60 italic">
                      [Klik tombol aksi di bawah untuk memasukkan kartu]
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Available Action Cards */}
          <div className="p-4 rounded-xl bg-slate-900 border-2 border-amber-900/40 space-y-2">
            <span className="text-[13px] font-bold text-amber-300 block">KARTU TINDAKAN MITIGASI TERSEDIA:</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {[
                {
                  id: 'prep',
                  title: 'Penguatan Konstruksi & Tas Siaga',
                  desc: 'Memperkuat struktur dinding rumah dari retakan gempa serta menyiapkan tas siaga keluarga.',
                },
                {
                  id: 'warning',
                  title: 'Sensor Seismograf & Sirine EWS',
                  desc: 'Memasang sensor seismograf BMKG di zona patahan dan menguji sirine peringatan dini.',
                },
                {
                  id: 'evac',
                  title: 'Peta Jalur Evakuasi & Titik Kumpul',
                  desc: 'Menandai rambu penunjuk arah jalan bebas reruntuhan dan menyepakati lokasi titik kumpul terbuka.',
                },
              ].map((card) => {
                const isAssigned = Object.values(timelineSlots).includes(card.id);
                return (
                  <div
                    key={card.id}
                    className={`p-3 rounded-lg border text-left flex flex-col justify-between ${
                      isAssigned
                        ? 'opacity-40 bg-slate-800 border-slate-700 text-slate-400'
                        : 'bg-slate-800 border-amber-500/40 text-slate-200'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-[13px] text-amber-200 block mb-1">{card.title}</span>
                      <p className="text-[13.5px] text-slate-300 mb-3">{card.desc}</p>
                    </div>
                    {!isAssigned && (
                      <div className="flex gap-1.5 pt-1 border-t border-slate-700">
                        <span className="text-[12.5px] text-amber-400 font-bold self-center">Pasang:</span>
                        {[0, 1, 2].map((sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handlePlaceTimeline(card.id, sIdx)}
                            className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-[12.5px] font-bold cursor-pointer"
                          >
                            Tahap {sIdx + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit / Verification */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                retroAudio.playSelect();
                setActiveTab('gobag');
              }}
              className="px-4 py-2 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 text-[13px] font-pixel-title font-bold border border-amber-900/30 cursor-pointer"
            >
              &lt; KEMBALI KE TAS SIAGA
            </button>

            {timelineChecked || isAlreadyCompleted ? (
              <span className="px-4 py-2 rounded-xl bg-emerald-100 border border-emerald-500 text-emerald-800 text-[13px] font-bold">
                ✓ MISI 2 SELESAI (+20 RP)
              </span>
            ) : (
              <button
                onClick={handleVerifyTimeline}
                disabled={Object.keys(timelineSlots).length < 3}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-pixel-title font-bold border-2 border-amber-950 shadow-[0_4px_0_#78350f] cursor-pointer active:translate-y-0.5"
              >
                VERIFIKASI TIMELINE MITIGASI
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
