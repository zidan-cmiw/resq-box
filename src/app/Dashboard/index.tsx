import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/teacherStore';
import { retroAudio } from '../../utils/retroAudio';
import { toggleFullscreen, isFullscreenActive } from '../../utils/fullscreen';
import { PixelAvatarRenderer } from '../../components/PixelAvatar/PixelAvatarRenderer';
import PixelIcon from '../../components/PixelIcon';

export default function Dashboard() {
  const navigate = useNavigate();
  const student = useAuthStore((state) => state.student);
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const unlockedLevel = useAuthStore((state) => state.unlockedLevel);

  const [soundOn, setSoundOn] = useState(() => retroAudio.isEnabled());
  const [isFullscreen, setIsFullscreen] = useState(() => isFullscreenActive());
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Monitor fullscreen state changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(isFullscreenActive());
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('mozfullscreenchange', handleFsChange);
    document.addEventListener('MSFullscreenChange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('mozfullscreenchange', handleFsChange);
      document.removeEventListener('MSFullscreenChange', handleFsChange);
    };
  }, []);

  const handleSoundToggle = () => {
    const next = retroAudio.toggleSound();
    setSoundOn(next);
  };

  const handleFullscreenToggle = () => {
    retroAudio.playSelect();
    toggleFullscreen((state) => setIsFullscreen(state));
  };

  const handleLevelClick = (targetLevel: number, path: string) => {
    if (unlockedLevel >= targetLevel) {
      retroAudio.playSelect();
      navigate(path);
    } else {
      retroAudio.playLocked();
    }
  };

  const studentDisplayName = student?.name && student.name !== '-' ? student.name : 'RESQ-Team';
  const studentClass = student?.class_name || 'Kelas VIII-A';

  return (
    <div className="relative w-full min-h-screen h-screen overflow-hidden select-none bg-[#67b2f6] flex flex-col justify-between font-pixel">

      {/* ── 1. FULL VIEWPORT CLEAN SCENIC PIXEL ART LANDSCAPE (INSPIRED BY INDONESIAN VOLCANOES) ── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
        >
          <defs>
            {/* Morning Sky gradient inspired by Image 2: Golden sunrise to crisp highland blue */}
            <linearGradient id="gameSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="25%" stopColor="#38bdf8" />
              <stop offset="55%" stopColor="#7dd3fc" />
              <stop offset="80%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>

            {/* Distant mountain blue-teal haze */}
            <linearGradient id="sindoroFar" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#43779e" />
              <stop offset="40%" stopColor="#336287" />
              <stop offset="100%" stopColor="#254d6e" />
            </linearGradient>

            {/* Main volcano sunlit ridges (left) to shadowed slopes (right) */}
            <linearGradient id="volcanoSunlit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a3e635" />
              <stop offset="20%" stopColor="#65a30d" />
              <stop offset="50%" stopColor="#4d7c0f" />
              <stop offset="80%" stopColor="#2d4a22" />
              <stop offset="100%" stopColor="#1e3a1e" />
            </linearGradient>

            {/* Foreground Prau Grassy Hill */}
            <linearGradient id="prauHill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#84cc16" />
              <stop offset="15%" stopColor="#4ade80" />
              <stop offset="50%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>

            {/* Volcanic steam plume gradient */}
            <linearGradient id="steamPlume" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#f1f5f9" stopOpacity="0.75" />
              <stop offset="80%" stopColor="#e2e8f0" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Sky Backdrop */}
          <rect width="1000" height="600" fill="url(#gameSky)" />

          {/* ── Morning Golden Sun ── */}
          <g transform="translate(80, 50)">
            <rect x="-18" y="-18" width="76" height="76" fill="#fef08a" opacity="0.15" />
            <rect x="-10" y="-10" width="60" height="60" fill="#fef08a" opacity="0.25" />
            {/* Sun Rays */}
            <rect x="16" y="-16" width="8" height="12" fill="#fef9c3" opacity="0.6" />
            <rect x="-16" y="16" width="12" height="8" fill="#fef9c3" opacity="0.6" />
            <rect x="44" y="16" width="12" height="8" fill="#fef9c3" opacity="0.6" />
            <rect x="16" y="44" width="8" height="12" fill="#fef9c3" opacity="0.6" />
            {/* Sun Disc */}
            <rect x="8" y="0" width="24" height="40" fill="#fef08a" />
            <rect x="0" y="8" width="40" height="24" fill="#fef08a" />
            <rect x="4" y="4" width="32" height="32" fill="#fff" opacity="0.9" />
          </g>

          {/* ── 1. PARALLAX DRIFTING CLOUDS LAYER (Continuous Horizontal Drift) ── */}
          <g className="anim-scroll-clouds">
            {/* Cloud set 1 (x: 0 to 1000) */}
            <g fill="#ffffff" opacity="0.85">
              {/* High wispy cloud 1 */}
              <rect x="60" y="70" width="30" height="8" />
              <rect x="76" y="62" width="44" height="8" />
              <rect x="66" y="70" width="68" height="12" />
              <rect x="120" y="64" width="24" height="6" />
              {/* Cloud 2 */}
              <rect x="380" y="45" width="40" height="8" />
              <rect x="400" y="37" width="55" height="8" />
              <rect x="390" y="45" width="80" height="14" />
              {/* Cloud 3 */}
              <rect x="720" y="85" width="36" height="8" />
              <rect x="740" y="77" width="50" height="8" />
              <rect x="730" y="85" width="76" height="12" />
            </g>
            {/* Cloud set 2 (x: 1000 to 2000 - seamless loop duplicate) */}
            <g fill="#ffffff" opacity="0.85" transform="translate(1000, 0)">
              <rect x="60" y="70" width="30" height="8" />
              <rect x="76" y="62" width="44" height="8" />
              <rect x="66" y="70" width="68" height="12" />
              <rect x="120" y="64" width="24" height="6" />
              <rect x="380" y="45" width="40" height="8" />
              <rect x="400" y="37" width="55" height="8" />
              <rect x="390" y="45" width="80" height="14" />
              <rect x="720" y="85" width="36" height="8" />
              <rect x="740" y="77" width="50" height="8" />
              <rect x="730" y="85" width="76" height="12" />
            </g>
          </g>

          {/* ── 2. PARALLAX DISTANT MOUNTAIN SILHOUETTES (Sindoro Stratovolcano - Seamless scroll) ── */}
          <g className="anim-scroll-bg-far">
            {/* Distant Mountains Tile 1 */}
            <g>
              {/* Distant Mountain Peak (Left - Sindoro style) */}
              <polygon points="120,440 280,180 320,180 480,440" fill="url(#sindoroFar)" opacity="0.75" />
              {/* Mountain stepped ridge details */}
              <polygon points="260,440 290,180 320,180 350,440" fill="#2d5578" opacity="0.4" />
              <polygon points="320,180 380,320 480,440 320,440" fill="#1b3d5a" opacity="0.55" />
              {/* Distant rolling ridge base */}
              <polygon points="0,450 140,360 280,450" fill="#305a7d" opacity="0.6" />
              <polygon points="450,450 600,340 750,450" fill="#2a5273" opacity="0.6" />
              <polygon points="700,450 860,350 1000,450" fill="#254d6e" opacity="0.65" />
            </g>
            {/* Distant Mountains Tile 2 (Duplicate for seamless loop) */}
            <g transform="translate(1000, 0)">
              <polygon points="120,440 280,180 320,180 480,440" fill="url(#sindoroFar)" opacity="0.75" />
              <polygon points="260,440 290,180 320,180 350,440" fill="#2d5578" opacity="0.4" />
              <polygon points="320,180 380,320 480,440 320,440" fill="#1b3d5a" opacity="0.55" />
              <polygon points="0,450 140,360 280,450" fill="#305a7d" opacity="0.6" />
              <polygon points="450,450 600,340 750,450" fill="#2a5273" opacity="0.6" />
              <polygon points="700,450 860,350 1000,450" fill="#254d6e" opacity="0.65" />
            </g>
          </g>

          {/* ── 3. MAIN MAJESTIC STRATOVOLCANO (Sumbing Style - Inspired directly by Image 2) ── */}
          <g className="anim-scroll-bg-mid">
            {/* Main Volcano Tile 1 */}
            <g>
              {/* Volcano Mass */}
              <polygon points="380,480 620,130 670,130 920,480" fill="url(#volcanoSunlit)" />

              {/* Sunlit Golden/Green Slopes (Left side catching morning sun) */}
              <polygon points="380,480 620,130 642,130 500,480" fill="#84cc16" opacity="0.4" />
              <polygon points="440,480 622,130 635,130 540,480" fill="#a3e635" opacity="0.3" />

              {/* Stepped green ridge contours (Natural volcanic ravines) */}
              <polygon points="480,480 626,130 638,130 520,480" fill="#65a30d" opacity="0.5" />
              <polygon points="560,480 640,130 648,130 590,480" fill="#4d7c0f" opacity="0.6" />

              {/* Dark Ravines & Shadowed Slopes (Right side) */}
              <polygon points="645,130 670,130 920,480 730,480" fill="#1c3319" opacity="0.55" />
              <polygon points="655,130 670,130 870,480 780,480" fill="#142612" opacity="0.45" />
              <polygon points="665,130 670,130 830,480 800,480" fill="#0f1d0e" opacity="0.4" />

              {/* Volcano Summit Crater Rim */}
              <rect x="618" y="127" width="54" height="6" fill="#4d7c0f" />
              <rect x="622" y="125" width="46" height="4" fill="#65a30d" />

              {/* ── Volcanic White Steam Fumarole Plume (trailing sideways to the right like in Image 2) ── */}
              <g transform="translate(645, 122)">
                {/* Main trailing steam cloud */}
                <g className="anim-steam-main">
                  <path
                    d="M0,4 Q40,-6 100,-2 Q160,2 220,-4 Q250,-2 280,4 L280,10 Q210,12 140,8 Q70,10 0,6 Z"
                    fill="url(#steamPlume)"
                  />
                  <ellipse cx="30" cy="2" rx="25" ry="7" fill="#ffffff" opacity="0.8" />
                  <ellipse cx="80" cy="1" rx="40" ry="8" fill="#ffffff" opacity="0.7" />
                  <ellipse cx="145" cy="0" rx="45" ry="9" fill="#f8fafc" opacity="0.5" />
                  <ellipse cx="210" cy="-2" rx="40" ry="7" fill="#f1f5f9" opacity="0.35" />
                </g>
                {/* Wispy floating steam particles drifting away */}
                <circle cx="90" cy="-3" r="6" fill="#fff" opacity="0.6" className="anim-steam-wisp-1" />
                <circle cx="150" cy="-6" r="8" fill="#fff" opacity="0.4" className="anim-steam-wisp-2" />
                <circle cx="210" cy="-8" r="9" fill="#fff" opacity="0.25" className="anim-steam-wisp-1" />
              </g>

              {/* Mid-ground green foothills */}
              <polygon points="200,490 380,380 560,490" fill="#3f6212" opacity="0.7" />
              <polygon points="460,490 620,400 780,490" fill="#365314" opacity="0.7" />
            </g>

            {/* Main Volcano Tile 2 (Duplicate for seamless loop) */}
            <g transform="translate(1000, 0)">
              <polygon points="380,480 620,130 670,130 920,480" fill="url(#volcanoSunlit)" />
              <polygon points="380,480 620,130 642,130 500,480" fill="#84cc16" opacity="0.4" />
              <polygon points="440,480 622,130 635,130 540,480" fill="#a3e635" opacity="0.3" />
              <polygon points="480,480 626,130 638,130 520,480" fill="#65a30d" opacity="0.5" />
              <polygon points="560,480 640,130 648,130 590,480" fill="#4d7c0f" opacity="0.6" />
              <polygon points="645,130 670,130 920,480 730,480" fill="#1c3319" opacity="0.55" />
              <polygon points="655,130 670,130 870,480 780,480" fill="#142612" opacity="0.45" />
              <polygon points="665,130 670,130 830,480 800,480" fill="#0f1d0e" opacity="0.4" />
              <rect x="618" y="127" width="54" height="6" fill="#4d7c0f" />
              <rect x="622" y="125" width="46" height="4" fill="#65a30d" />

              <g transform="translate(645, 122)">
                <g className="anim-steam-main">
                  <path
                    d="M0,4 Q40,-6 100,-2 Q160,2 220,-4 Q250,-2 280,4 L280,10 Q210,12 140,8 Q70,10 0,6 Z"
                    fill="url(#steamPlume)"
                  />
                  <ellipse cx="30" cy="2" rx="25" ry="7" fill="#ffffff" opacity="0.8" />
                  <ellipse cx="80" cy="1" rx="40" ry="8" fill="#ffffff" opacity="0.7" />
                  <ellipse cx="145" cy="0" rx="45" ry="9" fill="#f8fafc" opacity="0.5" />
                  <ellipse cx="210" cy="-2" rx="40" ry="7" fill="#f1f5f9" opacity="0.35" />
                </g>
                <circle cx="90" cy="-3" r="6" fill="#fff" opacity="0.6" className="anim-steam-wisp-1" />
                <circle cx="150" cy="-6" r="8" fill="#fff" opacity="0.4" className="anim-steam-wisp-2" />
                <circle cx="210" cy="-8" r="9" fill="#fff" opacity="0.25" className="anim-steam-wisp-1" />
              </g>

              <polygon points="200,490 380,380 560,490" fill="#3f6212" opacity="0.7" />
              <polygon points="460,490 620,400 780,490" fill="#365314" opacity="0.7" />
            </g>
          </g>

          {/* ── 4. FOREGROUND PRAU GRASSY HILL & RED CAMPING TENT (Matching Image 2) ── */}
          <g className="anim-scroll-bg-near">
            {/* Near Grassy Knoll Tile 1 */}
            <g>
              {/* Seamless rolling hill polygon from x=0 to x=1000 */}
              <path
                d="M 0,465 Q 220,405 460,465 Q 740,415 1000,465 L 1000,600 L 0,600 Z"
                fill="url(#prauHill)"
              />
              {/* Sunlit Golden Rim on Hilltop */}
              <path
                d="M 0,465 Q 220,405 460,465 Q 740,415 1000,465"
                stroke="#facc15"
                strokeWidth="3.5"
                fill="none"
                opacity="0.6"
              />

              {/* ── THE ICONIC RED/ORANGE CAMPING DOME TENT (On top of grassy hill from Image 2!) ── */}
              <g transform="translate(200, 416)">
                <ellipse cx="20" cy="20" rx="22" ry="4" fill="#14532d" opacity="0.6" />
                <path d="M 0,20 Q 20,-4 40,20 Z" fill="#ea580c" />
                <path d="M 12,20 Q 22,-2 28,20 Z" fill="#c2410c" />
                <polygon points="17,20 22,10 27,20" fill="#fef08a" opacity="0.9" />
                <line x1="2" y1="18" x2="-4" y2="22" stroke="#78350f" strokeWidth="1.5" />
                <line x1="38" y1="18" x2="44" y2="22" stroke="#78350f" strokeWidth="1.5" />
              </g>

              {/* Pine trees along the grassy slopes */}
              <g transform="translate(45, 430)">
                <rect x="7" y="32" width="6" height="12" fill="#5d4037" />
                <polygon points="10,2 0,34 20,34" fill="#14532d" />
                <polygon points="10,8 2,30 18,30" fill="#166534" />
                <polygon points="10,14 4,26 16,26" fill="#15803d" />
              </g>
              <g transform="translate(95, 442)">
                <rect x="5" y="24" width="4" height="10" fill="#5d4037" />
                <polygon points="7,2 0,25 14,25" fill="#14532d" />
                <polygon points="7,7 2,22 12,22" fill="#166534" />
              </g>
              <g transform="translate(890, 430)">
                <rect x="7" y="32" width="6" height="12" fill="#5d4037" />
                <polygon points="10,2 0,34 20,34" fill="#14532d" />
                <polygon points="10,8 2,30 18,30" fill="#166534" />
                <polygon points="10,14 4,26 16,26" fill="#15803d" />
              </g>
              <g transform="translate(945, 440)">
                <rect x="6" y="26" width="5" height="10" fill="#5d4037" />
                <polygon points="8,2 0,28 16,28" fill="#14532d" />
                <polygon points="8,8 2,24 14,24" fill="#166534" />
              </g>

              {/* Wildflowers on the grass */}
              <g>
                <circle cx="140" cy="460" r="3" fill="#facc15" />
                <circle cx="170" cy="455" r="2.5" fill="#f87171" />
                <circle cx="280" cy="452" r="3" fill="#facc15" />
                <circle cx="310" cy="465" r="2.5" fill="#fb923c" />
                <circle cx="700" cy="468" r="3" fill="#facc15" />
                <circle cx="740" cy="458" r="2.5" fill="#f87171" />
                <circle cx="830" cy="462" r="3" fill="#facc15" />
              </g>

              {/* Soil Base under grass */}
              <rect x="0" y="530" width="1000" height="70" fill="#2d1b0f" />
              <rect x="0" y="525" width="1000" height="5" fill="#452311" />
              <rect x="0" y="520" width="1000" height="5" fill="#15803d" />
            </g>

            {/* Near Grassy Knoll Tile 2 (Duplicate for seamless loop) */}
            <g transform="translate(1000, 0)">
              <path
                d="M 0,465 Q 220,405 460,465 Q 740,415 1000,465 L 1000,600 L 0,600 Z"
                fill="url(#prauHill)"
              />
              <path
                d="M 0,465 Q 220,405 460,465 Q 740,415 1000,465"
                stroke="#facc15"
                strokeWidth="3.5"
                fill="none"
                opacity="0.6"
              />

              <g transform="translate(200, 416)">
                <ellipse cx="20" cy="20" rx="22" ry="4" fill="#14532d" opacity="0.6" />
                <path d="M 0,20 Q 20,-4 40,20 Z" fill="#ea580c" />
                <path d="M 12,20 Q 22,-2 28,20 Z" fill="#c2410c" />
                <polygon points="17,20 22,10 27,20" fill="#fef08a" opacity="0.9" />
                <line x1="2" y1="18" x2="-4" y2="22" stroke="#78350f" strokeWidth="1.5" />
                <line x1="38" y1="18" x2="44" y2="22" stroke="#78350f" strokeWidth="1.5" />
              </g>

              <g transform="translate(45, 430)">
                <rect x="7" y="32" width="6" height="12" fill="#5d4037" />
                <polygon points="10,2 0,34 20,34" fill="#14532d" />
                <polygon points="10,8 2,30 18,30" fill="#166534" />
                <polygon points="10,14 4,26 16,26" fill="#15803d" />
              </g>
              <g transform="translate(95, 442)">
                <rect x="5" y="24" width="4" height="10" fill="#5d4037" />
                <polygon points="7,2 0,25 14,25" fill="#14532d" />
                <polygon points="7,7 2,22 12,22" fill="#166534" />
              </g>
              <g transform="translate(890, 430)">
                <rect x="7" y="32" width="6" height="12" fill="#5d4037" />
                <polygon points="10,2 0,34 20,34" fill="#14532d" />
                <polygon points="10,8 2,30 18,30" fill="#166534" />
                <polygon points="10,14 4,26 16,26" fill="#15803d" />
              </g>
              <g transform="translate(945, 440)">
                <rect x="6" y="26" width="5" height="10" fill="#5d4037" />
                <polygon points="8,2 0,28 16,28" fill="#14532d" />
                <polygon points="8,8 2,24 14,24" fill="#166534" />
              </g>

              <g>
                <circle cx="140" cy="460" r="3" fill="#facc15" />
                <circle cx="170" cy="455" r="2.5" fill="#f87171" />
                <circle cx="280" cy="452" r="3" fill="#facc15" />
                <circle cx="310" cy="465" r="2.5" fill="#fb923c" />
                <circle cx="700" cy="468" r="3" fill="#facc15" />
                <circle cx="740" cy="458" r="2.5" fill="#f87171" />
                <circle cx="830" cy="462" r="3" fill="#facc15" />
              </g>

              <rect x="0" y="530" width="1000" height="70" fill="#2d1b0f" />
              <rect x="0" y="525" width="1000" height="5" fill="#452311" />
              <rect x="0" y="520" width="1000" height="5" fill="#15803d" />
            </g>
          </g>

          {/* ── 5. PROPER PIXEL ART BIRDS GLIDING ACROSS SKY ── */}
          {/* Bird Group 1 flying across sky from right to left */}
          <g className="anim-bird-flight-1" opacity="0.85">
            {/* Bird 1 */}
            <g transform="translate(0, 140)">
              <path d="M0,6 Q6,0 12,6 Q18,0 24,6 Q18,8 12,7 Q6,8 0,6 Z" fill="#1e293b" />
            </g>
            {/* Bird 2 (follower) */}
            <g transform="translate(35, 155) scale(0.75)">
              <path d="M0,6 Q6,0 12,6 Q18,0 24,6 Q18,8 12,7 Q6,8 0,6 Z" fill="#334155" />
            </g>
            {/* Bird 3 (small) */}
            <g transform="translate(70, 135) scale(0.55)">
              <path d="M0,6 Q6,0 12,6 Q18,0 24,6 Q18,8 12,7 Q6,8 0,6 Z" fill="#475569" />
            </g>
          </g>

          {/* Bird Group 2 (staggered second flock) */}
          <g className="anim-bird-flight-2" opacity="0.75">
            <g transform="translate(0, 110) scale(0.8)">
              <path d="M0,6 Q6,0 12,6 Q18,0 24,6 Q18,8 12,7 Q6,8 0,6 Z" fill="#1e293b" />
            </g>
            <g transform="translate(30, 120) scale(0.6)">
              <path d="M0,6 Q6,0 12,6 Q18,0 24,6 Q18,8 12,7 Q6,8 0,6 Z" fill="#334155" />
            </g>
          </g>

          {/* ── 6. NATURAL SLOW FIREFLIES / MORNING SPORES (Hovering softly above grass) ── */}
          <g>
            {/* Group 1 */}
            <g className="anim-firefly-1" transform="translate(180, 450)">
              <circle cx="0" cy="0" r="3" fill="#fef08a" />
              <circle cx="0" cy="0" r="6" fill="#fde047" opacity="0.4" />
            </g>
            <g className="anim-firefly-2" transform="translate(260, 460)">
              <circle cx="0" cy="0" r="2.5" fill="#a3e635" />
              <circle cx="0" cy="0" r="5" fill="#a3e635" opacity="0.35" />
            </g>
            <g className="anim-firefly-3" transform="translate(320, 445)">
              <circle cx="0" cy="0" r="3" fill="#fef08a" />
              <circle cx="0" cy="0" r="7" fill="#fef08a" opacity="0.3" />
            </g>
            {/* Group 2 */}
            <g className="anim-firefly-2" transform="translate(680, 455)">
              <circle cx="0" cy="0" r="2.5" fill="#fef08a" />
              <circle cx="0" cy="0" r="5" fill="#fde047" opacity="0.4" />
            </g>
            <g className="anim-firefly-1" transform="translate(760, 448)">
              <circle cx="0" cy="0" r="3" fill="#a3e635" />
              <circle cx="0" cy="0" r="6" fill="#a3e635" opacity="0.35" />
            </g>
            <g className="anim-firefly-3" transform="translate(840, 460)">
              <circle cx="0" cy="0" r="2" fill="#fef08a" />
            </g>
          </g>
        </svg>
      </div>

      {/* ── 2. TOP HUD: PLAYER PROFILE CARD & UTILITIES ── */}
      <header className="relative z-20 w-full px-4 md:px-8 pt-4 flex items-start justify-between">

        {/* Top Left: Player Profile Badge Button */}
        <button
          onClick={() => {
            retroAudio.playSelect();
            if (currentUser?.role === 'teacher') {
              navigate('/teacher');
            } else {
              navigate('/profile');
            }
          }}
          onMouseEnter={() => retroAudio.playHover()}
          className="flex items-center gap-3 bg-slate-950/85 hover:bg-slate-900/90 backdrop-blur-md p-2 md:p-2.5 rounded-xl border-3 border-amber-950 shadow-[0_5px_0_#231206] transition-transform active:translate-y-1 cursor-pointer text-left group"
          title={currentUser?.role === 'teacher' ? 'Buka Posko Monitoring Guru' : 'Buka Pengaturan Profil Siswa'}
        >
          <PixelAvatarRenderer config={student?.custom_avatar} size={48} animate={false} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-pixel-title text-[9px] text-amber-400">
                {currentUser?.role === 'teacher' ? 'AKUN GURU' : 'PROFIL SISWA'}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-pixel-title font-bold">
                {currentUser?.role === 'teacher' ? 'POSKO' : `LV.${unlockedLevel}`}
              </span>
            </div>
            <h2 className="font-pixel text-base font-bold text-white tracking-wide truncate max-w-[150px] sm:max-w-[200px]">
              {currentUser?.role === 'teacher' ? (currentUser.name || 'Bapak Guru IPA') : studentDisplayName}
            </h2>
            <p className="text-[11px] text-slate-400 font-pixel">
              {currentUser?.role === 'teacher' ? 'Guru IPA • Klik ke Posko Guru' : `${studentClass} • Klik untuk edit`}
            </p>
          </div>
        </button>

        {/* Top Right: Sound, Fullscreen, Teacher Portal & Auth Controls */}
        <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md p-2 rounded-xl border-3 border-amber-950 shadow-[0_5px_0_#231206]">
          {/* Teacher Portal Shortcut (HANYA MUNCUL DI AKUN GURU) */}
          {currentUser?.role === 'teacher' && (
            <button
              onClick={() => {
                retroAudio.playSelect();
                navigate('/teacher');
              }}
              onMouseEnter={() => retroAudio.playHover()}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-pixel-title font-bold border-2 border-emerald-950 shadow-[0_2px_0_#064e3b] text-[10px] cursor-pointer flex items-center gap-1.5 transition-transform active:translate-y-0.5"
              title="Buka Posko Monitoring Guru"
            >
              <PixelIcon name="clipboard" size={13} />
              <span>POSKO GURU</span>
            </button>
          )}

          <button
            onClick={() => {
              retroAudio.playSelect();
              logout();
              navigate('/login');
            }}
            onMouseEnter={() => retroAudio.playHover()}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border-2 border-slate-700 shadow-[0_2px_0_#0f172a] text-[10px] font-pixel cursor-pointer flex items-center gap-1.5 transition-transform active:translate-y-0.5"
            title="Ganti Akun / Masuk"
          >
            <PixelIcon name="user" size={13} />
            <span>GANTI AKUN</span>
          </button>

          {/* Sound toggle button */}
          <button
            onClick={handleSoundToggle}
            onMouseEnter={() => retroAudio.playHover()}
            className={`w-10 h-10 rounded-lg border-2 border-slate-950 flex items-center justify-center font-bold transition-all cursor-pointer ${soundOn
              ? 'bg-amber-500 text-slate-950 shadow-[0_3px_0_#78350f]'
              : 'bg-slate-800 text-slate-400 shadow-[0_3px_0_#0f172a]'
              }`}
            title="Suara Efek 8-Bit (ON/OFF)"
          >
            <span className="material-symbols-outlined text-lg">
              {soundOn ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          {/* Fullscreen toggle button */}
          <button
            onClick={handleFullscreenToggle}
            onMouseEnter={() => retroAudio.playHover()}
            className={`w-10 h-10 rounded-lg border-2 border-slate-950 flex items-center justify-center font-bold transition-all cursor-pointer ${isFullscreen
              ? 'bg-emerald-500 text-slate-950 shadow-[0_3px_0_#064e3b]'
              : 'bg-slate-800 text-slate-300 shadow-[0_3px_0_#0f172a]'
              }`}
            title="Layar Penuh (Fullscreen)"
          >
            <span className="material-symbols-outlined text-lg">
              {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
            </span>
          </button>

        </div>

      </header>

      {/* ── 3. CENTER STAGE: TITLE LOGO & RETRO WOODEN MENU BUTTONS ── */}
      <main className="relative z-20 flex flex-col items-center justify-center flex-1 px-4 py-2 overflow-y-auto">

        {/* Game Title Logo Banner */}
        <div className="text-center mb-4">
          <h1 className="pixel-title-logo select-none">
            RESQ-BOX
          </h1>
          <div className="inline-block mt-2 px-4 py-1.5 rounded-md bg-amber-950/90 border-2 border-amber-500 shadow-[0_4px_0_#231206]">
            <p className="font-pixel text-xs md:text-sm text-amber-200 uppercase tracking-wider font-bold">
              Media Pembelajaran Lempeng Tektonik
            </p>
          </div>
        </div>

        {/* Stack of Authentic 3D Wooden Plank Game Buttons */}
        <div
          className="flex flex-col items-center gap-3.5"
          style={{ width: '400px', maxWidth: '92vw' }}
        >

          {/* Teacher Command Shortcut Button in Main Menu (HANYA MUNCUL DI AKUN GURU) */}
          {currentUser?.role === 'teacher' && (
            <button
              onClick={() => {
                retroAudio.playSelect();
                navigate('/teacher');
              }}
              onMouseEnter={() => retroAudio.playHover()}
              className="pixel-btn-wood-plank cursor-pointer !bg-gradient-to-b !from-amber-200 !via-amber-400 !to-amber-600 !text-amber-950 border-amber-950 shadow-[0_8px_0_#451a03] font-bold"
              title="Kembali ke Posko Monitoring Guru"
            >
              <div className="flex items-center justify-center gap-2">
                <PixelIcon name="clipboard" size={16} />
                <span>POSKO MONITORING GURU</span>
              </div>
            </button>
          )}

          {/* Button 1: Earth Explorer */}
          <button
            onClick={() => handleLevelClick(1, '/level1')}
            onMouseEnter={() => retroAudio.playHover()}
            className="pixel-btn-wood-plank cursor-pointer"
          >
            <span>LEVEL 1. EARTH EXPLORER</span>
          </button>

          {/* Button 2: Disaster Analyst */}
          {unlockedLevel >= 2 ? (
            <button
              onClick={() => handleLevelClick(2, '/level2')}
              onMouseEnter={() => retroAudio.playHover()}
              className="pixel-btn-wood-plank cursor-pointer"
            >
              <span>LEVEL 2. DISASTER ANALYST</span>
            </button>
          ) : (
            <button
              onClick={() => {
                retroAudio.playLocked();
              }}
              onMouseEnter={() => retroAudio.playHover()}
              className="pixel-btn-wood-plank locked flex items-center justify-center gap-2 cursor-not-allowed"
              title="Selesaikan Level 1 Terlebih Dahulu"
            >
              <span className="material-symbols-outlined text-base">lock</span>
              <span>LEVEL 2. DISASTER ANALYST</span>
            </button>
          )}

          {/* Button 3: Simulation Game */}
          {unlockedLevel >= 3 ? (
            <button
              onClick={() => handleLevelClick(3, '/level3')}
              onMouseEnter={() => retroAudio.playHover()}
              className="pixel-btn-wood-plank cursor-pointer"
            >
              <span>LEVEL 3. SIMULATION GAME</span>
            </button>
          ) : (
            <button
              onClick={() => {
                retroAudio.playLocked();
              }}
              onMouseEnter={() => retroAudio.playHover()}
              className="pixel-btn-wood-plank locked flex items-center justify-center gap-2 cursor-not-allowed"
              title="Selesaikan Level 2 Terlebih Dahulu"
            >
              <span className="material-symbols-outlined text-base">lock</span>
              <span>LEVEL 3. SIMULATION GAME</span>
            </button>
          )}

          {/* Button 4: Panduan / How to Play */}
          <button
            onClick={() => {
              retroAudio.playSelect();
              setShowGuideModal(true);
            }}
            onMouseEnter={() => retroAudio.playHover()}
            className="pixel-btn-wood-plank cursor-pointer"
          >
            <span>PANDUAN & MISI</span>
          </button>

          {/* Button 5: Profil Siswa */}
          <button
            onClick={() => {
              retroAudio.playSelect();
              if (currentUser?.role === 'teacher') {
                navigate('/teacher');
              } else {
                navigate('/profile');
              }
            }}
            onMouseEnter={() => retroAudio.playHover()}
            className="pixel-btn-wood-plank cursor-pointer"
          >
            <span>{currentUser?.role === 'teacher' ? 'POSKO GURU' : 'PROFIL SISWA'}</span>
          </button>

          {/* Button 6: Credits */}
          <button
            onClick={() => {
              retroAudio.playSelect();
              navigate('/credits');
            }}
            onMouseEnter={() => retroAudio.playHover()}
            className="pixel-btn-wood-plank cursor-pointer"
          >
            <span>CREDITS</span>
          </button>

          {/* Petunjuk Belajar — always visible, inside the menu stack */}
          <button
            onClick={() => {
              retroAudio.playSelect();
              setShowGuideModal(true);
            }}
            onMouseEnter={() => retroAudio.playHover()}
            className="flex items-center gap-2 bg-amber-900/90 hover:bg-amber-800/90 backdrop-blur-md px-4 py-2 rounded-lg border-2 border-amber-950 shadow-[0_3px_0_#231206] cursor-pointer transition-transform active:translate-y-0.5"
          >
            <span className="material-symbols-outlined text-amber-300 text-base">signpost</span>
            <span className="font-pixel text-xs font-bold text-amber-200 flex items-center gap-1">
              <span>PETUNJUK BELAJAR</span>
              <span className="font-bold">&gt;</span>
            </span>
          </button>

        </div>

      </main>

      {/* ── 5. RETRO WOODEN NOTICE BOARD MODAL (PANDUAN) ── */}
      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="pixel-wood-board p-5 md:p-6 text-amber-950 space-y-4 max-h-[88vh] overflow-y-auto font-pixel"
            style={{ width: '580px', maxWidth: '92vw' }}
            onClick={(e) => e.stopPropagation()}
          >

            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-amber-950/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl text-amber-900 font-bold">
                  menu_book
                </span>
                <h3 className="font-pixel-title text-sm md:text-base font-bold text-amber-950">
                  PANDUAN PEMBELAJARAN
                </h3>
              </div>
              <button
                onClick={() => {
                  retroAudio.playSelect();
                  setShowGuideModal(false);
                }}
                className="w-8 h-8 rounded bg-amber-900 hover:bg-amber-800 text-amber-100 flex items-center justify-center border border-amber-950 font-bold shadow-[0_2px_0_#231206] cursor-pointer"
                title="Tutup Panduan"
              >
                <PixelIcon name="cross" size={12} />
              </button>
            </div>

            {/* Content list in Pixel Font */}
            <div className="space-y-3 text-xs md:text-sm text-amber-950 leading-relaxed">

              <div className="p-3.5 rounded-lg bg-amber-100/80 border-2 border-amber-900/40">
                <h4 className="font-pixel font-bold text-xs text-amber-900 mb-1 flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-amber-900 text-amber-100 font-pixel-title text-[9px]">TAHAP 1</span>
                  EARTH EXPLORER (Struktur Bumi)
                </h4>
                <p className="font-pixel">
                  Eksplorasi lapisan kerak bumi, mantel, dan pergerakan lempeng tektonik konvergen, divergen, dan sesar geser. Selesaikan tebak kata untuk membuka Level 2!
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-amber-100/80 border-2 border-amber-900/40">
                <h4 className="font-pixel font-bold text-xs text-amber-900 mb-1 flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-amber-900 text-amber-100 font-pixel-title text-[9px]">TAHAP 2</span>
                  DISASTER ANALYST (Gempa & Vulkanik)
                </h4>
                <p className="font-pixel">
                  Pelajari analisis potensi bahaya seismik dan erupsi gunung api. Susun urutan langkah mitigasi penyelamatan sebelum, saat, dan sesudah bencana!
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-amber-100/80 border-2 border-amber-900/40">
                <h4 className="font-pixel font-bold text-xs text-amber-900 mb-1 flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-amber-900 text-amber-100 font-pixel-title text-[9px]">TAHAP 3</span>
                  SIMULATION GAME (Rescue Lab)
                </h4>
                <p className="font-pixel">
                  Rakit logika sensor peringatan dini kebencanaan dan jalankan simulasi respon mitigasi evakuasi secara interaktif!
                </p>
              </div>

            </div>

            {/* Action button */}
            <button
              onClick={() => {
                retroAudio.playSelect();
                setShowGuideModal(false);
                handleLevelClick(1, '/level1');
              }}
              className="pixel-btn-wood-plank !w-full !h-12 !text-xs !bg-amber-800 !text-white mt-2 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>MULAI PETUALANGAN TAHAP 1</span>
              <span className="font-bold">&gt;</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
