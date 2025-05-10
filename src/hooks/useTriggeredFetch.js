import { useState, useCallback } from "react";

import fetchWrapper from "../lib/apiCall";

export default function useTriggeredFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    return fetchWrapper
      .apiCall(url, "GET")
      .then((res) => {
        setData(res.results);
        return res.results;
      })
      .catch((err) => {
        console.error("error fetching data:", err);
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
  }, []);

  return { data, loading, fetchData, reset };
}
