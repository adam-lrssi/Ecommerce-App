import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, Search, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// 🔑 Imports Firebase
import { collection, getDocs } from 'firebase/firestore'; 
import { db } from '../../../config/firebase';
function AdminProductsPage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // --- 🔑 LOGIQUE DE RÉCUPÉRATION DES PRODUITS (READ) ---
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Référence à la collection 'products'
                const productsCollectionRef = collection(db, 'products');
                const productsSnapshot = await getDocs(productsCollectionRef);
                
                // Mapper les documents pour créer la liste des produits
                const productsList = productsSnapshot.docs.map(doc => ({
                    id: doc.id, // L'ID du document est crucial pour la modification/suppression
                    ...doc.data()
                }));
                
                setProducts(productsList);
            } catch (error) {
                console.error("Erreur lors de la récupération des produits:", error);
                // Gérer l'affichage de l'erreur à l'utilisateur si nécessaire
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);
    
    // --- LOGIQUE DE FILTRAGE PAR NOM/SKU ---
    const filteredProducts = products.filter(product => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        return product.name.toLowerCase().includes(lowerCaseSearch) || 
               product.sku.toLowerCase().includes(lowerCaseSearch);
    });

    // --- LOGIQUE D'ACTION (Simulée) ---
    const handleDelete = (productId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
            // 🔑 Ici, vous implémenterez la logique Firestore pour 'deleteDoc(doc(db, "products", productId))'
            console.log(`Suppression du produit ${productId} simulée.`);
            // Mettre à jour l'état local pour le frontend
            setProducts(products.filter(p => p.id !== productId));
        }
    };
    
    const handleEdit = (productId) => {
        // Rediriger vers la page de modification spécifique (à créer : /produits/modifier/:productId)
        navigate(`modifier/${productId}`);
    };
    // ----------------------------------------


    return (
        <div className="p-6 bg-white rounded-xl shadow-lg min-h-[80vh]">
            {/* Header et Bouton Ajouter */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Package className="w-6 h-6" /> Catalogue Produits ({products.length})
                </h2>
                
                {/* Bouton Ajouter un Produit */}
                <Link
                    to="ajouter" // Chemin relatif à /produits/ajouter
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-600 transition-colors shadow-md"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un Produit
                </Link>
            </div>
            
            {/* Barre de Recherche */}
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-sm">
                    <input 
                        type="text"
                        placeholder="Rechercher par Nom ou SKU"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
            </div>

            {/* Chargement */}
            {loading && (
                <div className="text-center p-10 text-gray-600">
                    Chargement des données du catalogue...
                </div>
            )}
            
            {/* Tableau des Produits */}
            {!loading && (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom du Produit</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {/* Rendu de l'image (petite miniature) */}
                                            <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded-md" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.sku}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{product.price.toFixed(2)} €</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                product.stock <= 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                        
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-3">
                                                <button 
                                                    onClick={() => handleEdit(product.id)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                    title="Modifier"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                        {loading ? "Chargement..." : "Aucun produit trouvé dans le catalogue."}
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

export default AdminProductsPage;