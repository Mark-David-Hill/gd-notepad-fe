import ItemCard from "./ItemCard";

const CollectionItemCard = ({
  itemData,
  setItems,
  colorScheme,
  typeImageUrl,
  pageRoute,
  viewType = "card",
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
    />
  );
};

export default CollectionItemCard;
