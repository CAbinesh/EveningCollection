import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PreviewImg from "../assets/Preview.png"; // ✅ import video
import { AuthContext } from "../App";
import seaBg from "../assets/logo.png";
import seaBg2 from "../assets/kimple.png";
import trynow from "../assets/trynow.png";
import rabs from "../assets/rabs.gif"

function Home() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const handleLogout = async () => {
    //   const confirmed = window.confirm("Are you sure you want to logout?");
    // if (!confirmed) return;
    try {
      await fetch(`${API_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      navigate("/auth");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div style={{ minWidth: "auto" }}>
      <div className="container">
        <div className="date-Time">
          {time.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
          {" - "}[{time.toLocaleTimeString("en-IN")}]
        </div>
        <img
          src={PreviewImg}
          alt="logo"
          style={{ height: "350px", width: "350px" }}
        />
      </div>
      <div className="maincontainer">
        <div className="btn1" onClick={() => navigate("/DC")}>
          DC
        </div>{" "}
        <div className="btn4" onClick={() => navigate("/Profiles")}>
          Profile
        </div>
        <div className="btn2" onClick={() => navigate("/Ledger")}>
          Ledger
        </div>
        <div className="btn3" onClick={() => navigate("/AddParty")}>
          Add User
        </div>
        <div
          className="btnLogout"
          onClick={() => setShowLogoutConfirm(true)} // ✅ just show modal
        >
          Logout
        </div>
        {showLogoutConfirm && (
          <div className="modalBackdrop">
            <div className="modalBox">
              <h3 style={{ color: "red" }}>Confirm Logout</h3>
              <p style={{ color: "black" }}>Are you sure you want to logout?</p>
              <div className="modalButtons">
                <button
                  className="logoutbtn"
                  onClick={() => {
                    handleLogout(); // ✅ logout only when confirmed
                    setShowLogoutConfirm(false);
                  }}
                >
                  Yes
                </button>
                <button
                  className="logoutbtn"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="trynow">
        <img src={trynow} alt="Try Now" />
      </div>

      <div className="splContainer">
        <div
          className="card"
          style={{
            backgroundImage: `url(${seaBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",

            backgroundRepeat: "no-repeat",
          }}
        >
          <p className="heading">Thandel</p>
          <div className="overlay"></div>
          <a className="card-btn" href="https://thandalfront.onrender.com/" target="_blank"
            rel="noreferrer">
            ↗️
          </a>
        </div>

        <div
          className="card"
          style={{
            backgroundImage: `url(${seaBg2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",

            backgroundRepeat: "no-repeat",
          }}
        >
          <p className="heading"></p>
          <div className="overlay"></div>
          <a
            className="card-btn"
            href="https://kimplebackend-front.onrender.com/#/auth"
            target="_blank"
            rel="noreferrer"
          >
            ↗️
          </a>
        </div>
      </div>

      <div className="footer"  style={{
    backgroundImage: `url(${rabs})`,
    backgroundSize: "cover",
    backgroundPosition: "top center",
    backgroundRepeat: "no-repeat",
    minHeight: "clamp(120px, 30vh, 260px)",
    width: "100%",
  }}>© 2025 MyWebsite. All rights reserved.</div>
    </div>
  );
}

export default Home;
