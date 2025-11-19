import React, { useMemo } from "react";
import PropTypes from "prop-types";

import SquareView from "./SquareView";
import CardView from "./CardView";
import PageView from "./PageView";
import RowView from "./RowView";
import ExternalRowView from "./ExternalRowView";

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
  types,
  isExternal = false,
  relationships = [],
  items = [],
  colorSchemes = [],
}) => {
  if (!itemData) return null;

  const ViewComponent =
    isExternal && viewType === "row"
      ? ExternalRowView
      : viewComponents[viewType] || null;
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
      types,
      ...(isExternal &&
        viewType === "row" && {
          relationships,
          items,
          colorSchemes,
        }),
    }),
    [
      itemData,
      itemType,
      pageRoute,
      colorScheme,
      typeImageUrl,
      setItems,
      viewType,
      types,
      isExternal,
      relationships,
      items,
      colorSchemes,
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

ItemCard.propTypes = {
  viewType: PropTypes.string,
  setItems: PropTypes.func,
  itemType: PropTypes.string.isRequired,
  pageRoute: PropTypes.string,
  colorScheme: PropTypes.object,
  typeImageUrl: PropTypes.string,
  itemData: PropTypes.object.isRequired,
  types: PropTypes.array,
  isExternal: PropTypes.bool,
  relationships: PropTypes.array,
  items: PropTypes.array,
  colorSchemes: PropTypes.array,
};

export default ItemCard;
