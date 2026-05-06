import { useState, useEffect } from 'react';
import api from '../../services/api';
import { getPhotoUrl } from '../../utils/photoUrl';

function CertificationsEtudiant() {
  const [certifications, setCertifications] = useState([]);
  const [mesInscriptions, setMesInscriptions] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [messageSucces, setMessageSucces] = useState('');

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        const [resCertifs, resInscriptions] = await Promise.all([
          api.get('/certifications'),
          api.get('/my-enrollments'), // ✅ Correction
        ]);
        setCertifications(resCertifs.data);
        const liste = resInscriptions.data.enrollments || resInscriptions.data;
        setMesInscriptions(liste);
      } catch {
        setErreur('Impossible de charger les certifications');
      } finally {
        setChargement(false);
      }
    };
    chargerDonnees();
  }, []);

  const estInscrit = (certifId) =>
    mesInscriptions.some((i) => i.certification_id === certifId);

  const sInscrire = async (certifId) => {
    if (mesInscriptions.length >= 3) {
      setErreur('Vous ne pouvez pas vous inscrire à plus de 3 certifications');
      return;
    }
    try {
      await api.post('/enrollments', { certification_id: certifId });
      const res = await api.get('/my-enrollments'); // ✅ Correction
      const liste = res.data.enrollments || res.data;
      setMesInscriptions(liste);
      setMessageSucces('Inscription réussie !');
      setErreur('');
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
              {certif.photo && (
                <img
                  className="card-photo"
                  src={getPhotoUrl(certif.photo)}
                  alt={certif.titre}
                />
              )}
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
