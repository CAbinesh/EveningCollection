import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Home from "../assets/Preview12.png";

function Month() {
  const navigate = useNavigate();
  const { year, month } = useParams();
  const [search, setSearch] = useState("");
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const response = await fetch(`${API_URL}/api/ledger`);
        const data = await response.json();
        setAllEntries(data);
      } catch (err) {
        console.error("Error fetching ledger:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  }, [API_URL]);

  const monthName = new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
    undefined,
    { month: "long" },
  );

  const filteredEntries = allEntries.filter((entry) => {
    const entryDate = new Date(entry.date).toISOString().split("T")[0];
    return (
      entryDate.startsWith(`${year}-${month}`) &&
      ((entry.profileName &&
        entry.profileName.toLowerCase().includes(search.toLowerCase())) ||
        entryDate.includes(search) ||
        (entry.dcNo && entry.dcNo.toString().includes(search)))
    );
  });

  const days = [
    ...new Set(filteredEntries.map((entry) => new Date(entry.date).getDate())),
  ].sort((a, b) => a - b);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader">
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__ball"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="wallpaper1" style={{ minHeight: "100vh" }}>
      <img className="logoauths" src={Home} alt="My App Logo" />
      <h1 className="title">
        {monthName} {year}
      </h1>

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

        <input
          className="sticky"
          style={{
            position: "sticky",
            top: 0,
            margin: "10px 0",
            marginLeft: "15px",
            zIndex: "999",
          }}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔎 Search by name,dcNo,or date (YYYY-MM-DD)..."
        />
      </div>

      <div className="ledgerContainer">
        {days.length === 0 ? (
          <p style={{ fontStyle: "italic" }}>No entries found.</p>
        ) : (
          days.map((day) => {
            const dayNumber = String(day).padStart(2, "0");

            return (
              <button
                className="MainledgerCard"
                key={day}
                type="button"
                onClick={() => navigate(`/ledger/${year}/${month}/${dayNumber}`)}
                style={{ cursor: "pointer", textAlign: "left" }}
              >
                <div className="SubledgerCard">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "18px",
                    }}
                  >
                    <span style={{ fontSize: "34px"}}>📂</span>
                    <h3 className="date">
                      {dayNumber}-{month}-{year}
                    </h3>
                  </div>
                </div>
              </button>
            );
          })
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

export default Month;