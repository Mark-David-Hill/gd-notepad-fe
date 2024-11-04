import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import fetchWrapper from "../lib/apiCall";

import ElementsList from "./ElementsList";

const ElementsDisplay = ({ elementType }) => {
  const [elementsList, setElementsList] = useState([]);
  const [viewType, setViewType] = useState("card");

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
    <div className={"game-elements-wrapper"}>
      <div className="view-select-wrapper">
        <button onClick={() => setViewType("square")}>Square</button>
        <button onClick={() => setViewType("card")}>Card</button>
        <button onClick={() => setViewType("row")}>Row</button>
      </div>

      <h1>{elementType}s</h1>
      <ElementsList elementsList={elementsList} viewType={viewType} />
    </div>
  );
};

export default ElementsDisplay;
