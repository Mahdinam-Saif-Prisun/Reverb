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

// GET all radio stations
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Radio_Station");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET a radio station by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Radio_Station WHERE Station_ID = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Radio station not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST create a new radio station
router.post("/", async (req, res) => {
  try {
    const { Name, Description, Date_Created, Genre } = req.body;
    const [result] = await pool.query(
      `INSERT INTO Radio_Station (Name, Description, Date_Created, Genre)
       VALUES (?, ?, ?, ?)`,
      [Name, Description, Date_Created, Genre]
    );
    res.status(201).json({ Station_ID: result.insertId, message: "Radio station created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT update a radio station by ID
router.put("/:id", async (req, res) => {
  try {
    const { Name, Description, Date_Created, Genre } = req.body;
    const [result] = await pool.query(
      `UPDATE Radio_Station
       SET Name = ?, Description = ?, Date_Created = ?, Genre = ?
       WHERE Station_ID = ?`,
      [Name, Description, Date_Created, Genre, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Radio station not found" });
    res.json({ message: "Radio station updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a radio station by ID
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM Radio_Station WHERE Station_ID = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Radio station not found" });
    res.json({ message: "Radio station deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
