import express from "express";
import dotenv from "dotenv";
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //Parse from data

//Routes
import usersRouter from './routes/users.js';
app.use('/users', usersRouter);

import artistRoutes from "./routes/artists.js";
app.use("/artists", artistRoutes);

import albumRoutes from "./routes/albums.js";
app.use("/albums", albumRoutes);

import songRoutes from "./routes/songs.js";
app.use("/songs", songRoutes);

import playlistsRouter from "./routes/playlists.js";
app.use("/playlists", playlistsRouter);

import playlistContentsRouter from "./routes/playlistContents.js";
app.use("/playlist-contents", playlistContentsRouter);

import queueRouter from "./routes/queue.js";
app.use("/queue", queueRouter);

import historyRouter from "./routes/history.js";
app.use("/history", historyRouter);

import likeRoutes from "./routes/like.js";
app.use("/likes", likeRoutes);

import followRoutes from "./routes/follow.js";
app.use("/follow", followRoutes);

import rateRouter from "./routes/rate.js";
app.use("/rate", rateRouter);

import playlistCompileRouter from "./routes/playlistCompile.js";
app.use("/playlist-compile", playlistCompileRouter);

import queueContentsRouter from "./routes/queueContents.js";
app.use("/queue-contents", queueContentsRouter);



//Routes ^

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


