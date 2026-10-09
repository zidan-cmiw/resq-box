// ── Privacy/index.tsx ─────────────────────────────────────────────────────
// Kebijakan Privasi & Penanganan Data Siswa.
//
// MENGAPA HALAMAN INI ADA
//   RESQ-BOX menyimpan nama, kelas, nomor absen, dan hasil belajar anak di
//   bawah umur. Untuk media pembelajaran yang dipakai lintas sekolah, ini
//   bukan pelengkap — sekolah dan orang tua berhak tahu data apa yang
//   dikumpulkan dan untuk apa. Halaman ini dibuat publik (bisa dibuka tanpa
//   login) supaya bisa ditautkan dari surat ke sekolah.
//
// GANTI "kontak" DI BAWAH dengan alamat email/kontak resmi tim sebelum dipakai.

import { useNavigate } from 'react-router-dom';
import PixelIcon from '../../components/PixelIcon';
import { useI18n } from '../../i18n';

const KONTAK = 'tim.resqbox@gmail.com'; // ← ganti dengan kontak resmi tim
const TERAKHIR_DIPERBARUI = '8 Oktober 2026';

interface Section {
  judul: string;
  isi: string[];
}

const SECTIONS: Section[] = [
  {
    judul: '1. Data apa yang kami simpan',
    isi: [
      'Data akun: nama lengkap, username, dan password. Password disimpan dalam bentuk terenkripsi (hash bcrypt) oleh layanan autentikasi, dan tidak pernah dapat dilihat kembali oleh guru, admin, maupun pengembang.',
      'Identitas siswa: nomor absen, dipadukan dengan kode kelas. Pasangan inilah yang menjadi pengenal unik siswa di dalam kelasnya, agar satu siswa hanya memiliki satu akun dan hasil belajarnya tidak terpecah ke beberapa akun. Nomor absen saja tidak unik karena setiap kelas memiliki nomor yang sama.',
      'Data kelas: kode kelas dan asal sekolah. Dipakai agar guru dapat melihat rekap kelasnya sendiri, dan agar hasil belajar tiap siswa tercatat pada kelas yang benar.',
      'Hasil belajar: capaian per level, jumlah kristal, kata kunci yang berhasil dijawab, dan nilai akhir. Inilah yang muncul di rapor guru.',
      'Data teknis: jenis perangkat, ukuran layar, dan laporan error. Dipakai hanya untuk memperbaiki gangguan. Kami TIDAK menyimpan riwayat penjelajahan, lokasi, kamera, mikrofon, atau kontak.',
    ],
  },
  {
    judul: '2. Untuk apa data itu dipakai',
    isi: [
      'Menampilkan progres belajar siswa dan melanjutkannya saat siswa kembali.',
      'Memberi guru rekap nilai kelas yang dia ampu, agar dapat menilai dan menindaklanjuti.',
      'Memperbaiki gangguan teknis: bila aplikasi gagal di suatu perangkat, kami dapat melihat penyebabnya tanpa menanyakan satu per satu.',
      'Kami TIDAK memakai data siswa untuk iklan, tidak menjualnya, dan tidak membagikannya kepada pihak ketiga selain yang disebut di bagian 3.',
    ],
  },
  {
    judul: '3. Siapa yang dapat mengakses',
    isi: [
      'Siswa hanya dapat melihat dan mengubah datanya sendiri. Aturan ini ditegakkan di tingkat database, bukan hanya di tampilan aplikasi.',
      'Guru hanya dapat melihat data siswa pada kelas yang dia ampu.',
      'Admin sekolah dapat melihat data seluruh sekolah, dan hanya diberikan bila diperlukan.',
      'Penyedia infrastruktur: Supabase (database & autentikasi) dan penyedia hosting aplikasi. Keduanya menyimpan data atas nama kami dan tidak memakainya untuk kepentingan sendiri.',
      'Pengembang tidak dapat melihat password siapa pun. Yang tersedia hanya bentuk terenkripsinya.',
    ],
  },
  {
    judul: '4. Berapa lama disimpan',
    isi: [
      'Data belajar disimpan selama akun siswa aktif, karena diperlukan untuk rapor dan kelanjutan materi.',
      'Guru atau admin sekolah dapat menghapus akun siswa kapan saja. Penghapusan akun juga menghapus seluruh hasil belajarnya secara permanen.',
      'Laporan error teknis disimpan paling lama 90 hari, lalu dihapus otomatis.',
    ],
  },
  {
    judul: '5. Hak siswa, orang tua, dan sekolah',
    isi: [
      'Meminta salinan data: guru dapat mengunduh rekap kelas dalam format CSV kapan saja dari Posko Guru.',
      'Meminta perbaikan: nama dan kelas dapat diperbaiki sendiri oleh siswa di halaman Profil, atau oleh guru.',
      'Perbaikan nomor absen: nomor absen tidak dapat diubah sendiri oleh siswa (kalau boleh, satu siswa dapat mengubah nomornya untuk membuat akun kedua). Ajukan perbaikan melalui guru, karena guru yang menentukan nomor absen setiap siswa.',
      'Meminta penghapusan: ajukan melalui guru atau kontak di bagian 8. Kami akan menghapus akun beserta seluruh hasil belajarnya.',
      'Menolak pemakaian: bila sekolah memutuskan tidak memakai aplikasi ini, tidak ada data yang perlu diserahkan karena seluruhnya tersimpan di akun yang dapat dihapus.',
    ],
  },
  {
    judul: '6. Keamanan',
    isi: [
      'Seluruh komunikasi memakai HTTPS.',
      'Password disimpan terenkripsi dan tidak pernah dikirim balik ke peramban.',
      'Setiap tabel database dilindungi aturan akses per baris, sehingga satu akun tidak dapat membaca data akun lain walaupun mengetahui kodenya.',
      'Percobaan masuk berulang dan permintaan berlebihan dibatasi otomatis untuk mencegah penyalahgunaan.',
      'Kami tidak menyimpan data pembayaran, karena aplikasi ini tidak memungut biaya dari siswa.',
    ],
  },
  {
    judul: '7. Data anak',
    isi: [
      'Aplikasi ini ditujukan untuk siswa SMP (usia 13–14 tahun) dan digunakan di bawah pengawasan guru di lingkungan sekolah.',
      'Kami mengumpulkan data seminimal mungkin: hanya yang diperlukan untuk mencatat hasil belajar. Kami tidak meminta alamat, nomor telepon, foto, atau tanggal lahir siswa.',
      'Akun siswa sebaiknya dibuat oleh guru atau dengan sepengetahuan guru. Bila sekolah menghendaki, pendaftaran mandiri dapat dimatikan sehingga hanya guru yang membuat akun.',
      'Orang tua atau wali yang keberatan atas penyimpanan data anaknya dapat meminta penghapusan melalui kontak di bagian 8, dan permintaan itu akan kami proses.',
    ],
  },
  {
    judul: '8. Kontak',
    isi: [
      `Pertanyaan, permintaan salinan data, atau permintaan penghapusan dapat disampaikan ke: ${KONTAK}`,
      'Kami berusaha menanggapi dalam 7 hari kerja.',
    ],
  },
];

export default function PrivacyPage() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-y-auto bg-[#0a0e1a] font-pixel">
      {/* Latar sederhana agar halaman tetap terasa bagian dari aplikasi */}
      <div className="min-h-full w-full flex flex-col items-center p-4 sm:p-8">
        <div className="w-full max-w-3xl">
          {/* Kepala halaman */}
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="pixel-btn-wood-plank px-3 py-2 text-[13.5px] shrink-0 font-semibold"
              aria-label="Kembali ke halaman sebelumnya"
            >
              &larr; KEMBALI
            </button>
            <h1 className="font-pixel-title text-[16px] sm:text-[19px] font-black text-amber-200 leading-snug">
              {t('privacy.title')}
            </h1>
          </div>

          <div className="pixel-wood-board p-5 sm:p-7 text-[#3e1f07]">
            <div className="flex items-start gap-3 mb-4 pb-4 border-b-2 border-[#451a03]/25">
              <span className="shrink-0 mt-0.5">
                <PixelIcon name="shield" size={26} />
              </span>
              <div>
                <p className="font-pixel text-[14.5px] sm:text-[15px] leading-relaxed font-semibold">
                  {t('privacy.intro')}
                </p>
                <p className="font-pixel text-[12.5px] mt-2 opacity-75 font-semibold">
                  {t('privacy.lastUpdated')}: {TERAKHIR_DIPERBARUI}
                </p>
              </div>
            </div>

            {SECTIONS.map((section) => (
              <section key={section.judul} className="mb-5 last:mb-0">
                <h2 className="font-pixel-title text-[14.5px] sm:text-[15px] font-black mb-2">
                  {section.judul}
                </h2>
                <ul className="space-y-2">
                  {section.isi.map((par, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="shrink-0 font-pixel text-[13.5px] opacity-60 select-none font-semibold">
                        &bull;
                      </span>
                      <span className="font-pixel text-[14px] sm:text-[15px] leading-relaxed font-semibold">
                        {par}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <div className="mt-6 pt-4 border-t-2 border-[#451a03]/25">
              <p className="font-pixel text-[13px] leading-relaxed opacity-80 font-semibold">
                {t('privacy.footerNote')}
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-5">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="pixel-btn-wood-plank px-5 py-2.5 text-[14.5px] font-semibold"
            >
              {t('common.home')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
