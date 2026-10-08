import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/teacherStore';
import { retroAudio } from '../../utils/retroAudio';
import { PixelAvatarRenderer } from '../../components/PixelAvatar/PixelAvatarRenderer';
import PixelIcon from '../../components/PixelIcon';
import { ResqyTutorialOverlay } from '../../components/Tutorial/ResqyTutorialOverlay';
import { TUTORIAL_TOURS } from '../../components/Tutorial/tutorialConfig';
import type {
  StudentDbRecord,
  LevelSubmissionDbRecord,
  ClassroomRecord,
} from '../../utils/supabaseClient';
import {
  fetchClassroomStudents,
  fetchClassroomSubmissions,
  fetchTeacherClassrooms,
  createClassroom,
  updateClassroomName,
  deleteClassroom,
  createStudentByTeacher,
  deleteStudentAccount,
  subscribeToClassroom,
  findMatchingClass,
} from '../../utils/supabaseClient';

// ── HTML Escape Helper (prevent injection in document.write) ────
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const updateCurrentUserName = useAuthStore((state) => state.updateCurrentUserName);

  const teacherUsername = currentUser?.username || 'guru';
  const teacherName = currentUser?.name || 'Bapak Guru IPA';
  const schoolName = currentUser?.school_name || 'SMP Negeri 1';

  // Classroom State
  const [classrooms, setClassrooms] = useState<ClassroomRecord[]>([]);
  const [selectedClassCode, setSelectedClassCode] = useState('RESQ-8A');
  const [showNewClassModal, setShowNewClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  // Unified Manage / Edit Classroom Modal State
  const [showManageClassModal, setShowManageClassModal] = useState(false);
  const [editClassName, setEditClassName] = useState('');
  const [editClassSuccess, setEditClassSuccess] = useState('');
  const [manageTab, setManageTab] = useState<'rename' | 'add_student' | 'danger'>('rename');

  // Students & Submissions State
  const [students, setStudents] = useState<StudentDbRecord[]>([]);
  const [submissions, setSubmissions] = useState<LevelSubmissionDbRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<'all' | '1' | '2' | '3'>('all');
  const [copiedCode, setCopiedCode] = useState(false);

  // Add Student Sub-state inside modal
  const [newStdName, setNewStdName] = useState('');
  const [newStdAbsent, setNewStdAbsent] = useState('');
  const [newStdUsername, setNewStdUsername] = useState('');
  const [newStdPassword, setNewStdPassword] = useState('12345');
  const [addStdError, setAddStdError] = useState('');
  const [addStdSuccess, setAddStdSuccess] = useState('');

  // Teacher Profile Edit State
  const [showTeacherProfileModal, setShowTeacherProfileModal] = useState(false);
  const [editTeacherName, setEditTeacherName] = useState('');
  const [editTeacherSchool, setEditTeacherSchool] = useState('');
  const [teacherProfileSaving, setTeacherProfileSaving] = useState(false);
  const [teacherProfileSuccess, setTeacherProfileSuccess] = useState('');

  // Detail & Report Modal
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<StudentDbRecord | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<StudentDbRecord | null>(null);

  // Load classrooms on mount
  useEffect(() => {
    const loadClasses = async () => {
      const clsList = await fetchTeacherClassrooms(teacherUsername);
      setClassrooms(clsList);
      if (clsList.length > 0 && !clsList.some((c) => c.code === selectedClassCode)) {
        setSelectedClassCode(clsList[0].code);
      }
    };
    loadClasses();
  }, [teacherUsername]);

  // Load students and submissions for active class
  const loadClassData = async () => {
    const stdList = await fetchClassroomStudents(selectedClassCode);
    const subList = await fetchClassroomSubmissions(selectedClassCode);
    setStudents(stdList);
    setSubmissions(subList);
  };

  useEffect(() => {
    loadClassData();

    // Subscribe to realtime updates for this classroom
    const unsubscribe = subscribeToClassroom(selectedClassCode, (event) => {
      if (event.type === 'STUDENT_UPDATED') {
        retroAudio.playUnlock();
        const std = event.payload;
        const match = findMatchingClass(std.classroom_code);
        const belongsToActive = std.classroom_code === selectedClassCode || (match && match.code === selectedClassCode);

        if (belongsToActive) {
          setStudents((prev) => {
            const idx = prev.findIndex((s) => s.id === std.id);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = std;
              return next;
            }
            return [...prev, std];
          });
        }
      } else if (event.type === 'LEVEL_SUBMITTED') {
        const sub = event.payload;
        retroAudio.playWin();
        setSubmissions((prev) => {
          const filtered = prev.filter(
            (p) => !(p.student_id === sub.student_id && p.level_number === sub.level_number)
          );
          return [sub, ...filtered];
        });

        // HANYA update unlocked_level murid jika tantangan level ini benar-benar telah tuntas 100% sampai gerbang akhir
        const isLevelFullyCompleted = Boolean(sub.details?.is_completed || (sub.score !== undefined && sub.score >= 100));
        if (isLevelFullyCompleted) {
          setStudents((prev) =>
            prev.map((s) =>
              s.id === sub.student_id
                ? { ...s, unlocked_level: Math.max(s.unlocked_level, sub.level_number + 1) }
                : s
            )
          );
        }
      } else if (event.type === 'STUDENT_DELETED') {
        setStudents((prev) => prev.filter((s) => s.id !== event.payload.studentId));
        setSubmissions((prev) => prev.filter((s) => s.student_id !== event.payload.studentId));
      }
    });

    return () => unsubscribe();
  }, [selectedClassCode]);

  const activeClassObj: ClassroomRecord = classrooms.find((c) => c.code === selectedClassCode) || {
    id: `cls-fallback`,
    name: 'Kelas VIII-A',
    code: selectedClassCode,
    teacher_username: teacherUsername,
    school_name: schoolName,
    created_at: new Date().toISOString(),
  };

  // Sync edit class name state when active class changes
  useEffect(() => {
    if (activeClassObj) {
      setEditClassName(activeClassObj.name);
      setEditClassSuccess('');
      setAddStdSuccess('');
      setAddStdError('');
    }
  }, [activeClassObj?.name, activeClassObj?.code]);

  // Telemetry Calculations for ALL LEVELS (Level 1, 2, 3)
  const totalStudents = students.length;

  // Calculate average class progress across all 3 levels
  const totalClassProgress = useMemo(() => {
    if (totalStudents === 0) return 0;
    const progressSum = students.reduce((acc, s) => {
      const sub1 = submissions.find((sub) => (sub.student_id === s.id || sub.student_id === s.username) && sub.level_number === 1);
      const sub2 = submissions.find((sub) => (sub.student_id === s.id || sub.student_id === s.username) && sub.level_number === 2);
      const sub3 = submissions.find((sub) => (sub.student_id === s.id || sub.student_id === s.username) && sub.level_number === 3);

      const s1 = sub1 ? sub1.score : (s.unlocked_level >= 2 ? 100 : 0);
      const s2 = sub2 ? sub2.score : (s.unlocked_level >= 3 ? 100 : 0);
      const s3 = sub3 ? sub3.score : 0;

      const studentScore = (s1 + s2 + s3) / 3;
      return acc + studentScore;
    }, 0);
    return Math.round(progressSum / totalStudents);
  }, [students, totalStudents, submissions]);

  const tuntasLv3Count = students.filter((s) => {
    const sub3 = submissions.find((sub) => (sub.student_id === s.id || sub.student_id === s.username) && sub.level_number === 3);
    return sub3 && (sub3.score >= 100 || Boolean(sub3.details?.is_completed));
  }).length;
  const tuntasLv2Count = students.filter((s) => {
    const sub2 = submissions.find((sub) => (sub.student_id === s.id || sub.student_id === s.username) && sub.level_number === 2);
    return (sub2 && sub2.score >= 100) || s.unlocked_level >= 3;
  }).length;

  // Average Quiz score across Level 1, 2, and 3
  const allGradedSubs = submissions.filter((s) => s.score !== undefined && s.score > 0);
  const avgOverallScore = useMemo(() => {
    if (allGradedSubs.length > 0) {
      return Math.round(allGradedSubs.reduce((acc, cur) => acc + cur.score, 0) / allGradedSubs.length);
    }
    // If no submissions recorded yet but some students unlocked lv 2/3
    if (tuntasLv2Count > 0) return 100;
    return 0;
  }, [allGradedSubs, tuntasLv2Count]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.absent_number.includes(searchQuery) ||
        (s.username && s.username.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchLevel = true;
      if (filterLevel !== 'all') {
        const sub1 = submissions.find((sub) => (sub.student_id === s.id || sub.student_id === s.username) && sub.level_number === 1);
        const sub2 = submissions.find((sub) => (sub.student_id === s.id || sub.student_id === s.username) && sub.level_number === 2);
        const sub3 = submissions.find((sub) => (sub.student_id === s.id || sub.student_id === s.username) && sub.level_number === 3);
        const isLv1Done = (sub1 && sub1.score >= 100) || Boolean(sub1?.details?.is_completed);
        const isLv2Done = (sub2 && sub2.score >= 100) || Boolean(sub2?.details?.is_completed);

        let studentActiveLevel = 1;
        if (s.username === 'demo') {
          studentActiveLevel = s.unlocked_level || 3;
        } else if (isLv2Done || (s.unlocked_level >= 3 && isLv1Done) || Boolean(sub3)) {
          studentActiveLevel = 3;
        } else if (isLv1Done || (s.unlocked_level >= 2 && !sub1)) {
          studentActiveLevel = 2;
        } else {
          studentActiveLevel = 1;
        }

        if (filterLevel === '1') {
          matchLevel = studentActiveLevel === 1;
        } else if (filterLevel === '2') {
          matchLevel = studentActiveLevel === 2;
        } else if (filterLevel === '3') {
          matchLevel = studentActiveLevel >= 3;
        }
      }

      return matchSearch && matchLevel;
    });
  }, [students, searchQuery, filterLevel, submissions]);

  // Actions
  const handleCopyCode = () => {
    retroAudio.playSelect();
    navigator.clipboard.writeText(selectedClassCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    retroAudio.playSelect();
    const created = await createClassroom(newClassName, teacherUsername, schoolName);
    setClassrooms((prev) => [...prev, created]);
    setSelectedClassCode(created.code);
    setNewClassName('');
    setShowNewClassModal(false);
  };

  const handleUpdateClassName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editClassName.trim()) return;
    retroAudio.playSelect();
    const updated = await updateClassroomName(selectedClassCode, editClassName.trim());
    if (updated) {
      setClassrooms((prev) => prev.map((c) => (c.code === selectedClassCode ? { ...c, name: updated.name } : c)));
      setStudents((prev) => prev.map((s) => ({ ...s, class_name: updated.name })));
      setEditClassSuccess('Nama kelas berhasil diperbarui!');
      setTimeout(() => setEditClassSuccess(''), 2500);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStdName.trim() || !newStdUsername.trim() || !newStdPassword.trim()) {
      setAddStdError('Nama, Username, dan Password wajib diisi!');
      return;
    }

    retroAudio.playSelect();
    setAddStdError('');
    const res = await createStudentByTeacher({
      classroom_code: selectedClassCode,
      name: newStdName,
      absent_number: newStdAbsent || (students.length + 1).toString(),
      username: newStdUsername,
      password: newStdPassword,
      class_name: activeClassObj.name,
    });

    if (res.success && res.student) {
      retroAudio.playWin();
      setStudents((prev) => [...prev, res.student!]);
      setAddStdSuccess(`Akun "${res.student.name}" berhasil ditambahkan!`);
      setNewStdName('');
      setNewStdAbsent('');
      setNewStdUsername('');
      setNewStdPassword('12345');
      setTimeout(() => setAddStdSuccess(''), 2500);
    } else {
      setAddStdError(res.message || 'Gagal menambahkan murid.');
    }
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    retroAudio.playSelect();
    await deleteStudentAccount(studentToDelete.id, selectedClassCode);
    setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
    if (selectedStudentForDetail?.id === studentToDelete.id) {
      setSelectedStudentForDetail(null);
    }
    setStudentToDelete(null);
  };

  const handleDeleteClassroom = async () => {
    retroAudio.playLocked();
    const targetCode = selectedClassCode;
    await deleteClassroom(targetCode);

    const updatedClasses = await fetchTeacherClassrooms(teacherUsername);
    setClassrooms(updatedClasses);

    if (updatedClasses.length > 0) {
      setSelectedClassCode(updatedClasses[0].code);
    } else {
      setSelectedClassCode('');
      setStudents([]);
      setSubmissions([]);
    }

    setShowManageClassModal(false);
  };

  // Export Class Recap CSV
  const handleExportCSV = () => {
    retroAudio.playSelect();
    const headers = [
      'No Absen',
      'Nama Siswa',
      'Username',
      'Kelas',
      'Level Terbuka',
      'Status Lv 1 (Struktur Bumi)',
      'Skor Lv 1',
      'Status Lv 2 (Tektonik)',
      'Skor Lv 2',
      'Status Lv 3 (Simulasi)',
      'Skor Lv 3',
      'Misi Lv 3 Tuntas',
      'Waktu Update'
    ];
    const rows = students.map((s) => {
      const sub1 = submissions.find((sub) => (sub.student_id === s.id || sub.student_id === s.username) && sub.level_number === 1);
      const sub2 = submissions.find((sub) => (sub.student_id === s.id || sub.student_id === s.username) && sub.level_number === 2);
      const sub3 = submissions.find((sub) => (sub.student_id === s.id || sub.student_id === s.username) && sub.level_number === 3);

      const score1 = sub1 ? sub1.score : (s.unlocked_level >= 2 ? 100 : 0);
      const isLv1 = score1 >= 100;
      const isLv1InProgress = !isLv1 && (score1 > 0 || Boolean(sub1?.details?.current_layer));

      const score2 = sub2 ? sub2.score : (s.unlocked_level >= 3 ? 100 : 0);
      const isLv2 = score2 >= 100 || Boolean(sub2?.details?.is_completed) || s.unlocked_level >= 3;
      const isLv2InProgress = !isLv2 && (score2 > 0 || Boolean(sub2?.details?.current_mission) || s.unlocked_level >= 2 || isLv1);

      const completedLv3 =
        sub3?.details?.completed_count ??
        (Array.isArray(sub3?.details?.completed_missions) ? sub3.details.completed_missions.length : 0);
      const score3 = sub3 ? sub3.score : (completedLv3 > 0 ? Math.round((completedLv3 / 20) * 100) : 0);
      const isLv3 = score3 >= 100 || Boolean(sub3?.details?.is_completed) || completedLv3 >= 20;
      const isLv3InProgress = !isLv3 && (score3 > 0 || completedLv3 > 0);

      return [
        s.absent_number,
        `"${s.name}"`,
        `"${s.username || '-'}"`,
        `"${s.class_name}"`,
        `Level ${s.unlocked_level}`,
        isLv1 ? 'Tuntas' : (isLv1InProgress ? 'Dalam Progres' : 'Belum Selesai'),
        score1,
        isLv2 ? 'Tuntas' : (isLv2InProgress ? 'Dalam Progres' : 'Terkunci'),
        score2,
        isLv3 ? 'Tuntas' : (isLv3InProgress ? 'Dalam Progres' : (isLv2 ? 'Aktif' : 'Terkunci')),
        score3,
        `${completedLv3}/20 Misi`,
        s.updated_at ? new Date(s.updated_at).toLocaleString('id-ID') : '-',
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_nilai_${selectedClassCode}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Individual Student Report Card
  const handlePrintStudentReport = (student: StudentDbRecord) => {
    retroAudio.playSelect();
    const sub1 = submissions.find((s) => (s.student_id === student.id || s.student_id === student.username) && s.level_number === 1);
    const sub2 = submissions.find((s) => (s.student_id === student.id || s.student_id === student.username) && s.level_number === 2);
    const sub3 = submissions.find((s) => (s.student_id === student.id || s.student_id === student.username) && s.level_number === 3);

    const scoreLv1 = sub1 ? sub1.score : (student.unlocked_level >= 2 ? 100 : 0);
    const isLv1Done = scoreLv1 >= 100;
    const isLv1InProgress = !isLv1Done && (scoreLv1 > 0 || Boolean(sub1?.details?.current_layer));
    const scoreLv2 = sub2 ? sub2.score : (student.unlocked_level >= 3 ? 100 : 0);
    const isLv2Done = scoreLv2 >= 100 || Boolean(sub2?.details?.is_completed) || student.unlocked_level >= 3;
    const isLv2InProgress = !isLv2Done && (scoreLv2 > 0 || Boolean(sub2?.details?.current_mission) || student.unlocked_level >= 2 || isLv1Done);

    const completedLv3Count =
      sub3?.details?.completed_count ??
      (Array.isArray(sub3?.details?.completed_missions) ? sub3.details.completed_missions.length : 0);
    const scoreLv3 = sub3 ? sub3.score : (completedLv3Count > 0 ? Math.round((completedLv3Count / 20) * 100) : 0);
    const isLv3Done = scoreLv3 >= 100 || Boolean(sub3?.details?.is_completed) || completedLv3Count >= 20;
    const isLv3InProgress = !isLv3Done && (scoreLv3 > 0 || completedLv3Count > 0);

    const currentLayer1 = sub1?.details?.current_layer || (isLv1Done ? 'Inti Dalam (6.371 km)' : 'Kerak Bumi (0–100 km)');
    const crystals1 = sub1?.details?.crystals ?? (isLv1Done ? 5 : 0);
    const solvedWords = sub1?.details?.words?.join(', ') || (isLv1Done ? 'LEMPENG, KONVEKSI, DINAMO, TEKANAN, SUBDUKSI' : 'Belum selesai');

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;

    // Escape all user-supplied data to prevent HTML injection
    const safeName = escapeHtml(student.name);
    const safeAbsent = escapeHtml(student.absent_number || '-');
    const safeClassName = escapeHtml(activeClassObj?.name || selectedClassCode);
    const safeClassCode = escapeHtml(selectedClassCode);
    const safeUsername = escapeHtml(student.username || '-');
    const safeSchoolName = escapeHtml(schoolName);
    const safeTeacherName = escapeHtml(teacherName);
    const safeSolvedWords = escapeHtml(solvedWords);

    printWindow.document.write(`
      <html>
        <head>
          <title>Rapor Siswa - ${safeName}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; padding: 30px; color: #1e293b; background: #fff; }
            .report-card { border: 4px double #1e293b; padding: 24px; max-width: 680px; margin: auto; }
            .header { text-align: center; border-bottom: 2px solid #1e293b; padding-bottom: 12px; margin-bottom: 20px; }
            .title { font-size: 18px; font-weight: bold; margin: 4px 0; }
            .subtitle { font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
            th, td { border: 1px solid #1e293b; padding: 8px 12px; text-align: left; }
            th { background-color: #f1f5f9; }
            .text-center { text-align: center; }
            .signature { margin-top: 40px; display: flex; justify-content: space-between; font-size: 13px; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <div class="report-card">
            <div class="header">
              <div class="title">LEMBAR RAPOR HASIL BELAJAR RESQ-BOX</div>
              <div class="subtitle">Media Pembelajaran Geologi &amp; Mitigasi Bencana &bull; ${safeSchoolName}</div>
            </div>

            <div style="margin-bottom: 16px; font-size: 13px; line-height: 1.6;">
              <div><strong>Nama Siswa:</strong> ${safeName}</div>
              <div><strong>No. Absen:</strong> ${safeAbsent} | <strong>Kelas:</strong> ${safeClassName} (${safeClassCode})</div>
              <div><strong>Username Akun:</strong> ${safeUsername}</div>
              <div><strong>Level Capaian:</strong> Level ${student.unlocked_level} (Maks. Level 3)</div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Materi &amp; Evaluasi</th>
                  <th class="text-center">Status</th>
                  <th class="text-center">Skor Kuis</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">1</td>
                  <td>Level 1: Penjelajahan Struktur Bumi &amp; Lempeng Tektonik (Earth Dive)</td>
                  <td class="text-center"><strong>${isLv1Done ? 'TUNTAS' : isLv1InProgress ? 'PROGRES' : 'BELUM'}</strong></td>
                  <td class="text-center"><strong>${scoreLv1}/100 Poin</strong></td>
                  <td>Capaian: ${escapeHtml(currentLayer1)} | ${crystals1}/5 Kristal | Kata Kunci: ${safeSolvedWords}</td>
                </tr>
                <tr>
                  <td class="text-center">2</td>
                  <td>Level 2: Ekspedisi Batas Lempeng Tektonik (Tectonic Explorer)</td>
                  <td class="text-center"><strong>${isLv2Done ? 'TUNTAS' : (isLv2InProgress ? 'PROGRES' : 'TERKUNCI')}</strong></td>
                  <td class="text-center"><strong>${isLv2Done || scoreLv2 > 0 ? scoreLv2 + '/100 Poin' : '&mdash;'}</strong></td>
                  <td>Eksplorasi Batas Lempeng, Patahan, &amp; Tantangan Tektonik</td>
                </tr>
                <tr>
                  <td class="text-center">3</td>
                  <td>Level 3: Simulation Game (Digital Twin &amp; Action Lab)</td>
                  <td class="text-center"><strong>${isLv3Done ? 'TUNTAS' : (isLv3InProgress ? 'PROGRES' : (isLv2Done ? 'AKTIF' : 'TERKUNCI'))}</strong></td>
                  <td class="text-center"><strong>${isLv3Done ? scoreLv3 + '/100 Poin' : isLv3InProgress ? `${scoreLv3}/100 Poin (${completedLv3Count}/20 Misi)` : (isLv2Done ? '0/100 Poin' : '&mdash;')}</strong></td>
                  <td>${sub3?.details?.stage_label ? escapeHtml(sub3.details.stage_label) : 'Logika sensor aksi &amp; penyelamatan warga'}</td>
                </tr>
              </tbody>
            </table>

            <div style="margin-top: 20px; font-size: 12px; background: #f8fafc; padding: 10px; border: 1px dashed #64748b;">
              <strong>Catatan Evaluasi Guru:</strong><br/>
              ${isLv3Done
        ? 'Siswa telah berhasil menuntaskan seluruh materi geologi dan mitigasi bencana dengan sangat baik.'
        : isLv2Done
          ? 'Siswa telah berhasil menuntaskan materi struktur bumi serta analisis respon kebencanaan dan sedang menyelesaikan simulasi Level 3.'
          : isLv1Done
            ? 'Siswa telah tuntas Level 1 (Inti Bumi 6.371 km) dan siap melanjutkan ke simulasi mitigasi Gunung Merapi di Level 2.'
            : sub1 && sub1.score > 0
              ? `Siswa sedang aktif menyelesaikan eksplorasi geologi Level 1 di lapisan ${escapeHtml(currentLayer1)} dengan perolehan ${scoreLv1} poin.`
              : 'Siswa masih dalam proses menuntaskan evaluasi geologi pada Level 1.'}
            </div>

            <div class="signature">
              <div>
                <br/>Mengetahui Orang Tua/Wali,<br/><br/><br/>
                ( .................................... )
              </div>
              <div style="text-align: right;">
                ${safeSchoolName}, ${new Date().toLocaleDateString('id-ID')}<br/>
                Guru Mata Pelajaran IPA,<br/><br/><br/>
                <strong>${safeTeacherName}</strong>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen w-full bg-[#3b82f6] text-amber-950 p-3 sm:p-6 md:p-8 flex flex-col font-pixel select-none relative overflow-x-hidden">

      {/* ── 1. ULTRA-DETAILED 2D PIXEL ART STRATOVOLCANO & SEA OF CLOUDS BACKDROP ── */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <img
          src="/bg-teacher-clouds.webp"
          alt="Stratovolcano rising above Sea of Clouds"
          className="w-full h-full object-cover object-center absolute inset-0 select-none"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Soft atmospheric depth vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-950/20 via-sky-900/15 to-sky-950/25" />

        {/* Dynamic Animated Pixel Overlays */}
        <svg
          viewBox="0 0 1200 700"
          className="w-full h-full object-cover absolute inset-0 pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="highlandSunBeam" x1="0%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="40%" stopColor="#fef9c3" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Cirrus cloud drift */}
          <g className="anim-cirrus-drift-slow" opacity="0.6">
            <rect x="60" y="35" width="220" height="4" fill="#ffffff" />
            <rect x="120" y="42" width="180" height="3" fill="#ffffff" opacity="0.75" />
            <rect x="480" y="25" width="340" height="5" fill="#ffffff" />
            <rect x="540" y="32" width="260" height="3" fill="#ffffff" opacity="0.8" />
            <rect x="880" y="45" width="240" height="4" fill="#ffffff" opacity="0.65" />
          </g>

          {/* Volcano summit crater smoke plume */}
          <g transform="translate(855, 195)" opacity="0.9">
            <g className="anim-merapi-smoke-1">
              <rect x="0" y="-8" width="16" height="12" fill="#f8fafc" />
              <rect x="4" y="-18" width="22" height="14" fill="#e2e8f0" />
              <rect x="12" y="-28" width="28" height="16" fill="#cbd5e1" opacity="0.7" />
            </g>
            <g className="anim-merapi-smoke-2">
              <rect x="2" y="-6" width="14" height="10" fill="#ffffff" />
              <rect x="8" y="-16" width="24" height="14" fill="#f1f5f9" />
              <rect x="18" y="-26" width="26" height="16" fill="#cbd5e1" opacity="0.6" />
            </g>
          </g>
        </svg>
      </div>

      {/* ── TOP NAV HEADER: WARM WOODEN LIGHT STYLE ── */}
      <header id="tour-teacher-header" className="relative z-10 w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-4 border-b-4 border-amber-950/40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              retroAudio.playSelect();
              navigate('/');
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-100 border-2 border-amber-950 shadow-[0_3px_0_#231206] text-[13px] font-pixel-title cursor-pointer transition-transform active:translate-y-0.5 flex items-center gap-1.5 font-semibold"
          >
            <span>&lt;</span>
            <span>MENU UTAMA</span>
          </button>
        </div>

        {/* Right Header: Cloud Status & Logout */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              retroAudio.playSelect();
              setEditTeacherName(teacherName);
              setEditTeacherSchool(schoolName);
              setTeacherProfileSuccess('');
              setShowTeacherProfileModal(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-200 hover:bg-amber-100 text-amber-950 font-pixel-title font-bold border-2 border-amber-950 text-[13.5px] shadow-[0_2px_0_#451a03] cursor-pointer transition-transform active:translate-y-0.5 flex items-center gap-1.5"
            title="Edit Profil Guru"
          >
            <PixelIcon name="user" size={12} />
            PROFIL GURU
          </button>

          <button
            onClick={() => {
              retroAudio.playSelect();
              logout();
              navigate('/login');
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-pixel-title font-bold border-2 border-rose-950 text-[13.5px] shadow-[0_2px_0_#4c0519] cursor-pointer transition-transform active:translate-y-0.5"
            title="Keluar dari Akun Guru"
          >
            KELUAR GURU
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER: WARM LIGHT WOOD & PARCHMENT THEME ── */}
      <main className="relative z-10 w-full max-w-6xl mx-auto space-y-4 flex-1">

        {/* ── CLASSROOM SELECTOR TABS ── */}
        <div id="tour-teacher-classroom" className="flex items-center gap-2 overflow-x-auto pb-1">
          {classrooms.map((cls) => (
            <button
              key={cls.code}
              onClick={() => {
                retroAudio.playSelect();
                setSelectedClassCode(cls.code);
              }}
              className={`px-4 py-2 rounded-xl border-2 text-[13px] font-pixel-title transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${selectedClassCode === cls.code
                ? 'bg-amber-400 text-amber-950 border-amber-950 shadow-[0_4px_0_#451a03] font-bold -translate-y-0.5'
                : 'bg-[#fef3c7]/95 text-amber-950 border-amber-950/60 hover:bg-amber-100 shadow-[0_2px_0_#451a03]'
                }`}
            >
              <span>{cls.name}</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 text-[12.5px] font-pixel-title font-semibold">
                {cls.code}
              </span>
            </button>
          ))}

          <button
            onClick={() => {
              retroAudio.playSelect();
              setShowNewClassModal(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-pixel-title text-[13px] font-bold border-2 border-emerald-950 shadow-[0_3px_0_#064e3b] cursor-pointer flex items-center gap-1.5 whitespace-nowrap transition-transform active:translate-y-0.5"
          >
            <span>+ BUAT KELAS BARU</span>
          </button>
        </div>

        {/* ── ACTIVE CLASSROOM BANNER & UNIFIED CONTROLS (LIGHT PARCHMENT BOARD) ── */}
        <div className="pixel-wood-board p-4 sm:p-5 rounded-2xl shadow-[0_6px_0_#231206] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ background: '#fef3c7' }}>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-pixel-title text-base sm:text-lg text-amber-950 font-bold">
                {activeClassObj.name}
              </h2>
              <span className="px-2.5 py-1 rounded-md bg-emerald-200 text-emerald-950 border-2 border-emerald-800 text-[13.5px] font-pixel-title font-bold">
                KODE KELAS: {selectedClassCode}
              </span>
            </div>
            <p className="text-[14.5px] text-amber-900 font-pixel mt-1 font-bold">
              Bagikan kode kelas kepada siswa untuk mendaftar mandiri, atau kelola akun kelas lewat tombol di bawah.
            </p>
          </div>

          {/* Unified Action Buttons */}
          <div id="tour-teacher-actions" className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyCode}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-pixel-title font-bold text-[13px] border-2 border-amber-950 shadow-[0_2px_0_#78350f] cursor-pointer flex items-center gap-1.5 transition-transform active:translate-y-0.5"
            >
              <span>{copiedCode ? '✓ TERSALIN!' : 'SALIN KODE'}</span>
            </button>

            {/* Unified Kelola / Edit Kelas Button */}
            <button
              onClick={() => {
                retroAudio.playSelect();
                setShowManageClassModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-pixel-title font-bold text-[13px] border-2 border-emerald-950 shadow-[0_2px_0_#064e3b] cursor-pointer flex items-center gap-1.5 transition-transform active:translate-y-0.5"
            >
              <PixelIcon name="gear" size={14} />
              <span>EDIT KELAS</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-100 font-pixel-title font-bold text-[13px] border-2 border-amber-950 shadow-[0_2px_0_#231206] cursor-pointer flex items-center gap-1.5 transition-transform active:translate-y-0.5"
              title="Download Rekap Nilai CSV Seluruh Siswa"
            >
              <PixelIcon name="clipboard" size={14} />
              <span>EKSPOR CSV</span>
            </button>
          </div>
        </div>

        {/* ── KPI TELEMETRY CARDS (OVERALL PROGRESS ACROSS ALL LEVELS) ── */}
        <div id="tour-teacher-kpi" className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Card 1: Total Siswa */}
          <div className="pixel-wood-board p-4 rounded-2xl shadow-[0_4px_0_#231206] space-y-1" style={{ background: '#fef3c7' }}>
            <span className="text-[13.5px] font-pixel-title font-bold text-amber-900 uppercase block">
              TOTAL SISWA TERDAFTAR
            </span>
            <div className="font-pixel-title text-2xl text-amber-950 my-1 font-medium">
              {totalStudents} <span className="text-[13px] text-amber-800 font-pixel font-semibold">Siswa</span>
            </div>
            <span className="text-[13.5px] font-pixel-title text-emerald-800 block font-semibold">
              Kelas: {activeClassObj.name}
            </span>
          </div>

          {/* Card 2: Progres Ketuntasan Kelas Keseluruhan */}
          <div className="pixel-wood-board p-4 rounded-2xl shadow-[0_4px_0_#231206] space-y-1.5" style={{ background: '#fef3c7' }}>
            <span className="text-[13.5px] font-pixel-title font-bold text-amber-900 uppercase block">
              PROGRES KETUNTASAN KELAS
            </span>
            <div className="font-pixel-title text-2xl text-emerald-800 my-1 flex items-baseline gap-2 font-medium">
              <span>{totalClassProgress}%</span>
              <span className="text-[13px] text-amber-900 font-pixel font-bold">
                ({tuntasLv3Count}/{totalStudents || 1} Tuntas Lv.3)
              </span>
            </div>
            <div className="w-full bg-amber-950/20 rounded-full h-2.5 overflow-hidden border border-amber-950/40">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${totalClassProgress}%` }}
              />
            </div>
          </div>

          {/* Card 3: Rata-Rata Skor Kuis Kelas */}
          <div className="pixel-wood-board p-4 rounded-2xl shadow-[0_4px_0_#231206] space-y-1" style={{ background: '#fef3c7' }}>
            <span className="text-[13.5px] font-pixel-title font-bold text-amber-900 uppercase block">
              RATA-RATA SKOR KELAS
            </span>
            <div className="font-pixel-title text-2xl text-amber-950 my-1 font-medium">
              {avgOverallScore} <span className="text-[13px] text-amber-800 font-pixel font-semibold">/ 100 Poin</span>
            </div>
          </div>
        </div>

        {/* ── FILTER & LIVE TABLE SECTION (LIGHT PARCHMENT WOOD BOARD) ── */}
        <div id="tour-teacher-table" className="pixel-wood-board p-4 sm:p-5 rounded-2xl shadow-[0_8px_0_#231206] space-y-4" style={{ background: '#fef3c7' }}>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-3 border-b-2 border-amber-950/20">
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama siswa, no. absen, username..."
                className="w-full sm:max-w-xs px-3.5 py-2 rounded-xl bg-amber-50 border-2 border-amber-950 text-amber-950 font-pixel text-[13px] focus:outline-none focus:ring-2 focus:ring-amber-600 shadow-inner font-semibold"
              />
            </div>

            {/* Filter Tabs: SEMUA, LV.1, LV.2, LV.3 */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[13.5px] font-pixel-title font-bold text-amber-950 uppercase">Filter:</span>
              {[
                { id: 'all', label: 'SEMUA' },
                { id: '1', label: 'LV.1' },
                { id: '2', label: 'LV.2' },
                { id: '3', label: 'LV.3' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterLevel(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl border-2 text-[13.5px] font-pixel-title cursor-pointer transition-all ${filterLevel === tab.id
                    ? 'bg-amber-950 text-amber-300 border-amber-950 shadow-[0_2px_0_#451a03] font-bold'
                    : 'bg-amber-200 text-amber-950 border-amber-950/40 hover:bg-amber-300'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container with 3-Level Evaluation Columns */}
          <div className="w-full overflow-x-auto rounded-xl border-2 border-amber-950/30 bg-white shadow-inner">
            <table className="w-full text-left border-collapse text-[13px] font-semibold">
              <thead>
                <tr className="bg-amber-200/90 border-b-2 border-amber-950/30 text-amber-950 font-pixel-title text-[12.5px] uppercase tracking-wider font-semibold">
                  <th className="p-2.5 text-center w-12 whitespace-nowrap">ABS</th>
                  <th className="p-2.5 whitespace-nowrap min-w-[180px]">SISWA &amp; AVATAR</th>
                  <th className="p-2.5 whitespace-nowrap min-w-[120px]">USERNAME AKUN</th>
                  <th className="p-2.5 text-center whitespace-nowrap min-w-[130px]">
                    <span className="whitespace-nowrap">{`LEVEL\u00A0AKTIF`}</span>
                  </th>
                  <th className="p-2.5 text-center whitespace-nowrap min-w-[160px]">
                    <span className="whitespace-nowrap">{`LV.\u00A01\u00A0(STRUKTUR\u00A0BUMI)`}</span>
                  </th>
                  <th className="p-2.5 text-center whitespace-nowrap min-w-[130px]">
                    <span className="whitespace-nowrap">{`LV.\u00A02\u00A0(TEKTONIK)`}</span>
                  </th>
                  <th className="p-2.5 text-center whitespace-nowrap min-w-[130px]">
                    <span className="whitespace-nowrap">{`LV.\u00A03\u00A0(SIMULASI)`}</span>
                  </th>
                  <th className="p-2.5 text-center whitespace-nowrap min-w-[130px]">
                    <span className="whitespace-nowrap">{`AKSI\u00A0&\u00A0RAPOR`}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-950/10 font-pixel font-bold text-amber-950">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-amber-900/70 font-pixel text-[13px] italic font-semibold">
                      Belum ada siswa yang sesuai kriteria di kelas ini. Klik [EDIT KELAS] untuk menambahkan akun murid.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => {
                    const sub1 = submissions.find((sub) => (sub.student_id === s.id || sub.student_id === s.username) && sub.level_number === 1);
                    const sub2 = submissions.find((sub) => (sub.student_id === s.id || sub.student_id === s.username) && sub.level_number === 2);
                    const sub3 = submissions.find((sub) => (sub.student_id === s.id || sub.student_id === s.username) && sub.level_number === 3);

                    // Status Level 1: Hanya dianggap TUNTAS jika nilainya sudah mencapai 100 poin penuh.
                    // Jika nilai belum sampai 100 (misal 20, 40, 60, 80 poin), statusnya PROGRES (bukan TUNTAS).
                    const score1 = sub1 ? sub1.score : (s.unlocked_level >= 2 ? 100 : 0);
                    const isLv1Done = score1 >= 100 || Boolean(sub1?.details?.is_completed);
                    const isLv1InProgress = !isLv1Done && (score1 > 0 || Boolean(sub1?.details?.current_layer));

                    const isLv2Done = (sub2 && sub2.score >= 100) || Boolean(sub2?.details?.is_completed) || (s.unlocked_level >= 3 && isLv1Done);
                    const score2 = sub2 ? sub2.score : (isLv2Done ? 100 : 0);
                    const isLv2InProgress = !isLv2Done && (score2 > 0 || Boolean(sub2?.details?.current_mission) || s.unlocked_level >= 2 || isLv1Done);

                    const completedMissionsCount3 =
                      sub3?.details?.completed_count ??
                      (Array.isArray(sub3?.details?.completed_missions) ? sub3.details.completed_missions.length : 0);
                    const score3 = sub3 ? sub3.score : (completedMissionsCount3 > 0 ? Math.round((completedMissionsCount3 / 20) * 100) : 0);
                    const isLv3Done = score3 >= 100 || Boolean(sub3?.details?.is_completed) || completedMissionsCount3 >= 20;
                    const isLv3InProgress = !isLv3Done && (score3 > 0 || completedMissionsCount3 > 0);
                    const isLv3Unlocked = isLv2Done || s.unlocked_level >= 3 || s.username === 'demo';

                    // Hitung level aktif murid yang sesungguhnya:
                    let studentActiveLevel = 1;
                    if (s.username === 'demo') {
                      studentActiveLevel = s.unlocked_level || 3;
                    } else if (isLv2Done || (s.unlocked_level >= 3 && isLv1Done)) {
                      studentActiveLevel = 3;
                    } else if (isLv1Done || (s.unlocked_level >= 2 && !sub1)) {
                      studentActiveLevel = 2;
                    } else {
                      studentActiveLevel = 1;
                    }

                    return (
                      <tr key={s.id} className="hover:bg-amber-50/90 transition-colors">
                        {/* 1. Absen */}
                        <td className="p-2.5 text-center font-pixel-title text-[13.5px] text-amber-950 whitespace-nowrap font-semibold">
                          #{s.absent_number}
                        </td>

                        {/* 2. Siswa & Avatar */}
                        <td className="p-2.5">
                          <div className="flex items-center gap-2.5">
                            <PixelAvatarRenderer config={s.avatar_config} size={32} animate={false} />
                            <div>
                              <span className="font-bold text-amber-950 block text-[13px] font-pixel">{s.name}</span>
                              <span className="text-[13.5px] text-amber-800/80 font-pixel-title font-semibold">ID: {s.id.slice(0, 8)}</span>
                            </div>
                          </div>
                        </td>

                        {/* 3. Username */}
                        <td className="p-2.5 font-pixel text-[13px] text-amber-950 whitespace-nowrap font-semibold">
                          {s.username || '-'}
                        </td>

                        {/* 4. Level Aktif Chip (Pixel Font) - 100% Tidak Akan Patah / Wrap Ke Bawah */}
                        <td className="p-2.5 text-center whitespace-nowrap min-w-[130px]">
                          <span
                            className={`px-3 py-1.5 rounded-lg border-2 text-[13.5px] font-pixel-title font-bold whitespace-nowrap inline-block text-center tracking-wider leading-none select-none shadow-[0_2px_0_rgba(0,0,0,0.15)] ${studentActiveLevel >= 3
                              ? 'bg-purple-100 text-purple-900 border-purple-500'
                              : studentActiveLevel === 2
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-500'
                                : 'bg-amber-100 text-amber-900 border-amber-500'
                              }`}
                          >
                            {`LEVEL\u00A0${studentActiveLevel}`}
                          </span>
                        </td>

                        {/* 5. Evaluasi Level 1 (Struktur Bumi - Earth Dive) */}
                        <td className="p-2.5 text-center whitespace-nowrap min-w-[160px]">
                          {isLv1Done ? (
                            <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-slate-950 text-[12.5px] font-pixel-title border border-emerald-950 font-bold inline-block whitespace-nowrap shadow-[0_1px_0_#064e3b]">
                              [ TUNTAS ]
                            </span>
                          ) : isLv1InProgress ? (
                            <span className="px-2.5 py-1 rounded-md bg-sky-200 text-sky-950 text-[12.5px] font-pixel-title border border-sky-600 font-bold inline-block whitespace-nowrap shadow-[0_1px_0_#0284c7]">
                              [ PROGRES ]
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-[12.5px] font-pixel-title border border-amber-400 font-bold inline-block whitespace-nowrap">
                              BELUM
                            </span>
                          )}
                          <span className="text-[12.5px] font-pixel block text-amber-900 mt-1 font-semibold whitespace-nowrap">
                            {isLv1Done
                              ? `${score1} Poin`
                              : isLv1InProgress
                                ? `${score1} Poin`
                                : 'Belum mulai'}
                          </span>
                        </td>

                        {/* 6. Evaluasi Level 2 (Ekspedisi Tektonik) */}
                        <td className="p-2.5 text-center whitespace-nowrap min-w-[130px]">
                          {isLv2Done ? (
                            <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-slate-950 text-[12.5px] font-pixel-title border border-emerald-950 font-bold inline-block whitespace-nowrap shadow-[0_1px_0_#064e3b]">
                              [ TUNTAS ]
                            </span>
                          ) : isLv2InProgress ? (
                            <span className="px-2.5 py-1 rounded-md bg-sky-200 text-sky-950 text-[12.5px] font-pixel-title border border-sky-600 font-bold inline-block whitespace-nowrap shadow-[0_1px_0_#0284c7]">
                              [ PROGRES ]
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md bg-slate-200 text-slate-600 text-[12.5px] font-pixel-title border border-slate-400 inline-block whitespace-nowrap font-semibold">
                              TERKUNCI
                            </span>
                          )}
                          <span className="text-[12.5px] font-pixel block text-amber-900 mt-1 whitespace-nowrap font-semibold">
                            {isLv2Done ? `${score2} Poin` : (score2 > 0 ? `${score2} Poin` : (isLv2InProgress ? 'Belum mulai' : '—'))}
                          </span>
                        </td>

                        {/* 7. Evaluasi Level 3 (Simulasi Game) */}
                        <td className="p-2.5 text-center whitespace-nowrap min-w-[130px]">
                          {isLv3Done ? (
                            <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-slate-950 text-[12.5px] font-pixel-title border border-emerald-950 font-bold inline-block whitespace-nowrap shadow-[0_1px_0_#064e3b]">
                              [ TUNTAS ]
                            </span>
                          ) : isLv3InProgress ? (
                            <span className="px-2.5 py-1 rounded-md bg-sky-200 text-sky-950 text-[12.5px] font-pixel-title border border-sky-600 font-bold inline-block whitespace-nowrap shadow-[0_1px_0_#0284c7]">
                              [ PROGRES ]
                            </span>
                          ) : isLv3Unlocked ? (
                            <span className="px-2.5 py-1 rounded-md bg-purple-200 text-purple-950 text-[12.5px] font-pixel-title border border-purple-500 font-bold inline-block whitespace-nowrap">
                              AKTIF
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-md bg-slate-200 text-slate-600 text-[12.5px] font-pixel-title border border-slate-400 inline-block whitespace-nowrap font-semibold">
                              TERKUNCI
                            </span>
                          )}
                          <span className="text-[12.5px] font-pixel block text-amber-900 mt-1 whitespace-nowrap font-semibold">
                            {isLv3Done
                              ? `${score3} Poin`
                              : isLv3InProgress
                                ? `${score3} Poin (${completedMissionsCount3}/20)`
                                : isLv3Unlocked
                                  ? 'Lab Simulasi'
                                  : '—'}
                          </span>
                        </td>

                        {/* 8. Aksi & Rapor */}
                        <td className="p-2.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                retroAudio.playSelect();
                                setSelectedStudentForDetail(s);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-100 font-pixel-title font-bold text-[12.5px] border border-amber-950 cursor-pointer shadow-[0_2px_0_#231206] transition-transform active:translate-y-0.5"
                              title="Lihat Detail & Unduh Rapor Siswa"
                            >
                              DETAIL & RAPOR
                            </button>
                            <button
                              onClick={() => {
                                retroAudio.playLocked();
                                setStudentToDelete(s);
                              }}
                              className="px-2 py-1 rounded-lg bg-rose-700 hover:bg-rose-600 text-white font-pixel-title font-bold text-[12.5px] border border-rose-950 cursor-pointer shadow-[0_2px_0_#4c0519] transition-transform active:translate-y-0.5"
                              title="Hapus Akun Murid"
                            >
                              HAPUS
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── UNIFIED MODAL: KELOLA / EDIT KELAS (GANTI NAMA, TAMBAH SISWA, HAPUS KELAS) ── */}
      {showManageClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="pixel-wood-board p-5 sm:p-6 rounded-2xl text-amber-950 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto" style={{ background: '#fef3c7' }}>
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-amber-950/30 pb-3">
              <div>
                <h3 className="font-pixel-title text-[15px] sm:text-base text-amber-950 font-bold flex items-center gap-2">
                  <PixelIcon name="gear" size={16} />
                  <span>KELOLA & EDIT KELAS</span>
                </h3>
                <p className="text-[14.5px] text-amber-900 font-pixel font-semibold">
                  Kode Kelas: <strong className="font-pixel-title text-amber-950">{selectedClassCode}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowManageClassModal(false)}
                className="w-8 h-8 rounded-lg bg-amber-900 text-amber-100 flex items-center justify-center border border-amber-950 font-bold cursor-pointer hover:bg-amber-800"
              >
                ✕
              </button>
            </div>

            {/* Navigation Tabs inside Manage Modal */}
            <div className="flex items-center gap-1.5 border-b-2 border-amber-950/20 pb-2">
              <button
                onClick={() => {
                  retroAudio.playHover();
                  setManageTab('rename');
                }}
                className={`px-3 py-1.5 rounded-xl border-2 font-pixel-title text-[13.5px] cursor-pointer ${manageTab === 'rename'
                  ? 'bg-amber-400 text-amber-950 border-amber-950 shadow-[0_2px_0_#451a03] font-bold'
                  : 'bg-amber-100 text-amber-900 border-amber-900/40 hover:bg-amber-200'
                  }`}
              >
                GANTI NAMA KELAS
              </button>
              <button
                onClick={() => {
                  retroAudio.playHover();
                  setManageTab('add_student');
                }}
                className={`px-3 py-1.5 rounded-xl border-2 font-pixel-title text-[13.5px] cursor-pointer ${manageTab === 'add_student'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-950 shadow-[0_2px_0_#064e3b] font-bold'
                  : 'bg-amber-100 text-amber-900 border-amber-900/40 hover:bg-amber-200'
                  }`}
              >
                + TAMBAH SISWA
              </button>
              <button
                onClick={() => {
                  retroAudio.playHover();
                  setManageTab('danger');
                }}
                className={`px-3 py-1.5 rounded-xl border-2 font-pixel-title text-[13.5px] cursor-pointer ${manageTab === 'danger'
                  ? 'bg-rose-700 text-white border-rose-950 shadow-[0_2px_0_#4c0519] font-bold'
                  : 'bg-amber-100 text-rose-900 border-amber-900/40 hover:bg-rose-100'
                  }`}
              >
                HAPUS KELAS
              </button>
            </div>

            {/* Tab Content 1: Ganti Nama Kelas */}
            {manageTab === 'rename' && (
              <form onSubmit={handleUpdateClassName} className="space-y-3 pt-1">
                {editClassSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-100 border-2 border-emerald-700 text-emerald-950 text-[13px] font-bold font-pixel">
                    ✓ {editClassSuccess}
                  </div>
                )}
                <div>
                  <label className="block text-[14.5px] font-bold font-pixel-title text-amber-950 mb-1">
                    NAMA KELAS SAAT INI
                  </label>
                  <input
                    type="text"
                    value={editClassName}
                    onChange={(e) => setEditClassName(e.target.value)}
                    placeholder="Misal: Kelas VIII-A (IPA Unggulan)"
                    className="w-full px-3.5 py-2 rounded-xl bg-amber-50 border-2 border-amber-950 text-amber-950 text-[13px] font-pixel shadow-inner font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="pixel-btn-wood-plank !w-full !h-11 !text-[13px] cursor-pointer flex items-center justify-center gap-2 font-semibold"
                >
                  <span>SIMPAN PERUBAHAN NAMA KELAS</span>
                  <span>&gt;</span>
                </button>
              </form>
            )}

            {/* Tab Content 2: Tambah Akun Siswa Baru */}
            {manageTab === 'add_student' && (
              <form onSubmit={handleCreateStudent} className="space-y-3 pt-1">
                {addStdSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-100 border-2 border-emerald-700 text-emerald-950 text-[13px] font-bold font-pixel">
                    ✓ {addStdSuccess}
                  </div>
                )}
                {addStdError && (
                  <div className="p-2.5 rounded-xl bg-rose-100 border-2 border-rose-700 text-rose-950 text-[13px] font-bold font-pixel">
                    ⚠ {addStdError}
                  </div>
                )}
                <div>
                  <label className="block text-[13.5px] font-pixel-title font-bold text-amber-950 mb-1">
                    NAMA LENGKAP SISWA
                  </label>
                  <input
                    type="text"
                    value={newStdName}
                    onChange={(e) => setNewStdName(e.target.value)}
                    placeholder="Misal: Rizky Ramadhan"
                    className="w-full px-3.5 py-2 rounded-xl bg-amber-50 border-2 border-amber-950 text-amber-950 text-[13px] font-pixel shadow-inner font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[13.5px] font-pixel-title font-bold text-amber-950 mb-1">
                      NO. ABSEN
                    </label>
                    <input
                      type="text"
                      value={newStdAbsent}
                      onChange={(e) => setNewStdAbsent(e.target.value)}
                      placeholder="15"
                      className="w-full px-3.5 py-2 rounded-xl bg-amber-50 border-2 border-amber-950 text-amber-950 text-[13px] font-pixel shadow-inner font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[13.5px] font-pixel-title font-bold text-amber-950 mb-1">
                      USERNAME SISWA
                    </label>
                    <input
                      type="text"
                      value={newStdUsername}
                      onChange={(e) => setNewStdUsername(e.target.value)}
                      placeholder="rizky15"
                      className="w-full px-3.5 py-2 rounded-xl bg-amber-50 border-2 border-amber-950 text-amber-950 text-[13px] font-pixel shadow-inner font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[13.5px] font-pixel-title font-bold text-amber-950 mb-1">
                    PASSWORD SEMENTARA
                  </label>
                  <input
                    type="text"
                    value={newStdPassword}
                    onChange={(e) => setNewStdPassword(e.target.value)}
                    placeholder="12345"
                    className="w-full px-3.5 py-2 rounded-xl bg-amber-50 border-2 border-amber-950 text-amber-950 text-[13px] font-pixel shadow-inner font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="pixel-btn-wood-plank !w-full !h-11 !text-[13px] cursor-pointer flex items-center justify-center gap-2 font-semibold"
                >
                  <span>+ SIMPAN AKUN SISWA KE KELAS</span>
                  <span>&gt;</span>
                </button>
              </form>
            )}

            {/* Tab Content 3: Zona Bahaya / Hapus Kelas */}
            {manageTab === 'danger' && (
              <div className="space-y-3 pt-1">
                <div className="p-3.5 bg-rose-100 rounded-xl border-2 border-rose-800 text-[13px] text-rose-950 space-y-2 font-semibold">
                  <div className="flex items-center gap-2 font-pixel-title text-rose-900 font-bold">
                    <PixelIcon name="warning" size={16} />
                    <span>PERINGATAN ZONA BAHAYA</span>
                  </div>
                  <p className="font-pixel leading-relaxed">
                    Menghapus kelas <strong>"{activeClassObj.name}"</strong> (Kode: {selectedClassCode}) akan menghapus <strong>seluruh data {students.length} murid</strong> dan riwayat nilai kuis yang tersimpan di kelas ini secara permanen.
                  </p>
                </div>
                <button
                  onClick={handleDeleteClassroom}
                  className="w-full py-3 px-4 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-pixel-title text-[13px] font-bold border-2 border-rose-950 shadow-[0_4px_0_#4c0519] cursor-pointer flex items-center justify-center gap-2 transition-transform active:translate-y-0.5"
                >
                  <PixelIcon name="explosion" size={16} />
                  <span>HAPUS KELAS INI & SEMUA DATA MURID</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── MODAL: BUAT KELAS BARU ── */}
      {showNewClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="pixel-wood-board p-5 sm:p-6 rounded-2xl text-amber-950 w-full max-w-sm space-y-4" style={{ background: '#fef3c7' }}>
            <div className="flex items-center justify-between border-b-2 border-amber-950/30 pb-2">
              <h3 className="font-pixel-title text-[15px] text-amber-950 font-bold">
                BUAT KELAS BARU
              </h3>
              <button
                onClick={() => setShowNewClassModal(false)}
                className="w-7 h-7 rounded-lg bg-amber-900 text-amber-100 flex items-center justify-center border border-amber-950 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-3">
              <div>
                <label className="block text-[14.5px] font-pixel-title font-bold text-amber-950 mb-1">
                  NAMA KELAS
                </label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="Misal: Kelas VIII-B (IPA)"
                  className="w-full px-3.5 py-2 rounded-xl bg-amber-50 border-2 border-amber-950 text-amber-950 text-[13px] font-pixel shadow-inner font-semibold"
                />
              </div>

              <button
                type="submit"
                className="pixel-btn-wood-plank !w-full !h-11 !text-[13px] cursor-pointer flex items-center justify-center gap-2 font-semibold"
              >
                <span>BUAT KELAS & KODE BARU</span>
                <span>&gt;</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: DETAIL SISWA & CETAK RAPOR INDIVIDUAL ── */}
      {selectedStudentForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="pixel-wood-board p-5 md:p-6 rounded-2xl text-amber-950 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto" style={{ background: '#fef3c7' }}>

            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-amber-950/30 pb-3">
              <div className="flex items-center gap-3">
                <PixelAvatarRenderer config={selectedStudentForDetail.avatar_config} size={48} animate={false} />
                <div>
                  <h3 className="font-pixel-title text-[15px] md:text-base text-amber-950 font-bold">
                    {selectedStudentForDetail.name}
                  </h3>
                  <p className="text-[14.5px] text-amber-900 font-pixel font-bold">
                    No. Absen: #{selectedStudentForDetail.absent_number} • {selectedStudentForDetail.class_name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentForDetail(null)}
                className="w-8 h-8 rounded-lg bg-amber-900 text-amber-100 flex items-center justify-center border border-amber-950 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Info Akun Login Siswa */}
            <div className="p-3 bg-amber-100 rounded-xl border border-amber-950/30 space-y-1 text-[13px] font-semibold">
              <span className="text-[13.5px] font-pixel-title font-bold text-amber-950 uppercase block">AKUN LOGIN SISWA:</span>
              <div className="flex items-center justify-between font-pixel">
                <span>Username: <strong className="font-pixel-title text-amber-950">{selectedStudentForDetail.username || '-'}</strong></span>
              </div>
              <p className="text-[13.5px] font-pixel text-amber-900/80 leading-snug font-semibold">
                Password tidak disimpan di sistem (hanya tersimpan terenkripsi di server autentikasi).
                Bila siswa lupa password, minta siswa menggantinya sendiri lewat halaman Profil.
              </p>
            </div>

            {/* Rincian Progres Semua Level */}
            <div className="space-y-2">
              <span className="text-[13.5px] font-pixel-title font-bold text-amber-950 uppercase block">PROGRES BELAJAR & NILAI KUIS:</span>

              {/* Level 1 Detail: Penjelajahan Struktur Bumi (Earth Dive) */}
              {(() => {
                const sub1 = submissions.find((s) => s.student_id === selectedStudentForDetail.id && s.level_number === 1);
                const score = sub1 ? sub1.score : (selectedStudentForDetail.unlocked_level >= 2 ? 100 : 0);
                const isLv1Done = score >= 100;
                const currentLayer = sub1?.details?.current_layer || (isLv1Done ? 'Inti Dalam (5.150–6.371 km)' : 'Kerak Bumi (0–100 km)');
                const crystals = sub1?.details?.crystals ?? (isLv1Done ? 5 : 0);
                const wordsList = sub1?.details?.words || (isLv1Done ? ['LEMPENG', 'KONVEKSI', 'DINAMO', 'TEKANAN', 'SUBDUKSI'] : []);
                const wordsText = wordsList.length > 0 ? wordsList.join(', ') : 'Belum ada evaluasi diselesaikan';
                const badgesList = sub1?.details?.badges || (isLv1Done ? ['Surface Scout', 'Tectonic Tracker', 'Mantle Explorer', 'Core Specialist'] : []);

                return (
                  <div className="p-3 bg-white rounded-xl border border-amber-950/20 space-y-2 text-[13px] font-semibold">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-950 font-pixel">Level 1: Penjelajahan Lapisan Bumi (Earth Dive)</span>
                      <span className={`px-2 py-0.5 rounded font-pixel-title text-[12.5px] font-bold ${
                        isLv1Done
                          ? 'bg-emerald-100 text-emerald-800'
                          : sub1 && sub1.score > 0
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isLv1Done ? 'TUNTAS' : sub1 && sub1.score > 0 ? 'SEDANG DIKERJAKAN' : 'BELUM MULAI'}
                      </span>
                    </div>
                    <div className="text-[14.5px] text-amber-900 font-pixel space-y-1 font-semibold">
                      <div>Capaian Lapisan: <strong className="text-amber-950">{currentLayer}</strong></div>
                      <div>Skor Evaluasi: <strong className="text-amber-950">{score} / 100 Poin</strong> (20 Poin / Lapisan Tuntas)</div>
                      <div>Kata Kunci Geologi: <strong className="text-amber-950">{wordsText}</strong></div>
                      <div>Kristal Geologi: <strong className="text-cyan-800">{crystals}/5 Terkumpul</strong></div>
                      {badgesList.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {badgesList.map((b: string) => (
                            <span key={b} className="px-1.5 py-0.5 bg-amber-100 border border-amber-400 rounded text-[12.5px] font-pixel text-amber-900 font-bold">
                              ★ {b}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Level 2 Detail */}
              {(() => {
                const sub2 = submissions.find((s) => s.student_id === selectedStudentForDetail.id && s.level_number === 2);
                const score = sub2 ? sub2.score : (selectedStudentForDetail.unlocked_level >= 3 ? 100 : 0);
                const isLv2Done = score >= 100 || Boolean(sub2?.details?.is_completed) || selectedStudentForDetail.unlocked_level >= 3;
                const isLv2InProgress = !isLv2Done && (score > 0 || Boolean(sub2?.details?.current_mission) || selectedStudentForDetail.unlocked_level >= 2);

                return (
                  <div className="p-3 bg-white rounded-xl border border-amber-950/20 space-y-1 text-[13px] font-semibold">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-950 font-pixel">Level 2: Ekspedisi Batas Lempeng Tektonik (Tectonic Explorer)</span>
                      <span className={`px-2 py-0.5 rounded font-pixel-title text-[12.5px] font-bold ${isLv2Done ? 'bg-emerald-100 text-emerald-800' : isLv2InProgress ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-600'}`}>
                        {isLv2Done ? 'TUNTAS' : isLv2InProgress ? 'SEDANG DIKERJAKAN' : 'TERKUNCI'}
                      </span>
                    </div>
                    <div className="text-[14.5px] text-amber-900 font-pixel space-y-0.5 font-semibold">
                      <div>Skor Tektonik: <strong>{isLv2Done || score > 0 ? `${score} / 100 Poin` : '—'}</strong></div>
                      {sub2?.details?.stage_label && (
                        <div>Capaian Misi: <strong>{sub2.details.stage_label}</strong></div>
                      )}
                      {sub2?.details?.crystals !== undefined && (
                        <div>Kristal Dikumpulkan: <strong>{sub2.details.crystals} / 21 Kristal</strong></div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Level 3 Detail */}
              {(() => {
                const sub3 = submissions.find(
                  (s) =>
                    (s.student_id === selectedStudentForDetail.id ||
                      s.student_id === selectedStudentForDetail.username) &&
                    s.level_number === 3
                );
                const completedMissionsCount =
                  sub3?.details?.completed_count ??
                  (Array.isArray(sub3?.details?.completed_missions)
                    ? sub3.details.completed_missions.length
                    : 0);
                const score3 = sub3 ? sub3.score : (completedMissionsCount > 0 ? Math.round((completedMissionsCount / 20) * 100) : 0);
                const isLv3Done = score3 >= 100 || Boolean(sub3?.details?.is_completed) || completedMissionsCount >= 20;
                const isLv3InProgress = !isLv3Done && (score3 > 0 || completedMissionsCount > 0);
                const isLv3Active = selectedStudentForDetail.unlocked_level >= 3 || selectedStudentForDetail.username === 'demo';

                return (
                  <div className="p-3 bg-white rounded-xl border border-amber-950/20 space-y-2 text-[13px] font-semibold">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-950 font-pixel">Level 3: Simulation Game (Digital Twin Lab)</span>
                      <span
                        className={`px-2 py-0.5 rounded font-pixel-title text-[12.5px] font-bold ${
                          isLv3Done
                            ? 'bg-emerald-100 text-emerald-800'
                            : isLv3InProgress
                              ? 'bg-sky-100 text-sky-800'
                              : isLv3Active
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isLv3Done ? 'TUNTAS' : isLv3InProgress ? 'PROGRES' : isLv3Active ? 'AKTIF DI LAB' : 'TERKUNCI'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[14.5px] font-pixel text-amber-900 font-semibold">
                      <div>
                        <span className="text-amber-950/60 block text-[12.5px] uppercase font-semibold">Nilai Simulasi:</span>
                        <strong className="text-amber-950 font-pixel-title text-[13.5px] font-semibold">
                          {score3} / 100 Poin
                        </strong>
                      </div>
                      <div>
                        <span className="text-amber-950/60 block text-[12.5px] uppercase font-semibold">Misi Selesai:</span>
                        <strong className="text-amber-950 font-pixel-title text-[13.5px] font-semibold">
                          {completedMissionsCount} / 20 Misi
                        </strong>
                      </div>
                    </div>

                    <div className="w-full bg-amber-100 rounded-full h-2 overflow-hidden border border-amber-950/20">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.round((completedMissionsCount / 20) * 100))}%` }}
                      />
                    </div>

                    {sub3?.details?.stage_label && (
                      <p className="text-[13.5px] text-amber-800 font-pixel italic font-semibold">
                        {sub3.details.stage_label}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Action Buttons: Print Report & Delete */}
            <div className="pt-2 border-t border-amber-950/20 flex items-center justify-between gap-2">
              <button
                onClick={() => handlePrintStudentReport(selectedStudentForDetail)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-pixel-title text-[13px] font-bold border-2 border-emerald-950 shadow-[0_2px_0_#064e3b] cursor-pointer flex items-center gap-2"
              >
                <PixelIcon name="printer" size={15} />
                <span>CETAK / UNDUH RAPOR</span>
              </button>

              <button
                onClick={() => {
                  setStudentToDelete(selectedStudentForDetail);
                }}
                className="px-3 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-pixel-title font-bold text-[13px] border border-rose-400 cursor-pointer flex items-center gap-1.5"
              >
                <PixelIcon name="trash" size={12} />
                <span>HAPUS AKUN</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── MODAL: KONFIRMASI HAPUS SISWA ── */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="pixel-wood-board p-5 rounded-2xl text-amber-950 w-full max-w-sm space-y-3" style={{ background: '#fef3c7' }}>
            <div className="flex items-center gap-2 text-rose-950">
              <PixelIcon name="alert" size={18} />
              <h3 className="font-pixel-title text-[15px] text-rose-950 font-bold">
                KONFIRMASI HAPUS SISWA
              </h3>
            </div>
            <p className="text-[13px] text-amber-950 font-pixel font-semibold">
              Apakah Anda yakin ingin menghapus akun siswa <strong>"{studentToDelete.name}"</strong>? Data nilai dan progres siswa akan dihapus dari kelas ini.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-200 text-amber-950 font-pixel-title font-bold text-[13px] border border-amber-950 cursor-pointer"
              >
                BATAL
              </button>
              <button
                onClick={handleDeleteStudent}
                className="px-3.5 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-pixel-title font-bold text-[13px] border border-rose-950 cursor-pointer shadow-[0_2px_0_#4c0519]"
              >
                YA, HAPUS AKUN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT PROFIL GURU ── */}
      {showTeacherProfileModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowTeacherProfileModal(false)}
        >
          <div
            className="pixel-wood-board p-5 rounded-2xl text-amber-950 w-full max-w-md space-y-4"
            style={{ background: '#fef3c7' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-amber-950/30 pb-3">
              <div className="flex items-center gap-2">
                <PixelIcon name="user" size={18} />
                <h3 className="font-pixel-title text-[15px] text-amber-950 font-bold">EDIT PROFIL GURU</h3>
              </div>
              <button
                onClick={() => setShowTeacherProfileModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-950/10 hover:bg-amber-950/20 text-amber-950 font-bold cursor-pointer border border-amber-950/20"
              >
                ✕
              </button>
            </div>

            {/* Success message */}
            {teacherProfileSuccess && (
              <div className="px-3 py-2 rounded-lg bg-emerald-100 border border-emerald-600 text-emerald-900 text-[14.5px] font-pixel font-bold flex items-center gap-2">
                <PixelIcon name="check" size={12} />
                {teacherProfileSuccess}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editTeacherName.trim()) return;
                setTeacherProfileSaving(true);
                retroAudio.playSelect();
                const ok = await updateCurrentUserName(editTeacherName.trim(), editTeacherSchool.trim());
                setTeacherProfileSaving(false);
                if (ok) {
                  retroAudio.playWin();
                  setTeacherProfileSuccess('Profil berhasil diperbarui!');
                  setTimeout(() => {
                    setShowTeacherProfileModal(false);
                    setTeacherProfileSuccess('');
                  }, 2000);
                }
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[14.5px] font-pixel-title text-amber-900 mb-1.5 font-semibold">NAMA LENGKAP GURU</label>
                <input
                  type="text"
                  value={editTeacherName}
                  onChange={(e) => setEditTeacherName(e.target.value)}
                  placeholder="Contoh: Bapak Hendra, S.Pd"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-amber-950/40 bg-amber-50 text-amber-950 font-pixel text-[15px] focus:outline-none focus:border-amber-700 font-semibold"
                />
              </div>
              <div>
                <label className="block text-[14.5px] font-pixel-title text-amber-900 mb-1.5 font-semibold">NAMA SEKOLAH</label>
                <input
                  type="text"
                  value={editTeacherSchool}
                  onChange={(e) => setEditTeacherSchool(e.target.value)}
                  placeholder="Contoh: SMP Negeri 1 Magelang"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-amber-950/40 bg-amber-50 text-amber-950 font-pixel text-[15px] focus:outline-none focus:border-amber-700 font-semibold"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowTeacherProfileModal(false)}
                  className="flex-1 px-3 py-2 rounded-xl bg-amber-200 text-amber-950 font-pixel-title font-bold text-[13px] border-2 border-amber-950/60 cursor-pointer"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  disabled={teacherProfileSaving || !editTeacherName.trim()}
                  className="flex-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-pixel-title font-bold text-[13px] border-2 border-emerald-950 shadow-[0_3px_0_#064e3b] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {teacherProfileSaving ? 'MENYIMPAN...' : 'SIMPAN PROFIL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── RESQY TUTORIAL WALKTHROUGH OVERLAY ── */}
      <ResqyTutorialOverlay
        tour={TUTORIAL_TOURS.teacher_dashboard}
        userId={currentUser?.id}
      />

    </div>
  );
}
