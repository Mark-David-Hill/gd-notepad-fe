import { useEffect, useState } from "react";

const ComboBox = ({
  placeholder,
  allOptions,
  currentOptions,
  setCurrentOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOption = (option) => {
    setCurrentOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  useEffect(() => {
    console.log("all options", allOptions);
  }, []);

  return (
    <div className="combo-box-container">
      <p onClick={() => setIsOpen((prev) => !prev)}>{placeholder}</p>
      {isOpen &&
        allOptions.map((option, index) => {
          return (
            <div
              key={index}
              value={option}
              className={
                "combo-box-option " +
                (currentOptions.includes(option) ? "selected" : "")
              }
              onClick={() => handleToggleOption(option)}
            >
              {option}
            </div>
          );
        })}
    </div>
  );
};

export default ComboBox;
