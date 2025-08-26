import React, { useEffect, useState } from "react";
import { get } from "../api";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get logged-in user data from localStorage
  const stored = localStorage.getItem("userData");
  const userData = stored ? JSON.parse(stored) : null;

  useEffect(() => {
    if (!userData || !userData.User_ID) {
      setError("Please log in as a user to see your history.");
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await get(`/history/user/${userData.User_ID}`);
        setHistory(res.songs || []); // backend should return { songs: [...] }
      } catch (err) {
        setError(err?.error || "Failed to fetch history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userData]);

  if (loading) return <p style={{ padding: "2rem" }}>Loading history...</p>;
  if (error) return <p style={{ padding: "2rem", color: "red" }}>{error}</p>;
  if (!history.length) return <p style={{ padding: "2rem" }}>No listening history yet.</p>;

  return (
    <div className="centered-page">
      <div className="home-box" style={{ width: "80%", maxWidth: "800px" }}>
        <h2>Your Listening History</h2>
        <ul style={{ textAlign: "left", marginTop: "1rem" }}>
          {history.map((song, idx) => (
            <li key={idx}>
              <strong>{song.Title}</strong> by {song.Artist} - {new Date(song.Timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default History;
