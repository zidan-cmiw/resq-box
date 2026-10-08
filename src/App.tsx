import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppLayout from './app/AppLayout';
import Dashboard from './app/Dashboard';
import { useAuthStore } from './store/teacherStore';
import AppErrorBoundary from './components/AppErrorBoundary';
import { setMonitoringContext } from './utils/monitoring';

const Login = lazy(() => import('./app/Login'));
const Workspace = lazy(() => import('./app/Workspace'));
const Level1 = lazy(() => import('./app/Level1'));
const Level2 = lazy(() => import('./app/Level2'));
const Level3 = lazy(() => import('./app/Level3'));
const Credits = lazy(() => import('./app/Credits'));
const Profile = lazy(() => import('./app/Profile'));
const TeacherDashboard = lazy(() => import('./app/TeacherDashboard'));
const NotFound = lazy(() => import('./app/NotFound'));
const Privacy = lazy(() => import('./app/Privacy'));

function Loading() {
  return (
    <div className="min-h-screen bg-[#050813] flex items-center justify-center font-pixel text-amber-300 text-[13px]">
      MEMUAT...
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const currentUser = useAuthStore((state) => state.currentUser);

  // If user has not logged in, redirect directly to /login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function LevelGuard({ requiredLevel, children }: { requiredLevel: number; children: React.ReactNode }) {
  const unlockedLevel = useAuthStore((state) => state.unlockedLevel);
  if (unlockedLevel < requiredLevel) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function TeacherGuard({ children }: { children: React.ReactNode }) {
  const currentUser = useAuthStore((state) => state.currentUser);

  if (currentUser?.role !== 'teacher') {
    return <Navigate to="/login?role=teacher" replace />;
  }
  return <>{children}</>;
}

/**
 * Melaporkan rute aktif & peran pengguna ke lapisan monitoring, supaya laporan
 * error bisa dikelompokkan ("error hanya di /level3, hanya pada siswa").
 * Tidak mengirim id siswa — hanya peran dan rute.
 */
function MonitoringContextTracker() {
  const location = useLocation();
  const currentUser = useAuthStore((state) => state.currentUser);

  useEffect(() => {
    const role = currentUser?.role === 'teacher' ? 'teacher' : currentUser ? 'student' : 'guest';
    setMonitoringContext({ route: location.pathname, role });
  }, [location.pathname, currentUser]);

  return null;
}

function App() {
  return (
    // ErrorBoundary diletakkan DI LUAR BrowserRouter & Suspense supaya ia
    // menangkap kegagalan apa pun — termasuk chunk rute yang gagal dimuat
    // (mis. jaringan putus setelah deploy baru).
    <AppErrorBoundary label="root">
      <BrowserRouter>
        <MonitoringContextTracker />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Halaman publik — boleh dibuka tanpa login, agar sekolah dan
                orang tua dapat memeriksa penanganan data siswa. */}
            <Route path="/privacy" element={<Privacy />} />
          
          {/* Protected Game Routes */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/level1" element={<Level1 />} />
            <Route
              path="/level2"
              element={
                <LevelGuard requiredLevel={2}>
                  <Level2 />
                </LevelGuard>
              }
            />
            <Route
              path="/level3"
              element={
                <LevelGuard requiredLevel={3}>
                  <Level3 />
                </LevelGuard>
              }
            />
            <Route path="/credits" element={<Credits />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/teacher"
              element={
                <TeacherGuard>
                  <TeacherDashboard />
                </TeacherGuard>
              }
            />
            <Route
              path="/guru"
              element={
                <TeacherGuard>
                  <TeacherDashboard />
                </TeacherGuard>
              }
            />
          </Route>

          {/* Full-screen pages (no sidebar) */}
          <Route path="/workspace" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

export default App;
