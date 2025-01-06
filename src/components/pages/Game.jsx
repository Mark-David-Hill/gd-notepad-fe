import { useState } from "react";
import { useParams } from "react-router-dom";

import fetchWrapper from "../../lib/apiCall";

export default function Game() {
  const { id } = useParams();

  const [collectionData, setCollectionData] = useState(null);

  fetchWrapper
    .apiCall(`/collection/${id}`, "GET")
    .then((response) => {
      setCollectionData(response.result);
    })
    .catch((error) => console.error(`couldn't retrieve collection`, error));

  return (
    <div className="game-container">
      {collectionData ? (
        <div className="game-wrapper">
          <h2>{collectionData.name}</h2>
          <p>{collectionData.description}</p>
          <img
            src={collectionData.image_url}
            alt={collectionData.name + " image"}
            style={{ width: "200px" }}
          />
        </div>
      ) : (
        <p>Loading...</p>
        // <FontAwesomeIcon icon="fa-circle-notch" spin size="xl" />
      )}
    </div>
  );
}
