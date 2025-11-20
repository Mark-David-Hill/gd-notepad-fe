import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const LIGHT_MODE_VARIANT = "soft";
const DARK_MODE_VARIANT = "modern";
const CARD_VARIANTS = [LIGHT_MODE_VARIANT, DARK_MODE_VARIANT];

const CollectionCard = ({ collection, variant, isExternal = false }) => {
  const cardVariant = CARD_VARIANTS.includes(variant)
    ? variant
    : LIGHT_MODE_VARIANT;

  const placeholderLetter = collection.name?.[0]?.toUpperCase() || "?";
  
  const linkPath = isExternal 
    ? `/external-collection/${collection.collection_id}`
    : `/collection/${collection.collection_id}`;
  
  const linkText = isExternal ? "View External Collection" : "View Collection";

  return (
    <article
      className={`external-collection-card external-collection-card--${cardVariant}`}
    >
      <div className="external-collection-card__media">
        {collection.image_url ? (
          <img
            src={collection.image_url}
            alt={`${collection.name} cover art`}
            loading="lazy"
          />
        ) : (
          <div
            aria-hidden="true"
            className="external-collection-card__placeholder"
          >
            {placeholderLetter}
          </div>
        )}
      </div>
      <div className="external-collection-card__content">
        <h3>{collection.name}</h3>
        {collection.description && <p>{collection.description}</p>}
        <NavLink
          className="external-collection-card__link"
          to={linkPath}
          state={isExternal ? { collection } : undefined}
        >
          {linkText}
        </NavLink>
      </div>
    </article>
  );
};

CollectionCard.propTypes = {
  collection: PropTypes.shape({
    collection_id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    image_url: PropTypes.string,
    sheet_url: PropTypes.string,
  }).isRequired,
  variant: PropTypes.oneOf(CARD_VARIANTS).isRequired,
  isExternal: PropTypes.bool,
};

export default CollectionCard;

