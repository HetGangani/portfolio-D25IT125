import { AlertCircle, RefreshCw } from "./Icons";

function ErrorMessage({
    title = "Unable to complete request",
    message = "An error occurred while communicating with the service.",
    onRetry
}) {
    return (
        <div className="saas-card saas-error-card">
            <div className="error-icon-box">
                <AlertCircle size={32} />
            </div>
            <h3 className="error-card-title">{title}</h3>
            <p className="error-card-message">{message}</p>
            {onRetry && (
                <button
                    className="saas-btn saas-btn-primary saas-btn-sm"
                    onClick={onRetry}
                    type="button"
                >
                    <RefreshCw size={15} />
                    <span>Try Again</span>
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;
