import {NavLink} from "react-router-dom";

function Navbar() {
    return (
     <nav className="navbar">
        <h2 className="logo">Student Portfolio</h2>

        <ul className="nav-links">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/projects">Projects</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
        </ul>
     </nav>   
    );
}

export default Navbar;