import React from 'react';
import { Package, Truck, Users, Percent, ListFilter, CirclePlus, List, Star, CircleUserRound, House, ArrowUp, ArrowDown } from 'lucide-react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext';

import { auth } from '../../config/firebase';

// Components
import AdminSidebar from '../../components/navbar/AdminSidebar';

// NOTE: Vous pourriez extraire ce layout dans un AdminLayout.jsx 
// si vous avez besoin de Navbar/Footer spécifiques à l'admin.

const AdminDashboard = () => {
    

    return (
        <div className="flex min-h-screen w-screen mt-44 bg-gray-100">
            
            {/* Menu Latéral Admin */}
            <AdminSidebar />

            <main className="flex-1 ml-10p-10 p-8"> 
                {/* 🔑 L'Outlet rendra AdminOrdersPage.jsx, AdminProductsPage.jsx, etc. */}
                <Outlet /> 
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