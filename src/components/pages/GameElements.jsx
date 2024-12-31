import { useState, useEffect, useContext } from "react";

import SearchSection from "../game-elements/SearchSection";
import ElementsList from "../game-elements/ElementsList";
import AddElementForm from "../forms/AddElementForm";

import { GamesContext } from "../context/GamesContextProvider";

const GameElements = () => {
  const [viewType, setViewType] = useState("square");
  const [selectedElements, setSelectedElements] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { gameElements, setGameElements, games, types } =
    useContext(GamesContext);

  useEffect(() => {
    if (games?.length) setSelectedGames(games.map((game) => game.name));
    if (types?.length) setSelectedTypes(types.map((type) => type.name));
  }, [games, types]);

  return (
    <div className="game-elements-container">
      <h1>Game Elements</h1>

      <SearchSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        viewType={viewType}
        setViewType={setViewType}
        selectedElements={selectedElements}
        setSelectedElements={setSelectedElements}
        selectedGames={selectedGames}
        setSelectedGames={setSelectedGames}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
      />

      <AddElementForm
        setElementsList={setGameElements}
        gamesList={games}
        typesList={types}
      />

      <div className={"game-elements-wrapper"}>
        <ElementsList
          elementsList={gameElements}
          currentRelationships={selectedElements}
          viewType={viewType}
          searchTerm={searchTerm}
          currentTypes={selectedTypes}
          currentGames={selectedGames}
          currentRelatedElements={selectedElements}
        />
      </div>
    </div>
  );
};

export default GameElements;
