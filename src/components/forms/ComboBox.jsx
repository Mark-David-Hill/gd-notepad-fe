import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faTimes } from "@fortawesome/free-solid-svg-icons";

const ComboBox = ({
  placeholder,
  allOptions,
  currentOptions,
  setCurrentOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const comboBoxRef = useRef(null);
  const optionRefs = useRef([]);

  const toggleDropdown = (forceOpen) => {
    setIsOpen((prev) => (typeof forceOpen === "boolean" ? forceOpen : !prev));
    if (!isOpen) {
      setFocusedIndex(-1);
    }
  };

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
      toggleDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleKeyDown = (event) => {
    const totalOptions = filteredOptions.length + (searchText === "" ? 1 : 0);

    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
        if (!isOpen) {
          event.preventDefault();
          toggleDropdown(true);
          setFocusedIndex(-1);
          return;
        }
        event.preventDefault();
        setFocusedIndex((prevIndex) => {
          const direction = event.key === "ArrowDown" ? 1 : -1;
          const nextIndex =
            (prevIndex + direction + totalOptions) % totalOptions;
          scrollToOption(nextIndex);
          return nextIndex;
        });
        break;

      case "Enter":
        if (isOpen) {
          event.preventDefault();
          if (focusedIndex === 0 && searchText === "") {
            handleToggleOption("all");
          } else if (focusedIndex >= (searchText === "" ? 1 : 0)) {
            const selectedOption =
              filteredOptions[focusedIndex - (searchText === "" ? 1 : 0)];
            handleToggleOption(selectedOption);
          }
        }
        break;

      case "Escape":
        if (isOpen) {
          event.preventDefault();
          toggleDropdown(false);
          setSearchText("");
        }
        break;

      default:
        break;
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = (event) => {
    if (!comboBoxRef.current.contains(event.relatedTarget)) {
      toggleDropdown(false);
      setSearchText("");
    }
  };

  const handleClearInput = () => {
    setSearchText("");
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const scrollToOption = (index) => {
    if (optionRefs.current[index]) {
      requestAnimationFrame(() => {
        optionRefs.current[index].scrollIntoView({
          behavior: "auto",
          block: "nearest",
        });
      });
    }
  };

  return (
    <div
      className="combo-box-container"
      ref={comboBoxRef}
      tabIndex={0}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <div className="input-wrapper">
        <input
          onClick={() => toggleDropdown(true)}
          type="text"
          placeholder={
            currentOptions.length === 0
              ? `Select ${placeholder}`
              : currentOptions.length === 1
              ? currentOptions[0]
              : `${currentOptions.length} ${placeholder} selected`
          }
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            if (!isOpen) toggleDropdown(true);
            setFocusedIndex(-1);
          }}
        />
        <FontAwesomeIcon
          icon={searchText ? faTimes : faAngleDown}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation();
            if (searchText) {
              handleClearInput();
            } else {
              toggleDropdown();
            }
          }}
        />
      </div>
      {isOpen && (
        <div className="combo-box-options">
          {searchText === "" && (
            <div
              ref={(el) => (optionRefs.current[0] = el)}
              className={`combo-box-option select-all ${
                focusedIndex === 0 ? "focused" : ""
              }`}
              onClick={() => handleToggleOption("all")}
            >
              {currentOptions.length === allOptions.length
                ? "Deselect All"
                : "Select All"}
            </div>
          )}

          {filteredOptions.length === 0 ? (
            <div className="combo-box-option no-results">No results</div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                ref={(el) =>
                  (optionRefs.current[index + (searchText === "" ? 1 : 0)] = el)
                }
                className={`combo-box-option ${
                  currentOptions.includes(option) ? "selected" : ""
                } ${
                  focusedIndex === index + (searchText === "" ? 1 : 0)
                    ? "focused"
                    : ""
                }`}
                onClick={() => handleToggleOption(option)}
              >
                {option}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ComboBox;
