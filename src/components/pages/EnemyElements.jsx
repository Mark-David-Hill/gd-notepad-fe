import { useState } from "react";
import fetchWrapper from "../../lib/apiCall";

const EnemyElements = () => {
  const [enemiesList, setEnemiesList] = useState(null);

  const handleDisplayEnemies = () => {
    fetchWrapper
      .apiCall(`/elements`, "GET")
      .then((response) =>
        setEnemiesList(
          response.results.filter(
            (element) => element.type.name == "Enemy Element"
          )
        )
      )
      .catch((error) =>
        console.error("couldn't display enemy elements", error)
      );
  };

  return (
    <div className="enemy-elements">
      <h1>Enemy Elements</h1>
      <div>
        <button onClick={handleDisplayEnemies}>Display Enemy Elements</button>
      </div>
      <div>
        <div className="timers-list-wrapper">
          {enemiesList &&
            enemiesList.map((levelData, levelId) => {
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

export default EnemyElements;
