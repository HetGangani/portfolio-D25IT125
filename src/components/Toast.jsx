import { CheckCircle, AlertCircle, X } from "./Icons";

function Toast({ message, type = "success", onClose }) {
    if (!message) {
        return null;
    }

    const isSuccess = type === "success";

    return (
        <div className={`saas-toast-container ${isSuccess ? "toast-success" : "toast-error"}`} role="alert">
            <div className="toast-icon">
                {isSuccess ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            </div>

            <span className="toast-message-text">{message}</span>

            <button
                type="button"
                className="toast-close-btn"
                onClick={onClose}
                aria-label="Close notification"
            >
                <X size={15} />
            </button>
        </div>
    );
}

export default Toast;
