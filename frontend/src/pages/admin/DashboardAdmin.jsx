import React from 'react';
import { Link } from 'react-router-dom';

const DashboardAdmin = () => {
    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Tableau de bord Administrateur</h1>
                <p>Gestion de la plateforme Code 212</p>
            </div>
            
            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-number">0</span>
                    <span className="stat-label">CERTIFICATIONS</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">0</span>
                    <span className="stat-label">ÉTUDIANTS INSCRITS</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">0</span>
                    <span className="stat-label">TOTAL INSCRIPTIONS</span>
                </div>
            </div>

            <h2>Actions rapides</h2>
            <div className="cards-grid">
                <Link to="/admin/certifications" className="action-card">
                    <h3>Gérer les certifications</h3>
                    <p>Créer, modifier, supprimer</p>
                </Link>
                <Link to="/admin/etudiants" className="action-card">
                    <h3>Gérer les étudiants</h3>
                    <p>Voir les inscriptions</p>
                </Link>
                <Link to="/admin/notes" className="action-card">
                    <h3>Saisir les notes</h3>
                    <p>Entrer les résultats</p>
                </Link>
            </div>
        </div>
    );
};

export default DashboardAdmin;
