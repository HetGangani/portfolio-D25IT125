import {NavLink, useNavigate} from "react-router-dom";

function Navbar({ darkMode, setDarkMode }) {

    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
     <nav className="navbar">
        <h2 className="logo">Student Portfolio</h2>

        <ul className="nav-links">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/projects">Projects</NavLink></li>
            <li><NavLink to="/tasks">Tasks</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>           
        </ul>
        
        <div className="nav-actions">
            <button onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            {isLoggedIn && (
                <button onClick={handleLogout}>
                    Logout
                </button>
            )}
        </div>
     </nav>   
    );
}

export default Navbar;