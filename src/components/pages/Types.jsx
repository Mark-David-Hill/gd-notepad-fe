import { useContext } from "react";

import ItemCard from "../item-cards/ItemCard";

import { GamesContext } from "../context/GamesContextProvider";

const Types = () => {
  const { types } = useContext(GamesContext);

  return (
    <div className="items-container">
      <h1>Types</h1>
      <div className={"items-wrapper"}>
        <div className="games-display-container">
          <div className="games-display-wrapper">
            {!types ? (
              <p>Loading</p>
            ) : (
              types.map((typeData, typeId) => {
                return (
                  <ItemCard
                    key={typeId}
                    itemData={typeData}
                    itemType="type"
                    fetchRoute="types"
                    pageRoute="types"
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Types;
