import express from "express";
import dotenv from "dotenv";
import pool from './db.js';
import usersRouter from './routes/users.js';
import artistRoutes from "./routes/artists.js";
import albumRoutes from "./routes/albums.js";
import songRoutes from "./routes/songs.js";
import playlistsRouter from "./routes/playlists.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//Routes
app.use('/users', usersRouter);
app.use("/artists", artistRoutes);
app.use("/albums", albumRoutes);
app.use("/songs", songRoutes);
app.use("/playlists", playlistsRouter);


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


