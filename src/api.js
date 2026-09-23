const API_URL = "http://localhost:5000/tasks";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };
};

const handleResponse = async (response) => {
    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return null;
    }

    return response.json();
};

export const getTasks = async () => {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: getAuthHeaders()
    });

    return handleResponse(response);
};

export const createTask = async (task) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(task)
    });

    return handleResponse(response);
};

export const updateTask = async (id, task) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(task)
    });

    return handleResponse(response);
};

export const deleteTask = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });

    return handleResponse(response);
};