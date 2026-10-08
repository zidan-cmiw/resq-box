// ── supabaseClient.ts ──────────────────────────────────────────────────────
// Lapisan data RESQ-BOX di atas Supabase.
//
// MODEL KEAMANAN (lihat supabase/migrations/*.sql)
//   • Identitas  : Supabase Auth. Username dipetakan ke email sintetis
//                  `<username>@resqbox.local` (domain bisa diatur lewat
//                  VITE_AUTH_EMAIL_DOMAIN).
//   • Otorisasi  : RLS di database. Klien TIDAK menentukan peran, kelas,
//                  level, atau nilai — semuanya diputuskan server.
//   • Klien ini  : hanya mengirim "apa yang dicapai", bukan "berapa nilainya".
//
// CATATAN PENTING
//   • Tidak ada lagi password yang disimpan di localStorage.
//   • `getLocal*` sekarang murni CACHE untuk tampilan luring, bukan sumber
//     kebenaran. Cloud selalu diutamakan bila tersedia.
//   • Setiap kegagalan RPC sekarang tercatat, tidak lagi ditelan `catch {}`.

import { createClient, SupabaseClient, type Session } from '@supabase/supabase-js';
import type { CustomAvatarConfig } from '../store/teacherStore';
import { reportError } from './monitoring';

// ── TIPE PUBLIK (dipertahankan agar komponen lain tidak perlu diubah) ──────
export interface UserAccount {
  id: string;
  username: string;
  /** Selalu undefined di klien sekarang — password tidak pernah dipegang klien. */
  password?: string;
  role: 'student' | 'teacher';
  name: string;
  absent_number?: string;
  classroom_code?: string;
  school_name?: string;
  avatar_config?: CustomAvatarConfig;
  unlocked_level?: number;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ClassroomRecord {
  id?: string;
  code: string;
  name: string;
  teacher_username: string;
  school_name: string;
  created_at?: string;
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
  // Catatan: sengaja `any` (bukan `unknown`) agar pemakaian lama di
  // TeacherDashboard tetap type-safe tanpa perlu diubah semua.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: Record<string, any>;
  completed_at: string;
}

// ── KONFIGURASI ───────────────────────────────────────────────────────────
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const AUTH_EMAIL_DOMAIN = import.meta.env.VITE_AUTH_EMAIL_DOMAIN || 'resqbox.local';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http') && supabaseAnonKey.length > 20
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storageKey: 'resqbox-auth',
      },
    })
  : null;

/** Username → email sintetis untuk Supabase Auth. */
export function usernameToEmail(username: string): string {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
  return `${clean}@${AUTH_EMAIL_DOMAIN}`;
}

// ── LOG DIAGNOSTIK ────────────────────────────────────────────────────────
// Dulu setiap kegagalan cloud ditelan `catch {}` sehingga masalah tak terlihat.
let lastCloudError: string | null = null;

export function getLastCloudError(): string | null {
  return lastCloudError;
}

function noteError(scope: string, detail: unknown): void {
  const msg = detail instanceof Error ? detail.message : String(detail);
  lastCloudError = `${scope}: ${msg}`;
  // Teruskan ke lapisan monitoring agar kegagalan di perangkat siswa
  // bisa terlihat di luar console mereka sendiri.
  reportCloudError(scope, detail);
}

/** Dipisah supaya monitoring bisa dimatikan tanpa menyentuh pemanggilnya. */
function reportCloudError(scope: string, detail: unknown): void {
  try {
    reportError(detail instanceof Error ? detail : new Error(String(detail)), {
      level: 'error',
      scope: `cloud:${scope}`,
    });
  } catch {
    /* observabilitas tidak boleh menjatuhkan aplikasi */
  }
}

/** Bila kunci cloud belum diisi, aplikasi berjalan 100% lokal (mode luring). */
export const isCloudAvailable = (): boolean => supabase !== null;

// ── KANAL LOKAL (sinkronisasi antar-tab tanpa server) ──────────────────────
const localBroadcast =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel('resqbox_class_channel')
    : null;

// ── KUNCI CACHE LOKAL ─────────────────────────────────────────────────────
const LOCAL_STORAGE_CLASSES_KEY = 'resqbox-cloud-classes';
const LOCAL_STORAGE_STUDENTS_KEY = 'resqbox-cloud-students';
const LOCAL_STORAGE_SUBMISSIONS_KEY = 'resqbox-cloud-submissions';

export const DEFAULT_AVATAR: CustomAvatarConfig = {
  skin: 'warm',
  hairStyle: 'spiky',
  hairColor: '#3e2723',
  eyes: 'determined',
  outfit: 'vest-orange',
  accessory: 'walkie',
  bgTheme: 'amber',
};

// ── CACHE LOKAL (bukan sumber kebenaran) ──────────────────────────────────
// Kredensial TIDAK lagi disimpan. Yang tersisa hanya data tampilan.

/** @deprecated Tidak dipakai lagi — akun dikelola Supabase Auth. */
export function getLocalUsers(): UserAccount[] {
  return [];
}

/** @deprecated Lihat catatan di atas. */
export function saveLocalUsers(_list: UserAccount[]): void {
  // sengaja no-op: klien tidak lagi menyimpan akun
}

export function getLocalClasses(): ClassroomRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CLASSES_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as ClassroomRecord[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveLocalClasses(list: ClassroomRecord[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_CLASSES_KEY, JSON.stringify(list));
  } catch {
    /* kuota penuh / mode privat: abaikan, cache bersifat opsional */
  }
}

export function getLocalStudents(): StudentDbRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_STUDENTS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as StudentDbRecord[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveLocalStudents(list: StudentDbRecord[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_STUDENTS_KEY, JSON.stringify(list));
  } catch {
    /* abaikan */
  }
}

export function getLocalSubmissions(): LevelSubmissionDbRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SUBMISSIONS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as LevelSubmissionDbRecord[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveLocalSubmissions(list: LevelSubmissionDbRecord[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_SUBMISSIONS_KEY, JSON.stringify(list));
  } catch {
    /* abaikan */
  }
}

// ── PEMETAAN BARIS → TIPE APLIKASI ────────────────────────────────────────
interface ProfileRow {
  id: string;
  username: string;
  role: 'student' | 'teacher' | 'admin';
  is_admin?: boolean;
  name: string;
  absent_number?: string | null;
  classroom_code?: string | null;
  school_name?: string | null;
  avatar_config?: CustomAvatarConfig | null;
  unlocked_level?: number | null;
}

function profileToUser(p: ProfileRow): UserAccount {
  return {
    id: p.id,
    username: p.username,
    role: p.role === 'teacher' || p.role === 'admin' ? 'teacher' : 'student',
    name: p.name,
    absent_number: p.absent_number ?? '1',
    classroom_code: p.classroom_code ?? undefined,
    school_name: p.school_name ?? undefined,
    avatar_config: p.avatar_config ?? undefined,
    unlocked_level: p.unlocked_level ?? 1,
    is_admin: Boolean(p.is_admin),
  };
}

function rowToStudent(row: Record<string, unknown>): StudentDbRecord {
  return {
    id: String(row.id ?? ''),
    user_id: row.user_id ? String(row.user_id) : undefined,
    classroom_code: String(row.classroom_code ?? ''),
    name: String(row.name ?? ''),
    username: row.username ? String(row.username) : undefined,
    password: undefined, // tidak pernah dikirim server
    class_name: String(row.class_name ?? 'Kelas VIII-A'),
    absent_number: String(row.absent_number ?? '1'),
    avatar_config: (row.avatar_config as CustomAvatarConfig) ?? DEFAULT_AVATAR,
    unlocked_level: Number(row.unlocked_level ?? 1),
    created_at: row.created_at as string | undefined,
    updated_at: row.updated_at as string | undefined,
  };
}

// ══════════════════════════════════════════════════════════════════════════
// 1. AUTENTIKASI (Supabase Auth)
// ══════════════════════════════════════════════════════════════════════════

export async function getAuthSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

/**
 * Login. Mencoba Supabase Auth lebih dulu, lalu menyesuaikan dengan peran
 * yang dipilih siswa/guru. Tidak ada password yang disimpan di klien.
 */
export async function loginUser(
  usernameInput: string,
  passwordInput: string,
  role: 'student' | 'teacher'
): Promise<{ success: boolean; user?: UserAccount; message?: string }> {
  const username = usernameInput.trim().toLowerCase();
  const password = passwordInput; // JANGAN di-trim: spasi bisa bagian dari sandi

  if (!username || !password) {
    return { success: false, message: 'Username dan password wajib diisi.' };
  }

  if (!supabase) {
    return {
      success: false,
      message: 'Mode luring: tidak bisa masuk tanpa koneksi ke server.',
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: usernameToEmail(username),
      password,
    });

    if (error) {
      // Bedakan "salah sandi" dengan "akun belum ada di sistem baru".
      const raw = (error.message || '').toLowerCase();
      if (raw.includes('invalid login')) {
        return { success: false, message: 'Username atau password salah!' };
      }
      if (raw.includes('email not confirmed')) {
        return {
          success: false,
          message: 'Akun belum aktif. Hubungi gurumu untuk mengaktifkan akun.',
        };
      }
      noteError('loginUser', error);
      return { success: false, message: 'Gagal masuk. Coba lagi sebentar lagi.' };
    }

    if (!data.user) {
      return { success: false, message: 'Gagal masuk: sesi tidak terbentuk.' };
    }

    // Ambil profil (peran sebenarnya ditentukan server, bukan pilihan di form)
    const profileRes = await supabase.rpc('get_my_profile');
    if (profileRes.error) {
      noteError('get_my_profile', profileRes.error);
      await supabase.auth.signOut();
      return { success: false, message: 'Profil tidak ditemukan. Hubungi gurumu.' };
    }

    const payload = profileRes.data as { found?: boolean } & ProfileRow;
    if (!payload || payload.found === false) {
      await supabase.auth.signOut();
      return { success: false, message: 'Profil tidak ditemukan. Hubungi gurumu.' };
    }

    const user = profileToUser(payload);

    // Cegah salah pilih peran: akun guru tidak bisa masuk lewat pintu siswa.
    if (role === 'teacher' && user.role !== 'teacher') {
      await supabase.auth.signOut();
      return { success: false, message: 'Akun ini bukan akun Guru.' };
    }
    if (role === 'student' && user.role === 'teacher') {
      await supabase.auth.signOut();
      return { success: false, message: 'Akun ini adalah akun Guru. Pilih tab Guru.' };
    }

    return { success: true, user };
  } catch (err) {
    noteError('loginUser:exception', err);
    return {
      success: false,
      message: 'Tidak bisa menghubungi server. Periksa koneksi internetmu.',
    };
  }
}

export async function logoutUser(): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.auth.signOut();
  } catch (err) {
    noteError('logoutUser', err);
  }
}

/** Profil terbaru milik pengguna yang sedang login. */
export async function fetchMyProfile(): Promise<UserAccount | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc('get_my_profile');
  if (error) {
    noteError('fetchMyProfile', error);
    return null;
  }
  const payload = data as { found?: boolean } & ProfileRow;
  if (!payload || payload.found === false) return null;
  return profileToUser(payload);
}

/** Siswa mendaftar mandiri. Kelas divalidasi di server, bukan dari cache lokal. */
export async function registerStudent(data: {
  username: string;
  password: string;
  name: string;
  absent_number: string;
  classroom_code: string;
}): Promise<{ success: boolean; user?: UserAccount; message?: string }> {
  const username = data.username.trim().toLowerCase();
  const password = data.password;

  if (!/^[a-z0-9._-]{3,30}$/.test(username)) {
    return {
      success: false,
      message: 'Username hanya boleh huruf kecil, angka, titik, garis bawah, dan strip (3–30 karakter).',
    };
  }
  if (password.length < 6) {
    return { success: false, message: 'Password minimal 6 karakter.' };
  }

  if (!supabase) {
    return { success: false, message: 'Mode luring: pendaftaran butuh koneksi ke server.' };
  }

  const classCode = data.classroom_code.trim().toUpperCase();

  try {
    // Cek ketersediaan username (server hanya menjawab boolean).
    const avail = await supabase.rpc('username_available', { p_username: username });
    if (avail.error) {
      noteError('username_available', avail.error);
    } else if (avail.data === false) {
      return { success: false, message: `Username "${username}" sudah dipakai. Pilih yang lain.` };
    }

    // Validasi kode kelas (server hanya mengembalikan nama kelas/sekolah).
    const classInfo = await supabase.rpc('class_code_info', { p_code: classCode });
    if (classInfo.error) {
      noteError('class_code_info', classInfo.error);
      return { success: false, message: 'Gagal memeriksa kode kelas. Coba lagi.' };
    }
    const info = classInfo.data as { found?: boolean; name?: string; school_name?: string } | null;
    if (!info || info.found !== true) {
      return {
        success: false,
        message: `Kode kelas "${classCode}" tidak ditemukan. Mintalah kode yang benar dari gurumu.`,
      };
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: usernameToEmail(username),
      password,
      options: {
        data: {
          username,
          name: data.name.trim(),
          absent_number: data.absent_number.trim() || '1',
          classroom_code: classCode,
          school_name: info.school_name || 'SMP Negeri 1',
          role: 'student', // server tetap memaksa 'student' untuk pendaftaran mandiri
        },
      },
    });

    if (signUpError) {
      noteError('registerStudent:signUp', signUpError);
      const m = (signUpError.message || '').toLowerCase();
      if (m.includes('already registered') || m.includes('already exists')) {
        return { success: false, message: `Username "${username}" sudah dipakai. Pilih yang lain.` };
      }
      return { success: false, message: 'Gagal membuat akun. Coba lagi sebentar lagi.' };
    }

    // Bila konfirmasi email dimatikan, sesi langsung aktif.
    if (!signUpData.session) {
      return {
        success: false,
        message:
          'Akun dibuat, tetapi perlu konfirmasi email. Hubungi gurumu, atau minta admin menonaktifkan konfirmasi email.',
      };
    }

    const profile = await fetchMyProfile();
    if (!profile) {
      return {
        success: true,
        user: {
          id: signUpData.user?.id ?? '',
          username,
          role: 'student',
          name: data.name.trim(),
          absent_number: data.absent_number.trim() || '1',
          classroom_code: classCode,
          school_name: info.school_name || 'SMP Negeri 1',
          avatar_config: DEFAULT_AVATAR,
          unlocked_level: 1,
        },
      };
    }

    return { success: true, user: profile };
  } catch (err) {
    noteError('registerStudent:exception', err);
    return { success: false, message: 'Tidak bisa menghubungi server. Periksa koneksi internetmu.' };
  }
}

/**
 * Pendaftaran akun guru.
 * Sengaja TIDAK membuka jalur pendaftaran guru dari publik: guru baru
 * ditambahkan oleh admin lewat SQL/Edge Function (lihat supabase/README.md).
 */
export async function registerTeacher(_data: {
  username: string;
  password: string;
  name: string;
  school_name: string;
}): Promise<{ success: boolean; user?: UserAccount; message?: string }> {
  return {
    success: false,
    message:
      'Pendaftaran akun Guru hanya bisa dilakukan oleh admin sekolah. Hubungi pengelola sistem RESQ-BOX.',
  };
}

// ══════════════════════════════════════════════════════════════════════════
// 2. KELAS
// ══════════════════════════════════════════════════════════════════════════

/**
 * Kelas yang boleh dilihat pemanggil: guru → kelas yang dia ampu, admin → semua.
 * Server menegakkan aturan ini; klien hanya menampilkan hasilnya.
 */
export async function fetchTeacherClassrooms(_teacherUsername: string): Promise<ClassroomRecord[]> {
  if (!supabase) return getLocalClasses();

  const { data, error } = await supabase.rpc('list_my_classrooms');
  if (error) {
    noteError('fetchTeacherClassrooms', error);
    return getLocalClasses();
  }

  const list = (data as ClassroomRecord[]) ?? [];
  saveLocalClasses(list);
  return list;
}

export async function createClassroom(
  name: string,
  _teacherUsername: string,
  schoolName: string = 'SMP Negeri 1'
): Promise<ClassroomRecord> {
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const code = `RESQ-${name.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase() || 'CLS'}${randomSuffix}`;
  const record: ClassroomRecord = {
    code,
    name: name.trim() || 'Kelas VIII-A',
    teacher_username: _teacherUsername,
    school_name: schoolName,
    created_at: new Date().toISOString(),
  };

  if (!supabase) {
    const list = getLocalClasses();
    list.push(record);
    saveLocalClasses(list);
    return record;
  }

  const { error } = await supabase.rpc('create_my_classroom', {
    p_code: code,
    p_name: record.name,
    p_school: schoolName,
  });

  if (error) {
    noteError('createClassroom', error);
    // Kode bentrok → coba sekali lagi dengan angka baru
    const retryCode = `RESQ-${name.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase() || 'CLS'}${Math.floor(100 + Math.random() * 900)}`;
    const { error: retryError } = await supabase.rpc('create_my_classroom', {
      p_code: retryCode,
      p_name: record.name,
      p_school: schoolName,
    });
    if (retryError) {
      noteError('createClassroom:retry', retryError);
      throw new Error('Gagal membuat kelas di server.');
    }
    record.code = retryCode;
  }

  const list = getLocalClasses().filter((c) => c.code !== record.code);
  list.push(record);
  saveLocalClasses(list);

  if (localBroadcast) {
    localBroadcast.postMessage({ type: 'CLASSROOM_UPDATED', payload: record });
  }
  return record;
}

export async function updateClassroomName(
  classroomCode: string,
  newName: string
): Promise<ClassroomRecord | null> {
  const trimmedName = newName.trim();
  if (!trimmedName) return null;

  if (supabase) {
    const { error } = await supabase.rpc('rename_my_classroom', {
      p_code: classroomCode,
      p_name: trimmedName,
    });
    if (error) {
      noteError('updateClassroomName', error);
      throw new Error('Gagal mengganti nama kelas di server.');
    }
  }

  const list = getLocalClasses();
  const idx = list.findIndex((c) => c.code === classroomCode);
  let updated: ClassroomRecord | null = null;
  if (idx >= 0) {
    list[idx].name = trimmedName;
    updated = list[idx];
    saveLocalClasses(list);
  }

  const students = getLocalStudents().map((s) =>
    s.classroom_code === classroomCode ? { ...s, class_name: trimmedName } : s
  );
  saveLocalStudents(students);

  if (localBroadcast && updated) {
    localBroadcast.postMessage({ type: 'CLASSROOM_UPDATED', payload: updated });
  }
  return updated ?? { code: classroomCode, name: trimmedName, teacher_username: '', school_name: '' };
}

export async function deleteClassroom(classroomCode: string): Promise<boolean> {
  if (supabase) {
    const { error } = await supabase.rpc('delete_my_classroom', { p_code: classroomCode });
    if (error) {
      noteError('deleteClassroom', error);
      throw new Error('Gagal menghapus kelas di server.');
    }
  }

  saveLocalClasses(getLocalClasses().filter((c) => c.code !== classroomCode));
  saveLocalStudents(getLocalStudents().filter((s) => s.classroom_code !== classroomCode));
  saveLocalSubmissions(getLocalSubmissions().filter((s) => s.classroom_code !== classroomCode));

  if (localBroadcast) {
    localBroadcast.postMessage({ type: 'CLASSROOM_DELETED', payload: { classroomCode } });
  }
  return true;
}

/** Rekap siswa satu kelas (guru pemilik / admin). Tidak memuat password. */
export async function fetchClassroomStudents(classroomCode: string): Promise<StudentDbRecord[]> {
  if (!supabase) {
    return getLocalStudents().filter((s) => s.classroom_code === classroomCode);
  }

  const { data, error } = await supabase.rpc('list_class_students', { p_code: classroomCode });
  if (error) {
    noteError('fetchClassroomStudents', error);
    return getLocalStudents().filter((s) => s.classroom_code === classroomCode);
  }

  const rows = ((data as Record<string, unknown>[]) ?? []).map(rowToStudent);
  // Hasil kosong adalah keadaan yang SAH (kelas baru belum punya siswa).
  // Jangan jatuh ke cache lokal hanya karena kosong — itu menampilkan data basi.
  const others = getLocalStudents().filter((s) => s.classroom_code !== classroomCode);
  saveLocalStudents([...others, ...rows]);
  return rows;
}

/** Rekap nilai satu kelas (guru pemilik / admin). */
export async function fetchClassroomSubmissions(
  classroomCode: string
): Promise<LevelSubmissionDbRecord[]> {
  if (!supabase) {
    return getLocalSubmissions().filter((s) => s.classroom_code === classroomCode);
  }

  const { data, error } = await supabase.rpc('list_class_submissions', { p_code: classroomCode });
  if (error) {
    noteError('fetchClassroomSubmissions', error);
    return getLocalSubmissions().filter((s) => s.classroom_code === classroomCode);
  }

  const rows = ((data as LevelSubmissionDbRecord[]) ?? []).map((r) => ({
    ...r,
    details: (r.details ?? {}) as Record<string, unknown>,
  }));
  const others = getLocalSubmissions().filter((s) => s.classroom_code !== classroomCode);
  saveLocalSubmissions([...others, ...rows]);
  return rows;
}

// ══════════════════════════════════════════════════════════════════════════
// 3. MANAJEMEN AKUN SISWA OLEH GURU
// ══════════════════════════════════════════════════════════════════════════

/**
 * Guru membuatkan akun siswa.
 * Pembuatan akun Auth memerlukan hak admin, jadi ini dijalankan lewat fungsi
 * server `teacher_create_student` (SECURITY DEFINER, memverifikasi bahwa
 * pemanggil benar-benar guru kelas tersebut).
 */
export async function createStudentByTeacher(data: {
  classroom_code: string;
  name: string;
  absent_number: string;
  username: string;
  password: string;
  class_name?: string;
}): Promise<{ success: boolean; student?: StudentDbRecord; message?: string }> {
  const username = data.username.trim().toLowerCase();

  if (!supabase) {
    return {
      success: false,
      message: 'Mode luring: pembuatan akun siswa memerlukan koneksi ke server.',
    };
  }

  try {
    const { data: result, error } = await supabase.rpc('teacher_create_student', {
      p_classroom_code: data.classroom_code,
      p_name: data.name.trim(),
      p_absent_number: data.absent_number.trim() || '1',
      p_username: username,
      p_password: data.password,
    });

    if (error) {
      noteError('createStudentByTeacher', error);
      const msg = (error.message || '').toLowerCase();
      if (msg.includes('sudah')) {
        return { success: false, message: `Username "${username}" sudah ada!` };
      }
      if (msg.includes('bukan milik') || msg.includes('hanya guru')) {
        return { success: false, message: 'Kelas ini bukan kelas yang Anda ampu.' };
      }
      return { success: false, message: 'Gagal membuat akun siswa di server.' };
    }

    const payload = result as { success?: boolean; student?: Record<string, unknown>; message?: string };
    if (!payload?.success) {
      return { success: false, message: payload?.message || 'Gagal membuat akun siswa.' };
    }

    const student = payload.student ? rowToStudent(payload.student) : undefined;

    if (student) {
      const list = getLocalStudents().filter((s) => s.id !== student.id);
      list.push(student);
      saveLocalStudents(list);
      if (localBroadcast) {
        localBroadcast.postMessage({ type: 'STUDENT_UPDATED', payload: student });
      }
    }

    return { success: true, student };
  } catch (err) {
    noteError('createStudentByTeacher:exception', err);
    return { success: false, message: 'Tidak bisa menghubungi server.' };
  }
}

export async function deleteStudentAccount(studentId: string, _classroomCode?: string): Promise<boolean> {
  if (!supabase) {
    saveLocalStudents(getLocalStudents().filter((s) => s.id !== studentId));
    return true;
  }

  const { error } = await supabase.rpc('delete_my_student', { p_student_id: studentId });
  if (error) {
    noteError('deleteStudentAccount', error);
    throw new Error('Gagal menghapus akun siswa di server.');
  }

  saveLocalStudents(getLocalStudents().filter((s) => s.id !== studentId));
  saveLocalSubmissions(getLocalSubmissions().filter((s) => s.student_id !== studentId));

  if (localBroadcast) {
    localBroadcast.postMessage({ type: 'STUDENT_DELETED', payload: { studentId } });
  }
  return true;
}

// ══════════════════════════════════════════════════════════════════════════
// 4. SINKRONISASI PROFIL & NILAI
// ══════════════════════════════════════════════════════════════════════════

/**
 * Menyimpan perubahan profil milik sendiri.
 * Peran, kelas, dan level DIABAIKAN walau ikut terkirim — server mengunci itu.
 */
export async function syncStudentToCloud(data: {
  id: string;
  classroom_code: string;
  name: string;
  username?: string;
  class_name?: string;
  absent_number?: string;
  avatar_config?: CustomAvatarConfig;
  unlocked_level?: number;
}): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase.rpc('update_my_profile', {
    p_data: {
      name: data.name,
      school_name: undefined,
      absent_number: data.absent_number,
      avatar_config: data.avatar_config,
      // unlocked_level sengaja tidak dikirim: hanya server yang boleh menaikkannya
    },
  });

  if (error) {
    // Kolom vakum di JSONB tidak masalah; hanya catat bila benar-benar gagal.
    if (!(error.message || '').toLowerCase().includes('harus login')) {
      noteError('syncStudentToCloud', error);
    }
    return false;
  }
  return true;
}

export async function updateTeacherProfile(
  _username: string,
  updates: { name?: string; school_name?: string }
): Promise<{ success: boolean; user?: UserAccount }> {
  if (!supabase) return { success: false };

  const { data, error } = await supabase.rpc('update_my_teacher_profile', {
    p_name: updates.name ?? null,
    p_school: updates.school_name ?? null,
  });

  if (error) {
    noteError('updateTeacherProfile', error);
    return { success: false };
  }

  const payload = data as { success?: boolean; profile?: ProfileRow };
  if (payload?.success && payload.profile) {
    return { success: true, user: profileToUser(payload.profile) };
  }
  return { success: false };
}

/**
 * Mengirim hasil sebuah level.
 *
 * Klien mengirim DUA hal:
 *   1. `missions`  — jumlah capaian (misi/kata/area) yang benar-benar selesai.
 *   2. `score`     — skor versi klien, hanya dipakai sebagai batas atas.
 *
 * Server lalu menghitung `official_level_score(level, missions)` dan memakai
 * nilai TERTINGGI di antara keduanya. Jadi siswa tidak bisa memalsukan nilai
 * melebihi capaian yang dilaporkannya, dan nilai tidak pernah "hilang"
 * hanya karena urutan sinkronisasi.
 */
export async function submitLevelProgress(
  submission: Omit<LevelSubmissionDbRecord, 'id' | 'completed_at'> & {
    missions?: number;
    isCompleted?: boolean;
  }
): Promise<boolean> {
  const level = Number(submission.level_number);
  if (!Number.isInteger(level) || level < 1 || level > 3) {
    noteError('submitLevelProgress', `level_number tidak valid: ${submission.level_number}`);
    return false;
  }

  // Jumlah capaian: dari argumen, atau disimpulkan dari details.
  const details = (submission.details ?? {}) as Record<string, unknown>;
  const num = (v: unknown): number | undefined =>
    typeof v === 'number' && Number.isFinite(v) ? v : undefined;

  const missions =
    submission.missions ??
    num(details.missions) ??
    num(details.completed_count) ??
    (Array.isArray(details.completed_missions) ? details.completed_missions.length : undefined) ??
    num(details.current_zone) ??
    num(details.zones_completed) ??
    0;

  const clientScore = Math.max(0, Math.min(100, Number(submission.score ?? 0)));

  const isCompleted =
    submission.isCompleted ?? Boolean(details.is_completed ?? clientScore >= 100);

  // Simpan dulu ke cache lokal agar tidak ada data hilang saat luring.
  const local: LevelSubmissionDbRecord = {
    ...(submission as LevelSubmissionDbRecord),
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    completed_at: new Date().toISOString(),
    score: clientScore,
  };
  const cached = getLocalSubmissions();
  const existingIdx = cached.findIndex(
    (s) => s.student_id === local.student_id && s.level_number === local.level_number
  );
  if (existingIdx >= 0) cached[existingIdx] = local;
  else cached.push(local);
  saveLocalSubmissions(cached);

  if (localBroadcast) {
    localBroadcast.postMessage({ type: 'LEVEL_SUBMITTED', payload: local });
  }

  if (!supabase) return false;

  // ── Koalesensi penulisan (write-behind) ────────────────────────────────
  // Satu perjalanan belajar bisa memicu puluhan peristiwa progres. Kita
  // gabungkan per level: hanya pengiriman TERBARU yang dikirim, dalam
  // jendela 5 detik. Progres tidak pernah hilang karena cache lokal sudah
  // ditulis di atas, dan antrean dikuras saat tab disembunyikan/ditutup.
  const payload = {
    p_level: level,
    p_missions: Math.max(0, Math.trunc(Number(missions) || 0)),
    p_details: details,
    p_is_completed: isCompleted,
    p_client_score: clientScore,
  };

  // Peristiwa penting langsung dikirim: penyelesaian level tidak boleh ditunda.
  const isMilestone = isCompleted || clientScore >= 100;

  if (isMilestone) {
    const held = pendingProgress.get(level);
    if (held) {
      clearTimeout(held.timer);
      pendingProgress.delete(level);
    }
    return sendProgress(payload);
  }

  return enqueueProgress(level, payload);
}

// ── Antrean tulis progres (koalesensi per level) ──────────────────────────
interface PendingProgress {
  payload: Record<string, unknown>;
  timer: ReturnType<typeof setTimeout>;
}

const pendingProgress = new Map<number, PendingProgress>();
const PROGRESS_FLUSH_MS = 5000;

async function sendProgress(payload: Record<string, unknown>): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.rpc('submit_level_result', payload);
  if (error) {
    noteError('submitLevelProgress', error);
    return false;
  }
  return true;
}

function enqueueProgress(level: number, payload: Record<string, unknown>): Promise<boolean> {
  const existing = pendingProgress.get(level);
  if (existing) clearTimeout(existing.timer);

  return new Promise<boolean>((resolve) => {
    const timer = setTimeout(() => {
      pendingProgress.delete(level);
      void sendProgress(payload).then(resolve);
    }, PROGRESS_FLUSH_MS);

    // Kirim yang terbaru saja; yang lama sudah ditimpa.
    pendingProgress.set(level, { payload, timer });
  });
}

/** Kirim segera semua progres yang masih tertahan (dipakai saat tab ditutup). */
export function flushPendingProgress(): void {
  for (const [level, pending] of pendingProgress.entries()) {
    clearTimeout(pending.timer);
    void sendProgress(pending.payload);
    pendingProgress.delete(level);
  }
}

// Jangan biarkan progres tertahan hilang saat tab disembunyikan/ditutup.
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushPendingProgress();
  });
  window.addEventListener('pagehide', flushPendingProgress);
}

// ══════════════════════════════════════════════════════════════════════════
// 5. LANGGANAN REAL-TIME
// ══════════════════════════════════════════════════════════════════════════

export interface ClassroomSubscriptionHandlers {
  onStudentUpdated?: (student: StudentDbRecord) => void;
  onStudentDeleted?: (studentId: string) => void;
  onSubmission?: (submission: LevelSubmissionDbRecord) => void;
  onClassroomUpdated?: (classroom: ClassroomRecord) => void;
  onClassroomDeleted?: (code: string) => void;
}

/** Bentuk peristiwa gaya lama (dipakai TeacherDashboard). */
export interface ClassroomSubscriptionEvent {
  type: 'STUDENT_UPDATED' | 'STUDENT_DELETED' | 'LEVEL_SUBMITTED' | 'CLASSROOM_UPDATED' | 'CLASSROOM_DELETED';
  payload: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type ClassroomSubscriber =
  | ClassroomSubscriptionHandlers
  | ((event: ClassroomSubscriptionEvent) => void);

/** Menyeragamkan dua bentuk langganan (tangan-peristiwa vs objek handler). */
function normalizeSubscriber(subscriber: ClassroomSubscriber): ClassroomSubscriptionHandlers {
  if (typeof subscriber !== 'function') return subscriber;
  return {
    onStudentUpdated: (s) => subscriber({ type: 'STUDENT_UPDATED', payload: s }),
    onStudentDeleted: (id) => subscriber({ type: 'STUDENT_DELETED', payload: { studentId: id } }),
    onSubmission: (s) => subscriber({ type: 'LEVEL_SUBMITTED', payload: s }),
    onClassroomUpdated: (c) => subscriber({ type: 'CLASSROOM_UPDATED', payload: c }),
    onClassroomDeleted: (code) => subscriber({ type: 'CLASSROOM_DELETED', payload: { classroomCode: code } }),
  };
}

/**
 * Langganan perubahan kelas.
 * Dibuat idempoten: memanggil ulang akan menutup langganan lama lebih dulu,
 * sehingga tidak menumpuk channel (penting saat 1000+ klien aktif).
 */
let activeChannel: ReturnType<SupabaseClient['channel']> | null = null;

export function subscribeToClassroom(
  classroomCode: string,
  subscriber: ClassroomSubscriber
): () => void {
  const handlers = normalizeSubscriber(subscriber);

  // 1. Kanal lokal (selalu aktif, bekerja tanpa server)
  const onLocal = (ev: MessageEvent) => {
    const { type, payload } = ev.data ?? {};
    if (type === 'STUDENT_UPDATED') {
      handlers.onStudentUpdated?.(payload as StudentDbRecord);
    } else if (type === 'STUDENT_DELETED') {
      handlers.onStudentDeleted?.(payload?.studentId as string);
    } else if (type === 'LEVEL_SUBMITTED') {
      handlers.onSubmission?.(payload as LevelSubmissionDbRecord);
    } else if (type === 'CLASSROOM_UPDATED') {
      handlers.onClassroomUpdated?.(payload as ClassroomRecord);
    } else if (type === 'CLASSROOM_DELETED') {
      handlers.onClassroomDeleted?.(payload?.classroomCode as string);
    }
  };
  localBroadcast?.addEventListener('message', onLocal);

  // 2. Kanal Supabase Realtime (bila tersedia)
  if (supabase) {
    if (activeChannel) {
      void supabase.removeChannel(activeChannel);
      activeChannel = null;
    }

    activeChannel = supabase
      .channel(`classroom:${classroomCode}`)
      // RLS tetap berlaku pada Realtime: klien hanya menerima baris yang boleh dibaca.
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles', filter: `classroom_code=eq.${classroomCode}` },
        (payload) => {
          const row = payload.new as Record<string, unknown> | undefined;
          if (!row || !row.id) return; // DELETE membawa new = {} → diabaikan
          handlers.onStudentUpdated?.(rowToStudent(row));
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'level_submissions', filter: `classroom_code=eq.${classroomCode}` },
        (payload) => {
          const row = payload.new as LevelSubmissionDbRecord | undefined;
          if (row) handlers.onSubmission?.(row);
        }
      )
      .subscribe();
  }

  return () => {
    localBroadcast?.removeEventListener('message', onLocal);
    if (supabase && activeChannel) {
      void supabase.removeChannel(activeChannel);
      activeChannel = null;
    }
  };
}

// ══════════════════════════════════════════════════════════════════════════
// 6. UTILITAS PENCARIAN KELAS (sisi tampilan saja)
// ══════════════════════════════════════════════════════════════════════════

/** Hanya untuk membantu tampilan; validasi sebenarnya ada di server. */
export function findMatchingClass(input: string): ClassroomRecord | null {
  const raw = input.trim();
  if (!raw) return null;
  const clean = raw.toUpperCase().replace(/[\s\-_]/g, '');
  const classes = getLocalClasses();

  const direct = classes.find(
    (c) => c.code.toUpperCase() === raw.toUpperCase() ||
           c.code.toUpperCase().replace(/[\s\-_]/g, '') === clean
  );
  if (direct) return direct;

  const normalizedInput = clean.replace(/VIII/g, '8').replace(/VII/g, '7').replace(/IX/g, '9');

  return (
    classes.find((c) => {
      const codeNorm = c.code.toUpperCase().replace(/[\s\-_]/g, '');
      const nameNorm = c.name.toUpperCase().replace(/[\s\-_]/g, '');
      const nCode = codeNorm.replace(/VIII/g, '8').replace(/VII/g, '7').replace(/IX/g, '9');
      const nName = nameNorm.replace(/VIII/g, '8').replace(/VII/g, '7').replace(/IX/g, '9');
      return (
        codeNorm === clean ||
        nCode === normalizedInput ||
        codeNorm.endsWith(clean) ||
        nCode.endsWith(normalizedInput) ||
        nameNorm.includes(clean) ||
        nName.includes(normalizedInput)
      );
    }) ?? null
  );
}
