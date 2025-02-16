import { useNavigate } from "react-router-dom";

import { getColor } from "../../util/getColor";

const SquareView = ({
  itemData,
  pageRoute,
  itemType,
  colorScheme,
  typeImageUrl,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className="square-view-container"
      onClick={() => {
        navigate(`/${pageRoute}/${itemData[`${itemType}_id`]}`);
      }}
    >
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
