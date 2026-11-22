function GameCard({
    game,
    inLibrary,
    adding,
    onAddToLibrary,
    isSelected,
    onToggleReviews,
    reviews,
    reviewLoading,
    reviewMessage,
    rating,
    setRating,
    reviewText,
    setReviewText,
    editingReviewId,
    submittingReview,
    onSubmitReview,
    onEditReview,
    onDeleteReview,
    onCancelEdit
}) {
    return (
        <article className="card game-card">
            <div className="game-row">
                <h3 className="game-name">{game.name}</h3>

                <div className="actions">
                    <button
                        type="button"
                        onClick={onAddToLibrary}
                        disabled={inLibrary || adding}
                    >
                        {inLibrary
                            ? "Already in Library"
                            : adding
                                ? "Adding..."
                                : "Add to Library"}
                    </button>

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={onToggleReviews}
                    >
                        {isSelected ? "Hide Reviews" : "View Reviews"}
                    </button>
                </div>
            </div>

            {isSelected && (
                <div className="reviews">
                    <h3>Reviews for {game.name}</h3>

                    {reviewLoading && (
                        <p className="notice">Loading reviews...</p>
                    )}

                    {reviewMessage && (
                        <p className="notice">{reviewMessage}</p>
                    )}

                    {!reviewLoading && reviews.length === 0 && (
                        <p className="muted">
                            No reviews yet. Be the first to review this game!
                        </p>
                    )}

                    {reviews.map((review) => (
                        <div className="review" key={review._id}>
                            <div className="review-head">
                                <h4>{review.username || "GameTracker user"}</h4>
                                <span className="chip">
                                    Rating: {review.rating}/5
                                </span>
                            </div>

                            <p>{review.reviewText}</p>

                            {review.isOwner && (
                                <div className="actions">
                                    <button
                                        type="button"
                                        className="btn-secondary btn-small"
                                        onClick={() => onEditReview(review)}
                                    >
                                        Edit Review
                                    </button>

                                    <button
                                        type="button"
                                        className="btn-danger btn-small"
                                        onClick={() => onDeleteReview(review._id)}
                                    >
                                        Delete Review
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    <form className="review-form" onSubmit={onSubmitReview}>
                        <h3>
                            {editingReviewId
                                ? "Edit Your Review"
                                : "Write a Review"}
                        </h3>

                        <label className="field-label">
                            Rating
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

                        <textarea
                            placeholder="Write your review..."
                            aria-label="Review text"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows="4"
                            required
                        />

                        <div className="actions">
                            <button type="submit" disabled={submittingReview}>
                                {submittingReview
                                    ? "Saving..."
                                    : editingReviewId
                                        ? "Save Changes"
                                        : "Submit Review"}
                            </button>

                            {editingReviewId && (
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={onCancelEdit}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </article>
    );
}

export default GameCard;