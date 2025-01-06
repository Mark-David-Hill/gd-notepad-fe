import RelationshipsList from "./RelationshipsList";
import CardTitleSection from "./CardTitleSection";
import NotesList from "./NotesList";

const ItemCard = ({
  itemData,
  itemType,
  fetchRoute,
  pageRoute,
  viewType = "card",
}) => {
  return (
    itemData && (
      <div className={"card-container " + viewType}>
        <div className="card-content-wrapper">
          <CardTitleSection
            itemData={itemData}
            itemType={itemType}
            pageRoute={pageRoute}
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
