import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

// Import des pages 
import Home from '../pages/main/home/index.jsx'

// Authentification pages
import Login from "../pages/auth/login/Login.jsx"
import Register from "../pages/auth/register/Register.jsx";

// Users pages 
import Main from "../pages/users/main.jsx";
import Commande from '../pages/users/submenu/Commande.jsx'

import CategoryPage from "../pages/main/categories/Categories.jsx";

// import for Admin 
import AdminRoute from "../components/AdminRoute.jsx";
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import AdminProducts from "../pages/admin/AdminProducts.jsx";

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
                </Route>


                {/* Admin Routes */}
                <Route path='/compte/admin/:userSlug' element={<AdminRoute />}>
                    <Route index element={<AdminDashboard />}/>

                    <Route path="produits" element={<AdminProducts />} />
                    {/* <Route path="commandes" element={<AdminOrdersPage />} />
                    <Route path="utilisateurs" element={<AdminUsersPage />} /> */}
                </Route>

                
            </Routes>
    )
}

export default RouterApp;