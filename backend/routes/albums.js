import express from "express";
import pool from "../db.js"; // your mysql connection

const router = express.Router();

// GET all albums
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM Album");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single album by ID
router.get("/:id", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM Album WHERE Album_ID=?", [req.params.id]);
        if (!rows.length) return res.status(404).json({ error: "Album not found" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST (create) album
router.post("/", async (req, res) => {
    const { Title, Release_date, Artist_ID, Genre } = req.body;
    try {
        const [result] = await pool.query(
            "INSERT INTO Album (Title, Release_date, Artist_ID, Genre) VALUES (?, ?, ?, ?)",
            [Title, Release_date, Artist_ID, Genre]
        );
        res.status(201).json({ Album_ID: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT (update) album
router.put("/:id", async (req, res) => {
    const { Title, Release_date, Artist_ID, Genre } = req.body;
    try {
        const [result] = await pool.query(
            "UPDATE Album SET Title=?, Release_date=?, Artist_ID=?, Genre=? WHERE Album_ID=?",
            [Title, Release_date, Artist_ID, Genre, req.params.id]
        );
        if (!result.affectedRows) return res.status(404).json({ error: "Album not found" });
        res.json({ message: "Album updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE album
router.delete("/:id", async (req, res) => {
    try {
        const [result] = await pool.query("DELETE FROM Album WHERE Album_ID=?", [req.params.id]);
        if (!result.affectedRows) return res.status(404).json({ error: "Album not found" });
        res.json({ message: "Album deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
