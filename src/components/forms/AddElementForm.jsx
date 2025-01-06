import { useState } from "react";

import fetchWrapper from "../../lib/apiCall";

import ItemCard from "../item-cards/ItemCard";

const AddElementForm = ({ setElementsList, collectionsList, typesList }) => {
  const [addFormIsOpen, setAddFormIsOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formImgUrl, setFormImgUrl] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCollectionId, setFormCollectionId] = useState("");
  const [formTypeId, setFormTypeId] = useState("");

  const handleResetForm = () => {
    setFormCollectionId("");
    setFormTypeId("");
    setFormImgUrl("");
    setFormName("");
    setFormDescription("");
  };

  const handleAddGameElement = () => {
    if (formName && formDescription) {
      const body = {
        type_id: formTypeId,
        collection_id: formCollectionId,
        name: formName,
        description: formDescription,
        image_url: formImgUrl,
      };

      fetchWrapper
        .apiCall(`/item`, "POST", body)
        .then((response) => {
          setElementsList((prev) => [...prev, response.result]);
          handleResetForm();
          setAddFormIsOpen(false);
        })
        .catch((error) => console.error("couldn't add element", error));
    }
  };

  if (!typesList || !typesList.length) {
    return <p>Loading...</p>;
  }

  return !addFormIsOpen ? (
    <button onClick={() => setAddFormIsOpen(true)}>Add Game Element</button>
  ) : (
    <div className="add-element-wrapper">
      <div className="add-element-form">
        <select
          name="form-collection"
          onChange={(e) => setFormCollectionId(e.target.value)}
          value={formCollectionId}
        >
          <option value="">Select Collection</option>
          {collectionsList &&
            collectionsList.map((collection) => (
              <option
                key={collection.collection_id}
                value={collection.collection_id}
              >
                {collection.name}
              </option>
            ))}
        </select>

        <select
          name="form-type"
          onChange={(e) => setFormTypeId(e.target.value)}
          value={formTypeId}
        >
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
          placeholder="Name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={formImgUrl}
          onChange={(e) => setFormImgUrl(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
        ></textarea>

        <button
          onClick={() => {
            setAddFormIsOpen(false);
            handleResetForm();
          }}
        >
          Cancel
        </button>
        <button onClick={handleAddGameElement}>Add Element</button>
      </div>
      <ItemCard
        itemData={{
          description: formDescription,
          name: formName,
          image_url:
            formImgUrl ||
            "https://www.svgrepo.com/show/508699/landscape-placeholder.svg",
          type_id: formTypeId,
          notes: [],
        }}
        itemType="element"
        fetchRoute="elements"
      />
    </div>
  );
};

export default AddElementForm;
