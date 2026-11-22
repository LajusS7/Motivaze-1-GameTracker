import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function Dashboard() {
    const { user } = useAuth();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [games, setGames] = useState([]);
    const [actionMessage, setActionMessage] = useState("");

    useEffect(() => {
        async function loadDashboard() {
            try {
                const dashboardData = await api("/api/dashboard");
                setMessage(dashboardData.message);

                const libraryData = await api("/api/library");
                setGames(libraryData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadDashboard();
    }, []);

    async function updateStatus(id, status) {
        setActionMessage("");
        setError("");

        try {
            const updatedGame = await api(`/api/library/${id}`, {
                method: "PUT",
                body: { status }
            });

            setGames((previous) =>
                previous.map((game) =>
                    game._id === id ? updatedGame : game
                )
            );

            setActionMessage("Game status updated successfully!");
        } catch (err) {
            setError(err.message);
        }
    }

    async function removeGame(id) {
        const confirmed = window.confirm(
            "Are you sure you want to remove this game from your library?"
        );

        if (!confirmed) return;

        setActionMessage("");
        setError("");

        try {
            await api(`/api/library/${id}`, {
                method: "DELETE"
            });

            setGames((previous) =>
                previous.filter((game) => game._id !== id)
            );

            setActionMessage("Game removed from your library.");
        } catch (err) {
            setError(err.message);
        }
    }


    return (
        <div className="page-wrapper">
            <h1>Workspace Dashboard</h1>
            <p className="lead">Welcome back, {user?.username}.</p>

            {loading && <p className="notice">Loading dashboard...</p>}
            {error && <p className="notice error" role="alert">Error: {error}</p>}
            {message && <p className="notice">{message}</p>}
            {actionMessage && <p className="notice success">{actionMessage}</p>}

            {!loading && (
                <section>
                    <div className="section-head">
                        <h2>My Game Library</h2>
                        <span className="chip">Total Games: {games.length}</span>
                    </div>

                    {games.length === 0 ? (
                        <p className="notice">
                            Your library is empty. Visit the Catalog to add games!
                        </p>
                    ) : (
                        <div className="library-grid">
                            {games.map((game) => (
                                <article className="card library-card" key={game._id}>
                                    {game.gameImage && (
                                        <img
                                            className="library-img"
                                            src={game.gameImage}
                                            alt={game.gameName}
                                        />
                                    )}

                                    <div className="library-body">
                                        <h3>{game.gameName}</h3>

                                        <label className="field-label">
                                            Status
                                            <select
                                                value={game.status}
                                                onChange={(e) =>
                                                    updateStatus(
                                                        game._id,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="Want to Play">
                                                    Want to Play
                                                </option>
                                                <option value="Playing">
                                                    Playing
                                                </option>
                                                <option value="Completed">
                                                    Completed
                                                </option>
                                                <option value="Dropped">
                                                    Dropped
                                                </option>
                                            </select>
                                        </label>

                                        <button
                                            className="btn-danger"
                                            onClick={() => removeGame(game._id)}
                                        >
                                            Remove from Library
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}

export default Dashboard;
