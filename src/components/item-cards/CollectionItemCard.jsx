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

export default CollectionItemCard;
