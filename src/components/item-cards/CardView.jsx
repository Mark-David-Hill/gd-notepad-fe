import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";

import fetchWrapper from "../../lib/apiCall";

import { getColor } from "../../util/getColor";

import { AuthContext } from "../context/AuthContextProvider";

const CardView = ({
  itemData,
  setItems,
  itemType,
  pageRoute,
  colorScheme,
  typeImageUrl,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const { authInfo } = useContext(AuthContext);

  const handleDelete = () => {
    fetchWrapper
      .apiCall(`/${itemType}/delete/${itemData[`${itemType}_id`]}`, "DELETE")
      .then((response) => {
        setItems((prev) =>
          prev.filter(
            (item) => item[`${itemType}_id`] !== itemData[`${itemType}_id`]
          )
        );
      })
      .catch((error) => console.error(`could not delete ${itemType}`, error));
  };

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
          <img
            src={itemData.image_url || typeImageUrl}
            alt={`${itemData.name} image`}
          />
        </div>
        <div className="text-wrapper">
          {isEditing ? (
            <input type="text" value={itemData.description} />
          ) : (
            <p>{itemData.description}</p>
          )}
          {pageRoute && (
            <NavLink to={`/${pageRoute}/${itemData[`${itemType}_id`]}`}>
              View More Details
            </NavLink>
          )}
          {/* {authInfo && ( */}
          <div className="edit-delete-section">
            <button onClick={() => setIsEditing((prev) => !prev)}>
              {isEditing ? "Cancel" : "Edit"}
            </button>
            <button onClick={handleDelete}>Delete</button>
          </div>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default CardView;
