import { useState, useEffect } from "react";

import fetchWrapper from "../lib/apiCall";

import ElementsList from "./ElementsList";
import ElementCard from "./ElementCard";

const ElementsDisplay = ({ elementType }) => {
  const [elementsList, setElementsList] = useState([]);
  const [elementTypeId, setElementTypeId] = useState("");
  const [gamesList, setGamesList] = useState([]);
  const [typesList, setTypesList] = useState([]);
  const [viewType, setViewType] = useState("card");
  const [formName, setFormName] = useState("");
  const [formImgUrl, setFormImgUrl] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formGameId, setFormGameId] = useState("");

  const handleSetFormGameId = (e) => {
    console.log(e.target.value);
    setFormGameId(e.target.value);
  };

  const handleSetFormName = (e) => {
    setFormName(e.target.value);
  };

  const handleSetFormImgUrl = (e) => {
    setFormImgUrl(e.target.value);
  };

  const handleSetFormDescription = (e) => {
    setFormDescription(e.target.value);
  };

  const handleAddGameElement = () => {
    if (formName && formDescription) {
      const body = {
        type_id: elementTypeId,
        game_id: formGameId,
        name: formName,
        description: formDescription,
        image_url: formImgUrl,
      };

      fetchWrapper
        .apiCall(`/element`, "POST", body)
        .then((response) => {
          setFormGameId("");
          setFormImgUrl("");
          setElementsList((prev) => [...prev, response.result]);
          setFormName("");
          setFormDescription("");
        })
        .catch((error) => console.error("couldn't add element", error));
    }
  };

  useEffect(() => {
    fetchWrapper
      .apiCall(`/elements`, "GET")
      .then((response) => {
        setElementsList(
          response.results.filter((element) => element.type.name == elementType)
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
        setElementTypeId(
          response.results.find((type) => type.name === elementType).type_id
        );
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

      <h1>{elementType}s</h1>
      <div className="add-element-wrapper">
        <div className="add-element-form">
          <select
            name=""
            id=""
            onChange={handleSetFormGameId}
            value={formGameId}
          >
            <option value="">Select Game</option>
            {gamesList &&
              gamesList.map((game) => (
                <option key={game.game_id} value={game.game_id}>
                  {game.name}
                </option>
              ))}
          </select>
          <input
            type="text"
            placeholder="name"
            value={formName}
            onChange={handleSetFormName}
          />
          <input
            type="text"
            placeholder="image-url"
            value={formImgUrl}
            onChange={handleSetFormImgUrl}
          />
          <textarea
            name="form-description"
            id="form-description"
            placeholder="description"
            value={formDescription}
            onChange={handleSetFormDescription}
          ></textarea>
          <button onClick={() => handleAddGameElement()}>
            Add {elementType}
          </button>
        </div>

        <ElementCard
          elementData={{
            description: formDescription,
            name: formName,
            image_url: formImgUrl
              ? formImgUrl
              : "https://www.svgrepo.com/show/508699/landscape-placeholder.svg",
            type_id: elementTypeId,
            notes: [],
          }}
          viewType="card"
          relationshipsList={[]}
          typesList={typesList}
        />
      </div>
      <div className="relationships-view-wrapper">
        <input type="checkbox" id="mechanics" name="mechanics" value="Bike" />
        <label htmlFor="mechanics"> Mechanics</label>
        <input type="checkbox" id="levels" name="levels" value="Car" />
        <label htmlFor="levels"> Levels</label>
        <input
          type="checkbox"
          id="level-elements"
          name="level-elements"
          value="Boat"
        />
        <label htmlFor="level-elements"> Level Elements</label>
        <input
          type="checkbox"
          id="enemy-elements"
          name="enemy-elements"
          value="Boat"
        />
        <label htmlFor="enemy-elements"> Enemy Elements</label>
        <input type="checkbox" id="power-ups" name="power-ups" value="Boat" />
        <label htmlFor="power-ups"> Power Ups</label>
      </div>
      <ElementsList
        elementsList={elementsList}
        typesList={typesList}
        viewType={viewType}
      />
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default ElementsDisplay;
