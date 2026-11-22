
const express = require("express");
const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/db");

const router = express.Router();

const VALID_STATUSES = [
    "Want to Play",
    "Playing",
    "Completed",
    "Dropped"
];

// GET: get user library
router.get("/", async (req, res) => {
    try {
        const db = getDatabase();

        const entries = await db.collection("libraryEntries")
            .find({ userId: req.user.id })
            .sort({ addedAt: -1 })
            .toArray();

        const library = entries.map((entry) => ({
            ...entry,
            _id: entry._id.toString()
        }));

        res.json(library);
    } catch (err) {
        console.error("Library retrieval error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST: add to game library
router.post("/", async (req, res) => {
    try {
        const db = getDatabase();

        const gameId = Number(req.body?.gameId);
        const gameName = String(req.body?.gameName || "").trim();
        const gameImage = String(req.body?.gameImage || "");
        const status = req.body?.status || "Want to Play";
        const platform = req.body?.platform || "Select Platform";
        const hours = req.body?.hours || 0;

        if (!Number.isInteger(gameId) || gameId === 0) {
            return res.status(400).json({ message: "A valid game ID is required." });
        }

        if (!gameName) {
            return res.status(400).json({ message: "Game name is required." });
        }

        if (!VALID_STATUSES.includes(status)) {
            return res.status(400).json({ message: "Invalid game status." });
        }

        const existingGame = await db.collection("libraryEntries").findOne({
            userId: req.user.id,
            gameId
        });

        if (existingGame) {
            return res.status(409).json({ message: "Game already exists in your library." });
        }

        const entry = {
            userId: req.user.id,
            gameId,
            gameName,
            gameImage,
            status,
            platform,
            hours,
            addedAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection("libraryEntries").insertOne(entry);

        res.status(201).json({
            ...entry,
            _id: result.insertedId.toString()
        });
    } catch (err) {
        console.error("Library addition error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// PUT: update a game status
router.put("/:id", async (req, res) => {
    try {
        const db = getDatabase();
        const id = req.params.id;
        const status = req.body?.status;
        const platform = req.body?.platform;
        const hours = req.body?.hours;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid library entry ID." });
        }

        if (!VALID_STATUSES.includes(status)) {
            return res.status(400).json({ message: "Invalid game status." });
        }
        
        const result = await db.collection("libraryEntries").updateOne(
            {
                _id: new ObjectId(id),
                userId: req.user.id
            },
            {
                $set: {
                    status,
                    platform,
                    hours: Number(hours),
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Library entry not found." });
        }

        const updatedEntry = await db.collection("libraryEntries").findOne({
            _id: new ObjectId(id),
            userId: req.user.id
        });

        res.json({
            ...updatedEntry,
            _id: updatedEntry._id.toString()
        });
    } catch (err) {
        console.error("Library update error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE: remove a game from library
router.delete("/:id", async (req, res) => {
    try {
        const db = getDatabase();
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid library entry ID." });
        }

        const result = await db.collection("libraryEntries").deleteOne({
            _id: new ObjectId(id),
            userId: req.user.id
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Library entry not found." });
        }

        res.json({ message: "Game removed from library." });
    } catch (err) {
        console.error("Library deletion error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
