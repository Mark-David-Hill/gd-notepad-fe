import { useState, useEffect, useContext } from "react";

import ElementsList from "./ElementsList";
import ComboBox from "../forms/ComboBox";

import { GamesContext } from "../context/GamesContextProvider";

const ElementsDisplay = () => {
  const { gameElements, games, types } = useContext(GamesContext);
  const [selectedElements, setSelectedElements] = useState([]);
  const [selectedGames, setSelectedGames] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState("card");

  useEffect(() => {
    if (games) {
      setSelectedGames(games.map((game) => game.name));
    }

    if (types) {
      setSelectedTypes(types.map((type) => type.name));
    }
  }, [games]);

  return gameElements.length > 0 && types ? (
    <div className={"game-elements-wrapper"}>
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

        <div className="view-select-wrapper">
          <button
            className={viewType === "square" ? "selected" : ""}
            onClick={() => setViewType("square")}
          >
            <img src="https://cdn4.iconfinder.com/data/icons/176-material-design-outline-core/24/apps-512.png" />
          </button>
          <button
            className={viewType === "card" ? "selected" : ""}
            onClick={() => setViewType("card")}
          >
            <img src="https://cdn.iconscout.com/icon/free/png-256/free-storyboard-icon-download-in-svg-png-gif-file-formats--list-card-detail-vlogger-and-video-platform-pack-entertainment-icons-1222283.png" />
          </button>
          <button
            className={viewType === "row" ? "selected" : ""}
            onClick={() => setViewType("row")}
          >
            <img src="https://static.thenounproject.com/png/2250454-200.png" />
          </button>
          <button
            className={viewType === "page" ? "selected" : ""}
            onClick={() => setViewType("page")}
          >
            <img src="https://static.thenounproject.com/png/2250454-200.png" />
          </button>
        </div>
      </div>

      {gameElements.length > 0 && games.length > 0 && types.length > 0 && (
        <ElementsList
          elementsList={gameElements}
          typesList={types}
          viewType={viewType}
          searchTerm={searchTerm}
          currentTypes={selectedTypes}
          currentGames={selectedGames}
          currentRelatedElements={selectedElements}
        />
      )}
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default ElementsDisplay;
