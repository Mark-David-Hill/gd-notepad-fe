import { useState, useEffect } from "react";

import ElementCard from "./ElementCard";

import fetchWrapper from "../../lib/apiCall";

const ElementsList = ({
  elementsList,
  typesList,
  viewType,
  currentTypes,
  currentCategories,
  relationshipsSearchTerm,
}) => {
  const [relationshipsList, setRelationshipsList] = useState([]);

  useEffect(() => {
    // console.log("elements list", elementsList);
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
    <div className="game-elements-list-wrapper">
      {!elementsList.length && relationshipsList ? (
        <p>Loading...</p>
      ) : (
        elementsList.map((elementData, elementId) => {
          {
            if (currentTypes.includes(elementData.type.name)) {
              return (
                <ElementCard
                  key={elementId}
                  elementData={elementData}
                  elementId={elementId}
                  viewType={viewType}
                  relationshipsList={relationshipsList}
                  typesList={typesList}
                  currentCategories={currentCategories}
                  relationshipsSearchTerm={relationshipsSearchTerm}
                />
              );
            } else {
              return null;
            }
          }
        })
      )}
    </div>
  );
};

export default ElementsList;
