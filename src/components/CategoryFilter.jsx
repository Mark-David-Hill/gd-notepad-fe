export default function CategoryFilter(props) {
  const { categoriesList, currentCategories, setCurrentCategories } = props;

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

  return (
    <div className="category-filter">
      <p>Categories:</p>
      {categoriesList.map((category, index) => {
        return (
          <div key={index}>
            <input
              type="checkbox"
              id={`category${index}`}
              name={`category${index}`}
              value={category}
              checked={currentCategories.includes(category)}
              onChange={() => updateCategories(category)}
            />
            <label htmlFor={`category${index}`}>{category}</label>
          </div>
        );
      })}
    </div>
  );
}
