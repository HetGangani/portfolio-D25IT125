function RepoCard({ repo }) {
    return(
        <div className="repo-card">
            <h3>{repo.name}</h3>

            <div className="repo-info">

                 <p>⭐ <strong>Stars:</strong> {repo.stargazers_count}</p>

                <p>📝 <strong>Language:</strong> {repo.language || "Not Specified"}</p>

                <p>🔓 <strong>Visibility:</strong> {repo.visibility}</p>

            </div> 

            <a href={repo.html_url} target="_blank" rel="noreferrer" className="repo-btn">
                View on Github →
            </a>

        </div>
    );
}

export default RepoCard;