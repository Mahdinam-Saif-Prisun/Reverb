import React, { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = "http://localhost:3000"; // match your backend

const AverageRating = ({ songId }) => {
  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    if (!songId) return;
    const fetchAvgRating = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/rate/song/${songId}/avg-rating`);
        setAvgRating(parseFloat(res.data.avgRating));
        setRatingCount(res.data.ratingCount);
      } catch (err) {
        console.error("Failed to fetch average rating:", err);
      }
    };
    fetchAvgRating();
  }, [songId]);

  const renderStars = (rating) => {
    const stars = [];
    const rounded = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rounded ? "#ffa726" : "#666" }}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div>
      {renderStars(avgRating)} ({ratingCount} {ratingCount === 1 ? "rating" : "ratings"})
    </div>
  );
};

export default AverageRating;