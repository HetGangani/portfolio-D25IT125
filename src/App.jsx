import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import NotFound from './pages/NoFound';

function App() {
    const [darkMode, setDarkMode] = useState(true);
    return(
      <div className={darkMode ? "dark-theme" : "light-theme"}>  
        <BrowserRouter>
          <Navbar
              darkMode={darkMode}
              setDarkMode={setDarkMode} 
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;