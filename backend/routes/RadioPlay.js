// routes/radioPlay.js
import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const pool = mysql.createPool({
  host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_NAME,
});

// Get next song from radio station (supports ?mode=shuffle or sequential)
router.get("/:stationId/next", async (req, res) => {
  try {
    const stationId = req.params.stationId;
    const mode = (req.query.mode || "sequential").toLowerCase();

    // Confirm station exists
    const [st] = await pool.query("SELECT * FROM Radio_Station WHERE Station_ID = ?", [stationId]);
    if (!st.length) return res.status(404).json({ error: "Station not found" });

    let row;
    if (mode === "shuffle") {
      const [rows] = await pool.query(
        `SELECT rsc.Song_ID, s.Title, s.Duration
         FROM Radio_Station_Contents rsc
         JOIN Song s ON rsc.Song_ID = s.Song_ID
         WHERE rsc.Station_ID = ?
         ORDER BY RAND()
         LIMIT 1`, [stationId]
      );
      row = rows[0];
    } else {
      // sequential: returns by id ascending — in real system you'd track last-played per-user or per-station
      const [rows] = await pool.query(
        `SELECT rsc.Song_ID, s.Title, s.Duration
         FROM Radio_Station_Contents rsc
         JOIN Song s ON rsc.Song_ID = s.Song_ID
         WHERE rsc.Station_ID = ?
         ORDER BY rsc.id ASC
         LIMIT 1`, [stationId]
      );
      row = rows[0];
    }

    if (!row) return res.status(404).json({ error: "No songs in station" });
    res.json(row);
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error" }); }
});

export default router;