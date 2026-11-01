import { useState } from "react";
import { createTask } from "../api";
import { Plus, AlertCircle } from "./Icons";

function TaskForm({
    onTaskOptimistic,
    onTaskCreated,
    onTaskCreationFailed
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Task title is required.");
            return;
        }

        setLoading(true);
        setError(null);

        const temporaryId = `temp-${Date.now()}`;

        const taskData = {
            title: title.trim(),
            description: description.trim(),
            priority,
            completed: false,
            createdAt: new Date().toISOString()
        };

        const optimisticTask = {
            _id: temporaryId,
            ...taskData,
            isOptimistic: true
        };

        // Optimistic UI
        onTaskOptimistic(optimisticTask);

        try {
            const response = await createTask({
                title: taskData.title,
                description: taskData.description,
                priority: taskData.priority
            });

            // Replace temporary task with real task
            onTaskCreated(
                response.task,
                temporaryId
            );

            // Reset form
            setTitle("");
            setDescription("");
            setPriority("medium");
        } catch (err) {
            // Rollback optimistic task
            onTaskCreationFailed(
                temporaryId,
                err.message
            );
            setError(err.message || "Failed to create task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="saas-card saas-form-card">
            <div className="form-card-header">
                <div>
                    <h3 className="card-title">Create New Task</h3>
                    <p className="card-subtitle">
                        Add a new work item with priority assignment to your workspace.
                    </p>
                </div>
            </div>

            {error && (
                <div className="saas-alert saas-alert-danger">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="saas-task-form">
                <div className="saas-form-row">
                    {/* Title */}
                    <div className="saas-field flex-2">
                        <label htmlFor="task-title" className="saas-label">
                            Task Title <span className="required-star">*</span>
                        </label>
                        <input
                            id="task-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Implement cache monitoring dashboard"
                            disabled={loading}
                            className="saas-input"
                        />
                    </div>

                    {/* Priority Selector */}
                    <div className="saas-field flex-1">
                        <label htmlFor="task-priority" className="saas-label">
                            Priority Tier
                        </label>
                        <select
                            id="task-priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            disabled={loading}
                            className="saas-select"
                        >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div className="saas-field">
                    <label htmlFor="task-description" className="saas-label">
                        Description <span className="optional-tag">(Optional)</span>
                    </label>
                    <textarea
                        id="task-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add additional specifications, requirements, or acceptance criteria..."
                        disabled={loading}
                        rows={3}
                        className="saas-textarea"
                    />
                </div>

                {/* Submit Action */}
                <div className="form-action-bar">
                    <button
                        type="submit"
                        disabled={loading || !title.trim()}
                        className="saas-btn saas-btn-primary"
                    >
                        {loading ? (
                            <>
                                <span className="saas-btn-spinner" />
                                <span>Creating Task...</span>
                            </>
                        ) : (
                            <>
                                <Plus size={18} />
                                <span>Add Task</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TaskForm;
