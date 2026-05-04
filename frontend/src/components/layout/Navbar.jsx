import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Si personne n'est connecté, on n'affiche pas la navbar
  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* Le point rose après "212" est ajouté via CSS ::after */}
        <Link to={user.role === 'admin' ? '/admin/dashboard' : '/etudiant/dashboard'}>
          Code 212
        </Link>
      </div>

      <ul className="navbar-links">
        {/* Liens pour les étudiants */}
        {user.role === 'etudiant' && (
          <>
            <li><Link to="/etudiant/dashboard">Tableau de bord</Link></li>
            <li><Link to="/etudiant/certifications">Certifications</Link></li>
            <li><Link to="/etudiant/profil">Mon profil</Link></li>
          </>
        )}

        {/* Liens pour les admins */}
        {user.role === 'admin' && (
          <>
            <li><Link to="/admin/dashboard">Tableau de bord</Link></li>
            <li><Link to="/admin/certifications">Certifications</Link></li>
            <li><Link to="/admin/etudiants">Étudiants</Link></li>
            <li><Link to="/admin/notes">Saisir les notes</Link></li>
          </>
        )}
      </ul>

      <div className="navbar-user">
        <span>Bonjour, {user.name}</span>
        <button onClick={handleLogout} className="btn-deconnexion">
          Déconnexion
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
