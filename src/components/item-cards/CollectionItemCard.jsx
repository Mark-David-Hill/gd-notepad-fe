import PropTypes from "prop-types";
import ItemCard from "./ItemCard";

const CollectionItemCard = ({
  itemData,
  setItems,
  colorScheme,
  typeImageUrl,
  pageRoute,
  viewType = "card",
  types,
}) => {
  if (!itemData) return null;

  return (
    <ItemCard
      itemData={itemData}
      setItems={setItems}
      itemType={"item"}
      pageRoute={pageRoute}
      colorScheme={colorScheme}
      typeImageUrl={typeImageUrl}
      viewType={viewType}
      types={types}
    />
  );
};

CollectionItemCard.propTypes = {
  itemData: PropTypes.object.isRequired,
  setItems: PropTypes.func.isRequired,
  colorScheme: PropTypes.object,
  typeImageUrl: PropTypes.string,
  pageRoute: PropTypes.string,
  viewType: PropTypes.string,
  types: PropTypes.array,
};

export default CollectionItemCard;
