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

// GET all songs
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Song");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET a song by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Song WHERE Song_ID = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Song not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST create a new song
router.post("/", async (req, res) => {
  try {
    const { Title, Release_date, Duration, Producer, Lyrics, Language, Album_ID, Genre } = req.body;
    const [result] = await pool.query(
      `INSERT INTO Song (Title, Release_date, Duration, Producer, Lyrics, Language, Album_ID, Genre)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [Title, Release_date, Duration, Producer, Lyrics, Language, Album_ID, Genre]
    );
    res.status(201).json({ Song_ID: result.insertId, message: "Song created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT update a song by ID
router.put("/:id", async (req, res) => {
  try {
    const { Title, Release_date, Duration, Producer, Lyrics, Language, Album_ID, Genre } = req.body;
    const [result] = await pool.query(
      `UPDATE Song 
       SET Title = ?, Release_date = ?, Duration = ?, Producer = ?, Lyrics = ?, Language = ?, Album_ID = ?, Genre = ? 
       WHERE Song_ID = ?`,
      [Title, Release_date, Duration, Producer, Lyrics, Language, Album_ID, Genre, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Song not found" });
    res.json({ message: "Song updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a song by ID
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM Song WHERE Song_ID = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Song not found" });
    res.json({ message: "Song deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
