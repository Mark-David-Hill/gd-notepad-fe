import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NoPage from "./components/pages/NoPage";
import Login from "./components/pages/Login";
import Navbar from "./components/nav/Navbar";
import Footer from "./components/nav/Footer";
import Dashboard from "./components/pages/Dashboard";
import Home from "./components/pages/Home";
import Games from "./components/pages/Games";
import Mechanics from "./components/pages/Mechanics";
import Levels from "./components/pages/Levels";
import LevelElements from "./components/pages/LevelElements";
import EnemyElements from "./components/pages/EnemyElements";
import PowerUps from "./components/pages/PowerUps";
import fetchWrapper from "./lib/apiCall";

const isAuthenticated = async () => {
  try {
    const response = await fetchWrapper.apiCall(`/user/check-login`, "GET");
    return true;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};

function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await isAuthenticated();
      setAuth(result);
    };
    checkAuth();
  }, []);

  if (auth === null) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route
            path="/login"
            element={
              auth ? <Navigate to="/dashboard" /> : <Login setAuth={setAuth} />
            }
          />
          <Route
            path="/dashboard"
            element={auth ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/mechanics" element={<Mechanics />} />
          <Route path="/levels" element={<Levels />} />
          <Route path="/level-elements" element={<LevelElements />} />
          <Route path="/enemy-elements" element={<EnemyElements />} />
          <Route path="/power-ups" element={<PowerUps />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
