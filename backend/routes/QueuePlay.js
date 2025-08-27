// routes/queuePlay.js
import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const pool = mysql.createPool({
  host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_NAME,
});

// Peek next song (without removing)
router.get("/peek/:queueId", async (req, res) => {
  try {
    const queueId = req.params.queueId;
    const [rows] = await pool.query(
      `SELECT qc.Song_ID, s.Title, s.Duration, qc.Custom_index
       FROM Queue_Contents qc
       JOIN Song s ON qc.Song_ID = s.Song_ID
       WHERE qc.Queue_ID = ?
       ORDER BY qc.Custom_index ASC
       LIMIT 1`, [queueId]
    );
    if (!rows.length) return res.status(404).json({ error: "Queue empty or not found" });
    res.json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error" }); }
});

// Pop-next: return and remove next from queue; if queue is attached to a user and NOT incognito, log into history
router.post("/pop/:queueId", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const queueId = req.params.queueId;

    await conn.beginTransaction();

    // get queue + incognito + user
    const [qrows] = await conn.query("SELECT User_ID, Incognito FROM Queue WHERE Queue_ID = ?", [queueId]);
    if (!qrows.length) { await conn.rollback(); conn.release(); return res.status(404).json({ error: "Queue not found" }); }
    const queue = qrows[0];

    // get next song (lowest Custom_index)
    const [nextRows] = await conn.query(
      `SELECT qc.Song_ID, s.Title, s.Duration, qc.Custom_index
       FROM Queue_Contents qc
       JOIN Song s ON qc.Song_ID = s.Song_ID
       WHERE qc.Queue_ID = ?
       ORDER BY qc.Custom_index ASC
       LIMIT 1`, [queueId]
    );
    if (!nextRows.length) { await conn.rollback(); conn.release(); return res.status(404).json({ error: "Queue empty" }); }
    const next = nextRows[0];

    // remove the entry from queue
    await conn.query("DELETE FROM Queue_Contents WHERE Queue_ID = ? AND Song_ID = ? LIMIT 1", [queueId, next.Song_ID]);

    // if not incognito and user exists, write to history
    if (!queue.Incognito && queue.User_ID) {
      // get or create History
      const [histRows] = await conn.query("SELECT History_ID FROM History WHERE User_ID = ?", [queue.User_ID]);
      let History_ID;
      if (!histRows.length) {
        const [ins] = await conn.query("INSERT INTO History (User_ID) VALUES (?)", [queue.User_ID]);
        History_ID = ins.insertId;
      } else History_ID = histRows[0].History_ID;

      await conn.query("INSERT INTO History_Contents (History_ID, Song_ID, Timestamp) VALUES (?, ?, NOW())", [History_ID, next.Song_ID]);

      // optional: increase play-count table or "Play" table if you have one. Adjust to schema.
    }

    await conn.commit();
    res.json({ message: "Next popped", song: next });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally { conn.release(); }
});

// Skip: move first item to last (useful for "skip but keep")
router.post("/skip/:queueId", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const queueId = req.params.queueId;
    await conn.beginTransaction();
    // get next
    const [nextRows] = await conn.query(
      `SELECT qc.Playlist_Content_ID, qc.Song_ID, qc.Custom_index
       FROM Queue_Contents qc
       WHERE qc.Queue_ID = ?
       ORDER BY qc.Custom_index ASC
       LIMIT 1`, [queueId]
    );
    if (!nextRows.length) { await conn.rollback(); conn.release(); return res.status(404).json({ error: "Queue empty" }); }
    const first = nextRows[0];

    // compute new max index
    const [maxRows] = await conn.query("SELECT MAX(Custom_index) as mx FROM Queue_Contents WHERE Queue_ID = ?", [queueId]);
    const mx = maxRows[0].mx === null ? 0 : maxRows[0].mx;
    await conn.query("UPDATE Queue_Contents SET Custom_index = ? WHERE Queue_ID = ? AND Song_ID = ?", [mx + 1, queueId, first.Song_ID]);

    await conn.commit();
    res.json({ message: "Skipped first song" });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally { conn.release(); }
});

export default router;