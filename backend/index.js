import express from "express";
import dotenv from "dotenv";
import pool from './db.js';
import cors from "cors";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
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

import historyContentsRouter from "./routes/historyContents.js";
app.use("/history-contents", historyContentsRouter);

import radioStationsRouter from "./routes/radioStations.js";
app.use("/radio-stations", radioStationsRouter);

import radioStationContentsRouter from "./routes/radioStationContents.js";
app.use("/radio-station-contents", radioStationContentsRouter);

import composeRouter from "./routes/compose.js";
app.use("/compose", composeRouter);

import authRouter from "./routes/auth.js";
app.use("/auth", authRouter);


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

//Temp homepage
app.get("/homepage", (req, res) => {
  res.json({ message: "Welcome to the music streaming service!" });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


