import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../api";

const Login = () => {
  const [accountType, setAccountType] = useState("User"); // User or Artist
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (stored) navigate("/dashboard");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Determine endpoint dynamically
      const endpoint = `/auth/${accountType.toLowerCase()}/login`;

      // Call backend
      const res = await post(endpoint, { Email: email, Pass_hash: password });

      // Extract user info
      const userData = accountType === "User" ? res.user : res.artist;

      if (!userData) throw new Error("Invalid response from server");

      // Save all necessary info for later use (Dashboard, History, etc.)
      localStorage.setItem(
        "userData",
        JSON.stringify({
          Name: userData.Name,
          accountType,
          User_ID: userData.User_ID || userData.Artist_ID,
        })
      );

      // Navigate to dashboard with state
      navigate("/dashboard", { state: { accountType, userData } });
    } catch (err) {
      // Catch JSON or network errors
      console.error(err);
      setError(err?.error || err.message || "Unknown error");
    }
  };

  return (
    <div className="centered-page">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          className="dropdown"
        >
          <option>User</option>
          <option>Artist</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login as {accountType}</button>

        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
