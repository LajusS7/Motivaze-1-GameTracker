import { useState, useEffect } from "react";
import { api, TOKEN_KEY } from "../lib/api.js";

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
            {message && <p>{message}</p>}

            {filteredGames.map((g) => (
            <div key={g.id}>
                <p>{g.name}</p>

                <button
                    onClick={() => addToLibrary(g)}
                    disabled={
                        libraryGameIds.includes(g.id) ||
                        addingGameId === g.id
                    }
                >
                    {libraryGameIds.includes(g.id)
                        ? "Already in Library"
                        : addingGameId === g.id
                            ? "Adding..."
                            : "Add to Library"}
                </button>

                {" "}

                <button onClick={() => showReviews(g)}>
                    {selectedGame?.id === g.id
                        ? "Hide Reviews"
                        : "View Reviews"}
                </button>

                {selectedGame?.id === g.id && (
                    <div>
                        <h3>Reviews for {g.name}</h3>

                        {reviewLoading && <p>Loading reviews...</p>}
                        {reviewMessage && <p>{reviewMessage}</p>}

                        {!reviewLoading && reviews.length === 0 && (
                            <p>No reviews yet. Be the first to review this game!</p>
                        )}

                        {reviews.map((review) => (
                            <div key={review._id}>
                                <h4>{review.username || "GameTracker user"}</h4>
                                <p>Rating: {review.rating}/5</p>
                                <p>{review.reviewText}</p>

                                {review.isOwner && (
                                    <div>
                                        <button onClick={() => editReview(review)}>
                                            Edit Review
                                        </button>

                                        {" "}

                                        <button onClick={() => deleteReview(review._id)}>
                                            Delete Review
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        <hr />

                        <h3>
                            {editingReviewId ? "Edit Your Review" : "Write a Review"}
                        </h3>

                        <form onSubmit={submitReview}>
                            <label>
                                Rating:{" "}
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                >
                                    <option value="5">5 - Excellent</option>
                                    <option value="4">4 - Great</option>
                                    <option value="3">3 - Average</option>
                                    <option value="2">2 - Poor</option>
                                    <option value="1">1 - Terrible</option>
                                </select>
                            </label>

                            <p>
                                <textarea
                                    placeholder="Write your review..."
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    rows="4"
                                    required
                                />
                            </p>

                            <button type="submit" disabled={submittingReview}>
                                {submittingReview
                                    ? "Saving..."
                                    : editingReviewId
                                        ? "Save Changes"
                                        : "Submit Review"}
                            </button>

                            {editingReviewId && (
                                <button type="button" onClick={cancelEdit}>
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>
                )}

                <hr />
            </div>
        ))}
        </div>
    );
}

export default Catalog;