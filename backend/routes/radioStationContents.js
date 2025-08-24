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

// GET all songs in a radio station
router.get("/station/:stationId", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT rsc.Station_ID, rsc.Song_ID, s.Title, s.Duration 
       FROM Radio_Station_Contents rsc
       JOIN Song s ON rsc.Song_ID = s.Song_ID
       WHERE rsc.Station_ID = ?`,
      [req.params.stationId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST add a song to a radio station
router.post("/", async (req, res) => {
  try {
    const { Station_ID, Song_ID } = req.body;

    if (!Station_ID || !Song_ID)
      return res.status(400).json({ error: "Station_ID and Song_ID are required" });

    // Check if Station exists
    const [stationRows] = await pool.query(
      "SELECT * FROM Radio_Station WHERE Station_ID = ?",
      [Station_ID]
    );
    if (stationRows.length === 0)
      return res.status(404).json({ error: "Radio station not found" });

    // Check if Song exists
    const [songRows] = await pool.query(
      "SELECT * FROM Song WHERE Song_ID = ?",
      [Song_ID]
    );
    if (songRows.length === 0)
      return res.status(404).json({ error: "Song not found" });

    // Prevent duplicate
    const [existingRows] = await pool.query(
      "SELECT * FROM Radio_Station_Contents WHERE Station_ID = ? AND Song_ID = ?",
      [Station_ID, Song_ID]
    );
    if (existingRows.length > 0)
      return res.status(409).json({ error: "Song already in radio station" });

    const [result] = await pool.query(
      "INSERT INTO Radio_Station_Contents (Station_ID, Song_ID) VALUES (?, ?)",
      [Station_ID, Song_ID]
    );

    res.status(201).json({ message: "Song added to radio station", Station_ID, Song_ID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a song from a radio station
router.delete("/", async (req, res) => {
  try {
    const { Station_ID, Song_ID } = req.body;

    if (!Station_ID || !Song_ID)
      return res.status(400).json({ error: "Station_ID and Song_ID are required" });

    const [result] = await pool.query(
      "DELETE FROM Radio_Station_Contents WHERE Station_ID = ? AND Song_ID = ?",
      [Station_ID, Song_ID]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Song not found in radio station" });

    res.json({ message: "Song removed from radio station" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
