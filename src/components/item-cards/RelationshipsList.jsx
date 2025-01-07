import { useContext } from "react";

import RelationshipCard from "./RelationshipCard";

import { GamesContext } from "../context/GamesContextProvider";

const RelationshipsList = ({ itemData }) => {
  const { relationships, types } = useContext(GamesContext);

  const getRelatedElement = (relationship, itemData) => {
    return relationship.item_1.item_id === itemData.item_id
      ? relationship.item_2
      : relationship.item_1;
  };

  const relevantRelationships = relationships.filter((relationship) => {
    const isRelevantElement =
      relationship.item_1.item_id === itemData.item_id ||
      relationship.item_2.item_id === itemData.item_id;

    return isRelevantElement;
  });

  return (
    relevantRelationships.length > 0 &&
    types.length > 0 && (
      <div className="element-relationships">
        <div className="relationships-wrapper">
          {types.map((type, index) => {
            const filteredRelationships = relevantRelationships.filter(
              (relationship) =>
                getRelatedElement(relationship, itemData).type.type_id ===
                type.type_id
            );

            if (filteredRelationships.length > 0) {
              return (
                <div key={index} className="type-container">
                  <h4>{type.name}s</h4>
                  <div className="type-wrapper">
                    {filteredRelationships.map((relationship, relIndex) => {
                      const relatedElement = getRelatedElement(
                        relationship,
                        itemData
                      );

                      return (
                        <RelationshipCard
                          key={relIndex}
                          element={relatedElement}
                          description={relationship.description}
                          count={relationship.count}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    )
  );
};

export default RelationshipsList;
