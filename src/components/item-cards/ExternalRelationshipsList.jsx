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
  // Debug logging
  console.log("ExternalRelationshipsList received:", {
    itemData: itemData?.name,
    relationshipsCount: relationships?.length,
    typesCount: types?.length,
    itemsCount: items?.length,
    colorSchemesCount: colorSchemes?.length,
  });
  const getRelatedElement = (relationship, itemData) => {
    return relationship.item_1_id === itemData.item_id
      ? items.find((item) => item.item_id === relationship.item_2_id)
      : items.find((item) => item.item_id === relationship.item_1_id);
  };

  const getRelatedElementType = (relatedElement) => {
    return types.find((type) => type.type_id === relatedElement?.type_id);
  };

  // Function to create gradient from two colors
  const createGradient = (color1, color2) => {
    return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
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

                      // Get the current item's type and color scheme
                      const currentItemType = types.find(
                        (t) => t.type_id === itemData.type_id
                      );
                      const currentItemColorScheme =
                        getColorSchemeForType(currentItemType);
                      const relatedItemColorScheme =
                        getColorSchemeForType(relatedType);

                      // Debug logging
                      console.log("Relationship Color Debug:", {
                        currentItemType,
                        relatedType,
                        currentItemColorScheme,
                        relatedItemColorScheme,
                        colorSchemes,
                      });

                      // Create gradient colors
                      let backgroundGradient =
                        "linear-gradient(135deg, #f0f4ff 0%, #e6f2ff 100%)"; // Default gradient
                      let textColor = "#1e40af"; // Default dark blue

                      if (currentItemColorScheme && relatedItemColorScheme) {
                        // Create gradient from current item background color to related item background color (like item cards)
                        const currentBackground =
                          currentItemColorScheme.background_color || "#e6f2ff";
                        const relatedBackground =
                          relatedItemColorScheme.background_color || "#e6f2ff";
                        backgroundGradient = createGradient(
                          currentBackground,
                          relatedBackground
                        );

                        // Use the current item's text color for better contrast
                        textColor =
                          currentItemColorScheme.text_color || "#1e40af";
                      } else if (currentItemColorScheme) {
                        const background =
                          currentItemColorScheme.background_color || "#e6f2ff";
                        backgroundGradient = createGradient(
                          background,
                          background
                        );
                        textColor =
                          currentItemColorScheme.text_color || "#1e40af";
                      } else if (relatedItemColorScheme) {
                        const background =
                          relatedItemColorScheme.background_color || "#e6f2ff";
                        backgroundGradient = createGradient(
                          background,
                          background
                        );
                        textColor =
                          relatedItemColorScheme.text_color || "#1e40af";
                      }

                      // Debug the final colors
                      console.log("Final Colors:", {
                        backgroundGradient,
                        textColor,
                        relationship: relationship.description,
                      });

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
                          backgroundGradient={backgroundGradient}
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
