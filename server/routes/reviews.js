
const express = require("express");
const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/db");

const router = express.Router();

// POST: add a review
router.post("/", async (req, res) => {
    try {
        const db = getDatabase();

        const gameId = Number(req.body?.gameId);
        const gameName = String(req.body?.gameName || "").trim();
        const rating = Number(req.body?.rating);
        const reviewText = String(req.body?.reviewText || "").trim();

        if (!Number.isInteger(gameId) || gameId === 0) {
            return res.status(400).json({ message: "A valid game ID is required." });
        }

        if (!gameName) {
            return res.status(400).json({ message: "Game name is required." });
        }

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5." });
        }

        if (!reviewText) {
            return res.status(400).json({ message: "Review text is required." });
        }

        const existingReview = await db.collection("reviews").findOne({
            userId: req.user.id,
            gameId
        });

        if (existingReview) {
            return res.status(409).json({ message: "You have already reviewed this game." });
        }

        const review = {
            userId: req.user.id,
            username: req.user.username,
            gameId,
            gameName,
            rating,
            reviewText,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection("reviews").insertOne(review);

        res.status(201).json({
            ...review,
            _id: result.insertedId.toString(),
            isOwner: true
        });
    } catch (err) {
        console.error("Review submission error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET: get game reviews
router.get("/game/:gameId", async (req, res) => {
    try {
        const db = getDatabase();
        const gameId = Number(req.params.gameId);

        if (!Number.isInteger(gameId) || gameId === 0) {
            return res.status(400).json({ message: "Invalid game ID." });
        }

        const reviews = await db.collection("reviews")
            .find({ gameId })
            .sort({ createdAt: -1 })
            .toArray();

        const formattedReviews = reviews.map((review) => ({
            ...review,
            _id: review._id.toString(),
            isOwner: review.userId === req.user.id
        }));

        res.json(formattedReviews);
    } catch (err) {
        console.error("Review retrieval error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// PUT: edit owned reviews
router.put("/:id", async (req, res) => {
    try {
        const db = getDatabase();
        const id = req.params.id;
        const rating = Number(req.body?.rating);
        const reviewText = String(req.body?.reviewText || "").trim();

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid review ID." });
        }

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5." });
        }

        if (!reviewText) {
            return res.status(400).json({ message: "Review text is required." });
        }

        const result = await db.collection("reviews").updateOne(
            {
                _id: new ObjectId(id),
                userId: req.user.id
            },
            {
                $set: {
                    rating,
                    reviewText,
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Review not found." });
        }

        const updatedReview = await db.collection("reviews").findOne({
            _id: new ObjectId(id),
            userId: req.user.id
        });

        res.json({
            ...updatedReview,
            _id: updatedReview._id.toString(),
            isOwner: true
        });
    } catch (err) {
        console.error("Review update error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE: delete owned reviews
router.delete("/:id", async (req, res) => {
    try {
        const db = getDatabase();
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid review ID." });
        }

        const result = await db.collection("reviews").deleteOne({
            _id: new ObjectId(id),
            userId: req.user.id
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Review not found." });
        }

        res.json({ message: "Review deleted successfully." });
    } catch (err) {
        console.error("Review deletion error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;