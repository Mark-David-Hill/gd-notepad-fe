import { useContext } from "react";

import AddCollectionForm from "../../forms/AddCollectionForm";
import ItemCard from "../../item-cards/ItemCard";

import { AuthContext } from "../../context/AuthContextProvider";
import { CollectionContext } from "../../context/CollectionContextProvider";
import useFetch from "../../../hooks/useFetch";

const Collections = () => {
  const { authInfo } = useContext(AuthContext);
  const { types } = useContext(CollectionContext);
  const { data: collections = [], loading } = useFetch("/collections");

  return (
    <section className="items-container">
      <header className="collections-header">
        <h1>Collections</h1>
      </header>
      <div className="items-wrapper">
        {/* {authInfo && <AddCollectionForm onSuccess={reload} />} */}
        {loading ? (
          <p>Loading…</p>
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
