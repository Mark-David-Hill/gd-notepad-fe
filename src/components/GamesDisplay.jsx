import { useContext } from "react";

import ItemCard from "./item-cards/ItemCard";

import { GamesContext } from "./context/GamesContextProvider";

const GamesDisplay = () => {
  const { collections } = useContext(GamesContext);

  return (
    <div className="games-display-container">
      <div className="games-display-wrapper">
        {!collections ? (
          <p>Loading</p>
        ) : (
          collections.map((collectionData, collectionId) => {
            return (
              <ItemCard
                key={collectionId}
                itemData={collectionData}
                itemType="collection"
                fetchRoute="collections"
                pageRoute="collections"
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default GamesDisplay;
