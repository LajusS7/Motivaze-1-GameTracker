
function LibraryGameCard({ game, onUpdateStatus, onRemoveGame, onUpdatePlatform, onUpdateHoursPlayed }) {
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

                <label className="field-label">
                    Platform
                    <select
                        value={game.platform}
                        onChange={(e) =>
                            onUpdatePlatform(game._id, e.target.value)
                        }
                    >
                        <option value="Select Platform">Select Platform</option>
                        <option value="PC">PC</option>
                        <option value="Xbox">Xbox</option>
                        <option value="PlayStation">PlayStation</option>
                        <option value="Nintendo Switch">Nintendo Switch</option>
                        <option value="Other">Other</option>
                    </select>
                </label>

                <label className="field-label">
                    Hours Played
                    <input
                        type="number"
                        value={game.hoursPlayed || 0}
                        onChange={(e) =>
                            onUpdateHoursPlayed(game._id, e.target.value)
                        }
                    />
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
