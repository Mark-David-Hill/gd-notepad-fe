import { useContext } from "react";
import { NavLink } from "react-router-dom";

import { GamesContext } from "./context/GamesContextProvider";

const GamesDisplay = () => {
  const { games } = useContext(GamesContext);

  return (
    <div className="games-display-container">
      <div className="games-display-wrapper">
        {!games ? (
          <p>Loading</p>
        ) : (
          games.map((gameData, gameId) => {
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
