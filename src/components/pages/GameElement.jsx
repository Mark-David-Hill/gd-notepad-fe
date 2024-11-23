import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import fetchWrapper from "../../lib/apiCall";
import ElementCard from "../game-elements/ElementCard";

export default function GameElement(props) {
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
        <ElementCard elementData={elementData} viewType="page" />
      ) : (
        <p>Loading...</p>
        // <FontAwesomeIcon icon="fa-circle-notch" spin size="xl" />
      )}
    </div>
  );
}
