import { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ExternalCollections from "./components/pages/external-collections/ExternalCollections";
import ExternalCollectionDetails from "./components/pages/external-collections/ExternalCollectionDetails";
import Collection from "./components/pages/collections/CollectionDetails";
// import Collections from "./components/pages/collections/Collections";
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
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <ExternalCollections />
              )
            }
          />
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
          <Route path="/" element={<ExternalCollections />} />
          <Route path="collection/:id" element={<Collection />} />
          <Route
            path="external-collection/:id"
            element={<ExternalCollectionDetails />}
          />
          <Route path="/item/:id" element={<Item />} />
          <Route path="/type/:id" element={<Type />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
