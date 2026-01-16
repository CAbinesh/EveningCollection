import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../assets/Preview12.png";


// import Profile from "./Profile";

function AddParty() {
  const [name, setName] = useState("");
  const [dcNo, setDcNo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [interest, setInterest] = useState("");
  // const [image, setImage] = useState("/user.png"); // default image path from public folder
  const [selected, setSelected] = useState("100days");
  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !dcNo || !endDate) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/data`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          dcNo,
          startDate,
          endDate,
          loanAmount,
          interest,
        }),
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || "Something went wrong!");
        return;
      }
    } catch (error) {
      console.log("err in handlesubmit", error);
    }
    alert("Submited Sucessfully");

    setName("");
    setDcNo("");
    setStartDate("");
    setEndDate("");
    setSelected("");
    setLoanAmount("");
    setInterest("");
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
    <div className="AddPartyContainer">
      <div
  className="wallpaper"
    >
       <img className="logoauths" src={Home} alt="My App Logo" />
      <button
        className="bckbtn"
        style={{ marginLeft: "10px", marginTop: "10px" }}
        type="button"
        onClick={() => navigate(-1)}
      >
        <span
          className="material-symbols-outlined"
          style={{ verticalAlign: "middle", marginRight: "6px" }}
        >
          arrow_back
        </span>
      </button>

      <div className="form1">
       
        <form onSubmit={handleSubmit}>
           <h1
            className="formtitle">
            ADD USER
          </h1>
          {/* Name Input */}
          
          <div className="form-Group">
            <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Name"
            required
          />
          </div>
          {/* DC DcNo */}
          <div className="form-Group">
            <label>DC.No:</label>
          <input
            type="text"
            value={dcNo}
            onChange={(e) => setDcNo(e.target.value)}
            placeholder="Enter DC.NO"
            required
          />
          </div>
          {/* loanamount */}
          <div className="form-Group">
            <label>Amount:</label>
          <input
            type="text"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="Enter Amount"
            required
          />
          </div>
          {/* intereset */}
          <div className="form-Group">
            <label>Interest %:</label>
          <input
            type="text"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            placeholder="Enter Interest Amount"
            required
          />
          </div>
          {/* Start Date */}
          <div className="form-Group">
            <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          </div>
          <div className="form-Group">
            <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            readOnly
            required
          />
          </div>
          {/* Radio Options */}
          <div className="full-width"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            
            <label style={{ marginBottom: "8px" }}>Select Duration:</label>
            <div className="radio-opt"
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "flex-start",
              }}
            >
              <label>
                <input
                  type="radio"
                  name="option"
                  value="100days"
                  onChange={handleChange}
                  checked={selected === "100days"}
                />{" "}
                100 Days
              </label>
              <label>
                <input
                  type="radio"
                  name="option"
                  value="5months"
                  onChange={handleChange}
                  checked={selected === "5months"}
                />{" "}
                5 Months
              </label>
            </div>
          </div>
          
          
          {/* Buttons */}
          <div className="buttonss">
            <button className="submitbtn" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}

export default AddParty;
