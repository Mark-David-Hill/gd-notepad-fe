import { useState } from "react";
import fetchWrapper from "../lib/apiCall";

const GamesDisplay = ({ authToken }) => {
  // const [timerName, setTimerName] = useState("");

  // const handleSetTimerName = (event) => {
  //   setTimerName(event.target.value);
  // };

  const handleDisplayGames = () => {
    // setIsUpdatingTimer(true);

    // const body = {
    //   name: timerName,
    // };

    // if (timerName) {
    fetchWrapper
      .apiCall(`/timer`, "POST", null, authToken)
      .then((response) => console.log(response))
      .catch((error) => console.error("couldn't display games", error));
    // }
  };

  return (
    <div className="add-timer">
      {/* <input
        type="text"
        placeholder="Timer Name"
        onChange={handleSetTimerName}
      /> */}
      <button onClick={handleDisplayGames}>Display Games</button>
    </div>
  );
};

export default GamesDisplay;
