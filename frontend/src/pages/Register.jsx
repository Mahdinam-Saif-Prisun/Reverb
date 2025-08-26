import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../api";

const Register = () => {
  const [accountType, setAccountType] = useState("User"); // User or Artist
  const [name, setName] = useState("");
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
      const endpoint = `/auth/${accountType.toLowerCase()}/register`;

      // Construct request body based on account type
      let body;
      if (accountType === "User") {
        body = {
          Name: name,
          Email: email,
          Pass_hash: password,
          Subscription_type: "Free", // default
        };
      } else {
        body = {
          Name: name,
          Email: email,
          Pass_hash: password,
          Country: "", // optional, can add input later
          Bio: "",     // optional, can add input later
        };
      }

      const res = await post(endpoint, body);
      const userData = accountType === "User" ? res.user : res.artist;

      // Save to localStorage for login persistence
      localStorage.setItem(
        "userData",
        JSON.stringify({ Name: userData.Name, accountType })
      );

      navigate("/dashboard", { state: { accountType, userData } });
    } catch (err) {
      // Show error returned by backend
      setError(err?.error || "Unknown error");
    }
  };

  return (
    <div className="centered-page">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          className="dropdown"
        >
          <option>User</option>
          <option>Artist</option>
        </select>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">Register as {accountType}</button>
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      </form>
    </div>
  );
};

export default Register;
