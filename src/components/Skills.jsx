import { Sparkles } from "./Icons";

function Skills({
    skillList = [
        "HTML5",
        "CSS3",
        "JavaScript (ES6+)",
        "React 19",
        "Express.js",
        "MongoDB",
        "Node.js",
        "Docker",
        "In-Memory Caching",
        "JWT & RBAC",
        "REST APIs",
        "Vite"
    ]
}) {
    return (
        <div className="saas-page-container">
            <div className="saas-page-header">
                <div>
                    <h1 className="saas-page-title">Technical Skills & Competencies</h1>
                    <p className="saas-page-subtitle">
                        Frameworks, languages, database systems, and devops tooling powering this platform.
                    </p>
                </div>
            </div>

            <div className="saas-card">
                <div className="card-header-action">
                    <div>
                        <h3 className="card-title">Engineering Stack</h3>
                        <p className="card-subtitle">Technologies utilized in coursework and laboratory assignments</p>
                    </div>
                    <span className="saas-stat-chip">
                        <Sparkles size={14} />
                        <span>{skillList.length} Skills Verified</span>
                    </span>
                </div>

                <div className="skills-badge-wrap large-wrap">
                    {skillList.map((skill) => (
                        <div key={skill} className="skill-card-chip">
                            <span className="skill-chip-dot" />
                            <span className="skill-chip-name">{skill}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Skills;
