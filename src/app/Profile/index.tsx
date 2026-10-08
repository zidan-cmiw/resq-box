// ── Profile/index.tsx ──────────────────────────────────────────────
// Halaman Profil Siswa — Tema Nighttime Starry Rescue Camp 2D Pixel Art
// Edit data siswa (Nama, Kelas, No. Absen, Sekolah, Custom Avatar Pixel, PIN) & Progres Belajar.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, DEFAULT_CUSTOM_AVATAR, type CustomAvatarConfig } from '../../store/teacherStore';
import { retroAudio } from '../../utils/retroAudio';
import { PixelAvatarRenderer } from '../../components/PixelAvatar/PixelAvatarRenderer';
import { AvatarCustomizerModal } from '../../components/PixelAvatar/AvatarCustomizerModal';
import PixelIcon from '../../components/PixelIcon';
import { ResqyTutorialOverlay } from '../../components/Tutorial/ResqyTutorialOverlay';
import { TUTORIAL_TOURS } from '../../components/Tutorial/tutorialConfig';
import { useDataSaver, setDataSaverMode, describeReason } from '../../utils/dataSaver';
import {
  supabase,
} from '../../utils/supabaseClient';

export default function Profile() {
  const navigate = useNavigate();
  const student = useAuthStore((state) => state.student);
  const currentUser = useAuthStore((state) => state.currentUser);
  const unlockedLevel = useAuthStore((state) => state.unlockedLevel);
  const dataSaver = useDataSaver();
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [name, setName] = useState(
    student?.name || currentUser?.name || 'RESQ-Team'
  );
  const [className, setClassName] = useState(
    student?.class_name || (currentUser?.classroom_code ? `Kelas (${currentUser.classroom_code})` : 'Kelas VIII-A')
  );
  const [absentNumber, setAbsentNumber] = useState(student?.absent_number || currentUser?.absent_number || '1');
  const [schoolName, setSchoolName] = useState(student?.school_name || currentUser?.school_name || 'SMP Negeri 1');
  const [customAvatar, setCustomAvatar] = useState<CustomAvatarConfig>(() => {
    const raw = student?.custom_avatar || currentUser?.avatar_config;
    if (raw && typeof raw === 'object') {
      return { ...DEFAULT_CUSTOM_AVATAR, ...raw };
    }
    return DEFAULT_CUSTOM_AVATAR;
  });
  
  // Password change states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    // Bila siswa mengisi password baru, ganti lewat Supabase Auth.
    // Password TIDAK PERNAH disimpan di klien, localStorage, atau tabel biasa.
    if (newPassword.trim()) {
      if (newPassword !== confirmPassword) {
        retroAudio.playLocked();
        setPasswordError('Password baru dan konfirmasi password tidak sama!');
        return;
      }
      if (newPassword.length < 6) {
        retroAudio.playLocked();
        setPasswordError('Password minimal harus 6 karakter!');
        return;
      }

      if (!supabase) {
        retroAudio.playLocked();
        setPasswordError('Mode luring: ganti password membutuhkan koneksi ke server.');
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        retroAudio.playLocked();
        setPasswordError(
          error.message.toLowerCase().includes('should be different')
            ? 'Password baru harus berbeda dari password lama.'
            : `Gagal mengganti password: ${error.message}`
        );
        return;
      }

      setNewPassword('');
      setConfirmPassword('');
      retroAudio.playUnlock();
    }

    retroAudio.playSelect();
    updateProfile({
      name: name.trim() || 'RESQ-Team',
      class_name: className.trim(),
      absent_number: absentNumber.trim(),
      school_name: schoolName.trim(),
      avatar_id: 'custom',
      custom_avatar: customAvatar,
    });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleCustomAvatarSave = (newConfig: CustomAvatarConfig) => {
    setCustomAvatar(newConfig);
    updateProfile({
      custom_avatar: newConfig,
      avatar_id: 'custom',
    });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="min-h-screen w-full bg-[#070b18] text-amber-950 p-4 md:p-8 flex flex-col items-center justify-center relative font-pixel overflow-hidden select-none">
      
      {/* ── 1. NIGHTTIME STARRY RESCUE OBSERVATORY PIXEL BACKGROUND ── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
        >
          <defs>
            <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="25%" stopColor="#0c1338" />
              <stop offset="50%" stopColor="#15184a" />
              <stop offset="75%" stopColor="#1e1b5e" />
              <stop offset="90%" stopColor="#2a2060" />
              <stop offset="100%" stopColor="#1e1035" />
            </linearGradient>
            <linearGradient id="nightHillFar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#0f0e26" />
            </linearGradient>
            <linearGradient id="nightHillNear" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#131131" />
              <stop offset="100%" stopColor="#09081a" />
            </linearGradient>
          </defs>

          {/* Night Sky */}
          <rect width="1000" height="600" fill="url(#nightSky)" />

          {/* ── Stars Layer ── */}
          <g fill="#fde047">
            <rect x="45" y="28" width="3" height="3" />
            <rect x="120" y="65" width="2" height="2" />
            <rect x="195" y="22" width="3" height="3" />
            <rect x="285" y="55" width="2" height="2" />
            <rect x="370" y="30" width="3" height="3" />
            <rect x="460" y="48" width="2" height="2" />
            <rect x="545" y="18" width="3" height="3" />
            <rect x="630" y="42" width="2" height="2" />
            <rect x="715" y="28" width="3" height="3" />
            <rect x="800" y="58" width="2" height="2" />
            <rect x="890" y="35" width="3" height="3" />
            <rect x="960" y="72" width="2" height="2" />
          </g>
          <g fill="#ffffff">
            <rect x="78" y="95" width="3" height="3" />
            <rect x="250" y="38" width="4" height="4" />
            <rect x="580" y="70" width="3" height="3" />
            <rect x="750" y="85" width="4" height="4" />
            <rect x="420" y="15" width="3" height="3" />
          </g>
          <g fill="#a5b4fc" opacity="0.45">
            <rect x="30" y="115" width="2" height="2" />
            <rect x="105" y="140" width="2" height="2" />
            <rect x="160" y="75" width="2" height="2" />
            <rect x="220" y="130" width="2" height="2" />
            <rect x="340" y="100" width="2" height="2" />
            <rect x="500" y="55" width="2" height="2" />
            <rect x="650" y="125" width="2" height="2" />
            <rect x="825" y="105" width="2" height="2" />
            <rect x="920" y="120" width="2" height="2" />
          </g>

          {/* ── Crescent Moon with glow ── */}
          <g transform="translate(850, 40)">
            <rect x="-10" y="-10" width="60" height="60" fill="#fef9c3" opacity="0.08" />
            <rect x="-4" y="-4" width="48" height="48" fill="#fef9c3" opacity="0.12" />
            <rect x="8" y="0" width="24" height="40" fill="#fef9c3" />
            <rect x="0" y="8" width="40" height="24" fill="#fef9c3" />
            <rect x="4" y="4" width="32" height="32" fill="#fff" opacity="0.8" />
            <circle cx="28" cy="18" r="16" fill="#15184a" />
          </g>

          {/* ── 1. NIGHT CLOUDS ── */}
          <g fill="#1e1b4b" opacity="0.55">
            <rect x="60" y="80" width="34" height="8" />
            <rect x="76" y="72" width="48" height="8" />
            <rect x="68" y="80" width="66" height="12" />
            <rect x="380" y="65" width="40" height="8" />
            <rect x="400" y="57" width="55" height="8" />
            <rect x="390" y="65" width="76" height="12" />
            <rect x="720" y="90" width="36" height="8" />
            <rect x="740" y="82" width="50" height="8" />
          </g>

          {/* ── 2. DISTANT NIGHT MOUNTAINS ── */}
          <g fill="url(#nightHillFar)" opacity="0.95">
            <polygon points="60,460 220,240 250,240 400,460" />
            <polygon points="350,460 550,210 590,210 800,460" />
            <polygon points="720,460 880,260 910,260 1000,460" />
            <rect x="0" y="440" width="1000" height="60" />
          </g>

          {/* ── 3. NEAR NIGHT HILLS & FOREST ── */}
          <g fill="url(#nightHillNear)">
            <path d="M 0,470 Q 250,410 500,470 Q 750,420 1000,470 L 1000,600 L 0,600 Z" />
          </g>

          {/* ── 4. FOREGROUND NIGHT CAMPING & TENT SCENE ── */}
          <g>
            {/* Rolling hill polygon */}
            <path
              d="M 0,465 Q 220,405 460,465 Q 740,415 1000,465 L 1000,600 L 0,600 Z"
              fill="url(#nightHillNear)"
            />
            <path
              d="M 0,465 Q 220,405 460,465 Q 740,415 1000,465"
              stroke="#4338ca"
              strokeWidth="3"
              fill="none"
              opacity="0.5"
            />

            {/* Night Camping Dome Tent */}
            <g transform="translate(160, 422)">
              <ellipse cx="20" cy="20" rx="22" ry="4" fill="#05050d" opacity="0.7" />
              <path d="M 0,20 Q 20,-4 40,20 Z" fill="#1e1b4b" />
              <path d="M 12,20 Q 22,-2 28,20 Z" fill="#312e81" />
              <polygon points="17,20 22,10 27,20" fill="#fde047" opacity="0.85" />
              <circle cx="22" cy="16" r="14" fill="#fde047" opacity="0.12" />
              <line x1="2" y1="18" x2="-4" y2="22" stroke="#4338ca" strokeWidth="1.5" />
              <line x1="38" y1="18" x2="44" y2="22" stroke="#4338ca" strokeWidth="1.5" />
            </g>

            {/* Night Campfire */}
            <g transform="translate(225, 420)">
              <ellipse cx="0" cy="14" rx="14" ry="4" fill="#05050d" opacity="0.7" />
              <rect x="-10" y="10" width="20" height="5" fill="#3b2314" />
              <polygon points="0,0 -4,10 4,10" fill="#f97316" />
              <polygon points="0,-4 -2,8 2,8" fill="#fde047" />
              <circle cx="0" cy="6" r="16" fill="#f97316" opacity="0.15" />
            </g>

            {/* Night Pine Trees */}
            <g transform="translate(40, 430)">
              <rect x="7" y="32" width="6" height="12" fill="#05050d" />
              <polygon points="10,2 0,34 20,34" fill="#0a0a1a" />
              <polygon points="10,8 2,30 18,30" fill="#100e26" />
            </g>
            <g transform="translate(890, 430)">
              <rect x="7" y="32" width="6" height="12" fill="#05050d" />
              <polygon points="10,2 0,34 20,34" fill="#0a0a1a" />
              <polygon points="10,8 2,30 18,30" fill="#100e26" />
            </g>
            <g transform="translate(945, 440)">
              <rect x="5" y="24" width="4" height="10" fill="#05050d" />
              <polygon points="7,2 0,25 14,25" fill="#0a0a1a" />
            </g>

            {/* Soil Base under grass */}
            <rect x="0" y="530" width="1000" height="70" fill="#080814" />
            <rect x="0" y="525" width="1000" height="5" fill="#131131" />
          </g>
        </svg>
      </div>

      {/* ── 2. MAIN WOODEN NOTICE BOARD CONTAINER ── */}
      <div className="relative z-10 pixel-wood-board p-5 md:p-7 space-y-5 max-h-[92vh] overflow-y-auto" style={{ width: '680px', maxWidth: '94vw' }}>
        
        {/* Header Title with Custom Avatar */}
        <div className="flex items-center justify-between border-b-3 border-amber-950/30 pb-3.5">
          <div className="flex items-center gap-3">
            <PixelAvatarRenderer config={customAvatar} size={54} animate={false} />
            <div>
              <h1 className="font-pixel-title text-base md:text-lg font-bold text-amber-950">
                PROFIL RESQ-TEAM
              </h1>
              <p className="text-[13px] text-amber-900/80 font-pixel font-semibold">
                Identitas Siswa, Kustomisasi Avatar & Rekam Jejak Belajar
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              retroAudio.playSelect();
              navigate('/');
            }}
            className="w-9 h-9 rounded-lg bg-amber-900 hover:bg-amber-800 text-amber-100 flex items-center justify-center border-2 border-amber-950 font-bold shadow-[0_3px_0_#231206] cursor-pointer"
            title="Kembali ke Menu Utama"
          >
            ✕
          </button>
        </div>

        {/* ── AVATAR CUSTOMIZER CALLOUT BANNER ── */}
        <div id="tour-profile-avatar" className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-2 border-amber-950/40 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <PixelAvatarRenderer config={customAvatar} size={48} animate={false} />
            <div>
              <span className="font-pixel-title text-[13px] text-amber-950 block font-semibold">
                FOTO PROFIL PIXEL CUSTOM
              </span>
              <p className="text-[14.5px] text-amber-900 font-semibold">
                Ubah warna kulit, gaya rambut, seragam, mata, dan aksesorismu!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              retroAudio.playSelect();
              setIsCustomizerOpen(true);
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold border-2 border-amber-950 shadow-[0_3px_0_#78350f] text-[13px] flex items-center justify-center gap-2 transition-transform active:translate-y-0.5 cursor-pointer shrink-0"
          >
            <PixelIcon name="palette" size={16} />
            <span>Buka Bengkel Avatar</span>
          </button>
        </div>

        {/* ── Form Data Diri ── */}
        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Form Fields Grid */}
          <div id="tour-profile-fields" className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[13px] font-bold text-amber-950 uppercase tracking-wider mb-1">
                Nama Lengkap Siswa:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="w-full px-3 py-2 rounded-lg bg-amber-50 border-2 border-amber-950 text-amber-950 font-pixel font-bold text-[15px] focus:outline-none focus:ring-2 focus:ring-amber-600 shadow-inner"
                required
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-amber-950 uppercase tracking-wider mb-1">
                Kelas:
              </label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Contoh: Kelas VIII-A"
                className="w-full px-3 py-2 rounded-lg bg-amber-50 border-2 border-amber-950 text-amber-950 font-pixel font-bold text-[15px] focus:outline-none focus:ring-2 focus:ring-amber-600 shadow-inner"
                required
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-amber-950 uppercase tracking-wider mb-1">
                Nomor Absen:
              </label>
              <input
                type="text"
                value={absentNumber}
                onChange={(e) => setAbsentNumber(e.target.value)}
                placeholder="Contoh: 12"
                className="w-full px-3 py-2 rounded-lg bg-amber-50 border-2 border-amber-950 text-amber-950 font-pixel font-bold text-[15px] focus:outline-none focus:ring-2 focus:ring-amber-600 shadow-inner"
                required
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-amber-950 uppercase tracking-wider mb-1">
                Nama Sekolah:
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Contoh: SMP Negeri 1"
                className="w-full px-3 py-2 rounded-lg bg-amber-50 border-2 border-amber-950 text-amber-950 font-pixel font-bold text-[15px] focus:outline-none focus:ring-2 focus:ring-amber-600 shadow-inner"
                required
              />
            </div>
          </div>

          {/* Mode Hemat Data — untuk sekolah dengan kuota/koneksi terbatas */}
          <div className="p-3.5 bg-amber-900/10 rounded-xl border-2 border-amber-950/30 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[13px] font-bold text-amber-950 block">
                  MODE HEMAT DATA
                </span>
                <span className="text-[13.5px] text-amber-900/80 leading-snug block font-semibold">
                  {describeReason(dataSaver.reason)}
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded border text-[13.5px] font-pixel-title font-bold shrink-0 ${
                  dataSaver.active
                    ? 'bg-emerald-200 border-emerald-900/50 text-emerald-950'
                    : 'bg-amber-200 border-amber-950/40 text-amber-950'
                }`}
              >
                {dataSaver.active ? 'AKTIF' : 'MATI'}
              </span>
            </div>

            <div className="flex gap-2">
              {(['auto', 'on', 'off'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDataSaverMode(m)}
                  className={`flex-1 py-2 rounded-lg border-2 text-[13.5px] font-pixel-title font-bold transition-all ${
                    dataSaver.mode === m
                      ? 'bg-amber-700 border-amber-950 text-amber-50'
                      : 'bg-amber-50 border-amber-950/40 text-amber-950 hover:bg-amber-100'
                  }`}
                >
                  {m === 'auto' ? 'OTOMATIS' : m === 'on' ? 'NYALAKAN' : 'MATIKAN'}
                </button>
              ))}
            </div>

            <p className="text-[13px] text-amber-900/75 leading-relaxed font-semibold">
              Materi pelajaran tetap lengkap. Yang diringankan hanya tampilan:
              scene 3D gunung dan animasi berat tidak dimuat, sehingga lebih cepat
              dan lebih hemat kuota.
            </p>
          </div>

          {/* Ganti Password Akun Siswa */}
          <div id="tour-profile-password" className="p-3.5 bg-amber-900/10 rounded-xl border-2 border-amber-950/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[13px] font-bold text-amber-950 block">
                  GANTI PASSWORD AKUN SISWA
                </span>
                <span className="text-[13.5px] text-amber-900/80 font-semibold">
                  Ubah password untuk login akunmu (kosongkan jika tidak ingin ganti password)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-200 border border-amber-950/40 text-[13.5px] font-pixel-title font-bold text-amber-950">
                @{student?.username || currentUser?.username || 'siswa'}
              </span>
            </div>

            {passwordError && (
              <div className="p-2 rounded bg-rose-100 border border-rose-700 text-rose-900 text-[13.5px] font-bold">
                {passwordError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div>
                <label className="block text-[13.5px] font-bold text-amber-950 mb-0.5">
                  PASSWORD BARU:
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ketik password baru..."
                  className="w-full px-3 py-1.5 rounded-lg bg-amber-50 border-2 border-amber-950 text-amber-950 font-pixel text-[13px] shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-600 font-semibold"
                />
              </div>
              <div>
                <label className="block text-[13.5px] font-bold text-amber-950 mb-0.5">
                  ULANGI PASSWORD BARU:
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru..."
                  className="w-full px-3 py-1.5 rounded-lg bg-amber-50 border-2 border-amber-950 text-amber-950 font-pixel text-[13px] shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-600 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Tingkat Kesiapsiagaan / Level Progress Banner */}
          <div id="tour-profile-readiness" className="p-3 bg-amber-950 text-amber-100 rounded-xl border-2 border-amber-950 shadow-[0_3px_0_#231206]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-pixel-title text-amber-400 font-semibold">
                TINGKAT KESIAPSIAGAAN:
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[13.5px] font-pixel-title font-bold">
                LEVEL {unlockedLevel} / 3
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[13.5px] font-semibold">
              <div className={`p-2 rounded border ${unlockedLevel >= 1 ? 'bg-amber-900/80 border-amber-600 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                <div className="font-bold">STAGE 1</div>
                <div className="truncate">Earth Explorer</div>
                <div className="text-[12.5px] text-emerald-400 mt-0.5 flex items-center justify-center gap-1 font-semibold">
                  <PixelIcon name="check" size={10} />
                  <span>Terbuka</span>
                </div>
              </div>
              <div className={`p-2 rounded border ${unlockedLevel >= 2 ? 'bg-amber-900/80 border-amber-600 text-amber-200' : 'bg-slate-900/80 border-slate-800 text-slate-500'}`}>
                <div className="font-bold">STAGE 2</div>
                <div className="truncate">Disaster Analyst</div>
                <div className="text-[12.5px] mt-0.5 flex items-center justify-center gap-1 font-semibold">
                  {unlockedLevel >= 2 ? (
                    <>
                      <PixelIcon name="check" size={10} />
                      <span className="text-emerald-400">Terbuka</span>
                    </>
                  ) : (
                    <>
                      <PixelIcon name="lock" size={10} />
                      <span className="text-slate-400">Terkunci</span>
                    </>
                  )}
                </div>
              </div>
              <div className={`p-2 rounded border ${unlockedLevel >= 3 ? 'bg-amber-900/80 border-amber-600 text-amber-200' : 'bg-slate-900/80 border-slate-800 text-slate-500'}`}>
                <div className="font-bold">STAGE 3</div>
                <div className="truncate">Simulation Game</div>
                <div className="text-[12.5px] mt-0.5 flex items-center justify-center gap-1 font-semibold">
                  {unlockedLevel >= 3 ? (
                    <>
                      <PixelIcon name="check" size={10} />
                      <span className="text-emerald-400">Terbuka</span>
                    </>
                  ) : (
                    <>
                      <PixelIcon name="lock" size={10} />
                      <span className="text-slate-400">Terkunci</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div id="tour-profile-actions" className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-amber-100 font-pixel-title text-[15px] tracking-wider border-3 border-amber-950 shadow-[0_5px_0_#231206] transition-transform active:translate-y-1 cursor-pointer flex items-center justify-center gap-2 font-semibold"
            >
              <span>SIMPAN PROFIL</span>
              <PixelIcon name="check" size={16} />
            </button>

            <button
              type="button"
              onClick={() => {
                retroAudio.playSelect();
                navigate('/');
              }}
              className="w-full py-2.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-pixel font-bold text-[13px] border-2 border-amber-950 shadow-[0_3px_0_#78350f] transition-transform active:translate-y-0.5 cursor-pointer text-center"
            >
              KEMBALI KE MENU UTAMA
            </button>
          </div>
        </form>

      </div>

      {/* ── AVATAR CUSTOMIZER MODAL ── */}
      <AvatarCustomizerModal
        isOpen={isCustomizerOpen}
        initialConfig={customAvatar}
        onClose={() => setIsCustomizerOpen(false)}
        onSave={handleCustomAvatarSave}
      />

      {/* ── Saved Toast Notification ── */}
      {showSavedToast && (
        <div className="fixed bottom-6 z-50 bg-emerald-600 text-white font-pixel px-5 py-3 rounded-xl border-3 border-emerald-950 shadow-[0_5px_0_#064e3b] flex items-center gap-3 animate-fade-in">
          <PixelIcon name="check" size={20} />
          <span className="text-[15px] font-bold">Profil Berhasil Disimpan!</span>
        </div>
      )}

      {/* ── RESQY TUTORIAL WALKTHROUGH OVERLAY ── */}
      <ResqyTutorialOverlay
        tour={TUTORIAL_TOURS.profile}
        userId={currentUser?.id}
      />
    </div>
  );
}
