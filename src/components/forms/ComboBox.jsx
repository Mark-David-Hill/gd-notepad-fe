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

  let scrollTimeout;

  const handleKeyDown = (event) => {
    if (!isOpen) return;

    const totalOptions = filteredOptions.length + 1;

    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        scrollTimeout = setTimeout(() => {
          setFocusedIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % totalOptions;
            scrollToOption(nextIndex);
            return nextIndex;
          });
        }, 50);
        break;

      case "ArrowUp":
        event.preventDefault();
        scrollTimeout = setTimeout(() => {
          setFocusedIndex((prevIndex) => {
            const nextIndex = (prevIndex - 1 + totalOptions) % totalOptions;
            scrollToOption(nextIndex);
            return nextIndex;
          });
        }, 50);
        break;

      case "Enter":
        event.preventDefault();
        if (focusedIndex === 0) {
          handleToggleOption("all");
        } else if (focusedIndex > 0) {
          const selectedOption = filteredOptions[focusedIndex - 1];
          handleToggleOption(selectedOption);
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
    }
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
      <div className="input-icon-wrapper" onClick={() => toggleDropdown(true)}>
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
          onChange={(e) => {
            setSearchText(e.target.value);
            setIsOpen(true);
            setFocusedIndex(-1);
          }}
        />
        <FontAwesomeIcon icon={faAngleDown} />
      </div>
      {isOpen && (
        <div className="combo-box-options">
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
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              ref={(el) => (optionRefs.current[index + 1] = el)}
              className={`combo-box-option ${
                currentOptions.includes(option) ? "selected" : ""
              } ${focusedIndex === index + 1 ? "focused" : ""}`}
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
