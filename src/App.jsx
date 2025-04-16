import { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Collections from "./components/pages/collections/Collections";
import Collection from "./components/pages/collections/Collection";
import NoPage from "./components/pages/NoPage";
import Login from "./components/pages/Login";
import Navbar from "./components/nav/Navbar";
import Footer from "./components/nav/Footer";
import Item from "./components/pages/Item";

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
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Collections />
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <Collections /> : <Navigate to="/login" />
            }
          />
          <Route path="/" element={<Collections />} />
          <Route path="collection/:id" element={<Collection />} />
          <Route path="/item/:id" element={<Item />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
