import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRoute() {
    const { currentUser, loading } = useAuth();
    
    // Condition 1: Chargement
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p>Vérification des autorisations...</p>
            </div>
        );
    }

    // Condition 2: Vérification des privilèges
    const isAdmin = currentUser && currentUser.role === 'admin';

    if (isAdmin) {
        // Si c'est un admin, on affiche le contenu de la route enfant
        return <Outlet />;
    } else if (currentUser && !isAdmin) {
        // Si c'est un utilisateur connecté MAIS PAS admin (customer), 
        // on redirige vers l'accueil ou la page de profil.
        return <Navigate to="/" replace />;
    } else {
        // Si personne n'est connecté, on redirige vers la page de connexion.
        // On pourrait aussi rediriger vers /admin/login si vous voulez une page de login dédiée
        return <Navigate to="/compte/connexion" replace />;
    }
}

export default AdminRoute;