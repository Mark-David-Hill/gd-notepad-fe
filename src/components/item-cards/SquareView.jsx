import { getColor } from "../../util/getColor";

const SquareView = ({ itemData, colorScheme, typeImageUrl }) => {
  return (
    <div className="square-view-container">
      <div
        className="title-wrapper"
        style={{
          backgroundColor: getColor(colorScheme, "primary_color", "white"),
        }}
      >
        <h2 style={{ color: getColor(colorScheme, "text_color", "black") }}>
          {itemData.name}
        </h2>
      </div>
      <div className="image-wrapper">
        <img
          src={itemData.image_url || typeImageUrl}
          alt={`${itemData.name} image`}
        />
      </div>
    </div>
  );
};

export default SquareView;
