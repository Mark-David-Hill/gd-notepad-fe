import { useState, createContext, useEffect } from "react";

import fetchWrapper from "../../lib/apiCall";

export const CollectionContext = createContext();

export default function CollectionContextProvider({ children }) {
  const [currentCollectionId, setCurrentCollectionId] = useState(null);
  const [currentCollection, setCurrentCollection] = useState(null);
  const [types, setTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [notes, setNotes] = useState([]);

  const gameDataState = {
    currentCollectionId,
    setCurrentCollectionId,
    currentCollection,
    setCurrentCollection,
    types,
    setTypes,
    items,
    setItems,
    relationships,
    setRelationships,
    notes,
    setNotes,
  };

  useEffect(() => {
    if (
      currentCollectionId &&
      (!currentCollection ||
        currentCollectionId !== currentCollection.collection_id)
    ) {
      fetchWrapper
        .apiCall(`/collection/${currentCollectionId}`, "GET")
        .then((response) => {
          setCurrentCollection(response.result);
        })
        .catch((error) => console.error(`couldn't retrieve collection`, error));

      fetchWrapper
        .apiCall(`/types/collection/${currentCollectionId}`, "GET")
        .then((response) => {
          setTypes(response.results);
        })
        .catch((error) => console.error(`couldn't get types`, error));

      fetchWrapper
        .apiCall(`/relationships/collection/${currentCollectionId}`, "GET")
        .then((response) => {
          setRelationships(response.results);
        })
        .catch((error) => console.error(`couldn't get relationships`, error));

      fetchWrapper
        .apiCall(`/items/collection/${currentCollectionId}`, "GET")
        .then((response) => {
          setItems(response.results);
          
          // Extract notes from items and add item_id to each note
          const allNotes = [];
          response.results.forEach(item => {
            if (item.notes && Array.isArray(item.notes)) {
              const notesWithItemId = item.notes.map(note => ({
                ...note,
                item_id: item.item_id
              }));
              allNotes.push(...notesWithItemId);
            }
          });
          setNotes(allNotes);
        })
        .catch((error) => console.error(`couldn't get items`, error));
    }
  }, [currentCollectionId]);

  return (
    <CollectionContext.Provider value={gameDataState}>
      {children}
    </CollectionContext.Provider>
  );
}
