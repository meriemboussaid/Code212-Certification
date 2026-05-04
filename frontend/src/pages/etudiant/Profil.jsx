import { useAuth } from '../../context/AuthContext';

function Profil() {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Mon profil</h1>
      </div>

      <div className="profil-card">
        {/* Avatar avec initiale du nom */}
        <div className="profil-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

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
        </div>
      </div>
    </div>
  );
}

export default Profil;
