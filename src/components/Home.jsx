import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PreviewImg from "../assets/Preview12.png"; // ✅ import video
import { AuthContext } from "../App";

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
    <div className="homeBossContainer" style={{ minWidth: "auto" }}>
      <div className="container">
        <img
          src={PreviewImg}
          alt="logo"
          style={{ height: "90px", width: "90px" }}
        />
        <h1 className="nametitle">Evening Collection</h1>
        <div className="date-Time">
          {time.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
          {" - "}[{time.toLocaleTimeString("en-IN")}]
        </div>
      </div>
      <div className="greetBox">
        <h4 style={{ color: "orange" }}>Good To see You 👋</h4>
        <h1 className="font1">Welcome... </h1>
        <h5 className="font2">
          Manage your system efficiently <br />
          and get things done.
        </h5>
      </div>
      <div className="dashboard">
        <h2 className="ddh2">Dashboard</h2>
        <h4 className="ddh4">Quick access to all modules</h4>
      </div>
      <div className="maincontainer">
        <div className="btn1" onClick={() => navigate("/DC")}>
          <h3 className="h3">DC</h3>
          <p className="p">Manage district configurations and data.</p>
          <span className="link">View →</span>
        </div>

        <div className="btn4" onClick={() => navigate("/Profiles")}>
          <h3 className="h3">Profiles</h3>
          <p className="p">View and Manage Profiles</p>
          <span className="link">View →</span>
        </div>

        <div className="btn2" onClick={() => navigate("/Ledger")}>
          <h3 className="h3">Ledger</h3>
          <p className="p">Access and View Full Records</p>
          <span className="link">View →</span>
        </div>

        <div className="btn3" onClick={() => navigate("/AddParty")}>
          <h3 className="h3">Add User</h3>
          <p className="p">Create New User</p>
          <span className="link">View →</span>
        </div>

        <div className="btnLogout" onClick={() => setShowLogoutConfirm(true)}>
          Logout
        </div>

        {showLogoutConfirm && (
          <div className="modalBackdrop">
            <div className="modalBox">
              <h2 style={{ color: "red" }}>Confirm Logout</h2>
              <h5 style={{ color: "black" }}>Are you sure you want to logout?</h5>
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
      <div className="centerLine"></div>
      <div className="footer">© 2025 MyWebsite. All rights reserved.</div>
      <div className="subFooter">
        <h4>⁕ PrivacyPolicy</h4>
        <h4>⁕ Terms and conditions</h4>
        <h4>⁕ Contact Us</h4>
      </div>
      <div className="subFooterIcon"></div>
    </div>
  );
}

export default Home;
