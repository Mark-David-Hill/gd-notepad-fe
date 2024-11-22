export default function CategoryFilter(props) {
  const {
    categoriesList,
    currentCategories,
    setCurrentCategories,
    viewType = "page",
    useCheckboxes = false,
  } = props;

  const updateCategories = (selectedCategory) => {
    if (currentCategories.includes(selectedCategory)) {
      setCurrentCategories((prevCategories) =>
        prevCategories.filter((category) => category !== selectedCategory)
      );
    } else {
      setCurrentCategories((prevCategories) => [
        ...prevCategories,
        selectedCategory,
      ]);
    }
  };

  const handleSetCategory = (selectedCategory) => {
    if (selectedCategory === "all") {
      setCurrentCategories(categoriesList);
    } else {
      setCurrentCategories([selectedCategory]);
    }
  };

  return (
    <div
      className={`category-filter ${
        viewType === "row" || viewType === "page" ? "row" : ""
      }`}
    >
      <p>Relationship Types to Display:</p>
      {!useCheckboxes && (
        <button
          className={`${
            currentCategories.length === categoriesList.length ? "selected" : ""
          }`}
          onClick={() => handleSetCategory("all")}
        >
          All Types
        </button>
      )}
      {categoriesList.map((category, index) => {
        return (
          <div key={index}>
            {useCheckboxes ? (
              <>
                <input
                  type="checkbox"
                  id={`category${index}`}
                  name={`category${index}`}
                  value={category}
                  checked={currentCategories.includes(category)}
                  onChange={() => updateCategories(category)}
                />
                <label htmlFor={`category${index}`}>{category}</label>
              </>
            ) : (
              <button
                className={`${
                  currentCategories.length === categoriesList.length
                    ? ""
                    : currentCategories.includes(category)
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleSetCategory(category)}
              >
                {category}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
