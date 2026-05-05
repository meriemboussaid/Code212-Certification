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
        // 1. Récupérer manuellement le token stocké localement
        const token = localStorage.getItem('token'); 
        
        // 2. Configurer les en-têtes d'autorisation
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // 3. Passer la configuration à la requête des inscriptions
        const [certifs, enrollments] = await Promise.all([
          api.get('/certifications'),
          api.get('/enrollments', config) // 💡 Token injecté ici pour Laravel
        ]);

        const etudiantsUniques = new Set(
          enrollments.data.map((e) => e.user_id)
        ).size;

        setStats({
          totalCertifications: certifs.data.length,
          totalEtudiants: etudiantsUniques,
          totalInscriptions: enrollments.data.length,
        });
      } catch (error) {
        // Affiche l'erreur en console pour vous aider à débugger au besoin
        console.error("Erreur API:", error.response || error);
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
          <span className="stat-label">Certifications</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {chargement ? '...' : stats.totalEtudiants}
          </span>
          <span className="stat-label">Étudiants inscrits</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">
            {chargement ? '...' : stats.totalInscriptions}
          </span>
          <span className="stat-label">Total inscriptions</span>
        </div>
      </div>

      <div className="section">
        <h2>Actions rapides</h2>
        <div className="actions-grid">
          <Link to="/admin/certifications" className="action-card">
            <span className="action-icon">📋</span>
            <h3>Gérer les certifications</h3>
            <p>Créer, modifier, supprimer</p>
          </Link>
          <Link to="/admin/etudiants" className="action-card">
            <span className="action-icon">👥</span>
            <h3>Gérer les étudiants</h3>
            <p>Voir les inscriptions</p>
          </Link>
          <Link to="/admin/notes" className="action-card">
            <span className="action-icon">📝</span>
            <h3>Saisir les notes</h3>
            <p>Entrer les résultats</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
