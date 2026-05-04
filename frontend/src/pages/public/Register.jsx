import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');

    if (password !== passwordConfirmation) {
      setErreur('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 8) {
      setErreur('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setChargement(true);
    try {
      await register(name, email, password, passwordConfirmation);
      navigate('/etudiant/dashboard');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        setErreur(Object.values(errors)[0][0]);
      } else {
        setErreur(err.response?.data?.message || "Erreur lors de l'inscription");
      }
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ── Panneau gauche : identité visuelle Code 212 ── */}
      <div className="auth-brand-panel">
        <div className="auth-brand-inner">
          <div className="brand-logo-text">
            <span className="brand-c">C</span>
            <span className="brand-arrow">&lt;&gt;</span>
            <span className="brand-de">DE</span>
            <span className="brand-quote">'</span>
            <span className="brand-212">212</span>
            <span className="brand-end">,</span>
          </div>

          <p className="brand-tagline">
            Rejoignez la communauté Code 212 et boostez votre carrière
          </p>

          <ul className="brand-features">
            <li><span className="feature-dot" />Inscription gratuite</li>
            <li><span className="feature-dot" />Jusqu'à 3 certifications</li>
            <li><span className="feature-dot" />Certificats reconnus</li>
          </ul>
        </div>

        <div className="brand-circle brand-circle-1" />
        <div className="brand-circle brand-circle-2" />
      </div>

      {/* ── Panneau droit : formulaire ── */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <div className="auth-form-header">
            <h1>Créer un compte</h1>
            <p>Remplissez les informations ci-dessous</p>
          </div>

          {erreur && <div className="alert alert-erreur">{erreur}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Nom complet</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Prénom Nom"
                required
              />
            </div>

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
                placeholder="Minimum 8 caractères"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="passwordConfirmation">Confirmer le mot de passe</label>
              <input
                id="passwordConfirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Répéter le mot de passe"
                required
              />
            </div>

            <button type="submit" className="btn-brand" disabled={chargement}>
              {chargement ? 'Inscription...' : "Créer mon compte"}
            </button>
          </form>

          <p className="auth-switch">
            Déjà un compte ?{' '}
            <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </div>

    </div>
  );
}

export default Register;
