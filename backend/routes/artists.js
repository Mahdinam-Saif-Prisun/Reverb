import express from "express";
import pool from "../db.js";

const router = express.Router();

// CREATE Artist
router.post("/", async (req, res) => {
    try {
        const { Name, Pass_hash, Country, Bio } = req.body;
        const [result] = await pool.query(
            "INSERT INTO Artist (Name, Pass_hash, Country, Bio) VALUES (?, ?, ?, ?)",
            [Name, Pass_hash, Country, Bio]
        );
        res.json({ Artist_ID: result.insertId, Name, Country, Bio });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all Artists
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM Artist");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single Artist
router.get("/:id", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM Artist WHERE Artist_ID = ?", [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: "Artist not found" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE Artist
router.put("/:id", async (req, res) => {
    try {
        const { Name, Pass_hash, Country, Bio } = req.body; // <-- added Pass_hash
        await pool.query(
            "UPDATE Artist SET Name = ?, Pass_hash = ?, Country = ?, Bio = ? WHERE Artist_ID = ?",
            [Name, Pass_hash, Country, Bio, req.params.id]
        );
        res.json({ Artist_ID: req.params.id, Name, Country, Bio });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE Artist
router.delete("/:id", async (req, res) => {
    try {
        await pool.query("DELETE FROM Artist WHERE Artist_ID = ?", [req.params.id]);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
