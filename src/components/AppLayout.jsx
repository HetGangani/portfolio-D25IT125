import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { isAdminUser, getUserRole, logoutUser } from "../services/authApi";
import {
    LayoutDashboard,
    CheckSquare,
    FolderGit2,
    Activity,
    Mail,
    User,
    Shield,
    LogOut,
    LogIn,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Sun,
    Moon
} from "./Icons";

function AppLayout({ children, darkMode, setDarkMode }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const isLoggedIn = !!localStorage.getItem("token");
    const isAdmin = isLoggedIn && isAdminUser();
    const userRole = getUserRole();

    // Extract user email or username from decoded token if present
    const getUserDisplay = () => {
        const token = localStorage.getItem("token");
        if (!token) return { name: "Guest User", initial: "G", role: "guest" };
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const email = payload.email || (payload.id ? `user_${payload.id.slice(-4)}` : "Member");
            return {
                name: email,
                initial: email.charAt(0).toUpperCase(),
                role: payload.role || "user"
            };
        } catch {
            return { name: "Authorized User", initial: "U", role: userRole || "user" };
        }
    };

    const userInfo = getUserDisplay();
    const closeMobile = () => setMobileOpen(false);

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    // Determine current section for breadcrumb
    const getPageTitle = () => {
        const path = location.pathname;
        if (path === "/") return { title: "Dashboard", category: "Workspace" };
        if (path.startsWith("/tasks")) return { title: "Tasks", category: "Management" };
        if (path.startsWith("/cache-monitoring")) return { title: "Cache Telemetry", category: "Operations" };
        if (path.startsWith("/projects")) return { title: "GitHub Repositories", category: "Portfolio" };
        if (path.startsWith("/contact")) return { title: "Contact", category: "Connect" };
        if (path.startsWith("/about")) return { title: "About Me", category: "Profile" };
        if (path.startsWith("/skills")) return { title: "Technical Skills", category: "Profile" };
        if (path.startsWith("/login")) return { title: "Sign In", category: "Authentication" };
        if (path.startsWith("/register")) return { title: "Create Account", category: "Authentication" };
        return { title: "Page", category: "Workspace" };
    };

    const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

    // If on authentication pages, render clean focused layout without sidebar
    if (isAuthPage) {
        return (
            <div className="saas-auth-shell">
                <header className="saas-auth-header">
                    <div className="saas-brand" onClick={() => navigate("/")} role="button" tabIndex={0}>
                        <div className="saas-brand-icon">
                            <CheckSquare size={22} />
                        </div>
                        <span className="saas-brand-name">TaskFlow</span>
                        <span className="saas-badge">SaaS</span>
                    </div>

                    <div className="saas-auth-actions">
                        <button
                            className="saas-icon-btn"
                            onClick={() => setDarkMode(!darkMode)}
                            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            type="button"
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>
                </header>

                <main className="saas-auth-main">
                    {children}
                </main>
            </div>
        );
    }

    const { title, category } = getPageTitle();

    return (
        <div className={`saas-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
            {/* Mobile Backdrop Overlay */}
            {mobileOpen && (
                <div
                    className="saas-mobile-backdrop"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Application Sidebar */}
            <aside className={`saas-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
                {/* Brand Header */}
                <div className="saas-sidebar-header">
                    <div className="saas-brand" onClick={() => navigate("/")} role="button" tabIndex={0}>
                        <div className="saas-brand-icon">
                            <CheckSquare size={22} />
                        </div>
                        {!sidebarCollapsed && (
                            <div className="saas-brand-text">
                                <span className="saas-brand-name">TaskFlow</span>
                                <span className="saas-badge">Pro</span>
                            </div>
                        )}
                    </div>

                    {/* Desktop Collapse Button */}
                    <button
                        className="saas-collapse-toggle desktop-only"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        type="button"
                        aria-label="Toggle sidebar collapse"
                    >
                        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>

                    {/* Mobile Close Button */}
                    <button
                        className="saas-mobile-close mobile-only"
                        onClick={closeMobile}
                        type="button"
                        aria-label="Close mobile navigation"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Sections */}
                <nav className="saas-sidebar-nav">
                    <div className="saas-nav-group">
                        {!sidebarCollapsed && <span className="saas-nav-heading">Platform</span>}

                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) => `saas-nav-item ${isActive ? "active" : ""}`}
                            title="Dashboard"
                            onClick={closeMobile}
                        >
                            <LayoutDashboard size={20} className="nav-icon" />
                            {!sidebarCollapsed && <span className="nav-label">Dashboard</span>}
                        </NavLink>

                        <NavLink
                            to="/tasks"
                            className={({ isActive }) => `saas-nav-item ${isActive ? "active" : ""}`}
                            title="Tasks Management"
                            onClick={closeMobile}
                        >
                            <CheckSquare size={20} className="nav-icon" />
                            {!sidebarCollapsed && <span className="nav-label">Tasks</span>}
                        </NavLink>

                        <NavLink
                            to="/projects"
                            className={({ isActive }) => `saas-nav-item ${isActive ? "active" : ""}`}
                            title="GitHub Repositories"
                            onClick={closeMobile}
                        >
                            <FolderGit2 size={20} className="nav-icon" />
                            {!sidebarCollapsed && <span className="nav-label">Projects</span>}
                        </NavLink>
                    </div>

                    {/* Admin Telemetry Section */}
                    {isAdmin && (
                        <div className="saas-nav-group">
                            {!sidebarCollapsed && <span className="saas-nav-heading">Administration</span>}

                            <NavLink
                                to="/cache-monitoring"
                                className={({ isActive }) => `saas-nav-item saas-nav-admin ${isActive ? "active" : ""}`}
                                title="In-Memory Cache Telemetry"
                                onClick={closeMobile}
                            >
                                <Activity size={20} className="nav-icon" />
                                {!sidebarCollapsed && (
                                    <>
                                        <span className="nav-label">Cache Monitor</span>
                                        <span className="saas-pill-admin">Admin</span>
                                    </>
                                )}
                            </NavLink>
                        </div>
                    )}

                    {/* General Section */}
                    <div className="saas-nav-group">
                        {!sidebarCollapsed && <span className="saas-nav-heading">About</span>}

                        <NavLink
                            to="/contact"
                            className={({ isActive }) => `saas-nav-item ${isActive ? "active" : ""}`}
                            title="Contact Me"
                            onClick={closeMobile}
                        >
                            <Mail size={20} className="nav-icon" />
                            {!sidebarCollapsed && <span className="nav-label">Contact</span>}
                        </NavLink>

                        <NavLink
                            to="/about"
                            className={({ isActive }) => `saas-nav-item ${isActive ? "active" : ""}`}
                            title="About Author"
                            onClick={closeMobile}
                        >
                            <User size={20} className="nav-icon" />
                            {!sidebarCollapsed && <span className="nav-label">About</span>}
                        </NavLink>
                    </div>
                </nav>

                {/* Sidebar Bottom Profile Section */}
                <div className="saas-sidebar-footer">
                    {isLoggedIn ? (
                        <div className="saas-user-card">
                            <div className="saas-avatar" title={userInfo.name}>
                                {userInfo.initial}
                            </div>
                            {!sidebarCollapsed && (
                                <div className="saas-user-info">
                                    <span className="saas-user-name" title={userInfo.name}>
                                        {userInfo.name}
                                    </span>
                                    <span className={`saas-user-role-badge ${userInfo.role === "admin" ? "admin" : "user"}`}>
                                        {userInfo.role === "admin" && <Shield size={10} style={{ marginRight: 3 }} />}
                                        {userInfo.role.toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <button
                                className="saas-logout-btn"
                                onClick={handleLogout}
                                title="Sign out"
                                type="button"
                                aria-label="Sign out"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="saas-sidebar-cta">
                            <button
                                className="saas-btn-signin"
                                onClick={() => navigate("/login")}
                                type="button"
                            >
                                <LogIn size={18} />
                                {!sidebarCollapsed && <span>Sign In</span>}
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Application Area */}
            <div className="saas-main-wrapper">
                {/* Top Navigation Bar */}
                <header className="saas-topbar">
                    <div className="saas-topbar-left">
                        {/* Mobile Hamburger Toggle */}
                        <button
                            className="saas-icon-btn mobile-only"
                            onClick={() => setMobileOpen(true)}
                            type="button"
                            aria-label="Open mobile menu"
                        >
                            <Menu size={20} />
                        </button>

                        {/* Breadcrumbs & Title */}
                        <div className="saas-breadcrumbs">
                            <span className="saas-crumb-category">{category}</span>
                            <span className="saas-crumb-separator">/</span>
                            <span className="saas-crumb-current">{title}</span>
                        </div>
                    </div>

                    <div className="saas-topbar-right">
                        {/* System Health Status Indicator */}
                        <div className="saas-status-pill" title="Backend service connected">
                            <span className="saas-pulse-dot" />
                            <span className="saas-status-text">API Online</span>
                        </div>

                        {/* Theme Toggle Button */}
                        <button
                            className="saas-icon-btn"
                            onClick={() => setDarkMode(!darkMode)}
                            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            type="button"
                            aria-label="Toggle theme mode"
                        >
                            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
                        </button>

                        {/* Quick Auth Actions */}
                        {isLoggedIn ? (
                            <div className="saas-topbar-user">
                                <div className="saas-avatar-sm" title={userInfo.name}>
                                    {userInfo.initial}
                                </div>
                                <button
                                    className="saas-topbar-logout desktop-only"
                                    onClick={handleLogout}
                                    type="button"
                                >
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                className="saas-btn saas-btn-primary saas-btn-sm"
                                onClick={() => navigate("/login")}
                                type="button"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </header>

                {/* Content Canvas */}
                <main className="saas-content-area">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AppLayout;
