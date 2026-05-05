import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardAdmin = () => {
    // États pour stocker les données, les erreurs et le statut de chargement
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 1. Récupération du token stocké localement
        const token = localStorage.getItem('token'); 

        // 2. Appel de la nouvelle URL de l'API Admin
        axios.get('http://localhost:8000/api/admin/enrollments', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            // Stockage des données reçues du contrôleur Laravel
            setEnrollments(response.data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Erreur Axios :", err);
            setError("Impossible de charger les inscriptions. Vérifiez vos droits d'administrateur.");
            setLoading(false);
        });
    }, []);

    // Affichage pendant le chargement des données
    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Chargement des inscriptions...</div>;
    }

    // Affichage en cas d'erreur (ex: Pas admin ou pas connecté)
    if (error) {
        return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>{error}</div>;
    }

    return (
        <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
            <h2>Tableau de Bord Administrateur</h2>
            <h3>Gestion des Inscriptions ({enrollments.length})</h3>

            {enrollments.length === 0 ? (
                <p>Aucune inscription enregistrée pour le moment.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>ID</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Étudiant</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Email</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Certification</th>
                            <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Date d'inscription</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrollments.map((enrollment) => (
                            <tr key={enrollment.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '12px' }}>{enrollment.id}</td>
                                {/* Adapte les propriétés .name ou .title selon ton modèle de base de données Laravel */}
                                <td style={{ padding: '12px' }}>{enrollment.user?.name || 'N/A'}</td>
                                <td style={{ padding: '12px' }}>{enrollment.user?.email || 'N/A'}</td>
                                <td style={{ padding: '12px' }}>{enrollment.certification?.title || 'N/A'}</td>
                                <td style={{ padding: '12px' }}>
                                    {new Date(enrollment.created_at).toLocaleDateString('fr-FR')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DashboardAdmin;
