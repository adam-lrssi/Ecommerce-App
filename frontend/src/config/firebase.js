// /frontend/src/config/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// 1. Récupération des variables d'environnement
const firebaseConfig = {
  apiKey: "AIzaSyA1-InLWr6Xl27b-qXQJW8s2MZ_ssTMCV8",
  authDomain: "ecommerce-app-1fc3d.firebaseapp.com",
  projectId: "ecommerce-app-1fc3d",
  storageBucket: "ecommerce-app-1fc3d.firebasestorage.app",
  messagingSenderId: "272949065346",
  appId: "1:272949065346:web:c80dd4a7a7c8815fc7e69b"
};

// 2. Initialisation de l'application Firebase
const app = initializeApp(firebaseConfig);

// 3. Initialisation et exportation des services
export const auth = getAuth(app);       // Pour l'authentification
export const db = getFirestore(app);     // Pour la base de données Firestore
export const storage = getStorage(app);  // Pour les images des produits

// Exportation des Providers pour les connexions sociales
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Facultatif: exportation par défaut de l'application si nécessaire
export default app;