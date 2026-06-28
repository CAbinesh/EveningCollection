/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";

import DC from "./components/DC";
import Home from "./components/Home";
import Ledger from "./components/Ledger";
import Year from "./components/Year";
import Month from "./components/Month";
import DayLedger from "./components/DayLedger";
import Profiles from "./components/Profiles";
import AddParty from "./components/AddParty";
import ProfileInfo from "./components/ProfileInfo";
import Auth from "./components/Auth";

export const AuthContext = createContext();

function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/auth" replace />;
}

function AppRoutes({ user, profiles, entries, dataLoading, fetchData }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute user={user}>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/DC"
        element={
          <ProtectedRoute user={user}>
            <DC fetchData={fetchData} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Ledger"
        element={
          <ProtectedRoute user={user}>
            <Ledger />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Ledger/:year"
        element={
          <ProtectedRoute user={user}>
            <Year />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Ledger/:year/:month"
        element={
          <ProtectedRoute user={user}>
            <Month />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Ledger/:year/:month/:day"
        element={
          <ProtectedRoute user={user}>
            <DayLedger />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Profiles"
        element={
          <ProtectedRoute user={user}>
            <Profiles profile={profiles} entries={entries} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Profiles/:id"
        element={
          <ProtectedRoute user={user}>
            <ProfileInfo
              profile={profiles}
              entries={entries}
              dataLoading={dataLoading}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Addparty"
        element={
          <ProtectedRoute user={user}>
            <AddParty />
          </ProtectedRoute>
        }
      />

      <Route
        path="/auth"
        element={user ? <Navigate to="/" replace /> : <Auth />}
      />

      <Route path="*" element={<Navigate to={user ? "/" : "/auth"} replace />} />
    </Routes>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchData = useCallback(async () => {
    if (!API_URL) {
      throw new Error("VITE_API_URL is missing");
    }

    setDataLoading(true);

    try {
      const [profileRes, entriesRes] = await Promise.all([
        fetch(`${API_URL}/api/data`, {
          credentials: "include",
        }),
        fetch(`${API_URL}/api/dcEntries`, {
          credentials: "include",
        }),
      ]);

      if (!profileRes.ok) {
        throw new Error(`Profile fetch failed: ${profileRes.status}`);
      }

      if (!entriesRes.ok) {
        throw new Error(`Entries fetch failed: ${entriesRes.status}`);
      }

      const profileData = await profileRes.json();
      const entriesData = await entriesRes.json();

      setProfiles(Array.isArray(profileData) ? profileData : []);
      setEntries(Array.isArray(entriesData) ? entriesData : []);
    } finally {
      setDataLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    const initApp = async () => {
      try {
        if (!API_URL) {
          throw new Error("VITE_API_URL is missing");
        }

        const res = await fetch(`${API_URL}/api/me`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          await fetchData();
        } else {
          setUser(null);
          setProfiles([]);
          setEntries([]);
        }
      } catch (err) {
        console.error(err, "in App.jsx");
        setUser(null);
        setProfiles([]);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, [API_URL, fetchData]);

  if (loading) {
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
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        fetchData,
        profiles,
        entries,
        dataLoading,
      }}
    >
      <AppRoutes
        user={user}
        profiles={profiles}
        entries={entries}
        dataLoading={dataLoading}
        fetchData={fetchData}
      />
    </AuthContext.Provider>
  );
}

export default App;