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

// GET all history contents for a user
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get the History_ID for this user
    const [historyRows] = await pool.query(
      "SELECT History_ID FROM History WHERE User_ID = ?",
      [userId]
    );
    if (historyRows.length === 0)
      return res.status(404).json({ error: "History not found for this user" });

    const historyId = historyRows[0].History_ID;

    const [rows] = await pool.query(
      `SELECT hc.History_ID, hc.Song_ID, hc.Timestamp, s.Title, s.Duration
       FROM History_Contents hc
       JOIN Song s ON hc.Song_ID = s.Song_ID
       WHERE hc.History_ID = ?
       ORDER BY hc.Timestamp DESC`,
      [historyId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST add a song to user history
router.post("/", async (req, res) => {
  try {
    const { User_ID, Song_ID } = req.body;
    if (!User_ID || !Song_ID)
      return res.status(400).json({ error: "User_ID and Song_ID are required" });

    // Get or create history for the user
    let [historyRows] = await pool.query(
      "SELECT History_ID FROM History WHERE User_ID = ?",
      [User_ID]
    );

    let History_ID;
    if (historyRows.length === 0) {
      const [insertResult] = await pool.query(
        "INSERT INTO History (User_ID) VALUES (?)",
        [User_ID]
      );
      History_ID = insertResult.insertId;
    } else {
      History_ID = historyRows[0].History_ID;
    }

    // Insert into History_Contents
    await pool.query(
      "INSERT INTO History_Contents (History_ID, Song_ID, Timestamp) VALUES (?, ?, NOW())",
      [History_ID, Song_ID]
    );

    res.status(201).json({ message: "Song added to history", History_ID, Song_ID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a song from history
router.delete("/", async (req, res) => {
  try {
    const { User_ID, Song_ID, Timestamp } = req.body;
    if (!User_ID || !Song_ID || !Timestamp)
      return res.status(400).json({ error: "User_ID, Song_ID, and Timestamp are required" });

    const [historyRows] = await pool.query(
      "SELECT History_ID FROM History WHERE User_ID = ?",
      [User_ID]
    );
    if (historyRows.length === 0)
      return res.status(404).json({ error: "History not found for this user" });

    const History_ID = historyRows[0].History_ID;

    const [result] = await pool.query(
      "DELETE FROM History_Contents WHERE History_ID = ? AND Song_ID = ? AND Timestamp = ?",
      [History_ID, Song_ID, Timestamp]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Song not found in history" });

    res.json({ message: "Song removed from history" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
