import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import Home from "../assets/Preview.png";
import PreviewVideo from "../assets/Preview3.png";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const { setUser, fetchData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (!API_URL) {
        throw new Error("VITE_API_URL is missing");
      }

      const url = isLogin ? `${API_URL}/api/login` : `${API_URL}/api/signup`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Authentication failed");
      }

      const meRes = await fetch(`${API_URL}/api/me`, {
        method: "GET",
        credentials: "include",
      });

      const meData = await meRes.json();

      if (!meRes.ok) {
        throw new Error(meData?.error || meData?.message || "Login succeeded, but user data failed to load");
      }

      setUser(meData);

      if (fetchData) {
        await fetchData();
      }

      setEmail("");
      setPassword("");
      setError("");
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="auth-container">
        <div className="containerAuth">
          <img src={PreviewVideo} alt="My App bg" />
        </div>

        <img className="logoauth" src={Home} alt="My App Logo" />

        <div className="auth-form">
          <form className="loginCard" onSubmit={handleSubmit}>
            <h2
              style={{
                display: "flex",
                justifyContent: "center",
                color: "white",
              }}
            >
              {isLogin ? "Welcome Back" : "Signup"}
            </h2>

            <h4
              style={{
                display: "flex",
                justifyContent: "center",
                color: "white",
                opacity: "0.5",
                fontFamily: "sans-serif",
                fontWeight: 200,
                marginTop: "2px",
              }}
            >
              {isLogin ? "Login to continue" : "Signup to continue"}
            </h4>

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

            <button className="submitbtn" type="submit" disabled={submitting}>
              {submitting ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            <button
              className="loginbtn"
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
            >
              {isLogin
                ? "Need an account? Sign Up"
                : "Already have an account? Login"}
            </button>

            {error && <p style={{ color: "orange" }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Auth;