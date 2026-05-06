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

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Pages étudiant */}
            <Route path="/etudiant/dashboard" element={
                <PrivateRoute roleRequis="student">
                  <DashboardEtudiant />
                </PrivateRoute>
              }
            />
            <Route path="/etudiant/certifications" element={
                <PrivateRoute roleRequis="student">
                  <CertificationsEtudiant />
                </PrivateRoute>
              }
            />
            <Route path="/etudiant/profil" element={
                <PrivateRoute roleRequis="student">
                  <Profil />
                </PrivateRoute>
              }
            />

            {/* Pages admin */}
            <Route path="/admin/dashboard" element={
                <PrivateRoute roleRequis="admin">
                  <DashboardAdmin />
                </PrivateRoute>
              }
            />
            <Route path="/admin/certifications" element={
                <PrivateRoute roleRequis="admin">
                  <GestionCertifications />
                </PrivateRoute>
              }
            />
            <Route path="/admin/etudiants" element={
                <PrivateRoute roleRequis="admin">
                  <GestionEtudiants />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
