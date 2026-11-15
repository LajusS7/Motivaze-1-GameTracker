const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findByUsername, createUser } = require("../store/userStore");

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { sub: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
}

router.post("/register", async (req, res) => {
  try {
    const username = String(req.body?.username || "").trim();
    const password = String(req.body?.password || "");

    if (username.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters." });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }
    if (await findByUsername(username)) {
      return res.status(409).json({ message: "Username already taken." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ username, passwordHash });

    res.status(201).json({ token: signToken(user), user: { username: user.username } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const username = String(req.body?.username || "").trim();
    const password = String(req.body?.password || "");

    const user = await findByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ token: signToken(user), user: { username: user.username } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
