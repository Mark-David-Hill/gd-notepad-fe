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

  const handleToggleOption = (option) => {
    option === "all"
      ? currentOptions.length === allOptions.length
        ? setCurrentOptions([])
        : setCurrentOptions(allOptions)
      : setCurrentOptions((prev) =>
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
      <div className="input-icon-wrapper">
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
          onClick={() => setIsOpen((prev) => !prev)}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <FontAwesomeIcon
          icon={faAngleDown}
          onClick={() => setIsOpen((prev) => !prev)}
        />
      </div>
      {isOpen && (
        <div className="combo-box-options">
          <div
            key="select-all"
            className={"combo-box-option select-all"}
            onClick={() => handleToggleOption("all")}
          >
            {currentOptions.length === allOptions.length
              ? "Deselect All"
              : "Select All"}
          </div>
          {allOptions
            .filter((option) =>
              option
                .toLowerCase()
                .trim()
                .includes(searchText.toLowerCase().trim())
            )
            .map((option, index) => (
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
