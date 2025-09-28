import React, { useEffect, useState } from "react";
import dc from "../assets/dc.png";
import { useNavigate } from "react-router-dom";

function Profiles() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [profile, setProfile] = useState([]);
const API_URL=import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchedProfiles = async () => {
      try {
        const res = await fetch(`${API_URL}/api/data`,{
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
      (entry.dcNo || "").includes(search)
  );
  return (
    <div
      style={{
        backgroundImage: `url(${dc})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      <button className="bckbtn" type="button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <br />
      <input
        className="sticky"
        style={{ width: "50%", position: "sticky", top: 0 }}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔎 Search by name or DC No..."
      />
      <div className="profile-container">
        {filteredProfiles.length > 0 ? (
          filteredProfiles
            .slice() // make a copy so we don’t mutate state
            .sort((a, b) =>
              a.dcNo.localeCompare(b.dcNo, undefined, { numeric: true })
            )
            .map((entry, index) => (
              <div
                key={index}
                className="profile-card"
                onClick={() => navigate(`/Profiles/${entry.dcNo}`)}
                style={{ cursor: "pointer" }}
              >
                <h3 style={{ color: "red" }}>{entry.dcNo}</h3>
                <h4 style={{ color: "blue" }}>{entry.name}</h4>

                <p>Tap to view entries</p>
              </div>
            ))
        ) : (
          <p>No Data Found</p>
        )}
      </div>
    </div>
  );
}

export default Profiles;
