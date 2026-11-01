import { useNavigate } from "react-router-dom";
import { AlertCircle, LayoutDashboard } from "../components/Icons";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="saas-page-container">
            <div className="saas-card saas-empty-state-large not-found-card">
                <div className="empty-state-icon text-amber">
                    <AlertCircle size={48} />
                </div>
                <h2 className="not-found-code">404</h2>
                <h3 className="not-found-title">Page Not Found</h3>
                <p className="not-found-desc">
                    The requested route does not exist or has been relocated. Check the address or navigate back to the dashboard.
                </p>
                <div className="empty-state-actions">
                    <button
                        className="saas-btn saas-btn-primary"
                        onClick={() => navigate("/")}
                        type="button"
                    >
                        <LayoutDashboard size={18} />
                        <span>Return to Dashboard</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
