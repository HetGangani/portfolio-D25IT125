import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, lazy, Suspense } from 'react';

import AppLayout from './components/AppLayout';
import LoadingFallback from './components/LoadingFallback';

import Home from './pages/Home';
import About from './components/About';
import Skills from './components/Skills';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoutes from './components/ProtectedRoutes';
import AdminRoute from './components/AdminRoute';

// Helper to ensure a minimum fallback duration and avoid loading flicker (Practical 8)
const lazyWithDelay = (importFn, minDelay = 300) => {
    return lazy(() => {
        let timerId = null;
        const delayPromise = new Promise((resolve) => {
            timerId = setTimeout(() => {
                timerId = null;
                resolve();
            }, minDelay);
        });

        return Promise.all([importFn(), delayPromise])
            .then(([moduleExports]) => moduleExports)
            .finally(() => {
                if (timerId) {
                    clearTimeout(timerId);
                    timerId = null;
                }
            });
    });
};

// Lazy-loaded route components with minimum 300 ms fallback duration (Practical 8)
const Projects = lazyWithDelay(() => import('./pages/Projects'), 300);
const Contact = lazyWithDelay(() => import('./pages/Contact'), 300);
const Tasks = lazyWithDelay(() => import('./pages/Tasks'), 300);
const CacheMonitoring = lazyWithDelay(() => import('./pages/CacheMonitoring'), 300);

function App() {
    // Default to clean modern light SaaS theme with dark mode support
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div className={darkMode ? "dark-theme" : "light-theme"}>
            <BrowserRouter>
                <AppLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                    <Suspense fallback={<LoadingFallback />}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/skills" element={<Skills />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            <Route element={<ProtectedRoutes />}>
                                <Route path="/tasks" element={<Tasks />} />
                            </Route>

                            {/* Protected Cache Monitoring Dashboard (Admin Only) */}
                            <Route element={<AdminRoute />}>
                                <Route path="/cache-monitoring" element={<CacheMonitoring />} />
                            </Route>

                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </AppLayout>
            </BrowserRouter>
        </div>
    );
}

export default App;
