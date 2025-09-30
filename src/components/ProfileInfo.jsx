import React from "react";
import userpng from "../assets/user.png";
import { useNavigate, useParams } from "react-router-dom";
import dc from "../assets/dc.png";

function ProfileInfo({ profile, entries }) {
  const { id } = useParams();
  const navigate = useNavigate();
  // Find the user by their unique identifier (dcNo)
  const user = profile.find((p) => String(p.dcNo) === String(id));

  // Filter entries that belong to this user
  const matchedEntries = entries.filter(
    (e) => String(e.dcNo) === String(user.dcNo)
  );
  const total = matchedEntries.reduce(
  (sum, entry) => sum + Number(entry.amount || 0),
  0
);
  const balance = Number(user.loanAmount) - total;
  if (!user) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>User not found or loading...</h2>
      </div>
    );
  }

  const today = new Date();
  const endDate = new Date(user.endDate);
  const remaindays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

  return (
    <div
      style={{
        backgroundImage: `url(${dc})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
      }}
    >
      <button
        className="bckbtn"
        style={{ marginTop: "10px", marginLeft: "10px" }}
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>

      <div className="profile-details">
        {/* Profile Card */}
        <div
          className="profile-card"
          style={{
            width: "40%",
            maxWidth: "520px",
            backgroundImage:
              "linear-gradient(135deg, #fefefeff 0%, #ea8eca94 35%, #7b9bdca6 70%, #c983ec90 100%)",
            borderRadius: "14px",
            padding: "22px",
            border: "1px solid rgba(15, 23, 42, 0.53)",
            boxShadow: "0 6px 20px rgba(9, 179, 236, 1)",
            fontFamily: "Inter, Segoe UI, Roboto, sans-serif",
            color: "#111827",
          }}
        >
          <img
            src={userpng}
            alt="Profile"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              display: "block",
              margin: "0 auto 18px",
              objectFit: "cover",
              border: "3px solid rgba(15,23,42,0.04)",
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
            }}
          />

          <h3
            style={{
              textAlign: "center",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "#0c17dfff",
              marginBottom: "16px",
            }}
          >
            {user.name}
          </h3>

          {/* Each detail row as h4 with border */}
          <h4
            style={{
              margin: "8px 0",
              padding: "8px 0",
              borderBottom: "1px solid#1b3d81ff",
              fontWeight: 500,
              color: "red",
            }}
          >
            DC.NO: <span style={{ fontWeight: 600 }}>{user.dcNo}</span>
          </h4>
          <h4
            style={{
              margin: "8px 0",
              padding: "8px 0",
              borderBottom: "1px solid #1b3d81ff",
              fontWeight: 500,
            }}
          >
            Amount: <span style={{ fontWeight: 600 }}>{user.loanAmount}</span>
          </h4>
          <h4
            style={{
              margin: "8px 0",
              padding: "8px 0",
              borderBottom: "1px solid#1b3d81ff",
              fontWeight: 500,
            }}
          >
            Interest %: <span style={{ fontWeight: 600 }}>{user.interest}</span>
          </h4>
          <h4
            style={{
              margin: "8px 0",
              padding: "8px 0",
              borderBottom: "1px solid#1b3d81ff",
              fontWeight: 500,
            }}
          >
            Start:{" "}
            <span style={{ fontWeight: 600 }}>
              {new Date(user.startDate).toLocaleDateString()}
            </span>
          </h4>
          <h4
            style={{
              margin: "8px 0",
              padding: "8px 0",
              borderBottom: "1px solid#1b3d81ff",
              fontWeight: 500,
            }}
          >
            End:{" "}
            <span style={{ fontWeight: 600 }}>
              {new Date(user.endDate).toLocaleDateString()}
            </span>
          </h4>
          <h4
            style={{
              margin: "8px 0",
              padding: "8px 0",
              borderBottom: "1px solid#1b3d81ff",
              fontWeight: 500,
              color: remaindays > 0 ? "#238d1fff" : "#dc2626",
            }}
          >
            Days left:{" "}
            <span style={{ fontWeight: 700 }}>
              {remaindays > 0 ? remaindays : "Expired"}
            </span>
          </h4>

          <button
            style={{
              marginTop: "18px",
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "10px",
              background: "linear-gradient(90deg, #ef4444, #b91c1c)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(203,20,20,0.14)",
            }}
          >
            Delete ❌
          </button>
        </div>

        {/* Table Section */}
        <div style={{ width: "60%" }}>
          <strong>Entries:</strong>

          {matchedEntries.length > 0 ? (
            <table
              border="1"
              style={{
                width: "100%",
                marginTop: "8px",
                borderCollapse: "collapse",
                textAlign: "center",
              }}
            >
              <thead>
                <tr>
                  <th>Amount (₹)</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {matchedEntries.map((e, i) => (
                  <tr key={i}>
                    <td>{e.amount}</td>
                    <td>{new Date(e.date).toLocaleDateString()}</td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr
                  style={{ fontWeight: "bold", backgroundColor: "#e7e275ff" }}
                >
                  <td style={{ color: "red" }}>Total: ₹{total}</td>
                  <td></td>
                </tr>
                {/* Balance */}
                <tr
                  style={{ fontWeight: "bold", backgroundColor: "#c4ed82ff" }}
                >
                  <td style={{ color: "black" }}>
                    Balance: ₹{balance.toLocaleString()}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p style={{ fontStyle: "italic" }}>No entries yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProfileInfo;
