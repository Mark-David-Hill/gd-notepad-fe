import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import fetchWrapper from "../lib/apiCall";

import GameElementsList from "./ElementsList";

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
        <GameElementsList elementsList={elementsList} />
      </div>
    </div>
  );
};

export default GameElementsDisplay;
