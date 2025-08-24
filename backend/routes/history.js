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

//Get all histories (with contents)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT hc.History_ID, u.User_ID, u.Name AS User_Name, s.Song_ID, s.Title AS Song_Title, hc.Timestamp
      FROM History_Contents hc
      JOIN History h ON hc.History_ID = h.History_ID
      JOIN User u ON h.User_ID = u.User_ID
      JOIN Song s ON hc.Song_ID = s.Song_ID
      ORDER BY hc.Timestamp DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//Get history for a specific user
router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const [rows] = await pool.query(`
      SELECT hc.History_ID, s.Song_ID, s.Title AS Song_Title, hc.Timestamp
      FROM History_Contents hc
      JOIN History h ON hc.History_ID = h.History_ID
      JOIN Song s ON hc.Song_ID = s.Song_ID
      WHERE h.User_ID = ?
      ORDER BY hc.Timestamp DESC
    `, [userId]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//Add a song play to user history
router.post("/", async (req, res) => {
  try {
    const { User_ID, Song_ID } = req.body;

    if (!User_ID || !Song_ID) {
      return res.status(400).json({ error: "User_ID and Song_ID are required" });
    }

    // Ensure user has a history row
    const [historyRows] = await pool.query(
      "SELECT History_ID FROM History WHERE User_ID = ?",
      [User_ID]
    );

    let historyId;
    if (historyRows.length === 0) {
      const [insertHistory] = await pool.query(
        "INSERT INTO History (User_ID) VALUES (?)",
        [User_ID]
      );
      historyId = insertHistory.insertId;
    } else {
      historyId = historyRows[0].History_ID;
    }

    // Insert into History_Contents
    await pool.query(
      "INSERT INTO History_Contents (History_ID, Song_ID, Timestamp) VALUES (?, ?, NOW())",
      [historyId, Song_ID]
    );

    res.status(201).json({ message: "Song added to history", History_ID: historyId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//Clear user history
router.delete("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const [history] = await pool.query("SELECT History_ID FROM History WHERE User_ID = ?", [userId]);
    if (history.length === 0) return res.status(404).json({ error: "History not found" });

    await pool.query("DELETE FROM History_Contents WHERE History_ID = ?", [history[0].History_ID]);
    res.json({ message: "User history cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
