import { User, FolderGit2, Shield, Layers } from "./Icons";

function About() {
    return (
        <div className="saas-page-container">
            <div className="saas-page-header">
                <div>
                    <h1 className="saas-page-title">About Developer</h1>
                    <p className="saas-page-subtitle">
                        Student portfolio & background information for the TaskFlow SaaS platform.
                    </p>
                </div>
            </div>

            <div className="saas-card saas-about-card">
                <div className="about-hero-block">
                    <div className="about-avatar-large">
                        <User size={36} />
                    </div>
                    <div>
                        <h2 className="about-title-name">Het Gangani</h2>
                        <span className="about-role-tag">B.Tech Information Technology • CHARUSAT</span>
                    </div>
                </div>

                <div className="profile-section-divider" />

                <div className="about-bio-text">
                    <p>
                        Hello! I am Het Gangani, a B.Tech Information Technology student.
                        I am learning React and modern web development to build reusable,
                        interactive, and responsive web applications.
                    </p>
                    <p>
                        This Task Management SaaS application demonstrates modern full-stack development
                        principles: Express.js REST API with validation, Mongoose database modeling, JWT
                        token authentication, role-based access control (RBAC), in-memory caching with
                        telemetry, asynchronous event-driven background processing, and complete Docker Compose
                        containerization.
                    </p>
                </div>

                <div className="about-highlights-grid">
                    <div className="about-highlight-box">
                        <Layers size={20} className="text-indigo" />
                        <h4>Modular Architecture</h4>
                        <p>Component-driven React 19 interface with lazy loading and responsive SaaS design.</p>
                    </div>

                    <div className="about-highlight-box">
                        <Shield size={20} className="text-emerald" />
                        <h4>Security & RBAC</h4>
                        <p>Server-side token authorization with granular admin roles and protected routes.</p>
                    </div>

                    <div className="about-highlight-box">
                        <FolderGit2 size={20} className="text-blue" />
                        <h4>Containerization</h4>
                        <p>Multi-stage Docker build served via Nginx and coordinated by Docker Compose.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
