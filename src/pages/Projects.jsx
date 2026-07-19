import { useState } from "react";

function Projects() {
    const [showProjects, setShowProjects] = useState(true);

    return (
        <div className="page">
            <h1>Projects</h1>

            <button
                onClick={() => {
                    setShowProjects(prev => !prev);
                }}
            >
                {showProjects ? "Hide Projects" : "Show Projects"}
            </button>

            {showProjects && (
                <div className="project-list">
                    <h3>My Projects</h3>

                    <ul>
                        <li>Student Portfolio Website</li>
                        <li>Cloud Bus Pass System</li>
                        <li>StudentHub Portal</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Projects;