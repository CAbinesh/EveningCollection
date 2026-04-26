import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PreviewImg from "../assets/Preview12.png"; // ✅ import video
import Thandelimg from "../assets/Thandel.png";
import NoteitImg from "../assets/Noteit.png";
import { LuUsers } from "react-icons/lu";
import { SiBookstack } from "react-icons/si";
import { GiTakeMyMoney } from "react-icons/gi";
import { IoMdPersonAdd } from "react-icons/io";
import { AiOutlinePoweroff } from "react-icons/ai";
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
        <div className="exploreHeader">
          <div className="exploreLeft">
            <img src="/dashboard.png" alt="explore icon" />
           <h2 className="ddh2">Dashboard</h2>
          </div>
        </div>
       
      </div>
      <div className="maincontainer">
        <div className="btn1" onClick={() => navigate("/DC")}>
          <div className="btnDetail">
            <h3 className="h3">DC</h3>
            <p className="p">
              Manage district configurations
              <br /> and data.
            </p>
            <span className="link">View →</span>
          </div>
          <div className="btnlogo1">
            <GiTakeMyMoney />
          </div>
        </div>

        <div className="btn4" onClick={() => navigate("/Profiles")}>
          <div className="btnDetail">
            {" "}
            <h3 className="h3">Profiles</h3>
            <p className="p">View and Manage Profiles</p>
            <span className="link">View →</span>
          </div>
          <div className="btnlogo2">
            <LuUsers />
          </div>
        </div>

        <div className="btn2" onClick={() => navigate("/Ledger")}>
          <div className="btnDetail">
            {" "}
            <h3 className="h3">Ledger</h3>
            <p className="p">Access and View Full Records</p>
            <span className="link">View →</span>
          </div>
          <div className="btnlogo3">
            <SiBookstack />
          </div>
        </div>

        <div className="btn3" onClick={() => navigate("/AddParty")}>
          <div className="btnDetail">
            <h3 className="h3">Add User</h3>
            <p className="p">Create New User</p>
            <span className="link">View →</span>
          </div>
          <div className="btnlogo4">
            <IoMdPersonAdd />
          </div>
        </div>
        <div className="btn5"></div>
        <div className="btnLogout" onClick={() => setShowLogoutConfirm(true)}style={{display:"flex",flexDirection:"column"}}>
        <div> <AiOutlinePoweroff style={{fontSize:"35px"}} /></div> Logout
        </div>

        {showLogoutConfirm && (
          <div className="modalBackdrop">
            <div className="modalBox">
              <h2 style={{ color: "red" }}>Confirm Logout</h2>
              <h5 style={{ color: "black" }}>
                Are you sure you want to logout?
              </h5>
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
      <div className="centerLine1"></div>
      <div className="Trylink">
        <div className="exploreHeader">
          <div className="exploreLeft">
            <img src="/explore.png" alt="explore icon" />
            <h2>Explore More</h2>
          </div>
        </div>
        <div className="noteit">
          <div className="innerNoteit">
            <img
              src={NoteitImg}
              alt="logo"
              style={{ height: "70px", width: "70px" }}
            />{" "}
            <h2 className="linkh2">Note It</h2>
            <p className="linkp">
              Capture your thoughts effortlessly. Try our notes app today.
            </p>
            <a
              className="linkButton"
              href="https://kimplebackend-front.onrender.com/#/auth"
              target="_blank"
              rel="noreferrer"
            >
              Try Now
            </a>
          </div>
        </div>
        <div className="thandel">
          <div className="innerThandel">
            <img
              src={Thandelimg}
              alt="logo"
              style={{ height: "70px", width: "70px" }}
            />{" "}
            <h2 className="linkh2">Thandel</h2>
            <p className="linkp">
              Securely store and manage your financial data with ease.
            </p>
            <a
              className="linkButton"
              href="https://thandalfront.onrender.com/"
              target="_blank"
              rel="noreferrer"
            >
              Try Now
            </a>
          </div>
        </div>
      </div>
      <div className="centerLine2"></div>
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
