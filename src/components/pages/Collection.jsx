import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import SearchSection from "../game-elements/SearchSection";
import ElementsList from "../game-elements/ElementsList";
import AddElementForm from "../forms/AddElementForm";

import fetchWrapper from "../../lib/apiCall";

export default function Collection() {
  const [viewType, setViewType] = useState("square");
  const [selectedElements, setSelectedElements] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [collectionData, setCollectionData] = useState(null);

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
      {collectionData ? (
        <div className="game-wrapper">
          <h1>{collectionData.name}</h1>
          <p>{collectionData.description}</p>
          <img
            src={collectionData.image_url}
            alt={collectionData.name + " image"}
            style={{ width: "200px" }}
          />
          {/* <SearchSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            viewType={viewType}
            setViewType={setViewType}
            selectedElements={selectedElements}
            setSelectedElements={setSelectedElements}
            selectedCollections={selectedCollections}
            setSelectedCollections={setSelectedCollections}
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
          />

          <AddElementForm
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
        <p>Loading...</p>
        // <FontAwesomeIcon icon="fa-circle-notch" spin size="xl" />
      )}
    </div>
  );
}
