import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import PatientDashboard from './pages/PatientDashboard';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import TrainerDashboard from './pages/TrainerDashboard';
import SessionView from './pages/SessionView';
import ExerciseBriefing from './pages/ExerciseBriefing';
import AuthCallback from './pages/AuthCallback';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/verify" element={<AuthCallback />} />

          <Route path="/patient/*" element={
            <RequireAuth allowedRoles={['patient']}>
              <PatientDashboard />
            </RequireAuth>
          } />

          <Route path="/professional/*" element={
            <RequireAuth allowedRoles={['professional']}>
              <ProfessionalDashboard />
            </RequireAuth>
          } />

          <Route path="/trainer/*" element={
            <RequireAuth allowedRoles={['trainer']}>
              <TrainerDashboard />
            </RequireAuth>
          } />

          <Route path="/briefing/:id" element={
            <RequireAuth allowedRoles={['patient']}>
              <ExerciseBriefing />
            </RequireAuth>
          } />

          <Route path="/session/:id" element={
            <RequireAuth allowedRoles={['patient']}>
              <SessionView />
            </RequireAuth>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
