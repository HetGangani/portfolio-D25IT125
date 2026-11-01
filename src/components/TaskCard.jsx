import { useState } from "react";
import { updateTask, deleteTask } from "../api";
import { Edit3, Trash2, Calendar, Check, AlertCircle } from "./Icons";

function TaskCard({ task, onTaskUpdated, onTaskDeleted }) {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || "");
    const [priority, setPriority] = useState(task.priority || "medium");
    const [completed, setCompleted] = useState(task.completed);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [togglingStatus, setTogglingStatus] = useState(false);

    // Instant Status Toggle Handler
    const handleToggleStatus = async () => {
        if (loading || deleting || togglingStatus) return;
        const newStatus = !task.completed;
        setTogglingStatus(true);

        try {
            const response = await updateTask(task._id, {
                title: task.title,
                description: task.description || "",
                priority: task.priority || "medium",
                completed: newStatus
            });
            onTaskUpdated(response.task);
            setCompleted(newStatus);
        } catch (err) {
            setError(err.message || "Unable to update task status.");
        } finally {
            setTogglingStatus(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Task title is required.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await updateTask(task._id, {
                title: title.trim(),
                description: description.trim(),
                priority,
                completed
            });

            onTaskUpdated(response.task);
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        setDeleteError(null);

        try {
            await deleteTask(task._id);
            onTaskDeleted(task._id);
        } catch (err) {
            setDeleteError(err.message);
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    // Edit Mode Presentation
    if (isEditing) {
        return (
            <div className="saas-card saas-task-card editing">
                <div className="task-card-header">
                    <h4 className="card-title-sm">Edit Task</h4>
                    <span className="task-id-badge">ID: {task._id.slice(-6)}</span>
                </div>

                {error && (
                    <div className="saas-alert saas-alert-danger">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleUpdate} className="saas-task-edit-form">
                    <div className="saas-field">
                        <label className="saas-label">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={loading}
                            className="saas-input"
                            required
                        />
                    </div>

                    <div className="saas-field">
                        <label className="saas-label">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={loading}
                            rows={3}
                            className="saas-textarea"
                        />
                    </div>

                    <div className="saas-form-row">
                        <div className="saas-field flex-1">
                            <label className="saas-label">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                disabled={loading}
                                className="saas-select"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="saas-field flex-1">
                            <label className="saas-label">Completion Status</label>
                            <label className="saas-checkbox-pill">
                                <input
                                    type="checkbox"
                                    checked={completed}
                                    onChange={(e) => setCompleted(e.target.checked)}
                                    disabled={loading}
                                />
                                <span>Mark as Completed</span>
                            </label>
                        </div>
                    </div>

                    <div className="task-actions-row">
                        <button
                            type="submit"
                            disabled={loading || !title.trim()}
                            className="saas-btn saas-btn-primary saas-btn-sm"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                setError(null);
                                setTitle(task.title);
                                setDescription(task.description || "");
                                setPriority(task.priority || "medium");
                                setCompleted(task.completed);
                            }}
                            disabled={loading}
                            className="saas-btn saas-btn-secondary saas-btn-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // Normal Task Card Presentation
    return (
        <div className={`saas-card saas-task-card ${task.completed ? "task-completed" : "task-pending"}`}>
            {deleteError && (
                <div className="saas-alert saas-alert-danger">
                    <AlertCircle size={16} />
                    <span>{deleteError}</span>
                </div>
            )}

            {/* Top Row: Checkbox + Title + Priority Pill */}
            <div className="task-card-main-row">
                <button
                    type="button"
                    className={`saas-check-button ${task.completed ? "checked" : ""}`}
                    onClick={handleToggleStatus}
                    disabled={togglingStatus || deleting}
                    title={task.completed ? "Mark as pending" : "Mark as completed"}
                    aria-label={task.completed ? "Mark as pending" : "Mark as completed"}
                >
                    {task.completed && <Check size={14} />}
                </button>

                <div className="task-content-block">
                    <div className="task-header-inline">
                        <h4 className={`task-title-text ${task.completed ? "completed-strikethrough" : ""}`}>
                            {task.title}
                        </h4>
                        <span className={`priority-tag tag-${task.priority || "medium"}`}>
                            <span className="priority-dot" />
                            {task.priority || "medium"}
                        </span>
                    </div>

                    {task.description && (
                        <p className="task-description-text">
                            {task.description}
                        </p>
                    )}

                    {/* Metadata: Date & Status */}
                    <div className="task-metadata-bar">
                        <div className="meta-item">
                            <Calendar size={14} />
                            <span>
                                {task.createdAt
                                    ? new Date(task.createdAt).toLocaleDateString(undefined, {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric"
                                      })
                                    : "Recently"}
                            </span>
                        </div>

                        <div className="meta-item">
                            <span className={`status-pill ${task.completed ? "status-done" : "status-active"}`}>
                                {task.completed ? "Completed" : "In Progress"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="task-footer-actions">
                {showDeleteConfirm ? (
                    <div className="delete-confirm-popover">
                        <span className="confirm-text">Delete this task?</span>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="saas-btn saas-btn-danger saas-btn-xs"
                        >
                            {deleting ? "Deleting..." : "Confirm"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={deleting}
                            className="saas-btn saas-btn-secondary saas-btn-xs"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div className="task-btn-group">
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="saas-action-icon-btn"
                            disabled={deleting}
                            title="Edit task"
                            aria-label="Edit task"
                        >
                            <Edit3 size={15} />
                            <span>Edit</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="saas-action-icon-btn delete-btn"
                            disabled={deleting}
                            title="Delete task"
                            aria-label="Delete task"
                        >
                            <Trash2 size={15} />
                            <span>Delete</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TaskCard;
