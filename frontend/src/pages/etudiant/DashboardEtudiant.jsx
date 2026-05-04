import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

function DashboardEtudiant() {
  const { user } = useAuth();
  // Mes inscriptions aux certifications
  const [inscriptions, setInscriptions] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  // useEffect s'exécute une seule fois au chargement du composant
  useEffect(() => {
    const chargerInscriptions = async () => {
      try {
        const response = await api.get('/enrollments/my');
        setInscriptions(response.data);
      } catch {
        setErreur('Impossible de charger vos inscriptions');
      } finally {
        setChargement(false);
      }
    };
    chargerInscriptions();
  }, []); // [] = ne s'exécute qu'une fois (au montage du composant)

  // Calcul du nombre d'inscriptions actives
  const inscriptionsActives = inscriptions.filter(
    (i) => i.statut === 'actif' || i.statut === 'inscrit'
  ).length;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Bonjour, {user?.name} !</h1>
        <p>Bienvenue sur votre tableau de bord Code 212</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{inscriptions.length}</span>
          <span className="stat-label">Certifications inscrites</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{inscriptionsActives}</span>
          <span className="stat-label">En cours</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{3 - inscriptions.length}</span>
          <span className="stat-label">Places disponibles</span>
        </div>
      </div>

      {/* Liste des inscriptions récentes */}
      <div className="section">
        <div className="section-header">
          <h2>Mes certifications</h2>
          <Link to="/etudiant/certifications" className="btn-secondary">
            Voir toutes les certifications
          </Link>
        </div>

        {chargement && <p>Chargement...</p>}
        {erreur && <div className="alert alert-erreur">{erreur}</div>}

        {!chargement && inscriptions.length === 0 && (
          <div className="vide-message">
            <p>Vous n'êtes inscrit à aucune certification pour l'instant.</p>
            <Link to="/etudiant/certifications" className="btn-primary">
              Explorer les certifications
            </Link>
          </div>
        )}

        {inscriptions.length > 0 && (
          <div className="cards-grid">
            {inscriptions.map((inscription) => (
              <div key={inscription.id} className="card">
                <h3>{inscription.certification?.titre}</h3>
                <p>{inscription.certification?.description}</p>
                <div className="card-footer">
                  <span className={`badge badge-${inscription.statut}`}>
                    {inscription.statut}
                  </span>
                  <span>
                    Inscrit le {new Date(inscription.date_inscription).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                {/* Afficher le résultat si disponible */}
                {inscription.result && (
                  <div className="result-info">
                    <strong>Note : {inscription.result.score}/100</strong>
                    <span className="mention"> — {inscription.result.mention}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardEtudiant;
