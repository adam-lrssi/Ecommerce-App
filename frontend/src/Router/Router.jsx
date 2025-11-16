import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

// Import des pages 
import Home from '../pages/main/home/index.jsx'

// Authentification pages
import Login from "../pages/auth/login/Login.jsx"
import Register from "../pages/auth/register/Register.jsx";

// Users pages 
import Main from "../pages/users/main.jsx";

function RouterApp() { 
    return(

            <Routes>
                {/* Main pages */}
                <Route path="/" element={<Home />} />

                {/* Auth pages */}
                <Route path="/compte/connexion" element={<Login />} />
                <Route path="/compte/inscription" element={<Register />} />

                {/* Users Pages */}
                <Route path="/compte/:userSlug" element={<Main />}>
                    <Route/>

                </Route>

                
            </Routes>
    )
}

export default RouterApp;