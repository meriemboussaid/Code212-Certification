import { useState, useEffect } from 'react';
import api from '../../services/api';

// Calcule automatiquement la mention selon le score
const calculerMention = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Bien';
  if (score >= 60) return 'Assez bien';
  if (score >= 50) return 'Passable';
  return 'Insuffisant';
};

function SaisieNotes() {
  const [inscriptions, setInscriptions] = useState([]);
  // notes stocke les valeurs de chaque champ score par enrollment_id
  const [notes, setNotes] = useState({});
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [sauvegardes, setSauvegardes] = useState({});

  useEffect(() => {
    const chargerInscriptions = async () => {
      try {
        const response = await api.get('/enrollments');
        setInscriptions(response.data);
        // Pré-remplir les notes existantes
        const notesExistantes = {};
        response.data.forEach((inscription) => {
          if (inscription.result) {
            notesExistantes[inscription.id] = inscription.result.score;
          }
        });
        setNotes(notesExistantes);
      } catch {
        setErreur('Impossible de charger les inscriptions');
      } finally {
        setChargement(false);
      }
    };
    chargerInscriptions();
  }, []);

  const handleScoreChange = (enrollmentId, valeur) => {
    setNotes((prev) => ({ ...prev, [enrollmentId]: valeur }));
  };

  const handleSauvegarder = async (enrollmentId) => {
    const score = parseInt(notes[enrollmentId], 10);
    if (isNaN(score) || score < 0 || score > 100) {
      setErreur('Le score doit être entre 0 et 100');
      return;
    }
    setErreur('');
    try {
      await api.post('/results', {
        enrollment_id: enrollmentId,
        score,
        mention: calculerMention(score),
        date_resultat: new Date().toISOString().slice(0, 10),
      });
      // Marquer cette ligne comme sauvegardée
      setSauvegardes((prev) => ({ ...prev, [enrollmentId]: true }));
      setTimeout(() => {
        setSauvegardes((prev) => ({ ...prev, [enrollmentId]: false }));
      }, 2000);
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  if (chargement) return <div className="chargement">Chargement...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Saisie des notes</h1>
        <p>Entrez le score (0-100), la mention est calculée automatiquement</p>
      </div>

      {erreur && <div className="alert alert-erreur">{erreur}</div>}

      {inscriptions.length === 0 ? (
        <p>Aucune inscription trouvée.</p>
      ) : (
        <table className="tableau">
          <thead>
            <tr>
              <th>Étudiant</th>
              <th>Certification</th>
              <th>Score (/100)</th>
              <th>Mention (auto)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {inscriptions.map((inscription) => {
              const score = notes[inscription.id];
              const scoreNum = parseInt(score, 10);
              const mention = !isNaN(scoreNum) ? calculerMention(scoreNum) : '—';

              return (
                <tr key={inscription.id}>
                  <td>{inscription.user?.name}</td>
                  <td>{inscription.certification?.titre}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={score ?? ''}
                      onChange={(e) => handleScoreChange(inscription.id, e.target.value)}
                      className="input-score"
                    />
                  </td>
                  <td>{mention}</td>
                  <td>
                    <button
                      className={sauvegardes[inscription.id] ? 'btn-succes' : 'btn-primary'}
                      onClick={() => handleSauvegarder(inscription.id)}
                    >
                      {sauvegardes[inscription.id] ? '✓ Sauvegardé' : 'Sauvegarder'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SaisieNotes;
