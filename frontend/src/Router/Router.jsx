import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

// Import des pages 
import Home from '../pages/main/home/index.jsx'

// Authentification pages
import Login from "../pages/auth/login/Login.jsx"
import Register from "../pages/auth/register/Register.jsx";

// Users pages 
import Main from "../pages/users/main.jsx";
import Commande from '../pages/users/submenu/Commande.jsx'
import AddressesPage from "../pages/users/submenu/Adresses.jsx";
import SecurityPage from '../pages/users/submenu/Securite.jsx';

import CategoryPage from "../pages/main/categories/Categories.jsx";

// import for Admin 
import AdminRoute from "../components/AdminRoute.jsx";
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'

import AdminIndex from '../pages/admin/Outlet/AdminIndex.jsx'
import AdminOrdersPage from "../pages/admin/Outlet/Commandes.jsx";
import AdminUsersPage from "../pages/admin/Outlet/AdminUser.jsx";

import AdminProductsPage from '../pages/admin/Outlet/AdminProducts.jsx';
import AdminAddProductPage from '../pages/admin/Outlet/AdminAddProducts.jsx'

function RouterApp() { 
    return(

            <Routes>
                {/* Main pages */}
                <Route path="/" element={<Home />} />

                {/* Catégories */}
                <Route path='/categories' element={<CategoryPage />} />

                {/* Auth pages */}
                <Route path="/compte/connexion" element={<Login />} />
                <Route path="/compte/inscription" element={<Register />} />

                {/* Users Pages */}
                <Route path="/compte/:userSlug" element={<Main />}>
                    
                    <Route path="commandes" element={<Commande />} />
                    <Route path="adresses" element={<AddressesPage />} />
                    <Route path="securite" element={<SecurityPage />} />

                </Route>


                {/* Admin Routes */}
                <Route path='/compte/admin/:userSlug' element={<AdminDashboard />}>
                    <Route index element={<AdminIndex />}/>

                    <Route path="commandes" element={<AdminOrdersPage />}/>
                    <Route path="utilisateurs" element={<AdminUsersPage />} />

                    <Route path="produits" element={<AdminProductsPage />} />
                    <Route path="produits/ajouter" element={<AdminAddProductPage />} />
                </Route>

                
            </Routes>
    )
}

export default RouterApp;