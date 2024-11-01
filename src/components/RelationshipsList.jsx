import { useState, useEffect } from "react";

import fetchWrapper from "../lib/apiCall";

const RelationshipsList = ({ elementData }) => {
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
    relationshipsList && (
      <div className="element-relationships">
        {relationshipsList.reduce((count, relationship) => {
          return (
            count +
            (relationship.element_1.element_id === elementData.element_id ||
            relationship.element_2.element_id === elementData.element_id
              ? 1
              : 0)
          );
        }, 0) > 0 && <h3>Relationships</h3>}
        {relationshipsList.map((relationship, relationshipId) =>
          relationship.element_1.element_id === elementData.element_id ? (
            <div key={relationshipId}>
              <h4>{relationship.element_2.name}</h4>
              <p>{relationship.description}</p>
              <img
                src={relationship.element_2.image_url}
                alt={relationship.element_2.name}
                style={{ width: "100px" }}
              />
            </div>
          ) : (
            relationship.element_2.element_id === elementData.element_id && (
              <div key={relationshipId}>
                <h4>{relationship.element_1.name}</h4>
                <p>{relationship.description}</p>
                <img
                  src={relationship.element_1.image_url}
                  alt={relationship.element_1.name}
                />
              </div>
            )
          )
        )}
      </div>
    )
  );
};

export default RelationshipsList;
