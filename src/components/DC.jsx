import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function DC(props) {
  const [dcNo, setDcNo] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dcNo || !amount || !date) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/dc/${dcNo}`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          amount,
          date,
        }),
        credentials: "include",
      });
      // belwo step use to update live in profileinfo
      if (res.ok) {
        if (props.fetchData) props.fetchData();
      }
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Something went wrong");
        return;
      }
    } catch (error) {
      console.log(error);
    }
    setDcNo("");
    setAmount("");
  };

  return (
    <div className="wallpaper">
      <div className="form">
        <div className="childdcbtn">
          <button className="bckbtn" type="button" onClick={() => navigate(-1)}>
            <span
              className="material-symbols-outlined"
              style={{ verticalAlign: "middle", marginRight: "6px" }}
            >
              arrow_back
            </span>
          </button>
        </div>

        <form style={{marginTop:'90px'}} onSubmit={handleSubmit}>
          <input
            type="text"
            value={dcNo}
            onChange={(e) => setDcNo(e.target.value)}
            placeholder="DC NO"
            required
            autoFocus={false}
          />
          <br />

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="₹"
            required
          />
          <br />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Enter Date"
            required
          />
          <br />
          <br />

          <div className="buttonss">
            <button className="submitbtn" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DC;
