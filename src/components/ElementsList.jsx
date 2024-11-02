import ElementCard from "./ElementCard";

const ElementsList = ({ elementsList, viewType }) => {
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
              viewType={viewType}
            />
          );
        })
      )}
    </div>
  );
};

export default ElementsList;
