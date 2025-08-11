import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import ItemCard from "../item-cards/ItemCard";

import fetchWrapper from "../../lib/apiCall";
import { CollectionContext } from "../context/CollectionContextProvider";

export default function Type() {
  const { id } = useParams();
  const { types } = useContext(CollectionContext);

  const [typeData, setTypeData] = useState(null);

  useEffect(() => {
    fetchWrapper
      .apiCall(`/type/${id}`, "GET")
      .then((response) => {
        setTypeData(response.result);
      })
      .catch((error) => console.error(`couldn't retrieve type data`, error));
  }, [id]);

  return (
    <div className="game-element-container">
      {typeData ? (
        <ItemCard
          itemData={typeData}
          itemType="type"
          pageRoute="type"
          viewType="page"
          colorScheme={typeData.colorScheme}
          typeImageUrl={typeData.image_url}
          types={types}
        />
      ) : (
        <p>Loading...</p>
        // <FontAwesomeIcon icon="fa-circle-notch" spin size="xl" />
      )}
    </div>
  );
}
