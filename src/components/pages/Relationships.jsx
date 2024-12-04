import { useState, useEffect } from "react";

import ElementsDisplay from "../game-elements/ElementsDisplay";
import fetchWrapper from "../../lib/apiCall";

import ComboBox from "../forms/ComboBox";

const Relationships = () => {
  const [elementsList, setElementsList] = useState([]);
  const [selectedElements, setSelectedElements] = useState([]);
  const [relationshipsList, setRelationshipsList] = useState([]);
  const [allElementNames, setAllElementNames] = useState([]);
  const [gamesList, setGamesList] = useState([]);
  const [typesList, setTypesList] = useState([]);
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    fetchWrapper
      .apiCall(`/elements`, "GET")
      .then((response) => {
        setElementsList(response.results);
        //   elementType === "all"
        //     ? response.results
        //     : response.results.filter(
        //         (element) => element.type.name === elementType
        //       )
        // );

        // setSelectedElements(response.results.map((game) => game.name));
        setAllElementNames(response.results.map((element) => element.name));
      })
      .catch((error) => console.error(`couldn't get ${elementType}s`, error));

    fetchWrapper
      .apiCall(`/relationships`, "GET")
      .then((response) => {
        setRelationshipsList(response.results);
      })
      .catch((error) =>
        console.error(`couldn't get relationships for game elements`, error)
      );
  }, []);

  // useEffect(() => {
  //   fetchWrapper
  //     .apiCall(`/games`, "GET")
  //     .then((response) => {
  //       setGamesList(response.results);
  //     })
  //     .catch((error) => console.error(`Couldn't get games`, error));

  //   fetchWrapper
  //     .apiCall(`/types`, "GET")
  //     .then((response) => {
  //       setTypesList(response.results);
  //     })
  //     .catch((error) => console.error(`Couldn't get type data`, error));
  // }, []);

  return true ? (
    <div className="relationships-container">
      <h1>Game Element Relationships</h1>

      <div className="elements-select-container">
        <p>Element 1</p>
        {allElementNames.length > 0 && (
          <ComboBox
            placeholder="Elements"
            allOptions={allElementNames}
            currentOptions={selectedElements}
            setCurrentOptions={setSelectedElements}
          />
        )}
      </div>
      <input placeholder="Search..." />
      <div className="Elements List">
        <h2>Elements Display</h2>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Relationships;
