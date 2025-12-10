import { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import BaseAddForm from "./BaseAddForm";
import ItemCard from "../item-cards/ItemCard";
import { getColor } from "../../util/getColor";
import { CollectionContext } from "../context/CollectionContextProvider";
import useApi from "../../hooks/useApi";
import LoadingSpinner from "../common/LoadingSpinner";

const DEFAULT_IMAGE_URL =
  "https://www.svgrepo.com/show/508699/landscape-placeholder.svg";

const TypePreview = ({ formData, colorSchemes, types }) => {
  const selectedColorScheme = colorSchemes?.find(
    (cs) => cs.color_scheme_id === formData.color_scheme_id
  );

  return (
    <ItemCard
      colorScheme={selectedColorScheme}
      itemData={{
        description: formData.description || "",
        name: formData.name || "",
        image_url: formData.image_url || DEFAULT_IMAGE_URL,
      }}
      itemType="type"
      pageRoute="type"
      types={types}
    />
  );
};

TypePreview.propTypes = {
  formData: PropTypes.object.isRequired,
  colorSchemes: PropTypes.array,
  types: PropTypes.array,
};

const AddTypeForm = ({ collectionId, setTypes }) => {
  const { types } = useContext(CollectionContext);
  const { data: colorSchemes, loading: colorSchemesLoading, execute } = useApi(
    "/color-schemes",
    { autoFetch: false }
  );

  useEffect(() => {
    execute();
  }, [execute]);

  if (colorSchemesLoading) {
    return <LoadingSpinner message="Loading color schemes..." />;
  }

  const fields = [
    {
      name: "collection_id",
      type: "hidden",
      defaultValue: collectionId,
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Name",
      required: true,
    },
    {
      name: "color_scheme_id",
      label: "Color Scheme",
      type: "select",
      placeholder: "Select Color Scheme",
      options:
        colorSchemes?.map((colorScheme) => ({
          value: colorScheme.color_scheme_id,
          label: colorScheme.name,
          style: {
            color: getColor(colorScheme, "text_color", "black"),
          },
        })) || [],
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
    if (setTypes && typeof setTypes === "function") {
      setTypes((prev) => [...prev, result]);
    }
  };

  return (
    <BaseAddForm
      endpoint="/type"
      buttonText="Add Type"
      fields={fields}
      onSuccess={handleSuccess}
      previewComponent={TypePreview}
      previewProps={{ colorSchemes, types }}
      requiresAuth={true}
      />
  );
};

AddTypeForm.propTypes = {
  collectionId: PropTypes.string.isRequired,
  setTypes: PropTypes.func.isRequired,
};

export default AddTypeForm;
