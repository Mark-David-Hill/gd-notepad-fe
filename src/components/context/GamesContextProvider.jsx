import { useState, createContext, useEffect } from "react";

import fetchWrapper from "../../lib/apiCall";

export const GamesContext = createContext();

export default function GamesContextProvider({ children }) {
  const [types, setTypes] = useState([]);
  const [relationships, setRelationships] = useState([]);

  const gameDataState = {
    types,
    setTypes,
    relationships,
    setRelationships,
  };

  useEffect(() => {
    fetchWrapper
      .apiCall(`/types`, "GET")
      .then((response) => {
        setTypes(response.results);
      })
      .catch((error) => console.error(`couldn't get types`, error));

    fetchWrapper
      .apiCall(`/relationships`, "GET")
      .then((response) => {
        setRelationships(response.results);
      })
      .catch((error) => console.error(`couldn't get relationships`, error));
  }, []);

  return (
    <GamesContext.Provider value={gameDataState}>
      {children}
    </GamesContext.Provider>
  );
}
