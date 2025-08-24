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

// GET all artists for a song
router.get("/song/:songId", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.Song_ID, c.Artist_ID, a.Name 
       FROM Compose c
       JOIN Artist a ON c.Artist_ID = a.Artist_ID
       WHERE c.Song_ID = ?`,
      [req.params.songId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all songs by an artist
router.get("/artist/:artistId", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.Artist_ID, c.Song_ID, s.Title 
       FROM Compose c
       JOIN Song s ON c.Song_ID = s.Song_ID
       WHERE c.Artist_ID = ?`,
      [req.params.artistId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST add an artist to a song
router.post("/", async (req, res) => {
  try {
    const { Song_ID, Artist_ID } = req.body;

    if (!Song_ID || !Artist_ID)
      return res.status(400).json({ error: "Song_ID and Artist_ID are required" });

    // Check if song exists
    const [songRows] = await pool.query(
      "SELECT * FROM Song WHERE Song_ID = ?",
      [Song_ID]
    );
    if (songRows.length === 0)
      return res.status(404).json({ error: "Song not found" });

    // Check if artist exists
    const [artistRows] = await pool.query(
      "SELECT * FROM Artist WHERE Artist_ID = ?",
      [Artist_ID]
    );
    if (artistRows.length === 0)
      return res.status(404).json({ error: "Artist not found" });

    // Prevent duplicate
    const [existingRows] = await pool.query(
      "SELECT * FROM Compose WHERE Song_ID = ? AND Artist_ID = ?",
      [Song_ID, Artist_ID]
    );
    if (existingRows.length > 0)
      return res.status(409).json({ error: "Artist already composed this song" });

    const [result] = await pool.query(
      "INSERT INTO Compose (Song_ID, Artist_ID) VALUES (?, ?)",
      [Song_ID, Artist_ID]
    );

    res.status(201).json({ message: "Artist added to song", Song_ID, Artist_ID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE an artist from a song
router.delete("/", async (req, res) => {
  try {
    const { Song_ID, Artist_ID } = req.body;

    if (!Song_ID || !Artist_ID)
      return res.status(400).json({ error: "Song_ID and Artist_ID are required" });

    const [result] = await pool.query(
      "DELETE FROM Compose WHERE Song_ID = ? AND Artist_ID = ?",
      [Song_ID, Artist_ID]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Artist not found for this song" });

    res.json({ message: "Artist removed from song" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
