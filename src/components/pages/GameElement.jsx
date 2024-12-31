import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ItemCard from "../item-cards/ItemCard";

import fetchWrapper from "../../lib/apiCall";

export default function GameElement() {
  const { id } = useParams();

  const [elementData, setElementData] = useState(null);

  useEffect(() => {
    fetchWrapper
      .apiCall(`/element/${id}`, "GET")
      .then((response) => {
        setElementData(response.result);
      })
      .catch((error) => console.error(`couldn't retrieve game element`, error));
  }, [id]);

  return (
    <div className="game-element-container">
      {elementData ? (
        <ItemCard
          itemData={elementData}
          itemType="element"
          fetchRoute="elements"
          pageRoute="game-elements"
          viewType="page"
        />
      ) : (
        <p>Loading...</p>
        // <FontAwesomeIcon icon="fa-circle-notch" spin size="xl" />
      )}
    </div>
  );
}
