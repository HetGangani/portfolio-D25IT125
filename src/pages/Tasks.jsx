
import { useState, useEffect } from "react";

import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import Toast from "../components/Toast";

import { getTasks } from "../api";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        fetchTasks();
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

    return (
        <div className="page">
            <h1>My Tasks</h1>

            <p className="repo-subtitle">
                Tasks managed through my Express and MongoDB backend.
            </p>

            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() =>
                    setToast({ message: "", type: "success" })
                }
            />

            <TaskForm
                onTaskOptimistic={handleTaskOptimistic}
                onTaskCreated={handleTaskCreated}
                onTaskCreationFailed={handleTaskCreationFailed}
            />

            {loading ? (
                <Spinner />
            ) : error ? (
                <ErrorMessage message={error} onRetry={fetchTasks} />
            ) : tasks.length === 0 ? (
                <p>No tasks found.</p>
            ) : (
                <div className="repo-grid">
                    {tasks.map((task) => (
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
