import { useState, useEffect } from 'react';
import api from '../../services/api';

function CertificationsEtudiant() {
  const [certifications, setCertifications] = useState([]);
  const [mesInscriptions, setMesInscriptions] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [messageSucces, setMessageSucces] = useState('');

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        // On charge les certifications disponibles ET mes inscriptions en parallèle
        const [resCertifs, resInscriptions] = await Promise.all([
          api.get('/certifications'),
          api.get('/enrollments/my'),
        ]);
        setCertifications(resCertifs.data);
        setMesInscriptions(resInscriptions.data);
      } catch {
        setErreur('Impossible de charger les certifications');
      } finally {
        setChargement(false);
      }
    };
    chargerDonnees();
  }, []);

  // Vérifie si l'étudiant est déjà inscrit à une certification
  const estInscrit = (certifId) =>
    mesInscriptions.some((i) => i.certification_id === certifId);

  const sInscrire = async (certifId) => {
    // Vérification : max 3 inscriptions
    if (mesInscriptions.length >= 3) {
      setErreur('Vous ne pouvez pas vous inscrire à plus de 3 certifications');
      return;
    }

    try {
      await api.post('/enrollments', { certification_id: certifId });
      // Recharger les inscriptions après la nouvelle inscription
      const res = await api.get('/enrollments/my');
      setMesInscriptions(res.data);
      setMessageSucces('Inscription réussie !');
      setErreur('');
      // Le message disparaît après 3 secondes
      setTimeout(() => setMessageSucces(''), 3000);
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  };

  if (chargement) return <div className="chargement">Chargement...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Certifications disponibles</h1>
        <p>Vous pouvez vous inscrire à maximum <strong>3 certifications</strong>
          {' '}({mesInscriptions.length}/3 utilisées)
        </p>
      </div>

      {erreur && <div className="alert alert-erreur">{erreur}</div>}
      {messageSucces && <div className="alert alert-succes">{messageSucces}</div>}

      {certifications.length === 0 ? (
        <p>Aucune certification disponible pour l'instant.</p>
      ) : (
        <div className="cards-grid">
          {certifications.map((certif) => (
            <div key={certif.id} className="card">
              <h3>{certif.titre}</h3>
              <p>{certif.description}</p>
              <div className="card-dates">
                <span>Début : {new Date(certif.date_debut).toLocaleDateString('fr-FR')}</span>
                <span>Fin : {new Date(certif.date_fin).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="card-footer">
                {estInscrit(certif.id) ? (
                  <span className="badge badge-inscrit">Déjà inscrit</span>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={() => sInscrire(certif.id)}
                    disabled={mesInscriptions.length >= 3}
                  >
                    S'inscrire
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CertificationsEtudiant;
