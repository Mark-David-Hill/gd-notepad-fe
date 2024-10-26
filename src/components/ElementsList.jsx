import { NavLink } from "react-router-dom";

const GameElementsList = ({ elementsList }) => {
  return (
    <div className="game-elements-list-wrapper">
      {!elementsList.length ? (
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
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default GameElementsList;
