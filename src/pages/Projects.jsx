import { useState, useEffect } from "react";

import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import RepoCard from "../components/RepoCard";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

import { getTasks } from "../api";

function Projects() {

    /* =====================================================
       GITHUB REPOSITORIES
       ===================================================== */

    const [repos, setRepos] = useState([]);

    const [repoLoading, setRepoLoading] = useState(true);
    const [repoError, setRepoError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");


    /* =====================================================
       MONGODB TASKS
       ===================================================== */

    const [tasks, setTasks] = useState([]);

    const [taskLoading, setTaskLoading] = useState(true);
    const [taskError, setTaskError] = useState(null);


    /* =====================================================
       GITHUB FETCH
       ===================================================== */

    const fetchRepos = () => {

        setRepoLoading(true);
        setRepoError(null);

        fetch("https://api.github.com/users/HetGangani/repos")

            .then((response) => {

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch repositories."
                    );
                }

                return response.json();
            })

            .then((data) => {
                setRepos(data);
            })

            .catch((err) => {
                setRepoError(err.message);
            })

            .finally(() => {
                setRepoLoading(false);
            });
    };


    /* =====================================================
       TASK FETCH
       ===================================================== */

    const fetchTasks = async () => {

        setTaskLoading(true);
        setTaskError(null);
        try {
            const data = await getTasks();
            // Handle different possible API response formats
            if (Array.isArray(data)) {
                setTasks(data);
            } else if (Array.isArray(data.tasks)) {
                setTasks(data.tasks);
            } else if (Array.isArray(data.data)) {
                setTasks(data.data);
            } else {
                setTasks([]);
            }
        } catch (err) {
            setTaskError(err.message);
        } finally {
            setTaskLoading(false);
        }
    };


    useEffect(() => {

        fetchRepos();
        fetchTasks();

    }, []);


    /* =====================================================
       REPOSITORY SEARCH
       ===================================================== */

    const filteredRepos = repos.filter((repo) =>
        repo.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );


    /* =====================================================
       TASK OPTIMISTIC CREATE
       ===================================================== */

    const handleTaskOptimistic = (task) => {

        setTasks((currentTasks) => [
            task,
            ...currentTasks
        ]);

    };


    const handleTaskCreated = (
        createdTask,
        temporaryId
    ) => {

        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task._id === temporaryId
                    ? createdTask
                    : task
            )
        );

    };


    const handleTaskCreationFailed = (
        temporaryId
    ) => {

        setTasks((currentTasks) =>
            currentTasks.filter(
                (task) => task._id !== temporaryId
            )
        );

    };


    /* =====================================================
       TASK UPDATE
       ===================================================== */

    const handleTaskUpdated = (updatedTask) => {

        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task._id === updatedTask._id
                    ? updatedTask
                    : task
            )
        );

    };


    /* =====================================================
       TASK DELETE
       ===================================================== */

    const handleTaskDeleted = (deletedTaskId) => {

        setTasks((currentTasks) =>
            currentTasks.filter(
                (task) => task._id !== deletedTaskId
            )
        );

    };


    /* =====================================================
       PAGE
       ===================================================== */

    return (
        <div className="page">

            {/* =================================================
                PROJECTS
               ================================================= */}

            <h1>My Projects</h1>

            <p className="repo-subtitle">
                Live repositories fetched directly from my
                GitHub profile.
            </p>


            {/* Repository Search */}

            <div className="search-container">

                <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    className="search-input"
                />

            </div>


            {/* Repository Loading */}

            {repoLoading ? (

                <Spinner />

            ) : repoError ? (

                <ErrorMessage
                    message={repoError}
                    onRetry={fetchRepos}
                />

            ) : filteredRepos.length === 0 ? (

                <p>No repositories found.</p>

            ) : (

                <div className="repo-grid">

                    {filteredRepos.map((repo) => (

                        <RepoCard
                            key={repo.id}
                            repo={repo}
                        />

                    ))}

                </div>

            )}


            {/* =================================================
                TASKS
               ================================================= */}

            <div className="projects-task-section">

                <h2 className="tasks-heading">
                    My Tasks
                </h2>

                <p className="repo-subtitle">
                    Tasks managed through my Express and
                    MongoDB backend.
                </p>


                {/* Task Form */}

                <TaskForm
                    onTaskOptimistic={handleTaskOptimistic}
                    onTaskCreated={handleTaskCreated}
                    onTaskCreationFailed={
                        handleTaskCreationFailed
                    }
                />


                {/* Task Loading */}

                {taskLoading ? (

                    <Spinner />

                ) : taskError ? (

                    <ErrorMessage
                        message={taskError}
                        onRetry={fetchTasks}
                    />

                ) : tasks.length === 0 ? (

                    <p>No tasks found.</p>

                ) : (

                    <div className="repo-grid">

                        {tasks.map((task) => (

                            <TaskCard
                                key={task._id}
                                task={task}
                                onTaskUpdated={
                                    handleTaskUpdated
                                }
                                onTaskDeleted={
                                    handleTaskDeleted
                                }
                            />

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default Projects;