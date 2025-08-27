// routes/playlistExtras.js
import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const pool = mysql.createPool({
  host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASS, database: process.env.DB_NAME,
});

// Helper: build nested tree recursively (DB-driven)
async function getChildren(parentId) {
  const [children] = await pool.query("SELECT Playlist_ID, Name, Parent_playlist, Owner_UID FROM Playlist WHERE Parent_playlist = ?", [parentId]);
  const result = [];
  for (const c of children) {
    const subtree = await getChildren(c.Playlist_ID);
    result.push({...c, children: subtree});
  }
  return result;
}

// GET nested tree for a playlist (whole subtree)
router.get("/tree/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT Playlist_ID, Name, Parent_playlist, Owner_UID FROM Playlist WHERE Playlist_ID = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Playlist not found" });
    const root = rows[0];
    const children = await getChildren(root.Playlist_ID);
    res.json({ ...root, children });
  } catch (err) {
    console.error(err); res.status(500).json({ error: "Server error" });
  }
});

// LIST collaborators for a playlist
router.get("/collab/:playlistId", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT pc.User_ID, u.Name, u.Email
       FROM Playlist_Compile pc
       JOIN User u ON pc.User_ID = u.User_ID
       WHERE pc.Playlist_ID = ?`,
      [req.params.playlistId]
    );
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error" }); }
});

// ADD collaborator (uses Playlist_Compile)
router.post("/collab", async (req, res) => {
  try {
    const { Playlist_ID, User_ID } = req.body;
    if (!Playlist_ID || !User_ID) return res.status(400).json({ error: "Playlist_ID and User_ID required" });

    const [exists] = await pool.query("SELECT * FROM Playlist_Compile WHERE Playlist_ID = ? AND User_ID = ?", [Playlist_ID, User_ID]);
    if (exists.length) return res.status(409).json({ error: "Already collaborator" });

    await pool.query("INSERT INTO Playlist_Compile (Playlist_ID, User_ID) VALUES (?, ?)", [Playlist_ID, User_ID]);
    res.status(201).json({ message: "Collaborator added" });
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error" }); }
});

// REMOVE collaborator
router.delete("/collab", async (req, res) => {
  try {
    const { Playlist_ID, User_ID } = req.body;
    if (!Playlist_ID || !User_ID) return res.status(400).json({ error: "Playlist_ID and User_ID required" });

    const [result] = await pool.query("DELETE FROM Playlist_Compile WHERE Playlist_ID = ? AND User_ID = ?", [Playlist_ID, User_ID]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Not a collaborator" });
    res.json({ message: "Collaborator removed" });
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error" }); }
});

// BULK reorder playlist contents
// Accepts body: { Playlist_ID, items: [{Song_ID, Custom_index}, ...] }
router.put("/reorder", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { Playlist_ID, items } = req.body;
    if (!Playlist_ID || !Array.isArray(items)) { conn.release(); return res.status(400).json({ error: "Playlist_ID and items[] required" }); }

    await conn.beginTransaction();
    for (const it of items) {
      await conn.query("UPDATE Playlist_Contents SET Custom_index = ? WHERE Playlist_ID = ? AND Song_ID = ?", [it.Custom_index, Playlist_ID, it.Song_ID]);
    }
    await conn.commit();
    res.json({ message: "Playlist reordered" });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: "Server error" });
  } finally { conn.release(); }
});

export default router;