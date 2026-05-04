import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/shared/PrivateRoute';
import Navbar from './components/layout/Navbar';

// Pages publiques
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Pages étudiant
import DashboardEtudiant from './pages/etudiant/DashboardEtudiant';
import CertificationsEtudiant from './pages/etudiant/CertificationsEtudiant';
import Profil from './pages/etudiant/Profil';

// Pages admin
import DashboardAdmin from './pages/admin/DashboardAdmin';
import GestionCertifications from './pages/admin/GestionCertifications';
import GestionEtudiants from './pages/admin/GestionEtudiants';
import SaisieNotes from './pages/admin/SaisieNotes';

import './App.css';

function App() {
  return (
    // BrowserRouter active la navigation dans l'application
    <BrowserRouter>
      {/* AuthProvider partage l'état de connexion à toute l'app */}
      <AuthProvider>
        {/* La navbar s'affiche sur toutes les pages (elle se cache si non connecté) */}
        <Navbar />

        <main className="main-content">
          <Routes>
            {/* Redirection de la racine vers /login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Pages publiques (accessibles sans être connecté) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Pages étudiant (réservées aux utilisateurs avec role='etudiant') */}
            <Route
              path="/etudiant/dashboard"
              element={
                <PrivateRoute roleRequis="etudiant">
                  <DashboardEtudiant />
                </PrivateRoute>
              }
            />
            <Route
              path="/etudiant/certifications"
              element={
                <PrivateRoute roleRequis="etudiant">
                  <CertificationsEtudiant />
                </PrivateRoute>
              }
            />
            <Route
              path="/etudiant/profil"
              element={
                <PrivateRoute roleRequis="etudiant">
                  <Profil />
                </PrivateRoute>
              }
            />

            {/* Pages admin (réservées aux utilisateurs avec role='admin') */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute roleRequis="admin">
                  <DashboardAdmin />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/certifications"
              element={
                <PrivateRoute roleRequis="admin">
                  <GestionCertifications />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/etudiants"
              element={
                <PrivateRoute roleRequis="admin">
                  <GestionEtudiants />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/notes"
              element={
                <PrivateRoute roleRequis="admin">
                  <SaisieNotes />
                </PrivateRoute>
              }
            />

            {/* Page 404 : toute URL inconnue → retour au login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
