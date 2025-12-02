import { useState, useCallback } from "react";
import fetchWrapper from "../lib/apiCall";

/**
 * Unified hook for API calls with loading and error states
 * Can be used for both automatic and manual fetching
 */
export default function useApi(endpoint, options = {}) {
  const {
    method = "GET",
    autoFetch = false,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (requestBody = null, customEndpoint = null) => {
      const url = customEndpoint || endpoint;
      setLoading(true);
      setError(null);

      try {
        const response = await fetchWrapper.apiCall(url, method, requestBody);
        // Preserve the full response structure, but extract result/results if they exist
        const result = response.result !== undefined ? response.result : 
                       response.results !== undefined ? response.results : 
                       response;
        setData(result);
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        return result;
      } catch (err) {
        const errorMessage = err.message || "An error occurred";
        setError(errorMessage);
        
        if (onError) {
          onError(err);
        } else {
          console.error("API call failed:", errorMessage);
        }
        
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, method, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

