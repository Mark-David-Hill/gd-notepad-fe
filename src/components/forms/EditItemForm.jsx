import { useState, useEffect } from "react";

import fetchWrapper from "../../lib/apiCall";
import { getColor } from "../../util/getColor";

const EditItemForm = ({
  itemData,
  itemType,
  types,
  colorScheme,
  onSave,
  onCancel,
  onPreviewUpdate,
}) => {
  const [formName, setFormName] = useState("");
  const [formImgUrl, setFormImgUrl] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formTypeId, setFormTypeId] = useState("");

  // Populate form with existing data when component mounts or itemData changes
  useEffect(() => {
    if (itemData) {
      setFormName(itemData.name || "");
      setFormImgUrl(itemData.image_url || "");
      setFormDescription(itemData.description || "");
      // For items, type_id is nested under itemData.type.type_id
      // For other item types, it might be directly on itemData.type_id
      const currentTypeId = itemData.type?.type_id || itemData.type_id || "";
      setFormTypeId(currentTypeId);
    }
  }, [itemData]);

  // Update preview whenever form data changes
  useEffect(() => {
    if (onPreviewUpdate && itemData) {
      const previewData = {
        ...itemData,
        name: formName,
        image_url: formImgUrl,
        description: formDescription,
      };
      onPreviewUpdate(previewData);
    }
  }, [formName, formImgUrl, formDescription, onPreviewUpdate, itemData]);

  const handleSave = () => {
    if (formName && formDescription) {
      const body = {
        name: formName,
        description: formDescription,
        image_url: formImgUrl,
      };

      // Only include type_id if it's not empty
      if (formTypeId) {
        body.type_id = formTypeId;
      }

      const itemId = itemData[`${itemType}_id`];

      fetchWrapper
        .apiCall(`/${itemType}/${itemId}`, "PUT", body)
        .then((response) => {
          onSave(response.result);
        })
        .catch((error) => console.error("couldn't update item", error));
    }
  };

  if (!types || !types.length) {
    return <p>Loading...</p>;
  }

  return (
    <div className="edit-item-form">
      <h3>Edit Item</h3>

      <div className="form-content">
        <div className="form-field">
          <label htmlFor="type-select">Type:</label>
          <select
            id="type-select"
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
        </div>

        <div className="form-field">
          <label htmlFor="name-input">Name:</label>
          <input
            id="name-input"
            type="text"
            placeholder="Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="image-input">Image URL:</label>
          <input
            id="image-input"
            type="text"
            placeholder="Image URL"
            value={formImgUrl}
            onChange={(e) => setFormImgUrl(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="description-textarea">Description:</label>
          <textarea
            id="description-textarea"
            placeholder="Description"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="form-buttons">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default EditItemForm;
