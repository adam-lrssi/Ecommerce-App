import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RouterApp from "./Router/Router"
import { BrowserRouter as Router } from 'react-router-dom';
// Context
import { AuthProvider } from './context/AuthContext'

import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <Navbar />

        <div className="flex-grow">
          <RouterApp />
        </div>

        <Footer />
      </AuthProvider>
    </Router>
  </StrictMode>,
)
