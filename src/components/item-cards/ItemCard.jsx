import React, { useMemo } from "react";

import SquareView from "./SquareView";
import CardView from "./CardView";
import PageView from "./PageView";
import RowView from "./RowView";

import { getCardStyles } from "../../util/getCardStyles";

const viewComponents = {
  square: SquareView,
  card: CardView,
  add: CardView,
  row: RowView,
  page: PageView,
};

const ItemCard = ({
  viewType = "card",
  setItems,
  itemType,
  pageRoute,
  colorScheme,
  typeImageUrl,
  itemData,
}) => {
  if (!itemData) return null;

  const ViewComponent = viewComponents[viewType] || null;
  const id = itemData[`${itemType}_id`];

  const sharedProps = useMemo(
    () => ({
      itemData,
      itemType,
      pageRoute,
      colorScheme,
      typeImageUrl,
      setItems,
      id,
      isEditable: viewType === "card",
      isAddView: viewType === "add",
    }),
    [
      itemData,
      itemType,
      pageRoute,
      colorScheme,
      typeImageUrl,
      setItems,
      viewType,
    ]
  );

  return (
    <div
      className={`item-card-container ${viewType}`}
      style={getCardStyles(colorScheme)}
    >
      {ViewComponent ? <ViewComponent {...sharedProps} /> : null}
    </div>
  );
};

export default ItemCard;
