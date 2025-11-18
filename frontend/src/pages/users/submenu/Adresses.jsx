import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Plus, DollarSign, Loader2, Edit, Trash2 } from 'lucide-react'; 

// 🔑 Imports Firebase
import { useAuth } from '../../../context/AuthContext'; 
import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    getDocs 
} from 'firebase/firestore'; 
// Assurez-vous d'importer 'db' depuis votre fichier de configuration Firebase
import { db } from '../../../config/firebase'; 

// NOTE IMPORTANTE : La sous-collection utilisée est 'adresse'
const ADDR_COLLECTION_NAME = 'adresse';


function AddressesPage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth(); 

    const [shippingAddresses, setShippingAddresses] = useState([]);
    const [billingAddresses, setBillingAddresses] = useState([]);
    
    // États pour l'UI et le CRUD
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditingId, setIsEditingId] = useState(null); // ID de l'adresse en cours de modification

    const [newAddress, setNewAddress] = useState({ 
        name: '', line1: '', zip: '', city: '', country: 'France', type: 'shipping', isDefault: false
    });

    // 1. FONCTION DE CHARGEMENT DES ADRESSES DE FIRESTORE
    const fetchAddresses = async () => {
        if (!currentUser) return;

        setLoading(true);
        setError('');

        try {
            // Référence à la sous-collection 'adresse'
            const addressesRef = collection(db, `users/${currentUser.uid}/${ADDR_COLLECTION_NAME}`);
            const q = query(addressesRef);
            const querySnapshot = await getDocs(q);

            const fetchedShipping = [];
            const fetchedBilling = [];

            querySnapshot.forEach((doc) => {
                const data = { id: doc.id, ...doc.data() };
                if (data.type === 'shipping') {
                    fetchedShipping.push(data);
                } else if (data.type === 'billing') {
                    fetchedBilling.push(data);
                }
            });

            setShippingAddresses(fetchedShipping);
            setBillingAddresses(fetchedBilling);

            // Si aucune adresse n'est trouvée, afficher le formulaire d'ajout
            if (fetchedShipping.length === 0 && fetchedBilling.length === 0) {
                setShowForm(true);
            } else {
                // Fermer le formulaire si on vient d'ajouter une adresse
                if (showForm && !isEditingId) setShowForm(false);
            }

        } catch (err) {
            console.error("Erreur lors du chargement des adresses:", err);
            setError("Impossible de charger les adresses. Vérifiez les règles de lecture Firestore.");
        } finally {
            setLoading(false);
        }
    };

    // Chargement initial au montage du composant
    useEffect(() => {
        if (currentUser) {
            fetchAddresses();
        } else {
            setLoading(false);
        }
    }, [currentUser]);


    // 🔑 FONCTION CORRIGÉE : Gestionnaire générique de changement de formulaire
    const handleFormChange = (e) => {
        setNewAddress({ 
            ...newAddress, 
            [e.target.name]: e.target.value 
        });
    };

    // 2. FONCTION POUR DÉFINIR PAR DÉFAUT
    const handleSetDefault = async (id, type) => {
        if (!currentUser) return;
        
        const addressesToUpdate = type === 'shipping' ? shippingAddresses : billingAddresses;
        
        try {
            // Logique de mise à jour Firestore pour basculer les isDefault
            const batchUpdates = addressesToUpdate
                .map(addr => {
                    const addrRef = doc(db, `users/${currentUser.uid}/${ADDR_COLLECTION_NAME}`, addr.id);
                    if (addr.id === id) {
                        return updateDoc(addrRef, { isDefault: true });
                    } else if (addr.isDefault) {
                        return updateDoc(addrRef, { isDefault: false });
                    }
                    return Promise.resolve();
                })
                .filter(p => p !== null);

            await Promise.all(batchUpdates);
            fetchAddresses();
            
        } catch (err) {
            console.error("Erreur lors de la mise à jour par défaut:", err);
            setError("Impossible de mettre à jour l'adresse par défaut.");
        }
    };
    
    // 3. FONCTION POUR SUPPRIMER UNE ADRESSE (DELETE)
    const handleDelete = async (id) => {
        if (!currentUser || !window.confirm("Êtes-vous sûr de vouloir supprimer cette adresse ?")) return;

        try {
            const addrRef = doc(db, `users/${currentUser.uid}/${ADDR_COLLECTION_NAME}`, id);
            await deleteDoc(addrRef);
            
            // Si l'adresse supprimée était par défaut, on en met une autre par défaut (logique à développer)

            fetchAddresses();
            
        } catch (err) {
            console.error("Erreur lors de la suppression de l'adresse:", err);
            setError("Impossible de supprimer l'adresse. Vérifiez les règles de suppression Firestore.");
        }
    };

    // 4. FONCTION POUR PRÉ-REMPLIR LE FORMULAIRE (EDIT)
    const handleEdit = (address) => {
        setIsEditingId(address.id);
        // Utilisation du spread pour copier toutes les propriétés de l'adresse dans l'état du formulaire
        setNewAddress({
            name: address.name,
            line1: address.line1,
            zip: address.zip,
            city: address.city,
            country: address.country,
            type: address.type,
            isDefault: address.isDefault,
        });

        setShowForm(true);
    };

    // 5. FONCTION DE SAUVEGARDE (CREATE/UPDATE)
    const handleSaveAddress = async (e) => {
        e.preventDefault();
        if (!currentUser || loading) return;

        setLoading(true);
        setError('');

        try {
            const addressesRef = collection(db, `users/${currentUser.uid}/${ADDR_COLLECTION_NAME}`);
            
            let finalAddressData = { ...newAddress };
            const currentList = newAddress.type === 'shipping' ? shippingAddresses : billingAddresses;
            
            // Logique isDefault
            if (currentList.length === 0 && !isEditingId) {
                 finalAddressData.isDefault = true;
            } else if (isEditingId) {
                 finalAddressData.isDefault = newAddress.isDefault;
            } else {
                 finalAddressData.isDefault = false;
            }
            
            if (isEditingId) {
                // MODE MODIFICATION (UPDATE)
                const addrRef = doc(db, `users/${currentUser.uid}/${ADDR_COLLECTION_NAME}`, isEditingId);
                await updateDoc(addrRef, finalAddressData);
            } else {
                // MODE AJOUT (CREATE)
                await addDoc(addressesRef, finalAddressData);
            }

            // Réinitialisation de l'état
            setIsEditingId(null);
            setNewAddress({ name: '', line1: '', zip: '', city: '', country: 'France', type: 'shipping', isDefault: false });
            setShowForm(false);
            await fetchAddresses(); 

        } catch (err) {
            console.error("Erreur lors de l'ajout/modification de l'adresse:", err);
            setError("Une erreur s'est produite lors de l'enregistrement de l'adresse. Vérifiez les champs et les règles.");
        } finally {
            setLoading(false);
        }
    };
    
    // Rendu du chargement et de l'erreur
    if (loading && shippingAddresses.length === 0 && billingAddresses.length === 0) {
        return (
            <div className="p-10 flex justify-center items-center min-h-[50vh]">
                <Loader2 className="w-6 h-6 animate-spin text-gray-500 mr-2" /> Chargement des adresses...
            </div>
        );
    }

    if (error) {
         return (
            <div className="p-10 text-center bg-red-50 border border-red-300 rounded-lg text-red-700">
                {error}
            </div>
        );
    }
    
    // --- Composant du Formulaire d'Ajout/Modification d'Adresse ---
    const AddressForm = () => (
        <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-md mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                {isEditingId ? 'Modifier l\'Adresse' : 'Ajouter une Nouvelle Adresse'}
            </h3>
            <form onSubmit={handleSaveAddress} className="space-y-4">
                
                {/* Type d'Adresse (Livraison/Facturation) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Type d'Adresse</label>
                    <select 
                        name="type" 
                        value={newAddress.type} 
                        onChange={handleFormChange} 
                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2 shadow-sm"
                    >
                        <option value="shipping">Livraison</option>
                        <option value="billing">Facturation</option>
                    </select>
                </div>
                
                {/* Nom */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nom de l'adresse (Ex: Maison, Travail)</label>
                    <input type="text" name="name" value={newAddress.name} onChange={handleFormChange} required className="mt-1 block w-full border border-gray-300 rounded-lg p-2 shadow-sm" />
                </div>
                {/* Adresse Ligne 1 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Adresse (Ligne 1)</label>
                    <input type="text" name="line1" value={newAddress.line1} onChange={handleFormChange} required className="mt-1 block w-full border border-gray-300 rounded-lg p-2 shadow-sm" />
                </div>
                {/* Ville/Code Postal */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ville</label>
                        <input type="text" name="city" value={newAddress.city} onChange={handleFormChange} required className="mt-1 block w-full border border-gray-300 rounded-lg p-2 shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Code Postal</label>
                        <input type="text" name="zip" value={newAddress.zip} onChange={handleFormChange} required className="mt-1 block w-full border border-gray-300 rounded-lg p-2 shadow-sm" />
                    </div>
                </div>

                <div className="flex space-x-3 pt-2">
                    <button 
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {loading ? 'Sauvegarde en cours...' : (isEditingId ? 'Enregistrer les modifications' : 'Enregistrer l\'adresse')}
                    </button>
                    
                    {/* Bouton Annuler */}
                    <button 
                        type="button" 
                        onClick={() => { setShowForm(false); setIsEditingId(null); }}
                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-100 transition-colors"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
    // ----------------------------------------------------


    return (
        <div className="p-6 md:p-10">
            {/* Titre et Bouton Retour */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <MapPin className="w-6 h-6" /> Gérer mes Adresses
                </h2>

                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour au Compte
                </button>
            </div>
            
            {/* Bouton Ajouter (Visible si le formulaire n'est pas déjà affiché) */}
            {!showForm && (
                <button
                    onClick={() => { setShowForm(true); setIsEditingId(null); }} // Réinitialise l'ID d'édition
                    className="inline-flex items-center px-4 py-2 mb-8 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-700 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une nouvelle adresse
                </button>
            )}

            {/* RENDU CONDITIONNEL DU FORMULAIRE */}
            {showForm && <AddressForm />}


            {/* SECTION 1: ADRESSES DE LIVRAISON */}
            <h3 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-700"/> Adresses de Livraison
            </h3>
            
            <div className="space-y-6 mb-12">
                {shippingAddresses.length === 0 && !showForm ? ( 
                    <div className="p-6 text-center text-gray-500 border border-dashed rounded-lg">
                        Vous n'avez pas encore d'adresse de livraison enregistrée. 
                        <button onClick={() => { setShowForm(true); setIsEditingId(null); }} className="ml-2 text-indigo-600 hover:underline">Ajoutez-en une !</button>
                    </div>
                ) : (
                    shippingAddresses.map((address) => (
                        <div key={address.id} className="bg-white p-6 border border-gray-200 rounded-xl shadow-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-3">
                                        {address.name}
                                        {address.isDefault && (
                                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                Par défaut
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-gray-700">{address.line1}</p>
                                    <p className="text-gray-700">{address.zip} {address.city}</p>
                                    <p className="text-gray-700">{address.country}</p>
                                </div>
                                <div className="flex space-x-4 text-sm font-medium">
                                    <button onClick={() => handleEdit(address)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                        <Edit className="w-4 h-4"/> Modifier
                                    </button>
                                    <button onClick={() => handleDelete(address.id)} className="text-red-600 hover:text-red-800 flex items-center gap-1">
                                        <Trash2 className="w-4 h-4"/> Supprimer
                                    </button>
                                    {!address.isDefault && (
                                        <button onClick={() => handleSetDefault(address.id, 'shipping')} className="text-green-600 hover:text-green-800">
                                            Définir par défaut
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* SECTION 2: ADRESSES DE FACTURATION */}
            <h3 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-700"/> Adresses de Facturation
            </h3>
            
            <div className="space-y-6">
                {billingAddresses.length === 0 ? (
                     <div className="p-6 text-center text-gray-500 border border-dashed rounded-lg">
                        Vous n'avez pas encore d'adresse de facturation enregistrée. 
                        <button onClick={() => { setShowForm(true); setNewAddress(prev => ({...prev, type: 'billing'}))}} className="ml-2 text-indigo-600 hover:underline">Ajoutez-en une !</button>
                    </div>
                ) : (
                    billingAddresses.map((address) => (
                         <div key={address.id} className="bg-white p-6 border border-gray-200 rounded-xl shadow-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-3">
                                        {address.name}
                                        {address.isDefault && (
                                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                Par défaut
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-gray-700">{address.line1}</p>
                                    <p className="text-gray-700">{address.zip} {address.city}</p>
                                    <p className="text-gray-700">{address.country}</p>
                                </div>
                                <div className="flex space-x-4 text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-800">Modifier</button>
                                    <button className="text-red-600 hover:text-red-800">Supprimer</button>
                                    {!address.isDefault && (
                                        <button onClick={() => handleSetDefault(address.id, 'billing')} className="text-green-600 hover:text-green-800">
                                            Définir par défaut
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
        </div>
    );
}

export default AddressesPage;