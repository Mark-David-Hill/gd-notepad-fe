import ElementCard from "./ElementCard";

const ElementsList = ({ elementsList }) => {
  return (
    <div className="game-elements-list-wrapper">
      {!elementsList.length ? (
        <p>Loading...</p>
      ) : (
        elementsList.map((elementData, elementId) => {
          return (
            <ElementCard
              key={elementId}
              elementData={elementData}
              elementId={elementId}
              viewType="card"
            />
          );
        })
      )}
    </div>
  );
};

export default ElementsList;
