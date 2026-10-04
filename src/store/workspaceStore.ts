import { create } from 'zustand';

// ── Types ────────────────────────────────────────────────────────
export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  workspaceJson: object | null;
  generatedCode: string;
}

export function getActiveUserId(): string {
  if (typeof window === 'undefined') return 'guest';
  try {
    const raw = localStorage.getItem('resqbox-current-user');
    if (raw) {
      const user = JSON.parse(raw);
      if (user?.id) return user.id;
    }
  } catch {}
  return 'guest';
}

function getUserWorkspaceKey(userId?: string): string {
  return `resqbox_workspace_${userId || 'guest'}`;
}

export function loadWorkspaceForUser(userId?: string): {
  drafts: Record<string, { workspaceJson: object | null; generatedCode: string; generatedJsCode: string }>;
  projects: Project[];
} {
  if (typeof window === 'undefined') return { drafts: {}, projects: [] };
  try {
    const key = getUserWorkspaceKey(userId);
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        drafts: parsed.drafts || {},
        projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      };
    }
  } catch {}
  return { drafts: {}, projects: [] };
}

export function saveWorkspaceForUser(
  userId: string | undefined,
  data: {
    drafts: Record<string, { workspaceJson: object | null; generatedCode: string; generatedJsCode: string }>;
    projects: Project[];
  }
) {
  if (typeof window === 'undefined') return;
  try {
    const key = getUserWorkspaceKey(userId);
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

interface WorkspaceState {
  // Active context: either a project id or a mission id ('mission_01', etc.)
  activeContextId: string | null;

  // Per-context storage key → { workspaceJson, generatedCode, generatedJsCode }
  drafts: Record<string, { workspaceJson: object | null; generatedCode: string; generatedJsCode: string }>;

  // Project list
  projects: Project[];

  // Derived getters (convenience)
  getActiveDraft: () => { workspaceJson: object | null; generatedCode: string; generatedJsCode: string } | null;

  // Actions
  setActiveContext: (id: string | null) => void;
  saveDraft: (contextId: string, json: object | null, code: string, jsCode: string) => void;
  clearDraft: (contextId: string) => void;

  // Project management
  createProject: (name: string) => Project;
  deleteProject: (id: string) => void;
  renameProject: (id: string, name: string) => void;
  updateProjectCode: (id: string, code: string) => void;

  // Multi-user synchronization
  syncUser: (userId?: string) => void;
}

const initialUserId = getActiveUserId();
const initialData = loadWorkspaceForUser(initialUserId);

export const useWorkspaceStore = create<WorkspaceState>()((set, get) => ({
  activeContextId: null,
  drafts: initialData.drafts,
  projects: initialData.projects,

  syncUser: (userId?: string) => {
    const targetUserId = userId || getActiveUserId();
    const data = loadWorkspaceForUser(targetUserId);
    set({
      activeContextId: null,
      drafts: data.drafts,
      projects: data.projects,
    });
  },

  getActiveDraft: () => {
    const { activeContextId, drafts } = get();
    if (!activeContextId) return null;
    return drafts[activeContextId] ?? null;
  },

  setActiveContext: (id) => set({ activeContextId: id }),

  saveDraft: (contextId, json, code, jsCode) => {
    const userId = getActiveUserId();
    const { drafts, projects } = get();
    const nextDrafts = {
      ...drafts,
      [contextId]: { workspaceJson: json, generatedCode: code, generatedJsCode: jsCode },
    };
    const nextProjects = projects.map((p) =>
      p.id === contextId
        ? { ...p, generatedCode: code, updatedAt: new Date().toISOString() }
        : p
    );
    saveWorkspaceForUser(userId, { drafts: nextDrafts, projects: nextProjects });
    set({ drafts: nextDrafts, projects: nextProjects });
  },

  clearDraft: (contextId) => {
    const userId = getActiveUserId();
    const { drafts, projects } = get();
    const { [contextId]: _removed, ...rest } = drafts;
    saveWorkspaceForUser(userId, { drafts: rest, projects });
    set({ drafts: rest });
  },

  createProject: (name) => {
    const userId = getActiveUserId();
    const { drafts, projects } = get();
    const project: Project = {
      id: `project_${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      workspaceJson: null,
      generatedCode: '',
    };
    const nextProjects = [...projects, project];
    saveWorkspaceForUser(userId, { drafts, projects: nextProjects });
    set({ projects: nextProjects });
    return project;
  },

  deleteProject: (id) => {
    const userId = getActiveUserId();
    const { drafts, projects } = get();
    const nextProjects = projects.filter((p) => p.id !== id);
    const nextDrafts = Object.fromEntries(
      Object.entries(drafts).filter(([k]) => k !== id)
    );
    saveWorkspaceForUser(userId, { drafts: nextDrafts, projects: nextProjects });
    set({ drafts: nextDrafts, projects: nextProjects });
  },

  renameProject: (id, name) => {
    const userId = getActiveUserId();
    const { drafts, projects } = get();
    const nextProjects = projects.map((p) =>
      p.id === id ? { ...p, name, updatedAt: new Date().toISOString() } : p
    );
    saveWorkspaceForUser(userId, { drafts, projects: nextProjects });
    set({ projects: nextProjects });
  },

  updateProjectCode: (id, code) => {
    const userId = getActiveUserId();
    const { drafts, projects } = get();
    const nextProjects = projects.map((p) =>
      p.id === id ? { ...p, generatedCode: code, updatedAt: new Date().toISOString() } : p
    );
    saveWorkspaceForUser(userId, { drafts, projects: nextProjects });
    set({ projects: nextProjects });
  },
}));

// Automatic subscription to auth store changes
if (typeof window !== 'undefined') {
  import('./teacherStore').then(({ useAuthStore }) => {
    useAuthStore.subscribe((state, prevState) => {
      const currentId = state.currentUser?.id || 'guest';
      const prevId = prevState?.currentUser?.id || 'guest';
      if (currentId !== prevId) {
        useWorkspaceStore.getState().syncUser(currentId);
      }
    });
  });
}

// ── Legacy shim — so old components still compile ───────────────
// Provide a compatible interface for code that still uses old API
export function useLegacyWorkspaceCompat() {
  const store = useWorkspaceStore();
  const draft = store.getActiveDraft();
  return {
    workspaceJson: draft?.workspaceJson ?? null,
    generatedCode: draft?.generatedCode ?? '',
    generatedJsCode: draft?.generatedJsCode ?? '',
    setWorkspaceState: (json: object | null, code: string, jsCode: string) => {
      const id = store.activeContextId;
      if (id) store.saveDraft(id, json, code, jsCode);
    },
    clearWorkspace: () => {
      const id = store.activeContextId;
      if (id) store.clearDraft(id);
    },
  };
}
