import { useState } from "react";
import { NavLink } from "react-router-dom";

import { useItemDeletion } from "../../hooks/useItemActions";
import { getColor } from "../../util/getColor";

const CardView = ({
  itemData,
  setItems,
  itemType,
  pageRoute,
  colorScheme,
  isEditable,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const id = itemData[`${itemType}_id`];

  const onDelete = useItemDeletion(itemType, id, setItems);

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
          <p>
            {isEditing ? (
              <em>Editing mode active (you can put a form here)</em>
            ) : (
              itemData.description
            )}
          </p>

          {pageRoute && (
            <NavLink to={`/${pageRoute}/${id}`}>View More Details</NavLink>
          )}
          {isEditable && (
            <div className="edit-delete-section">
              <button onClick={() => setIsEditing((prev) => !prev)}>
                {isEditing ? "Cancel" : "Edit"}
              </button>
              <button onClick={onDelete}>Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardView;
