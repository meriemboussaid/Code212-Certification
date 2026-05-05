import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const DashboardAdmin = () => {
    const [stats, setStats] = useState({ certifications: 0, etudiants: 0, inscriptions: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/dashboard/admin')
            .then(response => {
                setStats(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Chargement...</div>;
    }

    return (
        <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
            <h2>Tableau de Bord Administrateur</h2>
            <p>Bienvenue dans l'espace admin de Code 212</p>
        </div>
    );
};

export default DashboardAdmin;
