import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import fetchWrapper from "../lib/apiCall";

import GameElementsList from "./ElementsList";

const ElementsDisplay = ({ elementType }) => {
  const [elementsList, setElementsList] = useState([]);
  const [relationshipsList, setRelationshipsList] = useState([]);

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

  useEffect(() => {
    fetchWrapper
      .apiCall(`/relationships`, "GET")
      .then((response) => {
        setRelationshipsList(response.results);
        console.log(response.results);
      })
      .catch((error) =>
        console.error(`couldn't get relationships for ${elementType}s`, error)
      );
  }, []);

  return (
    <div className={"game-elements-wrapper"}>
      <h1>{elementType}s</h1>
      <GameElementsList
        elementsList={elementsList}
        relationshipsList={relationshipsList}
      />
    </div>
  );
};

export default ElementsDisplay;
