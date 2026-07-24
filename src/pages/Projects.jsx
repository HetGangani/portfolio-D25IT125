import { useState, useEffect } from "react";

import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import RepoCard from "../components/RepoCard";

function Projects() {

    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const FilteredRepos = repos.filter((repo) =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                setRepos(data);
            })

            .catch((err) => {
                setError(err.message);
            })

            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {

        fetchRepos();

    }, []);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
        
            <ErrorMessage message={error} onRetry={fetchRepos} />

        );
    }

    return (
        <div className="page">

            <h1>My Projects</h1>

            <p className="repo-subtitle">
                Live repositories fetched directly from my Github profile.
            </p>

            <div className="search-container">

                <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />

            </div>

            {FilteredRepos.length === 0 ? (
                <p>No repositories found.</p>
            ) : (
                <div className="repo-grid">

                    {FilteredRepos.map((repo) => (
                        <RepoCard
                            key={repo.id}
                            repo={repo}
                        />
                ))}

                </div>
            )}

        </div>
    );
}

export default Projects;