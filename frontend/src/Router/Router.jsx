import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

// Import des pages 
import Home from '../pages/main/home/index.jsx'

function RouterApp() { 
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    )
}

export default RouterApp;