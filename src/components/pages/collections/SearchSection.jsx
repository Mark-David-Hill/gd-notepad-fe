import { useEffect } from "react";

import ViewSelect from "../../forms/ViewSelect";
import ComboBox from "../../forms/ComboBox";

const SearchSection = ({
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
}) => {
  useEffect(() => {
    if (types) {
      setSelectedTypes(types.map((type) => type.name));
    }
  }, []);

  return allItems.length > 0 && types ? (
    <div className="search-section">
      <input
        className="search-box"
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {types.length > 0 && (
        <ComboBox
          placeholder="Types"
          allOptions={types.map((type) => type.name)}
          currentOptions={selectedTypes}
          setCurrentOptions={setSelectedTypes}
        />
      )}

      {types.length > 0 && (
        <ComboBox
          placeholder="Related Elements"
          allOptions={allItems.map((element) => element.name)}
          currentOptions={selectedElements}
          setCurrentOptions={setSelectedElements}
        />
      )}

      <ViewSelect viewType={viewType} setViewType={setViewType} />
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default SearchSection;
