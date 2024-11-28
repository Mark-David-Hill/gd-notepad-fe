import { useState, useEffect } from "react";

import fetchWrapper from "../../lib/apiCall";

import CategoryFilter from "../search/CategoryFilter";
import ElementsList from "./ElementsList";
import ElementCard from "./ElementCard";
import Search from "../search/Search";

import AddElementForm from "../forms/AddElementForm";

const ElementsDisplay = ({ elementType }) => {
  const [elementsList, setElementsList] = useState([]);
  const [elementTypeId, setElementTypeId] = useState("");
  const [gamesList, setGamesList] = useState([]);
  const [typesList, setTypesList] = useState([]);
  const [viewType, setViewType] = useState("card");
  const [orderBy, setOrderBy] = useState("desc");
  const [relationshipsSearchTerm, setRelationshipsSearchTerm] = useState("");
  const [currentCategories, setCurrentCategories] = useState([
    "Mechanics",
    "Levels",
    "Level Elements",
    "Enemy Elements",
    "Power Ups",
  ]);

  useEffect(() => {
    fetchWrapper
      .apiCall(`/elements`, "GET")
      .then((response) => {
        setElementsList(
          elementType === "all"
            ? response.results
            : response.results.filter(
                (element) => element.type.name === elementType
              )
        );
      })
      .catch((error) => console.error(`couldn't get ${elementType}s`, error));

    fetchWrapper
      .apiCall(`/games`, "GET")
      .then((response) => {
        setGamesList(response.results);
      })
      .catch((error) => console.error(`couldn't get games`, error));

    fetchWrapper
      .apiCall(`/types`, "GET")
      .then((response) => {
        setTypesList(response.results);
        // setElementTypeId(
        //   response.results.find((type) => type.name === elementType).type_id
        // );
      })
      .catch((error) => console.error(`couldn't get type data`, error));
  }, []);

  return elementsList && typesList ? (
    <div className={"game-elements-wrapper"}>
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

      {/* <h1>{elementType}s</h1> */}

      <AddElementForm
        elementType={elementType}
        setElementsList={setElementsList}
        elementTypeId={elementTypeId}
        gamesList={gamesList}
        typesList={typesList}
      />

      <div className="search-section">
        <Search
          setSearchTerm={setRelationshipsSearchTerm}
          setOrderBy={setOrderBy}
          orderBy={orderBy}
          placeholder={"relationships search"}
        />
        <CategoryFilter
          categoriesList={[
            "Mechanics",
            "Levels",
            "Level Elements",
            "Enemy Elements",
            "Power Ups",
          ]}
          currentCategories={currentCategories}
          setCurrentCategories={setCurrentCategories}
          viewType={viewType}
        />
      </div>
      <ElementsList
        elementsList={elementsList}
        typesList={typesList}
        viewType={viewType}
        currentCategories={currentCategories}
        relationshipsSearchTerm={relationshipsSearchTerm}
      />
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default ElementsDisplay;
