import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import dc from "../assets/dc.png";

// import Profile from "./Profile";

function AddParty() {
  const [name, setName] = useState("");
  const [dcNo, setDcNo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // const [image, setImage] = useState("/user.png"); // default image path from public folder
  const [selected, setSelected] = useState("");
const API_URL=import.meta.env.VITE_API_URL

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !dcNo||!endDate) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const res=await fetch(`${API_URL}/api/data`,{
        method:'POST',
        headers:{"content-type":"application/json"},
        body:JSON.stringify({
           name,
          dcNo,
          startDate,
          endDate,
        }),
         credentials: "include"
      })
      if (!res.ok) {
      const errData = await res.json();
      alert(errData.error ||"Something went wrong!");
      return;
    }
    } catch (error) {
      console.log('err in handlesubmit',error)
    }
    alert("Submited Sucessfully");

    setName("");
    setDcNo("");
    setStartDate("");
    setEndDate("");
    setSelected("");
  };

  const handleChange = (e) => {
    const option = e.target.value;
    setSelected(option);

    const Startdate = new Date(startDate);
    let newEndDate;

    if (option === "100days") {
      newEndDate = new Date(Startdate);
      newEndDate.setDate(Startdate.getDate() + 100);
    } else if (option === "5months") {
      newEndDate = new Date(Startdate);
      newEndDate.setMonth(Startdate.getMonth() + 5);
    }
    const formatted = newEndDate.toISOString().split("T")[0];
    setEndDate(formatted);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${dc})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      <button
        className="bckbtn"
        style={{ marginLeft: "10px", marginTop: "10px" }}
        type="button"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="form1">
        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <h1 style={{ justifyContent: "center", display: "flex" }}>
            ADD USER
          </h1>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <br />
          {/* DC DcNo */}
          <input
            type="text"
            value={dcNo}
            onChange={(e) => setDcNo(e.target.value)}
            placeholder="DC.NO"
            required
          />
          <br />
          {/* Start Date */}
          <label>Start Date:</label>
          <br />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <br />
          {/* End Date */}
          <label>End Date:</label>
          <br />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            readOnly
            required
          />
          <br />
          {/* Radio Options */}
          <label style={{ marginLeft: "55px" }}>Select Duration:</label>
          <br />
          <input
            style={{ marginLeft: "55px" }}
            type="radio"
            name="option"
            value="100days"
            onChange={handleChange}
            checked={selected === "100days"}
          />{" "}
          100 Days
          <br />
          <input
            style={{ marginLeft: "55px" }}
            type="radio"
            name="option"
            value="5months"
            onChange={handleChange}
            checked={selected === "5months"}
          />{" "}
          5 Months
          <br />
          <br />
          {/* Buttons */}
          <div className="buttonss">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddParty;
