require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { connectToDatabase, getDatabase } = require("./config/db");

const authRoutes = require("./routes/auth");
const requireAuth = require("./middleware/requireAuth");

const libraryRoutes = require("./routes/library");
const reviewRoutes = require("./routes/reviews");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/library", requireAuth, libraryRoutes);
app.use("/api/reviews", requireAuth, reviewRoutes);

app.get("/api/dashboard", requireAuth, (req, res) => {
  res.json({ message: `Signed in as ${req.user.username}. Your backlog will appear here.` });
});

app.get("/api/games", async (req, res) => {
  try {
    const db = getDatabase();

    const response = await fetch(
      `https://api.rawg.io/api/games?key=${process.env.RAWG_KEY}`
    );
    if (!response.ok) {
      return res.status(502).json({ error: "RAWG request failed" });
    }
    const data = await response.json();
    const customGames = await db.collection("games")
      .find({ isCustom: true })
      .sort({ createdAt: -1})
      .toArray()

    const formattedCustomGames = customGames.map((game) => ({
      id: game.id,
      name: game.name,
      background_image: game.background_image || "",
      isCustom:true
    }));

    res.json([...data.results, ...formattedCustomGames]);
  } catch (err) {
    console.error("Could not retrieve games:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/games", requireAuth, async (req,res) => {
  try {
    const db = getDatabase();
    const gamesCollection = db.collection("games");

    const name = String(req.body?.name || "").trim();

    if (!name) {
      return res.status(400).json({ message: "Game name is required!"});
    }

    const nameLower = name.toLowerCase();

    const existingGame = await gamesCollection.findOne({
      isCustom: true,
      nameLower
    });

    if (existingGame) {
      return res.status(409).json({
        message: "This custom game already exists."
      });
    }

    let gameId = 100000000;

    while (await gamesCollection.findOne({ id: gameId })) {
      gameId++;
    }

    const newGame = {
      id: gameId,
      name,
      nameLower,
      background_image: "",
      isCustom: true,
      createdBy: req.user.id,
      createdAt: new Date()
    };

    await gamesCollection.insertOne(newGame);

    res.status(201).json({
      id: newGame.id,
      name: newGame.name,
      background_image: newGame.background_image,
      isCustom: true
    });
  } catch (err) {
    console.error("Could not add custom game:", err);
    res.status(500).json({message: "Server error while adding game!"});
  }
});

async function startServer() {
  try {
    await connectToDatabase();

    app.listen(3001, () => {
      console.log("API running on http://localhost:3001");
    });
  } catch (error) {
    console.error("Could not start server:", error);
    process.exit(1);
  }
}

startServer();
