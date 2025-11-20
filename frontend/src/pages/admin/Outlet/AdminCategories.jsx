import React, { useState, useEffect } from 'react';
import { ListFilter, Plus, Loader2, Trash2, Edit, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 🔑 Imports Firebase
import { 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    deleteDoc, 
    doc, 
    updateDoc, 
    Timestamp 
} from 'firebase/firestore'; 
import { db } from '../../../config/firebase'; 
import { useAuth } from '../../../context/AuthContext';


function AdminCategoriesPage() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [newCategoryName, setNewCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    
    // 🔑 NOUVEL ÉTAT : Pour stocker l'ID du parent sélectionné lors de l'ajout
    const [selectedParentId, setSelectedParentId] = useState(''); 
    
    // États pour la modification en ligne
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');


    // Référence à la collection Firestore
    const categoriesCollectionRef = collection(db, 'categories');

    // --- UTILS : Génération de slug ---
    const slugify = (text) => {
        return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
    };

    // --- 1. LOGIQUE DE LECTURE (READ) ---
    const fetchCategories = async () => {
        setLoading(true);
        setError('');
        try {
            // Charger toutes les catégories
            const querySnapshot = await getDocs(query(categoriesCollectionRef));
            const categoryList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            // Triez les catégories pour l'affichage hiérarchique
            const sortedCategories = categoryList.sort((a, b) => {
                // Tri pour mettre les parents avant les enfants (si possible, améliorez ceci par un tri par nom pour les sous-catégories)
                if (!a.parentId && b.parentId) return -1;
                if (a.parentId && !b.parentId) return 1;
                return a.name.localeCompare(b.name);
            });
            setCategories(sortedCategories);

        } catch (err) {
            console.error("Erreur lors du chargement des catégories:", err);
            setError("Impossible de charger les catégories. Vérifiez les règles de lecture Firestore.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // --- 2. LOGIQUE D'ÉCRITURE (CREATE) ---
    const handleAddCategory = async (e) => {
        e.preventDefault();
        setError('');
        if (!newCategoryName.trim()) return;
        
        setIsSaving(true);
        const name = newCategoryName.trim();

        try {
            await addDoc(categoriesCollectionRef, {
                name: name,
                slug: slugify(name),
                // 🔑 INCLUSION DU parentId
                parentId: selectedParentId || null, 
                createdAt: Timestamp.now(), 
                updatedAt: Timestamp.now(),
            });
            
            setNewCategoryName('');
            setSelectedParentId(''); // Réinitialisation de la sélection du parent
            await fetchCategories(); // Recharger la liste

        } catch (err) {
            console.error("Erreur lors de l'ajout de la catégorie:", err);
            setError(`Échec de la sauvegarde. Détails: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };
    
    // --- 3. LOGIQUE DE MODIFICATION (UPDATE) ---
    const handleUpdateCategory = async (id) => {
        if (!editingName.trim()) {
            return setError("Le nom de la catégorie ne peut pas être vide.");
        }
        
        try {
            const categoryDocRef = doc(db, 'categories', id);
            await updateDoc(categoryDocRef, {
                name: editingName.trim(),
                slug: slugify(editingName),
                updatedAt: Timestamp.now(),
            });
            
            setEditingId(null);
            await fetchCategories(); // Recharger la liste

        } catch (err) {
            console.error("Erreur lors de la modification:", err);
            setError("Échec de la modification.");
        }
    };

    // --- 4. LOGIQUE DE SUPPRESSION (DELETE) ---
    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) return;
        
        try {
            const categoryDocRef = doc(db, 'categories', id);
            await deleteDoc(categoryDocRef);
            
            await fetchCategories();
            
        } catch (err) {
            console.error("Erreur lors de la suppression:", err);
            setError("Échec de la suppression. Veuillez vérifier les clés étrangères si des produits sont liés.");
        }
    };

    // --- UTILS : Catégories de niveau 1 (pour le sélecteur parent) ---
    const parentCategories = categories.filter(cat => !cat.parentId);


    // --- NOUVELLE FONCTION UTILS : Construction de l'Arbre Hiérarchique ---
const buildCategoryTree = (categories) => {
    // 1. Dictionnaire pour un accès rapide aux documents par ID
    const dictionary = categories.reduce((acc, category) => {
        acc[category.id] = { ...category, children: [] };
        return acc;
    }, {});

    const tree = [];

    // 2. Parcourir les catégories et les placer soit comme racine, soit comme enfant
    categories.forEach(category => {
        if (category.parentId && dictionary[category.parentId]) {
            // Si la catégorie a un parent, l'ajouter à la liste 'children' du parent
            dictionary[category.parentId].children.push(dictionary[category.id]);
        } else {
            // Sinon (pas de parent ou parent manquant), c'est une racine (niveau 1)
            tree.push(dictionary[category.id]);
        }
    });

    // 3. Trier les racines pour un affichage propre
    return tree.sort((a, b) => a.name.localeCompare(b.name));
};

    // --- Rendu de la Liste des Catégories ---
    const renderCategoriesList = () => {
        const categoryTree = buildCategoryTree(categories);
    
        // 🔑 FONCTION RÉCURSIVE pour rendre les nœuds de l'arbre
        const renderTreeNodes = (nodes, level = 0) => (
            nodes.map((cat) => (
                <React.Fragment key={cat.id}>
                    {/* Ligne de la Catégorie (Parent ou Enfant) */}
                    <li className={`p-4 flex justify-between items-center border-b border-gray-100 ${level > 0 ? 'bg-gray-100 border-gray-300' : 'bg-white font-bold'}`}>
                        
                        <div className="flex items-center gap-4 flex-1">
                            {/* 🔑 Indentation visuelle (par exemple 20px par niveau) */}
                            <span style={{ marginLeft: `${level * 20}px` }}>
                                {level > 0 && <span className="text-gray-500 mr-2">↳</span>}
                                {editingId === cat.id ? (
                                    <input
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        className="border rounded px-2 py-1 text-lg"
                                    />
                                ) : (
                                    <span className={`text-lg text-gray-900 ${level === 0 ? 'font-extrabold' : 'font-medium'}`}>
                                        {cat.name} 
                                    </span>
                                )}
                            </span>
                        </div>
    
                        {/* Colonne des Slugs et Actions */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                            {/* <span className="text-sm text-gray-500">Nom: {cat.slug}</span> */}
                            
                            {/* Boutons d'Action (Modifier / Supprimer) */}
                            {editingId === cat.id ? (
                                <button
                                    onClick={() => handleUpdateCategory(cat.id)}
                                    className="text-green-600 hover:text-green-800 transition-colors flex items-center"
                                >
                                    <Save className="w-5 h-5 mr-1"/> Sauver
                                </button>
                            ) : (
                                <button
                                    onClick={() => { setEditingId(cat.id); setEditingName(cat.name); }}
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    <Edit className="w-5 h-5"/>
                                </button>
                            )}
                            <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </li>
    
                    {/* 🔑 Appel récursif pour les enfants */}
                    {cat.children && cat.children.length > 0 && (
                        renderTreeNodes(cat.children, level + 1)
                    )}
                </React.Fragment>
            ))
        );
    
        return (
            <ul className="bg-white rounded-lg border shadow-sm">
                {renderTreeNodes(categoryTree)}
            </ul>
        );
    };


    return (
        <div className="p-6 bg-white rounded-xl shadow-lg min-h-[80vh]">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4 flex items-center gap-3">
                <ListFilter className="w-6 h-6" /> Gestion des Catégories
            </h2>

            {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}

            {/* Formulaire d'Ajout (MISE À JOUR) */}
            <form onSubmit={handleAddCategory} className="flex gap-4 mb-10 p-4 border rounded-lg bg-gray-50">
                <div className="flex-1 grid grid-cols-3 gap-4">
                    {/* 1. Sélection du Parent */}
                    <div>
                        <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">Catégorie Parent (Optionnel)</label>
                        <select
                            id="parentId"
                            value={selectedParentId}
                            onChange={(e) => setSelectedParentId(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 appearance-none text-gray-900" 
                            disabled={isSaving}
                        >
                            <option value="">-- Nouvelle Catégorie Principale --</option>
                            {parentCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* 2. Nom de la Catégorie Enfant/Nouveau Nom */}
                    <div className="col-span-2">
                        <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">Nom de la nouvelle catégorie</label>
                        <input
                            type="text"
                            id="categoryName"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Ex: Hauts, Baskets, Soldes"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                            disabled={isSaving}
                        />
                    </div>
                </div>
                
                {/* Bouton Soumettre */}
                <button
                    type="submit"
                    disabled={isSaving || !newCategoryName.trim()}
                    className={`self-end px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white transition-colors flex items-center gap-2 ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Ajouter
                </button>
            </form>

            {/* Liste des Catégories Existantes */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Catégories existantes ({categories.length})</h3>

            {loading ? (
                <div className="text-center p-10"><Loader2 className="w-6 h-6 animate-spin text-gray-500" /> Chargement...</div>
            ) : categories.length === 0 ? (
                <div className="p-6 text-center text-gray-500 border border-dashed rounded-lg">
                    Aucune catégorie n'a été trouvée.
                </div>
            ) : (
                renderCategoriesList()
            )}
        </div>
    );
}

export default AdminCategoriesPage;