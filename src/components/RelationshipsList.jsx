import RelationshipCard from "./RelationshipCard";

const RelationshipsList = ({ elementData, relationshipsList, typesList }) => {
  const relevantRelationships = relationshipsList.filter(
    (relationship) =>
      relationship.element_1.element_id === elementData.element_id ||
      relationship.element_2.element_id === elementData.element_id
  );

  console.log("types list", typesList);

  const getRelatedElement = (relationship, elementData) => {
    if (relationship.element_1.element_id === elementData.element_id) {
      return relationship.element_2;
    } else {
      return relationship.element_1;
    }
  };

  return (
    relevantRelationships.length > 0 &&
    typesList.length > 0 && (
      <div className="element-relationships">
        <h3>Relationships</h3>
        <div className="relationships-wrapper">
          {typesList.map((type, index) => {
            return (
              relevantRelationships.filter(
                (relationship) =>
                  getRelatedElement(relationship, elementData).type.type_id ==
                  type.type_id
              ).length > 0 && (
                <div key={index} className="type-container">
                  <h4>{type.name}s</h4>
                  <div className="type-wrapper">
                    {relevantRelationships
                      .filter(
                        (relationship) =>
                          getRelatedElement(relationship, elementData).type
                            .type_id == type.type_id
                      )
                      .map((relationship, index) => {
                        const relatedElement =
                          relationship.element_1.element_id ===
                          elementData.element_id
                            ? relationship.element_2
                            : relationship.element_1;

                        return (
                          <RelationshipCard
                            key={index}
                            element={relatedElement}
                            description={relationship.description}
                            count={relationship.count}
                          />
                        );
                      })}
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    )
  );
};

export default RelationshipsList;
