import RelationshipsList from "./RelationshipsList";
import CardTitleSection from "./CardTitleSection";
import NotesList from "./NotesList";

const ElementCard = ({
  relationshipsList,
  elementData,
  typesList,
  viewType = "card",
}) => {
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
            />
            <NotesList elementData={elementData} />
          </div>
        </div>
      </div>
    )
  );
};

export default ElementCard;
