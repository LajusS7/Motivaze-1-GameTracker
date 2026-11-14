
import { useState, useEffect } from "react";

function Catalog() {

    const [games, setGames] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function loadGames() {
            const res = await fetch("https://api.rawg.io/api/games?key=fd338b93143d45a3bca11baec9a3124e");
            const data = await res.json();
            setGames(data.results);
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

            {filteredGames.map((g) => (
                <p key={g.id}>{g.name}</p>
            ))}
        </div>
    );
}

export default Catalog;

