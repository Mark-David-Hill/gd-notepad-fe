import { useState, useEffect } from "react";

import fetchWrapper from "../lib/apiCall";

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    fetchWrapper
      .apiCall(url, "GET")
      .then((res) => setData(res.results))
      .catch((err) => console.err(err.message || "Failed to fetch"))
      .finally(() => setLoading(false));
  };

  useEffect(fetchData, [url]);

  return { data, loading };
}
