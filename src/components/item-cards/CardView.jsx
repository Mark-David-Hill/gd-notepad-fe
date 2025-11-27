import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import { useItemDeletion } from "../../hooks/useItemActions";
import { getColor } from "../../util/getColor";
import { AuthContext } from "../context/AuthContextProvider";
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
  const { authInfo } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [previewData, setPreviewData] = useState(itemData);
  const id = itemData[`${itemType}_id`];

  const onDelete = useItemDeletion(itemType, id, setItems);

  const handleSaveEdit = (updatedItem) => {
    setItems((prev) =>
      prev.map((item) => (item[`${itemType}_id`] === id ? updatedItem : item))
    );
    setIsEditing(false);
    setPreviewData(updatedItem);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setPreviewData(itemData);
  };

  const handlePreviewUpdate = (newPreviewData) => {
    setPreviewData(newPreviewData);
  };

  if (isEditing) {
    return (
      <div className="card-view-container editing">
        <div className="title-wrapper">
          <h2
            style={{
              backgroundColor: getColor(colorScheme, "primary_color", "white"),
              color: getColor(colorScheme, "text_color", "black"),
            }}
          >
            {previewData.name}
          </h2>
        </div>
        <div className="card-content-wrapper">
          <div className="image-wrapper">
            <img
              src={previewData.image_url}
              alt={`${previewData.name} image`}
            />
          </div>
          <div
            className="text-wrapper"
            style={{
              backgroundColor: getColor(
                colorScheme,
                "background_color",
                "rgb(198, 255, 237)"
              ),
            }}
          >
            <EditItemForm
              itemData={itemData}
              itemType={itemType}
              types={types}
              colorScheme={colorScheme}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
              onPreviewUpdate={handlePreviewUpdate}
            />
          </div>
        </div>
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
          {isEditable && authInfo && (
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

CardView.propTypes = {
  itemData: PropTypes.object.isRequired,
  setItems: PropTypes.func.isRequired,
  itemType: PropTypes.string.isRequired,
  pageRoute: PropTypes.string,
  colorScheme: PropTypes.object,
  isEditable: PropTypes.bool,
  types: PropTypes.array.isRequired,
};

export default CardView;
