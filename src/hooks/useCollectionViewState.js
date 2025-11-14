import { useEffect, useState } from "react";

const useCollectionViewState = (types = []) => {
  const [viewType, setViewType] = useState("square");
  const [selectedElements, setSelectedElements] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("items");

  useEffect(() => {
    if (types && types.length > 0) {
      const typeNames = types.map((type) => type.name);

      setSelectedTypes((prevSelected) => {
        if (
          prevSelected.length === typeNames.length &&
          prevSelected.every((name) => typeNames.includes(name))
        ) {
          return prevSelected;
        }

        return typeNames;
      });
    }
  }, [types]);

  return {
    viewType,
    setViewType,
    selectedElements,
    setSelectedElements,
    selectedTypes,
    setSelectedTypes,
    searchTerm,
    setSearchTerm,
    currentTab,
    setCurrentTab,
  };
};

export default useCollectionViewState;

