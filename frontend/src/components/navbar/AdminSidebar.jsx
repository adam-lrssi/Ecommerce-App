import React from 'react'
import { Package, Truck, Users, Percent, ListFilter, CirclePlus, List, Star, CircleUserRound, House, ArrowUp, ArrowDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext';

function AdminSidebar() {

    const location = useLocation();
    const navigate = useNavigate();

    const { currentUser, logout } = useAuth(); 


      const adminLink = currentUser && currentUser.userSlug
    ? `/compte/admin/${currentUser.userSlug}`
    : '/compte/connexion';

    const adminMainMenuItems = [
        { title: 'Tableau de bord', icon: House, link: adminLink },
        { title: 'Commandes', icon: Truck, link: `${adminLink}/commandes` },
        { title: 'Utilisateurs', icon: Users, link: `${adminLink}/utilisateurs` },
        { title: 'Promotions', icon: Percent, link: `${adminLink}/promotion` },
        { title:'Catégories', icon: ListFilter, link: `${adminLink}/categories`},
    ];

    const adminProductsMenuItems = [
        // Nous créons des sous-routes spécifiques
        { title: "Ajouter Produits", icon: CirclePlus, link: `${adminLink}/produits/ajouter` },
        // La liste principale est sur la route "produits"
        { title: "Liste de produits", icon: List, link: `${adminLink}/produits` },
        { title: "Avis Produits", icon: Star, link: `${adminLink}/produits/avis` }
    ];

    const adminMenuItems = [
        { title: "Administrateur", icon: CircleUserRound, link: `${adminLink}/administrateur` }  
    ];
  return (
    <aside className="w-64 bg-gray-900 text-white p-6 sticky top-0 h-screen">
                <h2 className="text-3xl font-bold mb-10 text-white">Admin Panel</h2>
                <nav>
                    <ul className="space-y-2">
                        <p className='text-gray-500 '>Menu principal</p>
                        {adminMainMenuItems.map((item) => (
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

                    <ul className='space-y-2 mt-5'>
                        <p className='text-gray-500'>Produits</p>
                        {adminProductsMenuItems.map((item) => (
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

                    <ul className='space-y-2 mt-5'>
                        <p className='text-gray-500'>Administrateur</p>
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
)
}

export default AdminSidebar