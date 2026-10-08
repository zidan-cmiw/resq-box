// ── supabaseClient.ts ──────────────────────────────────────────────────────
// Supabase Cloud Real-Time Client + Resilient Local BroadcastChannel Fallback
// Mendukung autentikasi Akun Guru & Siswa, Multi-Kelas, Pembuatan & Penghapusan Akun Siswa,
// serta Rekap Rapor & Nilai Real-Time.

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { CustomAvatarConfig } from '../store/teacherStore';

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  role: 'student' | 'teacher';
  name: string;
  absent_number?: string;
  classroom_code?: string;
  school_name?: string;
  avatar_config?: CustomAvatarConfig;
  unlocked_level?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ClassroomRecord {
  id: string;
  code: string;
  name: string;
  teacher_username: string;
  school_name: string;
  created_at: string;
}

export interface StudentDbRecord {
  id: string;
  user_id?: string;
  classroom_code: string;
  name: string;
  username?: string;
  password?: string;
  class_name: string;
  absent_number: string;
  avatar_config: CustomAvatarConfig;
  unlocked_level: number;
  created_at?: string;
  updated_at?: string;
}

export interface LevelSubmissionDbRecord {
  id: string;
  student_id: string;
  student_name: string;
  classroom_code: string;
  level_number: number;
  score: number;
  details?: Record<string, any>;
  completed_at: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  supabaseAnonKey.length > 20
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local BroadcastChannel for live multi-tab simulator when offline / without cloud keys
const localBroadcast = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('resqbox_class_channel')
  : null;

// Local storage keys
const LOCAL_STORAGE_USERS_KEY = 'resqbox-cloud-users';
const LOCAL_STORAGE_CLASSES_KEY = 'resqbox-cloud-classes';
const LOCAL_STORAGE_STUDENTS_KEY = 'resqbox-cloud-students';
const LOCAL_STORAGE_SUBMISSIONS_KEY = 'resqbox-cloud-submissions';

// ── DEFAULT INITIAL SEED DATA ──────────────────────────────────────────────
const DEFAULT_AVATAR: CustomAvatarConfig = {
  skin: 'warm',
  hairStyle: 'spiky',
  hairColor: '#3e2723',
  eyes: 'determined',
  outfit: 'vest-orange',
  accessory: 'walkie',
  bgTheme: 'amber',
};

function getInitialUsers(): UserAccount[] {
  return [
    {
      id: 'teacher-1',
      username: 'guru',
      password: 'guru123',
      role: 'teacher',
      name: 'Bapak Hendra, S.Pd (Guru IPA)',
      school_name: 'SMP Negeri 1',
      created_at: new Date().toISOString(),
    },
    {
      id: 'std-demo-all-unlocked',
      username: 'demo',
      password: 'demo123',
      role: 'student',
      name: 'Taruna Demo (Semua Level Terbuka)',
      absent_number: '99',
      classroom_code: 'RESQ-8A',
      school_name: 'SMP Negeri 1 (Demo Testing)',
      avatar_config: DEFAULT_AVATAR,
      unlocked_level: 3,
      created_at: new Date().toISOString(),
    },
  ];
}

function getInitialClassrooms(): ClassroomRecord[] {
  return [
    {
      id: 'cls-1',
      code: 'RESQ-8A',
      name: 'Kelas VIII-A (IPA)',
      teacher_username: 'guru',
      school_name: 'SMP Negeri 1',
      created_at: new Date().toISOString(),
    },
    {
      id: 'cls-2',
      code: 'RESQ-8B',
      name: 'Kelas VIII-B (IPA)',
      teacher_username: 'guru',
      school_name: 'SMP Negeri 1',
      created_at: new Date().toISOString(),
    },
  ];
}

function getInitialStudentsList(): StudentDbRecord[] {
  return [
    {
      id: 'std-demo-all-unlocked',
      user_id: 'std-demo-all-unlocked',
      classroom_code: 'RESQ-8A',
      name: 'Taruna Demo (Semua Level Terbuka)',
      username: 'demo',
      password: 'demo123',
      class_name: 'Kelas VIII-A (IPA)',
      absent_number: '99',
      avatar_config: DEFAULT_AVATAR,
      unlocked_level: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

function getInitialSubmissionsList(): LevelSubmissionDbRecord[] {
  return [];
}

// ── LOCAL STORAGE ACCESSORS ────────────────────────────────────────────────
export function getLocalUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    if (!raw) {
      const init = getInitialUsers();
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(init));
      return init;
    }
    const list: UserAccount[] = JSON.parse(raw);
    // Remove obsolete test accounts
    const cleaned = list.filter((u) => u.username !== 'budi8a' && u.username !== 'siti8a');
    
    // Ensure default teacher account exists
    if (!cleaned.some((u) => u.username === 'guru')) {
      cleaned.unshift(getInitialUsers()[0]);
    }
    
    // Ensure default demo student account exists with unlocked_level: 3
    const demoIdx = cleaned.findIndex((u) => u.username === 'demo');
    if (demoIdx < 0) {
      cleaned.push(getInitialUsers()[1]);
    } else {
      cleaned[demoIdx].unlocked_level = 3;
    }

    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(cleaned));
    return cleaned;
  } catch {
    return getInitialUsers();
  }
}

export function saveLocalUsers(list: UserAccount[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(list));
  } catch { }
}

export function getLocalClasses(): ClassroomRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CLASSES_KEY);
    if (!raw) {
      const init = getInitialClassrooms();
      localStorage.setItem(LOCAL_STORAGE_CLASSES_KEY, JSON.stringify(init));
      return init;
    }
    const list: ClassroomRecord[] = JSON.parse(raw);
    if (list.length === 0) {
      const init = getInitialClassrooms();
      localStorage.setItem(LOCAL_STORAGE_CLASSES_KEY, JSON.stringify(init));
      return init;
    }
    return list;
  } catch {
    return getInitialClassrooms();
  }
}

export function saveLocalClasses(list: ClassroomRecord[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_CLASSES_KEY, JSON.stringify(list));
  } catch { }
}

export function getLocalStudents(): StudentDbRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_STUDENTS_KEY);
    if (!raw) {
      const init = getInitialStudentsList();
      localStorage.setItem(LOCAL_STORAGE_STUDENTS_KEY, JSON.stringify(init));
      return init;
    }
    const list: StudentDbRecord[] = JSON.parse(raw);
    const cleaned = list.filter(
      (s) => s.id !== 'std-budi' && s.id !== 'std-siti' && s.username !== 'budi8a' && s.username !== 'siti8a'
    );
    if (!cleaned.some((s) => s.username === 'demo')) {
      cleaned.push(getInitialStudentsList()[0]);
    }
    localStorage.setItem(LOCAL_STORAGE_STUDENTS_KEY, JSON.stringify(cleaned));
    return cleaned;
  } catch {
    return getInitialStudentsList();
  }
}

export function saveLocalStudents(list: StudentDbRecord[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_STUDENTS_KEY, JSON.stringify(list));
  } catch { }
}

export function getLocalSubmissions(): LevelSubmissionDbRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SUBMISSIONS_KEY);
    if (!raw) {
      const init = getInitialSubmissionsList();
      localStorage.setItem(LOCAL_STORAGE_SUBMISSIONS_KEY, JSON.stringify(init));
      return init;
    }
    const list: LevelSubmissionDbRecord[] = JSON.parse(raw);
    const cleaned = list.filter((s) => s.student_id !== 'std-budi' && s.student_id !== 'std-siti' && !s.student_id.startsWith('std-demo'));
    if (cleaned.length !== list.length) {
      localStorage.setItem(LOCAL_STORAGE_SUBMISSIONS_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch {
    return getInitialSubmissionsList();
  }
}

export function saveLocalSubmissions(list: LevelSubmissionDbRecord[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_SUBMISSIONS_KEY, JSON.stringify(list));
  } catch { }
}

// ── 1. AUTENTIKASI (LOGIN & REGISTER) ──────────────────────────────────────

export async function loginUser(
  usernameInput: string,
  passwordInput: string,
  role: 'student' | 'teacher'
): Promise<{ success: boolean; user?: UserAccount; message?: string }> {
  const username = usernameInput.trim().toLowerCase();
  const password = passwordInput.trim();

  // Supabase cloud: verify password server-side via RPC (never exposes hash)
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('verify_login', {
        p_username: username,
        p_password: password,
        p_role: role,
      });

      if (!error && data) {
        const result = typeof data === 'string' ? JSON.parse(data) : data;
        if (result.success && result.user) {
          return { success: true, user: result.user };
        }
        if (result.message) {
          return { success: false, message: result.message };
        }
      }
    } catch { }
  }

  // Local fallback
  const users = getLocalUsers();
  const user = users.find(
    (u) => u.username.toLowerCase() === username && u.role === role
  );

  if (!user) {
    return {
      success: false,
      message:
        role === 'teacher'
          ? 'Akun Guru tidak ditemukan. Gunakan username: guru dan password: guru123'
          : 'Akun Siswa tidak ditemukan. Silakan buat akun baru dengan klik [DAFTAR AKUN BARU] atau minta dibuatkan oleh gurumu.',
    };
  }

  if (user.password !== password) {
    return { success: false, message: 'Password yang kamu masukkan salah!' };
  }

  return { success: true, user };
}

export function findMatchingClass(input: string): ClassroomRecord | null {
  const raw = input.trim();
  if (!raw) return null;
  const clean = raw.toUpperCase().replace(/[\s\-_]/g, '');
  const classes = getLocalClasses();

  // 1. Direct code match (e.g. "RESQ-8B", "RESQ8B")
  const directMatch = classes.find(
    (c) => c.code.toUpperCase() === raw.toUpperCase() || c.code.toUpperCase().replace(/[\s\-_]/g, '') === clean
  );
  if (directMatch) return directMatch;

  // 2. Suffix & fuzzy name match (e.g. "8B", "8-B", "VIII-B", "VIIIB", "Kelas 8B", "Kelas VIII-B")
  const normalizedInput = clean.replace(/VIII/g, '8').replace(/VII/g, '7').replace(/IX/g, '9');

  const match = classes.find((c) => {
    const codeNorm = c.code.toUpperCase().replace(/[\s\-_]/g, '');
    const nameNorm = c.name.toUpperCase().replace(/[\s\-_]/g, '');
    const normalizedCode = codeNorm.replace(/VIII/g, '8').replace(/VII/g, '7').replace(/IX/g, '9');
    const normalizedName = nameNorm.replace(/VIII/g, '8').replace(/VII/g, '7').replace(/IX/g, '9');

    // Exact matches after roman/arabic normalization
    if (codeNorm === clean || normalizedCode === normalizedInput) return true;

    // Code ends with input (e.g. "RESQ8B" ends with "8B", "RESQ-8B" ends with "8B")
    if (codeNorm.endsWith(clean) || normalizedCode.endsWith(normalizedInput)) return true;

    // Class name contains input (e.g. "KELAS8B(IPA)" contains "8B" or "KELAS8B")
    if (nameNorm.includes(clean) || normalizedName.includes(normalizedInput)) return true;

    return false;
  });

  return match || null;
}

// Siswa Mendaftar Mandiri
export async function registerStudent(data: {
  username: string;
  password: string;
  name: string;
  absent_number: string;
  classroom_code: string;
}): Promise<{ success: boolean; user?: UserAccount; message?: string }> {
  const username = data.username.trim().toLowerCase();
  const users = getLocalUsers();

  if (users.some((u) => u.username.toLowerCase() === username)) {
    return { success: false, message: `Username "${username}" sudah digunakan! Silakan pilih username lain.` };
  }

  // Strict Classroom Lookup
  const matchedClass = findMatchingClass(data.classroom_code);
  if (!matchedClass) {
    const availableCodes = getLocalClasses().map((c) => c.code).join(', ');
    return {
      success: false,
      message: `Kode kelas "${data.classroom_code}" tidak ditemukan! Pastikan kamu memasukkan kode kelas yang benar dari gurumu (contoh: ${availableCodes || 'RESQ-8A'}).`,
    };
  }

  const cleanClassCode = matchedClass.code;
  const className = matchedClass.name;

  const newUser: UserAccount = {
    id: `std-${Date.now()}`,
    username,
    password: data.password.trim(),
    role: 'student',
    name: data.name.trim(),
    absent_number: data.absent_number.trim() || '1',
    classroom_code: cleanClassCode,
    school_name: matchedClass.school_name || 'SMP Negeri 1',
    avatar_config: DEFAULT_AVATAR,
    unlocked_level: 1,
    created_at: new Date().toISOString(),
  };

  users.push(newUser);
  saveLocalUsers(users);

  // Add to students list
  const students = getLocalStudents();
  const newStudentRec: StudentDbRecord = {
    id: newUser.id,
    user_id: newUser.id,
    classroom_code: cleanClassCode,
    name: newUser.name,
    username: newUser.username,
    password: newUser.password,
    class_name: className,
    absent_number: newUser.absent_number || '1',
    avatar_config: DEFAULT_AVATAR,
    unlocked_level: 1,
    updated_at: new Date().toISOString(),
  };
  students.push(newStudentRec);
  saveLocalStudents(students);

  // Broadcast to teacher dashboard
  if (localBroadcast) {
    localBroadcast.postMessage({
      type: 'STUDENT_UPDATED',
      payload: newStudentRec,
    });
  }

  if (supabase) {
    try {
      const { data: rpcData } = await supabase.rpc('register_student_account', {
        p_username: username,
        p_password: data.password.trim(),
        p_name: data.name.trim(),
        p_absent_number: data.absent_number.trim() || '1',
        p_classroom_code: cleanClassCode,
      });
      // If RPC returned a UUID id, use it for local record consistency
      if (rpcData) {
        const res = typeof rpcData === 'string' ? JSON.parse(rpcData) : rpcData;
        if (res.success && res.user?.id) {
          newUser.id = res.user.id;
          newStudentRec.id = res.user.id;
          newStudentRec.user_id = res.user.id;
        }
      }
    } catch { }
  }

  return { success: true, user: newUser };
}

// Guru Mendaftar Akun Baru
export async function registerTeacher(data: {
  username: string;
  password: string;
  name: string;
  school_name: string;
}): Promise<{ success: boolean; user?: UserAccount; message?: string }> {
  const username = data.username.trim().toLowerCase();
  const users = getLocalUsers();

  if (users.some((u) => u.username.toLowerCase() === username)) {
    return { success: false, message: `Username "${username}" sudah digunakan!` };
  }

  const newTeacher: UserAccount = {
    id: `teacher-${Date.now()}`,
    username,
    password: data.password.trim(),
    role: 'teacher',
    name: data.name.trim(),
    school_name: data.school_name.trim() || 'SMP Negeri 1',
    created_at: new Date().toISOString(),
  };

  users.push(newTeacher);
  saveLocalUsers(users);

  // Create initial class for this teacher
  const initialClassCode = `RESQ-${Math.floor(100 + Math.random() * 900)}`;
  const classes = getLocalClasses();
  classes.push({
    id: `cls-${Date.now()}`,
    code: initialClassCode,
    name: 'Kelas Utama (IPA)',
    teacher_username: username,
    school_name: newTeacher.school_name || 'SMP Negeri 1',
    created_at: new Date().toISOString(),
  });
  saveLocalClasses(classes);

  if (supabase) {
    try {
      const { data: rpcData } = await supabase.rpc('register_teacher_account', {
        p_username: username,
        p_password: data.password.trim(),
        p_name: data.name.trim(),
        p_school_name: data.school_name.trim() || 'SMP Negeri 1',
      });
      if (rpcData) {
        const res = typeof rpcData === 'string' ? JSON.parse(rpcData) : rpcData;
        if (res.success && res.user?.id) {
          newTeacher.id = res.user.id;
        }
      }
    } catch { }
  }

  return { success: true, user: newTeacher };
}


export async function fetchTeacherClassrooms(teacherUsername: string): Promise<ClassroomRecord[]> {
  const classes = getLocalClasses();
  const list = classes.filter((c) => c.teacher_username.toLowerCase() === teacherUsername.toLowerCase() || teacherUsername === 'guru');
  return list.length > 0 ? list : getInitialClassrooms();
}

export async function createClassroom(
  name: string,
  teacherUsername: string,
  schoolName: string = 'SMP Negeri 1'
): Promise<ClassroomRecord> {
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const code = `RESQ-${name.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase() || 'CLS'}${randomSuffix}`;

  const newClass: ClassroomRecord = {
    id: `cls-${Date.now()}`,
    code,
    name: name.trim(),
    teacher_username: teacherUsername,
    school_name: schoolName,
    created_at: new Date().toISOString(),
  };

  const classes = getLocalClasses();
  classes.push(newClass);
  saveLocalClasses(classes);

  if (supabase) {
    try {
      await supabase.rpc('rpc_create_classroom', {
        p_code: newClass.code,
        p_name: newClass.name,
        p_teacher: teacherUsername,
        p_school: schoolName,
      });
    } catch { }
  }

  return newClass;
}

export async function updateClassroomName(classroomCode: string, newName: string): Promise<ClassroomRecord | null> {
  const trimmedName = newName.trim();
  if (!trimmedName) return null;

  // 1. Update in local classes list
  const classes = getLocalClasses();
  const clsIdx = classes.findIndex((c) => c.code === classroomCode);
  let updatedRecord: ClassroomRecord | null = null;
  if (clsIdx >= 0) {
    classes[clsIdx].name = trimmedName;
    updatedRecord = classes[clsIdx];
    saveLocalClasses(classes);
  }

  // 2. Update class_name for all students in this class
  const students = getLocalStudents();
  let updatedAnyStudent = false;
  students.forEach((s) => {
    if (s.classroom_code === classroomCode || findMatchingClass(s.classroom_code)?.code === classroomCode) {
      s.class_name = trimmedName;
      updatedAnyStudent = true;
    }
  });
  if (updatedAnyStudent) {
    saveLocalStudents(students);
  }

  // 3. Broadcast update to all tabs
  if (localBroadcast && updatedRecord) {
    localBroadcast.postMessage({
      type: 'CLASSROOM_UPDATED',
      payload: updatedRecord,
    });
  }

  // 4. Update in Supabase if configured
  if (supabase) {
    try {
      await supabase.rpc('rpc_update_classroom_name', {
        p_code: classroomCode,
        p_name: trimmedName,
      });
    } catch { }
  }

  return updatedRecord;
}

export async function updateTeacherProfile(
  username: string,
  updates: { name?: string; school_name?: string }
): Promise<{ success: boolean; user?: UserAccount }> {
  const users = getLocalUsers();
  const idx = users.findIndex((u) => u.username.toLowerCase() === username.toLowerCase() && u.role === 'teacher');
  if (idx < 0) return { success: false };

  if (updates.name !== undefined) users[idx].name = updates.name.trim();
  if (updates.school_name !== undefined) users[idx].school_name = updates.school_name.trim();
  users[idx].updated_at = new Date().toISOString();
  saveLocalUsers(users);

  // Update resqbox-current-user in localStorage if it's the same account
  try {
    const raw = localStorage.getItem('resqbox-current-user');
    if (raw) {
      const cur: UserAccount = JSON.parse(raw);
      if (cur.username.toLowerCase() === username.toLowerCase()) {
        if (updates.name !== undefined) cur.name = updates.name.trim();
        if (updates.school_name !== undefined) cur.school_name = updates.school_name.trim();
        localStorage.setItem('resqbox-current-user', JSON.stringify(cur));
      }
    }
  } catch { }

  if (supabase) {
    try {
      await supabase.rpc('rpc_update_teacher_profile', {
        p_username: username,
        p_name: updates.name || null,
        p_school: updates.school_name || null,
      });
    } catch { }
  }

  return { success: true, user: users[idx] };
}

export async function deleteClassroom(classroomCode: string): Promise<boolean> {
  // 1. Delete classroom record from classes list
  const classes = getLocalClasses().filter((c) => c.code !== classroomCode);
  saveLocalClasses(classes);

  // 2. Identify all students belonging to this class (exact or fuzzy code)
  const allStudents = getLocalStudents();
  const studentsInClass = allStudents.filter(
    (s) => s.classroom_code === classroomCode || (findMatchingClass(s.classroom_code)?.code === classroomCode)
  );
  const studentIdsToDelete = new Set(studentsInClass.map((s) => s.id));

  // 3. Cascade Delete students from students list
  const remainingStudents = allStudents.filter((s) => !studentIdsToDelete.has(s.id));
  saveLocalStudents(remainingStudents);

  // 4. Cascade Delete user accounts belonging to these students or matching classroom_code
  const users = getLocalUsers().filter(
    (u) => !studentIdsToDelete.has(u.id) && u.classroom_code !== classroomCode
  );
  saveLocalUsers(users);

  // 5. Cascade Delete all submissions belonging to these students or matching classroom_code
  const submissions = getLocalSubmissions().filter(
    (s) => !studentIdsToDelete.has(s.student_id) && s.classroom_code !== classroomCode
  );
  saveLocalSubmissions(submissions);

  // 6. Broadcast delete event to all tabs
  if (localBroadcast) {
    localBroadcast.postMessage({
      type: 'CLASSROOM_DELETED',
      payload: { classroomCode },
    });
  }

  // 7. Supabase cloud cascade delete if configured
  if (supabase) {
    try {
      await supabase.rpc('rpc_delete_classroom', { p_code: classroomCode });
    } catch { }
  }

  return true;
}

// ── 3. MANAJEMEN AKUN SISWA OLEH GURU ─────────────────────────────────────

// Guru Membuatkan Akun Siswa Langsung di Kelas
export async function createStudentByTeacher(data: {
  classroom_code: string;
  name: string;
  absent_number: string;
  username: string;
  password: string;
  class_name?: string;
}): Promise<{ success: boolean; student?: StudentDbRecord; message?: string }> {
  const username = data.username.trim().toLowerCase();
  const users = getLocalUsers();

  if (users.some((u) => u.username.toLowerCase() === username)) {
    return { success: false, message: `Username "${username}" sudah ada!` };
  }

  const newStudentId = `std-${Date.now()}-${Math.random().toString(36).substr(2, 3)}`;

  // Create User Account
  const newUser: UserAccount = {
    id: newStudentId,
    username,
    password: data.password.trim(),
    role: 'student',
    name: data.name.trim(),
    absent_number: data.absent_number.trim(),
    classroom_code: data.classroom_code,
    school_name: 'SMP Negeri 1',
    avatar_config: DEFAULT_AVATAR,
    unlocked_level: 1,
    created_at: new Date().toISOString(),
  };
  users.push(newUser);
  saveLocalUsers(users);

  // Create Student Record
  const newStudentRec: StudentDbRecord = {
    id: newStudentId,
    user_id: newStudentId,
    classroom_code: data.classroom_code,
    name: data.name.trim(),
    username,
    password: data.password.trim(),
    class_name: data.class_name || 'Kelas VIII-A',
    absent_number: data.absent_number.trim(),
    avatar_config: DEFAULT_AVATAR,
    unlocked_level: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const students = getLocalStudents();
  students.push(newStudentRec);
  saveLocalStudents(students);

  // Broadcast event
  if (localBroadcast) {
    localBroadcast.postMessage({
      type: 'STUDENT_UPDATED',
      payload: newStudentRec,
    });
  }

  if (supabase) {
    try {
      const { data: rpcResult } = await supabase.rpc('create_student_by_teacher', {
        p_classroom_code: data.classroom_code,
        p_name: data.name.trim(),
        p_absent_number: data.absent_number.trim(),
        p_username: username,
        p_password: data.password.trim(),
        p_class_name: data.class_name || 'Kelas VIII-A',
      });
      if (rpcResult) {
        const res = typeof rpcResult === 'string' ? JSON.parse(rpcResult) : rpcResult;
        if (res.success && res.student?.id) {
          newUser.id = res.student.id;
          newStudentRec.id = res.student.id;
          newStudentRec.user_id = res.student.id;
        }
      }
    } catch { }
  }

  return { success: true, student: newStudentRec };
}

// Guru Menghapus Akun Siswa dari Kelas
export async function deleteStudentAccount(studentId: string, classroomCode: string): Promise<boolean> {
  // Delete from students list
  const students = getLocalStudents().filter((s) => s.id !== studentId);
  saveLocalStudents(students);

  // Delete from users list
  const users = getLocalUsers().filter((u) => u.id !== studentId && u.username !== studentId);
  saveLocalUsers(users);

  // Delete from submissions
  const subs = getLocalSubmissions().filter((s) => s.student_id !== studentId);
  saveLocalSubmissions(subs);

  // Broadcast delete
  if (localBroadcast) {
    localBroadcast.postMessage({
      type: 'STUDENT_DELETED',
      payload: { studentId, classroomCode },
    });
  }

  if (supabase) {
    try {
      await supabase.rpc('rpc_delete_student', { p_student_id: studentId });
    } catch { }
  }

  return true;
}

// ── 4. SINKRONISASI PROGRES SISWA & REKAP NILAI ────────────────────────────

export async function syncStudentToCloud(student: StudentDbRecord): Promise<boolean> {
  const timestamp = new Date().toISOString();
  const record: StudentDbRecord = {
    ...student,
    updated_at: timestamp,
  };

  const localList = getLocalStudents();
  const existingIdx = localList.findIndex((s) => s.id === student.id || s.name === student.name);
  if (existingIdx >= 0) {
    localList[existingIdx] = { ...localList[existingIdx], ...record };
  } else {
    localList.push(record);
  }
  saveLocalStudents(localList);

  // Also update user account unlocked level
  const users = getLocalUsers();
  const userIdx = users.findIndex((u) => u.id === student.id || u.name === student.name);
  if (userIdx >= 0) {
    users[userIdx].unlocked_level = student.unlocked_level;
    users[userIdx].avatar_config = student.avatar_config;
    saveLocalUsers(users);
  }

  if (localBroadcast) {
    localBroadcast.postMessage({
      type: 'STUDENT_UPDATED',
      payload: record,
    });
  }

  if (supabase) {
    try {
      await supabase.rpc('rpc_upsert_student', {
        p_data: {
          id: record.id,
          classroom_code: record.classroom_code,
          name: record.name,
          class_name: record.class_name,
          absent_number: record.absent_number,
          avatar_config: record.avatar_config,
          unlocked_level: record.unlocked_level,
        },
      });
    } catch { }
  }

  return true;
}

export async function submitLevelProgress(
  submission: Omit<LevelSubmissionDbRecord, 'id' | 'completed_at'>
): Promise<boolean> {
  const fullSubmission: LevelSubmissionDbRecord = {
    ...submission,
    id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    completed_at: new Date().toISOString(),
  };

  const localSubmissions = getLocalSubmissions();
  const existingIdx = localSubmissions.findIndex(
    (s) => s.student_id === fullSubmission.student_id && s.level_number === fullSubmission.level_number
  );
  if (existingIdx >= 0) {
    localSubmissions[existingIdx] = fullSubmission;
  } else {
    localSubmissions.push(fullSubmission);
  }
  saveLocalSubmissions(localSubmissions);

  if (localBroadcast) {
    localBroadcast.postMessage({
      type: 'LEVEL_SUBMITTED',
      payload: fullSubmission,
    });
  }

  if (supabase) {
    try {
      await supabase.rpc('rpc_insert_submission', {
        p_data: fullSubmission,
      });
    } catch { }
  }

  // Synchronize student unlocked_level in local cache upon level completion
  if (fullSubmission.details?.is_completed || fullSubmission.score >= 100) {
    const nextLevel = Math.max(2, fullSubmission.level_number + 1);
    const localStudents = getLocalStudents();
    const sIdx = localStudents.findIndex((s) => s.id === fullSubmission.student_id);
    if (sIdx >= 0) {
      localStudents[sIdx].unlocked_level = Math.max(localStudents[sIdx].unlocked_level || 1, nextLevel);
      saveLocalStudents(localStudents);
    }
    const localUsers = getLocalUsers();
    const uIdx = localUsers.findIndex((u) => u.id === fullSubmission.student_id);
    if (uIdx >= 0) {
      localUsers[uIdx].unlocked_level = Math.max(localUsers[uIdx].unlocked_level || 1, nextLevel);
      saveLocalUsers(localUsers);
    }
  }

  return true;
}

export async function fetchClassroomStudents(classroomCode: string): Promise<StudentDbRecord[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('classroom_code', classroomCode)
        .order('absent_number', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch { }
  }

  const local = getLocalStudents();
  return local.filter((s) => {
    if (!classroomCode) return true;
    if (s.classroom_code === classroomCode) return true;
    const match = findMatchingClass(s.classroom_code);
    return match && match.code === classroomCode;
  });
}

export async function fetchClassroomSubmissions(classroomCode: string): Promise<LevelSubmissionDbRecord[]> {
  let list: LevelSubmissionDbRecord[] = [];
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('level_submissions')
        .select('*')
        .eq('classroom_code', classroomCode)
        .order('completed_at', { ascending: false });

      if (!error && data && data.length > 0) {
        list = data;
      }
    } catch { }
  }

  if (list.length === 0) {
    const local = getLocalSubmissions();
    list = local.filter((s) => {
      if (!classroomCode) return true;
      if (s.classroom_code === classroomCode) return true;
      const match = findMatchingClass(s.classroom_code);
      return match && match.code === classroomCode;
    });
  }

  // Rekonsiliasi otomatis: Jika murid telah menyelesaikan misi Level 3 di localStorage
  // pastikan progres tersebut selalu hadir di daftar submissions Dashboard Guru
  try {
    const students = getLocalStudents();
    let hasNewSynthesis = false;
    const allLocalSubs = getLocalSubmissions();

    for (const std of students) {
      const candidateKeys = [
        `resqbox_missions_${std.id}`,
        `resqbox_missions_${std.username || ''}`,
      ];
      if (std.username === 'demo') {
        candidateKeys.push('resqbox_missions_std-demo-all-unlocked');
        candidateKeys.push('resqbox_missions_demo');
      }

      let completedMissions: string[] = [];
      for (const key of candidateKeys) {
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > completedMissions.length) {
              completedMissions = parsed;
            }
          } catch { }
        }
      }

      if (completedMissions.length > 0) {
        const completedCount = completedMissions.length;
        const score = Math.min(100, Math.round((completedCount / 20) * 100));
        const isDone = completedCount >= 20 || score >= 100;
        const sub3Idx = list.findIndex(
          (sub) =>
            (sub.student_id === std.id || (std.username && sub.student_id === std.username)) &&
            sub.level_number === 3
        );

        const lastJobId = completedMissions[completedMissions.length - 1];
        const statusText = isDone ? 'TUNTAS' : `${score} Poin`;
        const stageLabel = isDone
          ? 'Tuntas (20/20 Misi Simulasi Selesai - 100 Poin)'
          : `Selesai ${completedCount}/20 Misi (${score} Poin)`;

        if (sub3Idx >= 0) {
          const existingCount = list[sub3Idx].details?.completed_count || 0;
          if (completedCount >= existingCount) {
            list[sub3Idx].score = Math.max(list[sub3Idx].score || 0, score);
            list[sub3Idx].details = {
              ...list[sub3Idx].details,
              mode: 'action_lab_simulation',
              is_completed: isDone,
              completed_missions: completedMissions,
              completed_count: completedCount,
              total_missions: 20,
              last_completed_id: lastJobId,
              status_text: statusText,
              stage_label: stageLabel,
            };
          }
        } else {
          const synthesized: LevelSubmissionDbRecord = {
            id: `sub-l3-${std.id}`,
            student_id: std.id,
            student_name: std.name,
            classroom_code: std.classroom_code || classroomCode,
            level_number: 3,
            score,
            details: {
              mode: 'action_lab_simulation',
              is_completed: isDone,
              completed_missions: completedMissions,
              completed_count: completedCount,
              total_missions: 20,
              last_completed_id: lastJobId,
              status_text: statusText,
              stage_label: stageLabel,
            },
            completed_at: new Date().toISOString(),
          };
          list.push(synthesized);

          const existingLocalIdx = allLocalSubs.findIndex(
            (s) => (s.student_id === std.id || (std.username && s.student_id === std.username)) && s.level_number === 3
          );
          if (existingLocalIdx >= 0) {
            allLocalSubs[existingLocalIdx] = synthesized;
          } else {
            allLocalSubs.push(synthesized);
          }
          hasNewSynthesis = true;
        }
      }
    }

    if (hasNewSynthesis) {
      saveLocalSubmissions(allLocalSubs);
    }
  } catch { }

  return list;
}

// ── 5. REALTIME LISTENER UNTUK DASHBOARD GURU ──────────────────────────────

export function subscribeToClassroom(
  classroomCode: string,
  onEvent: (event: { type: 'STUDENT_UPDATED' | 'LEVEL_SUBMITTED' | 'STUDENT_DELETED' | 'CLASSROOM_DELETED'; payload: any }) => void
) {
  const handleBroadcast = (msg: MessageEvent) => {
    if (msg.data && msg.data.type) {
      onEvent(msg.data);
    }
  };

  if (localBroadcast) {
    localBroadcast.addEventListener('message', handleBroadcast);
  }

  let supabaseChannel: any = null;
  if (supabase) {
    supabaseChannel = supabase
      .channel(`classroom-${classroomCode}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'students', filter: `classroom_code=eq.${classroomCode}` },
        (payload) => {
          onEvent({ type: 'STUDENT_UPDATED', payload: payload.new });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'level_submissions', filter: `classroom_code=eq.${classroomCode}` },
        (payload) => {
          onEvent({ type: 'LEVEL_SUBMITTED', payload: payload.new });
        }
      )
      .subscribe();
  }

  return () => {
    if (localBroadcast) {
      localBroadcast.removeEventListener('message', handleBroadcast);
    }
    if (supabaseChannel && supabase) {
      supabase.removeChannel(supabaseChannel);
    }
  };
}
