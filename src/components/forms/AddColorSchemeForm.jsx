import { useState } from "react";

import fetchWrapper from "../../lib/apiCall";

import ItemCard from "../item-cards/ItemCard";

const AddColorSchemeForm = ({ setColorSchemes }) => {
  const [addFormIsOpen, setAddFormIsOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formPrimaryColor, setFormPrimaryColor] = useState("");
  const [formSecondaryColor, setFormSecondaryColor] = useState("");
  const [formTextColor, setFormTextColor] = useState("");
  const [formBackgroundColor, setFormBackgroundColor] = useState("");

  const handleResetForm = () => {
    setFormImgUrl("");
    setFormName("");
    setFormDescription("");
  };

  const handleAddItem = () => {
    if (
      formName &&
      formPrimaryColor &&
      formSecondaryColor &&
      formTextColor &&
      formBackgroundColor
    ) {
      const body = {
        name: formName,
        primary_color: formPrimaryColor,
        secondary_color: formSecondaryColor,
        text_color: formTextColor,
        background_color: formBackgroundColor,
      };

      fetchWrapper
        .apiCall(`/color_scheme`, "POST", body)
        .then((response) => {
          setColorSchemes((prev) => [...prev, response.result]);
          handleResetForm();
          setAddFormIsOpen(false);
        })
        .catch((error) => console.error("couldn't add color scheme", error));
    }
  };

  return !addFormIsOpen ? (
    <button onClick={() => setAddFormIsOpen(true)}>Add Color Scheme</button>
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
          placeholder="Primary Color"
          value={formPrimaryColor}
          onChange={(e) => setFormPrimaryColor(e.target.value)}
        />

        <input
          type="text"
          placeholder="Secondary Color"
          value={formSecondaryColor}
          onChange={(e) => setFormSecondaryColor(e.target.value)}
        />

        <input
          type="text"
          placeholder="Text Color"
          value={formTextColor}
          onChange={(e) => setFormTextColor(e.target.value)}
        />

        <input
          type="text"
          placeholder="Background Color"
          value={formBackgroundColor}
          onChange={(e) => setFormBackgroundColor(e.target.value)}
        />

        <button
          onClick={() => {
            setAddFormIsOpen(false);
            handleResetForm();
          }}
        >
          Cancel
        </button>
        <button onClick={handleAddItem}>Add Color Scheme</button>
      </div>
      <ItemCard
        colorScheme={{
          name: formName,
          primary_color: formPrimaryColor,
          secondary_color: formSecondaryColor,
          text_color: formTextColor,
          background_color: formBackgroundColor,
        }}
        itemData={{
          name: formName,
        }}
        itemType="collection"
      />
    </div>
  );
};

export default AddColorSchemeForm;
