import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../assets/Preview12.png";
import { MdOutlineCalendarMonth } from "react-icons/md";
function Ledger() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Fetch all ledger entries from backend
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

  // ✅ Filter by name, date, or amount
  const filteredEntries = allEntries.filter((entry) => {
    const entryDate = new Date(entry.date).toISOString().split("T")[0];
    return (
      (entry.profileName &&
        entry.profileName.toLowerCase().includes(search.toLowerCase())) ||
      entryDate.includes(search) ||
      (entry.dcNo && entry.dcNo.toString().includes(search))
    );
  });

  // // ✅ Group by date
  // const groupedEntries = filteredEntries.reduce((acc, entry) => {
  //   const dateKey = new Date(entry.date).toISOString().split("T")[0];
  //   if (!acc[dateKey]) acc[dateKey] = [];
  //   acc[dateKey].push(entry);
  //   return acc;
  // }, {});

  // const dateOptions = {
  //   weekday: "long",
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  // };

  const years = [
    ...new Set(
      filteredEntries.map((entry) => new Date(entry.date).getFullYear()),
    ),
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

      <h1 className="title">Ledger</h1>

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
        {years.length == 0 ? (
          <p>No entries found</p>
        ) : (
          years.map((year) => (
            <button
              className="MainledgerCard"
              key={year}
              type="button"
              onClick={() => navigate(`/ledger/${year}`)}
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
                  <h3 className="date">{year}</h3>
                </div>
              </div>
            </button>
          ))
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

export default Ledger;
