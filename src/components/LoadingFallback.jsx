function LoadingFallback({
    message = "Loading page...",
    submessage = "Please wait while the page is being loaded."
}) {
    return (
        <div
            className="page"
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <div className="spinner-container">
                <div className="spinner" aria-hidden="true"></div>
                <h3>{message}</h3>
                {submessage && <p>{submessage}</p>}
            </div>
        </div>
    );
}

export default LoadingFallback;
