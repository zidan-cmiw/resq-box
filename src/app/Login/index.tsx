import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/teacherStore';
import { retroAudio } from '../../utils/retroAudio';
import { registerStudent } from '../../utils/supabaseClient';
import PixelIcon from '../../components/PixelIcon';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'teacher' ? 'teacher' : 'student';

  const [role, setRole] = useState<'student' | 'teacher'>(initialRole);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login Form States
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Student States
  const [regStdName, setRegStdName] = useState('');
  const [regStdAbsent, setRegStdAbsent] = useState('');
  const [regStdUsername, setRegStdUsername] = useState('');
  const [regStdPassword, setRegStdPassword] = useState('');
  const [regStdClassCode, setRegStdClassCode] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

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

  // Handle Student Registration
  const handleRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regStdName.trim() || !regStdUsername.trim() || !regStdPassword.trim() || !regStdClassCode.trim()) {
      retroAudio.playLocked();
      setErrorMsg('Nama, Kode Kelas, Username, dan Password wajib diisi!');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    retroAudio.playSelect();

    const res = await registerStudent({
      name: regStdName.trim(),
      absent_number: regStdAbsent.trim() || '1',
      username: regStdUsername.trim(),
      password: regStdPassword.trim(),
      classroom_code: regStdClassCode.trim(),
    });

    setLoading(false);
    if (res.success && res.user) {
      retroAudio.playWin();
      setCurrentUser(res.user);
      navigate('/');
    } else {
      retroAudio.playLocked();
      setErrorMsg(res.message || 'Gagal mendaftar akun.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050813] flex flex-col items-center justify-center p-4 font-pixel select-none relative overflow-hidden">

      {/* ── 1. ULTRA-DETAILED 2D PIXEL ART TROPICAL MISTY CLOUD FOREST BACKDROP ── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Base 2D Pixel Art Backdrop matching the reference photo */}
        <img
          src="/bg-rainforest.jpg"
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
          <div className="grid grid-cols-2 gap-2 p-1 bg-amber-950/15 rounded-xl border-2 border-amber-950/30 shadow-inner">
            <button
              type="button"
              onClick={() => {
                retroAudio.playSelect();
                setRole('student');
                setErrorMsg('');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-pixel-title font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${role === 'student'
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
              className={`py-2 px-3 rounded-lg text-xs font-pixel-title font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${role === 'teacher'
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
            <div className="flex items-center justify-center gap-3 text-xs">
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
            <div className="p-2.5 rounded-lg bg-rose-100 border-2 border-rose-800 text-rose-950 text-[11px] font-bold flex items-center gap-2 shadow-sm animate-shake">
              <PixelIcon name="alert" size={16} className="text-rose-900 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ── 1. FORM LOGIN (SISWA ATAU GURU) ── */}
          {(authMode === 'login' || role === 'teacher') && (
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-amber-950 mb-1 uppercase tracking-wide">
                  Username {role === 'teacher' ? 'Guru' : 'Siswa'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder={role === 'teacher' ? 'Misal: guru' : 'Username siswa...'}
                    className="w-full px-3 py-2 rounded-lg bg-amber-50 border-2 border-amber-950 text-amber-950 text-xs font-pixel focus:outline-none focus:ring-2 focus:ring-amber-600 shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-amber-950 mb-1 uppercase tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  className="w-full px-3 py-2 rounded-lg bg-amber-50 border-2 border-amber-950 text-amber-950 text-xs font-pixel focus:outline-none focus:ring-2 focus:ring-amber-600 shadow-inner"
                />
              </div>

              {role === 'teacher' ? (
                <div className="p-2.5 bg-emerald-950/10 rounded-xl border-2 border-emerald-900/30 text-center space-y-1">
                  <span className="text-[10px] font-bold text-emerald-950 block uppercase font-pixel-title">
                    Kredensial Akses Guru:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginUsername('guru');
                      setLoginPassword('guru123');
                      retroAudio.playSelect();
                    }}
                    className="font-pixel text-[11px] font-bold text-emerald-950 bg-amber-50 hover:bg-amber-100/90 py-1 px-2 rounded border border-emerald-800/40 w-full cursor-pointer flex items-center justify-between"
                  >
                    <span>User: <strong className="text-emerald-700 font-pixel-title text-[10px]">guru</strong> • Pass: <strong className="text-emerald-700 font-pixel-title text-[10px]">guru123</strong></span>
                    <span className="text-[8px] bg-emerald-700 text-white px-1.5 py-0.5 rounded font-pixel-title">[ISI]</span>
                  </button>
                </div>
              ) : (
                <div className="p-2.5 bg-amber-950/10 rounded-xl border-2 border-amber-900/30 text-center space-y-1">
                  <span className="text-[10px] font-bold text-amber-950 block uppercase font-pixel-title">
                    Akun Demo (Semua Level Terbuka):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginUsername('demo');
                      setLoginPassword('demo123');
                      retroAudio.playSelect();
                    }}
                    className="font-pixel text-[11px] font-bold text-amber-950 bg-amber-50 hover:bg-amber-100/90 py-1 px-2 rounded border border-amber-900/40 w-full cursor-pointer flex items-center justify-between"
                    title="Klik untuk mengisi otomatis akun demo"
                  >
                    <span>User: <strong className="text-emerald-700 font-pixel-title text-[10px]">demo</strong> • Pass: <strong className="text-emerald-700 font-pixel-title text-[10px]">demo123</strong></span>
                    <span className="text-[8px] bg-emerald-700 text-white px-1.5 py-0.5 rounded font-pixel-title">[ISI]</span>
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="pixel-btn-wood-plank !w-full !h-11 !text-xs cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? 'MEMERIKSA...' : role === 'teacher' ? 'BUKA POSKO GURU' : 'MULAI PETUALANGAN'}</span>
              </button>
            </form>
          )}

          {/* ── 2. FORM REGISTER SISWA (HANYA SISWA) ── */}
          {authMode === 'register' && role === 'student' && (
            <form onSubmit={handleRegisterStudent} className="space-y-2.5">
              <div>
                <label className="block text-[10px] font-bold text-amber-950 mb-0.5 uppercase">
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  value={regStdName}
                  onChange={(e) => setRegStdName(e.target.value)}
                  placeholder="Misal: Vincent Pratama"
                  className="w-full px-3 py-1.5 rounded-lg bg-amber-50 border-2 border-amber-950 text-amber-950 text-xs font-pixel shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-amber-950 mb-0.5 uppercase">
                    No. Absen
                  </label>
                  <input
                    type="text"
                    value={regStdAbsent}
                    onChange={(e) => setRegStdAbsent(e.target.value)}
                    placeholder="Misal: 08"
                    className="w-full px-3 py-1.5 rounded-lg bg-amber-50 border-2 border-amber-950 text-amber-950 text-xs font-pixel shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-amber-950 mb-0.5 uppercase">
                    Kode Kelas *
                  </label>
                  <input
                    type="text"
                    value={regStdClassCode}
                    onChange={(e) => setRegStdClassCode(e.target.value)}
                    placeholder="Misal: 8B atau RESQ-8B"
                    className="w-full px-3 py-1.5 rounded-lg bg-amber-50 border-2 border-amber-950 text-amber-950 text-xs font-pixel shadow-inner font-bold"
                  />
                </div>
              </div>


              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-amber-950 mb-0.5 uppercase">
                    Username
                  </label>
                  <input
                    type="text"
                    value={regStdUsername}
                    onChange={(e) => setRegStdUsername(e.target.value)}
                    placeholder="vincent8b"
                    className="w-full px-3 py-1.5 rounded-lg bg-amber-50 border-2 border-amber-950 text-amber-950 text-xs font-pixel shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-amber-950 mb-0.5 uppercase">
                    Password
                  </label>
                  <input
                    type="password"
                    value={regStdPassword}
                    onChange={(e) => setRegStdPassword(e.target.value)}
                    placeholder="******"
                    className="w-full px-3 py-1.5 rounded-lg bg-amber-50 border-2 border-amber-950 text-amber-950 text-xs font-pixel shadow-inner"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="pixel-btn-wood-plank !w-full !h-11 !text-xs cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? 'MEMPROSES...' : 'DAFTAR & GABUNG KELAS'}</span>
              </button>
            </form>
          )}

        </div>
      </div>

    </div>
  );
}
