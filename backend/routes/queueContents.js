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

// GET all songs in a queue
router.get("/queue/:queueId", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT qc.Queue_ID, qc.Song_ID, qc.Custom_index, s.Title, s.Duration 
       FROM Queue_Contents qc
       JOIN Song s ON qc.Song_ID = s.Song_ID
       WHERE qc.Queue_ID = ?
       ORDER BY qc.Custom_index ASC`,
      [req.params.queueId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST add song to a queue
router.post("/", async (req, res) => {
  try {
    const { Queue_ID, Song_ID, Custom_index } = req.body;

    if (!Queue_ID || !Song_ID)
      return res.status(400).json({ error: "Queue_ID and Song_ID are required" });

    // Check if queue exists
    const [queueRows] = await pool.query(
      "SELECT * FROM Queue WHERE Queue_ID = ?",
      [Queue_ID]
    );
    if (queueRows.length === 0)
      return res.status(404).json({ error: "Queue not found" });

    // Check if song exists
    const [songRows] = await pool.query(
      "SELECT * FROM Song WHERE Song_ID = ?",
      [Song_ID]
    );
    if (songRows.length === 0)
      return res.status(404).json({ error: "Song not found" });

    // Prevent duplicate
    const [existingRows] = await pool.query(
      "SELECT * FROM Queue_Contents WHERE Queue_ID = ? AND Song_ID = ?",
      [Queue_ID, Song_ID]
    );
    if (existingRows.length > 0)
      return res.status(409).json({ error: "Song already in queue" });

    // Insert
    const [result] = await pool.query(
      "INSERT INTO Queue_Contents (Queue_ID, Song_ID, Custom_index) VALUES (?, ?, ?)",
      [Queue_ID, Song_ID, Custom_index || null]
    );

    res.status(201).json({ message: "Song added to queue", Queue_ID, Song_ID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT update song index in a queue
router.put("/", async (req, res) => {
  try {
    const { Queue_ID, Song_ID, Custom_index } = req.body;

    if (!Queue_ID || !Song_ID || Custom_index === undefined)
      return res.status(400).json({ error: "Queue_ID, Song_ID, and Custom_index are required" });

    const [result] = await pool.query(
      `UPDATE Queue_Contents SET Custom_index = ? WHERE Queue_ID = ? AND Song_ID = ?`,
      [Custom_index, Queue_ID, Song_ID]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Song not found in queue" });

    res.json({ message: "Song index updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a song from a queue
router.delete("/", async (req, res) => {
  try {
    const { Queue_ID, Song_ID } = req.body;

    if (!Queue_ID || !Song_ID)
      return res.status(400).json({ error: "Queue_ID and Song_ID are required" });

    const [result] = await pool.query(
      "DELETE FROM Queue_Contents WHERE Queue_ID = ? AND Song_ID = ?",
      [Queue_ID, Song_ID]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Song not found in queue" });

    res.json({ message: "Song removed from queue" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

