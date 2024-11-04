import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import fetchWrapper from "../lib/apiCall";

import ElementsList from "./ElementsList";

const ElementsDisplay = ({ elementType }) => {
  const [elementsList, setElementsList] = useState([]);
  const [viewType, setViewType] = useState("card");

  useEffect(() => {
    fetchWrapper
      .apiCall(`/elements`, "GET")
      .then((response) => {
        setElementsList(
          response.results.filter((element) => element.type.name == elementType)
        );
      })
      .catch((error) =>
        console.error(`couldn't display ${elementType}s`, error)
      );
  }, []);

  return (
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
      </div>

      <h1>{elementType}s</h1>
      <ElementsList elementsList={elementsList} viewType={viewType} />
    </div>
  );
};

export default ElementsDisplay;
