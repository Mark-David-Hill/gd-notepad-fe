import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import fetchWrapper from "../lib/apiCall";

const GameElementsDisplay = ({ elementType }) => {
  const [elementsList, setElementsList] = useState([]);

  useEffect(() => {
    fetchWrapper
      .apiCall(`/elements`, "GET")
      .then((response) => {
        console.log(
          response.results.filter(
            (element) => element.type.name == elementType
          )[0].notes[0].content
        );
        setElementsList(
          response.results.filter((element) => element.type.name == elementType)
        );
      })
      .catch((error) =>
        console.error(`couldn't display ${elementType}s`, error)
      );
  }, []);

  return (
    <div className={"game-elements-container"}>
      <h1>{elementType}s</h1>
      <div>
        <div className="game-elements-wrapper">
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
                  {console.log(elementData)}
                  {elementData.notes && (
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
      </div>
    </div>
  );
};

export default GameElementsDisplay;
