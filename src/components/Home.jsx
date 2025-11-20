import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import PreviewVideo from "../assets/Preview.webm"; // ✅ import video
import { AuthContext } from "../App";

function Home() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
        <video autoPlay playsInline disablePictureInPicture muted>
          <source src={PreviewVideo} />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="maincontainer">
        <div className="btn" onClick={() => navigate("/DC")}>
          DC
        </div>
        <div className="btn" onClick={() => navigate("/Ledger")}>
          Ledger
        </div>
        <div className="btn" onClick={() => navigate("/Profiles")}>
          Profile
        </div>
        <div className="btn" onClick={() => navigate("/AddParty")}>
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
              <h3 style={{color:'red'}}>Confirm Logout</h3>
              <p style={{color:'black'}}>Are you sure you want to logout?</p>
              <div className="modalButtons">
                <button
                  className="btn"
                  onClick={() => {
                    handleLogout(); // ✅ logout only when confirmed
                    setShowLogoutConfirm(false);
                  }}
                >
                  Yes
                </button>
                <button
                  className="btn"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="footer">
         © 2025 MyWebsite. All rights reserved.
      </div>
    </div>
  );
}

export default Home;
