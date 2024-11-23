import { useState } from "react";

import fetchWrapper from "../../lib/apiCall";

import ElementCard from "../game-elements/ElementCard";

const AddElementForm = ({
  elementType,
  setElementsList,
  elementTypeId,
  gamesList,
  typesList,
}) => {
  const [formName, setFormName] = useState("");
  const [formImgUrl, setFormImgUrl] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formGameId, setFormGameId] = useState("");

  const handleSetFormGameId = (e) => {
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

  // useEffect(() => {
  //   fetchWrapper
  //     .apiCall(`/elements`, "GET")
  //     .then((response) => {
  //       setElementsList(
  //         response.results.filter((element) => element.type.name == elementType)
  //       );
  //     })
  //     .catch((error) => console.error(`couldn't get ${elementType}s`, error));

  //   fetchWrapper
  //     .apiCall(`/games`, "GET")
  //     .then((response) => {
  //       setGamesList(response.results);
  //     })
  //     .catch((error) => console.error(`couldn't get games`, error));

  //   fetchWrapper
  //     .apiCall(`/types`, "GET")
  //     .then((response) => {
  //       setTypesList(response.results);
  //       setElementTypeId(
  //         response.results.find((type) => type.name === elementType).type_id
  //       );
  //     })
  //     .catch((error) => console.error(`couldn't get type data`, error));
  // }, []);

  return typesList ? (
    <div className="add-element-wrapper">
      <div className="add-element-form">
        <select name="" id="" onChange={handleSetFormGameId} value={formGameId}>
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
  ) : (
    <p>Loading...</p>
  );
};

export default AddElementForm;
