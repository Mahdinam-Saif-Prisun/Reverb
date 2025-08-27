import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../api";
import "./Login.css"; // create a Login.css file

const Login = () => {
  const [accountType, setAccountType] = useState("User");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (stored) navigate("/dashboard");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = `/auth/${accountType.toLowerCase()}/login`;
      const res = await post(endpoint, { Email: email, Pass_hash: password });
      const userData = accountType === "User" ? res.user : res.artist;

      if (!userData) throw new Error("Invalid response from server");

      localStorage.setItem(
        "userData",
        JSON.stringify({
          Name: userData.Name,
          accountType,
          User_ID: userData.User_ID || userData.Artist_ID,
        })
      );

      navigate("/dashboard", { state: { accountType, userData } });
    } catch (err) {
      setError(err.message || "Unknown error");
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login to Reverb</h2>

        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          className="login-select"
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

        <button type="submit" className="login-button">
          Login as {accountType}
        </button>

        {error && <div className="login-error">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
