import { useState, createContext, useEffect } from "react";

import fetchWrapper from "../../lib/apiCall";

export const CollectionContext = createContext();

export default function CollectionContextProvider({ children }) {
  const [currentCollectionId, setCurrentCollectionId] = useState(null);
  const [currentCollection, setCurrentCollection] = useState(null);
  const [types, setTypes] = useState([]);
  const [relationships, setRelationships] = useState([]);

  const gameDataState = {
    currentCollectionId,
    setCurrentCollectionId,
    currentCollection,
    setCurrentCollection,
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
    <CollectionContext.Provider value={gameDataState}>
      {children}
    </CollectionContext.Provider>
  );
}
