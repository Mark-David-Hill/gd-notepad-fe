import RelationshipsList from "./RelationshipsList";
import CardTitleSection from "./CardTitleSection";
import NotesList from "./NotesList";

const ItemCard = ({ itemData, itemType, pageRoute, viewType = "card" }) => {
  function lightenHexColor(hex, percent) {
    // Remove the hash if it exists
    hex = hex.replace("#", "");

    // Parse the r, g, b values from the hex string
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate the new RGB values
    const lighten = (value) =>
      Math.min(255, Math.floor(value + (255 - value) * (percent / 100)));

    const newR = lighten(r);
    const newG = lighten(g);
    const newB = lighten(b);

    // Convert back to hex
    const toHex = (value) => value.toString(16).padStart(2, "0");
    return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
  }

  return (
    itemData && (
      <div
        className={"card-container " + viewType}
        style={{
          border: `1px solid ${
            itemData?.type?.color
              ? itemData.type.color
              : itemData?.color
              ? itemData.color
              : "black"
          }`,
          backgroundColor: `${
            itemData?.type?.color
              ? lightenHexColor(itemData.type.color, 90)
              : itemData?.color
              ? lightenHexColor(itemData.color, 90)
              : "rgb(198, 255, 237)"
          }`,
        }}
      >
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
