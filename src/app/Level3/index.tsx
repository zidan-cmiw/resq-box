// ── Missions/index.tsx ────────────────────────────────────────────
// Halaman Misi — Mission Center dan My Projects (dipindah dari Dashboard)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MISSIONS, CATEGORIES } from '../../missions/data/missions';
import { useMissionStore } from '../../store/missionStore';
import { useWorkspaceStore } from '../../store/workspaceStore';

// ── Confirmation Modal ──────────────────────────────────────────
function ConfirmModal({
  title,
  message,
  confirmLabel = 'YA, ULANGI',
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-card p-6 max-w-[400px] w-full mx-4 flex flex-col gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-error shrink-0"
            style={{ fontSize: '28px', fontVariationSettings: "'FILL' 1" }}
          >
            warning
          </span>
          <h3 className="font-title-md text-title-md text-on-surface">{title}</h3>
        </div>
        <p className="text-sm text-on-surface-variant leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 bg-surface-container-high border border-outline-variant text-on-surface font-semibold text-xs rounded-xl hover:bg-surface-container-highest transition-colors"
          >
            BATAL
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 bg-error text-on-error font-semibold text-xs rounded-xl tactile-btn hover:opacity-90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── New Project Modal ───────────────────────────────────────────
function NewProjectModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-card p-6 max-w-[400px] w-full mx-4 flex flex-col gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: '28px' }}>
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
          className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container focus:border-primary outline-none text-on-surface text-sm"
        />
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 bg-surface-container-high border border-outline-variant text-on-surface font-semibold text-xs rounded-xl hover:bg-surface-container-highest transition-colors"
          >
            BATAL
          </button>
          <button
            disabled={!name.trim()}
            onClick={() => name.trim() && onConfirm(name.trim())}
            className="flex-1 py-2.5 px-4 bg-primary text-on-primary font-semibold text-xs rounded-xl tactile-btn hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            BUAT
          </button>
        </div>
      </div>
    </div>
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

// ── Main Missions Page ──────────────────────────────────────────
export default function Missions() {
  const navigate = useNavigate();
  const { completedMissionIds, isUnlocked, currentCategoryIndex, setCurrentCategoryIndex, getCategoryProgress } = useMissionStore();
  const { projects, createProject, deleteProject, drafts, clearDraft } = useWorkspaceStore();

  const [confirmReplay, setConfirmReplay] = useState<string | null>(null);
  const [confirmDeleteProject, setConfirmDeleteProject] = useState<string | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [activeTab, setActiveTab] = useState<'missions' | 'projects'>('missions');

  const getMissionStatus = (missionId: string) => {
    if (!isUnlocked(missionId)) return 'locked';
    if (completedMissionIds.includes(missionId)) return 'completed';
    return 'active';
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

  const cat = CATEGORIES[currentCategoryIndex];
  const progress = getCategoryProgress(cat.id);

  return (
    <div className="min-h-screen p-6 lg:p-8">
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
          message="Proyek dan semua rancangan di dalamnya akan terhapus permanen."
          confirmLabel="YA, HAPUS"
          onConfirm={() => { deleteProject(confirmDeleteProject); setConfirmDeleteProject(null); }}
          onCancel={() => setConfirmDeleteProject(null)}
        />
      )}
      {showNewProject && (
        <NewProjectModal
          onConfirm={handleCreateProject}
          onCancel={() => setShowNewProject(false)}
        />
      )}

      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-6 animate-fade-in-up">
          <h1 className="text-3xl font-black text-on-surface flex items-center gap-3">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>
              sports_esports
            </span>
            Level 3: Simulation Game
          </h1>
          <p className="text-on-surface-variant mt-1">
            Praktikkan hasil analisismu ke dalam sistem nyata
          </p>
        </div>

        {/* Instructional Banner for Group Activity */}
        <div className="gradient-hero rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-6 relative overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex-1">
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400">group_work</span>
              Instruksi Kegiatan Kelompok
            </h2>
            <ul className="text-indigo-100 text-sm space-y-3">
              <li className="flex gap-3 items-start">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 font-bold text-xs shrink-0 mt-0.5">1</span>
                <span>Peserta didik dalam kelompok memeragakan skenario simulasi berdasarkan <strong>LKPD</strong> nstrasi yang dipaparkan.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 font-bold text-xs shrink-0 mt-0.5">2</span>
                <span>Peserta didik mengamati respons <strong>diorama fisik</strong> (board) dan visualisasinya pada website.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 font-bold text-xs shrink-0 mt-0.5">3</span>
                <span>Peserta didik dalam kelompok <strong>mendiskusikan keterkaitan</strong> antara hasil logika yang digunakan dengan simulasi kebencanaan yang dijalankan, serta mengevaluasi langkah mitigasi yang paling tepat berdasarkan skenario yang diberikan.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('missions')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'missions'
              ? 'bg-primary/15 text-primary border border-primary/30'
              : 'text-on-surface-variant hover:bg-white/5 border border-transparent'
              }`}
          >
            <span className="material-symbols-outlined text-sm mr-1.5 align-middle" style={{ fontSize: '18px' }}>
              flag
            </span>
            Misi
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'projects'
              ? 'bg-secondary/15 text-secondary border border-secondary/30'
              : 'text-on-surface-variant hover:bg-white/5 border border-transparent'
              }`}
          >
            <span className="material-symbols-outlined text-sm mr-1.5 align-middle" style={{ fontSize: '18px' }}>
              folder
            </span>
            Proyek Saya
          </button>
        </div>

        {/* ── Mission Tab ── */}
        {activeTab === 'missions' && (
          <div className="animate-fade-in-up">
            {/* Category Selector */}
            <div className="glass-card p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">{cat.icon}</span>
                <div>
                  <p className="font-semibold text-on-surface">{cat.title}</p>
                  <p className="text-xs text-on-surface-variant">
                    {progress.completed} / {progress.total} misi selesai
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentCategoryIndex === 0}
                  onClick={() => setCurrentCategoryIndex(Math.max(0, currentCategoryIndex - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 disabled:opacity-25 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <span className="text-xs text-on-surface-variant font-semibold min-w-[60px] text-center">
                  {currentCategoryIndex + 1} / {CATEGORIES.length}
                </span>
                <button
                  disabled={currentCategoryIndex === CATEGORIES.length - 1}
                  onClick={() => setCurrentCategoryIndex(Math.min(CATEGORIES.length - 1, currentCategoryIndex + 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 disabled:opacity-25 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="h-2 w-full rounded-full overflow-hidden bg-surface-container-high">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Mission List */}
            <div className="flex flex-col gap-3 stagger">
              {MISSIONS.filter((m) => m.category === cat.id).map((mission) => {
                const status = getMissionStatus(mission.id);
                const hasDraft = hasMissionDraft(mission.id);

                if (status === 'completed') {
                  return (
                    <div
                      key={mission.id}
                      className="glass-card p-4 flex items-center gap-4 border-l-4 border-l-emerald-500 animate-fade-in-up"
                    >
                      <div className="h-12 w-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      </div>
                      <div className="flex-grow">
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                          {mission.category === 'proyek' ? 'KASUS' : 'SKENARIO'} {mission.level} • SELESAI
                        </p>
                        <h4 className="font-semibold text-on-surface">{mission.title}</h4>
                      </div>
                      <button
                        onClick={() => hasDraft ? navigate(`/workspace?mission=${mission.id}`) : setConfirmReplay(mission.id)}
                        className="bg-surface-container-high text-on-surface text-xs font-bold py-2 px-4 rounded-xl border border-outline-variant hover:bg-surface-container-highest transition-colors"
                      >
                        {hasDraft ? 'LANJUTKAN' : 'ULANGI'}
                      </button>
                    </div>
                  );
                }

                if (status === 'active') {
                  return (
                    <div
                      key={mission.id}
                      className="glass-card glass-card-hover p-4 border-l-4 border-l-primary glow-indigo animate-fade-in-up"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{mission.icon}</span>
                        </div>
                        <div className="flex-grow">
                          <p className="text-xs font-bold text-primary uppercase tracking-wider">
                            {mission.category === 'proyek' ? 'KASUS' : 'SKENARIO'} {mission.level} • AKTIF
                          </p>
                          <h4 className="font-semibold text-on-surface">{mission.title}</h4>
                        </div>
                      </div>
                      <button
                        onClick={() => handleMissionClick(mission, status)}
                        className="w-full bg-primary text-on-primary font-bold text-sm py-2.5 px-4 rounded-xl tactile-btn flex justify-center items-center gap-2"
                      >
                        {hasDraft ? 'LANJUTKAN' : 'MULAI MISI'}
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                      </button>
                    </div>
                  );
                }

                // Locked
                return (
                  <div
                    key={mission.id}
                    className="glass-card p-4 flex items-center gap-4 opacity-40 cursor-not-allowed animate-fade-in-up"
                  >
                    <div className="h-12 w-12 rounded-xl bg-surface-container-high flex items-center justify-center text-outline shrink-0">
                      <span className="material-symbols-outlined">lock</span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs font-bold text-outline uppercase tracking-wider">
                        {mission.category === 'proyek' ? 'KASUS' : 'SKENARIO'} {mission.level} • TERKUNCI
                      </p>
                      <h4 className="font-semibold text-on-surface-variant">{mission.title}</h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Projects Tab ── */}
        {activeTab === 'projects' && (
          <div className="animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="glass-card glass-card-hover p-5 flex flex-col justify-between h-48 relative group animate-fade-in-up"
                >
                  <button
                    onClick={() => setConfirmDeleteProject(project.id)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-on-surface-variant hover:text-error p-1.5 rounded-lg hover:bg-error/10"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                  </button>
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined">sensors</span>
                      </div>
                      {drafts[project.id]?.workspaceJson && (
                        <span className="text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                          DRAFT
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-on-surface mb-1">{project.name}</h3>
                    <p className="text-xs text-on-surface-variant font-pixel">
                      {formatRelative(project.updatedAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/workspace?project=${project.id}`)}
                    className="bg-primary text-on-primary font-bold text-xs py-2.5 rounded-xl tactile-btn w-full flex justify-center items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                    LANJUTKAN
                  </button>
                </div>
              ))}

              {/* Add New Project Card */}
              <button
                onClick={() => setShowNewProject(true)}
                className="glass-card border-2 border-dashed border-outline-variant p-5 flex flex-col items-center justify-center h-48 gap-3 hover:border-primary hover:bg-primary/5 transition-all text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined text-4xl">add_circle</span>
                <span className="text-xs font-bold uppercase tracking-wider">Buat Proyek Baru</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
