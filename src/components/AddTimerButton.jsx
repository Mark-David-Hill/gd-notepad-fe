import { useState } from "react";
import fetchWrapper from "../lib/apiCall";

const AddTimerButton = ({ setIsUpdatingTimer, authToken }) => {
  const [timerName, setTimerName] = useState("");

  const handleSetTimerName = (event) => {
    setTimerName(event.target.value);
  };

  const handleAddTimer = () => {
    setIsUpdatingTimer(true);

    const body = {
      name: timerName,
    };

    if (timerName) {
      fetchWrapper
        .apiCall(`/timer`, "POST", body, authToken)
        .then(() => setIsUpdatingTimer(false))
        .catch((error) => console.error("couldn't create timer", error));
    }
  };

  return (
    <div className="add-timer">
      <input
        type="text"
        placeholder="Timer Name"
        onChange={handleSetTimerName}
      />
      <button onClick={handleAddTimer}>Add Timer</button>
    </div>
  );
};

export default AddTimerButton;
