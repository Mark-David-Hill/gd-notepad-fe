import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import CollectionTabSelect from "./CollectionTabSelect";
import SearchSection from "./SearchSection";
import ElementsList from "./ItemsList";
import CollectionOverview from "./CollectionOverview";
import AddItemForm from "../../forms/AddItemForm";
import ItemCard from "../../item-cards/ItemCard";

import fetchWrapper from "../../../lib/apiCall";

import { GamesContext } from "../../context/GamesContextProvider";

export default function Collection() {
  const [viewType, setViewType] = useState("square");
  const [selectedElements, setSelectedElements] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [types, setTypes] = useState([]);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [collectionData, setCollectionData] = useState(null);
  const [currentTab, setCurrentTab] = useState("overview");

  const { relationships } = useContext(GamesContext);

  const { id } = useParams();

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

      {collectionData ? (
        <div className="game-wrapper">
          <h1>{collectionData.name}</h1>

          {currentTab === "overview" ? (
            <CollectionOverview
              collectionData={collectionData}
              types={types}
              items={items}
            />
          ) : currentTab === "items" ? (
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

              <AddItemForm
                setItems={setItems}
                collectionId={collectionData.collection_id}
                types={types}
              />

              <div className="items-container">
                <h2>Items</h2>

                <div className={"items-wrapper"}>
                  <ElementsList
                    elementsList={items}
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
                <h2>Types</h2>
                <div className="items-wrapper">
                  {types.map((type) => (
                    <ItemCard
                      key={type.type_id}
                      itemData={type}
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
