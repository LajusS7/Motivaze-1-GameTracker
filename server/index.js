require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/games", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${process.env.RAWG_KEY}`
    );
    if (!response.ok) {
      return res.status(502).json({ error: "RAWG request failed" });
    }
    const data = await response.json();
    res.json(data.results);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3001, () => console.log("API running on http://localhost:3001"));