import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LevelElements from "./components/pages/LevelElements";
import EnemyElements from "./components/pages/EnemyElements";
import GameElements from "./components/pages/GameElements";
import GameElement from "./components/pages/GameElement";
import Dashboard from "./components/pages/Dashboard";
import Mechanics from "./components/pages/Mechanics";
import PowerUps from "./components/pages/PowerUps";
import NoPage from "./components/pages/NoPage";
import Levels from "./components/pages/Levels";
import Login from "./components/pages/Login";
import Navbar from "./components/nav/Navbar";
import Footer from "./components/nav/Footer";
import Games from "./components/pages/Games";
import Home from "./components/pages/Home";
import Game from "./components/pages/Game";
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
        <Navbar auth={auth} />
        <Routes>
          <Route
            path="/login"
            element={
              auth ? <Navigate to="/dashboard" /> : <Login setAuth={setAuth} />
            }
          />
          <Route
            path="/"
            element={auth ? <Navigate to="/dashboard" /> : <Home />}
          />
          <Route
            path="/dashboard"
            element={auth ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route exact path="/game-elements" element={<GameElements />} />
          <Route path="/mechanics" element={<Mechanics />} />
          <Route path="/levels" element={<Levels />} />
          <Route path="/level-elements" element={<LevelElements />} />
          <Route path="/enemy-elements" element={<EnemyElements />} />
          <Route path="/power-ups" element={<PowerUps />} />
          <Route path="games/:id" element={<Game />} />
          <Route path="/game-elements/:id" element={<GameElement />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
