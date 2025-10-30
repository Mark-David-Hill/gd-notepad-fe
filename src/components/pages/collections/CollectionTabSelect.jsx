const CollectionTabSelect = ({ currentTab, setCurrentTab }) => {
  return (
    <div className="view-select-wrapper">
      <button
        className={currentTab === "items" ? "selected" : ""}
        onClick={() => setCurrentTab("items")}
      >
        Items
      </button>

      <button
        className={currentTab === "types" ? "selected" : ""}
        onClick={() => setCurrentTab("types")}
      >
        Types
      </button>

      <button
        className={currentTab === "notes" ? "selected" : ""}
        onClick={() => setCurrentTab("notes")}
      >
        Notes
      </button>
    </div>
  );
};

export default CollectionTabSelect;
