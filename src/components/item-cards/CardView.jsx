import { useState } from "react";
import { NavLink } from "react-router-dom";

import { useItemDeletion } from "../../hooks/useItemActions";
import { getColor } from "../../util/getColor";
import EditItemForm from "../forms/EditItemForm";

const CardView = ({
  itemData,
  setItems,
  itemType,
  pageRoute,
  colorScheme,
  isEditable,
  types,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const id = itemData[`${itemType}_id`];

  const onDelete = useItemDeletion(itemType, id, setItems);

  const handleSaveEdit = (updatedItem) => {
    setItems((prev) =>
      prev.map((item) => (item[`${itemType}_id`] === id ? updatedItem : item))
    );
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="card-view-container">
        <EditItemForm
          itemData={itemData}
          itemType={itemType}
          types={types}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }

  return (
    <div className="card-view-container">
      <div className="title-wrapper">
        <h2
          style={{
            backgroundColor: getColor(colorScheme, "primary_color", "white"),
            color: getColor(colorScheme, "text_color", "black"),
          }}
        >
          {itemData.name}
        </h2>
      </div>
      <div className="card-content-wrapper">
        <div className="image-wrapper">
          <img src={itemData.image_url} alt={`${itemData.name} image`} />
        </div>
        <div className="text-wrapper">
          <p>{itemData.description}</p>

          {pageRoute && (
            <NavLink to={`/${pageRoute}/${id}`}>View More Details</NavLink>
          )}
          {isEditable && (
            <div className="edit-delete-section">
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={onDelete}>Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardView;
