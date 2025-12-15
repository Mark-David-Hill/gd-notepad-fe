import { useEffect } from "react";
import PropTypes from "prop-types";

import fetchWrapper from "../../lib/apiCall";
import useForm from "../../hooks/useForm";
import FormField from "./FormField";
import LoadingSpinner from "../common/LoadingSpinner";

const EditItemForm = ({
  itemData,
  itemType,
  types,
  colorScheme,
  onSave,
  onCancel,
  onPreviewUpdate,
}) => {
  // Initialize form values from itemData
  const getInitialValues = () => {
    if (!itemData) return {};
    
    // For items, type_id is nested under itemData.type.type_id
    // For other item types, it might be directly on itemData.type_id
    const currentTypeId = itemData.type?.type_id || itemData.type_id || "";
    
    return {
      name: itemData.name || "",
      image_url: itemData.image_url || "",
      description: itemData.description || "",
      type_id: currentTypeId,
    };
  };

  const { values, handleChange, setValues } = useForm(getInitialValues());

  // Update form when itemData changes
  useEffect(() => {
    if (itemData) {
      const initialValues = getInitialValues();
      setValues(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemData]);

  // Update preview whenever form data changes
  useEffect(() => {
    if (onPreviewUpdate && itemData) {
      const previewData = {
        ...itemData,
        name: values.name,
        image_url: values.image_url,
        description: values.description,
      };
      onPreviewUpdate(previewData);
    }
  }, [values.name, values.image_url, values.description, onPreviewUpdate, itemData]);

  const handleSave = async () => {
    // Validate required fields
    if (!values.name || !values.description) {
      return;
    }

    const body = {
      name: values.name,
      description: values.description,
      image_url: values.image_url,
    };

    // Only include type_id if it's not empty
    if (values.type_id) {
      body.type_id = values.type_id;
    }

    const itemId = itemData[`${itemType}_id`];

    try {
      const response = await fetchWrapper.apiCall(`/${itemType}/${itemId}`, "PUT", body);
      onSave(response.result);
    } catch (error) {
      console.error("couldn't update item", error);
    }
  };

  if (!types || !types.length) {
    return <LoadingSpinner message="Loading types..." />;
  }

  const typeOptions = (
    <>
      <option value="">Select Type</option>
      {types.map((type) => (
        <option key={type.type_id} value={type.type_id}>
          {type.name}
        </option>
      ))}
    </>
  );

  return (
    <div className="edit-item-form">
      <h3>Edit Item</h3>

      <div className="form-content">
        <FormField
          id="type-select"
          label="Type"
          type="select"
          value={values.type_id || ""}
          onChange={(e) => handleChange("type_id", e.target.value)}
          options={typeOptions}
        />

        <FormField
          id="name-input"
          label="Name"
          type="text"
          value={values.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Name"
          required
        />

        <FormField
          id="image-input"
          label="Image URL"
          type="text"
          value={values.image_url || ""}
          onChange={(e) => handleChange("image_url", e.target.value)}
          placeholder="Image URL"
        />

        <FormField
          id="description-textarea"
          label="Description"
          type="textarea"
          value={values.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Description"
          required
        />

        <div className="form-buttons">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

EditItemForm.propTypes = {
  itemData: PropTypes.object.isRequired,
  itemType: PropTypes.string.isRequired,
  types: PropTypes.array.isRequired,
  colorScheme: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onPreviewUpdate: PropTypes.func,
};

export default EditItemForm;
