import { useEffect, useContext } from "react";

import ViewSelect from "../forms/ViewSelect";
import ComboBox from "../forms/ComboBox";

import { GamesContext } from "../context/GamesContextProvider";

const SearchSection = ({
  viewType,
  setViewType,
  selectedElements,
  setSelectedElements,
  selectedCollections,
  setSelectedCollections,
  selectedTypes,
  setSelectedTypes,
  searchTerm,
  setSearchTerm,
}) => {
  const { gameElements, collections, types } = useContext(GamesContext);

  useEffect(() => {
    if (collections) {
      setSelectedCollections(collections.map((collection) => collection.name));
    }

    if (types) {
      setSelectedTypes(types.map((type) => type.name));
    }
  }, [collections]);

  return gameElements.length > 0 && types ? (
    <div className="search-section">
      <input
        className="search-box"
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {collections.length > 0 && (
        <ComboBox
          placeholder="Collections"
          allOptions={collections.map((collection) => collection.name)}
          currentOptions={selectedCollections}
          setCurrentOptions={setSelectedCollections}
        />
      )}
      {types.length > 0 && (
        <ComboBox
          placeholder="Types"
          allOptions={types.map((type) => type.name)}
          currentOptions={selectedTypes}
          setCurrentOptions={setSelectedTypes}
        />
      )}
      {types.length > 0 && (
        <ComboBox
          placeholder="Related Elements"
          allOptions={gameElements.map((element) => element.name)}
          currentOptions={selectedElements}
          setCurrentOptions={setSelectedElements}
        />
      )}

      <ViewSelect viewType={viewType} setViewType={setViewType} />
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default SearchSection;
