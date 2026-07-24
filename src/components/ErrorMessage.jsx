function ErrorMessage({ message, onRetry }) {
    return (
        <div className="error-box">

            <h2>❌ Unable to Fetch Repositories</h2>

            <p>{message}</p>

            <button
                className="retry-btn"
                onClick={onRetry}
            >
                Retry
            </button>

        </div>
    );
}

export default ErrorMessage;