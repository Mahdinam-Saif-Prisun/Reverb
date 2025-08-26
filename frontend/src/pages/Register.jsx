import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [accountType, setAccountType] = useState("User");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock backend response
    navigate("/dashboard", { state: { user: name, accountType } });
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
          placeholder="Username"
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
      </form>
    </div>
  );
};

export default Register;
