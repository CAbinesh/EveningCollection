import React from "react";
import userpng from "../assets/user.png";
import { useNavigate, useParams } from "react-router-dom";
function ProfileInfo({ profile, entries }) {
  const { id } = useParams();
  const navigate = useNavigate();
  // Find the user by their unique identifier (dcNo)
  const user = profile.find((p) => String(p.dcNo) === String(id));

  // Filter entries that belong to this user
  const matchedEntries = entries.filter(
    (e) => String(e.dcNo) === String(user.dcNo)
  );

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
    <>
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
            border: "1px solid #ccc",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <img
            src={userpng}
            alt="Profile"
            style={{ width: "100%", maxWidth: "200px", borderRadius: "25%" }}
          />
          <h3 style={{ color: "blue" }}>NAME: {user.name}</h3>
          <h5 style={{ color: "red" }}>DC.NO: {user.dcNo}</h5>
          <h4>Start: {new Date(user.startDate).toLocaleDateString()}</h4>
          <h4>End: {new Date(user.endDate).toLocaleDateString()}</h4>
          <h4 style={{ color: "red", fontStyle: "italic" }}>
            Days left: {remaindays > 0 ? remaindays : "expired"}
          </h4>

          <button style={{ marginTop: "10px" }}>Delete❌</button>
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
                <tr style={{ fontWeight: "bold", backgroundColor: "#f9f9f9" }}>
                  <td style={{ color: "red" }}>
                    Total: ₹
                    {matchedEntries
                      .reduce(
                        (sum, entry) => sum + Number(entry.amount || 0),
                        0
                      )
                      .toLocaleString()}
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
    </>
  );
}
export default ProfileInfo;
