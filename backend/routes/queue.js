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

//CREATE a new queue
router.post("/", async (req, res) => {
  try {
    const { User_ID, Incognito } = req.body;

    if (!User_ID) return res.status(400).json({ error: "User_ID is required" });

    // Optional default for Incognito
    const [result] = await pool.query(
      "INSERT INTO Queue (User_ID, Incognito) VALUES (?, ?)",
      [User_ID, Incognito || 0]
    );

    res.status(201).json({ message: "Queue created", Queue_ID: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//GET all queues for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const [queues] = await pool.query("SELECT * FROM Queue WHERE User_ID = ?", [userId]);
    res.json(queues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//GET a specific queue with songs
router.get("/:queueId", async (req, res) => {
  try {
    const { queueId } = req.params;

    const [songs] = await pool.query(
      `SELECT qc.Queue_ID, qc.Song_ID, qc.Custom_index, s.Title, s.Duration
       FROM Queue_Contents qc
       JOIN Song s ON qc.Song_ID = s.Song_ID
       WHERE qc.Queue_ID = ?
       ORDER BY qc.Custom_index ASC`,
      [queueId]
    );

    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//ADD song to queue
router.post("/add-song", async (req, res) => {
  try {
    const { Queue_ID, Song_ID, Custom_index } = req.body;
    if (!Queue_ID || !Song_ID)
      return res.status(400).json({ error: "Queue_ID and Song_ID are required" });

    // Check queue exists
    const [queueRows] = await pool.query("SELECT * FROM Queue WHERE Queue_ID = ?", [Queue_ID]);
    if (!queueRows.length) return res.status(404).json({ error: "Queue not found" });

    // Check song exists
    const [songRows] = await pool.query("SELECT * FROM Song WHERE Song_ID = ?", [Song_ID]);
    if (!songRows.length) return res.status(404).json({ error: "Song not found" });

    // Prevent duplicate
    const [existingRows] = await pool.query(
      "SELECT * FROM Queue_Contents WHERE Queue_ID = ? AND Song_ID = ?",
      [Queue_ID, Song_ID]
    );
    if (existingRows.length) return res.status(409).json({ error: "Song already in queue" });

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

//UPDATE song index in queue
router.put("/update-song", async (req, res) => {
  try {
    const { Queue_ID, Song_ID, Custom_index } = req.body;
    if (!Queue_ID || !Song_ID || Custom_index === undefined)
      return res.status(400).json({ error: "Queue_ID, Song_ID, and Custom_index are required" });

    const [result] = await pool.query(
      "UPDATE Queue_Contents SET Custom_index = ? WHERE Queue_ID = ? AND Song_ID = ?",
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

//REMOVE song from queue
router.delete("/remove-song", async (req, res) => {
  try {
    const { Queue_ID, Song_ID } = req.body;
    if (!Queue_ID || !Song_ID) return res.status(400).json({ error: "Queue_ID and Song_ID are required" });

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

//DELETE entire queue 
router.delete("/:queueId", async (req, res) => {
  try {
    const { queueId } = req.params;

    await pool.query("DELETE FROM Queue_Contents WHERE Queue_ID = ?", [queueId]);
    const [result] = await pool.query("DELETE FROM Queue WHERE Queue_ID = ?", [queueId]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Queue not found" });

    res.json({ message: "Queue deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
