import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import fetchWrapper from "../lib/apiCall";

const GameElementsDisplay = ({ elementType }) => {
  const [elementsList, setElementsList] = useState([]);

  useEffect(() => {
    fetchWrapper
      .apiCall(`/elements`, "GET")
      .then((response) => {
        setElementsList(
          response.results.filter((element) => element.type.name == elementType)
        );
      })
      .catch((error) =>
        console.error(`couldn't display ${elementType}s`, error)
      );
  }, []);

  return (
    <div className={"game-elements-container"}>
      <h1>{elementType}s</h1>
      <div>
        <div className="game-elements-wrapper">
          {!elementsList.length ? (
            <p>Loading...</p>
          ) : (
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
                  <NavLink to={`/game-elements/${elementData.element_id}`}>
                    View More Details
                  </NavLink>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default GameElementsDisplay;
