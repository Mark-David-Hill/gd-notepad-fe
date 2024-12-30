import { useState } from "react";
import { useParams } from "react-router-dom";

import fetchWrapper from "../../lib/apiCall";

export default function Game() {
  const { id } = useParams();

  const [gameData, setGameData] = useState(null);

  fetchWrapper
    .apiCall(`/game/${id}`, "GET")
    .then((response) => {
      setGameData(response.result);
    })
    .catch((error) => console.error(`couldn't retrieve game element`, error));

  return (
    <div className="game-container">
      {gameData ? (
        <div className="game-wrapper">
          <h2>{gameData.name}</h2>
          <p>{gameData.description}</p>
          <img
            src={gameData.image_url}
            alt={gameData.name + " image"}
            style={{ width: "200px" }}
          />
        </div>
      ) : (
        <p>Loading...</p>
        // <FontAwesomeIcon icon="fa-circle-notch" spin size="xl" />
      )}
    </div>
  );
}
