function Spinner() {
    return (
        <div className="spinner-container">

            <div className="spinner"></div>

            <h3>Loading Repositories....</h3>
            
            <p>Please wait while we fetch data from Github.</p>
        </div>
    );
}

export default Spinner;