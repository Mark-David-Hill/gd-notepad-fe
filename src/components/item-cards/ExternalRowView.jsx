import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import ExternalRelationshipsList from "./ExternalRelationshipsList";
import NotesList from "./NotesList";

import { getColor } from "../../util/getColor";

const ExternalRowView = ({
  itemData,
  itemType,
  pageRoute,
  colorScheme,
  typeImageUrl,
  relationships,
  types,
  items,
  colorSchemes,
}) => {
  return (
    <div className="row-view-container">
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
      <div className="row-wrapper">
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

        {itemType === "item" && itemData?.item_id && (
          <div className="notes-relationships-container">
            <div className="relationship-wrapper">
              <ExternalRelationshipsList
                itemData={itemData}
                relationships={relationships}
                types={types}
                items={items}
                colorSchemes={colorSchemes}
              />
            </div>
            <div className="notes-wrapper">
              <NotesList itemData={itemData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ExternalRowView.propTypes = {
  itemData: PropTypes.object.isRequired,
  itemType: PropTypes.string.isRequired,
  pageRoute: PropTypes.string,
  colorScheme: PropTypes.object,
  typeImageUrl: PropTypes.string,
  relationships: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  types: PropTypes.array.isRequired,
  colorSchemes: PropTypes.array,
};

export default ExternalRowView;
