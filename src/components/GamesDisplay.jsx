import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import fetchWrapper from "../lib/apiCall";

const GamesDisplay = () => {
  const [gamesList, setGamesList] = useState(null);

  useEffect(() => {
    fetchWrapper
      .apiCall(`/games`, "GET")
      .then((response) => setGamesList(response.results))
      .catch((error) => console.error("couldn't display games", error));
  }, []);

  return (
    <div className="games-display-container">
      <div className="games-display-wrapper">
        {!gamesList ? (
          <p>Loading</p>
        ) : (
          gamesList.map((gameData, gameId) => {
            return (
              <div key={gameId}>
                <h2>{gameData.name}</h2>
                <p>{gameData.description}</p>
                <img
                  src={gameData.image_url}
                  alt={gameData.name + " image"}
                  style={{ width: "200px" }}
                />
                <NavLink to={`/games/${gameData.game_id}`}>
                  View More Details
                </NavLink>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GamesDisplay;
