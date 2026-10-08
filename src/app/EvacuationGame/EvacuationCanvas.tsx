import Merapi3DScene from './Merapi3DScene';
import { useDataSaver } from '../../utils/dataSaver';
import PixelIcon from '../../components/PixelIcon';

/**
 * Pembungkus scene Digital Twin 3D Merapi.
 *
 * MODE HEMAT DATA
 *   Scene 3D (Three.js + model terrain ~966 KB) TIDAK dimuat sama sekali —
 *   bukan hanya disembunyikan. Ini yang membuat perbedaannya terasa di
 *   koneksi sekolah yang lambat atau berkuota terbatas.
 *
 * CATATAN SOAL ENGINE 2D LAMA
 *   Seluruh engine 2D isometrik (mapData, npc, pathfinder A*, renderer) masih
 *   tersimpan di folder ini tetapi sudah tidak dipakai. Menampilkannya sebagai
 *   alternatif "hemat data" akan salah, karena:
 *     • tampilannya sudah tertinggal jauh dari versi 3D,
 *     • data bangunan/jalan/sungai hanya ada di versi 3D,
 *     • menghidupkannya berarti memelihara dua implementasi sekaligus.
 *   Jadi mode hemat data menampilkan ringkasan, bukan scene 2D lama.
 */
export default function EvacuationCanvas() {
  const { active } = useDataSaver();

  if (active) {
    return (
      <div className="relative w-full h-full bg-[#060913] overflow-y-auto flex items-center justify-center p-4">
        <div className="pixel-wood-board max-w-lg w-full p-5 text-[#3e1f07] text-center">
          <div className="flex justify-center mb-3">
            <PixelIcon name="mountain" size={40} />
          </div>
          <h2 className="font-pixel-title text-[15px] font-black mb-2">
            MODE HEMAT DATA AKTIF
          </h2>
          <p className="font-pixel text-[14.5px] leading-relaxed mb-3 font-semibold">
            Tampilan peta 3D tidak dimuat agar hemat kuota dan lebih cepat di
            perangkat ini. Simulasi evakuasi tetap berjalan — warga digital
            merespons aksi mitigasimu seperti biasa.
          </p>
          <p className="font-pixel text-[13.5px] leading-relaxed opacity-80 mb-4 font-semibold">
            Ingin melihat peta 3D? Matikan mode hemat data di halaman Profil,
            lalu buka kembali halaman ini.
          </p>
          <a
            href="/profile"
            className="pixel-btn-wood-plank inline-block px-4 py-2.5 text-[13.5px] font-semibold"
          >
            BUKA PENGATURAN PROFIL
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#060913] overflow-hidden">
      <Merapi3DScene />
    </div>
  );
}
