import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './app/AppLayout';
import Dashboard from './app/Dashboard';
import { useAuthStore } from './store/teacherStore';

const Login = lazy(() => import('./app/Login'));
const Workspace = lazy(() => import('./app/Workspace'));
const Level1 = lazy(() => import('./app/Level1'));
const Level2 = lazy(() => import('./app/Level2'));
const Level3 = lazy(() => import('./app/Level3'));
const Credits = lazy(() => import('./app/Credits'));
const Profile = lazy(() => import('./app/Profile'));
const TeacherDashboard = lazy(() => import('./app/TeacherDashboard'));
const NotFound = lazy(() => import('./app/NotFound'));

function Loading() {
  return (
    <div className="min-h-screen bg-[#050813] flex items-center justify-center font-pixel text-amber-300 text-xs">
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

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
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
  );
}

export default App;
