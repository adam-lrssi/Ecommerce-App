import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Truck, Search, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Données de commandes simulées pour l'aperçu (Remplacer par une requête Firestore réelle)
const mockOrders = [
    { id: 'ORD-87654', date: '15/10/2025', total: 124.99, status: 'Livré', items: 3 },
    { id: 'ORD-12987', date: '01/11/2025', total: 45.50, status: 'En cours', items: 1 },
    { id: 'ORD-30591', date: '10/11/2025', total: 299.00, status: 'Annulé', items: 2 },
];

function Commande() {
    const { currentUser } = useAuth();
    // En production, vous utiliseriez un hook pour charger les données :
    // const { orders, loading } = useFetchOrders(currentUser.uid); 

    const navigate = useNavigate()
    
    const orders = mockOrders;
    const loading = false; // Simuler le chargement

    // Définition de la route de base pour les liens
    const baseRoute = `/compte/${currentUser?.userSlug}`;

    if (loading) {
        return <div className="p-10 text-center text-gray-600">Chargement de vos commandes...</div>;
    }

    return (
        <div className="p-6 md:p-10">
           {/* 🔑 CONTENEUR FLEX POUR TITRE ET BOUTON */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Truck className="w-6 h-6" /> Mes Commandes
                </h2>

                {/* 🔑 BOUTON DE RETOUR */}
                <button
                    // 🔑 Revient à la page précédente dans l'historique du navigateur
                    onClick={() => navigate(-1)} 
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour au Compte
                </button>
            </div>

            {orders.length === 0 && !loading ? (
                // 🛑 Cas : Aucune commande
                <div className="text-center py-16 bg-gray-50 border border-dashed rounded-lg">
                    <p className="text-xl font-semibold text-gray-700 mb-2">
                        Vous n'avez pas encore passé de commande.
                    </p>
                    <p className="text-gray-500">Commencez vos achats sur notre page d'accueil !</p>
                    <Link to="/" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-700 transition-colors">
                        Aller à la Boutique
                    </Link>
                </div>
            ) : (
                // ✅ Cas : Liste des commandes
                <div className="space-y-4">
                    
                    {/* Barre de recherche/filtres */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative w-full max-w-sm ring-gray-900">
                            <input 
                                type="text"
                                placeholder="Rechercher par référence ou date"
                                className="w-full pl-10 pr-4 py-2 border  border-gray-800 rounded-lg focus:ring-gray-900 focus:border-gray-900"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                    </div>

                    {/* Liste des Commandes */}
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center flex-wrap">
                                
                                {/* Info principale */}
                                <div className="min-w-[150px] mb-2 md:mb-0">
                                    <p className="text-xs text-gray-500">Commande #</p>
                                    <p className="font-semibold text-gray-900">{order.id}</p>
                                </div>
                                
                                {/* Date et Total */}
                                <div className="min-w-[100px] mb-2 md:mb-0">
                                    <p className="text-xs text-gray-500">Date</p>
                                    <p className="text-gray-700">{order.date}</p>
                                </div>
                                <div className="min-w-[100px] mb-2 md:mb-0">
                                    <p className="text-xs text-gray-500">Total ({order.items} articles)</p>
                                    <p className="text-lg font-bold text-gray-900">{order.total.toFixed(2)} €</p>
                                </div>

                                {/* Statut */}
                                <div className="min-w-[100px] mb-2 md:mb-0">
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                        order.status === 'Livré' ? 'bg-green-100 text-green-800' :
                                        order.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>

                                {/* Lien Détail */}
                                <Link 
                                    to={`/compte/${currentUser.userSlug}/commandes/${order.id}`} // Chemin vers une page de détail
                                    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    Détails 
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Commande;