import { useState, useEffect } from "react";

import ElementsDisplay from "../game-elements/ElementsDisplay";

import fetchWrapper from "../../lib/apiCall";

const GameElements = () => {
  const [gamesList, setGamesList] = useState([]);
  const [typesList, setTypesList] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    fetchWrapper
      .apiCall(`/games`, "GET")
      .then((response) => {
        setGamesList(response.results);
      })
      .catch((error) => console.error(`couldn't get games`, error));

    fetchWrapper
      .apiCall(`/types`, "GET")
      .then((response) => {
        setTypesList(response.results);
        setElementTypeId(
          response.results.find((type) => type.name === elementType).type_id
        );
      })
      .catch((error) => console.error(`couldn't get type data`, error));
  }, []);

  return gamesList && typesList ? (
    <div className="game-elements-container">
      <select name="type" id="type"></select>
      <ElementsDisplay
        gamesList={gamesList}
        typesList={typesList}
        elementType={"Enemy Element"}
        selectedTypes={selectedTypes}
      />
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default GameElements;
