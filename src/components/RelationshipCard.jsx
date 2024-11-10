const RelationshipCard = ({ element, description, count }) => {
  return (
    <div className="relationship-wrapper">
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
