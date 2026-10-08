import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/teacherStore';
import { retroAudio } from '../../utils/retroAudio';
import { toggleFullscreen, isFullscreenActive } from '../../utils/fullscreen';
import { PixelAvatarRenderer } from '../../components/PixelAvatar/PixelAvatarRenderer';
import PixelIcon from '../../components/PixelIcon';
import { ResqyTutorialOverlay } from '../../components/Tutorial/ResqyTutorialOverlay';
import { TUTORIAL_TOURS } from '../../components/Tutorial/tutorialConfig';

export default function Dashboard() {
  const navigate = useNavigate();
  const student = useAuthStore((state) => state.student);
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const unlockedLevel = useAuthStore((state) => state.unlockedLevel);

  const [soundOn, setSoundOn] = useState(() => retroAudio.isEnabled());
  const [isFullscreen, setIsFullscreen] = useState(() => isFullscreenActive());
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [guideTab, setGuideTab] = useState<'all' | 'level1' | 'level2' | 'level3'>('all');

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
      <header id="tour-dash-hud" className="relative z-20 w-full px-4 md:px-8 pt-4 flex items-start justify-between">

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
            <p className="text-[11px] text-slate-400 font-pixel hidden sm:block">
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
            <span className="hidden sm:inline">GANTI AKUN</span>
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
            id="tour-dash-level1"
            onClick={() => handleLevelClick(1, '/level1')}
            onMouseEnter={() => retroAudio.playHover()}
            className="pixel-btn-wood-plank cursor-pointer"
          >
            <span>LEVEL 1. EARTH EXPLORER</span>
          </button>

          {/* Button 2: Disaster Analyst */}
          {unlockedLevel >= 2 ? (
            <button
              id="tour-dash-level2"
              onClick={() => handleLevelClick(2, '/level2')}
              onMouseEnter={() => retroAudio.playHover()}
              className="pixel-btn-wood-plank cursor-pointer"
            >
              <span>LEVEL 2. DISASTER ANALYST</span>
            </button>
          ) : (
            <button
              id="tour-dash-level2"
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
              id="tour-dash-level3"
              onClick={() => handleLevelClick(3, '/level3')}
              onMouseEnter={() => retroAudio.playHover()}
              className="pixel-btn-wood-plank cursor-pointer"
            >
              <span>LEVEL 3. SIMULATION GAME</span>
            </button>
          ) : (
            <button
              id="tour-dash-level3"
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
            id="tour-dash-guide"
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
            id="tour-dash-profile"
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
            id="tour-dash-extra"
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

      {/* ── 5. RETRO WOODEN NOTICE BOARD MODAL (PANDUAN & MISI) ── */}
      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="pixel-wood-board p-4 sm:p-6 md:p-7 text-[#260c02] space-y-4 sm:space-y-5 max-h-[92vh] overflow-y-auto font-pixel"
            style={{ width: '880px', maxWidth: '96vw' }}
            onClick={(e) => e.stopPropagation()}
          >

            {/* Header */}
            <div className="flex items-center justify-between border-b-2 sm:border-b-3 border-amber-950/30 pb-3 sm:pb-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-amber-900 text-amber-100 flex items-center justify-center border-2 border-amber-950 shadow-[0_2px_0_#231206] shrink-0">
                  <PixelIcon name="book" size={24} />
                </div>
                <div>
                  <h3 className="font-pixel-title text-base sm:text-lg md:text-xl lg:text-2xl font-black text-[#260c02] flex items-center gap-2">
                    <span>PANDUAN &amp; MISI PEMBELAJARAN</span>
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-[#381504] font-extrabold font-pixel mt-0.5">
                    Kurikulum IPA SMP Kelas 8 • Gamifikasi Mitigasi Bencana RESQ-BOX
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  retroAudio.playSelect();
                  setShowGuideModal(false);
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-100 flex items-center justify-center border-2 border-amber-950 font-bold shadow-[0_2px_0_#231206] cursor-pointer shrink-0 transition-transform active:scale-95"
                title="Tutup Panduan"
              >
                <PixelIcon name="cross" size={16} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 p-1.5 bg-amber-950/20 rounded-xl border border-amber-950/40 text-xs sm:text-sm md:text-base">
              <button
                type="button"
                onClick={() => {
                  retroAudio.playHover();
                  setGuideTab('all');
                }}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-3 rounded-lg font-pixel-title font-bold transition-all cursor-pointer text-xs sm:text-sm md:text-base ${guideTab === 'all'
                  ? 'bg-amber-900 text-amber-100 shadow-[0_2px_0_#231206]'
                  : 'bg-amber-100/70 hover:bg-amber-100 text-amber-950 border border-amber-900/20'
                  }`}
              >
                <PixelIcon name="map" size={16} />
                <span>SEMUA TAHAP</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  retroAudio.playHover();
                  setGuideTab('level1');
                }}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-3 rounded-lg font-pixel-title font-bold transition-all cursor-pointer text-xs sm:text-sm md:text-base ${guideTab === 'level1'
                  ? 'bg-amber-900 text-amber-100 shadow-[0_2px_0_#231206]'
                  : 'bg-amber-100/70 hover:bg-amber-100 text-amber-950 border border-amber-900/20'
                  }`}
              >
                <PixelIcon name="divergent" size={16} />
                <span>TAHAP 1</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  retroAudio.playHover();
                  setGuideTab('level2');
                }}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-3 rounded-lg font-pixel-title font-bold transition-all cursor-pointer text-xs sm:text-sm md:text-base ${guideTab === 'level2'
                  ? 'bg-amber-900 text-amber-100 shadow-[0_2px_0_#231206]'
                  : 'bg-amber-100/70 hover:bg-amber-100 text-amber-950 border border-amber-900/20'
                  }`}
              >
                <PixelIcon name="earthquake" size={16} />
                <span>TAHAP 2</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  retroAudio.playHover();
                  setGuideTab('level3');
                }}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-3 rounded-lg font-pixel-title font-bold transition-all cursor-pointer text-xs sm:text-sm md:text-base ${guideTab === 'level3'
                  ? 'bg-amber-900 text-amber-100 shadow-[0_2px_0_#231206]'
                  : 'bg-amber-100/70 hover:bg-amber-100 text-amber-950 border border-amber-900/20'
                  }`}
              >
                <PixelIcon name="volcano" size={16} />
                <span>TAHAP 3</span>
              </button>
            </div>

            {/* Content Display */}
            <div className="space-y-4 font-pixel text-[#1a0800]">

              {/* ── TAB: SEMUA TAHAP (OVERVIEW) ── */}
              {guideTab === 'all' && (
                <>
                  {/* Kartu Pengantar: Apa itu RESQ-BOX & Apa yang Dipelajari */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-200/95 border-2 sm:border-3 border-amber-900/40 space-y-3 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-md bg-amber-900 text-amber-100 font-pixel-title text-xs sm:text-sm font-bold shadow-[0_1px_0_#231206]">
                          TENTANG PLATFORM
                        </span>
                        <h4 className="font-pixel-title font-black text-xs sm:text-sm md:text-base lg:text-[17px] text-[#260c02]">
                          SELAMAT DATANG DI RESQ-BOX!
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-amber-800 text-amber-100 font-black text-xs sm:text-sm shadow-sm">
                        MEDIA IPA SMP KELAS 8
                      </span>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed text-[#1a0800] font-extrabold">
                      Hai penjelajah muda! <strong className="font-black text-[#1a0800]">RESQ-BOX</strong> adalah platform web media pembelajaran interaktif IPA SMP Kelas 8 berbasis petualangan eksplorasi dan gamifikasi mitigasi bencana geologis.
                    </p>
                    <div className="text-sm sm:text-base md:text-[17px] leading-relaxed bg-[#fef08a] p-3.5 sm:p-4 rounded-xl border-2 border-amber-900/40 flex flex-col gap-2.5 font-bold text-[#1a0800] shadow-sm">
                      <div className="font-black text-[#1a0800] uppercase tracking-wide">
                        Materi Utama yang Akan Kamu Pelajari di Sini:
                      </div>
                      <ul className="list-disc list-inside space-y-2 text-[#200b01] font-bold">
                        <li>
                          <strong className="font-black text-[#1a0800]">1. Struktur Interior Bumi &amp; Batas Lempeng:</strong> Menembus interior bumi dari kerak (0 km), mantel, hingga bola besi padat inti dalam (6.371 km) serta dinamika 3 batas lempeng tektonik (Divergen, Konvergen subduksi laut, dan Transform patahan sesar San Andreas).
                        </li>
                        <li>
                          <strong className="font-black text-[#1a0800]">2. Kesiapsiagaan Bencana Geologis:</strong> Menelusuri kawasan lereng Gunung Merapi, menguasai SOP Kesiapsiagaan Mandiri 72 Jam &amp; Tas Siaga Bencana (TSB), drill darurat gempa (Drop, Cover, and Hold On), pembacaan seismograf &amp; 4 status PVMBG, peta Kawasan Rawan Bencana (KRB), dan manajemen barak pengungsian BNPB.
                        </li>
                        <li>
                          <strong className="font-black text-[#1a0800]">3. Otomatisasi Sistem Peringatan Dini (EWS):</strong> Merakit logika aksi-reaksi sensor bencana (piezo seismik, suhu kawah) ke lampu 4 warna dan sirine EWS melalui Visual Block Coding ramah anak, serta menguji dampaknya pada respon evakuasi 75 AI warga di maket Digital Twin 3D Merapi!
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Tahap 1 Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-100/90 border-2 sm:border-3 border-amber-900/40 space-y-3 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-md bg-amber-900 text-amber-100 font-pixel-title text-xs sm:text-sm font-bold shadow-[0_1px_0_#231206]">
                          TAHAP 1
                        </span>
                        <h4 className="font-pixel-title font-black text-xs sm:text-sm md:text-base lg:text-[17px] text-[#260c02]">
                          EARTH EXPLORER (Struktur Bumi &amp; Dinamika Lempeng)
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-sky-200 text-sky-950 font-black text-xs sm:text-sm border border-sky-800/40">
                          8 Area Geologis
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-sm">
                          {unlockedLevel >= 2 ? '✓ TUNTAS' : 'AKTIF'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed text-[#1a0800] font-extrabold">
                      Petualangan vertikal menembus interior bumi dari Permukaan (0 km), Kerak, Mantel, Inti Luar, Inti Dalam (6.371 km), hingga 3 batas lempeng tektonik: Divergen, Konvergen (subduksi laut), dan Transform (sesar San Andreas).
                    </p>
                    <div className="text-sm sm:text-base md:text-[17px] leading-relaxed bg-[#fef08a] p-3.5 sm:p-4 rounded-xl border-2 border-amber-900/40 flex flex-col gap-2.5 font-bold text-[#1a0800] shadow-sm">
                      <div>
                        <strong className="font-black text-[#1a0800] uppercase tracking-wide">Fitur Kunci: </strong>
                        <span className="font-bold text-[#200b01]">5 Karakter Ekspedisi &amp; Resqy, modul sains [🔍], kristal geotermal, kostum pelindung, dan avatar tracker 60 FPS.</span>
                      </div>
                      <div>
                        <strong className="font-black text-[#1a0800] uppercase tracking-wide">Misi Kelulusan: </strong>
                        <span className="font-bold text-[#200b01]">Pecahkan kuis tebak kata <strong className="font-black text-[#1a0800] underline decoration-amber-700/60">Wordle Sains</strong> bersama Bu Tyas di tiap gerbang strata untuk membuka akses ke <strong className="font-black text-[#1a0800]">Level 2</strong>!</span>
                      </div>
                    </div>
                  </div>

                  {/* Tahap 2 Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-100/90 border-2 sm:border-3 border-amber-900/40 space-y-3 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-md bg-orange-800 text-orange-100 font-pixel-title text-xs sm:text-sm font-bold shadow-[0_1px_0_#231206]">
                          TAHAP 2
                        </span>
                        <h4 className="font-pixel-title font-black text-xs sm:text-sm md:text-base lg:text-[17px] text-[#260c02]">
                          DISASTER ANALYST (Karakteristik Bencana &amp; Mitigasi)
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-amber-200 text-amber-950 font-black text-xs sm:text-sm border border-amber-800/40">
                          6 Pos Mitigasi
                        </span>
                        <span className={`px-2.5 py-1 rounded-md font-black text-xs sm:text-sm shadow-sm ${unlockedLevel >= 3
                          ? 'bg-emerald-600 text-white'
                          : unlockedLevel >= 2
                            ? 'bg-amber-600 text-white'
                            : 'bg-stone-300 text-stone-700'
                          }`}>
                          {unlockedLevel >= 3 ? '✓ TUNTAS' : unlockedLevel >= 2 ? 'AKTIF' : '🔒 TERKUNCI'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed text-[#1a0800] font-extrabold">
                      Simulasi kesiapsiagaan 6 pos: Ruang Kelas (SOP 72 Jam &amp; Tas Siaga Bencana), Drill Gempa (Drop-Cover-Hold On), Lapangan Evakuasi (Titik Kumpul), Pos PGA Merapi (Seismograf &amp; Status PVMBG), Simulasi Erupsi (KRB I–III saat AWAS), dan Barak Pengungsian BNPB.
                    </p>
                    <div className="text-sm sm:text-base md:text-[17px] leading-relaxed bg-[#fef08a] p-3.5 sm:p-4 rounded-xl border-2 border-amber-900/40 flex flex-col gap-2.5 font-bold text-[#1a0800] shadow-sm">
                      <div>
                        <strong className="font-black text-[#1a0800] uppercase tracking-wide">Fitur Kunci: </strong>
                        <span className="font-bold text-[#200b01]">Visual Novel modul mitigasi BNPB [🔍], pemahaman zonasi KRB, dan rute keselamatan lereng gunung.</span>
                      </div>
                      <div>
                        <strong className="font-black text-[#1a0800] uppercase tracking-wide">Misi Kelulusan: </strong>
                        <span className="font-bold text-[#200b01]">Jawab seluruh <strong className="font-black text-[#1a0800] underline decoration-amber-700/60">Teka-Teki Silang (TTS Crossword Sains &amp; Mitigasi)</strong> di pos pengujian Bu Tyas untuk membuka akses ke <strong className="font-black text-[#1a0800]">Level 3</strong>!</span>
                      </div>
                    </div>
                  </div>

                  {/* Tahap 3 Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-100/90 border-2 sm:border-3 border-amber-900/40 space-y-3 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-md bg-purple-900 text-purple-100 font-pixel-title text-xs sm:text-sm font-bold shadow-[0_1px_0_#231206]">
                          TAHAP 3
                        </span>
                        <h4 className="font-pixel-title font-black text-xs sm:text-sm md:text-base lg:text-[17px] text-[#260c02]">
                          SIMULATION GAME (Action Lab &amp; Digital Twin 3D)
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-purple-200 text-purple-950 font-black text-xs sm:text-sm border border-purple-800/40">
                          20 Misi Studi Kasus
                        </span>
                        <span className={`px-2.5 py-1 rounded-md font-black text-xs sm:text-sm shadow-sm ${unlockedLevel >= 3 ? 'bg-amber-600 text-white' : 'bg-stone-300 text-stone-700'
                          }`}>
                          {unlockedLevel >= 3 ? 'AKTIF' : '🔒 TERKUNCI'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed text-[#1a0800] font-extrabold">
                      Rakit logika sistem peringatan dini melalui <strong className="font-black text-[#1a0800]">Visual Block Coding Ramah Anak</strong> (Sensor ➔ Lampu 4 Warna ➔ Sirine EWS ➔ Tindakan Evakuasi) dan uji dampaknya pada maket <strong className="font-black text-[#1a0800]">Digital Twin 3D Merapi</strong> topografi STL asli.
                    </p>
                    <div className="text-sm sm:text-base md:text-[17px] leading-relaxed bg-[#fef08a] p-3.5 sm:p-4 rounded-xl border-2 border-amber-900/40 flex flex-col gap-2.5 font-bold text-[#1a0800] shadow-sm">
                      <div>
                        <strong className="font-black text-[#1a0800] uppercase tracking-wide">Fitur Kunci: </strong>
                        <span className="font-bold text-[#200b01]">20 Misi Studi Kasus, Mode Bebas (Proyek Saya Sandbox), gempa 3-tingkat, erupsi eksplosif vs efusif, reaksi 75 AI warga, kontrol simulasi fleksibel, tombol Reset Kondisi, dan koneksi ESP32.</span>
                      </div>
                      <div>
                        <strong className="font-black text-[#1a0800] uppercase tracking-wide">Misi Kelulusan: </strong>
                        <span className="font-bold text-[#200b01]">Tuntaskan 20 Misi Studi Kasus; nilai otomatis tersinkronisasi ke Rapor Siswa di Posko Guru (/teacher)!</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── TAB: TAHAP 1 (EARTH EXPLORER) ── */}
              {guideTab === 'level1' && (
                <div className="space-y-4 animate-fade-in font-pixel">
                  <div className="p-4 sm:p-5 bg-amber-200/90 border-2 sm:border-3 border-amber-900/40 rounded-2xl shadow-sm">
                    <h4 className="font-pixel-title font-bold text-xs sm:text-sm md:text-base lg:text-[17px] text-[#260c02] flex items-center gap-2 mb-2">
                      <PixelIcon name="divergent" size={18} />
                      <span>Fokus Materi: Struktur Interior Bumi &amp; Batas Lempeng Tektonik</span>
                    </h4>
                    <p className="text-sm sm:text-base md:text-lg text-[#1a0800] font-extrabold leading-relaxed">
                      Siswa mengeksplorasi karakteristik fisik, suhu, dan tekanan setiap lapisan bumi secara vertikal serta mengamati fenomena pergerakan lempeng yang memicu fenomena geologis.
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 bg-amber-100/90 border-2 sm:border-3 border-amber-900/40 rounded-2xl space-y-3 shadow-sm">
                    <h5 className="font-pixel-title font-bold text-xs sm:text-sm md:text-base text-[#260c02] flex items-center gap-2">
                      <PixelIcon name="map" size={16} />
                      <span>8 Checkpoint Area Geologis yang Dijelajahi:</span>
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm md:text-base leading-relaxed text-[#1a0800] font-bold">
                      <div className="bg-amber-50/95 p-3.5 rounded-xl border-2 border-amber-900/25">
                        <strong className="font-black text-[#1a0800]">1. Permukaan Bumi (0 km):</strong> Basecamp ekspedisi, perkenalan tim, dan arahan Resqy.
                      </div>
                      <div className="bg-amber-50/95 p-3.5 rounded-xl border-2 border-amber-900/25">
                        <strong className="font-black text-[#1a0800]">2. Kerak Bumi (35 km):</strong> Eksplorasi litosfer, batuan tambang, fosil purba, &amp; rompi safety.
                      </div>
                      <div className="bg-amber-50/95 p-3.5 rounded-xl border-2 border-amber-900/25">
                        <strong className="font-black text-[#1a0800]">3. Mantel Bumi (2.900 km):</strong> Magma silikat, arus konveksi astenosfer, &amp; baju Cryo-Suit.
                      </div>
                      <div className="bg-amber-50/95 p-3.5 rounded-xl border-2 border-amber-900/25">
                        <strong className="font-black text-[#1a0800]">4. Inti Luar (5.150 km):</strong> Logam cair besi-nikel &amp; pembangkit medan geomagnetik bumi.
                      </div>
                      <div className="bg-amber-50/95 p-3.5 rounded-xl border-2 border-amber-900/25">
                        <strong className="font-black text-[#1a0800]">5. Inti Dalam (6.371 km):</strong> Bola besi padat bersuhu tinggi bertekanan &gt;3,6 juta atm.
                      </div>
                      <div className="bg-amber-50/95 p-3.5 rounded-xl border-2 border-amber-900/25">
                        <strong className="font-black text-[#1a0800]">6. Batas Divergen:</strong> Lembah retakan lempeng saling menjauh (East African Rift).
                      </div>
                      <div className="bg-amber-50/95 p-3.5 rounded-xl border-2 border-amber-900/25">
                        <strong className="font-black text-[#1a0800]">7. Batas Konvergen:</strong> Palung subduksi samudra menunjam miring &amp; busur vulkanik.
                      </div>
                      <div className="bg-amber-50/95 p-3.5 rounded-xl border-2 border-amber-900/25">
                        <strong className="font-black text-[#1a0800]">8. Batas Transform:</strong> Patahan sesar San Andreas (Top-Down View, loncat rekahan).
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 bg-amber-100/90 border-2 sm:border-3 border-amber-900/40 rounded-2xl space-y-2.5 text-sm sm:text-base md:text-[17px] leading-relaxed text-[#1a0800] font-bold shadow-sm">
                    <h5 className="font-pixel-title font-bold text-xs sm:text-sm md:text-base text-[#260c02] flex items-center gap-2">
                      <PixelIcon name="star" size={16} />
                      <span>Panduan Bermain &amp; Evaluasi Gerbang:</span>
                    </h5>
                    <ul className="list-disc list-inside space-y-2 text-[#1a0800] font-bold">
                      <li>Gunakan tombol <strong className="font-black text-[#1a0800]">A/D</strong> atau <strong className="font-black text-[#1a0800]">Panah Kiri/Kanan</strong> untuk bergerak, <strong className="font-black text-[#1a0800]">Spasi</strong> untuk melompat, dan <strong className="font-black text-[#1a0800]">E</strong> untuk berinteraksi.</li>
                      <li>Dekati rekan ekspedisi (Zidane, Zahra, Ican, Lintang) bertanda <strong className="font-black text-[#1a0800]">kaca pembesar [🔍]</strong> untuk membaca materi sains.</li>
                      <li>Setiap gerbang strata dijaga oleh <strong className="font-black text-[#1a0800]">Bu Tyas</strong> yang memberikan tantangan <strong className="font-black text-[#1a0800]">Wordle Tebak Kata</strong>. Seluruh kata kunci evaluasi diambil langsung dari materi rekan tim di area terkait!</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* ── TAB: TAHAP 2 (DISASTER ANALYST) ── */}
              {guideTab === 'level2' && (
                <div className="space-y-4 animate-fade-in font-pixel">
                  <div className="p-4 sm:p-5 bg-orange-200/90 border-2 sm:border-3 border-amber-900/40 rounded-2xl shadow-sm">
                    <h4 className="font-pixel-title font-bold text-xs sm:text-sm md:text-base lg:text-[17px] text-[#260c02] flex items-center gap-2 mb-2">
                      <PixelIcon name="earthquake" size={18} />
                      <span>Fokus Materi: Karakteristik Bahaya Gempa, Vulkanisme &amp; Kesiapsiagaan Bencana</span>
                    </h4>
                    <p className="text-sm sm:text-base md:text-lg text-[#1a0800] font-extrabold leading-relaxed">
                      Siswa mempraktikkan mitigasi pra-bencana, saat bencana, dan pasca-bencana secara kontekstual di kawasan rawan bencana lereng Gunung Merapi.
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 bg-amber-100/90 border-2 sm:border-3 border-amber-900/40 rounded-2xl space-y-3 shadow-sm">
                    <h5 className="font-pixel-title font-bold text-xs sm:text-sm md:text-base text-[#260c02] flex items-center gap-2">
                      <PixelIcon name="map" size={16} />
                      <span>6 Pos Mitigasi Kebencanaan Sekuensial:</span>
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm md:text-base leading-relaxed text-[#1a0800] font-bold">
                      <div className="bg-amber-50/95 p-3.5 rounded-xl border-2 border-amber-900/25">
                        <strong className="font-black text-[#1a0800]">1. Ruang Kelas Teori:</strong> SOP Kesiapsiagaan Mandiri 72 Jam &amp; 10 barang wajib Tas Siaga Bencana (TSB).
                      </div>
                      <div className="bg-amber-50/95 p-3.5 rounded-xl border-2 border-amber-900/25">
                        <strong className="font-black text-[#1a0800]">2. Simulasi Drill Gempa:</strong> Prosedur darurat Drop, Cover, and Hold On (merunduk di bawah meja kokoh).
                      </div>
                      <div className="bg-amber-50/95 p-3.5 rounded-xl border-2 border-amber-900/25">
                        <strong className="font-black text-[#1a0800]">3. Lapangan Evakuasi:</strong> Prosedur evakuasi tertib menuju titik kumpul terbuka bebas reruntuhan.
                      </div>
                      <div className="bg-amber-50/95 p-3.5 rounded-xl border-2 border-amber-900/25">
                        <strong className="font-black text-[#1a0800]">4. Pos PGA Merapi:</strong> Pembacaan seismograf &amp; 4 Status PVMBG (Normal, Waspada, Siaga, Awas).
                      </div>
                      <div className="bg-amber-50/95 p-3.5 rounded-xl border-2 border-amber-900/25">
                        <strong className="font-black text-[#1a0800]">5. Simulasi Erupsi Merapi:</strong> Peta zonasi KRB I, II, III saat AWAS, bahaya awan panas, dan EWS.
                      </div>
                      <div className="bg-amber-50/95 p-3.5 rounded-xl border-2 border-amber-900/25">
                        <strong className="font-black text-[#1a0800]">6. Barak Pengungsian BNPB:</strong> Tata kelola posko evakuasi mandiri terpadu di Zona Aman KRB I.
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 bg-amber-100/90 border-2 sm:border-3 border-amber-900/40 rounded-2xl space-y-2.5 text-sm sm:text-base md:text-[17px] leading-relaxed text-[#1a0800] font-bold shadow-sm">
                    <h5 className="font-pixel-title font-bold text-xs sm:text-sm md:text-base text-[#260c02] flex items-center gap-2">
                      <PixelIcon name="star" size={16} />
                      <span>Panduan Bermain &amp; Evaluasi Gerbang:</span>
                    </h5>
                    <ul className="list-disc list-inside space-y-2 text-[#1a0800] font-bold">
                      <li>Jelajahi setiap pos mitigasi dan pelajari modul panduan buku saku BNPB bertanda <strong className="font-black text-[#1a0800]">kaca pembesar [🔍]</strong>.</li>
                      <li>Di setiap pos, temui <strong className="font-black text-[#1a0800]">Bu Tyas</strong> untuk menyelesaikan kuis <strong className="font-black text-[#1a0800]">Teka-Teki Silang (TTS Crossword Mitigasi)</strong>.</li>
                      <li>Menuntaskan seluruh 6 pos mitigasi akan membuka kunci <strong className="font-black text-[#1a0800]">Level 3: Simulation Game</strong>!</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* ── TAB: TAHAP 3 (SIMULATION GAME) ── */}
              {guideTab === 'level3' && (
                <div className="space-y-4 animate-fade-in font-pixel">
                  <div className="p-4 sm:p-5 bg-purple-200/90 border-2 sm:border-3 border-amber-900/40 rounded-2xl shadow-sm">
                    <h4 className="font-pixel-title font-bold text-xs sm:text-sm md:text-base lg:text-[17px] text-[#260c02] flex items-center gap-2 mb-2">
                      <PixelIcon name="volcano" size={18} />
                      <span>Fokus Materi: Logika Otomatisasi EWS &amp; Uji Respon Warga Digital Twin 3D</span>
                    </h4>
                    <p className="text-sm sm:text-base md:text-lg text-[#1a0800] font-extrabold leading-relaxed">
                      Siswa merakit logika sistem peringatan dini bencana menggunakan visual block coding ramah anak dan menguji efektivitas mitigasi pada maket digital 3D berwarga nyata.
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 bg-amber-100/90 border-2 sm:border-3 border-amber-900/40 rounded-2xl space-y-3 shadow-sm">
                    <h5 className="font-pixel-title font-bold text-xs sm:text-sm md:text-base text-[#260c02] flex items-center gap-2">
                      <PixelIcon name="map" size={16} />
                      <span>20 Misi Studi Kasus Terbagi dalam 4 Sektor:</span>
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm md:text-base leading-relaxed text-[#1a0800] font-bold">
                      <div className="bg-amber-50/95 p-3.5 rounded-xl border-2 border-amber-900/25">
                        <strong className="font-black text-[#1a0800]">Sektor 1 (Misi 1–5):</strong> Pengenalan EWS &amp; Pembacaan Sensor Bencana (piezo seismik, suhu kawah, lampu EWS).
                      </div>
                      <div className="bg-amber-50/95 p-3.5 rounded-xl border-2 border-amber-900/25">
                        <strong className="font-black text-[#1a0800]">Sektor 2 (Misi 6–10):</strong> Mitigasi Gempa Bumi 3 Tingkat (Ringan: lari santai, Sedang: duck &amp; cover, Kuat: tiarap).
                      </div>
                      <div className="bg-amber-50/95 p-3.5 rounded-xl border-2 border-amber-900/25">
                        <strong className="font-black text-[#1a0800]">Sektor 3 (Misi 11–15):</strong> Mitigasi Erupsi Efusif (Pemantauan kubah lava &amp; evakuasi menjauhi alur sungai Kali Gendol/Kuning).
                      </div>
                      <div className="bg-amber-50/95 p-3.5 rounded-xl border-2 border-amber-900/25">
                        <strong className="font-black text-[#1a0800]">Sektor 4 (Misi 16–20):</strong> Mitigasi Erupsi Eksplosif (Awan panas wedhus gembel, bom lava, &amp; Grand Challenge).
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 bg-amber-100/90 border-2 sm:border-3 border-amber-900/40 rounded-2xl space-y-2.5 text-sm sm:text-base md:text-[17px] leading-relaxed text-[#1a0800] font-bold shadow-sm">
                    <h5 className="font-pixel-title font-bold text-xs sm:text-sm md:text-base text-[#260c02] flex items-center gap-2">
                      <PixelIcon name="star" size={16} />
                      <span>Alat Bantu &amp; Sinkronisasi Rapor:</span>
                    </h5>
                    <ul className="list-disc list-inside space-y-2 text-[#1a0800] font-bold">
                      <li><strong className="font-black text-[#1a0800]">Blockly Ramah Anak:</strong> Susun blok aksi-reaksi (Sensor ➔ Lampu Status ➔ Sirine EWS ➔ Tindakan Evakuasi). Setiap misi dilengkapi panduan kategori toolbox.</li>
                      <li><strong className="font-black text-[#1a0800]">Digital Twin 3D Merapi:</strong> Amati reaksi 75 AI warga saat bencana berlangsung. Kerusakan tetap terlihat untuk evaluasi dan dapat direset dengan tombol <strong className="font-black text-[#1a0800]">[Reset Kondisi]</strong>.</li>
                      <li><strong className="font-black text-[#1a0800]">Sinkronisasi Guru &amp; Hardware:</strong> Setiap misi yang tuntas langsung terkirim ke Dashboard Guru (5 poin per misi, total 100 poin) dan opsional terhubung ke diorama fisik ESP32.</li>
                    </ul>
                  </div>
                </div>
              )}

            </div>

            {/* Smart Contextual Action Button */}
            {guideTab === 'all' && (
              <button
                onClick={() => {
                  retroAudio.playSelect();
                  setShowGuideModal(false);
                  if (unlockedLevel >= 3) {
                    handleLevelClick(3, '/level3');
                  } else if (unlockedLevel >= 2) {
                    handleLevelClick(2, '/level2');
                  } else {
                    handleLevelClick(1, '/level1');
                  }
                }}
                className="pixel-btn-wood-plank !w-full !h-14 sm:!h-16 !text-xs sm:!text-sm md:!text-base lg:!text-lg !bg-amber-800 hover:!bg-amber-700 !text-white mt-3 cursor-pointer flex items-center justify-center gap-2.5 font-pixel-title font-bold shadow-md transition-all active:scale-[0.99]"
              >
                <span>
                  {unlockedLevel >= 3
                    ? 'LANJUTKAN KE TAHAP 3 (SIMULATION GAME)'
                    : unlockedLevel >= 2
                      ? 'LANJUTKAN KE TAHAP 2 (DISASTER ANALYST)'
                      : 'MULAI PETUALANGAN TAHAP 1'}
                </span>
                <span className="font-bold">&gt;</span>
              </button>
            )}

            {guideTab === 'level1' && (
              <button
                onClick={() => {
                  retroAudio.playSelect();
                  setShowGuideModal(false);
                  handleLevelClick(1, '/level1');
                }}
                className="pixel-btn-wood-plank !w-full !h-14 sm:!h-16 !text-xs sm:!text-sm md:!text-base lg:!text-lg !bg-amber-800 hover:!bg-amber-700 !text-white mt-3 cursor-pointer flex items-center justify-center gap-2.5 font-pixel-title font-bold shadow-md transition-all active:scale-[0.99]"
              >
                <span>MASUK KE TAHAP 1: EARTH EXPLORER</span>
                <span className="font-bold">&gt;</span>
              </button>
            )}

            {guideTab === 'level2' && (
              unlockedLevel >= 2 ? (
                <button
                  onClick={() => {
                    retroAudio.playSelect();
                    setShowGuideModal(false);
                    handleLevelClick(2, '/level2');
                  }}
                  className="pixel-btn-wood-plank !w-full !h-14 sm:!h-16 !text-xs sm:!text-sm md:!text-base lg:!text-lg !bg-amber-800 hover:!bg-amber-700 !text-white mt-3 cursor-pointer flex items-center justify-center gap-2.5 font-pixel-title font-bold shadow-md transition-all active:scale-[0.99]"
                >
                  <span>MASUK KE TAHAP 2: DISASTER ANALYST</span>
                  <span className="font-bold">&gt;</span>
                </button>
              ) : (
                <button
                  onClick={() => retroAudio.playLocked()}
                  className="pixel-btn-wood-plank locked !w-full !h-14 sm:!h-16 !text-xs sm:!text-sm md:!text-base mt-3 flex items-center justify-center gap-2.5 cursor-not-allowed opacity-85 font-pixel-title font-bold"
                  title="Selesaikan Level 1 Terlebih Dahulu"
                >
                  <PixelIcon name="lock" size={16} />
                  <span>SELESAIKAN TAHAP 1 UNTUK MEMBUKA TAHAP 2</span>
                </button>
              )
            )}

            {guideTab === 'level3' && (
              unlockedLevel >= 3 ? (
                <button
                  onClick={() => {
                    retroAudio.playSelect();
                    setShowGuideModal(false);
                    handleLevelClick(3, '/level3');
                  }}
                  className="pixel-btn-wood-plank !w-full !h-14 sm:!h-16 !text-xs sm:!text-sm md:!text-base lg:!text-lg !bg-amber-800 hover:!bg-amber-700 !text-white mt-3 cursor-pointer flex items-center justify-center gap-2.5 font-pixel-title font-bold shadow-md transition-all active:scale-[0.99]"
                >
                  <span>MASUK KE TAHAP 3: SIMULATION GAME</span>
                  <span className="font-bold">&gt;</span>
                </button>
              ) : (
                <button
                  onClick={() => retroAudio.playLocked()}
                  className="pixel-btn-wood-plank locked !w-full !h-14 sm:!h-16 !text-xs sm:!text-sm md:!text-base mt-3 flex items-center justify-center gap-2.5 cursor-not-allowed opacity-85 font-pixel-title font-bold"
                  title="Selesaikan Level 2 Terlebih Dahulu"
                >
                  <PixelIcon name="lock" size={16} />
                  <span>SELESAIKAN TAHAP 2 UNTUK MEMBUKA TAHAP 3</span>
                </button>
              )
            )}

          </div>
        </div>
      )}

      {/* ── 6. RESQY TUTORIAL WALKTHROUGH OVERLAY ── */}
      <ResqyTutorialOverlay
        tour={currentUser?.role === 'teacher' ? TUTORIAL_TOURS.dashboard_teacher : TUTORIAL_TOURS.dashboard_student}
        userId={currentUser?.id}
      />

    </div>
  );
}
