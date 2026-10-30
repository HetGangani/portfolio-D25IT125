import { Navigate, Outlet } from "react-router-dom";
import { getUserRole } from "../services/authApi";

function AdminRoute() {
    const token = localStorage.getItem("token");

    // Unauthenticated: redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Authenticated non-admin: redirect to tasks
    const role = getUserRole();
    if (role !== "admin") {
        return <Navigate to="/tasks" replace />;
    }

    return <Outlet />;
}

export default AdminRoute;

