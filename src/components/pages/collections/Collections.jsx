import { useContext } from "react";

import AddCollectionForm from "../../forms/AddCollectionForm";
import ItemCard from "../../item-cards/ItemCard";
import LoadingSpinner from "../../common/LoadingSpinner";
import ErrorMessage from "../../common/ErrorMessage";

import { AuthContext } from "../../context/AuthContextProvider";
import { CollectionContext } from "../../context/CollectionContextProvider";
import useFetch from "../../../hooks/useFetch";

const Collections = () => {
  const { authInfo } = useContext(AuthContext);
  const { types } = useContext(CollectionContext);
  const { data: collections = [], loading, error, refetch } = useFetch("/collections");

  const handleCollectionAdded = (newCollection) => {
    // Refetch to get updated list from server
    refetch();
  };

  return (
    <section className="items-container">
      <header className="collections-header">
        <h1>{authInfo ? "GD Notepad" : "GD Notepad Collections"}</h1>
      </header>
      <div className="items-wrapper">
        {authInfo && (
          <AddCollectionForm setCollections={handleCollectionAdded} />
        )}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <div className="collections-wrapper">
            {collections.map((collection) => (
              <ItemCard
                key={collection.collection_id}
                itemData={collection}
                itemType="collection"
                pageRoute="collection"
                types={types}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Collections;
