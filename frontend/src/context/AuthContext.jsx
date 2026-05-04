import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

// On crée le contexte — c'est le "conteneur" partagé entre tous les composants
const AuthContext = createContext(null);

// AuthProvider est le composant qui enveloppe toute l'app et partage l'état
export function AuthProvider({ children }) {
  // L'utilisateur connecté (null si personne n'est connecté)
  const [user, setUser] = useState(null);
  // true pendant qu'on vérifie si l'utilisateur est déjà connecté
  const [loading, setLoading] = useState(true);

  // Au démarrage de l'app, on vérifie si un token existe déjà dans le navigateur
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Fonction appelée quand l'utilisateur se connecte
  const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    const { token, user: userData } = response.data;
    // On sauvegarde le token et l'utilisateur dans le navigateur (persiste après rechargement)
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  // Fonction appelée quand l'utilisateur s'inscrit
  const register = async (name, email, password, passwordConfirmation) => {
    const response = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    const { token, user: userData } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  // Fonction appelée quand l'utilisateur se déconnecte
  const logout = async () => {
    try {
      await api.post('/logout');
    } catch {
      // même si l'API échoue, on déconnecte quand même côté frontend
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // On partage ces valeurs avec tous les composants enfants
  const value = { user, loading, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé : au lieu d'écrire useContext(AuthContext) partout,
// on écrit simplement useAuth()
export function useAuth() {
  return useContext(AuthContext);
}
