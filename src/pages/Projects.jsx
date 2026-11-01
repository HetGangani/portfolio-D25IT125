import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import RepoCard from "../components/RepoCard";
import { Search, FolderGit2, X } from "../components/Icons";

function Projects() {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchRepos = () => {
        setLoading(true);
        setError(null);

        fetch("https://api.github.com/users/HetGangani/repos")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch repositories.");
                }
                return response.json();
            })
            .then((data) => {
                setRepos(Array.isArray(data) ? data : []);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        let isMounted = true;
        fetch("https://api.github.com/users/HetGangani/repos")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch repositories.");
                }
                return response.json();
            })
            .then((data) => {
                if (isMounted) {
                    setRepos(Array.isArray(data) ? data : []);
                }
            })
            .catch((err) => {
                if (isMounted) setError(err.message);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredRepos = repos.filter((repo) =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="saas-page-container">
            <div className="saas-page-header">
                <div>
                    <h1 className="saas-page-title">GitHub Repositories</h1>
                    <p className="saas-page-subtitle">
                        Live repositories fetched directly from @HetGangani via the GitHub API.
                    </p>
                </div>

                <div className="saas-header-actions">
                    <span className="saas-stat-chip">
                        <FolderGit2 size={15} />
                        <span>{repos.length} Repositories</span>
                    </span>
                </div>
            </div>

            {/* Search Toolbar */}
            <div className="saas-toolbar-card">
                <div className="saas-search-input-wrap">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search repositories by name or tech..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="saas-search-input"
                    />
                    {searchTerm && (
                        <button
                            className="clear-search-btn"
                            onClick={() => setSearchTerm("")}
                            type="button"
                            aria-label="Clear search"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Repos Grid */}
            {loading ? (
                <Spinner />
            ) : error ? (
                <ErrorMessage message={error} onRetry={fetchRepos} />
            ) : filteredRepos.length === 0 ? (
                <div className="saas-card saas-empty-state-large">
                    <div className="empty-state-icon">
                        <FolderGit2 size={40} />
                    </div>
                    <h3>No repositories found</h3>
                    <p>Try searching for a different repository name or clear the filter.</p>
                    <button
                        className="saas-btn saas-btn-secondary"
                        onClick={() => setSearchTerm("")}
                        type="button"
                    >
                        Clear Search
                    </button>
                </div>
            ) : (
                <div className="saas-repo-grid">
                    {filteredRepos.map((repo) => (
                        <RepoCard key={repo.id} repo={repo} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Projects;
