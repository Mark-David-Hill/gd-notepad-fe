import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/main.scss";

import GamesContextProvider from "./components/context/GamesContextProvider.jsx";
import AuthContextProvider from "./components/context/AuthContextProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <GamesContextProvider>
        <App />
      </GamesContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
