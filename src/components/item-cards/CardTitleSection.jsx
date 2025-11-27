import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const CardTitleSection = ({
  itemData,
  itemType,
  pageRoute,
  colorScheme,
  typeImageUrl,
}) => {
  return (
    itemData && (
      <div className="title-section-wrapper">
        <div className="name-img-wrapper">
          <div
            className="title-wrapper"
            style={{
              backgroundColor: `${
                colorScheme ? colorScheme.primary_color : "white"
              }`,
            }}
          >
            <h2
              style={{ color: colorScheme ? colorScheme.text_color : "black" }}
            >
              {itemData.name}
            </h2>
          </div>
          <div className="image-wrapper">
            <img
              src={itemData.image_url ? itemData.image_url : typeImageUrl}
              alt={itemData.name + " image"}
            />
          </div>
        </div>
        <div className="description-wrapper">
          <p>{itemData.description}</p>
          {pageRoute && (
            <NavLink to={`/${pageRoute}/${itemData[`${itemType}_id`]}`}>
              View More Details
            </NavLink>
          )}
        </div>
      </div>
    )
  );
};

CardTitleSection.propTypes = {
  itemData: PropTypes.object.isRequired,
  itemType: PropTypes.string.isRequired,
  pageRoute: PropTypes.string,
  colorScheme: PropTypes.object,
  typeImageUrl: PropTypes.string,
};

export default CardTitleSection;
