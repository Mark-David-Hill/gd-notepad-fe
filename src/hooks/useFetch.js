import { useState, useEffect, useCallback } from "react";

import fetchWrapper from "../lib/apiCall";

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);
    fetchWrapper
      .apiCall(url, "GET")
      .then((res) => setData(res.results))
      .catch((err) => console.error(err.message || "Failed to fetch"))
      .finally(() => setLoading(false));
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading };
}
