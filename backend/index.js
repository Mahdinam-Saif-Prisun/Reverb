import express from "express";
import dotenv from "dotenv";
import pool from './db.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS currentTime');
    res.json({ message: 'Server and DB working!', dbTime: rows[0].currentTime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB connection failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
