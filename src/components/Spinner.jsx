function Spinner({
    title = "Loading data...",
    subtitle = "Please wait while we communicate with the service."
}) {
    return (
        <div className="saas-card saas-loader-card">
            <div className="saas-spinner-ring" />
            <h4 className="loader-title">{title}</h4>
            <p className="loader-submessage">{subtitle}</p>
        </div>
    );
}

export default Spinner;
