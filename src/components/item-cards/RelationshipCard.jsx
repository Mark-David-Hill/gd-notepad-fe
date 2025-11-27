import PropTypes from "prop-types";

const RelationshipCard = ({
  element,
  description,
  count,
  backgroundGradient,
  backgroundColor,
  headerColor,
  textColor,
}) => {
  // Determine if backgroundGradient is a CSS gradient or a plain color
  // If backgroundColor is provided, use it; otherwise fall back to backgroundGradient
  const cardBackground = backgroundColor
    ? backgroundColor
    : backgroundGradient?.includes("gradient")
    ? backgroundGradient
    : backgroundGradient || "#e6f2ff";

  return (
    <div
      style={{
        background: cardBackground,
        border: `1px solid ${textColor || "#1e40af"}`,
        borderRadius: "5px",
        padding: "0",
        margin: "4px",
        boxShadow: `0 2px 8px rgba(0, 0, 0, 0.1)`,
        overflow: "hidden",
        width: "120px",
        height: "100px",
      }}
    >
      {/* Header section with darker color */}
      {headerColor && (
        <div
          style={{
            background: headerColor,
            padding: "3px 5px",
            color: "white",
            textAlign: "center",
          }}
        >
          <h4
            style={{
              margin: 0,
              color: "white",
              fontSize: "11px",
              fontWeight: "normal",
              lineHeight: "1.3",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {element.name}
          </h4>
        </div>
      )}

      {/* Main content section */}
      <div
        style={{
          padding: "5px",
          height: headerColor ? "calc(100% - 25px)" : "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!headerColor && (
          <div
            style={{
              fontSize: "11px",
              textAlign: "center",
              marginBottom: "3px",
              color: textColor || "#1e40af",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            {element.name}
          </div>
        )}
        <img
          src={element.image_url}
          alt={element.name}
          style={{ maxWidth: "50px", maxHeight: "50px", objectFit: "contain" }}
        />
        {count !== 0 && (
          <div
            style={{
              fontSize: "11px",
              marginTop: "2px",
              color: textColor || "#1e40af",
            }}
          >
            x{count}
          </div>
        )}
      </div>
    </div>
  );
};

RelationshipCard.propTypes = {
  element: PropTypes.object.isRequired,
  description: PropTypes.string,
  count: PropTypes.number,
  backgroundGradient: PropTypes.string,
  backgroundColor: PropTypes.string,
  headerColor: PropTypes.string,
  textColor: PropTypes.string,
};

export default RelationshipCard;
