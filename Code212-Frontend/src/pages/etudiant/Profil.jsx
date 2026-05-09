import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { getPhotoUrl } from '../../utils/photoUrl';

function Profil() {
  const { user, updateUser } = useAuth();
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [erreur, setErreur] = useState('');
  const [messageSucces, setMessageSucces] = useState('');
  const [envoiPhoto, setEnvoiPhoto] = useState(false);

  const photoUrl = photoPreview || getPhotoUrl(user?.photo);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    setErreur('');
    setMessageSucces('');

    if (!file) {
      setPhotoFile(null);
      setPhotoPreview('');
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    if (!photoFile) return;

    setErreur('');
    setMessageSucces('');
    setEnvoiPhoto(true);

    try {
      const data = new FormData();
      data.append('photo', photoFile);

      const response = await api.post('/profile/photo', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      updateUser({ photo: response.data.photo });
      setPhotoFile(null);
      setPhotoPreview('');
      setMessageSucces('Photo de profil mise à jour.');
      setTimeout(() => setMessageSucces(''), 3000);
    } catch (err) {
      setErreur(err.response?.data?.message || 'Impossible de mettre à jour la photo');
    } finally {
      setEnvoiPhoto(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Mon profil</h1>
      </div>

      {erreur && <div className="alert alert-erreur">{erreur}</div>}
      {messageSucces && <div className="alert alert-succes">{messageSucces}</div>}

      <div className="profil-card">
        {photoUrl ? (
          <img className="profil-avatar profil-avatar-image" src={photoUrl} alt="Photo de profil" />
        ) : (
          <div className="profil-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="profil-infos">
          <div className="info-row">
            <span className="info-label">Nom complet</span>
            <span className="info-value">{user?.name}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email</span>
            <span className="info-value">{user?.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Rôle</span>
            <span className="info-value">
              <span className="badge badge-etudiant">Étudiant</span>
            </span>
          </div>

          <form onSubmit={handlePhotoSubmit} className="photo-form">
            <div className="form-group">
              <label>Photo de profil</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/gif"
                onChange={handlePhotoChange}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={!photoFile || envoiPhoto}>
              {envoiPhoto ? 'Envoi...' : 'Mettre à jour la photo'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profil;
