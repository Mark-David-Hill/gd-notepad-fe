import { useState, useEffect, useContext } from "react";

import ElementCard from "../item-cards/ElementCard";

import { GamesContext } from "../context/GamesContextProvider";

const ElementsList = ({
  elementsList,
  currentRelationships,
  typesList,
  viewType,
  searchTerm,
  currentTypes,
  currentGames,
}) => {
  const { relationships } = useContext(GamesContext);

  const includedInCurrentRelationships = (elementData) => {
    if (currentRelationships.length === 0) {
      return true;
    }

    const relationshipsThatIncludeCurrentElement = relationships.filter(
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

  return (
    <div className="game-elements-list-wrapper">
      {!elementsList.length && relationships ? (
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
                  relationships={relationships}
                  typesList={typesList}
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
