import { useState, useContext } from "react";
import PropTypes from "prop-types";

import ItemCard from "../item-cards/ItemCard";
import fetchWrapper from "../../lib/apiCall";
import { AuthContext } from "../context/AuthContextProvider";

const AddCollectionForm = ({ setCollections }) => {
  const { authInfo } = useContext(AuthContext);
  const [addFormIsOpen, setAddFormIsOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formImgUrl, setFormImgUrl] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const handleResetForm = () => {
    setFormImgUrl("");
    setFormName("");
    setFormDescription("");
  };

  // Don't render anything if user is not authenticated
  if (!authInfo) {
    return null;
  }

  const handleAddCollection = () => {
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
        <button onClick={handleAddCollection}>Add Collection</button>
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
        types={[]}
      />
    </div>
  );
};

AddCollectionForm.propTypes = {
  setCollections: PropTypes.func.isRequired,
};

export default AddCollectionForm;
