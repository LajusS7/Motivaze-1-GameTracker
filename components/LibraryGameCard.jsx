
function LibraryGameCard({ game, onUpdateStatus, onRemoveGame }) {
    return (
        <article className="card library-card">
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
                            onUpdateStatus(game._id, e.target.value)
                        }
                    >
                        <option value="Want to Play">Want to Play</option>
                        <option value="Playing">Playing</option>
                        <option value="Completed">Completed</option>
                        <option value="Dropped">Dropped</option>
                    </select>
                </label>

                <button
                    type="button"
                    className="btn-danger"
                    onClick={() => onRemoveGame(game._id)}
                >
                    Remove from Library
                </button>
            </div>
        </article>
    );
}

export default LibraryGameCard;
