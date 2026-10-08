// ── Credits/index.tsx ─────────────────────────────────────────────
// Halaman Credits — Tema Sunset Golden Mountain 2D Pixel Art
// Menampilkan Anggota Tim Pengembang IPDP LIDM 2026 & Dosen Pembimbing.

import { useNavigate } from 'react-router-dom';
import { retroAudio } from '../../utils/retroAudio';

interface TeamMember {
  name: string;
  role: string;
  division: string;
  icon: string;
  avatarBg: string;
}

const MEMBERS: TeamMember[] = [
  {
    name: 'Muhammad Zidane Romadhona Haryanto',
    role: 'Ketua Tim & Developer Utama',
    division: 'Arsitektur Aplikasi, Simulasi & Fullstack',
    icon: 'military_tech',
    avatarBg: 'from-amber-400 to-amber-600',
  },
  {
    name: 'Ichsan Abror',
    role: 'Hardware Engineer',
    division: 'Rancang Bangun Perangkat & Sensor Kebencanaan',
    icon: 'memory',
    avatarBg: 'from-emerald-400 to-teal-600',
  },
  {
    name: 'Zahra Rokhadatul Aisy Ramadhani',
    role: 'UI/UX Designer & Asisten Developer',
    division: 'Desain Antarmuka Pixel Art & Asisten Teknis',
    icon: 'palette',
    avatarBg: 'from-rose-400 to-rose-600',
  },
  {
    name: 'Lintang Pansavia Lysandra',
    role: 'Penyusun Materi IPA & Manajemen Laporan',
    division: 'Kurikulum Kebencanaan & Dokumentasi Proyek',
    icon: 'auto_stories',
    avatarBg: 'from-purple-400 to-purple-600',
  },
];

export default function Credits() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#1c0a00] text-amber-950 p-4 md:p-8 flex flex-col items-center justify-center relative font-pixel overflow-hidden select-none">

      {/* ── 1. SUNSET PIXEL ART BACKGROUND SCENE ── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
        >
          <defs>
            <linearGradient id="sunsetSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a0520" />
              <stop offset="15%" stopColor="#3b0a2e" />
              <stop offset="35%" stopColor="#7c1d3e" />
              <stop offset="50%" stopColor="#b5392a" />
              <stop offset="65%" stopColor="#d96b27" />
              <stop offset="80%" stopColor="#f59e0b" />
              <stop offset="92%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>
            <linearGradient id="sunsetHillFar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b1005" />
              <stop offset="100%" stopColor="#1f0800" />
            </linearGradient>
            <linearGradient id="sunsetHillNear" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2a0c02" />
              <stop offset="100%" stopColor="#140500" />
            </linearGradient>
          </defs>

          {/* Sky */}
          <rect width="1000" height="600" fill="url(#sunsetSky)" />

          {/* ── Sun with glow ── */}
          <g transform="translate(480, 285)">
            {/* Sun glow layers */}
            <rect x="-20" y="-20" width="80" height="80" fill="#fef08a" opacity="0.06" />
            <rect x="-12" y="-12" width="64" height="64" fill="#fef08a" opacity="0.1" />
            {/* Sun rays */}
            <rect x="14" y="-18" width="12" height="10" fill="#fef08a" opacity="0.3" />
            <rect x="-10" y="10" width="10" height="14" fill="#fef08a" opacity="0.25" />
            <rect x="40" y="10" width="10" height="14" fill="#fef08a" opacity="0.25" />
            {/* Sun body */}
            <rect x="8" y="0" width="24" height="40" fill="#fef9c3" />
            <rect x="0" y="8" width="40" height="24" fill="#fef9c3" />
            <rect x="4" y="4" width="32" height="32" fill="#fff" opacity="0.8" />
          </g>
          {/* Horizon sun reflection */}
          <rect x="420" y="345" width="160" height="6" fill="#fef08a" opacity="0.15" />
          <rect x="440" y="351" width="120" height="4" fill="#fbbf24" opacity="0.1" />

          {/* ── First stars appearing ── */}
          <g fill="#fde68a" opacity="0.5">
            <rect x="80" y="25" width="3" height="3" className="anim-pixel-star-1" />
            <rect x="200" y="40" width="2" height="2" className="anim-pixel-star-2" />
            <rect x="350" y="18" width="3" height="3" className="anim-pixel-star-3" />
            <rect x="650" y="30" width="2" height="2" className="anim-pixel-star-1" />
            <rect x="800" y="22" width="3" height="3" className="anim-pixel-star-2" />
            <rect x="920" y="38" width="2" height="2" className="anim-pixel-star-3" />
          </g>

          {/* ── 1. PARALLAX SUNSET CLOUDS ── */}
          <g className="anim-scroll-clouds">
            <g fill="#fecdd3" opacity="0.45">
              <rect x="60" y="85" width="34" height="8" />
              <rect x="76" y="77" width="48" height="8" />
              <rect x="68" y="85" width="66" height="12" />
              <rect x="380" y="65" width="40" height="8" />
              <rect x="400" y="57" width="55" height="8" />
              <rect x="390" y="65" width="76" height="12" />
              <rect x="720" y="90" width="36" height="8" />
              <rect x="740" y="82" width="50" height="8" />
            </g>
            <g fill="#fecdd3" opacity="0.45" transform="translate(1000, 0)">
              <rect x="60" y="85" width="34" height="8" />
              <rect x="76" y="77" width="48" height="8" />
              <rect x="68" y="85" width="66" height="12" />
              <rect x="380" y="65" width="40" height="8" />
              <rect x="400" y="57" width="55" height="8" />
              <rect x="390" y="65" width="76" height="12" />
              <rect x="720" y="90" width="36" height="8" />
              <rect x="740" y="82" width="50" height="8" />
            </g>
          </g>

          {/* ── 2. PARALLAX DISTANT SUNSET MOUNTAINS ── */}
          <g className="anim-scroll-bg-far">
            <g fill="url(#sunsetHillFar)" opacity="0.95">
              <polygon points="60,460 220,240 250,240 400,460" />
              <polygon points="350,460 550,210 590,210 800,460" />
              <polygon points="720,460 880,260 910,260 1000,460" />
              <rect x="0" y="440" width="1000" height="60" />
            </g>
            <g fill="url(#sunsetHillFar)" opacity="0.95" transform="translate(1000, 0)">
              <polygon points="60,460 220,240 250,240 400,460" />
              <polygon points="350,460 550,210 590,210 800,460" />
              <polygon points="720,460 880,260 910,260 1000,460" />
              <rect x="0" y="440" width="1000" height="60" />
            </g>
          </g>

          {/* ── 3. PARALLAX NEAR SUNSET HILLS (Seamless Closed Path) ── */}
          <g className="anim-scroll-bg-mid">
            <g fill="url(#sunsetHillNear)">
              <path d="M 0,470 Q 250,410 500,470 Q 750,420 1000,470 L 1000,600 L 0,600 Z" />
            </g>
            <g fill="url(#sunsetHillNear)" transform="translate(1000, 0)">
              <path d="M 0,470 Q 250,410 500,470 Q 750,420 1000,470 L 1000,600 L 0,600 Z" />
            </g>
          </g>

          {/* ── 4. FOREGROUND SUNSET GROUND & TREES (Seamless) ── */}
          <g className="anim-scroll-bg-near">
            <g>
              <rect x="0" y="520" width="1000" height="80" fill="#140500" />
              <rect x="0" y="515" width="1000" height="5" fill="#2a0c02" />

              {/* Sunset Pine Trees (Silhouette) */}
              <g transform="translate(40, 440)">
                <rect x="7" y="30" width="6" height="12" fill="#0e0300" />
                <polygon points="10,2 0,32 20,32" fill="#120400" />
                <polygon points="10,8 2,28 18,28" fill="#1a0600" />
              </g>
              <g transform="translate(900, 440)">
                <rect x="7" y="30" width="6" height="12" fill="#0e0300" />
                <polygon points="10,2 0,32 20,32" fill="#120400" />
                <polygon points="10,8 2,28 18,28" fill="#1a0600" />
              </g>
              <g transform="translate(950, 448)">
                <rect x="5" y="24" width="4" height="10" fill="#0e0300" />
                <polygon points="7,2 0,25 14,25" fill="#120400" />
              </g>
            </g>

            {/* Duplicate for seamless loop */}
            <g transform="translate(1000, 0)">
              <rect x="0" y="520" width="1000" height="80" fill="#140500" />
              <rect x="0" y="515" width="1000" height="5" fill="#2a0c02" />

              <g transform="translate(40, 440)">
                <rect x="7" y="30" width="6" height="12" fill="#0e0300" />
                <polygon points="10,2 0,32 20,32" fill="#120400" />
                <polygon points="10,8 2,28 18,28" fill="#1a0600" />
              </g>
              <g transform="translate(900, 440)">
                <rect x="7" y="30" width="6" height="12" fill="#0e0300" />
                <polygon points="10,2 0,32 20,32" fill="#120400" />
                <polygon points="10,8 2,28 18,28" fill="#1a0600" />
              </g>
              <g transform="translate(950, 448)">
                <rect x="5" y="24" width="4" height="10" fill="#0e0300" />
                <polygon points="7,2 0,25 14,25" fill="#120400" />
              </g>
            </g>
          </g>

          {/* ── 5. PROPER PIXEL BIRDS FLYING ACROSS SUNSET ── */}
          <g className="anim-bird-flight-sunset" opacity="0.75">
            <g transform="translate(0, 160)">
              <path d="M0,6 Q6,0 12,6 Q18,0 24,6 Q18,8 12,7 Q6,8 0,6 Z" fill="#3b0a2e" />
            </g>
            <g transform="translate(32, 175) scale(0.7)">
              <path d="M0,6 Q6,0 12,6 Q18,0 24,6 Q18,8 12,7 Q6,8 0,6 Z" fill="#4a0e35" />
            </g>
            <g transform="translate(68, 150) scale(0.5)">
              <path d="M0,6 Q6,0 12,6 Q18,0 24,6 Q18,8 12,7 Q6,8 0,6 Z" fill="#581c3f" />
            </g>
          </g>

          {/* ── 6. NATURAL SLOW SUNSET EMBERS & FIREFLIES ── */}
          <g>
            <g className="anim-firefly-1" transform="translate(180, 430)">
              <circle cx="0" cy="0" r="3" fill="#fde047" />
              <circle cx="0" cy="0" r="7" fill="#fde047" opacity="0.45" />
            </g>
            <g className="anim-firefly-2" transform="translate(260, 450)">
              <circle cx="0" cy="0" r="2.5" fill="#fbbf24" />
              <circle cx="0" cy="0" r="6" fill="#fb923c" opacity="0.4" />
            </g>
            <g className="anim-firefly-3" transform="translate(360, 425)">
              <circle cx="0" cy="0" r="3" fill="#fde047" />
              <circle cx="0" cy="0" r="8" fill="#fbbf24" opacity="0.35" />
            </g>
            <g className="anim-firefly-1" transform="translate(660, 445)">
              <circle cx="0" cy="0" r="2.5" fill="#f97316" />
              <circle cx="0" cy="0" r="6" fill="#f97316" opacity="0.4" />
            </g>
            <g className="anim-firefly-2" transform="translate(760, 435)">
              <circle cx="0" cy="0" r="3" fill="#fde047" />
              <circle cx="0" cy="0" r="7" fill="#fbbf24" opacity="0.35" />
            </g>
            <g className="anim-firefly-3" transform="translate(860, 450)">
              <circle cx="0" cy="0" r="2" fill="#fbbf24" />
            </g>
          </g>
        </svg>
      </div>

      {/* ── 2. WOODEN NOTICE BOARD CONTAINER ── */}
      <div className="relative z-10 pixel-wood-board p-5 md:p-7 space-y-5 max-h-[92vh] overflow-y-auto" style={{ width: '740px', maxWidth: '94vw' }}>

        {/* Header */}
        <div className="flex items-center justify-between border-b-3 border-amber-950/30 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-amber-950 flex items-center justify-center text-slate-950 shadow-[0_3px_0_#231206] shrink-0">
              <span className="material-symbols-outlined text-2xl font-bold">
                military_tech
              </span>
            </div>
            <div>
              <h1 className="font-pixel-title text-base md:text-lg font-bold text-amber-950">
                TIM PENGEMBANG RESQ-BOX
              </h1>
              <p className="text-[13px] text-amber-900/80 font-pixel font-semibold">
                LIDM 2026 • Divisi Inovasi Pembelajaran Digital Pendidikan (IPDP)
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

        {/* ── Team Members Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {MEMBERS.map((member, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-amber-100/85 border-2 border-amber-900/40 shadow-[0_3px_0_#78350f] flex items-start gap-3"
            >
              <div className={`w-11 h-11 rounded-lg bg-gradient-to-b ${member.avatarBg} border border-amber-950 flex items-center justify-center text-slate-950 shadow-sm shrink-0 mt-0.5`}>
                <span className="material-symbols-outlined text-xl font-medium">
                  {member.icon}
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="font-pixel font-bold text-[13px] text-amber-950 truncate">
                  {member.name}
                </h4>
                <p className="text-[14.5px] font-bold text-amber-900 mt-0.5">
                  {member.role}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-900/10 text-amber-950 border border-amber-900/20 text-[13.5px] font-pixel font-semibold">
                  {member.division}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Dosen Pembimbing ── */}
        <div className="p-4 rounded-xl bg-amber-950 text-amber-100 border-2 border-amber-900 flex items-start gap-3.5 shadow-inner">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 border border-amber-950 flex items-center justify-center text-slate-950 shadow-sm shrink-0">
            <span className="material-symbols-outlined text-2xl font-bold">
              school
            </span>
          </div>
          <div>
            <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[12.5px] font-pixel-title font-bold uppercase mb-1">
              Dosen Pembimbing
            </span>
            <h3 className="font-pixel font-bold text-[15px] text-white">
              Rizki Arumning Tyas
            </h3>
            <p className="text-[13px] text-amber-200 mt-0.5 leading-relaxed font-pixel font-semibold">
              Dosen Pendamping Inovasi Pembelajaran Digital Mitigasi Bencana • Universitas Negeri Yogyakarta
            </p>
          </div>
        </div>

        {/* ── Back to Menu Button ── */}
        <button
          onClick={() => {
            retroAudio.playSelect();
            navigate('/');
          }}
          className="pixel-btn-wood-plank !w-full !h-12 !text-[13px] !bg-amber-800 !text-white cursor-pointer font-semibold"
        >
          ⯇ KEMBALI KE MENU UTAMA
        </button>

      </div>
    </div>
  );
}
