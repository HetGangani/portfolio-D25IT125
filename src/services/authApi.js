const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    return response.json();
};

export const loginUser = async (userData) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    return response.json();
};

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.json();
};

export const logoutUser = () => {
    localStorage.removeItem("token");
};

export const getUserRole = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = JSON.parse(atob(parts[1]));
        return payload.role || "user";
    } catch (e) {
        return null;
    }
};

export const isAdminUser = () => {
    return getUserRole() === "admin";
};
