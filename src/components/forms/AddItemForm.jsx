import PropTypes from "prop-types";
import BaseAddForm from "./BaseAddForm";
import CollectionItemCard from "../item-cards/CollectionItemCard";
import LoadingSpinner from "../common/LoadingSpinner";

const DEFAULT_IMAGE_URL =
  "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";

const ItemPreview = ({ formData }) => (
  <CollectionItemCard
    itemData={{
      description: formData.description || "",
      name: formData.name || "",
      image_url: formData.image_url || DEFAULT_IMAGE_URL,
      type_id: formData.type_id || "",
      notes: [],
    }}
    viewType="add"
  />
);

ItemPreview.propTypes = {
  formData: PropTypes.object.isRequired,
};

const AddItemForm = ({ types, collectionId, setItems }) => {
  if (!types || !types.length) {
    return <LoadingSpinner message="Loading types..." />;
  }

  const fields = [
    {
      name: "collection_id",
      type: "hidden",
      defaultValue: collectionId,
    },
    {
      name: "type_id",
      label: "Type",
      type: "select",
      placeholder: "Select Type",
      options: types.map((type) => ({
        value: type.type_id,
        label: type.name,
      })),
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Name",
      required: true,
    },
    {
      name: "image_url",
      label: "Image URL",
      type: "text",
      placeholder: "Image URL",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Description",
      required: true,
    },
  ];

  const handleSuccess = (result) => {
    if (setItems && typeof setItems === "function") {
      setItems((prev) => [...prev, result]);
    }
  };

  return (
    <BaseAddForm
      endpoint="/item"
      buttonText="Add Item"
      fields={fields}
      onSuccess={handleSuccess}
      previewComponent={ItemPreview}
      requiresAuth={true}
    />
  );
};

AddItemForm.propTypes = {
  types: PropTypes.array.isRequired,
  collectionId: PropTypes.string.isRequired,
  setItems: PropTypes.func.isRequired,
};

export default AddItemForm;
