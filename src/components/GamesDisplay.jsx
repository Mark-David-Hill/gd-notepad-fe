import { useContext } from "react";

import GameCard from "./item-cards/GameCard";

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
            return <GameCard key={gameId} gameData={gameData} />;
          })
        )}
      </div>
    </div>
  );
};

export default GamesDisplay;
