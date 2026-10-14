// ── src/components/ChatbotResqy.tsx ──────────────────────────────────────────
// CHATBOT RESQY — PENJAWAB PERTANYAAN MATERI, TANPA API.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA TANPA API
// ═══════════════════════════════════════════════════════════════════════════
//
//   Seluruh jawaban berasal dari bank QA yang ditulis guru, dan pencocokannya
//   dilakukan di perangkat siswa sendiri (`pencocokanQA.ts`). Komponen ini
//   TIDAK PERNAH memanggil jaringan.
//
//   Akibatnya: biayanya nol berapa pun banyaknya siswa yang memakainya, tetap
//   bekerja saat internet sekolah mati (yang sering terjadi saat bencana), dan
//   tidak ada satu pun pertanyaan siswa yang keluar dari perangkatnya.
//
// ═══════════════════════════════════════════════════════════════════════════
// MENGAPA CHATBOT INI MENGAKU TIDAK TAHU
// ═══════════════════════════════════════════════════════════════════════════
//
//   Bila pertanyaan siswa tidak ada di bank, chatbot TIDAK mengarang jawaban.
//   Ia mengatakan belum punya jawabannya, menawarkan topik terdekat, dan
//   menyarankan bertanya kepada guru.
//
//   Untuk materi kebencanaan, chatbot yang menjawab dengan yakin padahal salah
//   jauh lebih berbahaya daripada chatbot yang mengaku tidak tahu — siswa bisa
//   salah bertindak saat bencana sungguhan.

import { useEffect, useRef, useState } from 'react';
import { jawabPertanyaan, pertanyaanContoh } from '../missions/engine/pencocokanQA';
import PixelIcon from './PixelIcon';

interface Pesan {
  dari: 'siswa' | 'resqy';
  teks: string;
  /** Saran topik, hanya untuk jawaban "belum ada di bank". */
  saran?: string[];
}

const SAPAAN: Pesan = {
  dari: 'resqy',
  teks:
    'Halo! Aku Resqy. Tanyakan apa saja tentang materi kebencanaan dan geologi — gempa, gunung api, lempeng, mitigasi, atau pengungsian. Aku menjawab dari catatan yang sudah diperiksa gurumu.',
};

export default function ChatbotResqy() {
  const [terbuka, setTerbuka] = useState(false);
  const [pesan, setPesan] = useState<Pesan[]>([SAPAAN]);
  const [input, setInput] = useState('');
  const daftarRef = useRef<HTMLDivElement>(null);

  const contoh = pertanyaanContoh(undefined, 3);

  // Gulirkan otomatis ke pesan terbaru.
  useEffect(() => {
    const el = daftarRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [pesan, terbuka]);

  const kirim = (teks: string) => {
    const pertanyaan = teks.trim();
    if (pertanyaan === '') return;

    setInput('');

    // Pencocokan berjalan SINKRON di perangkat — tidak ada permintaan jaringan.
    const hasil = jawabPertanyaan(pertanyaan);

    const balasan: Pesan =
      hasil.jenis === 'jawaban'
        ? { dari: 'resqy', teks: hasil.entri.jawaban }
        : {
            dari: 'resqy',
            teks:
              'Maaf, aku belum punya catatan untuk pertanyaan itu. Aku tidak mau menebak-nebak untuk materi kebencanaan, karena jawaban yang salah bisa berbahaya. Coba tanyakan dengan kata lain, atau tanyakan langsung kepada gurumu.',
            saran: hasil.saran,
          };

    setPesan((lama) => [...lama, { dari: 'siswa', teks: pertanyaan }, balasan]);
  };

  return (
    <>
      {/* Tombol buka/tutup */}
      <button
        onClick={() => setTerbuka((v) => !v)}
        aria-label={terbuka ? 'Tutup chatbot Resqy' : 'Buka chatbot Resqy'}
        className="fixed bottom-4 right-4 z-[70] w-14 h-14 rounded-2xl bg-amber-400 hover:bg-amber-300 border-3 border-[#451a03] shadow-[0_4px_0_#451a03] flex items-center justify-center cursor-pointer active:translate-y-0.5"
      >
        <PixelIcon name={terbuka ? 'cross' : 'bulb'} size={24} className="text-[#451a03]" />
      </button>

      {terbuka && (
        <div className="fixed bottom-20 right-4 z-[70] w-[min(94vw,380px)] max-h-[70vh] flex flex-col bg-[#fef3c7] border-4 border-[#451a03] rounded-2xl shadow-[0_10px_0_#1c0d02] overflow-hidden font-pixel animate-fadeIn">
          {/* Kepala */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#b45309] text-amber-50 border-b-3 border-[#451a03]">
            <PixelIcon name="bulb" size={18} />
            <div className="min-w-0">
              <p className="font-pixel-title font-bold text-[14px] leading-tight">Tanya Resqy</p>
              <p className="text-[11.5px] text-amber-100/80 leading-tight">
                Jawaban dari catatan guru — tanpa internet
              </p>
            </div>
          </div>

          {/* Daftar pesan */}
          <div ref={daftarRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 bg-amber-50/60">
            {pesan.map((p, i) => (
              <div key={i} className={p.dari === 'siswa' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl border-2 text-[13px] sm:text-[13.5px] font-sans leading-relaxed ${
                    p.dari === 'siswa'
                      ? 'bg-amber-600 text-white border-amber-900'
                      : 'bg-white text-[#291305] border-[#b45309]/40'
                  }`}
                >
                  <p>{p.teks}</p>

                  {p.saran && p.saran.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-[#b45309]/30">
                      <p className="font-pixel text-[11.5px] font-bold text-[#92400e] mb-1.5">
                        Mungkin maksudmu salah satu topik ini:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.saran.map((s) => (
                          <button
                            key={s}
                            onClick={() => kirim(`apa itu ${s.toLowerCase()}`)}
                            className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 border border-[#b45309]/40 text-[11.5px] font-pixel font-bold text-[#451a03] cursor-pointer"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pertanyaan contoh — hanya sebelum siswa bertanya */}
          {pesan.length === 1 && (
            <div className="px-3 pb-2 bg-amber-50/60">
              <p className="font-pixel text-[11.5px] font-bold text-[#92400e] mb-1.5">
                Contoh pertanyaan:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {contoh.map((c) => (
                  <button
                    key={c}
                    onClick={() => kirim(c)}
                    className="px-2 py-1 rounded-lg bg-white hover:bg-amber-100 border border-[#b45309]/40 text-[11.5px] font-sans text-[#451a03] cursor-pointer text-left"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Kotak tulis */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              kirim(input);
            }}
            className="flex items-center gap-2 px-3 py-2.5 bg-[#fef3c7] border-t-3 border-[#451a03]"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pertanyaanmu..."
              aria-label="Pertanyaan untuk Resqy"
              className="flex-1 min-w-0 px-3 py-2 rounded-xl border-2 border-[#b45309]/50 bg-white text-[13px] font-sans text-[#291305] outline-none focus:border-[#b45309]"
            />
            <button
              type="submit"
              disabled={input.trim() === ''}
              aria-label="Kirim pertanyaan"
              className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white border-2 border-[#451a03] font-pixel-title font-bold text-[13px] cursor-pointer active:translate-y-0.5"
            >
              KIRIM
            </button>
          </form>
        </div>
      )}
    </>
  );
}
