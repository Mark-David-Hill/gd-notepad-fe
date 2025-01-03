import { NavLink } from "react-router-dom";

const CardTitleSection = ({ itemData, itemType, pageRoute }) => {
  return (
    itemData && (
      <div className="title-section-wrapper">
        <div className="name-img-wrapper">
          <h2>{itemData.name}</h2>
          <img src={itemData.image_url} alt={itemData.name + " image"} />
        </div>
        <div className="description-wrapper">
          <p>{itemData.description}</p>
          <NavLink to={`/${pageRoute}/${itemData[`${itemType}_id`]}`}>
            View More Details
          </NavLink>
        </div>
      </div>
    )
  );
};

export default CardTitleSection;
