import { useState, createContext, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";

import fetchWrapper from "../../lib/apiCall";

export const CollectionContext = createContext();

export default function CollectionContextProvider({ children }) {
  const [currentCollectionId, setCurrentCollectionId] = useState(null);
  const [currentCollection, setCurrentCollection] = useState(null);
  const [types, setTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Extract notes from items helper
  const extractNotesFromItems = useCallback((itemsList) => {
    const allNotes = [];
    itemsList.forEach((item) => {
      if (item.notes && Array.isArray(item.notes)) {
        const notesWithItemId = item.notes.map((note) => ({
          ...note,
          item_id: item.item_id,
        }));
        allNotes.push(...notesWithItemId);
      }
    });
    return allNotes;
  }, []);

  // Helper to fetch optional endpoints (returns empty array on 404 or "not found" errors)
  const fetchOptionalEndpoint = useCallback(async (endpoint) => {
    try {
      const response = await fetchWrapper.apiCall(endpoint, "GET");
      return response.results || [];
    } catch (err) {
      // Check if it's a "not found" error (404 or similar)
      // The API might return messages like "No relationships found" or "404"
      const errorMessage = err.message?.toLowerCase() || "";
      const isNotFoundError =
        errorMessage.includes("404") ||
        errorMessage.includes("not found") ||
        errorMessage.includes("no ") && (
          errorMessage.includes("relationships") ||
          errorMessage.includes("types") ||
          errorMessage.includes("items")
        );

      if (isNotFoundError) {
        // Resource doesn't exist yet, return empty array (this is expected)
        return [];
      }
      
      // For other errors, log but still return empty array to not break the flow
      console.warn(`Warning: Failed to fetch ${endpoint}:`, err.message);
      return [];
    }
  }, []);

  // Fetch collection data
  const fetchCollectionData = useCallback(
    async (collectionId) => {
      if (!collectionId) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch main collection first (required)
        const collectionRes = await fetchWrapper.apiCall(
          `/collection/${collectionId}`,
          "GET"
        );

        // Fetch optional endpoints in parallel (types, relationships, items)
        // These can return 404 if empty, which is fine
        const [typesRes, relationshipsRes, itemsRes] = await Promise.all([
          fetchOptionalEndpoint(`/types/collection/${collectionId}`),
          fetchOptionalEndpoint(`/relationships/collection/${collectionId}`),
          fetchOptionalEndpoint(`/items/collection/${collectionId}`),
        ]);

        setCurrentCollection(collectionRes.result);
        setTypes(Array.isArray(typesRes) ? typesRes : []);
        setRelationships(Array.isArray(relationshipsRes) ? relationshipsRes : []);
        setItems(Array.isArray(itemsRes) ? itemsRes : []);
        setNotes(extractNotesFromItems(Array.isArray(itemsRes) ? itemsRes : []));
      } catch (err) {
        // Only fail if the main collection fetch fails
        const errorMessage =
          err.message || "Failed to load collection data";
        setError(errorMessage);
        console.error("Error loading collection data:", errorMessage);
        // Reset state on error
        setCurrentCollection(null);
        setTypes([]);
        setItems([]);
        setRelationships([]);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    },
    [extractNotesFromItems, fetchOptionalEndpoint]
  );

  useEffect(() => {
    if (
      currentCollectionId &&
      (!currentCollection ||
        currentCollectionId !== currentCollection.collection_id)
    ) {
      fetchCollectionData(currentCollectionId);
    } else if (!currentCollectionId) {
      // Reset state when collection ID is cleared
      setCurrentCollection(null);
      setTypes([]);
      setItems([]);
      setRelationships([]);
      setNotes([]);
      setError(null);
    }
  }, [currentCollectionId, currentCollection, fetchCollectionData]);

  // Memoize refetch function to use current collectionId
  const refetch = useCallback(() => {
    if (currentCollectionId) {
      fetchCollectionData(currentCollectionId);
    }
  }, [currentCollectionId, fetchCollectionData]);

  // Memoize context value to prevent unnecessary re-renders
  const gameDataState = useMemo(
    () => ({
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
      loading,
      error,
      refetch,
    }),
    [
      currentCollectionId,
      currentCollection,
      types,
      items,
      relationships,
      notes,
      loading,
      error,
      refetch,
    ]
  );

  return (
    <CollectionContext.Provider value={gameDataState}>
      {children}
    </CollectionContext.Provider>
  );
}

CollectionContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
