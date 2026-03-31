import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../assets/Preview12.png";
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

  // ✅ Group by date
  const groupedEntries = filteredEntries.reduce((acc, entry) => {
    const dateKey = new Date(entry.date).toISOString().split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(entry);
    return acc;
  }, {});

  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div class="loader">
          <div class="loader__bar"></div>
          <div class="loader__bar"></div>
          <div class="loader__bar"></div>
          <div class="loader__bar"></div>
          <div class="loader__bar"></div>
          <div class="loader__ball"></div>
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
        {Object.keys(groupedEntries).length === 0 ? (
          <p style={{ fontStyle: "italic" }}>No entries found.</p>
        ) : (
          Object.keys(groupedEntries)
            .sort((a, b) => new Date(a) - new Date(b))
            .map((dateKey) => {
              const entriesForDate = groupedEntries[dateKey];
              const totalAmount = entriesForDate.reduce(
                (sum, entry) => sum + Number(entry.amount),
                0
              );
              return (
                <div className="ledgerCard" key={dateKey}>
                  <h3 className="date">
                    Date:{" "}
                    {new Date(dateKey).toLocaleDateString(
                      undefined,
                      dateOptions
                    )}
                  </h3>
                  <ul>
                    {entriesForDate
                      .sort(
                        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                      )
                      .map((entry, idx) => (
                        <li key={idx}>
                          {" "}
                          <span className="ledgertext">
                            {entry.dcNo || "Deleted Profile"}
                          </span>{"    "}
                          
                          <span className="ledgertext">
                            ₹{entry.amount.toLocaleString()}
                          </span>
                        </li>
                      ))}
                  </ul>
                  <p style={{ fontWeight: "bold", color: "white" }}>
                    Total: ₹{totalAmount.toLocaleString()}
                  </p>
                </div>
              );
            })
        )}
      </div>
      <div className="centerLine"></div>
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
