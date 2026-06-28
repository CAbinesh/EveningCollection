import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../assets/Preview12.png";
import userImg from "../assets/user1.png";
import { FaFilter } from "react-icons/fa";
import { FaSort } from "react-icons/fa";
function Profiles() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(() => {
    return localStorage.getItem("sort") || "dcNo";
  });
  const [profile, setProfile] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchedProfiles = async () => {
      try {
        const res = await fetch(`${API_URL}/api/data`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // ✅ very important
        });
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.log("err in profile fetch", error);
      }
    };
    fetchedProfiles();
  }, [API_URL]);
  const filteredProfiles = profile.filter(
    (entry) =>
      (entry.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (entry.dcNo || "").includes(search),
  );
  return (
    <div className="wallpaper1" style={{ minHeight: "100vh" }}>
      <img className="logoauths" src={Home} alt="My App Logo" />
      <h1 className="title">Profiles</h1>
      <div
        className="sticky-box"
        style={{ position: "sticky", top: 0, zIndex: 999 }}
      >
        <button
          className="bckbtn"
          style={{ marginLeft: "15px" }}
          type="button"
          onClick={() => navigate(-1)}
        >
          <span
            className="material-symbols-outlined"
            style={{ verticalAlign: "middle" }}
          >
            arrow_back
          </span>
        </button>
        <br />
        <div
          className="tools"
          style={{ display: "flex", gap: "20px", alignItems: "center" }}
        >
          <input
            className="sticky"
            style={{
              position: "sticky",
              top: 0,
              fontSize: "15px",
              margin: "10px 0",
              marginLeft: "15px",
              zIndex: "999",
            }}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔎 Search by DCNo....."
          />
          <div className="select-wrapper">
            <FaFilter className="filter-icon" />
            <select className="custom-select">
              <option value="">filter</option>
              <option>ComingSoon</option>
              <option>ComingSoon</option>
            </select>
            <div className="select-arrow">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
          <div className="select-wrapper">
            <FaSort className="filter-icon" />
            <select
              className="custom-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="dcNo">sort</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
            <div className="select-arrow">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="profile-container">
        {filteredProfiles.length > 0 ? (
          filteredProfiles
            .slice()
            .sort((a, b) => {
              if (sort === "newest") {
                return b._id.localeCompare(a._id);
              }

              if (sort === "oldest") {
                return a._id.localeCompare(b._id);
              }

              // Default: sort by DC No
              return a.dcNo.localeCompare(b.dcNo, undefined, {
                numeric: true,
              });
            })
            .map((entry, index) => (
              <div
                key={index}
                className="profile-card"
                onClick={() => navigate(`/Profiles/${entry.dcNo}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={userImg}
                  style={{ width: "130px", height: "130px" }}
                  alt=""
                />
                <h2 style={{ color: "white", fontSize: "40px" }}>
                  {entry.dcNo}
                </h2>
                <div className="name-pill">
                  <h4>{entry.name}</h4>
                </div>
              </div>
            ))
        ) : (
          <p>No Data Found</p>
        )}
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

export default Profiles;
