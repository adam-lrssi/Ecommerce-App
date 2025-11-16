import React, { useState } from 'react';
import { SlidersHorizontal, Grid3x3, List } from 'lucide-react';

// NOTE: Vous aurez besoin d'un hook pour charger les produits ici
// import useProducts from '../hooks/useProducts'; 

const categories = ['T-Shirts', 'Pantalons', 'Vestes', 'Accessoires'];
const availableSizes = ['XS', 'S', 'M', 'L', 'XL'];
const availableColors = ['Rouge', 'Bleu', 'Vert', 'Noir', 'Blanc'];

function CategoryPage({ categoryName = "Vêtements pour Hommes" }) {
  // Simuler l'état des filtres et du tri
  const [filters, setFilters] = useState({});
  const [sortOption, setSortOption] = useState('popularite');
  
  // NOTE: Ici, vous appelleriez votre hook pour charger les données
  // const { products, loading } = useProducts(categoryName, filters, sortOption);
  const products = Array(12).fill(0); // Remplacement pour l'aperçu

  const handleFilterChange = (type, value) => {
      setFilters(prev => ({
          ...prev,
          [type]: value
      }));
  };
  
  // Composant de carte de produit (à créer séparément)
  const ProductCard = ({ index }) => (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="bg-gray-200 h-48 flex items-center justify-center">
              [Image Produit {index + 1}]
          </div>
          <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 truncate">Nom du produit N°{index + 1}</h3>
              <p className="text-gray-500 text-sm">Marque Tendance</p>
              <p className="text-xl font-bold text-gray-900 mt-2">59,99 €</p>
          </div>
      </div>
  );

  // Composant de la barre latérale de filtres
  const FilterSidebar = () => (
      <div className="p-4 bg-white rounded-lg shadow-md top-28 h-fit">
          <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" /> Filtres
          </h3>
          
          {/* Filtre 1: Catégories */}
          <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Sous-Catégories</h4>
              {categories.map(cat => (
                  <div key={cat} className="flex items-center mb-1">
                      <input type="checkbox" id={cat} name="category" value={cat} className="rounded text-gray-900 focus:ring-gray-900" />
                      <label htmlFor={cat} className="ml-2 text-sm text-gray-600">{cat}</label>
                  </div>
              ))}
          </div>

          {/* Filtre 2: Taille */}
          <div className="mb-6 border-t pt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Taille</h4>
              <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => (
                      <button 
                          key={size}
                          onClick={() => handleFilterChange('size', size)}
                          className="px-3 py-1 text-sm border rounded-full hover:bg-gray-100 transition-colors"
                      >
                          {size}
                      </button>
                  ))}
              </div>
          </div>
          
          {/* Filtre 3: Couleur */}
          <div className="mb-6 border-t pt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Couleur</h4>
              <div className="flex flex-wrap gap-3">
                  {availableColors.map(color => (
                      <div 
                          key={color}
                          style={{ backgroundColor: color.toLowerCase() }}
                          title={color}
                          className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                          onClick={() => handleFilterChange('color', color)}
                      />
                  ))}
              </div>
          </div>

          {/* Bouton de réinitialisation des filtres */}
          <button className="w-full text-center text-sm text-gray-600 hover:text-gray-900 mt-4 border-t pt-4">
              Réinitialiser les filtres
          </button>
      </div>
  );

  return (
    <div className="min-h-screen w-screen bg-gray-50 pt-28 pb-16 px-4 md:px-20">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête de la Catégorie */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{categoryName}</h1>
        <p className="text-gray-600 mb-10">
            {products.length} {products.length > 1 ? 'articles trouvés' : 'article trouvé'}
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Colonne de gauche: Filtres (visible sur desktop) */}
          <div className="w-full md:w-64 flex-shrink-0 hidden md:block">
             <FilterSidebar />
          </div>

          {/* Colonne de droite: Résultats */}
          <main className="flex-1">
            
            {/* Barre de Tri */}
            <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="text-sm text-gray-700">
                    Trié par: 
                    <select 
                        value={sortOption} 
                        onChange={(e) => setSortOption(e.target.value)}
                        className="ml-2 border rounded p-1 bg-white"
                    >
                        <option value="popularite">Popularité</option>
                        <option value="prix-asc">Prix (le moins cher)</option>
                        <option value="prix-desc">Prix (le plus cher)</option>
                        <option value="nouveaute">Nouveauté</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <Grid3x3 className="w-6 h-6 text-gray-900 cursor-pointer" title="Vue Grille" />
                    <List className="w-6 h-6 text-gray-400 hover:text-gray-900 cursor-pointer" title="Vue Liste" />
                </div>
            </div>

            {/* Grille des Produits */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((_, index) => (
                    <ProductCard key={index} index={index} />
                ))}
            </div>

            {/* Pagination (Optionnel) */}
            <div className="flex justify-center mt-12">
                <button className="px-4 py-2 mx-1 border rounded-lg bg-gray-900 text-white">1</button>
                <button className="px-4 py-2 mx-1 border rounded-lg text-gray-700 hover:bg-gray-100">2</button>
                <button className="px-4 py-2 mx-1 border rounded-lg text-gray-700 hover:bg-gray-100">Suivant</button>
            </div>
            
          </main>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;