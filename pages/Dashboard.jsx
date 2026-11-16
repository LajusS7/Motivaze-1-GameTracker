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
            <p>Welcome back, {user?.username}.</p>

            {loading && <p>Loading dashboard...</p>}
            {error && <p role="alert">Error: {error}</p>}
            {message && <p>{message}</p>}
            {actionMessage && <p>{actionMessage}</p>}

            {!loading && (
                <div>
                    <h2>My Game Library</h2>

                    <p>Total Games: {games.length}</p>

                    {games.length === 0 ? (
                        <p>Your library is empty. Visit the Catalog to add games!</p>
                    ) : (
                        games.map((game) => (
                            <div key={game._id}>
                                {game.gameImage && (
                                    <img
                                        src={game.gameImage}
                                        alt={game.gameName}
                                        width="150"
                                    />
                                )}

                                <h3>{game.gameName}</h3>

                                <label>
                                    Status:{" "}
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
                                    </select>
                                </label>

                                <p>
                                    <button
                                        onClick={() => removeGame(game._id)}
                                    >
                                        Remove from Library
                                    </button>
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default Dashboard;

