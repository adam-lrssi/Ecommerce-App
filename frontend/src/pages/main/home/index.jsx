import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Truck, Shield, Star } from 'lucide-react'



function Home() {
  // Produits en vedette
  const featuredProducts = [
    {
      id: 1,
      name: 'T-shirt Premium',
      price: '29.99',
      image: '/products/2g.png',
      category: 'Hommes',
      badge: 'Nouveau'
    },
    {
      id: 2,
      name: 'Robe Élégante',
      price: '79.99',
      image: '/products/4p.png',
      category: 'Femmes',
      badge: 'Tendance'
    },
    {
      id: 3,
      name: 'Sneakers Sport',
      price: '89.99',
      image: '/products/6g.png',
      category: 'Chaussures',
      badge: 'Promo'
    },
    {
      id: 4,
      name: 'Veste en Jean',
      price: '99.99',
      image: '/products/8gr.png',
      category: 'Hommes',
      badge: null
    }
  ]

  // Catégories principales
  const categories = [
    {
      name: 'Hommes',
      image: '/categories/hommes.jpg',
      link: '/hommes'
    },
    {
      name: 'Femmes',
      image: '/categories/femmes.jpg',
      link: '/femmes'
    },
    {
      name: 'Enfants',
      image: '/categories/enfants.jpg',
      link: '/enfants'
    }
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className='relative w-screen h-[600px] overflow-hidden mt-44 px-6'>
        <img 
          src="../../public/featured.png" 
          alt="Show your style"
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 backdrop-brightness-80 backdrop-blur-lg bg-opacity-40 flex items-center justify-center h-full'>
          <div className='text-center text-white px-4'>
            <h1 className='text-5xl md:text-7xl font-bold mb-6'>Show Your Style</h1>
            <p className='text-xl md:text-2xl mb-8'>Découvrez notre nouvelle collection</p>
            <Link 
              to='/categories'
              className='inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors'
            >
              Découvrir maintenant
              <ArrowRight className='w-5 h-5' />
            </Link>
          </div>
        </div>
      </section>

     {/* Bannière promotionnelle */}
      <section className='py-16 px-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-12 text-center text-white'>
            <div className='flex items-center justify-center gap-2 mb-4'>
              <TrendingUp className='w-6 h-6' />
              <span className='text-sm font-semibold uppercase tracking-wider'>Offre spéciale</span>
            </div>
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-white'>-30% sur toute la collection été</h2>
            <p className='text-xl mb-8 text-gray-300'>Profitez de nos soldes d'été maintenant</p>
            <Link 
              to='/soldes'
              className='inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors'
            >
              J'en profite
              <ArrowRight className='w-5 h-5' />
            </Link>
          </div>
        </div>
      </section>

      {/* Catégories principales */}
      <section className='py-16 px-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl text-black font-bold mb-4'>Nos Collections</h2>
            <p className='text-gray-600 text-lg'>Explorez nos catégories</p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {categories.map((category, index) => (
              <Link 
                key={index}
                to={category.link}
                className='group relative h-[600px] overflow-hidden rounded-lg'
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-opacity-30 group-hover:bg-opacity-40 transition-all flex items-end p-6'>
                  <h3 className='text-white text-3xl font-bold'>{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Produits en vedette */}
      <section className='py-16 px-6 bg-gray-50'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center justify-between mb-12'>
            <div>
              <h2 className='text-4xl text-black font-bold mb-2'>Nouveautés</h2>
              <p className='text-gray-600 text-lg'>Les dernières tendances</p>
            </div>
            <Link 
              to='/nouveautes'
              className='hidden md:flex items-center gap-2 text-gray-900 font-semibold hover:gap-4 transition-all'
            >
              Voir tout
              <ArrowRight className='w-5 h-5' />
            </Link>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {featuredProducts.map((product) => (
              <div key={product.id} className='bg-white rounded-lg overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-shadow'>
                <div className='relative overflow-hidden'>
                  {product.badge && (
                    <span className='absolute top-4 left-4 bg-gray-900 text-white px-3 py-1 text-sm font-semibold rounded-full z-10'>
                      {product.badge}
                    </span>
                  )}
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className='w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500'
                  />
                </div>
                <div className='p-4'>
                  <p className='text-sm text-gray-500 mb-1'>{product.category}</p>
                  <h3 className='text-lg text-black font-semibold mb-2'>{product.name}</h3>
                  <p className='text-xl text-gray-700 font-bold'>{product.price}€</p>
                </div>
              </div>
            ))}
          </div>
          <div className='text-center mt-8 md:hidden'>
            <Link 
              to='/nouveautes'
              className='inline-flex items-center gap-2 text-gray-900 font-semibold'
            >
              Voir tout
              <ArrowRight className='w-5 h-5' />
            </Link>
          </div>
        </div>
      </section>

       {/* Avantages */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='flex flex-col items-center text-center'>
              <div className='bg-gray-900 text-white p-4 rounded-full mb-4'>
                <Truck className='w-8 h-8' />
              </div>
              <h3 className='text-xl text-black font-semibold mb-2'>Livraison Gratuite</h3>
              <p className='text-gray-600'>Dès 50€ d'achat</p>
            </div>
            <div className='flex flex-col items-center text-center'>
              <div className='bg-gray-900 text-white p-4 rounded-full mb-4'>
                <Shield className='w-8 h-8' />
              </div>
              <h3 className='text-xl text-black font-semibold mb-2'>Paiement Sécurisé</h3>
              <p className='text-gray-600'>100% sécurisé</p>
            </div>
            <div className='flex flex-col items-center text-center'>
              <div className='bg-gray-900 text-white p-4 rounded-full mb-4'>
                <Star className='w-8 h-8' />
              </div>
              <h3 className='text-xl text-black font-semibold mb-2'>Qualité Premium</h3>
              <p className='text-gray-600'>Produits de qualité</p>
            </div>
          </div>
        </div>
      </section>

      

      {/* Newsletter */}
      <section className='py-16 px-7 bg-gray-50'>
        <div className='max-w-3xl mx-auto text-center'>
          <h2 className='text-3xl text-black md:text-4xl font-bold mb-4'>Restez informé</h2>
          <p className='text-gray-600 text-lg mb-8'>
            Inscrivez-vous à notre newsletter pour recevoir nos dernières offres
          </p>
          <form className='flex flex-col sm:flex-row gap-4 max-w-xl mx-auto'>
            <input 
              type='email'
              placeholder='Votre adresse email'
              className='flex-1 px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:border-gray-900 placeholder:text-black'
            />
            <button 
              type='submit'
              className='bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors'
            >
              S'inscrire
            </button>
          </form>
        </div>
      </section>

    </div>
  )
}

export default Home