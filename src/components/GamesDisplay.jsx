import { useContext } from "react";

import ItemCard from "./item-cards/ItemCard";

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
              <ItemCard
                key={gameId}
                itemData={gameData}
                itemType="game"
                fetchRoute="games"
                pageRoute="games"
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default GamesDisplay;
