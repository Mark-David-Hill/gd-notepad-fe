const CollectionTabSelect = ({ currentTab, setCurrentTab }) => {
  return (
    <div className="view-select-wrapper">
      <button
        className={currentTab === "overview" ? "selected" : ""}
        onClick={() => setCurrentTab("overview")}
      >
        Overview
      </button>

      <button
        className={currentTab === "types" ? "selected" : ""}
        onClick={() => setCurrentTab("types")}
      >
        Types
      </button>

      <button
        className={currentTab === "items" ? "selected" : ""}
        onClick={() => setCurrentTab("items")}
      >
        Items
      </button>
    </div>
  );
};

export default CollectionTabSelect;
