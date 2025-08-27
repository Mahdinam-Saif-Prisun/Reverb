// routes/stats.js
import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const pool = mysql.createPool({
  host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_NAME,
});

// average rating for a song
router.get("/song/:songId/avg-rating", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT AVG(Rating) as avgRating, COUNT(*) as totalRatings FROM Rate WHERE Song_ID = ?", [req.params.songId]);
    res.json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error" }); }
});

// top-rated songs (by average rating, minRatings optional)
router.get("/top-rated", async (req, res) => {
  try {
    const minRatings = parseInt(req.query.minRatings || "1", 10);
    const [rows] = await pool.query(
      `SELECT r.Song_ID, s.Title, AVG(r.Rating) AS avgRating, COUNT(*) AS ratingsCount
       FROM Rate r
       JOIN Song s ON r.Song_ID = s.Song_ID
       GROUP BY r.Song_ID
       HAVING ratingsCount >= ?
       ORDER BY avgRating DESC
       LIMIT 50`, [minRatings]
    );
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error" }); }
});

// top-played songs (based onHistory_Contents count)
router.get("/top-played", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.Song_ID, s.Title, COUNT(hc.Song_ID) AS playCount
       FROM History_Contents hc
       JOIN Song s ON hc.Song_ID = s.Song_ID
       GROUP BY hc.Song_ID
       ORDER BY playCount DESC
       LIMIT 50`
    );
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error" }); }
});

export default router;