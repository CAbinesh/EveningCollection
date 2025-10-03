import React from "react";
import userpng from "../assets/user.png";
import { useNavigate, useParams } from "react-router-dom";
import dc from "../assets/dc.png";

function ProfileInfo({ profile, entries }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

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
 const handleDelete = async (id) => {
  try {
    // 1. Download Word document
    const response = await fetch(`${API_URL}/api/download-doc/${id}`, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to download Word file");

    // Ensure correct MIME type
    const contentType = response.headers.get("Content-Type");
    if (
      !contentType ||
      !contentType.includes(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
    ) {
      throw new Error("Invalid file format received from server");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // 2. Set filename (from server or fallback to username.docx)
    const disposition = response.headers.get("Content-Disposition");
    let filename = `${user.name}.docx`;
    if (disposition && disposition.includes("filename=")) {
      filename = disposition.split("filename=")[1].replace(/"/g, "");
    }

    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    // 3. Delete profile AFTER download completes
    const delResponse = await fetch(`${API_URL}/api/data/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!delResponse.ok) throw new Error("Delete failed");

    alert("✅ User data downloaded as Word and account deleted!");
    navigate(-1);
  } catch (err) {
    console.error(err);
    alert("⚠️ " + err.message);
  }
};


  return (
    <div
      style={{
        backgroundImage: `url(${dc})`,
        backgroundSize: "cover",
        backgroundPosition: "center", // centers the image
        minHeight: "100vh",
      }}
    >
      <h1>ProfileInfo</h1>
      <button
        className="bckbtn"
        style={{  marginLeft: "10px" }}
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>

      <div className="profile-details">
        {/* Profile Card */}
        <div className="profileInfo-card">
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
            Amount: <span style={{ fontWeight: 600 }}>₹ {user.loanAmount}</span>
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
              {remaindays > 0 ? remaindays : -Math.abs(remaindays)}
            </span>
          </h4>

          <button
            onClick={() => handleDelete(user._id)}
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
        <div style={{ width: "80%" }}>
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
              <thead style={{ border: "3px solid #333" }}>
                <tr>
                  <th>Amount (₹)</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody style={{ border: "3px solid #333" }}>
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
