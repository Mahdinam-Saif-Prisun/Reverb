import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [accountType, setAccountType] = useState("User"); // User or Artist
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock backend response
    const username = email.split("@")[0];
    navigate("/dashboard", { state: { user: username, accountType } });
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
      </form>
    </div>
  );
};

export default Login;
