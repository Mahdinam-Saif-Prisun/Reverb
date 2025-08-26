import { useState, useEffect } from "react";

export const useQueue = (userId) => {
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);

  // Fetch queue from backend
  const fetchQueue = async () => {
    const res = await fetch(`/queue/${userId}`);
    const data = await res.json();
    setQueue(data.songs || []);
  };

  const fetchHistory = async () => {
    const res = await fetch(`/history/${userId}`);
    const data = await res.json();
    setHistory(data.songs || []);
  };

  const addToQueue = async (songId, incognito=false) => {
    await fetch(`/queue/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, songId, incognito })
    });
    fetchQueue();
  };

  const playNext = async () => {
    if (queue.length === 0) return;
    const song = queue[0];
    if (!song.incognito) {
      await fetch(`/history/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, songId: song.Song_ID })
      });
      fetchHistory();
    }
    await fetch(`/queue/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, songId: song.Song_ID })
    });
    fetchQueue();
  };

  useEffect(() => {
    fetchQueue();
    fetchHistory();
  }, []);

  return { queue, history, addToQueue, playNext };
};
