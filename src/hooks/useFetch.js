import { useEffect, useRef } from "react";
import useApi from "./useApi";

/**
 * Hook for automatic data fetching on mount
 * @param {string} url - API endpoint
 * @returns {Object} { data, loading, error, refetch }
 */
export default function useFetch(url) {
  const { data, loading, error, execute, reset } = useApi(url, {
    method: "GET",
    autoFetch: false, // We'll trigger manually in useEffect
  });

  const urlRef = useRef(url);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Fetch if URL changed or if this is the first render
    if (urlRef.current !== url || !hasFetchedRef.current) {
      urlRef.current = url;
      hasFetchedRef.current = true;
      execute();
    }
  }, [url, execute]);

  // Return data.results if it exists (for consistency with old API), otherwise return data
  const resultData = data?.results !== undefined ? data.results : data;

  // If we have results property in the original response, it's likely an array endpoint
  // Return empty array for null/undefined to prevent "Cannot read properties of null" errors
  const safeData = data?.results !== undefined 
    ? (resultData ?? [])  // Array endpoint - default to empty array
    : resultData;          // Object endpoint - return as-is (could be null)

  return {
    data: safeData,
    loading,
    error,
    refetch: execute,
    reset,
  };
}
