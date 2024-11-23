import { useEffect } from "react";
import RelationshipCard from "./RelationshipCard";

const RelationshipsList = ({
  elementData,
  relationshipsList,
  typesList,
  currentCategories,
  relationshipsSearchTerm,
  setShouldDisplayElement,
}) => {
  const getRelatedElement = (relationship, elementData) => {
    return relationship.element_1.element_id === elementData.element_id
      ? relationship.element_2
      : relationship.element_1;
  };

  // Filter relevant relationships
  const relevantRelationships = relationshipsList.filter((relationship) => {
    const isRelevantElement =
      relationship.element_1.element_id === elementData.element_id ||
      relationship.element_2.element_id === elementData.element_id;

    const matchesSearchTerm =
      !relationshipsSearchTerm ||
      getRelatedElement(relationship, elementData)
        .name.toLowerCase()
        .includes(relationshipsSearchTerm.toLowerCase());

    return isRelevantElement && matchesSearchTerm;
  });

  // Update visibility based on relevant relationships
  useEffect(() => {
    if (relationshipsSearchTerm.trim()) {
      setShouldDisplayElement(relevantRelationships.length > 0);
    } else {
      setShouldDisplayElement(true);
    }
  }, [relevantRelationships, setShouldDisplayElement]);

  // Render the filtered relationships
  return (
    relevantRelationships.length > 0 &&
    typesList.length > 0 && (
      <div className="element-relationships">
        <div className="relationships-wrapper">
          {typesList.map((type, index) => {
            const filteredRelationships = relevantRelationships.filter(
              (relationship) =>
                getRelatedElement(relationship, elementData).type.type_id ===
                type.type_id
            );

            if (
              filteredRelationships.length > 0 &&
              currentCategories.includes(`${type.name}s`)
            ) {
              return (
                <div key={index} className="type-container">
                  <h4>{type.name}s</h4>
                  <div className="type-wrapper">
                    {filteredRelationships.map((relationship, relIndex) => {
                      const relatedElement = getRelatedElement(
                        relationship,
                        elementData
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
