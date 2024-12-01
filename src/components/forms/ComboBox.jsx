import { useEffect, useState, useRef } from "react";

const ComboBox = ({
  placeholder,
  allOptions,
  currentOptions,
  setCurrentOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const comboBoxRef = useRef(null);

  const handleToggleOption = (option) => {
    setCurrentOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (comboBoxRef.current && !comboBoxRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="combo-box-container" ref={comboBoxRef}>
      <input
        type="text"
        placeholder={`${currentOptions.length} ${placeholder} selected`}
        value={searchText}
        onClick={() => setIsOpen((prev) => !prev)}
        onChange={(e) => setSearchText(e.target.value)}
      />
      {isOpen && (
        <div className="combo-box-options">
          {allOptions.map((option, index) => (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default ComboBox;
