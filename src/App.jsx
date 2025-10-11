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
        } else if (res.status === 401) {
          setUser(null);
        }
      } catch (err) {
        console.error(err, "in app.jsx");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading)
    return (
      <div className="loader-container">
        <svg className="loader" viewBox="0 0 100 100">
          <circle className="moon moon-back"></circle>
          <circle className="planet"></circle>
          <circle className="moon moon-front"></circle>
        </svg>
        <br />
        <br />
        <br />
        <h2 className="dotburning">
          Burning
          <span className="dot">
            <span>🔥</span>
            <span>🔥</span>
            <span>🔥</span>
          </span>
        </h2>
      </div>
    );

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/DC"
          element={
            user ? (
              <DC fetchData={fetchData} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/Ledger"
          element={user ? <Ledger /> : <Navigate to="/auth" replace />}
        />

        <Route
          path="/Profiles"
          element={
            user ? (
              <Profiles profile={profiles} entries={entries} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/Profiles/:id"
          element={
            user ? (
              <ProfileInfo profile={profiles} entries={entries} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/Addparty"
          element={user ? <AddParty /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/Auth"
          element={user ? <Navigate to="/" replace /> : <Auth />}
        />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
