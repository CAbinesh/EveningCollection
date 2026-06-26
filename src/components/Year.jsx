import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaFolder } from "react-icons/fa";
import Home from "../assets/Preview12.png";

function Year() {
  const navigate = useNavigate();
  const { year } = useParams();
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

  const filteredEntries = allEntries.filter((entry) => {
    const entryDate = new Date(entry.date).toISOString().split("T")[0];
    return (
      new Date(entry.date).getFullYear().toString() === year &&
      ((entry.profileName &&
        entry.profileName.toLowerCase().includes(search.toLowerCase())) ||
        entryDate.includes(search) ||
        (entry.dcNo && entry.dcNo.toString().includes(search)))
    );
  });

  const months = [
    ...new Set(filteredEntries.map((entry) => new Date(entry.date).getMonth())),
  ].sort((a, b) => a - b);

  const monthName = (monthIndex) =>
    new Date(Number(year), monthIndex, 1).toLocaleDateString(undefined, {
      month: "long",
    });

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
      <h1 className="title">{year}</h1>

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
        {months.length === 0 ? (
          <p style={{ fontStyle: "italic" }}>No entries found.</p>
        ) : (
          months.map((month) => {
            const monthNumber = String(month + 1).padStart(2, "0");

            return (
              <button
                className="MainledgerCard"
                key={month}
                type="button"
                onClick={() => navigate(`/ledger/${year}/${monthNumber}`)}
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
                    <FaFolder style={{ fontSize: "34px", color: "#f3c84b" }} />
                    <h3 className="date">{monthName(month)}</h3>
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

export default Year;
