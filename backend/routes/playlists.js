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

// GET all playlists
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Playlist");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET a playlist by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Playlist WHERE Playlist_ID = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Playlist not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all playlists of a user
router.get("/user/:ownerId", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Playlist WHERE Owner_UID = ?", [req.params.ownerId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST create a new playlist
router.post("/", async (req, res) => {
  try {
    const { Name, Owner_UID, Parent_playlist = null } = req.body;

    if (!Name || !Owner_UID) {
      return res.status(400).json({ error: "Owner_UID and Name are required" });
    }

    const [userCheck] = await pool.query("SELECT * FROM User WHERE User_ID = ?", [Owner_UID]);
    if (userCheck.length === 0) return res.status(404).json({ error: "Owner_UID does not exist" });

    const [result] = await pool.query(
      `INSERT INTO Playlist (Name, Parent_playlist, Owner_UID) VALUES (?, ?, ?)`,
      [Name, Parent_playlist, Owner_UID]
    );

    res.status(201).json({ Playlist_ID: result.insertId, message: "Playlist created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT update a playlist by ID
router.put("/:id", async (req, res) => {
  try {
    const { Name, Parent_playlist } = req.body;

    if (!Name) return res.status(400).json({ error: "Name is required" });

    const [result] = await pool.query(
      `UPDATE Playlist SET Name = ?, Parent_playlist = ? WHERE Playlist_ID = ?`,
      [Name, Parent_playlist || null, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "Playlist not found" });

    res.json({ message: "Playlist updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a playlist by ID
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM Playlist WHERE Playlist_ID = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Playlist not found" });
    res.json({ message: "Playlist deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
