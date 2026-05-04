import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      const userData = await login(email, password);
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/etudiant/dashboard');
      }
    } catch (err) {
      setErreur(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ── Panneau gauche : identité visuelle Code 212 ── */}
      <div className="auth-brand-panel">
        <div className="auth-brand-inner">
          {/* Logo textuel avec la typographie de la marque */}
          <div className="brand-logo-text">
            <span className="brand-c">C</span>
            <span className="brand-arrow">&lt;&gt;</span>
            <span className="brand-de">DE</span>
            <span className="brand-quote">'</span>
            <span className="brand-212">212</span>
            <span className="brand-end">,</span>
          </div>

          <p className="brand-tagline">
            Plateforme officielle de certifications professionnelles
          </p>

          {/* Points forts de la plateforme */}
          <ul className="brand-features">
            <li>
              <span className="feature-dot" />
              Inscrivez-vous aux certifications
            </li>
            <li>
              <span className="feature-dot" />
              Suivez votre progression en temps réel
            </li>
            <li>
              <span className="feature-dot" />
              Téléchargez vos certificats
            </li>
          </ul>
        </div>

        {/* Cercles décoratifs en arrière-plan */}
        <div className="brand-circle brand-circle-1" />
        <div className="brand-circle brand-circle-2" />
      </div>

      {/* ── Panneau droit : formulaire ── */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <div className="auth-form-header">
            <h1>Connexion</h1>
            <p>Entrez vos identifiants pour accéder à votre espace</p>
          </div>

          {erreur && <div className="alert alert-erreur">{erreur}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Adresse email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn-brand" disabled={chargement}>
              {chargement ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <p className="auth-switch">
            Pas encore de compte ?{' '}
            <Link to="/register">Créer un compte</Link>
          </p>
        </div>
      </div>

    </div>
  );
}

export default Login;
