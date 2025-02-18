import { useState, useContext } from "react";

import AddCollectionForm from "../../forms/AddCollectionForm";
import ItemCard from "../../item-cards/ItemCard";

import { GamesContext } from "../../context/GamesContextProvider";

const Collections = () => {
  const [collections2, setCollections] = useState([]);

  const { collections } = useContext(GamesContext);

  return (
    <div className="items-container">
      <h1>Collections</h1>
      <div className={"items-wrapper"}>
        <AddCollectionForm setCollections={setCollections} />
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
                    pageRoute="collection"
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

export default Collections;
