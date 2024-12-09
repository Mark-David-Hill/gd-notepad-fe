import { useState, createContext, useEffect } from "react";

import fetchWrapper from "../../lib/apiCall";

export const GamesContext = createContext();

export default function GamesContextProvider({ children }) {
  const [games, setGames] = useState([]);
  const [types, setTypes] = useState([]);
  const [gameElements, setGameElements] = useState([]);
  const [relationships, setRelationships] = useState([]);

  const gameDataState = {
    games,
    setGames,
    types,
    setTypes,
    gameElements,
    setGameElements,
    relationships,
    setRelationships,
  };

  useEffect(() => {
    fetchWrapper
      .apiCall(`/elements`, "GET")
      .then((response) => {
        setGameElements(response.results);
      })
      .catch((error) => console.error(`couldn't get elements`, error));

    fetchWrapper
      .apiCall(`/games`, "GET")
      .then((response) => {
        setGames(response.results);
      })
      .catch((error) => console.error(`couldn't get games`, error));

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
