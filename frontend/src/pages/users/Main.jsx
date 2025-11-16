import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MapPin, CreditCard, Lock, MessageSquare, Heart } from 'lucide-react';

// Données pour les cartes principales
const accountActions = [
    { title: "Mes Commandes", description: "Suivre, retourner, ou acheter à nouveau des articles.", icon: ShoppingBag, path: "commandes" },
    { title: "Adresses", description: "Mettre à jour vos adresses de livraison et de facturation.", icon: MapPin, path: "adresses" },
    { title: "Moyens de Paiement", description: "Gérer et ajouter des cartes de crédit/débit.", icon: CreditCard, path: "paiements" },
    { title: "Paramètres de Sécurité", description: "Changer votre mot de passe et vos informations de connexion.", icon: Lock, path: "securite" },
    { title: "Messages & Notifications", description: "Voir les messages du service client et les alertes.", icon: MessageSquare, path: "messages" },
    { title: "Liste d'Envies", description: "Consulter vos articles sauvegardés.", icon: Heart, path: "wishlist" },
];

function Main() {
    // NOTE : Pour un aperçu, nous utilisons un slug générique. 
    // En production, vous utiliseriez le 'currentUser.userSlug' de useAuth().
    const userSlug = "apercu-utilisateur"; 
    const baseRoute = `/compte/${userSlug}`;

    return (
        <div className="w-screen min-h-screen bg-gray-50 pt-24 pb-16 px-4 mt-25 md:px-20">
            <div className="max-w-6xl mx-auto">
                <h1 className='text-gray-900 text-3xl text-extrabold mb-10'>
                    Votre compte
                </h1>

                {/* Section 1: GRILLE D'ACTIONS PRINCIPALES (Style Amazon) */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {accountActions.map((item) => (
                        <Link 
                            key={item.title} 
                            to={`${baseRoute}/${item.path}`} 
                            className="flex p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200"
                        >
                            <div className="flex-shrink-0 mr-4">
                                <item.icon className="w-8 h-8 text-gray-900" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Section 2: Commandes Rapides (Aperçu) */}
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
                        Vos Commandes Récentes
                    </h2>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <p className="text-gray-700 font-medium mb-4">
                            Dernière commande passée le 15/10/2025
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600 mb-4 ml-4">
                            <li>Statut: En cours d'acheminement</li>
                            <li>Total: 89.99 €</li>
                            <li>Articles: 2</li>
                        </ul>
                        <Link to={`${baseRoute}/commandes`} className="text-blue-600 hover:underline font-medium">
                            Voir le détail de la commande →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;