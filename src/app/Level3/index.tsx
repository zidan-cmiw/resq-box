import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MISSIONS, CATEGORIES, type Mission } from '../../missions/data/missions';
import { useMissionStore, loadMissionsForUser } from '../../store/missionStore';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useAuthStore, getActiveCustomAvatar } from '../../store/teacherStore';
import { retroAudio } from '../../utils/retroAudio';
import { toggleFullscreen, isFullscreenActive } from '../../utils/fullscreen';
import { PixelAvatarRenderer } from '../../components/PixelAvatar/PixelAvatarRenderer';
import PixelIcon from '../../components/PixelIcon';
import { syncLevel3Progress } from './level3Sync';
import ResqyTutorialOverlay from '../../components/Tutorial/ResqyTutorialOverlay';
import { TUTORIAL_TOURS } from '../../components/Tutorial/tutorialConfig';

// ── Map Coordinate Config for 20 Missions (Horizontal Winding Path Across Merapi) ──
interface PathNode {
  mission: Mission;
  index: number;
  levelNumber: number;
  x: number;
  y: number;
  labelPos: 'top' | 'bottom';
  sector: 'lembah' | 'gempa' | 'gunung' | 'proyek';
  sectorTitle: string;
}

const MAP_WIDTH = 4650;
const MAP_HEIGHT = 1000;

// Nodes positioned organically like an expedition trail across Merapi biomes (20 Levels, 5 per Sector)
const MAP_NODE_POSITIONS = [
  // ── SEKTOR 1: FONDASI EWS & SEISMIK (Level 1 - 5) ──
  { x: 220, y: 640, labelPos: 'top' as const, sector: 'lembah' as const, sectorTitle: 'Fondasi EWS & Seismik' },
  { x: 440, y: 550, labelPos: 'bottom' as const, sector: 'lembah' as const, sectorTitle: 'Fondasi EWS & Seismik' },
  { x: 660, y: 630, labelPos: 'top' as const, sector: 'lembah' as const, sectorTitle: 'Fondasi EWS & Seismik' },
  { x: 880, y: 540, labelPos: 'bottom' as const, sector: 'lembah' as const, sectorTitle: 'Fondasi EWS & Seismik' },
  { x: 1100, y: 620, labelPos: 'top' as const, sector: 'lembah' as const, sectorTitle: 'Fondasi EWS & Seismik' },

  // ── SEKTOR 2: MITIGASI GEMPA SEKOLAH & RUMAH (Level 6 - 10) ──
  { x: 1320, y: 530, labelPos: 'bottom' as const, sector: 'gempa' as const, sectorTitle: 'Mitigasi Gempa' },
  { x: 1540, y: 440, labelPos: 'top' as const, sector: 'gempa' as const, sectorTitle: 'Mitigasi Gempa' },
  { x: 1760, y: 540, labelPos: 'bottom' as const, sector: 'gempa' as const, sectorTitle: 'Mitigasi Gempa' },
  { x: 1980, y: 630, labelPos: 'top' as const, sector: 'gempa' as const, sectorTitle: 'Mitigasi Gempa' },
  { x: 2200, y: 530, labelPos: 'bottom' as const, sector: 'gempa' as const, sectorTitle: 'Mitigasi Gempa' },

  // ── SEKTOR 3: VULKANOLOGI & ERUPSI MERAPI (Level 11 - 15) ──
  { x: 2420, y: 440, labelPos: 'top' as const, sector: 'gunung' as const, sectorTitle: 'Erupsi Merapi' },
  { x: 2640, y: 530, labelPos: 'bottom' as const, sector: 'gunung' as const, sectorTitle: 'Erupsi Merapi' },
  { x: 2860, y: 620, labelPos: 'top' as const, sector: 'gunung' as const, sectorTitle: 'Erupsi Merapi' },
  { x: 3080, y: 510, labelPos: 'bottom' as const, sector: 'gunung' as const, sectorTitle: 'Erupsi Merapi' },
  { x: 3300, y: 420, labelPos: 'top' as const, sector: 'gunung' as const, sectorTitle: 'Erupsi Merapi' },

  // ── SEKTOR 4: JALUR EVAKUASI & GRAND CHALLENGE (Level 16 - 20) ──
  { x: 3520, y: 510, labelPos: 'bottom' as const, sector: 'proyek' as const, sectorTitle: 'Jalur Evakuasi' },
  { x: 3740, y: 600, labelPos: 'top' as const, sector: 'proyek' as const, sectorTitle: 'Jalur Evakuasi' },
  { x: 3960, y: 500, labelPos: 'bottom' as const, sector: 'proyek' as const, sectorTitle: 'Jalur Evakuasi' },
  { x: 4180, y: 420, labelPos: 'top' as const, sector: 'proyek' as const, sectorTitle: 'Jalur Evakuasi' },
  { x: 4400, y: 500, labelPos: 'bottom' as const, sector: 'proyek' as const, sectorTitle: 'Jalur Evakuasi' },
];

// Smooth Catmull-Rom to Cubic Bezier spline generator (Tactical expedition trail style)
function generateExpeditionTrailRibbon(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) / 5.5;
    const cp1y = p1.y + (p2.y - p0.y) / 5.5;
    const cp2x = p2.x - (p3.x - p1.x) / 5.5;
    const cp2y = p2.y - (p3.y - p1.y) / 5.5;

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x},${p2.y}`;
  }
  return d;
}

export default function Level3() {
  const navigate = useNavigate();
  const { completedMissionIds, isUnlocked } = useMissionStore();
  const { projects, createProject, deleteProject, clearDraft } = useWorkspaceStore();
  const student = useAuthStore((state) => state.student);
  const currentUser = useAuthStore((state) => state.currentUser);
  const avatarConfig = getActiveCustomAvatar();

  // Ensure mission and workspace stores are strictly scoped to the active user
  useEffect(() => {
    const activeId = student?.id || currentUser?.id || 'guest';
    useMissionStore.getState().syncUser(activeId);
    useWorkspaceStore.getState().syncUser(activeId);

    // Passive sync: pastikan progres tersimpan di localStorage juga tersinkronisasi ke Dashboard Guru
    const missions = loadMissionsForUser(activeId);
    if (missions.length > 0) {
      syncLevel3Progress(student);
    }
  }, [student?.id, currentUser?.id]);

  const [soundOn, setSoundOn] = useState(() => retroAudio.isEnabled());
  const [isFullscreen, setIsFullscreen] = useState(() => isFullscreenActive());

  // Modals state
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showLkpdModal, setShowLkpdModal] = useState(false);
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [confirmReplayMissionId, setConfirmReplayMissionId] = useState<string | null>(null);
  const [confirmDeleteProjectId, setConfirmDeleteProjectId] = useState<string | null>(null);

  // Drag & Scroll refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeNodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragScrollLeft, setDragScrollLeft] = useState(0);

  // Build the complete list of path nodes across all 20 missions
  const pathNodes: PathNode[] = MISSIONS.map((mission, idx) => {
    const wave = Math.sin(idx * 0.65) * 115;
    const defaultY = Math.round(520 + wave);
    const defaultX = 220 + idx * 220;

    let sector: 'lembah' | 'gempa' | 'gunung' | 'proyek' = 'lembah';
    let sectorTitle = 'Fondasi EWS';
    if (mission.category === 'gempa') {
      sector = 'gempa';
      sectorTitle = 'Mitigasi Gempa';
    } else if (mission.category === 'gunung') {
      sector = 'gunung';
      sectorTitle = 'Erupsi Merapi';
    } else if (mission.category === 'proyek') {
      sector = 'proyek';
      sectorTitle = 'Jalur Evakuasi';
    }

    const pos = MAP_NODE_POSITIONS[idx] || {
      x: defaultX,
      y: defaultY,
      labelPos: (idx % 2 === 0 ? 'top' : 'bottom') as 'top' | 'bottom',
      sector,
      sectorTitle,
    };

    return {
      mission,
      index: idx,
      levelNumber: idx + 1,
      x: pos.x,
      y: pos.y,
      labelPos: pos.labelPos,
      sector: pos.sector,
      sectorTitle: pos.sectorTitle,
    };
  });

  // Calculate current active (highest unlocked, not yet completed) node
  const activeNode = (() => {
    for (let i = 0; i < pathNodes.length; i++) {
      const node = pathNodes[i];
      if (isUnlocked(node.mission.id) && !completedMissionIds.includes(node.mission.id)) {
        return node;
      }
    }
    const unlockedNodes = pathNodes.filter((n) => isUnlocked(n.mission.id));
    return unlockedNodes[unlockedNodes.length - 1] || pathNodes[0];
  })();

  const totalCompleted = completedMissionIds.filter((id) => MISSIONS.some((m) => m.id === id)).length;
  const progressPercent = Math.round((totalCompleted / MISSIONS.length) * 100);

  // Monitor fullscreen
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(isFullscreenActive());
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Smooth scroll horizontally to active node on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeNodeRef.current && scrollContainerRef.current) {
        activeNodeRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [activeNode?.levelNumber]);

  const handleSoundToggle = () => {
    const next = retroAudio.toggleSound();
    setSoundOn(next);
  };

  const handleFullscreenToggle = () => {
    retroAudio.playSelect();
    toggleFullscreen((state) => setIsFullscreen(state));
  };

  // Mouse wheel horizontal scroll handler
  const handleWheel = (e: React.WheelEvent) => {
    if (scrollContainerRef.current) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        scrollContainerRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  // Drag to pan map
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a, input, select')) return;
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setDragStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setDragScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - dragStartX) * 1.4;
    scrollContainerRef.current.scrollLeft = dragScrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const panLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -450, behavior: 'smooth' });
    }
  };

  const panRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 450, behavior: 'smooth' });
    }
  };

  const handleNodeClick = (node: PathNode) => {
    const unlocked = isUnlocked(node.mission.id);
    if (!unlocked) {
      retroAudio.playLocked();
      return;
    }
    retroAudio.playSelect();
    setSelectedMission(node.mission);
  };

  const handleStartMission = (missionId: string) => {
    retroAudio.playSelect();
    if (completedMissionIds.includes(missionId)) {
      setConfirmReplayMissionId(missionId);
    } else {
      navigate(`/workspace?mission=${missionId}`);
    }
  };

  const handleConfirmReplay = (missionId: string) => {
    clearDraft(missionId);
    setConfirmReplayMissionId(null);
    setSelectedMission(null);
    navigate(`/workspace?mission=${missionId}`);
  };

  const handleCreateNewProject = () => {
    if (!newProjectName.trim()) return;
    const project = createProject(newProjectName.trim());
    setShowNewProjectModal(false);
    setShowProjectsModal(false);
    setNewProjectName('');
    navigate(`/workspace?project=${project.id}`);
  };

  const ribbonPoints = pathNodes.map((n) => ({ x: n.x, y: n.y }));
  const ribbonD = generateExpeditionTrailRibbon(ribbonPoints);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden select-none bg-[#0c1a2e] font-['Plus_Jakarta_Sans',sans-serif] text-slate-100">

      {/* ── 1. FLOATING MINIMALIST RETRO HUD (No Giant Fixed Header, No Emojis!) ── */}
      {/* Top Left: Back & Title Badge */}
      <div className="fixed top-3 left-3 z-40 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => {
            retroAudio.playSelect();
            navigate('/');
          }}
          className="pixel-btn-wood-compact text-[13px] sm:text-[15px] py-2 px-3.5 text-amber-100 hover:text-white flex items-center gap-2 shadow-2xl backdrop-blur-md cursor-pointer font-bold"
        >
          <PixelIcon name="chevron-left" size={16} />
          <span>MENU UTAMA</span>
        </button>
      </div>

      {/* Top Right: Progress & Tools (No Emojis!) */}
      <div className="fixed top-3 right-3 z-40 flex items-center gap-2 pointer-events-auto">
        {/* Progress pill (SS 3 Warm Parchment) */}
        <div className="bg-[#fffbeb]/95 border-2 border-[#b45309] px-3.5 py-1.5 rounded-xl shadow-2xl backdrop-blur-md hidden md:flex items-center gap-2.5">
          <span className="text-[13px] sm:text-[15px] font-bold text-[#78350f] font-pixel">
            TUNTAS: {totalCompleted} / {MISSIONS.length}
          </span>
          <div className="w-24 h-2.5 bg-[#fefce8] rounded-full border border-[#b45309] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#d97706] to-[#15803d] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[13px] font-extrabold text-[#15803d] font-pixel">{progressPercent}%</span>
        </div>

        {/* My Projects */}
        <button
          id="tour-level3-my-projects"
          onClick={() => {
            retroAudio.playSelect();
            setShowProjectsModal(true);
          }}
          className="pixel-btn-wood-compact text-[13px] sm:text-[15px] py-2 px-3 text-amber-100 hover:text-white flex items-center gap-1.5 shadow-2xl backdrop-blur-md cursor-pointer font-bold font-pixel"
          title="Proyek Saya (Sandbox)"
        >
          <PixelIcon name="folder" size={16} />
          <span>PROYEK SAYA</span>
        </button>

        {/* Sound toggle */}
        <button aria-label="Nyalakan atau matikan suara"
          onClick={handleSoundToggle}
          className="p-2.5 rounded-xl bg-[#24160c]/90 hover:bg-[#3d2412] text-amber-300 border-2 border-amber-900/80 shadow-2xl transition-colors cursor-pointer"
          title={soundOn ? 'Matikan Suara' : 'Nyalakan Suara'}
        >
          <PixelIcon name={soundOn ? 'sound-on' : 'sound-off'} size={18} />
        </button>

        {/* Fullscreen toggle */}
        <button aria-label="Masuk atau keluar dari layar penuh"
          onClick={handleFullscreenToggle}
          className="p-2.5 rounded-xl bg-[#24160c]/90 hover:bg-[#3d2412] text-amber-300 border-2 border-amber-900/80 shadow-2xl transition-colors cursor-pointer"
          title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
        >
          <PixelIcon name="computer" size={18} />
        </button>
      </div>

      {/* ── 2. FULLSCREEN HORIZONTAL MERAPI WORLD MAP CONTAINER ── */}
      <div
        ref={scrollContainerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full h-full overflow-x-auto overflow-y-hidden select-none scroll-smooth bg-[#0c1a2e] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* World Map Wrapper (3800px wide, fills 100% of viewport height) */}
        <div
          className="relative shrink-0 overflow-hidden"
          style={{ width: `${MAP_WIDTH}px`, height: '100%' }}
        >
          {/* ── SVG LAYER: BRIGHT SKY, REALISTIC MOUNT MERAPI, GROUNDED LANDMARKS & CANDY TRAIL ── */}
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Area 6 Morning Hope Panoramic Sky Gradient (Dataran Rendah KRB I) */}
              <linearGradient id="merapiSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="35%" stopColor="#0284c7" />
                <stop offset="70%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#fef08a" />
              </linearGradient>

              {/* Realistic Stratovolcano Cone Gradient */}
              <linearGradient id="volcanoConeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#57534e" />
                <stop offset="35%" stopColor="#44403c" />
                <stop offset="70%" stopColor="#292524" />
                <stop offset="100%" stopColor="#1c1917" />
              </linearGradient>

              {/* Shaded Flank of Volcano (East Couloir) */}
              <linearGradient id="volcanoShadeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#292524" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              {/* Active Crater Caldera Magma Glow */}
              <linearGradient id="craterLavaGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="35%" stopColor="#f97316" />
                <stop offset="75%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>

              {/* Stainless Steel Tank Gradient for Clean Water Supply */}
              <linearGradient id="stainlessSteelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="30%" stopColor="#f1f5f9" />
                <stop offset="70%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>

              {/* River Water Gradient */}
              <linearGradient id="riverWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>

              {/* Foothill & Terrain Green Gradients */}
              <linearGradient id="hillGreenGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#15803d" />
                <stop offset="50%" stopColor="#166534" />
                <stop offset="75%" stopColor="#14532d" />
                <stop offset="100%" stopColor="#292524" />
              </linearGradient>

              <linearGradient id="hillGreenGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#16a34a" />
                <stop offset="45%" stopColor="#15803d" />
                <stop offset="75%" stopColor="#166534" />
                <stop offset="100%" stopColor="#1c1917" />
              </linearGradient>

              <linearGradient id="hillGreenGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="50%" stopColor="#16a34a" />
                <stop offset="80%" stopColor="#15803d" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              {/* Billowing Volcanic Smoke Filter (Level 2 Simulation Style) */}
              <filter id="merapiSmokeFilter" x="-40%" y="-40%" width="180%" height="180%">
                <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" result="displaced" />
                <feGaussianBlur in="displaced" stdDeviation="4.5" />
              </filter>
            </defs>

            {/* 1. FULL WIDTH SKY & OUTDOOR ATMOSPHERE (Area 6 KRB I - X: 0 to 3800) */}
            <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#merapiSkyGrad)" />

            {/* Radiant Morning Hope Sun over Sleman Foothills */}
            <circle cx="480" cy="140" r="54" fill="#fef08a" opacity="0.9" />
            <circle cx="480" cy="140" r="85" fill="#fde047" opacity="0.35" />
            <circle cx="480" cy="140" r="125" fill="#fef08a" opacity="0.15" />

            {/* Drifting Soft White Clouds Across Full 4650px Map */}
            {[
              { x: 120, y: 75, s: 1.15 }, { x: 580, y: 90, s: 0.9 },
              { x: 1080, y: 65, s: 1.2 }, { x: 1560, y: 80, s: 1.05 },
              { x: 2060, y: 65, s: 1.25 }, { x: 2580, y: 85, s: 0.95 },
              { x: 3080, y: 70, s: 1.1 }, { x: 3520, y: 60, s: 1.0 },
              { x: 4020, y: 75, s: 1.15 }, { x: 4420, y: 85, s: 0.9 },
            ].map((cloud, i) => (
              <g key={`cloud_${i}`} transform={`translate(${cloud.x}, ${cloud.y}) scale(${cloud.s})`}>
                <ellipse cx="40" cy="20" rx="38" ry="15" fill="#ffffff" opacity="0.92" />
                <ellipse cx="65" cy="14" rx="28" ry="18" fill="#ffffff" opacity="0.96" />
                <ellipse cx="25" cy="22" rx="22" ry="13" fill="#ffffff" opacity="0.9" />
                <ellipse cx="85" cy="24" rx="24" ry="11" fill="#ffffff" opacity="0.85" />
              </g>
            ))}

            {/* Birds Soaring Freely Across Morning Sky */}
            {[
              { x: 260, y: 110 }, { x: 285, y: 102 }, { x: 310, y: 115 },
              { x: 1350, y: 105 }, { x: 1375, y: 98 }, { x: 1400, y: 112 },
              { x: 2420, y: 120 }, { x: 2445, y: 114 }, { x: 2470, y: 125 },
              { x: 3620, y: 110 }, { x: 3645, y: 104 }, { x: 3670, y: 116 },
            ].map((b, i) => (
              <path
                key={`bird_${i}`}
                d={`M ${b.x},${b.y} Q ${b.x + 6},${b.y - 6} ${b.x + 12},${b.y} Q ${b.x + 18},${b.y - 6} ${b.x + 24},${b.y}`}
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="2"
                opacity="0.55"
              />
            ))}

            {/* Distant Mountain Silhouettes (Pegunungan Menoreh & Merbabu in Morning Haze) */}
            <path
              d="M 0,380 Q 500,320 1000,360 T 2000,330 T 3000,350 T 4000,340 L 4650,340 L 4650,600 L 0,600 Z"
              fill="#0284c7"
              opacity="0.25"
            />
            <path
              d="M 0,420 Q 600,350 1200,400 T 2200,370 T 3200,390 T 4200,380 L 4650,380 L 4650,650 L 0,650 Z"
              fill="#0369a1"
              opacity="0.3"
            />

            {/* ── REALISTIC GUNUNG MERAPI STRATOVOLCANO (Distant KRB I View) ── */}
            <g id="merapi_volcano_realistic">
              {/* Distant Mountain Shoulder */}
              <path
                d="M 2350,750 Q 2750,520 3150,360 Q 3450,220 3680,140 Q 3950,230 4650,340 L 4650,900 L 2350,900 Z"
                fill="#334155"
                opacity="0.45"
              />

              {/* Main Stratovolcano Massif with Steep Flanks */}
              <path
                d="M 2450,780 Q 2850,540 3220,380 Q 3500,230 3680,140 Q 3900,220 4650,320 L 4650,900 L 2450,900 Z"
                fill="url(#volcanoConeGrad)"
              />

              {/* East Flank Shading (Volcanic Ridge Contrast) */}
              <path
                d="M 3680,140 Q 3900,220 4650,320 L 4650,900 L 3680,900 Z"
                fill="url(#volcanoShadeGrad)"
                opacity="0.55"
              />

              {/* Caldera Summit Notch & Glowing Lava Dome (X: 3680, Y: 140) */}
              <ellipse cx="3680" cy="142" rx="72" ry="20" fill="#1c1917" />
              <ellipse cx="3680" cy="144" rx="55" ry="14" fill="url(#craterLavaGlow)" />
              <ellipse cx="3680" cy="144" rx="38" ry="8" fill="#fef08a" opacity="0.85" />

              {/* Billowing Volcanic Smoke with Filter */}
              <g id="merapi_crater_smoke" filter="url(#merapiSmokeFilter)">
                <ellipse cx="3670" cy="105" rx="35" ry="22" fill="#cbd5e1" opacity="0.6" />
                <ellipse cx="3700" cy="85" rx="42" ry="26" fill="#e2e8f0" opacity="0.55" />
                <circle cx="3660" cy="60" r="38" fill="#94a3b8" opacity="0.45" />
                <circle cx="3710" cy="40" r="46" fill="#64748b" opacity="0.35" />
                <ellipse cx="3680" cy="15" rx="55" ry="30" fill="#475569" opacity="0.25" />
                <circle cx="3640" cy="95" r="24" fill="#fb923c" opacity="0.3" />
                <circle cx="3720" cy="75" r="28" fill="#f97316" opacity="0.25" />
              </g>

              {/* Volcanic Gullies & Distant Lava Veins (Alur Lahar Kali Gendol) */}
              <path
                d="M 3680,155 Q 3540,310 3320,510 T 3080,720"
                fill="none"
                stroke="#1c1917"
                strokeWidth="20"
                strokeLinecap="round"
                opacity="0.85"
              />
              <path
                d="M 3680,155 Q 3540,310 3320,510 T 3080,720"
                fill="none"
                stroke="#f97316"
                strokeWidth="4"
                strokeDasharray="16 28"
                opacity="0.65"
              />
              <path
                d="M 3680,155 Q 3800,300 3920,460"
                fill="none"
                stroke="#1c1917"
                strokeWidth="14"
                strokeLinecap="round"
                opacity="0.85"
              />
            </g>

            {/* ── FULL WIDTH ROLLING HILLS (Sektor 1 sampai Sektor 4, X: 0 to 4650) ── */}
            <path
              d="M 0,470 Q 500,420 1100,450 T 2100,440 T 3100,480 T 4100,470 L 4650,500 L 4650,1000 L 0,1000 Z"
              fill="url(#hillGreenGrad1)"
            />
            <path
              d="M 0,530 Q 550,490 1200,510 T 2200,500 T 3200,540 T 4200,520 L 4650,550 L 4650,1000 L 0,1000 Z"
              fill="url(#hillGreenGrad2)"
            />
            <path
              d="M 0,610 Q 600,570 1300,590 T 2300,580 T 3300,620 T 4300,600 L 4650,630 L 4650,1000 L 0,1000 Z"
              fill="url(#hillGreenGrad3)"
            />

            {/* Pine Forest Clusters across All Sectors (Identik Area 6 Level 2) */}
            {[
              { x: 140, y: 440 }, { x: 220, y: 460 }, { x: 380, y: 430 },
              { x: 720, y: 450 }, { x: 800, y: 430 }, { x: 1240, y: 400 },
              { x: 1320, y: 420 }, { x: 1840, y: 410 }, { x: 1920, y: 390 },
              { x: 2380, y: 370 }, { x: 2460, y: 390 }, { x: 2850, y: 360 },
              { x: 2930, y: 380 }, { x: 3260, y: 370 }, { x: 3480, y: 390 },
              { x: 3880, y: 390 }, { x: 4120, y: 410 }, { x: 4380, y: 420 },
            ].map((pt, i) => (
              <g key={`pine_${i}`} transform={`translate(${pt.x}, ${pt.y})`}>
                <ellipse cx="10" cy="38" rx="14" ry="4" fill="#0f172a" opacity="0.3" />
                <rect x="8" y="24" width="4" height="14" fill="#451a03" />
                <polygon points="10,-10 -2,12 22,12" fill="#166534" />
                <polygon points="10,4 -5,26 25,26" fill="#14532d" />
              </g>
            ))}

            {/* Bebatuan Andesit & Bunga Tropis Dataran Rendah */}
            {[
              { x: 180, y: 670, isRock: true }, { x: 260, y: 690, isRock: false },
              { x: 420, y: 630, isRock: false }, { x: 620, y: 680, isRock: true },
              { x: 860, y: 610, isRock: true }, { x: 1040, y: 580, isRock: false },
              { x: 1380, y: 560, isRock: true }, { x: 1620, y: 670, isRock: false },
              { x: 1840, y: 580, isRock: true }, { x: 2080, y: 490, isRock: false },
              { x: 2320, y: 560, isRock: true }, { x: 2540, y: 640, isRock: false },
              { x: 2820, y: 540, isRock: true }, { x: 3100, y: 460, isRock: false },
              { x: 3360, y: 520, isRock: true }, { x: 3640, y: 420, isRock: false },
              { x: 3880, y: 530, isRock: true }, { x: 4120, y: 450, isRock: false },
              { x: 4360, y: 510, isRock: true }, { x: 4520, y: 470, isRock: false },
            ].map((item, i) =>
              item.isRock ? (
                <g key={`rock_${i}`} transform={`translate(${item.x}, ${item.y})`}>
                  <rect x="0" y="0" width="10" height="6" fill="#475569" rx="1" />
                  <rect x="1" y="0" width="8" height="2" fill="#64748b" />
                  <rect x="0" y="4" width="10" height="2" fill="#334155" />
                </g>
              ) : (
                <g key={`flower_${i}`} transform={`translate(${item.x}, ${item.y})`}>
                  <rect x="1" y="2" width="2" height="6" fill="#16a34a" />
                  <circle cx="2" cy="1" r="3" fill={i % 2 === 0 ? '#fde047' : '#38bdf8'} />
                </g>
              )
            )}

            {/* ══════════════════════════════════════════════════════════════════════════ */}
            {/* ── AREA 6 LANDMARKS (PERSIS AREA 6 LEVEL 2 - ZERO TEXT / ZERO NAMA) ── */}
            {/* ══════════════════════════════════════════════════════════════════════════ */}

            {/* 1. Gapura Masuk Dusun Destana (X: 100, Y: 600) - Murni Tanpa Teks */}
            <g id="landmark_gate_destana" transform="translate(100, 600)">
              {/* Tiang Baja Oranye BPBD Kiri & Kanan */}
              <rect x="-24" y="-60" width="8" height="60" fill="#ea580c" rx="1" />
              <rect x="24" y="-60" width="8" height="60" fill="#ea580c" rx="1" />
              <rect x="-22" y="-60" width="4" height="60" fill="#c2410c" />
              <rect x="26" y="-60" width="4" height="60" fill="#c2410c" />
              {/* Palang Papan Arah Gelap Bergaris Cyan (Tanpa Tulisan) */}
              <rect x="-45" y="-74" width="90" height="16" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="-35" y="-68" width="70" height="4" rx="2" fill="#0284c7" opacity="0.6" />
              {/* Lampu Sirine Siaga di Pucuk Tiang */}
              <rect x="-23" y="-80" width="6" height="6" fill="#f59e0b" rx="1" />
              <rect x="25" y="-80" width="6" height="6" fill="#f59e0b" rx="1" />
            </g>

            {/* 2. Spanduk Gerbang BPBD (X: 340, Y: 520) - Tanpa Teks Tulisan */}
            <g id="landmark_shelter_banner" transform="translate(340, 520)">
              {/* Tiang Penyangga Spanduk Baja */}
              <rect x="-70" y="0" width="6" height="90" fill="#475569" rx="1" />
              <rect x="66" y="0" width="6" height="90" fill="#475569" rx="1" />
              {/* Spanduk Utama Oranye-Kuning Resmi BPBD (Badge Bersih Tanpa Teks) */}
              <rect x="-78" y="6" width="158" height="34" rx="6" fill="#ea580c" stroke="#facc15" strokeWidth="2.5" />
              <rect x="-68" y="14" width="138" height="6" rx="3" fill="#facc15" opacity="0.8" />
              <rect x="-48" y="24" width="98" height="4" rx="2" fill="#fef08a" opacity="0.6" />
              {/* Lampu Strobo Siaga Merah di Tiang Spanduk */}
              <circle cx="-67" cy="0" r="4" fill="#ef4444" />
              <circle cx="69" cy="0" r="4" fill="#ef4444" />
            </g>

            {/* 3. Tenda Pleton Utama BPBD (X: 580, Y: 520) - Tanpa Teks Tulisan */}
            <g id="landmark_bpbd_shelter_tent" transform="translate(580, 520)">
              <ellipse cx="0" cy="118" rx="88" ry="12" fill="#0f172a" opacity="0.35" />
              {/* Dinding Luar Tenda Oranye */}
              <polygon points="-80,115 -60,30 0,0 60,30 80,115" fill="#c2410c" />
              <polygon points="-60,30 0,0 60,30 50,115 -50,115" fill="#ea580c" />
              {/* Pintu Kain Tenda Terbuka Memperlihatkan Interior Hangat */}
              <rect x="-20" y="45" width="40" height="70" fill="#7c2d12" />
              <rect x="-16" y="50" width="32" height="65" fill="#fef08a" opacity="0.9" />
              {/* Tali Pancang Tanah */}
              <line x1="-60" y1="30" x2="-95" y2="115" stroke="#78716c" strokeWidth="2" />
              <line x1="60" y1="30" x2="95" y2="115" stroke="#78716c" strokeWidth="2" />
              {/* Logo Segitiga BPBD */}
              <circle cx="0" cy="20" r="10" fill="#1e3a8a" />
              <polygon points="0,13 -6,25 6,25" fill="#ea580c" />
              {/* Palet Kayu & Gulungan Matras Biru */}
              <rect x="52" y="102" width="28" height="10" fill="#78350f" rx="1" />
              <rect x="54" y="94" width="24" height="8" fill="#0284c7" rx="2" />
              <rect x="56" y="88" width="20" height="6" fill="#38bdf8" rx="2" />
            </g>

            {/* Karung Pasir (Sandbag Barriers) di Berbagai Posko */}
            <g id="landmark_sandbags_scattered">
              <rect x="220" y="660" width="28" height="8" fill="#b45309" rx="2" />
              <rect x="224" y="654" width="20" height="6" fill="#d97706" rx="2" />
              <rect x="740" y="650" width="28" height="8" fill="#b45309" rx="2" />
              <rect x="744" y="644" width="20" height="6" fill="#d97706" rx="2" />
              <rect x="1340" y="570" width="28" height="8" fill="#b45309" rx="2" />
              <rect x="1344" y="564" width="20" height="6" fill="#d97706" rx="2" />
              <rect x="2020" y="510" width="28" height="8" fill="#b45309" rx="2" />
              <rect x="2024" y="504" width="20" height="6" fill="#d97706" rx="2" />
              <rect x="2960" y="470" width="28" height="8" fill="#b45309" rx="2" />
              <rect x="2964" y="464" width="20" height="6" fill="#d97706" rx="2" />
              <rect x="3820" y="520" width="28" height="8" fill="#b45309" rx="2" />
              <rect x="3824" y="514" width="20" height="6" fill="#d97706" rx="2" />
            </g>

            {/* 4. Tandon Air Bersih Stainless Steel & Pos Cuci Mata (X: 1120, Y: 460) - Tanpa Teks */}
            <g id="landmark_water_tank" transform="translate(1120, 460)">
              <ellipse cx="20" cy="132" rx="42" ry="8" fill="#0f172a" opacity="0.35" />
              {/* Rangka Kaki Baja Penyangga */}
              <rect x="-2" y="60" width="6" height="72" fill="#334155" rx="1" />
              <rect x="36" y="60" width="6" height="72" fill="#334155" rx="1" />
              <line x1="-2" y1="95" x2="42" y2="95" stroke="#475569" strokeWidth="4" />
              {/* Silinder Tangki Stainless Steel */}
              <rect x="-6" y="10" width="52" height="52" fill="url(#stainlessSteelGrad)" rx="3" stroke="#475569" strokeWidth="1" />
              <ellipse cx="20" cy="10" rx="26" ry="8" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
              <rect x="16" y="0" width="8" height="8" fill="#f59e0b" rx="1" />
              {/* Sabuk Pengikat Logam */}
              <rect x="-6" y="24" width="52" height="3" fill="#475569" />
              <rect x="-6" y="44" width="52" height="3" fill="#475569" />
              {/* Keran Air Mengalir & Bak Cuci Mata Darurat */}
              <rect x="42" y="64" width="8" height="4" fill="#38bdf8" />
              <rect x="48" y="68" width="2" height="8" fill="#38bdf8" />
              <line x1="49" y1="76" x2="49" y2="94" stroke="#0ea5e9" strokeWidth="2.5" strokeDasharray="3 3" />
              <rect x="38" y="96" width="22" height="12" fill="#0284c7" rx="2" />
              <rect x="40" y="98" width="18" height="8" fill="#e0f2fe" rx="1" />
            </g>

            {/* 5. Posko Medis PMI (X: 1560, Y: 460) - Tanpa Teks */}
            <g id="landmark_pmi_medical_camp" transform="translate(1560, 460)">
              <ellipse cx="0" cy="118" rx="86" ry="12" fill="#0f172a" opacity="0.35" />
              {/* Tenda Putih Bersih Posko Medis */}
              <polygon points="-70,115 -55,30 0,0 55,30 70,115" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
              <polygon points="-55,30 0,0 55,30 45,115 -45,115" fill="#f8fafc" />
              {/* Lambang Palang Merah Besar di Tengah Dinding */}
              <rect x="-4" y="44" width="8" height="24" fill="#dc2626" rx="1" />
              <rect x="-12" y="52" width="24" height="8" fill="#dc2626" rx="1" />
              {/* Tabung Oksigen Hijau Medis di Samping Tenda */}
              <rect x="52" y="74" width="10" height="40" fill="#15803d" rx="2" />
              <ellipse cx="57" cy="74" rx="5" ry="3" fill="#166534" />
              <rect x="55" y="66" width="4" height="8" fill="#94a3b8" />
              <circle cx="57" cy="64" r="3" fill="#facc15" />
              {/* Kotak Kardus Pasokan Masker Medis */}
              <rect x="-70" y="94" width="24" height="20" fill="#d97706" rx="2" />
              <rect x="-68" y="96" width="20" height="8" fill="#b45309" rx="1" />
            </g>

            {/* 6. Dapur Umum Tagana Kemensos (X: 2240, Y: 440) - Tanpa Teks */}
            <g id="landmark_tagana_kitchen" transform="translate(2240, 440)">
              <ellipse cx="0" cy="118" rx="86" ry="12" fill="#0f172a" opacity="0.35" />
              {/* Tenda Biru Tagana */}
              <polygon points="-70,115 -55,30 0,0 55,30 70,115" fill="#1e3a8a" />
              <polygon points="-55,30 0,0 55,30 45,115 -45,115" fill="#2563eb" />
              {/* Kuali Besar Masakan Hangat */}
              <rect x="50" y="90" width="28" height="14" fill="#334155" rx="2" />
              <path d="M 50,104 A 14,14 0 0,0 78,104 Z" fill="#334155" />
              {/* Api Kompor Gas Biru-Kuning */}
              <rect x="56" y="108" width="16" height="6" fill="#facc15" rx="1" />
              {/* Asap Hangat Masakan Mengepul */}
              <circle cx="64" cy="80" r="5" fill="#ffffff" opacity="0.5" />
              <circle cx="67" cy="68" r="7" fill="#ffffff" opacity="0.4" />
              <circle cx="63" cy="54" r="9" fill="#ffffff" opacity="0.3" />
              {/* Karung Logistik Makanan */}
              <rect x="-68" y="86" width="22" height="28" fill="#d97706" rx="3" />
              <rect x="-66" y="88" width="18" height="12" fill="#b45309" rx="2" />
            </g>

            {/* 7. Rumah Warga Dataran Rendah dengan Atap Abu Vulkanik Tebal (X: 2680, Y: 430) - Tanpa Teks */}
            <g id="landmark_ash_covered_house" transform="translate(2680, 430)">
              <ellipse cx="0" cy="120" rx="76" ry="10" fill="#0f172a" opacity="0.35" />
              {/* Dinding Rumah Papan */}
              <rect x="-50" y="44" width="100" height="76" fill="#d97706" stroke="#b45309" strokeWidth="2" rx="2" />
              {/* Pintu & Jendela */}
              <rect x="-14" y="72" width="28" height="48" fill="#451a03" />
              <rect x="-40" y="64" width="18" height="20" fill="#38bdf8" rx="1" />
              <rect x="22" y="64" width="18" height="20" fill="#38bdf8" rx="1" />
              {/* Atap Genteng Rumah Merah */}
              <polygon points="-64,44 0,-4 64,44" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1.5" />
              {/* Endapan Abu Vulkanik Tebal di Atas Genteng */}
              <polygon points="-64,44 0,-4 64,44 60,38 0,-10 -60,38" fill="#64748b" />
              <rect x="-30" y="20" width="12" height="18" fill="#94a3b8" opacity="0.8" rx="1" />
              <rect x="14" y="16" width="14" height="22" fill="#94a3b8" opacity="0.8" rx="1" />
              {/* Tangga Bambu Bersandar di Atap Genteng */}
              <line x1="58" y1="118" x2="44" y2="18" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="66" y1="118" x2="52" y2="18" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
              {[0, 1, 2, 3, 4, 5, 6].map((step) => {
                const curY = 106 - step * 12.5;
                const t = (118 - curY) / 100;
                const x1 = 58 * (1 - t) + 44 * t;
                const x2 = 66 * (1 - t) + 52 * t;
                return <line key={`rung_${step}`} x1={x1} y1={curY} x2={x2} y2={curY} stroke="#78350f" strokeWidth="2" />;
              })}
              {/* Sekop di Depan Rumah */}
              <rect x="-62" y="96" width="3" height="24" fill="#a16207" />
              <rect x="-66" y="114" width="11" height="6" fill="#475569" rx="1" />
            </g>

            {/* 8. Rambu Bahaya Lahar Dingin & Sensor EWS (X: 3410, Y: 420) - Tanpa Teks */}
            <g id="landmark_lahar_sign_ews" transform="translate(3410, 420)">
              {/* Tiang Rambu Baja Hitam-Kuning */}
              <rect x="-3" y="40" width="6" height="86" fill="#0f172a" rx="1" />
              <rect x="-3" y="60" width="6" height="8" fill="#facc15" />
              <rect x="-3" y="80" width="6" height="8" fill="#facc15" />
              <rect x="-3" y="100" width="6" height="8" fill="#facc15" />
              {/* Papan Rambu Peringatan Segitiga Kuning Lahar Dingin */}
              <polygon points="0,0 -36,40 36,40" fill="#facc15" stroke="#0f172a" strokeWidth="2.5" />
              {/* Ikon Tanda Seru Bahaya */}
              <rect x="-2" y="14" width="4" height="14" fill="#0f172a" rx="1" />
              <rect x="-2" y="32" width="4" height="4" fill="#0f172a" rx="1" />
              {/* Sensor EWS Strobo di Pucuk Rambu */}
              <rect x="-8" y="-8" width="16" height="8" fill="#3b82f6" rx="1" />
              <circle cx="0" cy="-12" r="5" fill="#ef4444" />
              <circle cx="0" cy="-12" r="10" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.6" />
            </g>

            {/* 9. Mobil Evakuasi / Truk Rescue BNPB Gagah (X: 4290, Y: 370) - Tanpa Teks */}
            <g id="landmark_rescue_truck_sector4" transform="translate(4290, 370)">
              <rect x="-8" y="78" width="116" height="12" fill="#334155" stroke="#1e293b" strokeWidth="1.5" rx="2" />
              <ellipse cx="18" cy="80" rx="12" ry="4" fill="#0f172a" opacity="0.45" />
              <ellipse cx="44" cy="80" rx="12" ry="4" fill="#0f172a" opacity="0.45" />
              <ellipse cx="80" cy="80" rx="12" ry="4" fill="#0f172a" opacity="0.45" />
              {/* Bodi Truk Oranye Gagah BNPB */}
              <rect x="0" y="32" width="76" height="34" fill="#ea580c" stroke="#9a3412" strokeWidth="2.5" rx="3" />
              <rect x="58" y="20" width="34" height="46" fill="#f97316" stroke="#9a3412" strokeWidth="2.5" rx="3" />
              <rect x="72" y="24" width="18" height="18" fill="#38bdf8" stroke="#9a3412" strokeWidth="1.5" rx="1" />
              {/* Strobo Ganda Merah-Biru di Atap Kabin */}
              <rect x="72" y="14" width="8" height="6" fill="#ef4444" rx="1" />
              <rect x="82" y="14" width="8" height="6" fill="#3b82f6" rx="1" />
              {/* Garis Keselamatan Kuning Reflektif */}
              <line x1="8" y1="48" x2="54" y2="48" stroke="#fef08a" strokeWidth="4" strokeDasharray="8 6" />
              {/* Ban Roda Offroad Kokoh */}
              <circle cx="18" cy="70" r="11" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
              <circle cx="18" cy="70" r="5" fill="#94a3b8" />
              <circle cx="44" cy="70" r="11" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
              <circle cx="44" cy="70" r="5" fill="#94a3b8" />
              <circle cx="80" cy="70" r="11" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
              <circle cx="80" cy="70" r="5" fill="#94a3b8" />
            </g>

            {/* ══════════════════════════════════════════════════════════════════════════ */}
            {/* ── EXPEDITION & EVACUATION TRAIL (Continuous Asphalt Highway) ── */}
            {/* ══════════════════════════════════════════════════════════════════════════ */}
            <g id="expedition_evacuation_trail">
              {/* Ground Shadow */}
              <path
                d={ribbonD}
                fill="none"
                stroke="#090d16"
                strokeWidth="50"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.35"
              />

              {/* Sturdy Stone / Gravel Curb */}
              <path
                d={ribbonD}
                fill="none"
                stroke="#1c1917"
                strokeWidth="42"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Asphalt / Paved Route Base */}
              <path
                d={ribbonD}
                fill="none"
                stroke="#334155"
                strokeWidth="34"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Tactical Inner Pavement */}
              <path
                d={ribbonD}
                fill="none"
                stroke="#1e293b"
                strokeWidth="26"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Reflective Safety Yellow Center Dashes */}
              <path
                d={ribbonD}
                fill="none"
                stroke="#fde047"
                strokeWidth="3.5"
                strokeDasharray="12 16"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.95"
              />
            </g>
          </svg>

          {/* ── HTML OVERLAY LAYER: 17 LEVEL NODES, TITLES & AVATAR ── */}
          {pathNodes.map((node) => {
            const isCompleted = completedMissionIds.includes(node.mission.id);
            const isLevelUnlocked = isUnlocked(node.mission.id);
            const isCurrentActive = activeNode?.mission.id === node.mission.id;

            // Tactical Waypoint Node & Plaque Theme (Disaster Mitigation Concept - No Candy Crush)
            const getButtonTheme = () => {
              if (isCompleted) {
                return {
                  rim: 'bg-[#14532d] border-[#16a34a] shadow-[0_6px_0_#052e16]',
                  core: 'bg-gradient-to-b from-[#15803d] to-[#166534] text-amber-100',
                  badge: 'bg-[#15803d] text-white',
                  plaque: 'bg-[#fefce8] text-[#14532d] border-2 sm:border-3 border-[#15803d] shadow-[0_4px_0_#14532d]',
                };
              }
              if (isCurrentActive) {
                return {
                  rim: 'bg-[#78350f] border-amber-400 shadow-[0_6px_0_#451a03] ring-4 ring-amber-400/60 animate-pulse',
                  core: 'bg-gradient-to-b from-amber-500 to-[#b45309] text-white',
                  badge: 'bg-[#b45309] text-white',
                  plaque: 'bg-[#fffbeb] text-[#78350f] border-2 sm:border-3 border-[#b45309] shadow-[0_4px_0_#451a03] ring-2 ring-amber-400',
                };
              }
              if (isLevelUnlocked) {
                return {
                  rim: 'bg-[#1e293b] border-sky-400 shadow-[0_6px_0_#0f172a]',
                  core: 'bg-gradient-to-b from-sky-600 to-slate-800 text-white',
                  badge: 'bg-sky-600 text-white',
                  plaque: 'bg-[#fffbeb] text-[#451a03] border-2 sm:border-3 border-[#451a03] shadow-[0_4px_0_#1c0d02]',
                };
              }
              return {
                rim: 'bg-[#1c1917] border-stone-600 shadow-[0_5px_0_#0c0a09]',
                core: 'bg-[#292524] text-stone-500',
                badge: 'bg-stone-700 text-stone-300',
                plaque: 'bg-stone-100/90 text-stone-600 border-2 border-stone-400 opacity-80',
              };
            };

            const theme = getButtonTheme();

            return (
              <div
                key={node.mission.id}
                ref={isCurrentActive ? activeNodeRef : null}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
                style={{
                  left: `${node.x}px`,
                  top: `${(node.y / MAP_HEIGHT) * 100}%`,
                }}
              >
                {/* ── AVATAR DISPLAY (On Current Active Node) ── */}
                {isCurrentActive && (
                  <div className="absolute -top-20 z-30 flex flex-col items-center animate-bounce pointer-events-none font-['Plus_Jakarta_Sans',sans-serif]">
                    {/* Speech bubble */}
                    <div className="bg-[#fef3c7] text-[#451a03] px-3 py-1 rounded-full text-[13px] font-black shadow-md border-2 border-[#b45309] whitespace-nowrap mb-1">
                      {student?.name && student.name !== '-' ? `Ayo ${student.name.split(' ')[0]}!` : 'Misi Aktif!'}
                    </div>

                    {/* Cute Player Avatar */}
                    <div className="relative">
                      <PixelAvatarRenderer config={avatarConfig} size={46} bordered={true} />
                    </div>
                  </div>
                )}

                {/* ── TACTICAL WAYPOINT NODE BUTTON (Disaster Expedition Style) ── */}
                <button
                  onClick={() => handleNodeClick(node)}
                  className={`group relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shadow-xl focus:outline-none ${isCurrentActive
                    ? 'scale-110'
                    : 'hover:scale-108 hover:-translate-y-1'
                    }`}
                  title={`${node.levelNumber}. ${node.mission.title} (${isCompleted ? 'Selesai' : isLevelUnlocked ? 'Terbuka' : 'Terkunci'
                    })`}
                >
                  {/* Outer Bevel Rim */}
                  <div className={`absolute inset-0 rounded-2xl border-4 transition-all ${theme.rim}`} />

                  {/* Inner Tactical Core */}
                  <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center border border-white/20 shadow-inner ${theme.core}`}>
                    {isLevelUnlocked ? (
                      <span className="font-['Plus_Jakarta_Sans',sans-serif] font-black text-xl tracking-tight text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]">
                        {node.levelNumber}
                      </span>
                    ) : (
                      <svg className="w-5 h-5 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor" fillOpacity="0.2" />
                        <path d="M8 11V7a4 4 0 018 0v4" />
                      </svg>
                    )}
                  </div>

                  {/* 3 Golden Stars on top if completed */}
                  {isCompleted && (
                    <div className="absolute -top-3.5 inset-x-0 flex justify-center gap-0.5 text-amber-400 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] animate-pulse">
                      {[0, 1, 2].map((i) => (
                        <svg key={i} className={`w-3.5 h-3.5 fill-amber-400 ${i === 1 ? '-translate-y-1' : ''}`} viewBox="0 0 24 24">
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                      ))}
                    </div>
                  )}

                  {/* Pulsing Radar Ring for Active Node */}
                  {isCurrentActive && (
                    <span className="absolute -inset-1.5 rounded-2xl bg-amber-400/40 animate-ping pointer-events-none" />
                  )}
                </button>

                {/* ── CLEAR & READABLE LEVEL TITLE PLAQUE (Plus Jakarta Sans) ── */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Buka materi ${node.sectorTitle}`}
                  onClick={() => handleNodeClick(node)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleNodeClick(node);
                    }
                  }}
                  className={`absolute pointer-events-auto cursor-pointer transition-all duration-200 hover:scale-105 ${node.labelPos === 'top' ? '-top-14' : 'top-20'
                    }`}
                >
                  <div
                    className={`px-3.5 py-1.5 rounded-xl text-[13px] sm:text-[15px] font-bold flex items-center gap-2 whitespace-nowrap backdrop-blur-md transition-all ${theme.plaque}`}
                  >
                    {/* Level Number Badge */}
                    <span className={`px-2 py-0.5 rounded text-[14.5px] font-black tracking-wider ${theme.badge}`}>
                      LV.{node.levelNumber}
                    </span>

                    {/* Mission Title */}
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[13px] sm:text-[15px] tracking-tight text-[#291305]">
                      {node.mission.title}
                    </span>

                    {/* Status icon */}
                    {isCompleted ? (
                      <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : isCurrentActive ? (
                      <span className="text-[#b45309] text-[13.5px] font-black tracking-wider uppercase animate-pulse">AKTIF</span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. FLOATING PAN BUTTONS ON SCREEN EDGES ── */}
      <button aria-label="Sebelumnya"
        onClick={panLeft}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-2xl bg-[#451a03]/90 hover:bg-[#78350f] text-amber-200 border-2 sm:border-3 border-[#92400e] shadow-[0_4px_0_#1c0d02] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all"
        title="Geser Peta ke Kiri"
      >
        <svg className="w-6 h-6 stroke-amber-200 fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button aria-label="Berikutnya"
        onClick={panRight}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-2xl bg-[#451a03]/90 hover:bg-[#78350f] text-amber-200 border-2 sm:border-3 border-[#92400e] shadow-[0_4px_0_#1c0d02] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all"
        title="Geser Peta ke Kanan"
      >
        <svg className="w-6 h-6 stroke-amber-200 fill-none" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ── MODAL 1: MISSION DETAIL PREVIEW (Level 1 & 2 Style) ── */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm select-none animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="relative w-full max-w-2xl bg-[#fef3c7] border-4 sm:border-[5px] border-[#451a03] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_16px_0_#1c0d02] text-[#451a03] max-h-[94vh] overflow-y-auto flex flex-col gap-4">
            {/* Header with Category Badge */}
            <div className="flex items-center justify-between border-b-3 border-[#78350f] pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#b45309]/20 border-2 border-[#b45309] flex items-center justify-center shrink-0">
                  <PixelIcon name="backpack" size={22} className="text-[#92400e]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] sm:text-[15px] text-[#b45309] uppercase tracking-widest font-black">
                      {CATEGORIES.find((c) => c.id === selectedMission.category)?.title || 'MISI MITIGASI'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#b45309] text-white text-[13.5px] font-black tracking-wider">
                      LEVEL {pathNodes.find((n) => n.mission.id === selectedMission.id)?.levelNumber}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-2xl text-[#451a03] font-bold leading-tight">
                    {selectedMission.title}
                  </h2>
                </div>
              </div>

              <button aria-label="Tutup"
                onClick={() => {
                  retroAudio.playSelect();
                  setSelectedMission(null);
                }}
                className="w-10 h-10 rounded-xl bg-[#b45309] hover:bg-[#92400e] text-amber-100 border-2 border-[#451a03] font-bold text-[15px] flex items-center justify-center cursor-pointer active:translate-y-0.5 shadow-[0_2px_0_#451a03] shrink-0"
              >
                <PixelIcon name="cross" size={14} />
              </button>
            </div>

            {/* Scenario Story */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-100/90 border-3 border-[#b45309]/40 shadow-xs">
              <span className="text-[13px] sm:text-[15px] font-black text-[#78350f] uppercase tracking-wider mb-1.5 flex items-center gap-2">
                SITUASI KEBENCANAAN
              </span>
              <p className="text-[15px] sm:text-base font-semibold leading-relaxed text-[#291305]">
                {selectedMission.scenario}
              </p>
            </div>

            {/* Mission Objective */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border-3 border-emerald-600/70 shadow-xs">
              <span className="text-[13px] sm:text-[15px] font-black text-emerald-800 uppercase tracking-wider mb-1.5 flex items-center gap-2">
                TARGET MISI PENYELAMATAN
              </span>
              <p className="text-[15px] sm:text-base font-bold leading-relaxed text-emerald-950">
                {selectedMission.objective}
              </p>
            </div>

            {/* Mission Block Location Guide */}
            {selectedMission.hint && (
              <div className="p-4 sm:p-5 rounded-2xl bg-cyan-50 border-3 border-cyan-600/70 shadow-xs">
                <span className="text-[13px] sm:text-[15px] font-black text-cyan-800 uppercase tracking-wider mb-1.5 flex items-center gap-2">
                  PANDUAN KATEGORI BLOK
                </span>
                <p className="text-[15px] sm:text-base font-semibold leading-relaxed text-cyan-950">
                  {selectedMission.hint}
                </p>
              </div>
            )}

            {/* Steps Count & Status */}
            <div className="flex items-center justify-between text-[13px] sm:text-[15px] font-bold text-[#78350f] px-1">
              <span className="flex items-center gap-1.5">
                {selectedMission.steps.length} Langkah Terpandu
              </span>
              {completedMissionIds.includes(selectedMission.id) ? (
                <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 border-2 border-emerald-600 font-black">
                  STATUS: SUDAH SELESAI
                </span>
              ) : (
                <span className="px-3 py-1 rounded-xl bg-amber-200 text-amber-950 border-2 border-amber-700 font-black">
                  STATUS: SIAP DIKERJAKAN
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  retroAudio.playSelect();
                  setSelectedMission(null);
                }}
                className="flex-1 py-3 px-5 rounded-xl bg-[#b45309] hover:bg-[#92400e] text-amber-100 font-bold text-[15px] border-2 border-[#451a03] shadow-[0_3px_0_#451a03] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                KEMBALI
              </button>

              <button
                onClick={() => handleStartMission(selectedMission.id)}
                className="flex-[2] py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[15px] border-2 border-[#064e3b] shadow-[0_4px_0_#064e3b] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{completedMissionIds.includes(selectedMission.id) ? 'ULANGI MISI' : 'MULAI MISI SEKARANG'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: CONFIRM REPLAY MODAL ── */}
      {confirmReplayMissionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm select-none animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="relative w-full max-w-md bg-[#fef3c7] border-4 border-[#451a03] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_16px_0_#1c0d02] text-[#451a03] flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b-2 border-[#78350f]/30 pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border-2 border-amber-600 flex items-center justify-center shrink-0">
                <PixelIcon name="warning" size={20} className="text-amber-800" />
              </div>
              <h3 className="font-bold text-lg text-[#451a03]">
                Ulangi Misi Ini?
              </h3>
            </div>
            <p className="text-[15px] text-[#291305] leading-relaxed font-semibold">
              Kamu sudah menuntaskan misi ini. Jika kamu memilih ulangi, draft blok kode lama akan dibersihkan agar kamu bisa berlatih kembali dari awal.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmReplayMissionId(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-[15px] font-bold border-2 border-stone-400 shadow-[0_2px_0_#78716c] cursor-pointer"
              >
                BATAL
              </button>
              <button
                onClick={() => handleConfirmReplay(confirmReplayMissionId)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#b45309] hover:bg-[#92400e] text-white text-[15px] font-black border-2 border-[#451a03] shadow-[0_3px_0_#451a03] cursor-pointer"
              >
                YA, ULANGI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: PANDUAN KEGIATAN KELOMPOK (LKPD) ── */}
      {showLkpdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm select-none animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="relative w-full max-w-2xl bg-[#fef3c7] border-4 sm:border-[5px] border-[#451a03] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_16px_0_#1c0d02] text-[#451a03] max-h-[94vh] overflow-y-auto flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b-3 border-[#78350f] pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#b45309]/20 border-2 border-[#b45309] flex items-center justify-center shrink-0">
                  <PixelIcon name="backpack" size={22} className="text-[#92400e]" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#451a03]">
                    Panduan Praktik Kelompok (LKPD)
                  </h2>
                  <p className="text-[13px] sm:text-[15px] text-[#78350f] font-semibold">
                    Pedoman Praktik Digital Twin & Diorama Fisik Smart Education Board
                  </p>
                </div>
              </div>
              <button aria-label="Tutup"
                onClick={() => setShowLkpdModal(false)}
                className="w-10 h-10 rounded-xl bg-[#b45309] hover:bg-[#92400e] text-amber-100 border-2 border-[#451a03] font-bold text-[15px] flex items-center justify-center cursor-pointer active:translate-y-0.5 shadow-[0_2px_0_#451a03] shrink-0"
              >
                <PixelIcon name="cross" size={14} />
              </button>
            </div>

            {/* 3 Step Instructions */}
            <div className="flex flex-col gap-3 py-1">
              <div className="p-4 rounded-2xl bg-amber-100/90 border-2 sm:border-3 border-[#b45309]/40 flex gap-3.5 items-start shadow-xs">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#b45309] text-white font-black text-[15px] shrink-0 shadow-sm">
                  1
                </span>
                <div className="text-[15px] text-[#291305] leading-relaxed font-semibold">
                  <strong className="text-[#451a03] block mb-1 text-base font-bold">Pelajari Skenario & Masalah Bencana</strong>
                  Peserta didik dalam kelompok membaca situasi bencana di LKPD dan merancang urutan logika respon keselamatan darurat bersama tim.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-100/90 border-2 sm:border-3 border-[#b45309]/40 flex gap-3.5 items-start shadow-xs">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#b45309] text-white font-black text-[15px] shrink-0 shadow-sm">
                  2
                </span>
                <div className="text-[15px] text-[#291305] leading-relaxed font-semibold">
                  <strong className="text-[#451a03] block mb-1 text-base font-bold">Susun Blok Logika & Uji Digital Twin</strong>
                  Rangkai blok aksi-reaksi mitigasi di Action Lab. Amati respon simulator <strong>Digital Twin</strong> (pergerakan warga evakuasi) saat logika dijalankan.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-100/90 border-2 sm:border-3 border-[#b45309]/40 flex gap-3.5 items-start shadow-xs">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#b45309] text-white font-black text-[15px] shrink-0 shadow-sm">
                  3
                </span>
                <div className="text-[15px] text-[#291305] leading-relaxed font-semibold">
                  <strong className="text-[#451a03] block mb-1 text-base font-bold">Uji Diorama Fisik & Refleksi Mitigasi</strong>
                  Hubungkan ke <strong>diorama fisik</strong> via WiFi atau USB untuk menyalakan sirine dan lampu fisik, lalu diskusikan efektivitas keselamatan warga.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLkpdModal(false)}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[15px] sm:text-base border-3 border-[#064e3b] shadow-[0_4px_0_#064e3b] mt-1 cursor-pointer active:translate-y-1 active:shadow-none transition-all"
            >
              MENGERTI & KEMBALI KE PETA
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL 4: PROYEK SAYA (SANDBOX) ── */}
      {showProjectsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm select-none animate-fadeIn font-pixel">
          <div className="relative w-full max-w-xl bg-[#fef3c7] border-4 sm:border-[5px] border-[#451a03] rounded-2xl sm:rounded-3xl shadow-[0_16px_0_#1c0d02] p-5 sm:p-7 text-[#260c02] flex flex-col gap-4 sm:gap-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b-3 border-[#78350f] pb-3.5">
              <div className="flex items-center gap-3 sm:gap-3.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-900 text-amber-100 border-2 border-amber-950 flex items-center justify-center shrink-0 shadow-[0_2px_0_#231206]">
                  <PixelIcon name="folder" size={26} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#260c02] font-pixel-title leading-tight">
                    Proyek Saya (Sandbox)
                  </h3>
                  <p className="text-[13px] sm:text-[15px] md:text-base text-[#381504] font-extrabold mt-0.5">
                    Rancang logika mitigasi bebas tanpa batasan skenario misi
                  </p>
                </div>
              </div>

              <button aria-label="Tutup"
                onClick={() => setShowProjectsModal(false)}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-100 border-2 border-amber-950 font-bold text-[15px] flex items-center justify-center cursor-pointer active:translate-y-0.5 shadow-[0_2px_0_#231206] shrink-0"
                title="Tutup Modal"
              >
                <PixelIcon name="cross" size={16} />
              </button>
            </div>

            {/* Create Project Button */}
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="py-3.5 sm:py-4 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[15px] sm:text-base md:text-lg flex items-center justify-center gap-2.5 border-2 border-[#064e3b] shadow-[0_4px_0_#064e3b] cursor-pointer transition-all active:translate-y-0.5"
            >
              <PixelIcon name="hammer" size={20} />
              <span>BUAT PROYEK BARU</span>
            </button>

            {/* Project List */}
            <div className="max-h-72 overflow-y-auto flex flex-col gap-3 pr-1">
              {projects.length === 0 ? (
                <div className="p-6 sm:p-8 text-center text-[15px] sm:text-base md:text-lg text-[#1e0a00] font-extrabold bg-[#fef08a] rounded-2xl border-2 sm:border-3 border-amber-900/40 shadow-sm leading-relaxed">
                  Belum ada proyek sandbox. Klik tombol hijau di atas untuk membuat proyek barumu!
                </div>
              ) : (
                projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl bg-amber-50 border-2 border-amber-900/40 flex items-center justify-between gap-3 hover:border-emerald-600 transition-colors shadow-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[15px] sm:text-base md:text-lg font-black text-[#1e0a00] truncate">{proj.name}</h4>
                      <p className="text-[13px] sm:text-[15px] text-amber-900 font-bold mt-0.5">
                        Diperbarui: {new Date(proj.updatedAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setShowProjectsModal(false);
                          navigate(`/workspace?project=${proj.id}`);
                        }}
                        className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] sm:text-[15px] md:text-base font-black shadow-[0_2px_0_#064e3b] cursor-pointer active:translate-y-0.5"
                      >
                        BUKA
                      </button>

                      <button aria-label="Hapus"
                        onClick={() => setConfirmDeleteProjectId(proj.id)}
                        className="p-2.5 rounded-xl text-rose-700 hover:bg-rose-100 hover:text-rose-900 border border-rose-300 cursor-pointer"
                        title="Hapus Proyek"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowProjectsModal(false)}
              className="w-full py-3 sm:py-3.5 rounded-xl bg-[#853507] hover:bg-[#6c2803] text-white font-pixel-title font-bold text-[13px] sm:text-[15px] md:text-base border-2 border-[#451a03] shadow-[0_3px_0_#2b0d00] cursor-pointer active:translate-y-0.5"
            >
              TUTUP
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL 5: NEW PROJECT INPUT ── */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm select-none animate-fadeIn font-pixel">
          <div className="w-full max-w-md bg-[#fef3c7] border-4 sm:border-[5px] border-[#451a03] rounded-2xl sm:rounded-3xl p-6 sm:p-7 text-[#260c02] flex flex-col gap-4 shadow-[0_16px_0_#1c0d02]">
            <h3 className="font-pixel-title font-black text-base sm:text-lg md:text-xl text-[#260c02]">
              Buat Proyek Baru
            </h3>
            <p className="text-[13px] sm:text-[15px] text-[#381504] font-extrabold -mt-2">
              Beri nama proyek kreasi logika mitigasi mandirimu:
            </p>
            <input aria-label="Nama proyek baru"
              type="text"
              autoFocus
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateNewProject()}
              placeholder="Contoh: Alarm Banjir Lahar Kali Kuning..."
              className="w-full px-4 py-3 rounded-xl bg-white border-2 border-amber-900/40 text-[#1a0800] text-[15px] sm:text-base font-bold outline-none focus:ring-2 focus:ring-amber-600 shadow-inner"
            />
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => {
                  setShowNewProjectModal(false);
                  setNewProjectName('');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-900 text-[13px] sm:text-[15px] md:text-base font-bold border-2 border-stone-400 cursor-pointer active:translate-y-0.5"
              >
                BATAL
              </button>
              <button
                disabled={!newProjectName.trim()}
                onClick={handleCreateNewProject}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-[13px] sm:text-[15px] md:text-base font-black border-2 border-[#064e3b] shadow-[0_3px_0_#064e3b] cursor-pointer active:translate-y-0.5"
              >
                BUAT SEKARANG
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 6: CONFIRM DELETE PROJECT ── */}
      {confirmDeleteProjectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm select-none animate-fadeIn font-pixel">
          <div className="w-full max-w-md bg-[#fef3c7] border-4 sm:border-[5px] border-rose-800 rounded-2xl sm:rounded-3xl p-6 sm:p-7 text-[#260c02] flex flex-col gap-3.5 shadow-[0_16px_0_#1c0d02]">
            <h3 className="font-pixel-title font-black text-base sm:text-lg md:text-xl text-rose-800">
              Hapus Proyek Ini?
            </h3>
            <p className="text-[15px] sm:text-base text-[#1e0a00] font-bold leading-relaxed">
              Proyek dan seluruh blok rancangan mitigasi di dalamnya akan dihapus secara permanen.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteProjectId(null)}
                className="flex-1 py-3 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-900 text-[13px] sm:text-[15px] md:text-base font-bold border-2 border-stone-400 cursor-pointer active:translate-y-0.5"
              >
                BATAL
              </button>
              <button
                onClick={() => {
                  deleteProject(confirmDeleteProjectId);
                  setConfirmDeleteProjectId(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-[13px] sm:text-[15px] md:text-base font-black border-2 border-rose-950 shadow-[0_3px_0_#4c0519] cursor-pointer active:translate-y-0.5"
              >
                YA, HAPUS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PANDUAN INTERAKTIF RESQY (ONBOARDING GAME TUTORIAL) ── */}
      <ResqyTutorialOverlay
        tour={TUTORIAL_TOURS.level3}
        userId={student?.id || currentUser?.id || 'guest'}
      />
    </div>
  );
}
