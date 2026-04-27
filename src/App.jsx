/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState } from "react";
import {
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";

import DC from "./components/DC";
import Home from "./components/Home";
import Ledger from "./components/Ledger";
import Profiles from "./components/Profiles";
import AddParty from "./components/AddParty";
import ProfileInfo from "./components/ProfileInfo";
import Auth from "./components/Auth";

// ✅ create context
export const AuthContext = createContext();

function AppRoutes({ user, profiles, entries, fetchData }) {
  const location = useLocation();

  // ✅ scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
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
  );
}

function App() {
  const [user, setUser] = useState(null);
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

  // fetch logged-in user
  useEffect(() => {
    const initApp = async () => {
      try {
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
        <div className="loader">
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__ball"></div>
        </div>
      </div>
    );

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <AppRoutes
        user={user}
        profiles={profiles}
        entries={entries}
        fetchData={fetchData}
      />
    </AuthContext.Provider>
  );
}

export default App;