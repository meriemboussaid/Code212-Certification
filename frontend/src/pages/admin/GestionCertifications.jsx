import { useState, useCallback, useEffect } from 'react';
import api from '../../services/api';

// État initial du formulaire (utile pour réinitialiser après soumission)
const FORMULAIRE_VIDE = {
  titre: '',
  description: '',
  date_debut: '',
  date_fin: '',
};

function GestionCertifications() {
  const [certifications, setCertifications] = useState([]);
  const [formulaire, setFormulaire] = useState(FORMULAIRE_VIDE);
  // null = mode création, un id = mode modification
  const [modeEdition, setModeEdition] = useState(null);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [messageSucces, setMessageSucces] = useState('');

  const chargerCertifications = useCallback(async () => {
    try {
      const response = await api.get('/certifications');
      setCertifications(response.data);
    } catch {
      setErreur('Impossible de charger les certifications');
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    chargerCertifications();
  }, [chargerCertifications]);

  // Gère le changement de chaque champ du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    // On met à jour seulement le champ modifié, pas tout le formulaire
    setFormulaire((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    try {
      if (modeEdition) {
        // PUT = modification d'une certification existante
        await api.put(`/certifications/${modeEdition}`, formulaire);
        setMessageSucces('Certification modifiée avec succès');
      } else {
        // POST = création d'une nouvelle certification
        await api.post('/certifications', formulaire);
        setMessageSucces('Certification créée avec succès');
      }
      setFormulaire(FORMULAIRE_VIDE);
      setModeEdition(null);
      setAfficherFormulaire(false);
      chargerCertifications();
      setTimeout(() => setMessageSucces(''), 3000);
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleModifier = (certif) => {
    // Pré-remplir le formulaire avec les données existantes
    setFormulaire({
      titre: certif.titre,
      description: certif.description,
      // slice(0,10) pour garder seulement AAAA-MM-JJ (format input date HTML)
      date_debut: certif.date_debut.slice(0, 10),
      date_fin: certif.date_fin.slice(0, 10),
    });
    setModeEdition(certif.id);
    setAfficherFormulaire(true);
  };

  const handleSupprimer = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette certification ?')) return;
    try {
      await api.delete(`/certifications/${id}`);
      chargerCertifications();
    } catch {
      setErreur('Impossible de supprimer cette certification');
    }
  };

  const handleAnnuler = () => {
    setFormulaire(FORMULAIRE_VIDE);
    setModeEdition(null);
    setAfficherFormulaire(false);
    setErreur('');
  };

  if (chargement) return <div className="chargement">Chargement...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gestion des certifications</h1>
        {!afficherFormulaire && (
          <button className="btn-primary" onClick={() => setAfficherFormulaire(true)}>
            + Nouvelle certification
          </button>
        )}
      </div>

      {erreur && <div className="alert alert-erreur">{erreur}</div>}
      {messageSucces && <div className="alert alert-succes">{messageSucces}</div>}

      {/* Formulaire de création/modification */}
      {afficherFormulaire && (
        <div className="formulaire-card">
          <h2>{modeEdition ? 'Modifier la certification' : 'Nouvelle certification'}</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Titre</label>
              <input
                name="titre"
                type="text"
                value={formulaire.titre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formulaire.description}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date de début</label>
                <input
                  name="date_debut"
                  type="date"
                  value={formulaire.date_debut}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date de fin</label>
                <input
                  name="date_fin"
                  type="date"
                  value={formulaire.date_fin}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {modeEdition ? 'Enregistrer' : 'Créer'}
              </button>
              <button type="button" className="btn-secondary" onClick={handleAnnuler}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tableau des certifications */}
      {certifications.length === 0 ? (
        <p>Aucune certification créée pour l'instant.</p>
      ) : (
        <table className="tableau">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Description</th>
              <th>Date début</th>
              <th>Date fin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certifications.map((certif) => (
              <tr key={certif.id}>
                <td>{certif.titre}</td>
                <td>{certif.description}</td>
                <td>{new Date(certif.date_debut).toLocaleDateString('fr-FR')}</td>
                <td>{new Date(certif.date_fin).toLocaleDateString('fr-FR')}</td>
                <td className="td-actions">
                  <button
                    className="btn-modifier"
                    onClick={() => handleModifier(certif)}
                  >
                    Modifier
                  </button>
                  <button
                    className="btn-supprimer"
                    onClick={() => handleSupprimer(certif.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default GestionCertifications;
