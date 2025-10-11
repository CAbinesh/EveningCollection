import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      (entry.amount && entry.amount.toString().includes(search))
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
      <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
        Loading ledger...
      </div>
    );
  }

  return (
    <div className="wallpaper" style={{ minHeight: "100vh" }}>
      <h1 className="title">Ledger</h1>

      <button className="bckbtn" type="button" onClick={() => navigate(-1)}>
        <span
          className="material-symbols-outlined"
          style={{ verticalAlign: "middle", marginLeft: "5px" }}
        >
          arrow_back
        </span>
      </button>
      <br />

      <input
        className="sticky"
        style={{ width: "50%", position: "sticky", top: 0, margin: "10px 0",zIndex:"999" }}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔎 Search by name, amount, or date (YYYY-MM-DD)..."
      />

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
                  <h3>
                    Date:{" "}
                    {new Date(dateKey).toLocaleDateString(
                      undefined,
                      dateOptions
                    )}
                  </h3>
                  <ul>
                    {entriesForDate.map((entry, idx) => (
                      <li key={idx}>
                        Profile:{" "}
                        <span style={{ color: "#9af" }}>
                          {entry.dcNo || "Deleted Profile"}
                        </span>{" "}
                        ⇛ Amount : ₹{entry.amount.toLocaleString()}
                      </li>
                    ))}
                  </ul>
                  <p style={{ fontWeight: "bold", color: "yellow" }}>
                    Total: ₹{totalAmount.toLocaleString()}
                  </p>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}

export default Ledger;
