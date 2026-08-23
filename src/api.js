const BASE_URL = "http://localhost:5000";

export const getTasks = async () => {
    const response = await fetch(`${BASE_URL}/tasks`);

    if(!response.ok) {
        throw new Error("Failed to fetch tasks.");
    }

    return response.json();
};

export const createTask = async (taskData) => {
    const response = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
    });

    if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create task");
    }

    return response.json();
};

export const updateTask = async (id, taskData) => {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(taskData)
    });

    if(!response.ok) {
        const errorData = await response.json();
        throw new error(errorData.message || "Failed to updatee task!!");
    }

    return response.json();
};

export const deleteTask = async (id) => {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "DELETE"
    });

    if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete task.");
    }

    return response.json();
};