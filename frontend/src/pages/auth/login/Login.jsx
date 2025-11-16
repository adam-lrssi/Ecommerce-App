import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

// Import de Firebase
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Pour mettre à jour la BDD après connexion sociale
import { auth, db, googleProvider, facebookProvider } from '../../../config/firebase'; // Assurez-vous du chemin correct

// Components
import Navbar from '../../../components/navbar/Navbar';
import Footer from '../../../components/footer/Footer';

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('')
    };

    // *** LOGIQUE DE CONNEXION EMAIL/MOT DE PASSE ***
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Connexion de l'utilisateur dans Firebase Auth
            await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            console.log('Connexion réussie');
            navigate('/'); // Rediriger l'utilisateur après la connexion

        } catch (err) {
            console.error('Erreur de connexion:', err);
            // Afficher un message d'erreur clair pour l'utilisateur
            if (err.code === 'auth/invalid-credential') {
                setError('Email ou mot de passe incorrect.');
            } else {
                setError('Échec de la connexion. Veuillez vérifier vos informations.');
            }
        } finally {
            setLoading(false);
        }
    };

    // *** LOGIQUE DE CONNEXION SOCIALE (GOOGLE/FACEBOOK) ***
    const handleSocialLogin = async (provider) => {
        setLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Mettre à jour/créer le document utilisateur dans Firestore si nécessaire
            // Le merge: true est important pour ne pas écraser les données existantes
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                lastLoginAt: new Date(),
            }, { merge: true });

            navigate('/'); // Rediriger l'utilisateur
        } catch (err) {
            console.error('Erreur de connexion sociale:', err);
            // Gérer l'erreur si l'utilisateur annule ou si le compte est désactivé
            setError('Échec de la connexion. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen flex flex-col bg-gray-50">
            <Navbar />

            <div className="flex-1 flex items-center justify-center px-6 py-32 h-screen mt-20">
                <div className="w-full max-w-md">
                    {/* Card de connexion */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Bienvenue
                            </h1>
                            <p className="text-gray-600">
                                Connectez-vous à votre compte
                            </p>
                        </div>

                        {/* Formulaire */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="votre@email.com"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-700"
                                    />
                                </div>
                            </div>

                            {/* Mot de passe */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-700 placeholder:text-gray-700" />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Message d'erreur global */}
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                    <span className="block sm:inline">{error}</span>
                                </div>
                            )}

                            {/* Options */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                                        Se souvenir de moi
                                    </span>
                                </label>
                                <Link
                                    to="/mot-de-passe-oublie"
                                    className="text-sm text-gray-900 hover:text-gray-700 font-medium transition-colors"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>

                            {/* Bouton de connexion */}
                            <button
                                type="submit"
                                className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                                disabled={loading}
                            >
                                {loading ? 'Connexion en cours...' : 'Se connecter'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Ou continuer avec</span>
                            </div>
                        </div>

                        {/* Connexion sociale */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                onClick={() => handleSocialLogin(googleProvider)}
                                disabled={loading}
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700">Google</span>
                            </button>

                            {/* FACEBOOK BOUTON CONNEXION */}
                            {/* <button
                                type="button"
                                className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                onClick={() => handleSocialLogin(facebookProvider)}
                                disabled={loading}
                            >
                                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700">Facebook</span>
                            </button> */}
                        </div>

                        {/* Lien vers inscription */}
                        <p className="text-center text-sm text-gray-600 mt-6">
                            Pas encore de compte ?{' '}
                            <Link
                                to="/compte/inscription"
                                className="text-gray-900 font-semibold hover:text-gray-700 transition-colors"
                            >
                                S'inscrire
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Login