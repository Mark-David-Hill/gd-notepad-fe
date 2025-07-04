import { NavLink } from "react-router-dom";

import RelationshipsList from "./RelationshipsList";
import NotesList from "./NotesList";

import { getColor } from "../../util/getColor";

const PageView = ({
  itemData,
  itemType,
  pageRoute,
  colorScheme,
  typeImageUrl,
}) => {
  return (
    <div className="page-view-container">
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
              <RelationshipsList itemData={itemData} />
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

export default PageView;
