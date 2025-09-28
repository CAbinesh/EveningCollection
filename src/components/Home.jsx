import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Preview from "../assets/Preview.png";
import { AuthContext } from "../App"; // ✅ import AuthContext

function Home() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext); // ✅ get setUser from context
const API_URL=import.meta.env.VITE_API_URL
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null); // clear user state
      navigate("/auth"); // redirect to login
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div>
      <div className="container">
        <img src={Preview} alt="" width={350} height={350} />
      </div>
      <div className="maincontainer">
        <div
          style={{ backgroundColor: "blue", borderRadius: "15px" }}
          className="btn"
          onClick={() => navigate("/DC")}
        >
          DC
        </div>
        <div
          style={{ backgroundColor: "blue", borderRadius: "15px" }}
          className="btn"
          onClick={() => navigate("/Ledger")}
        >
          Ledger
        </div>
        <div
          style={{ backgroundColor: "blue", borderRadius: "15px" }}
          className="btn"
          onClick={() => navigate("/Profiles")}
        >
          Profile
        </div>
        <div
          style={{ backgroundColor: "blue", borderRadius: "15px" }}
          className="btn"
          onClick={() => navigate("/AddParty")}
        >
          Add User
        </div>
        <div
          style={{ backgroundColor: "red", borderRadius: "15px",color:"red" }}
          className="btn"
          onClick={handleLogout}
        >
          Logout
        </div>
      </div>
    </div>
  );
}

export default Home;
