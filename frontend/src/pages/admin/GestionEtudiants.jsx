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
        const response = await api.get('/enrollments');
        setInscriptions(response.data);
      } catch {
        setErreur('Impossible de charger les inscriptions');
      } finally {
        setChargement(false);
      }
    };
    chargerInscriptions();
  }, []);

  // Filtrage en temps réel : on cherche dans le nom et l'email de l'étudiant
  const inscriptionsFiltrees = inscriptions.filter((inscription) => {
    const terme = recherche.toLowerCase();
    return (
      inscription.user?.name?.toLowerCase().includes(terme) ||
      inscription.user?.email?.toLowerCase().includes(terme)
    );
  });

  if (chargement) return <div className="chargement">Chargement...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gestion des étudiants</h1>
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
        <p>Aucun étudiant trouvé.</p>
      ) : (
        <table className="tableau">
          <thead>
            <tr>
              <th>Étudiant</th>
              <th>Email</th>
              <th>Certification</th>
              <th>Date inscription</th>
              <th>Statut</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {inscriptionsFiltrees.map((inscription) => (
              <tr key={inscription.id}>
                <td>{inscription.user?.name}</td>
                <td>{inscription.user?.email}</td>
                <td>{inscription.certification?.titre}</td>
                <td>
                  {new Date(inscription.date_inscription).toLocaleDateString('fr-FR')}
                </td>
                <td>
                  <span className={`badge badge-${inscription.statut}`}>
                    {inscription.statut}
                  </span>
                </td>
                <td>
                  {inscription.result
                    ? `${inscription.result.score}/100 — ${inscription.result.mention}`
                    : '—'}
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
