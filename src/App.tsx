import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './app/Dashboard';

const Workspace = lazy(() => import('./app/Workspace'));
const Mitigation = lazy(() => import('./app/Mitigation'));
const EvacuationGame = lazy(() => import('./app/EvacuationGame'));

function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-3">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">
          progress_activity
        </span>
        <p className="font-label-md text-on-surface-variant">Memuat...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/mitigation" element={<Mitigation />} />
          <Route path="/evacuation" element={<EvacuationGame />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
