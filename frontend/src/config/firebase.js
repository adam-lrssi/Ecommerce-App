// /frontend/src/config/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// 1. Récupération des variables d'environnement
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
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