import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchWrapper from "../../lib/apiCall";

const ComboBox = ({
  placeholder,
  allOptions,
  currentOptions,
  setCurrentOptions,
}) => {
  const handleToggleOption = (option) => {
    // console.log("handle toggle option", event);
    // const option = event.target.value;

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
      <p>{placeholder}</p>
      {allOptions.map((option, index) => {
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
    // <form className="login" onSubmit={handleLogin}>
    //   <input
    //     type="email"
    //     name="email"
    //     placeholder="Email"
    //     autoComplete="email"
    //     value={email}
    //     onChange={handleSetEmail}
    //   />
    //   <input
    //     type="password"
    //     name="password"
    //     placeholder="Password"
    //     autoComplete="current-password"
    //     value={password}
    //     onChange={handleSetPassword}
    //   />
    //   <button type="submit">Login</button>
    // </form>
  );
};

export default ComboBox;
