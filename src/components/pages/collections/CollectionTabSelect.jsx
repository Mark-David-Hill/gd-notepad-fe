import PropTypes from "prop-types";

const DEFAULT_TABS = [
  { id: "items", label: "Items" },
  { id: "types", label: "Types" },
  { id: "notes", label: "Notes" },
];

const CollectionTabSelect = ({
  currentTab,
  setCurrentTab,
  className = "view-select-wrapper",
  tabs = DEFAULT_TABS,
}) => (
  <div className={className}>
    {tabs.map((tab) => (
      <button
        key={tab.id}
        className={currentTab === tab.id ? "selected" : ""}
        onClick={() => setCurrentTab(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

CollectionTabSelect.propTypes = {
  currentTab: PropTypes.string.isRequired,
  setCurrentTab: PropTypes.func.isRequired,
  className: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
};

export default CollectionTabSelect;
