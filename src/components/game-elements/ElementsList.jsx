import { useContext } from "react";

import ItemCard from "../item-cards/ItemCard";

import { GamesContext } from "../context/GamesContextProvider";

const ElementsList = ({
  elementsList,
  currentRelationships,
  viewType,
  searchTerm,
  currentTypes,
  currentCollections,
}) => {
  const { relationships } = useContext(GamesContext);

  const includedInCurrentRelationships = (elementData) => {
    if (currentRelationships.length === 0) {
      return true;
    }

    const relationshipsThatIncludeCurrentElement = relationships.filter(
      (relationship) =>
        relationship.item_1.name === elementData.name ||
        relationship.item_2.name === elementData.name
    );

    const relationshipsToCheckAgainstCurrentRelationships = [
      ...new Set(
        relationshipsThatIncludeCurrentElement.flatMap((relationship) => [
          relationship.item_1.name,
          relationship.item_2.name,
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
              currentCollections.includes(elementData.collection.name) &&
              includedInCurrentRelationships(elementData) &&
              (!searchTerm ||
                elementData?.name
                  .toLowerCase()
                  .includes(searchTerm.trim().toLowerCase()))
            ) {
              return (
                <ItemCard
                  key={elementId}
                  itemData={elementData}
                  itemType="item"
                  pageRoute="game-elements"
                  viewType={viewType}
                  colorScheme={elementData.type.color_scheme}
                  typeImageUrl={elementData.type.image_url}
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
