import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App"; // ✅ you already have AuthContext
import Home from "../assets/Preview.png";
import PreviewVideo from "../assets/Preview3.webm";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const { setUser } = useContext(AuthContext); // ✅ comes from App.jsx
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    try {
      const url = isLogin ? `${API_URL}/api/login` : `${API_URL}/api/signup`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // ✅ important for cookie
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Authentication failed");

      // ✅ get logged-in user
      const meRes = await fetch(`${API_URL}/api/me`, {
        method: "GET",
        credentials: "include",
      });
      const meData = await meRes.json();

      setUser(meData);
      navigate("/"); // go to main page
      setEmail("");
      setPassword("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="auth-container">
        <div className="containerAuth">
          <video autoPlay playsInline disablePictureInPicture muted loop>
            <source src={PreviewVideo} />
            Your browser does not support the video tag.
          </video>
        </div>

        <img className="logoauth" src={Home} alt="My App Logo" />

        <div className="auth-form">
          {/* Logo wrapper */}

          <form className="loginCard" onSubmit={handleSubmit}>
            <div style={{ display: "flex", justifyContent: "center" }}></div>
            <h2
              style={{
                display: "flex",
                justifyContent: "center",
                color: "white",
              }}
            >
              {isLogin ? "Login" : "Signup"}
            </h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />
            <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
          </form>

          <button className="loginbtn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin
              ? "Need an account? Sign Up"
              : "Already have an account? Login"}
          </button>

          {error && <p style={{ color: "orange" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Auth;
