const RelationshipCard = ({
  element,
  description,
  count,
  backgroundGradient,
  textColor,
}) => {
  // Debug logging
  console.log("RelationshipCard received colors:", {
    backgroundGradient,
    textColor,
    element: element.name,
  });

  return (
    <div
      className="relationship-wrapper"
      style={{
        background:
          backgroundGradient ||
          "linear-gradient(135deg, #f0f4ff 0%, #e6f2ff 100%)",
        color: textColor || "#1e40af",
        border: `1px solid ${textColor || "#1e40af"}`,
        borderRadius: "8px",
        padding: "8px",
        margin: "4px",
        boxShadow: `0 2px 8px rgba(0, 0, 0, 0.1)`,
      }}
    >
      <div className="name-image-wrapper">
        <h4 className="relationship-name">
          {element.name.length > 17
            ? element.name.slice(0, 17 - 3) + "..."
            : element.name}
        </h4>
        <img
          src={element.image_url}
          alt={element.name}
          style={{ width: "100px" }}
        />
      </div>
      <p className="relationship-description">{description}</p>
      {count !== 0 && <h4>x{count}</h4>}
    </div>
  );
};

export default RelationshipCard;
