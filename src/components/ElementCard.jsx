import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import fetchWrapper from "../lib/apiCall";

import RelationshipsList from "./RelationshipsList";
import CardTitleSection from "./CardTitleSection";
import NotesList from "./NotesList";

const ElementCard = ({ elementData, viewType = "square" }) => {
  const [relationshipsList, setRelationshipsList] = useState([]);

  useEffect(() => {
    fetchWrapper
      .apiCall(`/relationships`, "GET")
      .then((response) => {
        setRelationshipsList(response.results);
      })
      .catch((error) =>
        console.error(`couldn't get relationships for game elements`, error)
      );
  }, []);

  return (
    elementData &&
    relationshipsList && (
      <div className={"game-element-wrapper " + viewType}>
        <div className="element-content-wrapper">
          <CardTitleSection elementData={elementData} />
          <RelationshipsList elementData={elementData} />
          <NotesList elementData={elementData} />
        </div>
      </div>
    )
  );
};

export default ElementCard;
