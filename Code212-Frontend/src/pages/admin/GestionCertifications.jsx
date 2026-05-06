import { useState, useCallback, useEffect } from 'react';
import api from '../../services/api';
import { getPhotoUrl } from '../../utils/photoUrl';

const FORMULAIRE_VIDE = {
  titre: '',
  description: '',
  date_debut: '',
  date_fin: '',
};

function GestionCertifications() {
  const [certifications, setCertifications] = useState([]);
  const [formulaire, setFormulaire] = useState(FORMULAIRE_VIDE);
  const [modeEdition, setModeEdition] = useState(null);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [messageSucces, setMessageSucces] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulaire((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    setErreur('');

    if (!file) {
      setPhotoFile(null);
      setPhotoPreview('');
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const envoyerPhotoCertification = async (certificationId) => {
    if (!photoFile) return;

    const data = new FormData();
    data.append('photo', photoFile);

    await api.post(`/certifications/${certificationId}/photo`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');

    try {
      if (modeEdition) {
        await api.put(`/certifications/${modeEdition}`, formulaire);
        await envoyerPhotoCertification(modeEdition);
        setMessageSucces('Certification modifiée avec succès');
      } else {
        const response = await api.post('/certifications', formulaire);
        await envoyerPhotoCertification(response.data.id);
        setMessageSucces('Certification créée avec succès');
      }

      setFormulaire(FORMULAIRE_VIDE);
      setPhotoFile(null);
      setPhotoPreview('');
      setModeEdition(null);
      setAfficherFormulaire(false);
      chargerCertifications();
      setTimeout(() => setMessageSucces(''), 3000);
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleModifier = (certif) => {
    setFormulaire({
      titre: certif.titre,
      description: certif.description,
      date_debut: certif.date_debut.slice(0, 10),
      date_fin: certif.date_fin.slice(0, 10),
    });
    setPhotoFile(null);
    setPhotoPreview(getPhotoUrl(certif.photo));
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
    setPhotoFile(null);
    setPhotoPreview('');
    setModeEdition(null);
    setAfficherFormulaire(false);
    setErreur('');
  };

  const handleNouvelleCertification = () => {
    setFormulaire(FORMULAIRE_VIDE);
    setPhotoFile(null);
    setPhotoPreview('');
    setModeEdition(null);
    setAfficherFormulaire(true);
  };

  if (chargement) return <div className="chargement">Chargement...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gestion des certifications</h1>
        {!afficherFormulaire && (
          <button className="btn-primary" onClick={handleNouvelleCertification}>
            + Nouvelle certification
          </button>
        )}
      </div>

      {erreur && <div className="alert alert-erreur">{erreur}</div>}
      {messageSucces && <div className="alert alert-succes">{messageSucces}</div>}

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
            <div className="form-group">
              <label>Photo de certification</label>
              {photoPreview && (
                <img
                  className="certification-photo-preview"
                  src={photoPreview}
                  alt="Aperçu de la certification"
                />
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/gif"
                onChange={handlePhotoChange}
              />
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

      {certifications.length === 0 ? (
        <p>Aucune certification créée pour l'instant.</p>
      ) : (
        <table className="tableau">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Photo</th>
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
                <td>
                  {certif.photo ? (
                    <img
                      className="certification-photo-thumb"
                      src={getPhotoUrl(certif.photo)}
                      alt={certif.titre}
                    />
                  ) : (
                    <span className="text-muted">Aucune</span>
                  )}
                </td>
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
