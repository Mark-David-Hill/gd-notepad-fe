import { useState } from "react";
import fetchWrapper from "../../lib/apiCall";

import { NavLink } from "react-router-dom";

const Games = () => {
  const [gamesList, setGamesList] = useState(null);

  const handleDisplayGames = () => {
    fetchWrapper
      .apiCall(`/games`, "GET")
      .then((response) => setGamesList(response.results))
      .catch((error) => console.error("couldn't display games", error));
  };

  return (
    <div className="games">
      <h1>Games</h1>
      <div>
        <button onClick={handleDisplayGames}>Display Games</button>
      </div>
      <div>
        <div className="timers-list-wrapper">
          {gamesList &&
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
            })}
        </div>
      </div>
    </div>
  );
};

export default Games;
