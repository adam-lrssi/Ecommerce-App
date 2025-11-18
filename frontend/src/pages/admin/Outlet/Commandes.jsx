import React, { useState } from 'react';
import { Truck, Filter, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../../components/navbar/AdminSidebar'

// Données de commandes simulées pour l'administration
const mockAdminOrders = [
    { id: 'ORD-12345', client: 'Jean Dupont', date: '18/11/2025', total: 150.00, status: 'En attente', items: 2 },
    { id: 'ORD-98765', client: 'Sophie Martin', date: '17/11/2025', total: 45.99, status: 'Expédié', items: 1 },
    { id: 'ORD-55555', client: 'Pierre Lecroix', date: '16/11/2025', total: 320.50, status: 'En attente', items: 4 },
    { id: 'ORD-22222', client: 'Julie Robert', date: '15/11/2025', total: 80.00, status: 'Annulé', items: 1 },
    { id: 'ORD-77777', client: 'Adam Smith', date: '14/11/2025', total: 199.99, status: 'Livré', items: 3 },
];

function AdminOrdersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'En attente', 'Expédié', etc.

    // 🔑 Logique de Filtrage
    const filteredOrders = mockAdminOrders.filter(order => {
        const searchMatch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.client.toLowerCase().includes(searchTerm.toLowerCase());
        
        const statusMatch = statusFilter === 'all' || order.status === statusFilter;

        return searchMatch && statusMatch;
    });

    // Fonction pour déterminer le style du badge de statut
    const getStatusStyle = (status) => {
        switch (status) {
            case 'En attente':
                return 'bg-red-100 text-red-800';
            case 'Expédié':
                return 'bg-blue-100 text-blue-800';
            case 'Livré':
                return 'bg-green-100 text-green-800';
            case 'Annulé':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg min-h-[80vh]">

            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4 flex items-center gap-3">
                <Truck className="w-6 h-6" /> Gestion des Commandes
            </h2>

            {/* Barre de Recherche et Filtres */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                
                {/* Recherche */}
                <div className="relative w-full md:w-80">
                    <input 
                        type="text"
                        placeholder="Rechercher par Réf. ou Client"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>

                {/* Filtre de Statut */}
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 focus:ring-gray-900 focus:border-gray-900 appearance-none text-gray-900"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="En attente">En attente (Urgent)</option>
                        <option value="Expédié">Expédié</option>
                        <option value="Livré">Livré</option>
                        <option value="Annulé">Annulé</option>
                    </select>
                </div>
            </div>

            {/* Tableau des Commandes */}
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.client}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{order.total.toFixed(2)} €</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {/* Lien vers une page de détail de commande (à créer) */}
                                        <Link 
                                            to={`details/${order.id}`} 
                                            className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end"
                                        >
                                            Voir 
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    Aucune commande ne correspond aux critères de recherche.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Vous pouvez ajouter une pagination ici */}

        </div>
    );
}

export default AdminOrdersPage;