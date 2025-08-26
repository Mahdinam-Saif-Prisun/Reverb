// src/components/UserPanel.jsx
import React, { useState, useEffect } from "react";
import { get } from "../api"; // use fetch wrapper

const UserPanel = ({ user }) => {
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch user's queue and history
    const fetchData = async () => {
      try {
        const queueData = await get(`/queue/${user.User_ID}`);
        const historyData = await get(`/history/${user.User_ID}`);
        setQueue(queueData);
        setHistory(historyData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div>
      <h2>Welcome, {user.Name}</h2>
      <h3>Your Queue</h3>
      {queue.length ? (
        <ul>
          {queue.map((song) => (
            <li key={song.Song_ID}>{song.Title}</li>
          ))}
        </ul>
      ) : (
        <p>Queue is empty</p>
      )}

      <h3>History</h3>
      {history.length ? (
        <ul>
          {history.map((song) => (
            <li key={song.Song_ID}>{song.Title}</li>
          ))}
        </ul>
      ) : (
        <p>No history yet</p>
      )}
    </div>
  );
};

export default UserPanel;
