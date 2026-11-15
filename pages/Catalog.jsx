import { useState, useEffect } from "react";

function Catalog() {
    const [games, setGames] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadGames() {
            try {
                const res = await fetch("http://localhost:3001/api/games");
                if (!res.ok) throw new Error("Request failed: " + res.status);
                const data = await res.json();
                setGames(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadGames();
    }, []);

    const filteredGames = games.filter((g) =>
        g.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="page-wrapper">
            <h1>Game Catalog</h1>
            <p>Browse and search for games.</p>

            <input
                type="text"
                placeholder="Search games..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {loading && <p>Loading games...</p>}
            {error && <p>Error: {error}</p>}

            {filteredGames.map((g) => (
                <p key={g.id}>{g.name}</p>
            ))}
        </div>
    );
}

export default Catalog;