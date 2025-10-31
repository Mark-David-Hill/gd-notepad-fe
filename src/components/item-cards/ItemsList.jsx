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
  types,
}) => {
  const { relationships } = useContext(CollectionContext);

  const includedInCurrentRelationships = (elementData) => {
    if (!currentRelationships || currentRelationships.length === 0) {
      return true;
    }

    if (!relationships || relationships.length === 0) {
      return true;
    }

    return relationships.some((relationship) => {
      // Check if this item is in a relationship with any selected element
      if (!relationship.item_1 || !relationship.item_2) {
        return false;
      }

      const isRelated =
        (elementData.name === relationship.item_1.name &&
          currentRelationships.includes(relationship.item_2.name)) ||
        (elementData.name === relationship.item_2.name &&
          currentRelationships.includes(relationship.item_1.name));

      return isRelated;
    });
  };

  return (
    <div className="game-elements-list-wrapper">
      {!itemsList.length && relationships ? (
        <p>Loading...</p>
      ) : (
        itemsList.map((elementData, elementId) => {
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
                types={types}
              />
            );
          } else {
            return null;
          }
        })
      )}
    </div>
  );
};

export default ItemsList;
