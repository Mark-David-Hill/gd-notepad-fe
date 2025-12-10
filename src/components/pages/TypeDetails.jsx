import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import ItemCard from "../item-cards/ItemCard";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";
import useApi from "../../hooks/useApi";
import { CollectionContext } from "../context/CollectionContextProvider";

export default function Type() {
  const { id } = useParams();
  const { types } = useContext(CollectionContext);
  const { data: typeData, loading, error, execute } = useApi(`/type/${id}`, {
    method: "GET",
    autoFetch: false,
  });

  useEffect(() => {
    execute();
  }, [id, execute]);

  if (loading) {
    return (
      <div className="game-element-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-element-container">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!typeData) {
    return null;
  }

  // useApi already extracts result/results, so typeData is the type itself
  return (
    <div className="game-element-container">
        <ItemCard
          itemData={typeData}
          itemType="type"
          pageRoute="type"
          viewType="page"
          colorScheme={typeData.colorScheme}
          typeImageUrl={typeData.image_url}
          types={types}
        />
    </div>
  );
}
