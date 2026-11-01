import { Star, ExternalLink, FolderGit2 } from "./Icons";

function RepoCard({ repo }) {
    return (
        <div className="saas-card saas-repo-card">
            <div className="repo-card-top">
                <div className="repo-title-wrap">
                    <div className="repo-icon-badge">
                        <FolderGit2 size={18} />
                    </div>
                    <h3 className="repo-name" title={repo.name}>
                        {repo.name}
                    </h3>
                </div>
                <span className="repo-visibility-pill">
                    {repo.visibility || "Public"}
                </span>
            </div>

            {repo.description ? (
                <p className="repo-description-text">{repo.description}</p>
            ) : (
                <p className="repo-description-text text-muted">No description provided for this repository.</p>
            )}

            <div className="repo-details-row">
                <div className="repo-meta-item">
                    <span className="lang-dot" />
                    <span>{repo.language || "JavaScript"}</span>
                </div>

                <div className="repo-meta-item">
                    <Star size={14} className="star-icon" />
                    <span>{repo.stargazers_count} stars</span>
                </div>
            </div>

            <div className="repo-card-action">
                <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="saas-btn saas-btn-secondary saas-btn-sm saas-btn-full"
                >
                    <span>View on GitHub</span>
                    <ExternalLink size={14} />
                </a>
            </div>
        </div>
    );
}

export default RepoCard;
