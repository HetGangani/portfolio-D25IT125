import { useState, useEffect, useMemo } from "react";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import Toast from "../components/Toast";
import { getTasks } from "../api";
import {
    Plus,
    X,
    Search,
    Filter,
    CheckSquare,
    Clock,
    AlertTriangle,
    Layers,
    CheckCircle
} from "../components/Icons";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form visibility toggle
    const [showForm, setShowForm] = useState(false);

    // Filter and search state
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'pending' | 'completed'
    const [priorityFilter, setPriorityFilter] = useState("all"); // 'all' | 'high' | 'medium' | 'low'

    const [toast, setToast] = useState({
        message: "",
        type: "success"
    });

    const showToast = (message, type = "success") => {
        setToast({ message, type });
    };

    useEffect(() => {
        if (!toast.message) return;

        const timer = setTimeout(() => {
            setToast({ message: "", type: "success" });
        }, 3000);

        return () => clearTimeout(timer);
    }, [toast.message]);

    const fetchTasks = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getTasks();

            if (!data) return;

            if (Array.isArray(data)) {
                setTasks(data);
            } else if (Array.isArray(data.tasks)) {
                setTasks(data.tasks);
            } else if (Array.isArray(data.data)) {
                setTasks(data.data);
            } else {
                setTasks([]);
            }
        } catch (err) {
            setError(err.message || "Unable to load tasks.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        async function loadInitialTasks() {
            try {
                const data = await getTasks();
                if (!isMounted || !data) return;

                if (Array.isArray(data)) {
                    setTasks(data);
                } else if (Array.isArray(data.tasks)) {
                    setTasks(data.tasks);
                } else if (Array.isArray(data.data)) {
                    setTasks(data.data);
                } else {
                    setTasks([]);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || "Unable to load tasks.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }
        loadInitialTasks();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleTaskOptimistic = (task) => {
        setTasks((current) => [task, ...current]);
    };

    const handleTaskCreated = (createdTask, temporaryId) => {
        setTasks((current) =>
            current.map((task) =>
                task._id === temporaryId ? createdTask : task
            )
        );
        showToast("Task created successfully!", "success");
        setShowForm(false);
    };

    const handleTaskCreationFailed = (temporaryId, message) => {
        setTasks((current) =>
            current.filter((task) => task._id !== temporaryId)
        );
        showToast(message || "Failed to create task!", "error");
    };

    const handleTaskUpdated = (updatedTask) => {
        setTasks((current) =>
            current.map((task) =>
                task._id === updatedTask._id ? updatedTask : task
            )
        );
        showToast("Task updated successfully!", "success");
    };

    const handleTaskDeleted = (deletedTaskId) => {
        setTasks((current) =>
            current.filter((task) => task._id !== deletedTaskId)
        );
        showToast("Task deleted successfully!", "success");
    };

    // Calculate real-time stats
    const totalCount = tasks.length;
    const completedCount = tasks.filter((t) => t.completed).length;
    const pendingCount = totalCount - completedCount;
    const highCount = tasks.filter((t) => t.priority === "high").length;

    // Filtered tasks computation
    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            // Status match
            if (statusFilter === "completed" && !task.completed) return false;
            if (statusFilter === "pending" && task.completed) return false;

            // Priority match
            if (priorityFilter !== "all" && (task.priority || "medium") !== priorityFilter) {
                return false;
            }

            // Search query match
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const titleMatch = task.title?.toLowerCase().includes(query);
                const descMatch = task.description?.toLowerCase().includes(query);
                if (!titleMatch && !descMatch) return false;
            }

            return true;
        });
    }, [tasks, statusFilter, priorityFilter, searchQuery]);

    return (
        <div className="saas-page-container">
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: "", type: "success" })}
            />

            {/* Page Header */}
            <div className="saas-page-header">
                <div>
                    <h1 className="saas-page-title">Tasks Management</h1>
                    <p className="saas-page-subtitle">
                        Organize, prioritize, and track your development workload backed by Express and MongoDB.
                    </p>
                </div>

                <div className="saas-header-actions">
                    <button
                        className={`saas-btn ${showForm ? "saas-btn-secondary" : "saas-btn-primary"}`}
                        onClick={() => setShowForm(!showForm)}
                        type="button"
                    >
                        {showForm ? (
                            <>
                                <X size={18} />
                                <span>Close Form</span>
                            </>
                        ) : (
                            <>
                                <Plus size={18} />
                                <span>New Task</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Task Quick Stats Strip */}
            <div className="saas-quick-metrics-strip">
                <div
                    className={`metric-chip ${statusFilter === "all" ? "active" : ""}`}
                    onClick={() => setStatusFilter("all")}
                    role="button"
                    tabIndex={0}
                >
                    <Layers size={15} />
                    <span className="metric-chip-label">All Tasks</span>
                    <span className="metric-chip-count">{totalCount}</span>
                </div>

                <div
                    className={`metric-chip ${statusFilter === "pending" ? "active" : ""}`}
                    onClick={() => setStatusFilter("pending")}
                    role="button"
                    tabIndex={0}
                >
                    <Clock size={15} />
                    <span className="metric-chip-label">Pending</span>
                    <span className="metric-chip-count text-amber">{pendingCount}</span>
                </div>

                <div
                    className={`metric-chip ${statusFilter === "completed" ? "active" : ""}`}
                    onClick={() => setStatusFilter("completed")}
                    role="button"
                    tabIndex={0}
                >
                    <CheckCircle size={15} />
                    <span className="metric-chip-label">Completed</span>
                    <span className="metric-chip-count text-emerald">{completedCount}</span>
                </div>

                <div
                    className={`metric-chip ${priorityFilter === "high" ? "active" : ""}`}
                    onClick={() => setPriorityFilter(priorityFilter === "high" ? "all" : "high")}
                    role="button"
                    tabIndex={0}
                >
                    <AlertTriangle size={15} />
                    <span className="metric-chip-label">High Priority</span>
                    <span className="metric-chip-count text-rose">{highCount}</span>
                </div>
            </div>

            {/* Collapsible Task Creation Form */}
            {showForm && (
                <div className="saas-form-wrapper-animated">
                    <TaskForm
                        onTaskOptimistic={handleTaskOptimistic}
                        onTaskCreated={handleTaskCreated}
                        onTaskCreationFailed={handleTaskCreationFailed}
                    />
                </div>
            )}

            {/* Search and Filters Toolbar */}
            <div className="saas-toolbar-card">
                <div className="saas-search-input-wrap">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search tasks by title or keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="saas-search-input"
                    />
                    {searchQuery && (
                        <button
                            className="clear-search-btn"
                            onClick={() => setSearchQuery("")}
                            type="button"
                            aria-label="Clear search"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                <div className="saas-toolbar-filters">
                    {/* Status Segmented Control */}
                    <div className="saas-segmented-control">
                        <button
                            className={`segment-btn ${statusFilter === "all" ? "active" : ""}`}
                            onClick={() => setStatusFilter("all")}
                            type="button"
                        >
                            All
                        </button>
                        <button
                            className={`segment-btn ${statusFilter === "pending" ? "active" : ""}`}
                            onClick={() => setStatusFilter("pending")}
                            type="button"
                        >
                            Pending
                        </button>
                        <button
                            className={`segment-btn ${statusFilter === "completed" ? "active" : ""}`}
                            onClick={() => setStatusFilter("completed")}
                            type="button"
                        >
                            Done
                        </button>
                    </div>

                    {/* Priority Filter Dropdown */}
                    <div className="saas-filter-dropdown-wrap">
                        <Filter size={15} className="filter-icon" />
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="saas-toolbar-select"
                        >
                            <option value="all">All Priorities</option>
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Task Grid Content */}
            {loading ? (
                <Spinner />
            ) : error ? (
                <ErrorMessage message={error} onRetry={fetchTasks} />
            ) : filteredTasks.length === 0 ? (
                <div className="saas-card saas-empty-state-large">
                    <div className="empty-state-icon">
                        <CheckSquare size={40} />
                    </div>
                    <h3>No tasks match your criteria</h3>
                    <p>
                        {totalCount === 0
                            ? "You haven't created any tasks yet. Click 'New Task' to get started."
                            : "Try adjusting your search query, status, or priority filters to find tasks."}
                    </p>
                    <div className="empty-state-actions">
                        {totalCount === 0 ? (
                            <button
                                className="saas-btn saas-btn-primary"
                                onClick={() => setShowForm(true)}
                                type="button"
                            >
                                <Plus size={18} />
                                <span>Create First Task</span>
                            </button>
                        ) : (
                            <button
                                className="saas-btn saas-btn-secondary"
                                onClick={() => {
                                    setSearchQuery("");
                                    setStatusFilter("all");
                                    setPriorityFilter("all");
                                }}
                                type="button"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="saas-task-grid">
                    {filteredTasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onTaskUpdated={handleTaskUpdated}
                            onTaskDeleted={handleTaskDeleted}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Tasks;
