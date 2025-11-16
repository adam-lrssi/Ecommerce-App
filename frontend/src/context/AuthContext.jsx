import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";

// Firebase
import { doc, getDoc } from 'firebase/firestore'; 
import { auth, db } from '../config/firebase'; // Assurez-vous que le chemin est correct

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true);

    // 🔑 CONSOLIDE : Gère la connexion, la vérification du rôle et le chargement en une seule fois
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // 1. Récupération du document Firestore pour obtenir le slug/rôle
                    const userDocRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userDocRef); 

                    if (userDoc.exists()) {
                        // 2. Fusionne les données Auth et Firestore (incluant le 'role' et 'userSlug')
                        setCurrentUser({
                            ...user,
                            ...userDoc.data()
                        });
                    } else {
                        // 3. Cas de secours si le doc Firestore manque, mais l'utilisateur est connecté Auth
                        setCurrentUser(user);
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des données Firestore:", error);
                    setCurrentUser(user); // Continuer avec les données Auth de base
                }
            } else {
                // 4. Utilisateur déconnecté
                setCurrentUser(null);
            }
            
            // 5. Débloque l'interface après la vérification initiale
            setLoading(false); 
        });

        // Nettoyage de l'écouteur
        return unsubscribe;
    }, []); // Le tableau de dépendances vide garantit qu'il ne s'exécute qu'une seule fois au montage

    // Fonction de déconnexion
    const logout = () => {
        // Optionnel : ajouter un try/catch ici
        return signOut(auth)
    };

    const value = {
        currentUser,
        loading,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {/* 🔑 RETRAIT DU !loading : L'affichage des enfants est géré par la logique du routeur. 
                 Ce code est correct, mais assurez-vous de NE PAS AVOIR DE DOUBLE ROUTER comme précédemment. */}
            {children} 
        </AuthContext.Provider>
    );
};