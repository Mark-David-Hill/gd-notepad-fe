import { useState, useEffect } from "react";

import ElementsDisplay from "../game-elements/ElementsDisplay";
import fetchWrapper from "../../lib/apiCall";

const GameElements = () => {
  const [gamesList, setGamesList] = useState([]);
  const [typesList, setTypesList] = useState([]);
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    fetchWrapper
      .apiCall(`/games`, "GET")
      .then((response) => {
        setGamesList(response.results);
      })
      .catch((error) => console.error(`Couldn't get games`, error));

    fetchWrapper
      .apiCall(`/types`, "GET")
      .then((response) => {
        setTypesList(response.results);
      })
      .catch((error) => console.error(`Couldn't get type data`, error));
  }, []);

  return gamesList.length > 0 && typesList.length > 0 ? (
    <div className="game-elements-container">
      <h1>Game Elements</h1>

      <select
        name="type"
        id="type"
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >
        <option value="all">All</option>
        {typesList.map((type) => (
          <option key={type.type_id} value={type.name}>
            {type.name}
          </option>
        ))}
      </select>

      <ElementsDisplay
        gamesList={gamesList}
        typesList={typesList}
        elementType={selectedType}
      />
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default GameElements;
