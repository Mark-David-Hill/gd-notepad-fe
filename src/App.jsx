import { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import GameElements from "./components/pages/GameElements";
import GameElement from "./components/pages/GameElement";
import Collections from "./components/pages/Collections";
import Dashboard from "./components/pages/Dashboard";
import Collection from "./components/pages/Collection";
import NoPage from "./components/pages/NoPage";
import Login from "./components/pages/Login";
import Navbar from "./components/nav/Navbar";
import Footer from "./components/nav/Footer";
import Types from "./components/pages/Types";
import Home from "./components/pages/Home";

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
          <Route path="/collections" element={<Collections />} />
          <Route path="/types" element={<Types />} />
          <Route exact path="/game-elements" element={<GameElements />} />
          <Route path="collections/:id" element={<Collection />} />
          <Route path="/game-elements/:id" element={<GameElement />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
