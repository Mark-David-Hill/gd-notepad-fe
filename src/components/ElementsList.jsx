import { NavLink } from "react-router-dom";

const GameElementsList = ({ elementsList, relationshipsList }) => {
  return (
    <div className="game-elements-list-wrapper">
      {!elementsList.length || !relationshipsList.length ? (
        <p>Loading...</p>
      ) : (
        elementsList.map((elementData, elementId) => {
          return (
            <div key={elementId}>
              <div>
                <h2>{elementData.name}</h2>
                <p>{elementData.description}</p>
                <img
                  src={elementData.image_url}
                  alt={elementData.name + " image"}
                  style={{ width: "200px" }}
                />
                <NavLink to={`/game-elements/${elementData.element_id}`}>
                  View More Details
                </NavLink>
              </div>
              {elementData.notes.length > 0 && (
                <div>
                  <h3>Notes</h3>
                  {elementData.notes.map((note) => (
                    <p key={note.note_id}>{note.content}</p>
                  ))}
                </div>
              )}

              <div>
                {relationshipsList.reduce((count, relationship) => {
                  return (
                    count +
                    (relationship.element_1.element_id ===
                      elementData.element_id ||
                    relationship.element_2.element_id === elementData.element_id
                      ? 1
                      : 0)
                  );
                }, 0) > 0 && <h3>Relationships</h3>}
                {relationshipsList.map((relationship, relationshipId) =>
                  relationship.element_1.element_id ===
                  elementData.element_id ? (
                    <div key={relationshipId}>
                      <h4>{relationship.element_2.name}</h4>
                      <p>{relationship.description}</p>
                      <img
                        src={relationship.element_2.image_url}
                        alt={relationship.element_2.name}
                        style={{ width: "100px" }}
                      />
                    </div>
                  ) : (
                    relationship.element_2.element_id ===
                      elementData.element_id && (
                      <div key={relationshipId}>
                        <h4>{relationship.element_1.name}</h4>
                        <p>{relationship.description}</p>
                        <img
                          src={relationship.element_1.image_url}
                          alt={relationship.element_1.name}
                          style={{ width: "100px" }}
                        />
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default GameElementsList;
