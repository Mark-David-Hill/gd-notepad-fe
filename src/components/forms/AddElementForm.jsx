import { useState } from "react";

import fetchWrapper from "../../lib/apiCall";

import ElementCard from "../game-elements/ElementCard";

const AddElementForm = ({
  setElementsList,
  gamesList,
  typesList,
  setAddFormIsOpen,
}) => {
  const [formName, setFormName] = useState("");
  const [formImgUrl, setFormImgUrl] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formGameId, setFormGameId] = useState("");
  const [formTypeId, setFormTypeId] = useState("");

  const handleSetFormGameId = (e) => {
    setFormGameId(e.target.value);
  };

  const handleSetFormTypeId = (e) => {
    setFormTypeId(e.target.value);
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

  const handleResetForm = () => {
    setFormGameId("");
    setFormTypeId("");
    setFormImgUrl("");
    setFormName("");
    setFormDescription("");
  };

  const handleAddGameElement = () => {
    if (formName && formDescription) {
      const body = {
        type_id: formTypeId,
        game_id: formGameId,
        name: formName,
        description: formDescription,
        image_url: formImgUrl,
      };

      fetchWrapper
        .apiCall(`/element`, "POST", body)
        .then((response) => {
          setElementsList((prev) => [...prev, response.result]);
          handleResetForm();
          setAddFormIsOpen(false);
        })
        .catch((error) => console.error("couldn't add element", error));
    }
  };

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

        <select name="" id="" onChange={handleSetFormTypeId} value={formTypeId}>
          <option value="">Select Type</option>
          {typesList &&
            typesList.map((type) => (
              <option key={type.type_id} value={type.type_id}>
                {type.name}
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
        <button
          onClick={() => {
            setAddFormIsOpen(false);
            handleResetForm();
          }}
        >
          Cancel
        </button>
        <button onClick={() => handleAddGameElement()}>Add Element</button>
      </div>

      <ElementCard
        elementData={{
          description: formDescription,
          name: formName,
          image_url: formImgUrl
            ? formImgUrl
            : "https://www.svgrepo.com/show/508699/landscape-placeholder.svg",
          type_id: formTypeId,
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
