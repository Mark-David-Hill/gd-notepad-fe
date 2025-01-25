import { NavLink } from "react-router-dom";

const CardTitleSection = ({ itemData, itemType, pageRoute }) => {
  return (
    itemData && (
      <div className="title-section-wrapper">
        <div className="name-img-wrapper">
          <div
            className="title-wrapper"
            style={{
              backgroundColor: `${
                itemData?.type?.color
                  ? itemData.type.color
                  : itemData?.color
                  ? itemData.color
                  : ""
              }`,
            }}
          >
            <h2>{itemData.name}</h2>
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
