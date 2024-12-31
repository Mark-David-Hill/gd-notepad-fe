import { useState } from "react";

import CardTitleSection from "./CardTitleSection";
import NotesList from "./NotesList";

const GameCard = ({ gameData, viewType = "card" }) => {
  const [shouldDisplayElement, setShouldDisplayElement] = useState(true);

  return (
    gameData && (
      <div
        className={
          "card-container " +
          viewType +
          `${!shouldDisplayElement ? " hide" : ""}`
        }
      >
        <div className="card-content-wrapper">
          <CardTitleSection elementData={gameData} />
        </div>
      </div>
    )
  );
};

export default GameCard;
