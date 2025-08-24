import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// GET all ratings
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Rate");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET rating by user & song
router.get("/:userId/:songId", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Rate WHERE User_ID = ? AND Song_ID = ?",
      [req.params.userId, req.params.songId]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Rating not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST create/update rating
router.post("/", async (req, res) => {
  try {
    const { User_ID, Song_ID, Rating } = req.body;
    if (!User_ID || !Song_ID || Rating === undefined)
      return res.status(400).json({ error: "User_ID, Song_ID, and Rating are required" });
    if (Rating < 1 || Rating > 5)
      return res.status(400).json({ error: "Rating must be between 1 and 5" });

    // Check if exists
    const [existing] = await pool.query(
      "SELECT * FROM Rate WHERE User_ID = ? AND Song_ID = ?",
      [User_ID, Song_ID]
    );

    if (existing.length > 0) {
      await pool.query(
        "UPDATE Rate SET Rating = ? WHERE User_ID = ? AND Song_ID = ?",
        [Rating, User_ID, Song_ID]
      );
      return res.json({ message: "Rating updated" });
    }

    await pool.query(
      "INSERT INTO Rate (User_ID, Song_ID, Rating) VALUES (?, ?, ?)",
      [User_ID, Song_ID, Rating]
    );
    res.status(201).json({ message: "Rating created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a rating
router.delete("/", async (req, res) => {
  try {
    const { User_ID, Song_ID } = req.body;
    if (!User_ID || !Song_ID)
      return res.status(400).json({ error: "User_ID and Song_ID are required" });

    const [result] = await pool.query(
      "DELETE FROM Rate WHERE User_ID = ? AND Song_ID = ?",
      [User_ID, Song_ID]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Rating not found" });

    res.json({ message: "Rating deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
