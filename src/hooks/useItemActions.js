import { useNavigate } from "react-router-dom";
import { useContext, useCallback } from "react";
import fetchWrapper from "../lib/apiCall";
import { AuthContext } from "../components/context/AuthContextProvider";

export function useItemNavigation(pageRoute, id) {
  const navigate = useNavigate();
  return useCallback(
    () => navigate(`/${pageRoute}/${id}`),
    [navigate, pageRoute, id]
  );
}

export function useItemDeletion(itemType, id, setItems) {
  const { authInfo } = useContext(AuthContext);
  return useCallback(() => {
    if (!authInfo) return;
    fetchWrapper
      .apiCall(`/${itemType}/delete/${id}`, "DELETE")
      .then(() =>
        setItems((prev) => prev.filter((i) => i[`${itemType}_id`] !== id))
      )
      .catch(console.error);
  }, [authInfo, itemType, id, setItems]);
}
