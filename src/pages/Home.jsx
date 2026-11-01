import { memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks } from "../api";
import { isAdminUser } from "../services/authApi";
import {
    CheckSquare,
    Clock,
    AlertTriangle,
    Layers,
    CheckCircle,
    TrendingUp,
    Plus,
    Activity,
    FolderGit2,
    ArrowRight,
    Sparkles,
    User,
    AlertCircle
} from "../components/Icons";

function Home() {
    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem("token");
    const isAdmin = isLoggedIn && isAdminUser();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(isLoggedIn);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        if (!isLoggedIn) {
            return;
        }

        const loadDashboardData = async () => {
            try {
                const data = await getTasks();
                if (!isMounted) return;

                if (Array.isArray(data)) {
                    setTasks(data);
                } else if (data && Array.isArray(data.tasks)) {
                    setTasks(data.tasks);
                } else if (data && Array.isArray(data.data)) {
                    setTasks(data.data);
                } else {
                    setTasks([]);
                }
            } catch {
                if (isMounted) {
                    setError("Unable to retrieve live tasks for dashboard.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadDashboardData();

        return () => {
            isMounted = false;
        };
    }, [isLoggedIn]);

    // Compute real statistics from actual tasks
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const highPriorityTasks = tasks.filter((t) => t.priority === "high").length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Recent tasks sorted by creation date or array position
    const recentTasks = [...tasks]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);

    const skills = ["React 19", "Express.js", "Node.js", "MongoDB", "Docker", "Node-Cache", "JWT & RBAC", "Vite"];

    return (
        <div className="saas-dashboard">
            {/* Top Welcome / Hero Banner */}
            <section className="saas-hero-card">
                <div className="saas-hero-content">
                    <div className="saas-hero-badge">
                        <Sparkles size={14} />
                        <span>SaaS Task Management Workspace</span>
                    </div>
                    <h1 className="saas-hero-title">
                        Welcome to your Developer Workspace
                    </h1>
                    <p className="saas-hero-subtitle">
                        Streamline your workflow with high-performance task management, in-memory caching telemetry, and containerized microservices.
                    </p>

                    <div className="saas-hero-actions">
                        {isLoggedIn ? (
                            <>
                                <button
                                    className="saas-btn saas-btn-primary"
                                    onClick={() => navigate("/tasks")}
                                    type="button"
                                >
                                    <Plus size={18} />
                                    <span>Manage Tasks</span>
                                </button>
                                {isAdmin && (
                                    <button
                                        className="saas-btn saas-btn-secondary"
                                        onClick={() => navigate("/cache-monitoring")}
                                        type="button"
                                    >
                                        <Activity size={18} />
                                        <span>Cache Telemetry</span>
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                <button
                                    className="saas-btn saas-btn-primary"
                                    onClick={() => navigate("/login")}
                                    type="button"
                                >
                                    <span>Sign In to Workspace</span>
                                    <ArrowRight />
                                </button>
                                <button
                                    className="saas-btn saas-btn-secondary"
                                    onClick={() => navigate("/register")}
                                    type="button"
                                >
                                    <span>Create Free Account</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="saas-hero-metric">
                    <div className="saas-hero-circle-stat">
                        <span className="hero-stat-number">{isLoggedIn ? `${completionRate}%` : "100%"}</span>
                        <span className="hero-stat-label">Completion Velocity</span>
                    </div>
                </div>
            </section>

            {/* Error Notification if load failed */}
            {error && (
                <div className="saas-alert saas-alert-danger" role="alert">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Live Metrics Grid */}
            <section className="saas-stats-grid">
                {/* Total Tasks */}
                <div className="saas-stat-card">
                    <div className="stat-card-header">
                        <span className="stat-label">Total Work Items</span>
                        <div className="stat-icon-wrapper stat-icon-indigo">
                            <Layers size={18} />
                        </div>
                    </div>
                    <div className="stat-value">{loading ? "..." : totalTasks}</div>
                    <div className="stat-footer">
                        <span className="stat-hint">Active tasks in workspace</span>
                    </div>
                </div>

                {/* Completed Tasks */}
                <div className="saas-stat-card">
                    <div className="stat-card-header">
                        <span className="stat-label">Completed</span>
                        <div className="stat-icon-wrapper stat-icon-emerald">
                            <CheckCircle size={18} />
                        </div>
                    </div>
                    <div className="stat-value text-emerald">{loading ? "..." : completedTasks}</div>
                    <div className="stat-footer">
                        <span className="stat-progress-pill emerald">
                            {totalTasks > 0 ? `${completionRate}% completed` : "Ready to track"}
                        </span>
                    </div>
                </div>

                {/* Pending Tasks */}
                <div className="saas-stat-card">
                    <div className="stat-card-header">
                        <span className="stat-label">In Progress</span>
                        <div className="stat-icon-wrapper stat-icon-amber">
                            <Clock size={18} />
                        </div>
                    </div>
                    <div className="stat-value text-amber">{loading ? "..." : pendingTasks}</div>
                    <div className="stat-footer">
                        <span className="stat-hint">Awaiting resolution</span>
                    </div>
                </div>

                {/* High Priority Tasks */}
                <div className="saas-stat-card">
                    <div className="stat-card-header">
                        <span className="stat-label">High Priority</span>
                        <div className="stat-icon-wrapper stat-icon-rose">
                            <AlertTriangle size={18} />
                        </div>
                    </div>
                    <div className="stat-value text-rose">{loading ? "..." : highPriorityTasks}</div>
                    <div className="stat-footer">
                        <span className="stat-hint">Urgent attention needed</span>
                    </div>
                </div>
            </section>

            {/* Overall Progress Bar */}
            <section className="saas-card saas-progress-banner">
                <div className="progress-banner-header">
                    <div>
                        <h3 className="card-title">Sprint Completion Progress</h3>
                        <p className="card-subtitle">
                            {completedTasks} of {totalTasks} work items completed across all priority tiers
                        </p>
                    </div>
                    <div className="progress-percentage-pill">
                        <TrendingUp size={16} />
                        <span>{completionRate}%</span>
                    </div>
                </div>

                <div className="saas-progress-track">
                    <div
                        className="saas-progress-bar"
                        style={{ width: `${Math.min(100, Math.max(0, completionRate))}%` }}
                        role="progressbar"
                        aria-valuenow={completionRate}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    />
                </div>
            </section>

            {/* Split Content Section: Recent Tasks & Developer Profile */}
            <div className="saas-dashboard-grid">
                {/* Left: Recent Tasks Section */}
                <div className="saas-card saas-recent-tasks-card">
                    <div className="card-header-action">
                        <div>
                            <h3 className="card-title">Recent Tasks</h3>
                            <p className="card-subtitle">Latest items created in your database</p>
                        </div>
                        {isLoggedIn && (
                            <button
                                className="saas-btn-text"
                                onClick={() => navigate("/tasks")}
                                type="button"
                            >
                                <span>View all ({totalTasks})</span>
                                <ArrowRight />
                            </button>
                        )}
                    </div>

                    {!isLoggedIn ? (
                        <div className="saas-empty-state">
                            <div className="empty-state-icon">
                                <CheckSquare size={32} />
                            </div>
                            <h4>Sign in to view and manage tasks</h4>
                            <p>Authentication is required to query MongoDB tasks and synchronize live workspace updates.</p>
                            <button
                                className="saas-btn saas-btn-primary saas-btn-sm"
                                onClick={() => navigate("/login")}
                                type="button"
                            >
                                Go to Sign In
                            </button>
                        </div>
                    ) : loading ? (
                        <div className="saas-skeleton-list">
                            <div className="saas-skeleton-item" />
                            <div className="saas-skeleton-item" />
                            <div className="saas-skeleton-item" />
                        </div>
                    ) : recentTasks.length === 0 ? (
                        <div className="saas-empty-state">
                            <div className="empty-state-icon">
                                <CheckSquare size={32} />
                            </div>
                            <h4>No tasks in workspace yet</h4>
                            <p>Create your first task to start tracking priorities, descriptions, and statuses.</p>
                            <button
                                className="saas-btn saas-btn-primary saas-btn-sm"
                                onClick={() => navigate("/tasks")}
                                type="button"
                            >
                                <Plus size={16} />
                                <span>Create Task</span>
                            </button>
                        </div>
                    ) : (
                        <div className="saas-recent-list">
                            {recentTasks.map((task) => (
                                <div key={task._id} className="saas-recent-item" onClick={() => navigate("/tasks")}>
                                    <div className="item-left">
                                        <span className={`status-indicator-dot ${task.completed ? "completed" : "pending"}`} />
                                        <div className="item-text">
                                            <span className={`item-title ${task.completed ? "completed-strikethrough" : ""}`}>
                                                {task.title}
                                            </span>
                                            {task.description && (
                                                <span className="item-desc">{task.description}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="item-right">
                                        <span className={`priority-tag tag-${task.priority || "medium"}`}>
                                            {task.priority || "medium"}
                                        </span>
                                        <span className="item-date">
                                            {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : ""}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Developer & Architecture Profile Widget */}
                <div className="saas-card saas-profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="profile-name">Het Gangani</h3>
                            <span className="profile-sub">B.Tech Information Technology</span>
                        </div>
                    </div>

                    <p className="profile-bio">
                        Full-stack web application implementing Express REST API, MongoDB, NodeCache, EventEmitter, Docker containerization, and modern React frontend.
                    </p>

                    <div className="profile-section-divider" />

                    <h4 className="profile-skills-title">Core Stack & Technologies</h4>
                    <div className="skills-badge-wrap">
                        {skills.map((skill) => (
                            <span key={skill} className="tech-badge">
                                {skill}
                            </span>
                        ))}
                    </div>

                    <div className="profile-actions-bottom">
                        <button
                            className="saas-btn saas-btn-secondary saas-btn-full"
                            onClick={() => navigate("/projects")}
                            type="button"
                        >
                            <FolderGit2 size={16} />
                            <span>View GitHub Projects</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(Home);
