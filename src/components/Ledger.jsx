import React, { useEffect, useState } from "react";
import dc from "../assets/dc.png";
import { useNavigate } from "react-router-dom";

function Ledger({ entries }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [allEntries, setAllEntries] = useState([]);

  // Sync local state with prop updates (live update)
  useEffect(() => {
    setAllEntries(entries || []);
  }, [entries]);

  // Filter entries by DC No, name, or date
  const filteredEntries = allEntries.filter((entry) => {
    const entryDate = new Date(entry.date).toISOString().split("T")[0]; // YYYY-MM-DD
    return (
      entry.dcNo.includes(search) ||
      (entry.name && entry.name.toLowerCase().includes(search.toLowerCase())) ||
      entryDate.includes(search) // search by date
    );
  });

  // Group entries by date
  // Group entries by date (YYYY-MM-DD)
const groupedEntries = filteredEntries.reduce((acc, entry) => {
  const dateKey = new Date(entry.date).toISOString().split("T")[0]; // same format as filter
  if (!acc[dateKey]) acc[dateKey] = [];
  acc[dateKey].push(entry);
  return acc;
}, {});


  const dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };

  return (
    <div
      style={{
        backgroundImage: `url(${dc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      <h1 className="title">Ledger</h1>

      <button className="bckbtn" type="button" onClick={() => navigate(-1)}>
       <span className="material-symbols-outlined" style={{ verticalAlign: "middle", marginRight: "6px" }}>
        arrow_back
      </span>
      
      </button>
      <br />

      <input
        className="sticky"
        style={{ width: "50%", position: "sticky", top: 0, margin: "10px 0" }}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔎 Search by  date (YYYY-MM-DD)..."
      />

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
              <div
                key={dateKey}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "15px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h3>Date: {new Date(dateKey).toLocaleDateString(undefined, dateOptions)}</h3>
                <ul>
                  {entriesForDate.map((entry, idx) => (
                    <li key={idx}>
                      DC No: {entry.dcNo} | Amount: ₹{entry.amount.toLocaleString()}
                    </li>
                  ))}
                </ul>
                <p style={{ fontWeight: "bold", color: "red" }}>
                  Total: ₹{totalAmount.toLocaleString()}
                </p>
              </div>
            );
          })
      )}
    </div>
  );
}

export default Ledger;
