import { useState } from "react";
import { updateTask, deleteTask } from "../api";

function TaskCard({ task, onTaskUpdated, onTaskDeleted }) {

    const [isEditing, setIsEditing] = useState(false);

    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || "");
    const [priority, setPriority] = useState(task.priority || "medium");
    const [completed, setCompleted] = useState(task.completed);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

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

        const confirmed = window.confirm(
            `Are you sure you want to delete "${task.title}"?`
        );

        if (!confirmed) {
            return;
        }

        setDeleting(true);
        setDeleteError(null);

        try {

            await deleteTask(task._id);

            onTaskDeleted(task._id);

        } catch (err) {

            setDeleteError(err.message);

        } finally {

            setDeleting(false);

        }
    };

    if (isEditing) {

        return (
            <div className="repo-card task-card task-edit-card">

                <h3>Edit Task</h3>

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleUpdate}
                    className="task-edit-form"
                >

                    {/* Title */}

                    <div className="task-form-group">

                        <label htmlFor={`title-${task._id}`}>
                            Title
                        </label>

                        <input
                            id={`title-${task._id}`}
                            type="text"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            disabled={loading}
                        />

                    </div>


                    {/* Description */}

                    <div className="task-form-group">

                        <label htmlFor={`description-${task._id}`}>
                            Description
                        </label>

                        <textarea
                            id={`description-${task._id}`}
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            disabled={loading}
                        />

                    </div>


                    {/* Priority */}

                    <div className="task-form-group">

                        <label htmlFor={`priority-${task._id}`}>
                            Priority
                        </label>

                        <select
                            id={`priority-${task._id}`}
                            value={priority}
                            onChange={(e) =>
                                setPriority(e.target.value)
                            }
                            disabled={loading}
                            className="task-select"
                        >
                            <option value="Low">
                                Low
                            </option>

                            <option value="Medium">
                                Medium
                            </option>

                            <option value="High">
                                High
                            </option>
                        </select>

                    </div>


                    {/* Completed */}

                    <div className="task-form-group completed-group">

                        <label>
                            Completed
                        </label>

                        <label
                            htmlFor={`completed-${task._id}`}
                            className="checkbox-label"
                        >

                            <input
                                id={`completed-${task._id}`}
                                type="checkbox"
                                checked={completed}
                                onChange={(e) =>
                                    setCompleted(e.target.checked)
                                }
                                disabled={loading}
                            />

                            <span>
                                Mark task as completed
                            </span>

                        </label>

                    </div>


                    {/* Buttons */}

                    <div className="task-actions">

                        <button
                            type="submit"
                            disabled={loading}
                            className="task-submit-button"
                        >
                            {loading
                                ? "Updating..."
                                : "Save Changes"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                setError(null);

                                // Restore original values
                                setTitle(task.title);
                                setDescription(
                                    task.description || ""
                                );
                                setPriority(
                                    task.priority || "Medium"
                                );
                                setCompleted(
                                    task.completed
                                );
                            }}
                            disabled={loading}
                            className="task-cancel-button"
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>
        );
    }


    return (
        <div className="repo-card task-card">

            <div className="task-card-header">

                <h3>{task.title}</h3>

                <span
                    className={`task-status ${
                        task.completed
                            ? "completed"
                            : "pending"
                    }`}
                >
                    {task.completed
                        ? "Completed"
                        : "Pending"}
                </span>

            </div>


            {task.description && (
                <p className="task-description">
                    {task.description}
                </p>
            )}


            <div className="task-details">

                <p>
                    ⭐ Priority:{" "}
                    <strong>
                        {task.priority || "Medium"}
                    </strong>
                </p>

                <p>
                    📅 Created:{" "}
                    {task.createdAt
                        ? new Date(
                              task.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                </p>

            </div>


            {deleteError && (
                <div className="form-error">
                    {deleteError}
                </div>
            )}


            <div className="task-actions">

                <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="task-edit-button"
                    disabled={deleting}
                >
                    Edit
                </button>

                <button
                    type="button"
                    onClick={handleDelete}
                    className="task-delete-button"
                    disabled={deleting}
                >
                    {deleting
                        ? "Deleting..."
                        : "Delete"}
                </button>

            </div>

        </div>
    );
}

export default TaskCard;