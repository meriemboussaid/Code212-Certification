import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

function DashboardAdmin() {
  const [stats, setStats] = useState({
    totalCertifications: 0,
    totalEtudiants: 0,
    totalInscriptions: 0,
  });
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const chargerStats = async () => {
      try {
        const [certifs, enrollments] = await Promise.all([
          api.get('/certifications'),
          api.get('/enrollments'),
        ]);
        const liste = enrollments.data.enrollments || enrollments.data;
        const etudiantsUniques = new Set(liste.map((e) => e.user_id)).size;
        setStats({
          totalCertifications: certifs.data.length,
          totalEtudiants: etudiantsUniques,
          totalInscriptions: liste.length,
        });
      } catch {
        // stats restent à 0
      } finally {
        setChargement(false);
      }
    };
    chargerStats();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Tableau de bord Administrateur</h1>
        <p>Gestion de la plateforme Code 212</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">
            {chargement ? '...' : stats.totalCertifications}
          </span>
          <span className="stat-label">CERTIFICATIONS</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {chargement ? '...' : stats.totalEtudiants}
          </span>
          <span className="stat-label">ÉTUDIANTS INSCRITS</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {chargement ? '...' : stats.totalInscriptions}
          </span>
          <span className="stat-label">TOTAL INSCRIPTIONS</span>
        </div>
      </div>
      <div className="section">
        <h2>Actions rapides</h2>
        <div className="actions-grid">
          <Link to="/admin/certifications" className="action-card">
            <h3>Gérer les certifications</h3>
            <p>Créer, modifier, supprimer</p>
          </Link>
          <Link to="/admin/etudiants" className="action-card">
            <h3>Gérer les étudiants</h3>
            <p>Voir les inscriptions</p>
          </Link>
          <Link to="/admin/notes" className="action-card">
            <h3>Saisir les notes</h3>
            <p>Entrer les résultats</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
