import express from "express";
import pool from "../db.js";

const router = express.Router();

// ================== ARTIST ================== //

// POST /auth/artist/register
router.post("/artist/register", async (req, res) => {
  try {
    const { Name, Email, Pass_hash, Country, Bio } = req.body;
    if (!Name || !Email || !Pass_hash) {
      return res.status(400).json({ error: "Name, Email, and Pass_hash are required" });
    }

    const [existing] = await pool.query("SELECT Artist_ID FROM Artist WHERE Email = ?", [Email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const [result] = await pool.query(
      "INSERT INTO Artist (Name, Email, Pass_hash, Country, Bio) VALUES (?, ?, ?, ?, ?)",
      [Name, Email, Pass_hash, Country || null, Bio || null]
    );

    res.status(201).json({
      message: "Artist registered successfully",
      artist: {
        Artist_ID: result.insertId,
        Name,
        Email,
        Country: Country || null,
        Bio: Bio || null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /auth/artist/login
router.post("/artist/login", async (req, res) => {
  try {
    const { Email, Pass_hash } = req.body;
    if (!Email || !Pass_hash) {
      return res.status(400).json({ error: "Email and Pass_hash are required" });
    }

    const [rows] = await pool.query(
      `SELECT Artist_ID, Name, Email, Country, Bio
       FROM Artist
       WHERE Email = ? AND Pass_hash = ?`,
      [Email, Pass_hash]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Do NOT return Pass_hash
    res.json({
      message: "Artist login successful",
      artist: rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================== USER ================== //

// POST /auth/user/register
router.post("/user/register", async (req, res) => {
  try {
    const { Name, Email, Pass_hash, Subscription_type } = req.body;
    if (!Name || !Email || !Pass_hash) {
      return res.status(400).json({ error: "Name, Email, and Pass_hash are required" });
    }

    const [existing] = await pool.query("SELECT User_ID FROM User WHERE Email = ?", [Email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const [result] = await pool.query(
      "INSERT INTO User (Name, Email, Pass_hash, Subscription_type, Role) VALUES (?, ?, ?, ?, 'user')",
      [Name, Email, Pass_hash, Subscription_type || "Free"]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        User_ID: result.insertId,
        Name,
        Email,
        Subscription_type: Subscription_type || "Free",
        Role: "user",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /auth/user/login
router.post("/user/login", async (req, res) => {
  try {
    const { Email, Pass_hash } = req.body;
    if (!Email || !Pass_hash) {
      return res.status(400).json({ error: "Email and Pass_hash are required" });
    }

    const [rows] = await pool.query(
      `SELECT User_ID, Name, Email, Subscription_type, Role
       FROM User
       WHERE Email = ? AND Pass_hash = ?`,
      [Email, Pass_hash]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      message: "User login successful",
      user: rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
