import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/teacherStore';
import { retroAudio } from '../../utils/retroAudio';
import PixelIcon from '../../components/PixelIcon';
import { ResqyTutorialOverlay } from '../../components/Tutorial/ResqyTutorialOverlay';
import { TUTORIAL_TOURS } from '../../components/Tutorial/tutorialConfig';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'teacher' ? 'teacher' : 'student';

  const [role, setRole] = useState<'student' | 'teacher'>(initialRole);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login Form States
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);

  // Handle Login Action
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) {
      retroAudio.playLocked();
      setErrorMsg('Username dan Password wajib diisi!');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    retroAudio.playSelect();

    const res = await login(loginUsername, loginPassword, role);
    setLoading(false);

    if (res.success) {
      retroAudio.playWin();
      if (role === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/');
      }
    } else {
      retroAudio.playLocked();
      setErrorMsg(res.message || 'Login gagal! Periksa kembali username & password.');
    }
  };


  return (
    <div className="min-h-screen w-full bg-[#050813] flex flex-col items-center justify-center p-4 font-pixel select-none relative overflow-hidden">

      {/* ── 1. ULTRA-DETAILED 2D PIXEL ART TROPICAL MISTY CLOUD FOREST BACKDROP ── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Base 2D Pixel Art Backdrop matching the reference photo */}
        <img
          src="/bg-rainforest.webp"
          alt="Tropical Cloud Forest"
          className="w-full h-full object-cover object-center absolute inset-0 select-none"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Soft atmospheric depth vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-slate-900/20" />

        {/* Dynamic Animated Fog, Godrays, and Moving Leaves Overlays */}
        <svg
          viewBox="0 0 1200 700"
          className="w-full h-full object-cover absolute inset-0 pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Mist Cloud Radial Gradient */}
            <radialGradient id="mistCloudGrad1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
              <stop offset="40%" stopColor="#f1f5f9" stopOpacity="0.45" />
              <stop offset="80%" stopColor="#e2e8f0" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="mistCloudGrad2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
              <stop offset="50%" stopColor="#f8fafc" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0" />
            </radialGradient>

            {/* Linear Valley Fog Gradient */}
            <linearGradient id="valleyFogLinear" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.75" />
              <stop offset="75%" stopColor="#f1f5f9" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Sunlight God-Ray Beams */}
            <linearGradient id="godrayBeam1" x1="0%" y1="0%" x2="40%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#fef08a" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="godrayBeam2" x1="20%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#fef9c3" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Blur filter for soft natural atmospheric mist */}
            <filter id="mistSoftBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="15" />
            </filter>
          </defs>

          {/* ── 1. ACTIVE BILLOWING VALLEY MIST (Central Valley Fog Animation) ── */}
          <g transform="translate(0, 160)" className="mix-blend-screen">
            {/* Pulsing Central Mist Vapor */}
            <g className="anim-mist-billow-1" filter="url(#mistSoftBlur)">
              <ellipse cx="620" cy="110" rx="340" ry="70" fill="url(#valleyFogLinear)" opacity="0.85" />
              <ellipse cx="500" cy="90" rx="240" ry="55" fill="url(#mistCloudGrad1)" opacity="0.9" />
              <ellipse cx="740" cy="100" rx="260" ry="60" fill="url(#mistCloudGrad1)" opacity="0.85" />
            </g>

            {/* Rising Vapor Puffs */}
            <g className="anim-mist-billow-2" filter="url(#mistSoftBlur)">
              <ellipse cx="560" cy="60" rx="200" ry="50" fill="url(#mistCloudGrad1)" opacity="0.75" />
              <ellipse cx="690" cy="50" rx="220" ry="45" fill="url(#mistCloudGrad1)" opacity="0.7" />
              <ellipse cx="440" cy="75" rx="160" ry="40" fill="url(#mistCloudGrad2)" opacity="0.65" />
            </g>

            {/* Horizontal Valley Mist Ribbon Drift */}
            <g className="anim-mist-drift-mid" transform="translate(0, 30)" filter="url(#mistSoftBlur)">
              <g fill="url(#valleyFogLinear)" opacity="0.6">
                <ellipse cx="280" cy="55" rx="220" ry="35" />
                <ellipse cx="640" cy="45" rx="260" ry="40" />
                <ellipse cx="980" cy="58" rx="230" ry="38" />
              </g>
              <g fill="url(#valleyFogLinear)" opacity="0.6" transform="translate(1200, 0)">
                <ellipse cx="280" cy="55" rx="220" ry="35" />
                <ellipse cx="640" cy="45" rx="260" ry="40" />
                <ellipse cx="980" cy="58" rx="230" ry="38" />
              </g>
            </g>
          </g>

          {/* ── 2. SUNLIGHT GOD-RAY BEAMS (Shimmering Light Shafts) ── */}
          <g className="anim-godray-shimmer mix-blend-screen">
            <polygon points="460,0 600,0 800,700 580,700" fill="url(#godrayBeam1)" />
            <polygon points="680,0 820,0 1020,700 820,700" fill="url(#godrayBeam2)" />
            <polygon points="280,0 400,0 540,700 380,700" fill="url(#godrayBeam1)" opacity="0.5" />
          </g>

          {/* ── 3. FLOATING GLOWING MIST SPORES / DEW PARTICLES ── */}
          <g fill="#dcfce7" className="mix-blend-screen">
            <circle cx="190" cy="520" r="2" className="anim-spore-1" />
            <circle cx="380" cy="440" r="1.8" className="anim-spore-2" />
            <circle cx="650" cy="480" r="2.5" className="anim-spore-3" />
            <circle cx="860" cy="420" r="1.8" className="anim-spore-1" />
            <circle cx="1030" cy="460" r="2.2" className="anim-spore-2" />
            <circle cx="510" cy="380" r="1.8" className="anim-spore-3" />
            <circle cx="730" cy="340" r="2" className="anim-spore-1" />
          </g>
        </svg>
      </div>

      {/* ── 2. PREMIUM 2D PIXEL ART COMMAND SLATE CARD ── */}
      <div className="relative z-10 w-full max-w-[420px]">
        {/* Outer Wooden Bezel with Pixel Rivets */}
        <div
          className="relative pixel-wood-board p-5 sm:p-6 rounded-2xl shadow-[0_12px_0_#231206,0_20px_35px_rgba(0,0,0,0.8)] border-4 border-[#3e1f07] space-y-4"
          style={{ background: '#fef3c7' }}
        >
          {/* 4 Golden Pixel Corner Rivets */}
          <div className="absolute top-2 left-2 w-3 h-3 bg-amber-400 border-2 border-amber-950 shadow-sm" />
          <div className="absolute top-2 right-2 w-3 h-3 bg-amber-400 border-2 border-amber-950 shadow-sm" />
          <div className="absolute bottom-2 left-2 w-3 h-3 bg-amber-400 border-2 border-amber-950 shadow-sm" />
          <div className="absolute bottom-2 right-2 w-3 h-3 bg-amber-400 border-2 border-amber-950 shadow-sm" />

          {/* Title & Compass Logo Badge */}
          <div className="text-center pb-2.5 border-b-2 border-amber-950/25">
            <h1 className="font-pixel-title text-xl sm:text-2xl text-amber-950 tracking-wider font-bold">
              Login Masuk
            </h1>
          </div>

          {/* ── ROLE SWITCHER TABS ── */}
          <div id="tour-login-roles" className="grid grid-cols-2 gap-2 p-1 bg-amber-950/15 rounded-xl border-2 border-amber-950/30 shadow-inner">
            <button
              type="button"
              onClick={() => {
                retroAudio.playSelect();
                setRole('student');
                setErrorMsg('');
              }}
              className={`py-2 px-3 rounded-lg text-[13px] font-pixel-title font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${role === 'student'
                ? 'bg-amber-950 text-amber-200 shadow-[0_3px_0_#451a03] border-2 border-amber-950 translate-y-[-1px]'
                : 'text-amber-950 hover:bg-amber-200/70 font-semibold'
                }`}
            >
              <PixelIcon name="backpack" size={16} />
              <span>AKUN SISWA</span>
            </button>

            <button
              type="button"
              onClick={() => {
                retroAudio.playSelect();
                setRole('teacher');
                setAuthMode('login');
                setErrorMsg('');
              }}
              className={`py-2 px-3 rounded-lg text-[13px] font-pixel-title font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${role === 'teacher'
                ? 'bg-amber-950 text-amber-200 shadow-[0_3px_0_#451a03] border-2 border-amber-950 translate-y-[-1px]'
                : 'text-amber-950 hover:bg-amber-200/70 font-semibold'
                }`}
            >
              <PixelIcon name="clipboard" size={16} />
              <span>AKUN GURU</span>
            </button>
          </div>

          {/* ── SUB-HEADER PER ROLE ── */}
          {role === 'student' ? (
            <div id="tour-login-modes" className="flex items-center justify-center gap-3 text-[13px] font-semibold">
              <button
                type="button"
                onClick={() => {
                  retroAudio.playSelect();
                  setAuthMode('login');
                  setErrorMsg('');
                }}
                className={`pb-1 border-b-2 font-bold cursor-pointer transition-colors ${authMode === 'login'
                  ? 'border-amber-950 text-amber-950 font-pixel-title'
                  : 'border-transparent text-amber-900/60 hover:text-amber-950'
                  }`}
              >
                [ MASUK ]
              </button>
              <span className="text-amber-950/30">•</span>
              <button
                type="button"
                onClick={() => {
                  retroAudio.playSelect();
                  setAuthMode('register');
                  setErrorMsg('');
                }}
                className={`pb-1 border-b-2 font-bold cursor-pointer transition-colors ${authMode === 'register'
                  ? 'border-amber-950 text-amber-950 font-pixel-title'
                  : 'border-transparent text-amber-900/60 hover:text-amber-950'
                  }`}
              >
                [ DAFTAR AKUN BARU ]
              </button>
            </div>
          ) : (
            <div className="">
            </div>
          )}

          {/* Error Notification Alert */}
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-100 border-2 border-rose-800 text-rose-950 text-[14.5px] font-bold flex items-center gap-2 shadow-sm animate-shake">
              <PixelIcon name="alert" size={16} className="text-rose-900 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ── 1. FORM LOGIN (SISWA ATAU GURU) ── */}
          {(authMode === 'login' || role === 'teacher') && (
            <form id="tour-login-inputs" onSubmit={handleLogin} className="space-y-3">
              <div>
                <label
                  htmlFor="login-username"
                  className="block text-[13.5px] font-bold text-amber-950 mb-1 uppercase tracking-wide"
                >
                  Username {role === 'teacher' ? 'Guru' : 'Siswa'}
                </label>
                <div className="relative">
                  <input
                    id="login-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder={role === 'teacher' ? 'Misal: guru' : 'Username siswa...'}
                    className="w-full px-3 py-2 rounded-lg bg-amber-50 border-2 border-amber-950 text-amber-950 text-[13px] font-pixel focus:outline-none focus:ring-2 focus:ring-amber-600 shadow-inner font-semibold"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-[13.5px] font-bold text-amber-950 mb-1 uppercase tracking-wide"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  className="w-full px-3 py-2 rounded-lg bg-amber-50 border-2 border-amber-950 text-amber-950 text-[13px] font-pixel focus:outline-none focus:ring-2 focus:ring-amber-600 shadow-inner font-semibold"
                />
              </div>

              {/* Kotak "Akun Demo" DIHAPUS.
                  Sebelumnya bagian ini menampilkan kombinasi username dan
                  password akun demo secara terbuka, lengkap dengan tombol yang
                  mengisi otomatis kolom login. Siapa pun yang membuka halaman
                  login dapat memakainya, dan akun itu membuka seluruh level.
                  Kredensial tidak boleh ditampilkan di antarmuka. */}

              <button
                type="submit"
                disabled={loading}
                className="pixel-btn-wood-plank !w-full !h-11 !text-[13px] cursor-pointer flex items-center justify-center gap-2 mt-2 font-semibold"
              >
                <span>{loading ? 'MEMERIKSA...' : role === 'teacher' ? 'BUKA POSKO GURU' : 'MULAI PETUALANGAN'}</span>
              </button>
            </form>
          )}

          {/* ── 2. FORM REGISTER SISWA (HANYA SISWA) ── */}
          {authMode === 'register' && role === 'student' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-100/80 border-2 border-amber-950/60">
                <p className="text-[14px] font-bold text-amber-950 leading-relaxed">
                  Pendaftaran mandiri sudah ditutup.
                </p>
                <p className="mt-1.5 text-[13px] text-amber-900 font-semibold leading-relaxed">
                  Akun siswa sekarang dibuat oleh guru. Ini dilakukan agar satu siswa
                  hanya memiliki satu akun: setiap akun dikaitkan dengan NISN, dan satu
                  NISN tidak dapat dipakai dua kali.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-100/80 border-2 border-emerald-800/60">
                <p className="text-[13.5px] font-bold text-emerald-950 mb-1">
                  Cara mendapatkan akun:
                </p>
                <p className="text-[13px] text-emerald-900 font-semibold leading-relaxed">
                  Mintalah gurumu membuka Posko Guru, lalu membuatkan akun dengan
                  menuliskan namamu, NISN, dan nomor absenmu. Setelah itu kamu akan
                  menerima username dan kata sandi untuk masuk.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  retroAudio.playSelect();
                  setAuthMode('login');
                  setErrorMsg('');
                }}
                className="pixel-btn-wood-plank !w-full !h-11 !text-[13px] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>SUDAH PUNYA AKUN? MASUK DI SINI</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ── 3. RESQY TUTORIAL WALKTHROUGH OVERLAY ── */}
      <ResqyTutorialOverlay tour={TUTORIAL_TOURS.login} />

    </div>
  );
}
