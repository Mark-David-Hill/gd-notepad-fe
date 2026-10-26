import { useEffect, useState } from "react";

import { fetchCatalog } from "../util/googleSheetsUtil";

/**
 * Finds an external collection's catalog row by ID.
 *
 * When the visitor arrives from a collection card, the row is already in
 * router state and is used as-is. Otherwise (a refresh or a shared link) the
 * catalog sheet is loaded and searched by collection_id.
 *
 * Pass a null id to skip (internal collections).
 */
export default function useExternalCollectionEntry(id, initialEntry) {
  const hasInitialEntry =
    Boolean(id) && String(initialEntry?.collection_id) === id;

  const [entry, setEntry] = useState(hasInitialEntry ? initialEntry : null);
  const [loading, setLoading] = useState(Boolean(id) && !hasInitialEntry);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    if (hasInitialEntry) {
      setEntry(initialEntry);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCatalog()
      .then((rows) => {
        if (cancelled) return;
        setEntry(rows.find((row) => row.collection_id === id) || null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Error loading collection catalog:", err);
        setEntry(null);
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, hasInitialEntry, initialEntry]);

  return { collection: entry, loading, error };
}
