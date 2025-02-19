import { useState, useEffect } from "react";

import AddCollectionForm from "../../forms/AddCollectionForm";
import ItemCard from "../../item-cards/ItemCard";

import fetchWrapper from "../../../lib/apiCall";

const Collections = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetchWrapper
      .apiCall(`/collections`, "GET")
      .then((response) => {
        setCollections(response.results);
      })
      .catch((error) => console.error(`couldn't retrieve collections`, error));
  }, []);

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
