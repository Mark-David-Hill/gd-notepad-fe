import PropTypes from "prop-types";

import { useItemNavigation } from "../../hooks/useItemActions";
import { getColor } from "../../util/getColor";

const SquareView = ({ itemData, pageRoute, colorScheme, id }) => {
  const onNavigate = useItemNavigation(pageRoute, id);

  return (
    <div className="square-view-container" onClick={onNavigate}>
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
        <img src={itemData.image_url} alt={`${itemData.name} image`} />
      </div>
    </div>
  );
};

SquareView.propTypes = {
  itemData: PropTypes.object.isRequired,
  pageRoute: PropTypes.string,
  colorScheme: PropTypes.object,
  id: PropTypes.string.isRequired,
};

export default SquareView;
