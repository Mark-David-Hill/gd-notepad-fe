import { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ExternalCollections from "./components/pages/external-collections/ExternalCollections";
import CollectionDetails from "./components/pages/collections/CollectionDetails";
import Item from "./components/pages/ItemDetails";
import Type from "./components/pages/TypeDetails";
import NoPage from "./components/pages/NoPage";
import Login from "./components/pages/Login";
import Navbar from "./components/nav/Navbar";
import Footer from "./components/nav/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoadingSpinner from "./components/common/LoadingSpinner";

import { AuthContext } from "./components/context/AuthContextProvider";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated === null) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />
          <Route path="/" element={<ExternalCollections />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ExternalCollections />
              </ProtectedRoute>
            }
          />
          <Route
            path="collection/:id"
            element={
              <ProtectedRoute>
                <CollectionDetails isExternal={false} />
              </ProtectedRoute>
            }
          />
          <Route
            path="external-collection/:id"
            element={<CollectionDetails isExternal={true} />}
          />
          <Route
            path="/item/:id"
            element={
              <ProtectedRoute>
                <Item />
              </ProtectedRoute>
            }
          />
          <Route
            path="/type/:id"
            element={
              <ProtectedRoute>
                <Type />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NoPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
