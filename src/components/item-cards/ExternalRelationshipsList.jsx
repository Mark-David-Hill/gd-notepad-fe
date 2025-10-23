import RelationshipCard from "./RelationshipCard";

const ExternalRelationshipsList = ({
  itemData,
  relationships,
  types,
  items,
}) => {
  const getRelatedElement = (relationship, itemData) => {
    return relationship.item_1_id === itemData.item_id
      ? items.find((item) => item.item_id === relationship.item_2_id)
      : items.find((item) => item.item_id === relationship.item_1_id);
  };

  const getRelatedElementType = (relatedElement) => {
    return types.find((type) => type.type_id === relatedElement?.type_id);
  };

  const relevantRelationships = relationships.filter((relationship) => {
    const isRelevantElement =
      relationship.item_1_id === itemData.item_id ||
      relationship.item_2_id === itemData.item_id;

    return isRelevantElement;
  });

  return (
    relevantRelationships.length > 0 &&
    types.length > 0 && (
      <div className="element-relationships">
        <div className="relationships-wrapper">
          {types.map((type, index) => {
            const filteredRelationships = relevantRelationships.filter(
              (relationship) => {
                const relatedElement = getRelatedElement(
                  relationship,
                  itemData
                );
                const relatedType = getRelatedElementType(relatedElement);
                return relatedType && relatedType.type_id === type.type_id;
              }
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
                      const relatedType = getRelatedElementType(relatedElement);

                      // Create a mock element object that matches the expected structure
                      // Use type's image_url as fallback if item doesn't have one
                      const elementForCard = {
                        name:
                          relatedElement?.name ||
                          `Item ${
                            relationship.item_1_id === itemData.item_id
                              ? relationship.item_2_id
                              : relationship.item_1_id
                          }`,
                        image_url:
                          relatedElement?.image_url ||
                          relatedType?.image_url ||
                          "",
                      };

                      return (
                        <RelationshipCard
                          key={relIndex}
                          element={elementForCard}
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

export default ExternalRelationshipsList;
