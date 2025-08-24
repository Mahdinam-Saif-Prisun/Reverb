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

// ✅ Get all likes
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Likes");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get all liked songs by a user
router.get("/user/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.Song_ID, s.Title, s.Genre, s.Duration
       FROM Likes l
       JOIN Song s ON l.Song_ID = s.Song_ID
       WHERE l.User_ID = ?`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get all users who liked a song
router.get("/song/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.User_ID, u.Name, u.Email
       FROM Likes l
       JOIN User u ON l.User_ID = u.User_ID
       WHERE l.Song_ID = ?`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Like a song
router.post("/", async (req, res) => {
  try {
    const { User_ID, Song_ID } = req.body;
    if (!User_ID || !Song_ID)
      return res.status(400).json({ error: "User_ID and Song_ID are required" });

    const [result] = await pool.query(
      "INSERT INTO Likes (User_ID, Song_ID) VALUES (?, ?)",
      [User_ID, Song_ID]
    );
    res.status(201).json({ message: "Song liked" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Already liked" });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Unlike a song
router.delete("/", async (req, res) => {
  try {
    const { User_ID, Song_ID } = req.body;
    if (!User_ID || !Song_ID)
      return res.status(400).json({ error: "User_ID and Song_ID are required" });

    const [result] = await pool.query(
      "DELETE FROM Likes WHERE User_ID = ? AND Song_ID = ?",
      [User_ID, Song_ID]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Like not found" });

    res.json({ message: "Song unliked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
