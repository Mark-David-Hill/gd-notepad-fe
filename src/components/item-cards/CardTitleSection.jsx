import { NavLink } from "react-router-dom";

const CardTitleSection = ({ itemData, itemType, pageRoute, colorScheme }) => {
  return (
    itemData && (
      <div className="title-section-wrapper">
        <div className="name-img-wrapper">
          <div
            className="title-wrapper"
            style={{
              backgroundColor: `${colorScheme.primary_color}`,
            }}
          >
            <h2 style={{ color: colorScheme.text_color }}>{itemData.name}</h2>
          </div>
          <div className="image-wrapper">
            <img src={itemData.image_url} alt={itemData.name + " image"} />
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

export default CardTitleSection;
