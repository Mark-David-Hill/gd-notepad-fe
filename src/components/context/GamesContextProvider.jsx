import { useState, createContext, useEffect } from "react";

import fetchWrapper from "../../lib/apiCall";

export const GamesContext = createContext();

export default function GamesContextProvider({ children }) {
  const [collections, setCollections] = useState([]);
  const [types, setTypes] = useState([]);
  const [gameElements, setGameElements] = useState([]);
  const [relationships, setRelationships] = useState([]);

  const gameDataState = {
    collections,
    setCollections,
    types,
    setTypes,
    gameElements,
    setGameElements,
    relationships,
    setRelationships,
  };

  useEffect(() => {
    fetchWrapper
      .apiCall(`/items`, "GET")
      .then((response) => {
        setGameElements(response.results);
      })
      .catch((error) => console.error(`couldn't get items`, error));

    fetchWrapper
      .apiCall(`/collections`, "GET")
      .then((response) => {
        setCollections(response.results);
      })
      .catch((error) => console.error(`couldn't get collections`, error));

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
