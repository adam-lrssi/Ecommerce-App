import React, { useState, useEffect } from 'react';
import { Package, Plus, DollarSign, Image as ImageIcon, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 🔑 Imports Firebase
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore'; // setDoc pour garantir l'ID généré
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../config/firebase'; 


function AdminAddProductPage() {
    const navigate = useNavigate();
    
    // --- 1. États pour les données et le chargement ---
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        prix: '',
        stock: '',
        parentCategoryId: '', // ID du parent sélectionné (Niveau 1)
        subCategoryId: '',    // ID de l'enfant sélectionné (Optionnel)
        sku: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    
    // État pour stocker toutes les catégories
    const [allCategories, setAllCategories] = useState([]); 
    const [categoriesLoading, setCategoriesLoading] = useState(true); 

    // --- UTILS : Génération de slug simple ---
    const slugify = (text) => {
        return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
    };


    // --- 2. LOGIQUE DE CHARGEMENT DES CATÉGORIES ---
    useEffect(() => {
        const fetchCategories = async () => {
            setCategoriesLoading(true);
            try {
                const categoriesSnapshot = await getDocs(collection(db, 'categories'));
                const categoryList = categoriesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAllCategories(categoryList);
            } catch (err) {
                console.error("Erreur de chargement des catégories:", err);
                setError("Impossible de charger les catégories.");
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);
    // ----------------------------------------------------


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
        
        // Logique spécifique : Si le parent change, réinitialiser la sous-catégorie
        if (name === 'parentCategoryId') {
            setFormData(prev => ({ 
                ...prev, 
                parentCategoryId: value, 
                subCategoryId: '' // Réinitialiser l'enfant
            }));
        }
    };
    
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    // --- 3. LOGIQUE DE SAUVEGARDE (CLÉ) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        if (!formData.name.trim() || !formData.parentCategoryId) {
            setError("Veuillez remplir le nom et sélectionner une catégorie principale.");
            setLoading(false); 
            return;
        }

        try {
            // 1. PRÉ-GÉNÉRER LA RÉFÉRENCE ET L'ID DU DOCUMENT
            const productsCollectionRef = collection(db, 'products');
            const newProductRef = doc(productsCollectionRef); // Obtient la référence avec un ID unique
            const generatedSKU = 'PROD-' + newProductRef.id.substring(0, 8).toUpperCase(); 
            
            let imageUrl = '';
            
            // 2. TÉLÉCHARGEMENT DE L'IMAGE VERS FIREBASE STORAGE
            if (imageFile) {
                const fileName = `${generatedSKU}-${Date.now()}`;
                const imageRef = ref(storage, `products/${fileName}`); 
                await uploadBytes(imageRef, imageFile);
                imageUrl = await getDownloadURL(imageRef);
            }

            // 3. PRÉPARATION DES DONNÉES FIRESTORE
            const finalCategoryId = formData.subCategoryId || formData.parentCategoryId;
            const finalCategory = allCategories.find(cat => cat.id === finalCategoryId);
            
            const productData = {
                ...formData,
                prix: parseFloat(formData.prix),
                stock: parseInt(formData.stock, 10),
                imageUrl: imageUrl || null, 
                
                // 🔑 LIEN DE LA CATÉGORIE FINALE SAUVEGARDÉE
                category_id: finalCategoryId,
                category_name: finalCategory ? finalCategory.name : 'Non classé',
                
                // 🔑 SKU et ID du document
                sku: generatedSKU,
                id: newProductRef.id, 
                
                createdAt: new Date(),
                isAvailable: true, 
            };

            // 4. SAUVEGARDE DANS FIRESTORE AVEC setDoc (utilise l'ID pré-généré)
            await setDoc(newProductRef, productData); 

            setMessage("Produit ajouté avec succès ! Redirection en cours...");
            
            // Réinitialisation et redirection
            setFormData({ name: '', description: '', prix: '', stock: '', parentCategoryId: '', subCategoryId: '', sku: '' });
            setImageFile(null);
            setTimeout(() => navigate(-1), 1500); 

        } catch (err) {
            console.error("Erreur FATALE lors de l'ajout du produit:", err);
            setError(`Erreur : Échec de la sauvegarde. Détails: ${err.message}`); 
        } finally {
            setLoading(false); 
        }
    };

    // --- 4. LOGIQUE DE FILTRAGE DES CATÉGORIES POUR LE JSX ---
    const parentCategories = allCategories.filter(cat => !cat.parentId);
    const subCategories = allCategories.filter(cat => cat.parentId === formData.parentCategoryId);
    
    
    // Affichage du chargement si les catégories ne sont pas encore chargées
    if (categoriesLoading) {
        return <div className="p-10 text-center"><Loader2 className="w-6 h-6 animate-spin text-gray-500 mx-auto" /> Chargement des catégories...</div>;
    }

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
                                <label htmlFor="prix" className="block text-sm font-medium text-gray-700">Prix (€)</label>
                                <div className="relative mt-1">
                                    <input type="number" name="prix" id="prix" value={formData.prix} onChange={handleChange} required className="block w-full border border-gray-300 rounded-lg shadow-sm p-2 pl-8 focus:ring-indigo-500 focus:border-indigo-500" min="0.01" step="0.01" />
                                    <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Initial</label>
                                <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" min="0" />
                            </div>
                            
                            {/* 🔑 EMPLACEMENT SKU : Désactivé car auto-généré */}
                            <div>
                                <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU / Référence</label>
                                <input type="text" disabled value="Auto-Généré" className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 bg-gray-200 text-gray-600 cursor-not-allowed" />
                            </div>
                        </div>

                        {/* 🔑 SÉLECTION DE CATÉGORIE HIÉRARCHIQUE */}
                        <div className="grid grid-cols-2 gap-4">
                            
                            {/* 1. CATÉGORIE PARENT (Obligatoire) */}
                            <div>
                                <label htmlFor="parentCategoryId" className="block text-sm font-medium text-gray-700">Catégorie Principale</label>
                                <select name="parentCategoryId" id="parentCategoryId" value={formData.parentCategoryId} onChange={handleChange} required className="text-gray-900 appearance-none mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500">
                                    <option value="" disabled>-- Sélectionner un Parent --</option>
                                    {parentCategories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* 2. SOUS-CATÉGORIE (Optionnelle et dépendante du parent) */}
                            <div>
                                <label htmlFor="subCategoryId" className="block text-sm font-medium text-gray-700">Sous-catégorie (Optionnel)</label>
                                <select 
                                    name="subCategoryId" 
                                    id="subCategoryId" 
                                    value={formData.subCategoryId} 
                                    onChange={handleChange} 
                                    disabled={!formData.parentCategoryId || subCategories.length === 0}
                                    className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 appearance-none"
                                >
                                    <option value="">-- Non spécifié --</option>
                                    {subCategories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Colonne 3: Téléchargement d'Image */}
                    <div className="lg:col-span-1 space-y-4 bg-white p-6 rounded-lg border shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
                            <ImageIcon className="w-5 h-5"/> Média (Optionnel)
                        </h3>
                        
                        <input type="file" onChange={handleImageChange} accept="image/png, image/jpeg, image/webp" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                        
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
    )
}

export default AdminAddProductPage;