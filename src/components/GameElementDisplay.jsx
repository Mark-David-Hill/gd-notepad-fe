import { useState } from "react";

import fetchWrapper from "../lib/apiCall";

const GameElementsDisplay = ({ elementType }) => {
  const [elementsList, setElementsList] = useState([]);

  const handleDisplayElements = () => {
    fetchWrapper
      .apiCall(`/elements`, "GET")
      .then((response) =>
        setElementsList(
          response.results.filter((element) => element.type.name == elementType)
        )
      )
      .catch((error) =>
        console.error(`couldn't display ${elementType}s`, error)
      );
  };

  return (
    <div className={"game-elements-container"}>
      <h1>{elementType}s</h1>
      <div>
        <button onClick={handleDisplayElements}>Display {elementType}s</button>
      </div>
      <div>
        <div className="timers-list-wrapper">
          {elementsList &&
            elementsList.map((elementData, elementId) => {
              return (
                <div key={elementId}>
                  <h2>{elementData.name}</h2>
                  <p>{elementData.description}</p>
                  <img
                    src={elementData.image_url}
                    alt={elementData.name + " image"}
                    style={{ width: "200px" }}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default GameElementsDisplay;
