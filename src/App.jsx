import { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import GameElements from "./components/pages/GameElements";
import GameElement from "./components/pages/GameElement";
import Dashboard from "./components/pages/Dashboard";
import NoPage from "./components/pages/NoPage";
import Login from "./components/pages/Login";
import Navbar from "./components/nav/Navbar";
import Footer from "./components/nav/Footer";
import Games from "./components/pages/Games";
import Home from "./components/pages/Home";
import Game from "./components/pages/Game";

import { AuthContext } from "./components/context/AuthContextProvider";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Home />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route exact path="/game-elements" element={<GameElements />} />
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
