import { useState, useEffect } from "react";

import ElementCard from "./ElementCard";

import fetchWrapper from "../../lib/apiCall";

const ElementsList = ({
  elementsList,
  currentRelationships,
  typesList,
  viewType,
  searchTerm,
  currentTypes,
  currentGames,
  relationshipsSearchTerm,
}) => {
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

  const includedInCurrentRelationships = (elementData) => {
    if (currentRelationships.length === 0) {
      return true;
    }

    const relationshipsThatIncludeCurrentElement = relationshipsList.filter(
      (relationship) =>
        relationship.element_1.name === elementData.name ||
        relationship.element_2.name === elementData.name
    );

    const relationshipsToCheckAgainstCurrentRelationships = [
      ...new Set(
        relationshipsThatIncludeCurrentElement.flatMap((relationship) => [
          relationship.element_1.name,
          relationship.element_2.name,
        ])
      ),
    ];

    return currentRelationships.every((relationshipName) =>
      relationshipsToCheckAgainstCurrentRelationships.includes(relationshipName)
    );
  };

  useEffect(() => {
    console.log("elements list", elementsList);
    console.log("relationships list", relationshipsList);
    console.log("current relationships", currentRelationships);
  }, [elementsList, relationshipsList, currentRelationships]);

  return (
    <div className="game-elements-list-wrapper">
      {!elementsList.length && relationshipsList ? (
        <p>Loading...</p>
      ) : (
        elementsList.map((elementData, elementId) => {
          {
            if (
              currentTypes.includes(elementData.type.name) &&
              currentGames.includes(elementData.game.name) &&
              includedInCurrentRelationships(elementData) &&
              (!searchTerm ||
                elementData?.name
                  .toLowerCase()
                  .includes(searchTerm.trim().toLowerCase()))
            ) {
              return (
                <ElementCard
                  key={elementId}
                  elementData={elementData}
                  elementId={elementId}
                  viewType={viewType}
                  relationshipsList={relationshipsList}
                  typesList={typesList}
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
