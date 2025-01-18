import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import CollectionTabSelect from "../forms/CollectionTabSelect";
import SearchSection from "../game-elements/SearchSection";
import ElementsList from "../game-elements/ElementsList";
import AddElementForm from "../forms/AddElementForm";
import ItemCard from "../item-cards/ItemCard";

import fetchWrapper from "../../lib/apiCall";

export default function Collection() {
  const [viewType, setViewType] = useState("square");
  const [selectedElements, setSelectedElements] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [collectionData, setCollectionData] = useState(null);
  const [currentTab, setCurrentTab] = useState("overview");

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchWrapper
        .apiCall(`/collection/${id}`, "GET")
        .then((response) => {
          setCollectionData(response.result);
        })
        .catch((error) => console.error(`couldn't retrieve collection`, error));
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
            <div className="game-element-container">
              <ItemCard
                itemData={collectionData}
                itemType="collection"
                fetchRoute="collections"
                // pageRoute="game-elements"
                // viewType="page"
              />
            </div>
          ) : currentTab === "items" ? (
            <div className="items-container">
              <SearchSection
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                viewType={viewType}
                setViewType={setViewType}
                selectedElements={selectedElements}
                setSelectedElements={setSelectedElements}
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
              />

              {/* <AddElementForm
                setElementsList={setGameElements}
                collectionsList={collections}
                typesList={types}
              />

              <div className={"items-wrapper"}>
                <ElementsList
                  elementsList={gameElements}
                  currentRelationships={selectedElements}
                  viewType={viewType}
                  searchTerm={searchTerm}
                  currentTypes={selectedTypes}
                  currentCollections={selectedCollections}
                  currentRelatedElements={selectedElements}
                />
              </div> */}
            </div>
          ) : (
            currentTab === "types" && <h1>Types</h1>
          )}
        </div>
      ) : (
        <p>Loading...</p>
        // <FontAwesomeIcon icon="fa-circle-notch" spin size="xl" />
      )}
    </div>
  );
}
