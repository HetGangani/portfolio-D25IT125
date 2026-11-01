import { NavLink, useNavigate } from "react-router-dom";
import { isAdminUser, logoutUser } from "../services/authApi";
import { CheckSquare, LayoutDashboard, FolderGit2, Activity, Mail, Sun, Moon, LogOut, LogIn } from "./Icons";

function Navbar({ darkMode, setDarkMode }) {
    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem("token");
    const isAdmin = isLoggedIn && isAdminUser();

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    return (
        <nav className="saas-navbar-top">
            <div className="saas-brand" onClick={() => navigate("/")} role="button" tabIndex={0}>
                <div className="saas-brand-icon">
                    <CheckSquare size={22} />
                </div>
                <span className="saas-brand-name">TaskFlow</span>
                <span className="saas-badge">SaaS</span>
            </div>

            <ul className="saas-nav-pills">
                <li>
                    <NavLink to="/" end className={({ isActive }) => `saas-nav-pill ${isActive ? "active" : ""}`}>
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/tasks" className={({ isActive }) => `saas-nav-pill ${isActive ? "active" : ""}`}>
                        <CheckSquare size={18} />
                        <span>Tasks</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/projects" className={({ isActive }) => `saas-nav-pill ${isActive ? "active" : ""}`}>
                        <FolderGit2 size={18} />
                        <span>Projects</span>
                    </NavLink>
                </li>
                {isAdmin && (
                    <li>
                        <NavLink to="/cache-monitoring" className={({ isActive }) => `saas-nav-pill saas-pill-admin-link ${isActive ? "active" : ""}`}>
                            <Activity size={18} />
                            <span>Cache Monitor</span>
                        </NavLink>
                    </li>
                )}
                <li>
                    <NavLink to="/contact" className={({ isActive }) => `saas-nav-pill ${isActive ? "active" : ""}`}>
                        <Mail size={18} />
                        <span>Contact</span>
                    </NavLink>
                </li>
            </ul>

            <div className="saas-top-actions">
                <button
                    className="saas-icon-btn"
                    onClick={() => setDarkMode(!darkMode)}
                    title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    type="button"
                >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {isLoggedIn ? (
                    <button className="saas-btn saas-btn-secondary saas-btn-sm" onClick={handleLogout} type="button">
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                ) : (
                    <button className="saas-btn saas-btn-primary saas-btn-sm" onClick={() => navigate("/login")} type="button">
                        <LogIn size={16} />
                        <span>Sign In</span>
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
