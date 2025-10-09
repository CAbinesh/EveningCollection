import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import PreviewVideo from "../assets/Preview.webm"; // ✅ import video
import { AuthContext } from "../App";

function Home() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogout = async () => {
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
    <div>
      <div className="container" >
        <video autoPlay playsInline 
    disablePictureInPicture  muted>
          <source src={PreviewVideo} />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="maincontainer">
        <div
          className="btn"
          onClick={() => navigate("/DC")}
        >
          DC
        </div>
        <div
          className="btn"
          onClick={() => navigate("/Ledger")}
        >
          Ledger
        </div>
        <div
          className="btn"
          onClick={() => navigate("/Profiles")}
        >
          Profile
        </div>
        <div
          className="btn"
          onClick={() => navigate("/AddParty")}
        >
          Add User
        </div>
        <div
          className="btnLogout"
          onClick={handleLogout}
        >
          Logout
        </div>
      </div>
    </div>
  );
}

export default Home;
