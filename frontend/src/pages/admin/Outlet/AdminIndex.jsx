import React from 'react';
// 🔑 IMPORT CORRECTION : Importez les icônes utilisées
import { ArrowUp, ArrowDown, Package, Truck, List } from 'lucide-react';
// NOTE : J'ai ajouté d'autres icônes pour référence (Package, Truck, List)

function AdminIndex() {
  return (
        // 🔑 CORRECTION : Supprimer les classes de layout (main, flex-1, ml-5, p-10, w-full)
        <div className="p-10 pt-0">
            {/* 🔑 GRILLE DES STATISTIQUES (Style Epuré/Cartes) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                
                {/* Carte 1: Ventes Totales (Total Sales) */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-gray-500 text-sm">Total Sales</h4>
                            {/* Menu Kebab (trois points) */}
                            <span className="text-gray-500 cursor-pointer hover:text-gray-900">...</span>
                        </div>
                        
                        {/* Valeur principale */}
                        <p className="text-4xl font-extrabold text-gray-900 mb-1">
                            $350K
                            <span className="text-sm font-semibold text-green-600 ml-3 flex items-center inline-flex">
                                <ArrowUp className='w-4 h-4 mr-1' /> 10.4%
                            </span>
                        </p>
                        <p className="text-xs text-gray-500 mb-6">Previous 7 days ($235)</p>
                    </div>

                    <button className="self-end px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors">
                        Details
                    </button>
                </div>

                {/* Carte 2: Commandes Totales (Total Orders) */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-gray-500 text-sm">Total Orders</h4>
                            <span className="text-gray-500 cursor-pointer hover:text-gray-900">...</span>
                        </div>
                        
                        {/* Valeur principale */}
                        <p className="text-4xl font-extrabold text-gray-900 mb-1">
                            10.7K 
                            <span className="text-sm font-semibold text-green-600 ml-3 flex items-center inline-flex">
                                <ArrowUp className='w-4 h-4 mr-1' /> 14.4%
                            </span>
                        </p>
                        <p className="text-xs text-gray-500 mb-6">Previous 7 days (7.6K)</p>
                    </div>

                    <button className="self-end px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors">
                        Details
                    </button>
                </div>

                {/* Carte 3: En Cours & Annulé (Pending & Canceled) */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-gray-500 text-sm">Pending & Canceled</h4>
                            <span className="text-gray-500 cursor-pointer hover:text-gray-900">...</span>
                        </div>
                        
                        <div className="flex justify-between items-baseline mb-1">
                            {/* Colonne Pending */}
                            <div>
                                <p className="text-2xl font-extrabold text-gray-900">509</p>
                                <p className="text-xs text-gray-500">Pending</p>
                            </div>

                            {/* Colonne Canceled */}
                            <div>
                                <p className="text-2xl font-extrabold text-red-600 text-right">
                                    94
                                    <span className="text-sm font-semibold text-red-600 ml-2 flex items-center inline-flex">
                                        <ArrowDown className='w-4 h-4 mr-1' /> 14.4%
                                    </span>
                                </p>
                                <p className="text-xs text-gray-500 text-right">Canceled</p>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mb-6">Previous 7 days (user 204)</p>
                    </div>

                    <button className="self-end px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors">
                        Details
                    </button>
                </div>

            </div>
        </div>
  )
}

export default AdminIndex