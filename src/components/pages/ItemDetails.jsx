import { useEffect } from "react";
import { useParams } from "react-router-dom";

import CollectionItemCard from "../item-cards/CollectionItemCard";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";
import useApi from "../../hooks/useApi";

export default function Item() {
  const { id } = useParams();
  const { data: elementData, loading, error, execute } = useApi(`/item/${id}`, {
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

  if (!elementData) {
    return null;
  }

  // useApi already extracts result/results, so elementData is the item itself
  return (
    <div className="game-element-container">
        <CollectionItemCard
          itemData={elementData}
          viewType="page"
        colorScheme={elementData.type?.colorScheme}
        typeImageUrl={elementData.type?.image_url}
        />
    </div>
  );
}
