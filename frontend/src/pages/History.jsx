import React, { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = "http://localhost:3000"; // change if needed

const History = ({ userData }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userData || !userData.User_ID) {
      setError("Please log in to see your history.");
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/history-contents/${userData.User_ID}`);
        setHistory(res.data || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to fetch history.");
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
              <strong>{song.Title}</strong> - {new Date(song.Timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default History;
