import React, { useEffect, useState } from "react";
import { get } from "../api";
import "./History.css"; // create this for styling

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get logged-in user data from localStorage
  const stored = localStorage.getItem("userData");
  const userData = stored ? JSON.parse(stored) : null;

  useEffect(() => {
    if (!userData || !userData.User_ID) {
      setError("Please log in to see your listening history.");
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await get(`/history-contents/${userData.User_ID}`);
        setHistory(res || []);
      } catch (err) {
        setError(err?.error || "Failed to fetch history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userData]);

  if (loading) return <p className="history-message">Loading history...</p>;
  if (error) return <p className="history-message error">{error}</p>;
  if (!history.length) return <p className="history-message">No listening history yet.</p>;

  return (
    <div className="history-page">
      <h2>Your Listening History</h2>
      <div className="history-list">
        {history.map((song, idx) => (
          <div key={idx} className="history-item">
            <div className="song-info">
              <strong className="song-title">{song.Title}</strong>
              <span className="song-artist">{song.Artist}</span>
            </div>
            <div className="song-timestamp">
              {new Date(song.Timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
