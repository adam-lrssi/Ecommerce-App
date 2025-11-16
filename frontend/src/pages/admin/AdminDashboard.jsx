import React from 'react';
import { Package, Truck, Users, Percent } from 'lucide-react';
import { Link } from 'react-router-dom'

// NOTE: Vous pourriez extraire ce layout dans un AdminLayout.jsx 
// si vous avez besoin de Navbar/Footer spécifiques à l'admin.

const AdminDashboard = () => {

    const adminMenuItems = [
        { title: 'Produits', icon: Package, link: '/admin/produits' },
        { title: 'Commandes', icon: Truck, link: '/admin/commandes' },
        { title: 'Utilisateurs', icon: Users, link: '/admin/utilisateurs' },
        { title: 'Promotions', icon: Percent, link: '/admin/promotions' },
    ];

    return (
        <div className="flex min-h-screen mt-44 bg-gray-100">
            
            {/* Menu Latéral Admin */}
            <aside className="w-64 bg-gray-900 text-white p-6 sticky top-0 h-screen">
                <h2 className="text-3xl font-bold mb-10 text-white">Admin Panel</h2>
                <nav>
                    <ul className="space-y-2">
                        {adminMenuItems.map((item) => (
                            <li key={item.title}>
                                <Link 
                                    to={item.link}
                                    className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors gap-3"
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Contenu Principal */}
            <main className="flex-1 p-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de Bord Général</h1>

                {/* Grille des Statistiques/Rapports Rapides */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <StatCard title="Total Produits" value="250" icon={Package} color="bg-blue-500" />
                    <StatCard title="Commandes en Attente" value="12" icon={Truck} color="bg-yellow-500" />
                    <StatCard title="Nouveaux Utilisateurs" value="45" icon={Users} color="bg-green-500" />
                    <StatCard title="CA Mois" value="15 450 €" icon={Percent} color="bg-red-500" />
                </div>
                
                {/* Remplacer par l'Outlet si AdminRoute était le Layout Parent */}
                <p className="text-gray-600">Bienvenue dans l'interface d'administration. Utilisez le menu latéral pour gérer les données.</p>
                
            </main>
        </div>
    );
};

// Composant utilitaire pour les cartes de statistiques
const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`p-6 rounded-xl shadow-lg flex items-center justify-between ${color} text-white`}>
        <div>
            <p className="text-sm font-light uppercase">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <Icon className="w-8 h-8 opacity-70" />
    </div>
);

export default AdminDashboard;