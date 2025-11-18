import React, { useState, useEffect } from 'react';
import { Users, Search, ChevronRight } from 'lucide-react';
// 🔑 Imports Firebase : Assurez-vous que le chemin vers votre config/firebase est correct
import { collection, getDocs } from 'firebase/firestore'; 
import { db } from '../../../config/firebase'; 

function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    // 🔑 Récupération des utilisateurs de Firestore au montage du composant
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                // Référence à la collection 'users'
                const usersCollectionRef = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCollectionRef);
                
                // Mapper les documents pour inclure l'ID et les données
                const usersList = usersSnapshot.docs.map(doc => {
                    // Les données du document (firstName, lastName, email, role, etc.)
                    const data = doc.data(); 
                    
                    return {
                        id: doc.id,
                        ...data
                    };
                });
                
                setUsers(usersList);
            } catch (error) {
                console.error("Erreur lors de la récupération des utilisateurs:", error);
                // Vous pouvez ajouter un message d'erreur pour l'utilisateur ici
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // 🔎 Logique de Filtrage et Recherche (s'exécute à chaque changement de filtre/recherche)
    const filteredUsers = users.filter(user => {
        // Recherche par nom complet ou email
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
        const searchMatch = fullName.includes(searchTerm.toLowerCase()) || 
                            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filtrage par rôle
        const roleMatch = roleFilter === 'all' || user.role === roleFilter;

        return searchMatch && roleMatch;
    });

    // Style pour les badges de rôle
    const getRoleStyle = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'user':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Formatter le timestamp d'inscription
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        // Gère les objets Timestamp de Firestore
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000); 
        return date.toLocaleDateString('fr-FR');
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg min-h-[80vh]">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4 flex items-center gap-3">
                <Users className="w-6 h-6" /> Gestion des Utilisateurs
            </h2>

            {/* Barre de Recherche et Filtres */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                
                {/* Recherche */}
                <div className="relative w-full md:w-80">
                    <input 
                        type="text"
                        placeholder="Rechercher par Nom ou Email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>

                {/* Filtre de Rôle */}
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Rôle:</label>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="
                        border border-gray-300 
                        rounded-lg 
                        py-2 pl-3 pr-8 // Padding pour l'espacement et la flèche
                        text-sm 
                        bg-white // Fond blanc
                        shadow-sm 
                        text-gray-800
                        focus:ring-indigo-500 focus:border-indigo-500 // Focus color pour l'accessibilité
                        transition-colors
                        appearance-none
                    "
                    >
                        <option value="all">Tous les rôles</option>
                        <option value="Client">Client</option>
                        <option value="admin">Administrateur</option>
                    </select>
                </div>
            </div>

            {/* Affichage du Chargement */}
            {loading && (
                <div className="text-center p-10 text-gray-600">
                    Chargement des utilisateurs en cours...
                </div>
            )}

            {/* Tableau des Utilisateurs */}
            {!loading && (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom Prénom</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inscrit depuis</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleStyle(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {/* Bouton pour Gérer les détails de l'utilisateur (à créer plus tard) */}
                                            <button className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end">
                                                Gérer 
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        {searchTerm ? "Aucun utilisateur ne correspond à la recherche." : "Aucun utilisateur trouvé."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminUsersPage;