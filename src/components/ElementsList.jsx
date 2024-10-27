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
                <h2>Main Element Info</h2>
                <h3>{elementData.name}</h3>
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
                  <h2>Notes</h2>
                  {elementData.notes.map((note) => (
                    <p key={note.note_id}>{note.content}</p>
                  ))}
                </div>
              )}

              <div>
                <h2>Relationships</h2>
                {relationshipsList.map((relationship, relationshipId) =>
                  relationship.element_1.element_id ===
                  elementData.element_id ? (
                    <div key={relationshipId}>
                      <p>{relationship.element_2.name}</p>
                      <p>{relationship.description}</p>
                    </div>
                  ) : (
                    relationship.element_2.element_id ===
                      elementData.element_id && (
                      <div key={relationshipId}>
                        <p>{relationship.element_1.name}</p>
                        <p>{relationship.description}</p>
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
