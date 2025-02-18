import { useState } from "react";

import fetchWrapper from "../../lib/apiCall";

import ItemCard from "../item-cards/ItemCard";

const AddCollectionForm = ({ setCollections }) => {
  const [addFormIsOpen, setAddFormIsOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formImgUrl, setFormImgUrl] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const handleResetForm = () => {
    setFormImgUrl("");
    setFormName("");
    setFormDescription("");
  };

  const handleAddItem = () => {
    if (formName && formDescription) {
      const body = {
        name: formName,
        description: formDescription,
        image_url: formImgUrl,
      };

      fetchWrapper
        .apiCall(`/collection`, "POST", body)
        .then((response) => {
          setCollections((prev) => [...prev, response.result]);
          handleResetForm();
          setAddFormIsOpen(false);
        })
        .catch((error) => console.error("couldn't add collection", error));
    }
  };

  return !addFormIsOpen ? (
    <button onClick={() => setAddFormIsOpen(true)}>Add Collection</button>
  ) : (
    <div className="add-item-wrapper">
      <div className="add-item-form">
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
        <button onClick={handleAddItem}>Add Item</button>
      </div>
      <ItemCard
        itemData={{
          description: formDescription,
          name: formName,
          image_url:
            formImgUrl ||
            "https://www.svgrepo.com/show/508699/landscape-placeholder.svg",
          notes: [],
        }}
        itemType="collection"
      />
    </div>
  );
};

export default AddCollectionForm;
