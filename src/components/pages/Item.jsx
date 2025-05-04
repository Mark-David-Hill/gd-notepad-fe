import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import CollectionItemCard from "../item-cards/CollectionItemCard";

import fetchWrapper from "../../lib/apiCall";

export default function Item() {
  const { id } = useParams();

  const [elementData, setElementData] = useState(null);

  useEffect(() => {
    fetchWrapper
      .apiCall(`/item/${id}`, "GET")
      .then((response) => {
        setElementData(response.result);
      })
      .catch((error) => console.error(`couldn't retrieve game element`, error));
  }, [id]);

  return (
    <div className="game-element-container">
      {elementData ? (
        <CollectionItemCard
          itemData={elementData}
          viewType="page"
          colorScheme={elementData.type.colorScheme}
          typeImageUrl={elementData.type.image_url}
        />
      ) : (
        <p>Loading...</p>
        // <FontAwesomeIcon icon="fa-circle-notch" spin size="xl" />
      )}
    </div>
  );
}
