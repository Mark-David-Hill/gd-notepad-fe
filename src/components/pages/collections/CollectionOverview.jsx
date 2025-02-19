import ItemCard from "../../item-cards/ItemCard";

export default function CollectionOverview({ collectionData, types, items }) {
  return (
    <div className="overview-wrapper">
      <div className="game-element-container">
        <ItemCard itemData={collectionData} itemType="collection" />
      </div>
    </div>
  );
}
