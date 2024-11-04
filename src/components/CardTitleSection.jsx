import { useState } from "react";
import { NavLink } from "react-router-dom";

const CardTitleSection = ({ elementData }) => {
  const [relationshipsList, setRelationshipsList] = useState([]);

  return (
    elementData &&
    relationshipsList && (
      <div className="title-section-wrapper">
        <div className="name-img-wrapper">
          <h2>{elementData.name}</h2>
          <img src={elementData.image_url} alt={elementData.name + " image"} />
        </div>
        <div className="description-wrapper">
          <p>{elementData.description}</p>
          <NavLink to={`/game-elements/${elementData.element_id}`}>
            View More Details
          </NavLink>
        </div>
      </div>
    )
  );
};

export default CardTitleSection;
