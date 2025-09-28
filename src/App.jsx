/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import DC from "./components/DC";
import Home from "./components/Home";
import Ledger from "./components/Ledger";
import Profiles from "./components/Profiles";
import AddParty from "./components/AddParty";
import ProfileInfo from "./components/ProfileInfo";
import Auth from "./components/Auth";

// ✅ create context
export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null); // logged-in user
  const [profiles, setProfiles] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  // fetch live data
  const fetchData = async () => {
    const profileRes = await fetch(`${API_URL}/api/data`, {
      credentials: "include",
    });
    const profileData = await profileRes.json();
    setProfiles(profileData);

    const entriesRes = await fetch(`${API_URL}/api/dcEntries`, {
      credentials: "include",
    });
    const entriesData = await entriesRes.json();
    setEntries(entriesData);
  };

  // ✅ fetch logged-in user on app load
  useEffect(() => {
    
    const initApp = async () => {
      try {
        // fetch logged-in user first
        const res = await fetch(`${API_URL}/api/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);

          // now fetch live data with the user logged in
          await fetchData();
        } else if (res.status === 401)  {
          setUser(null);
        }
      } catch (err) {
        console.error(err,"in app.jsx");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  if (loading) return <h1>Loading...</h1>;

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/auth" />} />
        <Route
          path="/dc"
          element={
            user ? <DC fetchData={fetchData} /> : <Navigate to="/auth" />
          }
        />
        <Route
          path="/ledger"
          element={
            user ? <Ledger entries={entries} /> : <Navigate to="/auth" />
          }
        />
        <Route
          path="/profiles"
          element={
            user ? (
              <Profiles profile={profiles} entries={entries} />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route
          path="/profiles/:id"
          element={
            user ? (
              <ProfileInfo profile={profiles} entries={entries} />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route
          path="/addparty"
          element={user ? <AddParty /> : <Navigate to="/auth" />}
        />
        <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
