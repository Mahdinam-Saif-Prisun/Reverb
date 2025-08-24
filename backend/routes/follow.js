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

// POST follow an artist
router.post("/", async (req, res) => {
  try {
    const { User_ID, Artist_ID } = req.body;

    if (!User_ID || !Artist_ID) {
      return res.status(400).json({ error: "User_ID and Artist_ID are required" });
    }

    // Prevent duplicate follow
    const [existing] = await pool.query(
      "SELECT * FROM Follow WHERE User_ID = ? AND Artist_ID = ?",
      [User_ID, Artist_ID]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "Already following this artist" });
    }

    await pool.query(
      "INSERT INTO Follow (User_ID, Artist_ID) VALUES (?, ?)",
      [User_ID, Artist_ID]
    );

    res.status(201).json({ message: "Artist followed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE unfollow an artist
router.delete("/", async (req, res) => {
  try {
    const { User_ID, Artist_ID } = req.body;

    if (!User_ID || !Artist_ID) {
      return res.status(400).json({ error: "User_ID and Artist_ID are required" });
    }

    const [result] = await pool.query(
      "DELETE FROM Follow WHERE User_ID = ? AND Artist_ID = ?",
      [User_ID, Artist_ID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Follow record not found" });
    }

    res.json({ message: "Unfollowed artist successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all artists followed by a user
router.get("/user/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.Artist_ID, a.Name, a.Country, a.Bio
       FROM Follow f
       JOIN Artist a ON f.Artist_ID = a.Artist_ID
       WHERE f.User_ID = ?`,
      [req.params.id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all users following an artist
router.get("/artist/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.User_ID, u.Name, u.Email, u.Subscription_type, u.Role
       FROM Follow f
       JOIN User u ON f.User_ID = u.User_ID
       WHERE f.Artist_ID = ?`,
      [req.params.id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
