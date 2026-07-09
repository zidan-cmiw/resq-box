import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MISSIONS, CATEGORIES } from '../../missions/data/missions';
import { useMissionStore } from '../../store/missionStore';
import { useWorkspaceStore } from '../../store/workspaceStore';

// ── Credits Modal ───────────────────────────────────────────────
function CreditsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-surface rounded-2xl shadow-2xl p-lg max-w-[380px] w-full mx-md flex flex-col gap-md animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-amber-500" style={{ fontSize: '28px', fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
          <h3 className="font-title-md text-title-md text-on-surface">Credits</h3>
        </div>

        <p className="font-label-caps text-label-caps text-secondary-container uppercase tracking-wide">
          Disusun oleh Tim Eternal
        </p>

        <div className="flex flex-col gap-sm">
          {[
            { name: 'Muhammad Zidane Romadhona Haryanto', role: 'Ketua, Direktur, Asisten Developer', icon: 'person' },
            { name: 'Raffael Vincent Nathaniel Handoko', role: 'Developer Utama, Fullstack', icon: 'code' },
            { name: 'Zahra Rokhadatul Aisy Ramadhani', role: 'Asisten Developer, Penulis Teknis', icon: 'edit_note' },
            { name: 'Lintang Pansavia Lysandra', role: 'Project Manager, Penulis Teknis', icon: 'group' },
          ].map((member, i) => (
            <div key={i} className="flex items-start gap-sm bg-surface-container-low rounded-xl p-sm">
              <div className="h-10 w-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white" style={{ fontSize: '18px' }}>
                  {member.icon}
                </span>
              </div>
              <div>
                <p className="font-label-md font-semibold text-on-surface">{member.name}</p>
                <p className="font-label-sm text-on-surface-variant">{member.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-outline-variant pt-sm">
          <div className="flex items-start gap-sm bg-[#FFF7ED] rounded-xl p-sm border border-[#FED7AA]">
            <span className="material-symbols-outlined text-secondary-container" style={{ fontSize: '18px' }}>
              school
            </span>
            <div>
              <p className="font-label-md font-semibold text-on-surface">Rizki Arumning Tyas, M.Pd.</p>
              <p className="font-label-sm text-on-surface-variant">Pembimbing</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-sm bg-primary text-on-primary font-label-caps text-label-caps rounded-xl hover:opacity-90 transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

// ── Confirmation Modal ──────────────────────────────────────────
function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface rounded-2xl shadow-2xl p-lg max-w-[400px] w-full mx-md flex flex-col gap-md">
        <div className="flex items-center gap-sm">
          <span
            className="material-symbols-outlined text-error shrink-0"
            style={{ fontSize: '28px', fontVariationSettings: "'FILL' 1" }}
          >
            warning
          </span>
          <h3 className="font-title-md text-title-md text-on-surface">{title}</h3>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{message}</p>
        <div className="flex gap-sm">
          <button
            onClick={onCancel}
            className="flex-1 py-sm px-md bg-surface-container-high border border-outline-variant text-on-surface font-label-caps text-label-caps rounded-lg hover:bg-surface-container-highest transition-colors"
          >
            BATAL
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-sm px-md bg-error text-on-error font-label-caps text-label-caps rounded-lg tactile-btn hover:opacity-90"
          >
            YA, ULANGI
          </button>
        </div>
      </div>
    </div>
  );
}

// ── New Project Name Modal ──────────────────────────────────────
function NewProjectModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface rounded-2xl shadow-2xl p-lg max-w-[400px] w-full mx-md flex flex-col gap-md">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-secondary-container shrink-0" style={{ fontSize: '28px' }}>
            add_circle
          </span>
          <h3 className="font-title-md text-title-md text-on-surface">Buat Proyek Baru</h3>
        </div>
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && name.trim() && onConfirm(name.trim())}
          placeholder="Nama proyek..."
          className="w-full px-md py-sm rounded-lg border-2 border-outline-variant bg-surface-container focus:border-primary outline-none font-body-base text-on-surface"
        />
        <div className="flex gap-sm">
          <button
            onClick={onCancel}
            className="flex-1 py-sm px-md bg-surface-container-high border border-outline-variant text-on-surface font-label-caps text-label-caps rounded-lg hover:bg-surface-container-highest transition-colors"
          >
            BATAL
          </button>
          <button
            disabled={!name.trim()}
            onClick={() => name.trim() && onConfirm(name.trim())}
            className="flex-1 py-sm px-md bg-primary text-on-primary font-label-caps text-label-caps rounded-lg tactile-btn hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            BUAT
          </button>
        </div>
      </div>
    </div>
  );
}

function TrianglePageButton({
  direction,
  disabled,
  onClick,
  label,
}: {
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="group h-10 w-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high disabled:opacity-25 disabled:cursor-not-allowed transition-all"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        aria-hidden="true"
        className={`overflow-visible drop-shadow-[0_2px_0_rgba(0,0,0,0.18)] transition-transform duration-150 group-hover:-translate-y-[1px] group-active:translate-y-[2px] group-active:drop-shadow-none ${
          direction === 'prev' ? 'scale-x-[-1]' : ''
        }`}
      >
        <polygon points="8,4 23,14 8,24" fill="#9D4300" transform="translate(3 3)" opacity="0.55" />
        <polygon points="8,4 23,14 8,24 11,20 11,8" fill="#B35000" />
        <polygon
          points="7,3 23,14 7,25"
          fill="#FD761A"
          stroke="#D65F00"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <polygon points="9,6 20,14 9,12" fill="#FFB066" opacity="0.9" />
        <polygon points="9,16 20,14 9,22" fill="#D95C00" opacity="0.75" />
      </svg>
    </button>
  );
}

// ── Helpers ─────────────────────────────────────────────────────
function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  return `${Math.floor(hrs / 24)} hari lalu`;
}

// ── Dashboard ───────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const { completedMissionIds, isUnlocked, currentCategoryIndex, setCurrentCategoryIndex, getCategoryProgress } = useMissionStore();
  const { projects, createProject, deleteProject, drafts, clearDraft } = useWorkspaceStore();

  const [confirmReplay, setConfirmReplay] = useState<string | null>(null); // missionId
  const [confirmDeleteProject, setConfirmDeleteProject] = useState<string | null>(null); // projectId
  const [showNewProject, setShowNewProject] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  const getMissionStatus = (missionId: string) => {
    if (completedMissionIds.includes(missionId)) return 'completed';
    if (isUnlocked(missionId)) return 'active';
    return 'locked';
  };

  const hasMissionDraft = (missionId: string) => {
    return !!(drafts[missionId]?.workspaceJson);
  };

  const handleMissionClick = (mission: typeof MISSIONS[0], status: string) => {
    if (status === 'completed') {
      setConfirmReplay(mission.id);
    } else {
      navigate(`/workspace?mission=${mission.id}`);
    }
  };

  const handleConfirmReplay = (missionId: string) => {
    clearDraft(missionId);
    setConfirmReplay(null);
    navigate(`/workspace?mission=${missionId}`);
  };

  const handleCreateProject = (name: string) => {
    const project = createProject(name);
    setShowNewProject(false);
    navigate(`/workspace?project=${project.id}`);
  };

  return (
    <div className="bg-surface mission-canvas min-h-screen text-on-surface font-body-base">

      {/* Modals */}
      {confirmReplay && (
        <ConfirmModal
          title="Ulangi Misi?"
          message="Progress kamu di misi ini akan dihapus dan mulai dari awal. Apakah kamu yakin?"
          onConfirm={() => handleConfirmReplay(confirmReplay)}
          onCancel={() => setConfirmReplay(null)}
        />
      )}
      {confirmDeleteProject && (
        <ConfirmModal
          title="Hapus Proyek?"
          message="Proyek dan semua blok di dalamnya akan terhapus permanen. Tidak bisa dibatalkan!"
          onConfirm={() => {
            deleteProject(confirmDeleteProject);
            setConfirmDeleteProject(null);
          }}
          onCancel={() => setConfirmDeleteProject(null)}
        />
      )}
      {showNewProject && (
        <NewProjectModal
          onConfirm={handleCreateProject}
          onCancel={() => setShowNewProject(false)}
        />
      )}
      {showCredits && <CreditsModal onClose={() => setShowCredits(false)} />}

      {/* TopAppBar */}
      <header className="bg-surface dark:bg-surface-dim docked full-width top-0 border-b border-outline-variant dark:border-outline flat no shadows flex justify-between items-center w-full px-margin-desktop h-16 sticky z-40">
        <div className="flex items-center gap-sm">
          <img alt="RESQ-BOX Logo" className="h-8 w-8 rounded-md object-contain" src="/logo.png" />
          <span className="font-display-lg text-headline-lg font-black tracking-tight text-secondary dark:text-secondary-fixed">RESQ-BOX</span>
        </div>
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-xs px-sm py-xs bg-[#16A34A] text-white rounded-full">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '14px' }}>cloud_done</span>
            <span className="font-label-caps text-label-caps">Offline Ready</span>
          </div>
          <div className="flex items-center gap-sm text-primary dark:text-primary-fixed">
            <button className="hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors p-xs rounded-full flex items-center justify-center h-10 w-10">
              <span className="material-symbols-outlined">wifi_tethering</span>
            </button>
            <button
              onClick={() => setShowCredits(true)}
              className="hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors p-xs rounded-full flex items-center justify-center h-10 w-10"
              title="Credits"
            >
              <span className="material-symbols-outlined">star</span>
            </button>
            <button className="hover:bg-surface-container dark:hover:bg-surface-container-high transition-colors p-xs rounded-full flex items-center justify-center h-10 w-10">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-secondary-container bg-opacity-10 border-b border-outline-variant py-sm px-margin-desktop">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
            <span className="font-title-md text-title-md text-primary">
              Progress: {completedMissionIds.length} / {MISSIONS.length} Misi Selesai
            </span>
          </div>
          <div className="h-2 w-64 rounded-full overflow-hidden bg-surface-variant">
            <div
              className="h-full bg-[#16A34A] transition-all duration-500 rounded-full"
              style={{ width: `${MISSIONS.length > 0 ? (completedMissionIds.length / MISSIONS.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter">

        {/* Left: My Projects */}
        <section className="md:col-span-8 flex flex-col gap-md">
          <div className="flex justify-between items-end border-b-2 border-outline-variant pb-xs">
            <h2 className="font-headline-lg text-headline-lg text-primary">My Projects</h2>
            <button
              onClick={() => setShowNewProject(true)}
              className="font-label-caps text-label-caps text-secondary-container hover:underline flex items-center gap-xs"
            >
              <span className="material-symbols-outlined text-label-caps">add</span>
              NEW PROJECT
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
            {/* Existing Projects */}
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-surface-container-lowest tactile-card rounded-lg p-md flex flex-col justify-between h-48 shadow-[0_4px_0_0_#E2E8F0] relative group"
              >
                {/* Delete button (hover) */}
                <button
                  onClick={() => setConfirmDeleteProject(project.id)}
                  className="absolute top-sm right-sm opacity-0 group-hover:opacity-100 transition-opacity text-on-surface-variant hover:text-error p-xs rounded"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                </button>

                <div>
                  <div className="flex justify-between items-start mb-sm">
                    <div className="bg-[#fd761a1a] text-secondary-container p-xs rounded">
                      <span className="material-symbols-outlined">sensors</span>
                    </div>
                    {drafts[project.id]?.workspaceJson && (
                      <span className="text-[10px] font-label-caps text-label-caps bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] px-xs py-[2px] rounded-full">
                        DRAFT TERSIMPAN
                      </span>
                    )}
                  </div>
                  <h3 className="font-title-md text-title-md text-primary mb-xs">{project.name}</h3>
                  <p className="font-code-sm text-code-sm text-on-surface-variant">
                    Diperbarui {formatRelative(project.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/workspace?project=${project.id}`)}
                  className="bg-primary text-on-primary font-label-caps text-label-caps py-sm px-md rounded tactile-btn w-full flex justify-center items-center gap-xs mt-sm"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                  LANJUTKAN
                </button>
              </div>
            ))}

            {/* Empty State / Add New */}
            <button
              onClick={() => setShowNewProject(true)}
              className="bg-surface-container border-2 border-dashed border-outline-variant rounded-lg p-md flex flex-col items-center justify-center h-48 gap-sm hover:border-primary hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined text-4xl">add_circle</span>
              <span className="font-label-caps text-label-caps">Buat Proyek Baru</span>
            </button>
          </div>

          {/* Mode Selector */}
          <div className="mt-md">
            <div className="flex justify-between items-end border-b-2 border-outline-variant pb-xs mb-md">
              <h2 className="font-headline-lg text-headline-lg text-primary">Mode Belajar</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
              <button
                onClick={() => setShowNewProject(true)}
                className="relative flex flex-col items-start text-left p-md rounded-2xl bg-[#FFF7ED] border-2 border-[#F97316] hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center gap-sm mb-sm">
                  <span className="material-symbols-outlined text-[#EA580C] text-3xl">widgets</span>
                  <div>
                    <div className="font-label-caps text-label-caps text-[#9A3412] uppercase">Simulasi Interaktif</div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface">Ruang Simulasi</h3>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-md leading-relaxed">
                  Susun instruksi logika penyelamatan bencana dengan blok visual. Uji langsung di simulator RESQ-BOX!
                </p>
                <div className="flex items-center gap-xs text-[#EA580C] font-label-sm text-label-sm">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                  Mulai Simulasi
                </div>
              </button>

              <button
                onClick={() => navigate('/mitigation')}
                className="relative flex flex-col items-start text-left p-md rounded-2xl bg-[#F0FDF4] border-2 border-[#16A34A] hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="absolute top-sm right-sm px-xs py-[2px] rounded-full bg-[#16A34A] text-white font-label-caps text-label-caps">
                  Baru!
                </div>
                <div className="flex items-center gap-sm mb-sm">
                  <span className="material-symbols-outlined text-[#15803D] text-3xl">emergency</span>
                  <div>
                    <div className="font-label-caps text-label-caps text-[#14532D] uppercase">Puzzle Interaktif</div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface">Mitigasi Bencana</h3>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-md leading-relaxed">
                  Susun urutan tindakan penyelamatan yang benar. Gempa, banjir, kebakaran & tsunami!
                </p>
                <div className="flex items-center gap-xs text-[#15803D] font-label-sm text-label-sm">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>drag_indicator</span>
                  5 skenario tersedia
                </div>
              </button>

              {/* Simulasi Evakuasi — Digital Twin */}
              <button
                onClick={() => navigate('/evacuation')}
                className="relative flex flex-col items-start text-left p-md rounded-2xl bg-[#0F172A] border-2 border-[#3B82F6] hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="absolute top-sm right-sm px-xs py-[2px] rounded-full bg-[#3B82F6] text-white font-label-caps text-label-caps">
                  Game Baru!
                </div>
                <div className="flex items-center gap-sm mb-sm">
                  <span className="material-symbols-outlined text-[#60A5FA] text-3xl">map</span>
                  <div>
                    <div className="font-label-caps text-label-caps text-[#93C5FD] uppercase">Game Isometrik</div>
                    <h3 className="font-title-md text-title-md font-bold text-white">Simulasi Evakuasi</h3>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-white/60 mb-md leading-relaxed">
                  Game Digital Twin dioramamu. NPC warga bergerak otomatis sesuai blok kode yang kamu rancang!
                </p>
                <div className="flex items-center gap-xs text-[#60A5FA] font-label-sm text-label-sm">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                  Buka Game Evakuasi
                </div>
              </button>

            </div>
          </div>
        </section>

        {/* Right: Mission Center */}
        <aside className="md:col-span-4 flex flex-col gap-md">
          <div className="flex justify-between items-end border-b-2 border-outline-variant pb-xs">
            <h2 className="font-headline-lg text-headline-lg text-primary">Mission Center</h2>
            <div className="flex items-center gap-1">
              <TrianglePageButton
                direction="prev"
                label="Kategori sebelumnya"
                onClick={() => setCurrentCategoryIndex(Math.max(0, currentCategoryIndex - 1))}
                disabled={currentCategoryIndex === 0}
              />
              <span className="font-label-caps text-label-caps text-on-surface-variant min-w-[100px] text-center">
                {CATEGORIES[currentCategoryIndex].title.toUpperCase()}
              </span>
              <TrianglePageButton
                direction="next"
                label="Kategori berikutnya"
                onClick={() => setCurrentCategoryIndex(Math.min(CATEGORIES.length - 1, currentCategoryIndex + 1))}
                disabled={currentCategoryIndex === CATEGORIES.length - 1}
              />
            </div>
          </div>

          {/* Category Progress */}
          {(() => {
            const cat = CATEGORIES[currentCategoryIndex];
            const progress = getCategoryProgress(cat.id);
            return (
              <div>
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-secondary-container">{cat.icon}</span>
                  <span className="font-label-md text-on-surface-variant">
                    Progress: {progress.completed} / {progress.total} Misi Selesai
                  </span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full overflow-hidden bg-surface-variant">
                  <div
                    className="h-full bg-[#16A34A] transition-all duration-500 rounded-full"
                    style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                  />
                </div>
              </div>
            );
          })()}

          <div className="flex flex-col gap-sm">
            {MISSIONS.filter((m) => m.category === CATEGORIES[currentCategoryIndex].id).map((mission) => {
              const status = getMissionStatus(mission.id);
              const hasDraft = hasMissionDraft(mission.id);

              if (status === 'completed') {
                return (
                  <div key={mission.id} className="bg-surface-container-lowest tactile-card rounded-lg p-sm flex items-center gap-sm border-l-4 border-l-[#16A34A]">
                    <div className="h-12 w-12 rounded-full bg-[#16A34A] flex items-center justify-center text-white shrink-0">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <div className="flex-grow">
                      <p className="font-label-caps text-label-caps text-on-surface-variant">{mission.category === 'proyek' ? 'KASUS' : 'LEVEL'} {mission.level} • SELESAI</p>
                      <h4 className="font-title-md text-title-md text-primary">{mission.title}</h4>
                    </div>
                    <button
                      onClick={() => hasDraft ? navigate(`/workspace?mission=${mission.id}`) : setConfirmReplay(mission.id)}
                      className="bg-surface-container-high text-on-surface font-label-caps text-label-caps py-xs px-sm rounded tactile-btn shrink-0 border border-outline-variant"
                    >
                      {hasDraft ? 'LANJUTKAN' : 'ULANGI'}
                    </button>
                  </div>
                );
              }

              if (status === 'active') {
                return (
                  <div key={mission.id} className="bg-surface-container-lowest tactile-card rounded-lg p-sm border-l-4 border-l-secondary-container shadow-[0_4px_0_0_#E2E8F0]">
                    <div className="flex items-center gap-sm mb-sm">
                      <div className="h-12 w-12 rounded-full bg-secondary-container flex items-center justify-center text-white shrink-0">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{mission.icon}</span>
                      </div>
                      <div className="flex-grow">
                        <p className="font-label-caps text-label-caps text-secondary-container">{mission.category === 'proyek' ? 'KASUS' : 'LEVEL'} {mission.level} • AKTIF</p>
                        <h4 className="font-title-md text-title-md text-primary">{mission.title}</h4>
                      </div>
                    </div>
                    <button
                      onClick={() => handleMissionClick(mission, status)}
                      className="bg-primary text-on-primary font-label-caps text-label-caps py-sm px-md rounded w-full tactile-btn flex justify-center items-center gap-xs"
                    >
                      {hasDraft ? (
                        <>
                          LANJUTKAN
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                        </>
                      ) : (
                        <>
                          MULAI MISI
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              }

              // Locked
              return (
                <div key={mission.id} className="bg-surface-variant opacity-60 tactile-card rounded-lg p-sm flex items-center gap-sm border-l-4 border-l-outline cursor-not-allowed">
                  <div className="h-12 w-12 rounded-full bg-surface-dim flex items-center justify-center text-outline shrink-0">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                  <div className="flex-grow">
                    <p className="font-label-caps text-label-caps text-outline">{mission.category === 'proyek' ? 'KASUS' : 'LEVEL'} {mission.level} • TERKUNCI</p>
                    <h4 className="font-title-md text-title-md text-on-surface-variant">{mission.title}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </main>
    </div>
  );
}
