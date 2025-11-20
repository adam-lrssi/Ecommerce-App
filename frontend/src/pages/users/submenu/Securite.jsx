import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, User, Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext'; 

// 🔑 Assurez-vous d'importer les outils Firebase nécessaires
// (Normalement, vous les importeriez depuis votre configuration Firebase)
import { auth, db } from '../../../config/firebase'; 

import { updatePassword, updateEmail } from 'firebase/auth';

import { doc, updateDoc } from 'firebase/firestore'; 

// *** NOTE IMPORTANTE SUR LA SÉCURITÉ ***
// Les fonctions `updatePassword` et `updateEmail` de Firebase exigent que l'utilisateur 
// se soit connecté très récemment (moins de 5 minutes). Si non, elles renvoient une erreur.
// Vous devez implémenter une étape de re-authentification (via un formulaire de mot de passe actuel)
// pour garantir la sécurité avant d'exécuter ces actions. Pour ce template, nous simulons la logique.


function SecurityPage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    // --- États pour les Mises à Jour ---
    
    // 1. Infos Personnelles (Firestore)
    const [personalInfo, setPersonalInfo] = useState({
        firstName: currentUser?.firstName || '',
        lastName: currentUser?.lastName || '',
        phone: currentUser?.phone || '',
    });
    
    // 2. Mot de Passe (Firebase Auth)
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    // 3. Messages d'état
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // --- Gestionnaires de Changements ---

    const handlePersonalInfoChange = (e) => {
        setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    // --- LOGIQUE DE MISE À JOUR FIREBASE/FIRESTORE ---

    // 1. Mettre à jour les informations personnelles (Firestore)
    const handleUpdatePersonalInfo = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const docRef = doc(db, "users", currentUser.uid);
            await updateDoc(docRef, personalInfo); 

            console.log("Mise a jour du profil fait : ", personalInfo);
            setMessage("Informations personnelles mises à jour avec succès !");
            
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la mise à jour des informations.");
        }
    };
    
    // 2. Mettre à jour le Mot de Passe (Firebase Auth)
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            return setError("Le nouveau mot de passe et sa confirmation ne correspondent pas.");
        }
        if (passwordData.newPassword.length < 6) {
            return setError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
        }
        
        // 🔑 Logique Firebase Auth : Remplacer par votre logique `reauthenticateWithCredential` puis `updatePassword`
        try {
            // ÉTAPE 1: Re-authentifier l'utilisateur avec `currentPassword`
            // ÉTAPE 2: Appeler `updatePassword(currentUser, passwordData.newPassword)`

            console.log("Mise à jour Mot de Passe simulée. Nécessite re-auth.");
            setMessage("Mot de passe mis à jour avec succès ! (Simulé)");
            
            // Réinitialiser le formulaire après succès
            setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });

        } catch (err) {
            console.error(err);
            // Gérer l'erreur "auth/requires-recent-login"
            setError("Échec de la mise à jour. Vous devez peut-être vous reconnecter récemment.");
        }
    };


    return (
        <div className="p-6 md:p-10">
            {/* Titre et Bouton Retour */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Lock className="w-6 h-6" /> Paramètres de Sécurité
                </h2>

                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour au Compte
                </button>
            </div>
            
            {/* Messages d'état global */}
            {message && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{message}</div>}
            {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}


            {/* SECTION 1: MISE À JOUR DES INFOS PERSONNELLES (Firestore) */}
            <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-md mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5"/> Mettre à jour mon profil
                </h3>
                
                <form onSubmit={handleUpdatePersonalInfo} className="space-y-4">
                    {/* Prénom */}
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Prénom</label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            value={personalInfo.firstName}
                            onChange={handlePersonalInfoChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                        />
                    </div>
                    {/* Nom */}
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Nom</label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            value={personalInfo.lastName}
                            onChange={handlePersonalInfoChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                        />
                    </div>
                    {/* Téléphone */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            size={10}
                            value={personalInfo.phone}
                            onChange={handlePersonalInfoChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-700 transition-colors"
                    >
                        Enregistrer les modifications
                    </button>
                </form>
            </div>


            {/* SECTION 2: CHANGER MOT DE PASSE (Firebase Auth) */}
            <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-md mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5"/> Changer de Mot de Passe
                </h3>
                
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    
                    {/* Mot de passe actuel (Nécessaire pour la re-authentification) */}
                    <div className="relative">
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Mot de passe actuel</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="currentPassword"
                            id="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500"
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Nouveau Mot de Passe */}
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nouveau Mot de Passe</label>
                        <input
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                            required
                        />
                    </div>
                    {/* Confirmer Nouveau Mot de Passe */}
                    <div>
                        <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirmer le nouveau mot de passe</label>
                        <input
                            type="password"
                            name="confirmNewPassword"
                            id="confirmNewPassword"
                            value={passwordData.confirmNewPassword}
                            onChange={handlePasswordChange}
                            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                        Changer le mot de passe
                    </button>
                </form>
            </div>


            {/* SECTION 3: CHANGER EMAIL (Affichage seulement, la logique est complexe) */}
            <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5"/> Mon Adresse Email
                </h3>
                <p className="text-gray-700 mb-4">
                    Votre adresse actuelle : **{currentUser?.email || 'N/A'}**
                </p>
                
                <p className="text-sm text-gray-500">
                    *Changer votre adresse email nécessite de vous re-authentifier et de confirmer la nouvelle adresse par un lien envoyé par Firebase.*
                </p>

                <button
                    disabled
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-400 cursor-not-allowed"
                >
                    Changer l'Email (à implémenter)
                </button>
            </div>
            
        </div>
    );
}

export default SecurityPage;