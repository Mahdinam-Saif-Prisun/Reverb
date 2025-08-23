import express from 'express';
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// ---- CREATE USER ----
router.post("/", async (req, res) => {
  try {
    const { Name, Email, Pass_hash, Subscription_type, Role } = req.body;

    if (!Name || !Email || !Pass_hash) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result] = await pool.query(
      `INSERT INTO User (Name, Email, Pass_hash, Subscription_type, Role)
       VALUES (?, ?, ?, ?, ?)`,
      [Name, Email, Pass_hash, Subscription_type || null, Role || "user"]
    );

    res.status(201).json({ message: "User created", userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

// ---- GET ALL USERS ----
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM User");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// POST a new user
router.post('/', async (req, res) => {
  const { Name, Email, Pass_hash, Subscription_type, Role } = req.body;

  if (!Name || !Email || !Pass_hash) {
    return res.status(400).json({ error: 'Name, Email, and Pass_hash are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO User (Name, Email, Pass_hash, Subscription_type, Role) VALUES (?, ?, ?, ?, ?)',
      [Name, Email, Pass_hash, Subscription_type || null, Role || 'user']
    );
    res.status(201).json({ message: 'User added', User_ID: result.insertId });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to add user' });
    }
  }
});


export default router;
