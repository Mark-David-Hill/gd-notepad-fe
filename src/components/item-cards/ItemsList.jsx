import { useEffect, useContext } from "react";

import ItemCard from "./ItemCard";

import { CollectionContext } from "../context/CollectionContextProvider";

import fetchWrapper from "../../lib/apiCall";

const ItemsList = ({
  collectionId,
  itemsList,
  setItems,
  currentRelationships,
  viewType,
  searchTerm,
  currentTypes,
}) => {
  const { relationships, setRelationships } = useContext(CollectionContext);

  useEffect(() => {
    console.log(`/relationships/collection/${collectionId}`);
    fetchWrapper
      .apiCall(`/relationships/collection/${collectionId}`, "GET")
      .then((response) => {
        console.log(response);
        setRelationships(response.results);
      })
      .catch((error) =>
        console.error(`couldn't retrieve relationships`, error)
      );
  }, []);

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
                <ItemCard
                  key={elementId}
                  itemData={elementData}
                  setItems={setItems}
                  itemType="item"
                  pageRoute="item"
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

export default ItemsList;
