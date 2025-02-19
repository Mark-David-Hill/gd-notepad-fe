import { useState, useEffect } from "react";

import fetchWrapper from "../../lib/apiCall";

import ItemCard from "../item-cards/ItemCard";

import { getColor } from "../../util/getColor";

const AddTypeForm = ({ collectionId, setTypes }) => {
  const [addFormIsOpen, setAddFormIsOpen] = useState(false);
  const [colorSchemes, setColorSchemes] = useState([]);
  const [formName, setFormName] = useState("");
  const [formImgUrl, setFormImgUrl] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formColorSchemeId, setFormColorSchemeId] = useState("");

  const handleResetForm = () => {
    setFormColorSchemeId("");
    setFormImgUrl("");
    setFormName("");
    setFormDescription("");
  };

  const handleAddItem = () => {
    if (formName && formDescription) {
      const body = {
        collection_id: collectionId,
        color_scheme_id: formColorSchemeId,
        name: formName,
        description: formDescription,
        image_url: formImgUrl,
      };

      fetchWrapper
        .apiCall(`/type`, "POST", body)
        .then((response) => {
          console.log(response);
          setTypes((prev) => [...prev, response.result]);
          handleResetForm();
          setAddFormIsOpen(false);
        })
        .catch((error) => console.error("couldn't add type", error));
    }
  };

  useEffect(() => {
    fetchWrapper.apiCall("/color-schemes", "GET").then((response) => {
      setColorSchemes(response.results);
    });
  }, []);

  return !addFormIsOpen ? (
    <button onClick={() => setAddFormIsOpen(true)}>Add Type</button>
  ) : (
    <div className="add-item-wrapper">
      <div className="add-item-form">
        <input
          type="text"
          placeholder="Name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
        />

        <select
          name="form-type"
          onChange={(e) => setFormColorSchemeId(e.target.value)}
          value={formColorSchemeId}
        >
          <option value="">Select Color Scheme</option>
          {colorSchemes &&
            colorSchemes.map((colorScheme) => (
              <option
                key={colorScheme.color_scheme_id}
                value={colorScheme.color_scheme_id}
                style={{ color: getColor(colorScheme, "text_color", "black") }}
              >
                {colorScheme.name}
              </option>
            ))}
        </select>

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
        <button onClick={handleAddItem}>Add Type</button>
      </div>
      <ItemCard
        colorScheme={colorSchemes?.find(
          (colorScheme) => colorScheme.color_scheme_id === formColorSchemeId
        )}
        itemData={{
          description: formDescription,
          name: formName,
          image_url:
            formImgUrl ||
            "https://www.svgrepo.com/show/508699/landscape-placeholder.svg",
        }}
        itemType="type"
      />
    </div>
  );
};

export default AddTypeForm;
