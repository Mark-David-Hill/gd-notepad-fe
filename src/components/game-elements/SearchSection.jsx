import { useState, useEffect, useContext } from "react";

import ViewSelect from "../forms/ViewSelect";
import ComboBox from "../forms/ComboBox";

import { GamesContext } from "../context/GamesContextProvider";

const SearchSection = ({
  viewType,
  setViewType,
  selectedElements,
  setSelectedElements,
  selectedGames,
  setSelectedGames,
  selectedTypes,
  setSelectedTypes,
  searchTerm,
  setSearchTerm,
}) => {
  const { gameElements, games, types } = useContext(GamesContext);

  useEffect(() => {
    if (games) {
      setSelectedGames(games.map((game) => game.name));
    }

    if (types) {
      setSelectedTypes(types.map((type) => type.name));
    }
  }, [games]);

  return gameElements.length > 0 && types ? (
    <div className="search-section">
      <input
        className="search-box"
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {games.length > 0 && (
        <ComboBox
          placeholder="Games"
          allOptions={games.map((game) => game.name)}
          currentOptions={selectedGames}
          setCurrentOptions={setSelectedGames}
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
