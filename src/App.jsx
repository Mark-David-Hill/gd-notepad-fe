import { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ExternalCollections from "./components/pages/external-collections/ExternalCollections";
import UnifiedCollectionDetails from "./components/pages/collections/UnifiedCollectionDetails";
import Item from "./components/pages/ItemDetails";
import Type from "./components/pages/TypeDetails";
import NoPage from "./components/pages/NoPage";
import Login from "./components/pages/Login";
import Navbar from "./components/nav/Navbar";
import Footer from "./components/nav/Footer";

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
          <Route path="/" element={<ExternalCollections />} />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <ExternalCollections />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="collection/:id"
            element={
              isAuthenticated ? (
                <UnifiedCollectionDetails isExternal={false} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="external-collection/:id"
            element={<UnifiedCollectionDetails isExternal={true} />}
          />
          <Route
            path="/item/:id"
            element={isAuthenticated ? <Item /> : <Navigate to="/login" />}
          />
          <Route
            path="/type/:id"
            element={isAuthenticated ? <Type /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<NoPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
