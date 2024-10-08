import { useState } from "react";
import fetchWrapper from "../../lib/apiCall";

const Levels = () => {
  const [levelsList, setLevelsList] = useState(null);

  const handleDisplayLevels = () => {
    fetchWrapper
      .apiCall(`/elements`, "GET")
      .then((response) =>
        setLevelsList(
          response.results.filter((element) => element.type.name == "Level")
        )
      )
      .catch((error) => console.error("couldn't display levels", error));
  };

  return (
    <div className="levels">
      <h1>Levels</h1>
      <div>
        <button onClick={handleDisplayLevels}>Display Levels</button>
      </div>
      <div>
        <div className="timers-list-wrapper">
          {levelsList &&
            levelsList.map((levelData, levelId) => {
              return (
                <div key={levelId}>
                  <h2>{levelData.name}</h2>
                  <p>{levelData.description}</p>
                  <img
                    src={levelData.image_url}
                    alt={levelData.name + " image"}
                    style={{ width: "200px" }}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Levels;
