import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";

// Firebase
import { doc, getDoc } from 'firebase/firestore'; 
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Si l'utilisateur est connecté (Auth)
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef); // Récupération du document Firestore

                if (userDoc.exists()) {
                    // 🔑 COMBINAISON : On fusionne l'objet user Auth (uid, email) avec les données Firestore (firstName, userSlug, etc.)
                    setCurrentUser({
                        ...user,
                        ...userDoc.data()
                    });
                } else {
                    // Si l'utilisateur est dans Auth mais pas dans Firestore
                    setCurrentUser(user);
                }
            } else {
                // Utilisateur déconnecté
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [])

    const logout = () => {
        return signOut(auth)
    };

    const value = {
        currentUser,
        loading,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};