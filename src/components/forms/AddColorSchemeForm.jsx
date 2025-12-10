import PropTypes from "prop-types";
import BaseAddForm from "./BaseAddForm";
import ItemCard from "../item-cards/ItemCard";

const ColorSchemePreview = ({ formData }) => {
  const colorScheme = {
    name: formData.name || "",
    primary_color: formData.primary_color || "",
    secondary_color: formData.secondary_color || "",
    text_color: formData.text_color || "",
    background_color: formData.background_color || "",
  };

  return (
    <ItemCard
      colorScheme={colorScheme}
      itemData={{
        name: formData.name || "",
      }}
      itemType="color-scheme"
      types={[]}
    />
  );
};

ColorSchemePreview.propTypes = {
  formData: PropTypes.object.isRequired,
};

const AddColorSchemeForm = ({ setColorSchemes }) => {
  const fields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Name",
      required: true,
    },
    {
      name: "primary_color",
      label: "Primary Color",
      type: "text",
      placeholder: "Primary Color",
      required: true,
    },
    {
      name: "secondary_color",
      label: "Secondary Color",
      type: "text",
      placeholder: "Secondary Color",
      required: true,
    },
    {
      name: "text_color",
      label: "Text Color",
      type: "text",
      placeholder: "Text Color",
      required: true,
    },
    {
      name: "background_color",
      label: "Background Color",
      type: "text",
      placeholder: "Background Color",
      required: true,
    },
  ];

  const handleSuccess = (result) => {
    if (setColorSchemes && typeof setColorSchemes === "function") {
      try {
        setColorSchemes((prev) => {
          if (Array.isArray(prev)) {
            return [...prev, result];
          }
          return [result];
        });
      } catch {
        // If it's not a state setter, call it as a regular callback
        setColorSchemes(result);
      }
    }
  };

  return (
    <BaseAddForm
      endpoint="/color_scheme"
      buttonText="Add Color Scheme"
      fields={fields}
      onSuccess={handleSuccess}
      previewComponent={ColorSchemePreview}
      requiresAuth={true}
    />
  );
};

AddColorSchemeForm.propTypes = {
  setColorSchemes: PropTypes.func,
};

export default AddColorSchemeForm;
