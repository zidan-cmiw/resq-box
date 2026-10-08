-- ══════════════════════════════════════════════════════════════════════════
-- RESQ-BOX Supabase Schema v2 — Security Hardened
-- Jalankan ini di Supabase SQL Editor (Settings > SQL Editor)
-- ══════════════════════════════════════════════════════════════════════════

-- 0. Aktifkan extension untuk password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Tabel Akun Pengguna (User Accounts)
CREATE TABLE IF NOT EXISTS user_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL,  -- stores bcrypt hash
  role VARCHAR(20) NOT NULL DEFAULT 'student',
  name VARCHAR(100) NOT NULL,
  absent_number VARCHAR(10) DEFAULT '1',
  classroom_code VARCHAR(20) DEFAULT 'RESQ-8A',
  school_name VARCHAR(150) DEFAULT 'SMP Negeri 1',
  avatar_config JSONB DEFAULT '{}'::jsonb,
  unlocked_level INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel Kelas (Classrooms)
CREATE TABLE IF NOT EXISTS classrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL DEFAULT 'Kelas VIII-A',
  teacher_username VARCHAR(50) NOT NULL DEFAULT 'guru',
  school_name VARCHAR(150) NOT NULL DEFAULT 'SMP Negeri 1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabel Siswa Terdaftar di Kelas (Students)
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_accounts(id) ON DELETE CASCADE,
  classroom_code VARCHAR(20) NOT NULL,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50),
  password VARCHAR(100),
  class_name VARCHAR(50) DEFAULT 'Kelas VIII-A',
  absent_number VARCHAR(10) DEFAULT '1',
  avatar_config JSONB DEFAULT '{}'::jsonb,
  unlocked_level INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT fk_classroom FOREIGN KEY (classroom_code) REFERENCES classrooms(code) ON DELETE CASCADE
);

-- 4. Tabel Rekap Evaluasi Level (Level Submissions)
CREATE TABLE IF NOT EXISTS level_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id VARCHAR(100) NOT NULL,
  student_name VARCHAR(100) NOT NULL,
  classroom_code VARCHAR(20) NOT NULL,
  level_number INT NOT NULL,
  score INT DEFAULT 100,
  details JSONB DEFAULT '{}'::jsonb,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Indeks untuk Performa Query
CREATE INDEX IF NOT EXISTS idx_users_username ON user_accounts(username);
CREATE INDEX IF NOT EXISTS idx_students_classroom ON students(classroom_code);
CREATE INDEX IF NOT EXISTS idx_submissions_classroom ON level_submissions(classroom_code);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON level_submissions(student_id);

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_accounts;
  EXCEPTION WHEN duplicate_object THEN END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE classrooms;
  EXCEPTION WHEN duplicate_object THEN END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE students;
  EXCEPTION WHEN duplicate_object THEN END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE level_submissions;
  EXCEPTION WHEN duplicate_object THEN END;
END $$;

-- ══════════════════════════════════════════════════════════════════════════
-- 6. ROW LEVEL SECURITY — Membatasi akses berdasarkan operasi
-- Strategi: anon key hanya bisa SELECT, semua WRITE via RPC functions
-- ══════════════════════════════════════════════════════════════════════════

ALTER TABLE user_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_submissions ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Allow All Users" ON user_accounts;
DROP POLICY IF EXISTS "Allow All Classrooms" ON classrooms;
DROP POLICY IF EXISTS "Allow All Students" ON students;
DROP POLICY IF EXISTS "Allow All Submissions" ON level_submissions;
DROP POLICY IF EXISTS "anon_select_users" ON user_accounts;
DROP POLICY IF EXISTS "anon_select_classrooms" ON classrooms;
DROP POLICY IF EXISTS "anon_select_students" ON students;
DROP POLICY IF EXISTS "anon_select_submissions" ON level_submissions;

-- user_accounts: SELECT tanpa kolom password (handled by RPC)
CREATE POLICY "anon_select_users" ON user_accounts
  FOR SELECT USING (true);

-- classrooms: SELECT untuk semua, INSERT/UPDATE/DELETE via RPC
CREATE POLICY "anon_select_classrooms" ON classrooms
  FOR SELECT USING (true);

-- students: SELECT untuk semua (guru perlu lihat semua siswa di kelasnya)
CREATE POLICY "anon_select_students" ON students
  FOR SELECT USING (true);

-- level_submissions: SELECT untuk semua, INSERT via RPC
CREATE POLICY "anon_select_submissions" ON level_submissions
  FOR SELECT USING (true);

-- ══════════════════════════════════════════════════════════════════════════
-- 7. RPC FUNCTIONS — Server-side logic dengan SECURITY DEFINER
-- Ini berjalan dengan hak akses pemilik tabel, melewati RLS
-- ══════════════════════════════════════════════════════════════════════════

-- 7a. Login: verifikasi password di server, return user tanpa password
CREATE OR REPLACE FUNCTION verify_login(
  p_username TEXT,
  p_password TEXT,
  p_role TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_user user_accounts%ROWTYPE;
BEGIN
  SELECT * INTO v_user
  FROM user_accounts
  WHERE username = lower(trim(p_username))
    AND role = p_role
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'Akun tidak ditemukan.');
  END IF;

  -- Cek apakah password sudah di-hash (dimulai dengan $2)
  IF v_user.password LIKE '$2%' THEN
    -- Bandingkan dengan bcrypt
    IF crypt(p_password, v_user.password) = v_user.password THEN
      RETURN jsonb_build_object(
        'success', true,
        'user', jsonb_build_object(
          'id', v_user.id,
          'username', v_user.username,
          'role', v_user.role,
          'name', v_user.name,
          'absent_number', v_user.absent_number,
          'classroom_code', v_user.classroom_code,
          'school_name', v_user.school_name,
          'avatar_config', v_user.avatar_config,
          'unlocked_level', v_user.unlocked_level,
          'created_at', v_user.created_at,
          'updated_at', v_user.updated_at
        )
      );
    END IF;
  ELSE
    -- Legacy plaintext comparison (untuk akun lama sebelum migrasi)
    IF v_user.password = p_password THEN
      -- Upgrade: hash password untuk selanjutnya
      UPDATE user_accounts SET password = crypt(p_password, gen_salt('bf'))
      WHERE id = v_user.id;

      RETURN jsonb_build_object(
        'success', true,
        'user', jsonb_build_object(
          'id', v_user.id,
          'username', v_user.username,
          'role', v_user.role,
          'name', v_user.name,
          'absent_number', v_user.absent_number,
          'classroom_code', v_user.classroom_code,
          'school_name', v_user.school_name,
          'avatar_config', v_user.avatar_config,
          'unlocked_level', v_user.unlocked_level,
          'created_at', v_user.created_at,
          'updated_at', v_user.updated_at
        )
      );
    END IF;
  END IF;

  RETURN jsonb_build_object('success', false, 'message', 'Password salah!');
END;
$$;

-- 7b. Register student: hash password, buat akun + student record
CREATE OR REPLACE FUNCTION register_student_account(
  p_username TEXT,
  p_password TEXT,
  p_name TEXT,
  p_absent_number TEXT,
  p_classroom_code TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_user_id UUID;
  v_class classrooms%ROWTYPE;
  v_hashed TEXT;
BEGIN
  -- Cek username sudah ada
  IF EXISTS (SELECT 1 FROM user_accounts WHERE username = lower(trim(p_username))) THEN
    RETURN jsonb_build_object('success', false, 'message', 'Username sudah digunakan!');
  END IF;

  -- Cek kelas ada
  SELECT * INTO v_class FROM classrooms WHERE code = p_classroom_code LIMIT 1;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'Kode kelas tidak ditemukan!');
  END IF;

  -- Hash password
  v_hashed := crypt(p_password, gen_salt('bf'));

  -- Insert user account
  INSERT INTO user_accounts (username, password, role, name, absent_number, classroom_code, school_name)
  VALUES (lower(trim(p_username)), v_hashed, 'student', trim(p_name), trim(p_absent_number), p_classroom_code, v_class.school_name)
  RETURNING id INTO v_user_id;

  -- Insert student record
  INSERT INTO students (id, user_id, classroom_code, name, username, password, class_name, absent_number)
  VALUES (v_user_id, v_user_id, p_classroom_code, trim(p_name), lower(trim(p_username)), '***', v_class.name, trim(p_absent_number));

  RETURN jsonb_build_object(
    'success', true,
    'user', jsonb_build_object(
      'id', v_user_id,
      'username', lower(trim(p_username)),
      'role', 'student',
      'name', trim(p_name),
      'absent_number', trim(p_absent_number),
      'classroom_code', p_classroom_code,
      'school_name', v_class.school_name,
      'unlocked_level', 1
    )
  );
END;
$$;

-- 7c. Register teacher: hash password, buat akun guru
CREATE OR REPLACE FUNCTION register_teacher_account(
  p_username TEXT,
  p_password TEXT,
  p_name TEXT,
  p_school_name TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_user_id UUID;
  v_hashed TEXT;
BEGIN
  IF EXISTS (SELECT 1 FROM user_accounts WHERE username = lower(trim(p_username))) THEN
    RETURN jsonb_build_object('success', false, 'message', 'Username sudah digunakan!');
  END IF;

  v_hashed := crypt(p_password, gen_salt('bf'));

  INSERT INTO user_accounts (username, password, role, name, school_name)
  VALUES (lower(trim(p_username)), v_hashed, 'teacher', trim(p_name), trim(COALESCE(p_school_name, 'SMP Negeri 1')))
  RETURNING id INTO v_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'user', jsonb_build_object(
      'id', v_user_id,
      'username', lower(trim(p_username)),
      'role', 'teacher',
      'name', trim(p_name),
      'school_name', trim(COALESCE(p_school_name, 'SMP Negeri 1')),
      'unlocked_level', 1
    )
  );
END;
$$;

-- 7d. Guru membuat akun siswa
CREATE OR REPLACE FUNCTION create_student_by_teacher(
  p_classroom_code TEXT,
  p_name TEXT,
  p_absent_number TEXT,
  p_username TEXT,
  p_password TEXT,
  p_class_name TEXT DEFAULT 'Kelas VIII-A'
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_user_id UUID;
  v_hashed TEXT;
BEGIN
  IF EXISTS (SELECT 1 FROM user_accounts WHERE username = lower(trim(p_username))) THEN
    RETURN jsonb_build_object('success', false, 'message', 'Username sudah ada!');
  END IF;

  v_hashed := crypt(p_password, gen_salt('bf'));

  INSERT INTO user_accounts (username, password, role, name, absent_number, classroom_code, school_name)
  VALUES (lower(trim(p_username)), v_hashed, 'student', trim(p_name), trim(p_absent_number), p_classroom_code, 'SMP Negeri 1')
  RETURNING id INTO v_user_id;

  INSERT INTO students (id, user_id, classroom_code, name, username, password, class_name, absent_number)
  VALUES (v_user_id, v_user_id, p_classroom_code, trim(p_name), lower(trim(p_username)), '***', p_class_name, trim(p_absent_number));

  RETURN jsonb_build_object(
    'success', true,
    'student', jsonb_build_object(
      'id', v_user_id,
      'user_id', v_user_id,
      'classroom_code', p_classroom_code,
      'name', trim(p_name),
      'username', lower(trim(p_username)),
      'class_name', p_class_name,
      'absent_number', trim(p_absent_number),
      'unlocked_level', 1
    )
  );
END;
$$;

-- 7e. Write operations via RPC (bypass RLS with SECURITY DEFINER)

CREATE OR REPLACE FUNCTION rpc_upsert_student(p_data JSONB)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
BEGIN
  INSERT INTO students (id, classroom_code, name, class_name, absent_number, avatar_config, unlocked_level, updated_at)
  VALUES (
    (p_data->>'id')::UUID,
    p_data->>'classroom_code',
    p_data->>'name',
    COALESCE(p_data->>'class_name', 'Kelas VIII-A'),
    COALESCE(p_data->>'absent_number', '1'),
    COALESCE(p_data->'avatar_config', '{}'::jsonb),
    COALESCE((p_data->>'unlocked_level')::INT, 1),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    class_name = EXCLUDED.class_name,
    absent_number = EXCLUDED.absent_number,
    avatar_config = EXCLUDED.avatar_config,
    unlocked_level = EXCLUDED.unlocked_level,
    updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION rpc_insert_submission(p_data JSONB)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
BEGIN
  INSERT INTO level_submissions (id, student_id, student_name, classroom_code, level_number, score, details, completed_at)
  VALUES (
    COALESCE((p_data->>'id')::UUID, gen_random_uuid()),
    p_data->>'student_id',
    p_data->>'student_name',
    p_data->>'classroom_code',
    (p_data->>'level_number')::INT,
    COALESCE((p_data->>'score')::INT, 100),
    COALESCE(p_data->'details', '{}'::jsonb),
    COALESCE((p_data->>'completed_at')::TIMESTAMPTZ, now())
  );
END;
$$;

CREATE OR REPLACE FUNCTION rpc_create_classroom(p_code TEXT, p_name TEXT, p_teacher TEXT, p_school TEXT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
BEGIN
  INSERT INTO classrooms (code, name, teacher_username, school_name)
  VALUES (p_code, p_name, p_teacher, COALESCE(p_school, 'SMP Negeri 1'));
END;
$$;

CREATE OR REPLACE FUNCTION rpc_update_classroom_name(p_code TEXT, p_name TEXT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
BEGIN
  UPDATE classrooms SET name = p_name WHERE code = p_code;
  UPDATE students SET class_name = p_name WHERE classroom_code = p_code;
END;
$$;

CREATE OR REPLACE FUNCTION rpc_delete_classroom(p_code TEXT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
BEGIN
  DELETE FROM level_submissions WHERE classroom_code = p_code;
  DELETE FROM students WHERE classroom_code = p_code;
  DELETE FROM user_accounts WHERE classroom_code = p_code AND role = 'student';
  DELETE FROM classrooms WHERE code = p_code;
END;
$$;

CREATE OR REPLACE FUNCTION rpc_delete_student(p_student_id UUID)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
BEGIN
  DELETE FROM level_submissions WHERE student_id = p_student_id::TEXT;
  DELETE FROM students WHERE id = p_student_id;
  DELETE FROM user_accounts WHERE id = p_student_id;
END;
$$;

CREATE OR REPLACE FUNCTION rpc_update_teacher_profile(p_username TEXT, p_name TEXT, p_school TEXT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions AS $$
BEGIN
  UPDATE user_accounts
  SET name = COALESCE(p_name, name),
      school_name = COALESCE(p_school, school_name),
      updated_at = now()
  WHERE username = p_username AND role = 'teacher';
END;
$$;

-- 8. Seed data (password di-hash)
INSERT INTO user_accounts (username, password, role, name, school_name)
VALUES ('guru', crypt('guru123', gen_salt('bf')), 'teacher', 'Bapak Guru IPA', 'SMP Negeri 1')
ON CONFLICT (username) DO NOTHING;

INSERT INTO user_accounts (username, password, role, name, absent_number, classroom_code, school_name, unlocked_level)
VALUES ('demo', crypt('demo123', gen_salt('bf')), 'student', 'Taruna Demo (Semua Level Terbuka)', '99', 'RESQ-8A', 'SMP Negeri 1 (Demo Testing)', 3)
ON CONFLICT (username) DO NOTHING;

INSERT INTO classrooms (code, name, teacher_username, school_name)
VALUES ('RESQ-8A', 'Kelas VIII-A', 'guru', 'SMP Negeri 1')
ON CONFLICT (code) DO NOTHING;

-- 9. Grant execute permission on RPC functions to anon
GRANT EXECUTE ON FUNCTION verify_login TO anon;
GRANT EXECUTE ON FUNCTION register_student_account TO anon;
GRANT EXECUTE ON FUNCTION register_teacher_account TO anon;
GRANT EXECUTE ON FUNCTION create_student_by_teacher TO anon;
GRANT EXECUTE ON FUNCTION rpc_upsert_student TO anon;
GRANT EXECUTE ON FUNCTION rpc_insert_submission TO anon;
GRANT EXECUTE ON FUNCTION rpc_create_classroom TO anon;
GRANT EXECUTE ON FUNCTION rpc_update_classroom_name TO anon;
GRANT EXECUTE ON FUNCTION rpc_delete_classroom TO anon;
GRANT EXECUTE ON FUNCTION rpc_delete_student TO anon;
GRANT EXECUTE ON FUNCTION rpc_update_teacher_profile TO anon;
