import SquareView from "./SquareView";
import CardView from "./CardView";
import RowView from "./RowView";

import { getColor } from "../../util/getColor";

const ItemCard = ({
  itemData,
  itemType,
  pageRoute,
  colorScheme,
  typeImageUrl,
  viewType = "card",
}) => {
  if (!itemData) return null;

  return (
    <div
      className={`item-card-container ${viewType}`}
      style={{
        border: `1px solid ${getColor(
          colorScheme,
          "secondary_color",
          "black"
        )}`,
        backgroundColor: getColor(
          colorScheme,
          "background_color",
          "rgb(198, 255, 237)"
        ),
      }}
    >
      {viewType === "square" ? (
        <SquareView
          itemData={itemData}
          colorScheme={colorScheme}
          typeImageUrl={typeImageUrl}
        />
      ) : viewType === "card" ? (
        <CardView
          itemData={itemData}
          itemType={itemType}
          pageRoute={pageRoute}
          colorScheme={colorScheme}
          typeImageUrl={typeImageUrl}
        />
      ) : (
        <RowView
          itemData={itemData}
          itemType={itemType}
          pageRoute={pageRoute}
          colorScheme={colorScheme}
          typeImageUrl={typeImageUrl}
        />
      )}
    </div>
  );
};

export default ItemCard;
