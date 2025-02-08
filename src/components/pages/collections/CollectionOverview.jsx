import ItemCard from "../../item-cards/ItemCard";

export default function CollectionOverview({ collectionData, types, items }) {
  return (
    <div className="overview-wrapper">
      <div className="game-element-container">
        <ItemCard itemData={collectionData} itemType="collection" />
      </div>
      <div className="items-container">
        <h2>Types</h2>
        <div className="items-wrapper">
          {types
            .filter((type, index) => index < 3)
            .map((type) => (
              <ItemCard
                key={type.type_id}
                itemData={type}
                itemType={"type"}
                viewType="square"
                colorScheme={type.color_scheme}
              />
            ))}
        </div>
      </div>

      <div className="items-container">
        <h2>Items</h2>
        <div className="items-wrapper">
          {items
            .filter((item, index) => index < 3)
            .map((item) => (
              <ItemCard
                key={item.item_id}
                itemData={item}
                itemType={"element"}
                viewType="square"
                colorScheme={item.type.color_scheme}
                typeImageUrl={item.type.image_url}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
