import { useState, useContext } from "react";

import ElementsDisplay from "../game-elements/ElementsDisplay";
import AddElementForm from "../forms/AddElementForm";

import { GamesContext } from "../context/GamesContextProvider";

const GameElements = () => {
  const { gameElements, setGameElements, games, types } =
    useContext(GamesContext);

  return (
    <div className="game-elements-container">
      <h1>Game Elements</h1>

      <AddElementForm
        setElementsList={setGameElements}
        gamesList={games}
        typesList={types}
      />

      <ElementsDisplay />
    </div>
  );
};

export default GameElements;
