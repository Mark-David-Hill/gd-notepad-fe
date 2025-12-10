import PropTypes from "prop-types";
import BaseAddForm from "./BaseAddForm";
import ItemCard from "../item-cards/ItemCard";

const DEFAULT_IMAGE_URL =
  "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";

const CollectionPreview = ({ formData }) => (
      <ItemCard
        itemData={{
      description: formData.description || "",
      name: formData.name || "",
      image_url: formData.image_url || DEFAULT_IMAGE_URL,
          notes: [],
        }}
        itemType="collection"
        types={[]}
      />
);

CollectionPreview.propTypes = {
  formData: PropTypes.object.isRequired,
};

const AddCollectionForm = ({ setCollections }) => {
  const fields = [
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
    if (setCollections && typeof setCollections === "function") {
      // setCollections can be either a state setter function or a callback
      // Try to call it as a state setter first, otherwise call it as a callback
      try {
        setCollections((prev) => {
          if (Array.isArray(prev)) {
            return [...prev, result];
          }
          return [result];
        });
      } catch {
        // If it's not a state setter, call it as a regular callback
        setCollections(result);
      }
    }
  };

  return (
    <BaseAddForm
      endpoint="/collection"
      buttonText="Add Collection"
      fields={fields}
      onSuccess={handleSuccess}
      previewComponent={CollectionPreview}
      requiresAuth={true}
    />
  );
};

AddCollectionForm.propTypes = {
  setCollections: PropTypes.func.isRequired,
};

export default AddCollectionForm;
