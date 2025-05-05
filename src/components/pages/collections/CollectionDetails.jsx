import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import AddColorSchemeForm from "../../forms/AddColorSchemeForm";
import CollectionTabSelect from "./CollectionTabSelect";
import ItemsList from "../../item-cards/ItemsList";
import CollectionOverview from "./CollectionOverview";
import AddItemForm from "../../forms/AddItemForm";
import AddTypeForm from "../../forms/AddTypeForm";
import ItemCard from "../../item-cards/ItemCard";
import SearchSection from "./SearchSection";

import { CollectionContext } from "../../context/CollectionContextProvider";
import { AuthContext } from "../../context/AuthContextProvider";

export default function Collection() {
  const [viewType, setViewType] = useState("square");
  const [selectedElements, setSelectedElements] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("items");

  const { id } = useParams();
  const {
    currentCollectionId,
    setCurrentCollectionId,
    currentCollection,
    types,
    setTypes,
    items,
    setItems,
  } = useContext(CollectionContext);
  const { authInfo } = useContext(AuthContext);

  useEffect(() => {
    if (
      (id && !currentCollectionId) ||
      (id && currentCollectionId && currentCollectionId !== id)
    ) {
      setCurrentCollectionId(id);
    }
  }, [id]);

  return (
    <div className="collection-container">
      <CollectionTabSelect
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {currentCollection && items ? (
        <div className="collection-wrapper">
          <CollectionOverview
            collectionData={currentCollection}
            types={types}
            items={items}
          />

          {currentTab === "items" && items.length > 0 ? (
            <div className="items-container">
              <SearchSection
                collectionId={currentCollectionId}
                types={types}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewType={viewType}
                setViewType={setViewType}
                selectedElements={selectedElements}
                setSelectedElements={setSelectedElements}
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
                allItems={items}
              />

              {authInfo && (
                <AddItemForm
                  setItems={setItems}
                  collectionId={currentCollectionId}
                  types={types}
                />
              )}

              <div className="items-container">
                <h2>Items</h2>

                <div className={"items-wrapper"}>
                  <ItemsList
                    collectionId={currentCollectionId}
                    itemsList={items}
                    setItems={setItems}
                    currentRelationships={selectedElements}
                    viewType={viewType}
                    searchTerm={searchTerm}
                    currentTypes={selectedTypes}
                    currentCollections={[currentCollection]}
                    currentRelatedElements={selectedElements}
                  />
                </div>
              </div>
            </div>
          ) : (
            currentTab === "types" && (
              <div className="items-container">
                {authInfo && (
                  <AddTypeForm collectionId={id} setTypes={setTypes} />
                )}

                {authInfo?.role === "super-admin" && <AddColorSchemeForm />}

                <h2>Types</h2>

                <div className="items-wrapper">
                  {types.map((type) => (
                    <ItemCard
                      key={type.type_id}
                      itemData={type}
                      setItems={setTypes}
                      itemType="type"
                      pageRoute="type"
                      viewType="square"
                      colorScheme={type.color_scheme}
                      typeImageUrl={type.image_url}
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <p>Loading...</p>
        // <FontAwesomeIcon icon="fa-circle-notch" spin size="xl" />
      )}
    </div>
  );
}
