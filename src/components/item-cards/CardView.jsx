import { NavLink } from "react-router-dom";

import { getColor } from "../../util/getColor";

const CardView = ({
  itemData,
  itemType,
  pageRoute,
  colorScheme,
  typeImageUrl,
}) => {
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
          <p>{itemData.description}</p>
          {pageRoute && (
            <NavLink to={`/${pageRoute}/${itemData[`${itemType}_id`]}`}>
              View More Details
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardView;
