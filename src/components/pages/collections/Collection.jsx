import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import AddColorSchemeForm from "../../forms/AddColorSchemeForm";
import CollectionTabSelect from "./CollectionTabSelect";
import ElementsList from "../../item-cards/ItemsList";
import CollectionOverview from "./CollectionOverview";
import AddItemForm from "../../forms/AddItemForm";
import AddTypeForm from "../../forms/AddTypeForm";
import ItemCard from "../../item-cards/ItemCard";
import SearchSection from "./SearchSection";

import fetchWrapper from "../../../lib/apiCall";

import { AuthContext } from "../../context/AuthContextProvider";

export default function Collection() {
  const [viewType, setViewType] = useState("square");
  const [selectedElements, setSelectedElements] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [types, setTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [collectionData, setCollectionData] = useState(null);
  const [currentTab, setCurrentTab] = useState("items");

  const { id } = useParams();
  const { authInfo } = useContext(AuthContext);

  useEffect(() => {
    if (id) {
      fetchWrapper
        .apiCall(`/collection/${id}`, "GET")
        .then((response) => {
          setCollectionData(response.result);
        })
        .catch((error) => console.error(`couldn't retrieve collection`, error));

      fetchWrapper
        .apiCall(`/types/collection/${id}`, "GET")
        .then((response) => {
          setTypes(response.results);
        })
        .catch((error) => console.error("couldn't get types", error));

      fetchWrapper
        .apiCall(`/items/collection/${id}`, "GET")
        .then((response) => {
          setItems(response.results);
        })
        .catch((error) => console.error("couldn't get items", error));
    }
  }, [id]);

  return (
    <div className="collection-container">
      <CollectionTabSelect
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {collectionData && items ? (
        <div className="collection-wrapper">
          {/* <h1>{collectionData.name}</h1> */}

          <CollectionOverview
            collectionData={collectionData}
            types={types}
            items={items}
          />

          {currentTab === "items" && items.length > 0 ? (
            <div className="items-container">
              <SearchSection
                collectionId={collectionData?.collection_id}
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
                  collectionId={collectionData.collection_id}
                  types={types}
                />
              )}

              <div className="items-container">
                <h2>Items</h2>

                <div className={"items-wrapper"}>
                  <ElementsList
                    elementsList={items}
                    setItems={setItems}
                    currentRelationships={selectedElements}
                    viewType={viewType}
                    searchTerm={searchTerm}
                    currentTypes={selectedTypes}
                    currentCollections={[collectionData]}
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
                      itemType={"type"}
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
