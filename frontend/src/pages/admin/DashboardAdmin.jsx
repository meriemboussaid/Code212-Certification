import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardAdmin = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [stats, setStats] = useState({ certificationsCount: 0, studentsCount: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token'); 

        // ✅ URL corrigée avec /api/admin/... pour éviter l'erreur 405
        axios.get('http://localhost:8000/api/admin/enrollments', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setEnrollments(response.data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Erreur Axios ligne 19 :", err);
            setError("Impossible de charger les données du tableau de bord.");
            setLoading(false);
        });

        // Optionnel : Si tu as un autre appel pour les compteurs globaux du dashboard
        axios.get('http://localhost:8000/api/dashboard/admin', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            // Ajuste selon ce que renvoie ton AdminController@dashboard
            setStats({
                certificationsCount: response.data.certifications_count || 0,
                studentsCount: response.data.students_count || 0
            });
        })
        .catch(err => console.error("Erreur stats :", err));

    }, []);

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Chargement du tableau de bord...</div>;
    }

    if (error) {
        return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>{error}</div>;
    }

    return (
        <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
            {/* 1. Zone des Cartes/Statistiques visibles sur ta capture d'écran */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', minWidth: '200px', textAlign: 'center' }}>
                    <h3>{stats.certificationsCount}</h3>
                    <p>CERTIFICATIONS</p>
                </div>
                <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', minWidth: '200px', textAlign: 'center' }}>
                    <h3>{stats.studentsCount}</h3>
                    <p>ÉTUDIANTS INSCRITS</p>
                </div>
                <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', minWidth: '200px', textAlign: 'center' }}>
                    <h3>{enrollments.length}</h3>
                    <p>TOTAL INSCRIPTIONS</p>
                </div>
            </div>

            {/* 2. Titre et Tableau de gestion */}
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
