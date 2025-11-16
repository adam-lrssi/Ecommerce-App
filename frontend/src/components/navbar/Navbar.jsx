import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Import des icônes de Lucide-React
import { Home, ShoppingCart, Bell, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react'; 
import SearchBar from './SearchBar';

// Firebase
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const navigate = useNavigate();

  const { currentUser, logout } = useAuth(); 

  // Détermine si l'utilisateur est admin
  const isAdmin = currentUser && currentUser.role === 'admin'; 

  // 🔑 NOUVELLE FONCTION DE DÉCONNEXION AVEC REDIRECTION
  const handleLogout = async () => {
      try {
          await logout(); // Déconnexion Firebase
          navigate('/'); // Redirection vers l'accueil
      } catch (error) {
          console.error("Erreur lors de la déconnexion:", error);
          // Gérer les erreurs de déconnexion si nécessaire
          navigate('/'); // Rediriger même en cas d'erreur pour vider l'interface
      }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSubmenuToggle = (menu) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  const closeSubmenu = () => {
    setOpenSubmenu(null);
  };

  // Définit le lien de l'icône utilisateur : vers le profil avec slug si connecté, sinon vers la connexion
  const userLink = currentUser && currentUser.userSlug
    ? `/compte/${currentUser.userSlug}`
    : '/compte/connexion'; 

  // Définition des sous-menus
  const submenus = {
    categories: [
      { name: 'Vêtements', link: '/categories/vetements' },
      { name: 'Chaussures', link: '/categories/chaussures' },
      { name: 'Accessoires', link: '/categories/accessoires' },
      { name: 'Sport', link: '/categories/sport' }
    ],
    hommes: [
      { name: 'T-shirts', link: '/hommes/tshirts' },
      { name: 'Pantalons', link: '/hommes/pantalons' },
      { name: 'Vestes', link: '/hommes/vestes' },
      { name: 'Chaussures', link: '/hommes/chaussures' }
    ],
    femmes: [
      { name: 'Robes', link: '/femmes/robes' },
      { name: 'Hauts', link: '/femmes/hauts' },
      { name: 'Pantalons', link: '/femmes/pantalons' },
      { name: 'Chaussures', link: '/femmes/chaussures' }
    ],
    enfants: [
      { name: 'Bébé (0-2 ans)', link: '/enfants/bebe' },
      { name: 'Enfant (3-12 ans)', link: '/enfants/enfant' },
      { name: 'Ado (13-16 ans)', link: '/enfants/ado' },
      { name: 'Jouets', link: '/enfants/jouets' }
    ]
  };

  return (
    <header className='w-full absolute top-0 z-10'> {/* Ajout de z-10 pour s'assurer qu'elle est au-dessus du contenu */}
      {/* Barre de navigation principale */}
      <nav className='w-full flex justify-between items-center px-6 md:px-20 py-4 border-b border-gray-200 bg-white'>
        {/* LEFT - Logo */}
        <Link to='/' className='flex items-center gap-2'>
          <img src="/logo.png" alt="Logo" className='w-16 h-16 md:w-20 md:h-20' />
          <p className='text-gray-800 text-lg font-semibold'>Ecommerce</p>
        </Link>

        {/* Menu Hamburger - visible sur mobile */}
        <button 
          onClick={toggleMenu}
          className='md:hidden text-gray-800 z-50'
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
        </button>

        {/* RIGHT - SearchBar et Icons - caché sur mobile */}
        <div className="hidden md:flex items-center gap-6">
          <SearchBar className="text-black" />
          
          {/* LIEN ADMIN CONDITIONNEL (Desktop) */}
          {isAdmin && (
            <Link to='/compte/admin/:userSlug' className='hover:text-gray-600 transition-colors' title="Tableau de Bord Admin">
              <LayoutDashboard className='text-red-600 w-6 h-6'/>
            </Link>
          )}

          <Link to='/' className='hover:text-gray-100 transition-colors'>
            <Home className='text-gray-800 hover:text-gray-400 transition-colors w-6 h-6'/>
          </Link>
          <Link to='/panier' className='hover:text-gray-600 transition-colors'>
            <ShoppingCart className='text-gray-800 w-6 h-6'/>
          </Link>
          <Link to='/notifications' className='hover:text-gray-600 transition-colors'>
            <Bell className='text-gray-800 w-6 h-6'/>
          </Link>
          <Link to={userLink} className='hover:text-gray-600 transition-colors'>
            <User className='text-gray-800 w-6 h-6'/>
          </Link>

          {/* Bouton de DÉCONNEXION (Desktop) */}
          {currentUser && (
              <button 
                  onClick={handleLogout} // 🔑 Utiliser la nouvelle fonction
                  className='hover:text-red-500 transition-colors'
                  aria-label="Déconnexion"
              >
                  <LogOut className='text-gray-800 w-6 h-6'/>
              </button>
          )}
        </div>
      </nav>

      {/* Barre de liens de navigation - Desktop */}
      <div className="hidden md:block w-full bg-gray-50 border-b border-gray-200">
        <ul className="flex justify-center items-center gap-8 py-3">
          {/* Catégorie avec sous-menu */}
          <li 
            className="relative"
            onMouseEnter={() => handleSubmenuToggle('categories')}
            onMouseLeave={closeSubmenu}
          >
            <Link 
              to="/categories" 
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors block py-2"
            >
              Catégorie
            </Link>
            {openSubmenu === 'categories' && (
              <ul className="absolute top-full left-0 pt-0 bg-white shadow-lg rounded-md py-2 min-w-[200px] z-50">
                {submenus.categories.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.link}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Hommes avec sous-menu */}
          <li 
            className="relative"
            onMouseEnter={() => handleSubmenuToggle('hommes')}
            onMouseLeave={closeSubmenu}
          >
            <Link 
              to="/hommes" 
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors block py-2"
            >
              Hommes
            </Link>
            {openSubmenu === 'hommes' && (
              <ul className="absolute top-full left-0 pt-0 bg-white shadow-lg rounded-md py-2 min-w-[200px] z-50">
                {submenus.hommes.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.link}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Femmes avec sous-menu */}
          <li 
            className="relative"
            onMouseEnter={() => handleSubmenuToggle('femmes')}
            onMouseLeave={closeSubmenu}
          >
            <Link 
              to="/femmes" 
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors block py-2"
            >
              Femmes
            </Link>
            {openSubmenu === 'femmes' && (
              <ul className="absolute top-full left-0 pt-0 bg-white shadow-lg rounded-md py-2 min-w-[200px] z-50">
                {submenus.femmes.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.link}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Enfants avec sous-menu */}
          <li 
            className="relative"
            onMouseEnter={() => handleSubmenuToggle('enfants')}
            onMouseLeave={closeSubmenu}
          >
            <Link 
              to="/enfants" 
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors block py-2"
            >
              Enfants
            </Link>
            {openSubmenu === 'enfants' && (
              <ul className="absolute top-full left-0 pt-0 bg-white shadow-lg rounded-md py-2 min-w-[200px] z-50">
                {submenus.enfants.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.link}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Chaussures sans sous-menu */}
          <li>
            <Link 
              to="/chaussures" 
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Chaussures
            </Link>
          </li>

          {/* Accessoires sans sous-menu */}
          <li>
            <Link 
              to="/accessoires" 
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Accessoires
            </Link>
          </li>
        </ul>
      </div>

      {/* Menu Mobile - s'ouvre quand isMenuOpen est true */}
      <div 
        className={`
          md:hidden fixed top-0 left-0 w-[50vw] h-screen bg-white z-40 
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col pt-24 px-6">
          {/* SearchBar en haut sur mobile */}
          <div className="mb-8">
            <SearchBar className="text-gray-800 w-full" />
          </div>

          {/* Navigation Links */}
          <ul className="flex flex-col gap-6 mb-8">
            <li>
              <Link 
                to="/" 
                onClick={toggleMenu}
                className="text-gray-800 text-xl font-medium hover:text-gray-600 transition-colors block"
              >
                Accueil
              </Link>
            </li>
            <li>
              <Link 
                to="/hommes" 
                onClick={toggleMenu}
                className="text-gray-800 text-xl font-medium hover:text-gray-600 transition-colors block"
              >
                Hommes
              </Link>
            </li>
            <li>
              <Link 
                to="/femmes" 
                onClick={toggleMenu}
                className="text-gray-800 text-xl font-medium hover:text-gray-600 transition-colors block"
              >
                Femmes
              </Link>
            </li>
          </ul>

          {/* Icons en bas */}
          <div className="flex gap-6 pt-6 border-t border-gray-200">
            
            {/* LIEN ADMIN CONDITIONNEL (Mobile) */}
            {isAdmin && (
              <Link 
                to='/compte/admin/:userSlug' 
                onClick={toggleMenu}
                className='hover:text-gray-600 transition-colors'
                title="Tableau de Bord Admin"
              >
                <LayoutDashboard className='text-red-600 w-6 h-6'/>
              </Link>
            )}
            
            <Link 
              to='/' 
              onClick={toggleMenu}
              className='hover:text-gray-600 transition-colors'
            >
              <Home className='text-gray-800 w-6 h-6'/>
            </Link>
            <Link 
              to='/panier' 
              onClick={toggleMenu}
              className='hover:text-gray-600 transition-colors'
            >
              <ShoppingCart className='text-gray-800 w-6 h-6'/>
            </Link>
            <Link 
              to='/notifications' 
              onClick={toggleMenu}
              className='hover:text-gray-600 transition-colors'
            >
              <Bell className='text-gray-800 w-6 h-6'/>
            </Link>
            <Link 
              to={userLink} 
              onClick={toggleMenu}
              className='hover:text-gray-600 transition-colors'
            >
              <User className='text-gray-800 w-6 h-6'/>
            </Link>

            {/* Bouton de DÉCONNEXION (Mobile) */}
            {currentUser && (
              <button 
                onClick={() => { handleLogout(); toggleMenu(); }} // 🔑 Utiliser handleLogout
                className='hover:text-red-500 transition-colors'
                aria-label="Déconnexion"
              >
                <LogOut className='text-gray-800 w-6 h-6'/>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overlay pour fermer le menu en cliquant en dehors */}
      {isMenuOpen && (<div onClick={toggleMenu}
       className="md:hidden fixed inset-0 backdrop-blur-sm z-30" />)}
    </header>
  );
};

export default Navbar;