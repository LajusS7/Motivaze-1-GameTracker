import { useState, useEffect } from "react";
import { api, TOKEN_KEY } from "../lib/api.js";
import GameCard from "../components/GameCard";

function Catalog() {
    const [games, setGames] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [libraryGameIds, setLibraryGameIds] = useState([]);
    const [addingGameId, setAddingGameId] = useState(null);
    const [message, setMessage] = useState("");

    const [selectedGame, setSelectedGame] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewMessage, setReviewMessage] = useState("");

    const [rating, setRating] = useState("5");
    const [reviewText, setReviewText] = useState("");
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [submittingReview, setSubmittingReview] = useState(false);

    const [newGameName, setNewGameName] = useState("");
    const [addingNewGame, setAddingNewGame] = useState(false);
    const [addGameMessage, setAddGameMessage] = useState("");

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

        async function loadLibrary() {
            if (!localStorage.getItem(TOKEN_KEY)) return;

            try {
                const data = await api("/api/library");
                setLibraryGameIds(data.map((entry) => entry.gameId));
            } catch (err) {
                console.error("Could not load library:", err.message);
            }
        }

        loadGames();
        loadLibrary();
    }, []);

    const filteredGames = games.filter((g) =>
        g.name.toLowerCase().includes(search.toLowerCase())
    );

    async function addToLibrary(game) {
        setAddingGameId(game.id);
        setMessage("");

        try {
            await api("/api/library", {
                method: "POST",
                body: {
                    gameId: game.id,
                    gameName: game.name,
                    gameImage: game.background_image || "",
                    status: "Want to Play"
                }
            });

            setLibraryGameIds((previous) => [...previous, game.id]);
            setMessage(game.name + " was added to your library!");
        } catch (err) {
            if (err.status === 409) {
                setLibraryGameIds((previous) =>
                    previous.includes(game.id) ? previous : [...previous, game.id]
                );
                setMessage(game.name + " is already in your library.");
            } else if (err.status === 401) {
                setMessage("Please log in before adding games to your library.");
            } else {
                setMessage("Could not add game: " + err.message);
            }
        } finally {
            setAddingGameId(null);
        }
    }

    async function showReviews(game) {
        if (selectedGame?.id === game.id) {
            setSelectedGame(null);
            setReviews([]);
            setReviewMessage("");
            cancelEdit();
            return;
        }

        if (!localStorage.getItem(TOKEN_KEY)) {
            setReviewMessage("Please log in to view and submit reviews.");
            return;
        }

        setSelectedGame(game);
        setReviews([]);
        setReviewMessage("");
        setReviewLoading(true);
        cancelEdit();

        try {
            const data = await api(`/api/reviews/game/${game.id}`);
            setReviews(data);
        } catch (err) {
            setReviewMessage("Could not load reviews: " + err.message);
        } finally {
            setReviewLoading(false);
        }
    }

    function cancelEdit() {
        setEditingReviewId(null);
        setRating("5");
        setReviewText("");
    }

    async function submitReview(e) {
        e.preventDefault();
        setReviewMessage("");

        if (!selectedGame) return;

        if (!reviewText.trim()) {
            setReviewMessage("Please enter some review text.");
            return;
        }

        setSubmittingReview(true);

        try {
            if (editingReviewId) {
                const updatedReview = await api(
                    `/api/reviews/${editingReviewId}`,
                    {
                        method: "PUT",
                        body: {
                            rating: Number(rating),
                            reviewText
                        }
                    }
                );

                setReviews((previous) =>
                    previous.map((review) =>
                        review._id === editingReviewId ? updatedReview : review
                    )
                );

                setReviewMessage("Your review was updated successfully.");
            } else {
                const newReview = await api("/api/reviews", {
                    method: "POST",
                    body: {
                        gameId: selectedGame.id,
                        gameName: selectedGame.name,
                        rating: Number(rating),
                        reviewText
                    }
                });

                setReviews((previous) => [newReview, ...previous]);
                setReviewMessage("Your review was submitted successfully.");
            }

            cancelEdit();
        } catch (err) {
            setReviewMessage("Could not save review: " + err.message);
        } finally {
            setSubmittingReview(false);
        }
    }

    function editReview(review) {
        setEditingReviewId(review._id);
        setRating(String(review.rating));
        setReviewText(review.reviewText);
        setReviewMessage("");
    }

    async function deleteReview(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete your review?"
        );

        if (!confirmed) return;

        setReviewMessage("");

        try {
            await api(`/api/reviews/${id}`, {
                method: "DELETE"
            });

            setReviews((previous) =>
                previous.filter((review) => review._id !== id)
            );

            if (editingReviewId === id) {
                cancelEdit();
            }

            setReviewMessage("Your review was deleted successfully.");
        } catch (err) {
            setReviewMessage("Could not delete review: " + err.message);
        }
    }

    async function addNewGame(e) {
        e.preventDefault();
        setAddGameMessage("");

        if (!newGameName.trim()) {
            setAddGameMessage("Enter Game Name");
            return;
        }

        if (games.some((g) =>
            g.name.toLowerCase() === newGameName.trim().toLowerCase()
        )) {
            setAddGameMessage("Game Already Exists In Catalog");
            return;
        }

        setAddingNewGame(true);

        try {
            const newGame = await api("/api/games", {
                method: "POST",
                body: {
                    name: newGameName.trim()
                }
            });

            setGames((previous) => [...previous, newGame]);
            setNewGameName("");
            setAddGameMessage("Game Added Successfully!");
        } catch (err) {
            setAddGameMessage("Game Adding Failed: " + err.message);
        } finally {
            setAddingNewGame(false);
        }
    }

    return (
        <div className="page-wrapper">
            <h1>Game Catalog</h1>
            <p className="lead">Browse and search for games.</p>

            <input
                className="search-input"
                type="text"
                placeholder="Search games..."
                aria-label="Search games"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <section className="card add-game">
                <h3>Can't find a game?</h3>

                <form className="inline-form" onSubmit={addNewGame}>
                    <input
                        type="text"
                        placeholder="Enter Game Name"
                        aria-label="New game name"
                        value={newGameName}
                        onChange={(e) => setNewGameName(e.target.value)}
                    />

                    <button type="submit" disabled={addingNewGame}>
                        {addingNewGame ? "Adding..." : "Add Game"}
                    </button>
                </form>

                {addGameMessage && <p className="notice">{addGameMessage}</p>}
            </section>

            {loading && <p className="notice">Loading games...</p>}
            {error && <p className="notice error" role="alert">Error: {error}</p>}
            {message && <p className="notice">{message}</p>}

            <div className="game-list">
                {filteredGames.map((game) => (
                    <GameCard
                        key={game.id}
                        game={game}
                        inLibrary={libraryGameIds.includes(game.id)}
                        adding={addingGameId === game.id}
                        onAddToLibrary={() => addToLibrary(game)}
                        isSelected={selectedGame?.id === game.id}
                        onToggleReviews={() => showReviews(game)}
                        reviews={reviews}
                        reviewLoading={reviewLoading}
                        reviewMessage={reviewMessage}
                        rating={rating}
                        setRating={setRating}
                        reviewText={reviewText}
                        setReviewText={setReviewText}
                        editingReviewId={editingReviewId}
                        submittingReview={submittingReview}
                        onSubmitReview={submitReview}
                        onEditReview={editReview}
                        onDeleteReview={deleteReview}
                        onCancelEdit={cancelEdit}
                    />
                ))}
            </div>
        </div>
    );
}

export default Catalog;
