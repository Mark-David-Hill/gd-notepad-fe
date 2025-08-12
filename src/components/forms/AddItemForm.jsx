import { useState, useContext } from "react";

import fetchWrapper from "../../lib/apiCall";
import { AuthContext } from "../context/AuthContextProvider";

import CollectionItemCard from "../item-cards/CollectionItemCard";

const AddItemForm = ({ types, collectionId, setItems }) => {
  const { authInfo } = useContext(AuthContext);
  const [addFormIsOpen, setAddFormIsOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formImgUrl, setFormImgUrl] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formTypeId, setFormTypeId] = useState("");

  const handleResetForm = () => {
    setFormTypeId("");
    setFormImgUrl("");
    setFormName("");
    setFormDescription("");
  };

  const handleAddItem = () => {
    if (formName && formDescription) {
      const body = {
        type_id: formTypeId,
        collection_id: collectionId,
        name: formName,
        description: formDescription,
        image_url: formImgUrl,
      };

      fetchWrapper
        .apiCall(`/item`, "POST", body)
        .then((response) => {
          setItems((prev) => [...prev, response.result]);
          handleResetForm();
          setAddFormIsOpen(false);
        })
        .catch((error) => console.error("couldn't add item", error));
    }
  };

  if (!types || !types.length) {
    return <p>Loading...</p>;
  }

  // Don't render anything if user is not authenticated
  if (!authInfo) {
    return null;
  }

  return !addFormIsOpen ? (
    <button onClick={() => setAddFormIsOpen(true)}>Add Item</button>
  ) : (
    <div className="add-item-wrapper">
      <div className="add-item-form">
        <select
          name="form-type"
          onChange={(e) => setFormTypeId(e.target.value)}
          value={formTypeId}
        >
          <option value="">Select Type</option>
          {types &&
            types.map((type) => (
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
        <button onClick={handleAddItem}>Add Item</button>
      </div>
      <CollectionItemCard
        itemData={{
          description: formDescription,
          name: formName,
          image_url:
            formImgUrl ||
            "https://www.svgrepo.com/show/508699/landscape-placeholder.svg",
          type_id: formTypeId,
          notes: [],
        }}
        viewType="add"
      />
    </div>
  );
};

export default AddItemForm;
