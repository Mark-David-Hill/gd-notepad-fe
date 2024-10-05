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

const isAuthenticated = () => {
  return true;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  return !isAuthenticated() ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <div className="app-container">
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
