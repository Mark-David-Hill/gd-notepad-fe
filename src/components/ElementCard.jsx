import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import fetchWrapper from "../lib/apiCall";

import RelationshipsList from "./RelationshipsList";
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
          <div className="name-img-wrapper">
            <h2>{elementData.name}</h2>
            <img
              src={elementData.image_url}
              alt={elementData.name + " image"}
            />
          </div>
          <div className="description-wrapper">
            <p>{elementData.description}</p>
            <NavLink to={`/game-elements/${elementData.element_id}`}>
              View More Details
            </NavLink>
          </div>
          <RelationshipsList elementData={elementData} />
          <NotesList elementData={elementData} />
        </div>
      </div>
    )
  );
};

export default ElementCard;
