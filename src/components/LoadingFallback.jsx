function LoadingFallback({
    message = "Loading component...",
    submessage = "Please wait while the page resources are being retrieved."
}) {
    return (
        <div
            className="saas-loading-fallback-canvas"
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <div className="saas-card saas-loader-card">
                <div className="saas-spinner-ring" />
                <h4 className="loader-title">{message}</h4>
                {submessage && <p className="loader-submessage">{submessage}</p>}
            </div>
        </div>
    );
}

export default LoadingFallback;
