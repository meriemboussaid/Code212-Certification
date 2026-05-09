import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// roleRequis : 'etudiant', 'admin', ou undefined (juste être connecté)
function PrivateRoute({ children, roleRequis }) {
  const { user, loading } = useAuth();

  // On attend que la vérification du token soit terminée
  if (loading) {
    return <div className="chargement">Chargement...</div>;
  }

  // Si pas connecté → rediriger vers /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si un rôle est requis et que l'utilisateur n'a pas ce rôle
  if (roleRequis && user.role !== roleRequis) {
    // Rediriger vers le bon dashboard selon le rôle réel
    const redirection = user.role === 'admin' ? '/admin/dashboard' : '/etudiant/dashboard';
    return <Navigate to={redirection} replace />;
  }

  // Tout est bon : on affiche la page demandée
  return children;
}

export default PrivateRoute;
