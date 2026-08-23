import { useState } from "react";
import { createTask } from "../api";

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

            setError(err.message);

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="task-form-container">

            <h2>Create New Task</h2>

            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="task-create-form"
            >

                {/* Title */}

                <div className="task-form-group">

                    <label htmlFor="task-title">
                        Title
                    </label>

                    <input
                        id="task-title"
                        type="text"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        placeholder="Enter task title"
                        disabled={loading}
                    />

                </div>


                {/* Description */}

                <div className="task-form-group">

                    <label htmlFor="task-description">
                        Description
                    </label>

                    <textarea
                        id="task-description"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        placeholder="Enter task description"
                        disabled={loading}
                    />

                </div>


                {/* Priority */}

                <div className="task-form-group">

                    <label htmlFor="task-priority">
                        Priority
                    </label>

                    <select
                        id="task-priority"
                        value={priority}
                        onChange={(e) =>
                            setPriority(e.target.value)
                        }
                        disabled={loading}
                        className="task-select"
                    >
                        <option value="low">
                            Low
                        </option>

                        <option value="medium">
                            Medium
                        </option>

                        <option value="high">
                            High
                        </option>
                    </select>

                </div>


                {/* Submit */}

                <div className="task-actions create-actions">

                    <button
                        type="submit"
                        disabled={loading}
                        className="task-submit-button"
                    >
                        {loading
                            ? "Creating..."
                            : "Add Task"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default TaskForm;