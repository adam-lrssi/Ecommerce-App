import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Facebook, Youtube } from 'lucide-react'

function Footer() {
  return (
    <footer className="w-full px-6 md:px-20 py-16 bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo et copyright */}
          <div className="flex flex-col gap-4 items-center md:items-start">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="w-9 h-9" />
              <p className="text-lg font-semibold text-white">
                Ecommerce
              </p>
            </Link>
            <p className="text-sm text-gray-400">© 2025 Trendlama.</p>
            <p className="text-sm text-gray-400">All rights reserved.</p>
          </div>

          {/* Liens rapides */}
          <div className="flex flex-col gap-4 items-center md:items-start">
            <p className="text-lg text-white font-bold">Liens rapides</p>
            <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
              Homepage
            </Link>
            <Link to="/hommes" className="text-sm text-gray-400 hover:text-white transition-colors">
              Hommes
            </Link>
            <Link to="/femmes" className="text-sm text-gray-400 hover:text-white transition-colors">
              Femmes
            </Link>
            <Link to="/catalogue" className="text-sm text-gray-400 hover:text-white transition-colors">
              Catalogue
            </Link>
          </div>

          {/* A propos */}
          <div className="flex flex-col gap-4 items-center md:items-start">
            <p className="text-lg text-white font-bold">À propos</p>
            <Link to="/politique-confidentialite" className="text-sm text-gray-400 hover:text-white transition-colors">
              Politique de confidentialité
            </Link>
            <Link to="/mentions-legales" className="text-sm text-gray-400 hover:text-white transition-colors">
              Mentions Légales
            </Link>
            <Link to="/cgv" className="text-sm text-gray-400 hover:text-white transition-colors">
              Conditions Générales de Ventes
            </Link>
          </div>

          {/* Aide et réseaux sociaux */}
          <div className="flex flex-col gap-4 items-center md:items-start">
            <p className="text-lg text-white font-bold">Aide</p>
            <Link to="/centre-aide" className="text-sm text-gray-400 hover:text-white transition-colors">
              Centre d'aide
            </Link>
            <Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
              Contact
            </Link>
            <div className="flex gap-4 mt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer