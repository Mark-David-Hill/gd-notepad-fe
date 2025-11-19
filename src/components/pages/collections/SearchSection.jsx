import PropTypes from "prop-types";
import ViewSelect from "../../forms/ViewSelect";
import ComboBox from "../../forms/ComboBox";

const SearchSection = ({
  className = "search-section",
  types,
  viewType,
  setViewType,
  selectedElements,
  setSelectedElements,
  selectedTypes,
  setSelectedTypes,
  searchTerm,
  setSearchTerm,
  allItems,
  showRelatedOptions = true,
}) => {
  return (
    <div className={className}>
      <input
        className="search-box"
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {types?.length > 0 && (
        <ComboBox
          placeholder="Types"
          allOptions={types.map((type) => type.name)}
          currentOptions={selectedTypes}
          setCurrentOptions={setSelectedTypes}
        />
      )}

      {showRelatedOptions && allItems?.length > 0 && (
        <ComboBox
          placeholder="Related Elements"
          allOptions={allItems.map((element) => element.name)}
          currentOptions={selectedElements}
          setCurrentOptions={setSelectedElements}
        />
      )}

      <ViewSelect viewType={viewType} setViewType={setViewType} />
    </div>
  );
};

SearchSection.propTypes = {
  className: PropTypes.string,
  types: PropTypes.array,
  viewType: PropTypes.string.isRequired,
  setViewType: PropTypes.func.isRequired,
  selectedElements: PropTypes.array.isRequired,
  setSelectedElements: PropTypes.func.isRequired,
  selectedTypes: PropTypes.array.isRequired,
  setSelectedTypes: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  allItems: PropTypes.array,
  showRelatedOptions: PropTypes.bool,
};

export default SearchSection;
