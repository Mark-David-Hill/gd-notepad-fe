import { useContext } from "react";

import CollectionItemCard from "./CollectionItemCard";

import { CollectionContext } from "../context/CollectionContextProvider";

const ItemsList = ({
  itemsList,
  setItems,
  currentRelationships,
  viewType,
  searchTerm,
  currentTypes,
}) => {
  const { relationships } = useContext(CollectionContext);

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
      {!itemsList.length && relationships ? (
        <p>Loading...</p>
      ) : (
        itemsList.map((elementData, elementId) => {
          {
            if (
              currentTypes.includes(elementData.type.name) &&
              includedInCurrentRelationships(elementData) &&
              (!searchTerm ||
                elementData?.name
                  .toLowerCase()
                  .includes(searchTerm.trim().toLowerCase()))
            ) {
              return (
                <CollectionItemCard
                  key={elementId}
                  itemData={elementData}
                  setItems={setItems}
                  viewType={viewType}
                  pageRoute="item"
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

export default ItemsList;
