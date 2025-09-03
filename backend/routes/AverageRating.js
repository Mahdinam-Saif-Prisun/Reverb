// GET average rating and count for a song
router.get("/song/:songId/avg-rating", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT AVG(Rating) AS avgRating, COUNT(*) AS ratingCount FROM Rate WHERE Song_ID = ?",
      [req.params.songId]
    );
    if (rows.length === 0) return res.status(404).json({ error: "No ratings" });
    const { avgRating, ratingCount } = rows[0];
    res.json({ avgRating: avgRating ? parseFloat(avgRating).toFixed(2) : "0.00", ratingCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});