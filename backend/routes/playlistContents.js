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

// GET all songs in a playlist
router.get("/playlist/:playlistId", async (req, res) => {
  try {
    const playlistId = req.params.playlistId;
    const [rows] = await pool.query(
      `SELECT pc.Playlist_ID, pc.Song_ID, pc.Custom_index, s.Title, s.Duration 
       FROM Playlist_Contents pc 
       JOIN Song s ON pc.Song_ID = s.Song_ID 
       WHERE pc.Playlist_ID = ? 
       ORDER BY pc.Custom_index ASC`,
      [playlistId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST add song to playlist
router.post("/", async (req, res) => {
  try {
    const body = req.body || {};
    const Playlist_ID = body.Playlist_ID;
    const Song_ID = body.Song_ID;
    const Custom_index = body.Custom_index || null;

    if (!Playlist_ID || !Song_ID) {
      return res.status(400).json({ error: "Playlist_ID and Song_ID are required" });
    }

    // Check playlist exists
    const [playlistRows] = await pool.query("SELECT * FROM Playlist WHERE Playlist_ID = ?", [Playlist_ID]);
    if (!playlistRows.length) return res.status(404).json({ error: "Playlist not found" });

    // Check song exists
    const [songRows] = await pool.query("SELECT * FROM Song WHERE Song_ID = ?", [Song_ID]);
    if (!songRows.length) return res.status(404).json({ error: "Song not found" });

    // Prevent duplicate
    const [existingRows] = await pool.query(
      "SELECT * FROM Playlist_Contents WHERE Playlist_ID = ? AND Song_ID = ?",
      [Playlist_ID, Song_ID]
    );
    if (existingRows.length) return res.status(409).json({ error: "Song already in playlist" });

    // Insert
    await pool.query(
      "INSERT INTO Playlist_Contents (Playlist_ID, Song_ID, Custom_index) VALUES (?, ?, ?)",
      [Playlist_ID, Song_ID, Custom_index]
    );

    res.status(201).json({ message: "Song added to playlist", Playlist_ID, Song_ID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT update song index in a playlist
router.put("/", async (req, res) => {
  try {
    const body = req.body || {};
    const Playlist_ID = body.Playlist_ID;
    const Song_ID = body.Song_ID;
    const Custom_index = body.Custom_index;

    if (!Playlist_ID || !Song_ID || Custom_index === undefined) {
      return res.status(400).json({ error: "Playlist_ID, Song_ID, and Custom_index are required" });
    }

    const [result] = await pool.query(
      "UPDATE Playlist_Contents SET Custom_index = ? WHERE Playlist_ID = ? AND Song_ID = ?",
      [Custom_index, Playlist_ID, Song_ID]
    );

    if (!result.affectedRows) return res.status(404).json({ error: "Song not found in playlist" });

    res.json({ message: "Song index updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a song from a playlist
router.delete("/", async (req, res) => {
  try {
    const body = req.body || {};
    const Playlist_ID = body.Playlist_ID;
    const Song_ID = body.Song_ID;

    if (!Playlist_ID || !Song_ID) return res.status(400).json({ error: "Playlist_ID and Song_ID are required" });

    const [result] = await pool.query(
      "DELETE FROM Playlist_Contents WHERE Playlist_ID = ? AND Song_ID = ?",
      [Playlist_ID, Song_ID]
    );

    if (!result.affectedRows) return res.status(404).json({ error: "Song not found in playlist" });

    res.json({ message: "Song removed from playlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
