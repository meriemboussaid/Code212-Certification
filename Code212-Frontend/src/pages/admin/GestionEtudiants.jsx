import { useState, useEffect } from 'react';
import api from '../../services/api';

function GestionEtudiants() {
  const [inscriptions, setInscriptions] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [recherche, setRecherche] = useState('');

  useEffect(() => {
    const chargerInscriptions = async () => {
      try {
        const response = await api.get('/admin/enrollments');
        const liste = response.data.enrollments || response.data;
        
        // CORRECTION 1 : On filtre directement ici pour exclure le "Super Admin" de TOUTE l'application
        // Ainsi, le compteur global affichera le vrai nombre d'étudiants (ex: 1 au lieu de 3)
        const vraisEtudiants = liste.filter(
          (inscription) => inscription.user?.name !== "Super Admin"
        );
        
        setInscriptions(vraisEtudiants);
      } catch {
        setErreur('Impossible de charger les inscriptions');
      } finally {
        setChargement(false);
      }
    };
    chargerInscriptions();
  }, []);

  // Filtrage pour la barre de recherche
  const inscriptionsFiltrees = inscriptions.filter((inscription) => {
    const terme = recherche.toLowerCase();
    return (
      inscription.user?.name?.toLowerCase().includes(terme) ||
      inscription.user?.email?.toLowerCase().includes(terme)
    );
  });

  // CORRECTION 2 : Fonction de sécurité pour éviter le bug "Invalid Date"
  const formaterDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    // Si la date reçue du backend est invalide, on affiche un tiret à la place de l'erreur
    if (isNaN(date.getTime())) {
      return '-';
    }
    return date.toLocaleDateString('fr-FR');
  };

  if (chargement) return <div className="chargement">Chargement...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gestion des etudiants</h1>
        {/* Le compteur affiche maintenant uniquement les vrais étudiants */}
        <p>{inscriptions.length} inscription(s) au total</p>
      </div>

      {erreur && <div className="alert alert-erreur">{erreur}</div>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
      </div>

      {inscriptionsFiltrees.length === 0 ? (
        <p>Aucun etudiant trouve.</p>
      ) : (
        <table className="tableau">
          <thead>
            <tr>
              <th>Etudiant</th>
              <th>Email</th>
              <th>Certification</th>
              <th>Date inscription</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {inscriptionsFiltrees.map((inscription) => (
              <tr key={inscription.id}>
                <td>{inscription.user?.name}</td>
                <td>{inscription.user?.email}</td>
                <td>{inscription.certification?.titre}</td>
                {/* Utilisation de notre fonction de sécurité pour la date */}
                <td>{formaterDate(inscription.date_inscription)}</td>
                <td>
                  <span className={`badge badge-${inscription.statut}`}>
                    {inscription.statut || '-'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default GestionEtudiants;
