import { useState, useEffect } from "react";
import RelationshipCard from "./RelationshipCard";
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
        console.error("Couldn't get relationships for game elements:", error)
      );
  }, []);

  const relevantRelationships = relationshipsList.filter(
    (relationship) =>
      relationship.element_1.element_id === elementData.element_id ||
      relationship.element_2.element_id === elementData.element_id
  );

  return (
    relevantRelationships.length > 0 && (
      <div className="element-relationships">
        <h3>Relationships</h3>
        <div className="relationships-wrapper">
          {relevantRelationships.map((relationship, index) => {
            const relatedElement =
              relationship.element_1.element_id === elementData.element_id
                ? relationship.element_2
                : relationship.element_1;

            return (
              <RelationshipCard
                key={index}
                element={relatedElement}
                description={relationship.description}
                count={relationship.count}
              />
            );
          })}
        </div>
      </div>
    )
  );
};

export default RelationshipsList;
