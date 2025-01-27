import RelationshipsList from "./RelationshipsList";
import CardTitleSection from "./CardTitleSection";
import NotesList from "./NotesList";

const ItemCard = ({
  itemData,
  itemType,
  pageRoute,
  colorScheme,
  viewType = "card",
}) => {
  return (
    itemData && (
      <div
        className={"card-container " + viewType}
        style={{
          border: `1px solid ${
            colorScheme ? colorScheme.secondary_color : "black"
          }`,
          backgroundColor: `${
            colorScheme ? colorScheme.background_color : "rgb(198, 255, 237)"
          }`,
        }}
      >
        <div className="card-content-wrapper">
          <CardTitleSection
            itemData={itemData}
            itemType={itemType}
            pageRoute={pageRoute}
            colorScheme={colorScheme}
          />
          {itemType === "item" && itemData?.item_id && (
            <div className="relationships-notes-wrapper">
              <RelationshipsList itemData={itemData} />
              <NotesList itemData={itemData} />
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default ItemCard;
