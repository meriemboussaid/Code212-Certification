import axios from 'axios';

// On crée une instance Axios avec l'URL de base du backend Laravel
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur de requête : avant chaque appel API,
// on ajoute automatiquement le token d'authentification dans le header
api.interceptors.request.use((config) => {
  return config;
});

// Intercepteur de réponse : si le serveur répond 401 (non autorisé),
// on supprime le token et on redirige vers /login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
