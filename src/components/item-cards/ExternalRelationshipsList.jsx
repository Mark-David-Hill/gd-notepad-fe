import React from "react";
import PropTypes from "prop-types";
import RelationshipCard from "./RelationshipCard";

const ExternalRelationshipsList = ({
  itemData,
  relationships,
  types,
  items,
  colorSchemes,
}) => {
  const getRelatedElement = (relationship, itemData) => {
    return relationship.item_1_id === itemData.item_id
      ? items.find((item) => item.item_id === relationship.item_2_id)
      : items.find((item) => item.item_id === relationship.item_1_id);
  };

  const getRelatedElementType = (relatedElement) => {
    return types.find((type) => type.type_id === relatedElement?.type_id);
  };

  // Function to get color scheme for a type
  const getColorSchemeForType = (type) => {
    if (!type || !colorSchemes) return null;
    return colorSchemes.find(
      (cs) => cs.color_scheme_id === type.color_scheme_id
    );
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

                      // Get the related item's color scheme
                      const relatedItemColorScheme =
                        getColorSchemeForType(relatedType);

                      // Use only the related item's color (no gradient in row view)
                      let backgroundColor = "#e6f2ff"; // Default
                      let headerColor = "#3b82f6"; // Default (darker for header)
                      let textColor = "#1e40af"; // Default

                      if (relatedItemColorScheme) {
                        // Use the related item's background color for the main body
                        backgroundColor =
                          relatedItemColorScheme.background_color || "#e6f2ff";
                        // Use the related item's primary color (darker) for the header
                        headerColor =
                          relatedItemColorScheme.primary_color || "#3b82f6";
                        textColor =
                          relatedItemColorScheme.text_color || "#1e40af";
                      }

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
                          backgroundColor={backgroundColor}
                          headerColor={headerColor}
                          textColor={textColor}
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

ExternalRelationshipsList.propTypes = {
  itemData: PropTypes.object.isRequired,
  relationships: PropTypes.array.isRequired,
  types: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  colorSchemes: PropTypes.array,
};

export default ExternalRelationshipsList;
