import RelationshipsList from "./RelationshipsList";
import CardTitleSection from "./CardTitleSection";
import NotesList from "./NotesList";

const ElementCard = ({
  relationshipsList,
  elementData,
  typesList,
  currentCategories,
  viewType = "card",
}) => {
  console.log("current categories", currentCategories);

  return (
    elementData &&
    relationshipsList && (
      <div className={"card-container " + viewType}>
        <div className="card-content-wrapper">
          <CardTitleSection elementData={elementData} />
          <div className="relationships-notes-wrapper">
            <RelationshipsList
              elementData={elementData}
              relationshipsList={relationshipsList}
              typesList={typesList}
              currentCategories={currentCategories}
            />
            <NotesList elementData={elementData} />
          </div>
        </div>
      </div>
    )
  );
};

export default ElementCard;
