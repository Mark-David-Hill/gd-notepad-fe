import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

const ComboBox = ({
  placeholder,
  allOptions,
  currentOptions,
  setCurrentOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const comboBoxRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleToggleOption = (option) => {
    if (option === "all") {
      setCurrentOptions(
        currentOptions.length === allOptions.length ? [] : allOptions
      );
    } else {
      setCurrentOptions((prev) =>
        prev.includes(option)
          ? prev.filter((item) => item !== option)
          : [...prev, option]
      );
    }
  };

  const filteredOptions = allOptions.filter((option) =>
    option.toLowerCase().includes(searchText.toLowerCase().trim())
  );

  const handleOutsideClick = (event) => {
    if (comboBoxRef.current && !comboBoxRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="combo-box-container" ref={comboBoxRef}>
      <div className="input-icon-wrapper" onClick={toggleDropdown}>
        <input
          type="text"
          placeholder={
            currentOptions.length === 0
              ? `Select ${placeholder}`
              : currentOptions.length === 1
              ? currentOptions[0]
              : `${currentOptions.length} ${placeholder} selected`
          }
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <FontAwesomeIcon icon={faAngleDown} />
      </div>
      {isOpen && (
        <div className="combo-box-options">
          <div
            className={`combo-box-option select-all`}
            onClick={() => handleToggleOption("all")}
          >
            {currentOptions.length === allOptions.length
              ? "Deselect All"
              : "Select All"}
          </div>
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className={`combo-box-option ${
                currentOptions.includes(option) ? "selected" : ""
              }`}
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
