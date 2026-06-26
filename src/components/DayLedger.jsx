import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineCalendarMonth } from "react-icons/md";
import Home from "../assets/Preview12.png";

function DayLedger() {
  const navigate = useNavigate();
  const { year, month, day } = useParams();
  const [search, setSearch] = useState("");
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
const monthNumber = String(Number(month)).padStart(2, "0");
const dayNumber = String(Number(day)).padStart(2, "0");
const dateKey = `${year}-${monthNumber}-${dayNumber}`;
const selectedDate = new Date(
  Number(year),
  Number(monthNumber) - 1,
  Number(dayNumber),
);
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

  const entriesForDate = allEntries
    .filter((entry) => {
      const entryDate = new Date(entry.date).toISOString().split("T")[0];
      return (
        entryDate === dateKey &&
        ((entry.profileName &&
          entry.profileName.toLowerCase().includes(search.toLowerCase())) ||
          entryDate.includes(search) ||
          (entry.dcNo && entry.dcNo.toString().includes(search)))
      );
    })
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const totalAmount = entriesForDate.reduce(
    (sum, entry) => sum + Number(entry.amount),
    0,
  );

  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

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
        {entriesForDate.length === 0 ? (
          <p style={{ fontStyle: "italic" }}>No entries found.</p>
        ) : (
          <div className="MainledgerCard">
            <div className="SubledgerCard">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                }}
              >
                <MdOutlineCalendarMonth
                  style={{
                    fontSize: "30px",
                    backgroundColor: "blue",
                    borderRadius: "10px",
                    padding: "2px",
                  }}
                />
                <h3 className="date">
                  Date:{" "}
                  {selectedDate.toLocaleDateString(undefined, dateOptions)}
                </h3>
              </div>
            </div>

            <div className="ledgerCard">
              <ul>
                {entriesForDate.map((entry, idx) => (
                  <li key={idx}>
                    <span className="ledgertext">
                      {entry.dcNo || "Deleted Profile"}
                    </span>
                    {"    "}
                    <span className="ledgertext">
                      ₹{Number(entry.amount).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
              <p style={{ fontWeight: "bold", color: "white" }}>
                Total: ₹{totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
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

export default DayLedger;
