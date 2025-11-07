import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/main.scss";

import CollectionContextProvider from "./components/context/CollectionContextProvider.jsx";
import AuthContextProvider from "./components/context/AuthContextProvider.jsx";
import ThemeContextProvider from "./components/context/ThemeContextProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <AuthContextProvider>
        <CollectionContextProvider>
          <App />
        </CollectionContextProvider>
      </AuthContextProvider>
    </ThemeContextProvider>
  </React.StrictMode>
);
