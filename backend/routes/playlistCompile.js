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

// GET all playlist compiles
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Playlist_Compile");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET specific compile by user & playlist
router.get("/:playlistId/:userId", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Playlist_Compile WHERE Playlist_ID = ? AND User_ID = ?",
      [req.params.playlistId, req.params.userId]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Compile not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST create a new compile
router.post("/", async (req, res) => {
  try {
    const { Playlist_ID, User_ID } = req.body;
    if (!Playlist_ID || !User_ID)
      return res.status(400).json({ error: "Playlist_ID and User_ID are required" });

    // Check if already exists
    const [existing] = await pool.query(
      "SELECT * FROM Playlist_Compile WHERE Playlist_ID = ? AND User_ID = ?",
      [Playlist_ID, User_ID]
    );
    if (existing.length > 0)
      return res.status(409).json({ error: "User already compiled this playlist" });

    await pool.query(
      "INSERT INTO Playlist_Compile (Playlist_ID, User_ID) VALUES (?, ?)",
      [Playlist_ID, User_ID]
    );

    res.status(201).json({ message: "Playlist compiled by user" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a compile
router.delete("/", async (req, res) => {
  try {
    const { Playlist_ID, User_ID } = req.body;
    if (!Playlist_ID || !User_ID)
      return res.status(400).json({ error: "Playlist_ID and User_ID are required" });

    const [result] = await pool.query(
      "DELETE FROM Playlist_Compile WHERE Playlist_ID = ? AND User_ID = ?",
      [Playlist_ID, User_ID]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Compile not found" });

    res.json({ message: "Playlist compile removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
