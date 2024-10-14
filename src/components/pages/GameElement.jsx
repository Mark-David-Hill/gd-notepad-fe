import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import fetchWrapper from "../../lib/apiCall";

export default function GameElement(props) {
  const { id } = useParams();

  const [elementData, setElementData] = useState(null);

  fetchWrapper
    .apiCall(`/element/${id}`, "GET")
    .then((response) => {
      console.log(response);
      setElementData(response.result);
    })
    .catch((error) => console.error(`couldn't retrieve game element`, error));

  return (
    <div className="game-element-container">
      {elementData ? (
        <div className="game-element-wrapper">
          <h2>{elementData.name}</h2>
          <p>{elementData.description}</p>
          <img
            src={elementData.image_url}
            alt={elementData.name + " image"}
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
