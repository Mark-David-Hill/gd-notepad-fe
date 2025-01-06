import { useState, useEffect, useContext } from "react";

import SearchSection from "../game-elements/SearchSection";
import ElementsList from "../game-elements/ElementsList";
import AddElementForm from "../forms/AddElementForm";

import { GamesContext } from "../context/GamesContextProvider";

const GameElements = () => {
  const [viewType, setViewType] = useState("square");
  const [selectedElements, setSelectedElements] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { gameElements, setGameElements, collections, types } =
    useContext(GamesContext);

  useEffect(() => {
    if (collections?.length)
      setSelectedCollections(collections.map((collection) => collection.name));
    if (types?.length) setSelectedTypes(types.map((type) => type.name));
  }, [collections, types]);

  return (
    <div className="items-container">
      <h1>Game Elements</h1>

      <SearchSection
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
      </div>
    </div>
  );
};

export default GameElements;
