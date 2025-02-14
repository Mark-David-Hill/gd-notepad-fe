import RelationshipsList from "./RelationshipsList";
import NotesList from "./NotesList";
import { getColor } from "../../util/getColor";

const RowView = ({
  itemData,
  itemType,
  pageRoute,
  colorScheme,
  typeImageUrl,
}) => {
  return (
    <div className="row-view-container">
      <div className="row-wrapper">
        <div className="image-wrapper">
          <img
            src={itemData.image_url || typeImageUrl}
            alt={`${itemData.name} image`}
          />
        </div>
        <div className="text-content">
          <h2
            style={{
              backgroundColor: getColor(colorScheme, "primary_color", "white"),
              color: getColor(colorScheme, "text_color", "black"),
            }}
          >
            {itemData.name}
          </h2>
          <p>{itemData.description}</p>
        </div>
      </div>
      {itemType === "item" && itemData?.item_id && (
        <div className="relationship-wrapper">
          <RelationshipsList itemData={itemData} />
          <NotesList itemData={itemData} />
        </div>
      )}
    </div>
  );
};

export default RowView;
