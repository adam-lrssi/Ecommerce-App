import React, { useState } from 'react';
import { Package, Plus, DollarSign, Image as ImageIcon, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 🔑 Imports Firebase
import { collection, addDoc } from 'firebase/firestore'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// Assurez-vous d'importer 'db' (Firestore) et 'storage' (Storage) depuis votre fichier de configuration
import { db, storage } from '../../../config/firebase'; 

// Catégories factices
const mockCategories = [
    'Sélectionnez une catégorie', 
    'T-Shirts', 
    'Pantalons', 
    'Accessoires', 
    'Chaussures', 
    'Vêtements d\'extérieur'
];

function AdminAddProductPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: mockCategories[0],
        sku: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };
    
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    // --- LOGIQUE DE SAUVEGARDE (CLÉ) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        if (!imageFile || formData.category === mockCategories[0] || !formData.name.trim()) {
            setError("Veuillez remplir les champs obligatoires (Nom, Catégorie, Image).");
            setLoading(false); 
            return;
        }

        try {
            // 1. TÉLÉCHARGEMENT DE L'IMAGE VERS FIREBASE STORAGE
            const fileName = `${formData.sku || formData.name}-${Date.now()}`;
            // Utilisation d'un chemin simple pour maximiser la compatibilité
            const imageRef = ref(storage, `products/${fileName}`); 
            await uploadBytes(imageRef, imageFile);
            const imageUrl = await getDownloadURL(imageRef);

            // 2. SAUVEGARDE DES DONNÉES DANS FIRESTORE
            const productData = {
                ...formData, 
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock, 10),
                imageUrl: imageUrl,
                createdAt: new Date(),
                isAvailable: true, 
            };

            // Crée la collection 'products' si elle n'existe pas et ajoute le document
            await addDoc(collection(db, 'products'), productData); 

            setMessage("Produit ajouté avec succès ! Redirection en cours...");
            
            // Réinitialisation et redirection
            setFormData({ name: '', description: '', price: '', stock: '', category: mockCategories[0], sku: '' });
            setImageFile(null);
            setTimeout(() => navigate(-1), 1500); 

        } catch (err) {
            console.error("Erreur FATALE lors de l'ajout du produit:", err);
            // Si l'erreur persiste, c'est que les règles de sécurité de Storage ou Firestore bloquent l'écriture.
            setError(`Erreur : Échec de la sauvegarde. Vérifiez les règles de sécurité. Détails: ${err.message}`); 
        } finally {
            setLoading(false); 
        }
    };
    // ----------------------------------------

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg min-h-[80vh]">
            
            {/* Header et Bouton Retour */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Package className="w-6 h-6" /> Ajouter un Nouveau Produit
                </h2>
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    disabled={loading}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à la Liste
                </button>
            </div>
            
            {/* Messages d'état */}
            {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}
            {message && <div className="p-3 mb-4 text-green-700 bg-green-100 rounded-lg">{message}</div>}

            {/* Formulaire Principal */}
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Colonne 1 & 2: Infos Textuelles et Prix/Stock */}
                    <div className="lg:col-span-2 space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Détails du Produit</h3>
                        
                        {/* Nom du Produit */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom du Produit</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description Détaillée</label>
                            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="4" required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                        </div>

                        {/* Prix, Stock, SKU */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Prix (€)</label>
                                <div className="relative mt-1">
                                    <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required className="block w-full border border-gray-300 rounded-lg shadow-sm p-2 pl-8 focus:ring-indigo-500 focus:border-indigo-500" min="0.01" step="0.01" />
                                    <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Initial</label>
                                <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" min="0" />
                            </div>
                            <div>
                                <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU / Référence</label>
                                <input type="text" name="sku" id="sku" value={formData.sku} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                        </div>

                        {/* Catégorie */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Catégorie</label>
                            <select name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none text-gray-900">
                                {mockCategories.map(cat => (
                                    <option key={cat} value={cat} disabled={cat === mockCategories[0]}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Colonne 3: Téléchargement d'Image */}
                    <div className="lg:col-span-1 space-y-4 bg-white p-6 rounded-lg border shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                            <ImageIcon className="w-5 h-5"/> Média
                        </h3>
                        
                        <input type="file" onChange={handleImageChange} required className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                        
                        {/* Aperçu de l'image sélectionnée */}
                        {imageFile && (
                            <div className="mt-4 flex flex-col items-center p-3 border border-gray-300 rounded-lg">
                                <img src={URL.createObjectURL(imageFile)} alt="Aperçu du produit" className="w-32 h-32 object-cover rounded-md mb-2" />
                                <p className="text-xs text-gray-600 truncate w-full text-center">{imageFile.name}</p>
                            </div>
                        )}
                        
                        <p className="text-xs text-gray-500">Formats acceptés : JPG, PNG, WEBP. Taille max : 5MB.</p>
                    </div>
                </div>

                {/* Bouton de Soumission */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 border border-transparent text-lg font-semibold rounded-lg text-white transition-colors flex items-center justify-center gap-3 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Sauvegarde en cours...
                        </>
                    ) : (
                        <>
                            <Plus className="w-5 h-5" /> Ajouter le Produit
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

export default AdminAddProductPage;