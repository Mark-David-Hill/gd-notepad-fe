import { useState } from "react";

import RelationshipsList from "./RelationshipsList";
import CardTitleSection from "./CardTitleSection";
import NotesList from "./NotesList";

const ElementCard = ({
  relationshipsList,
  elementData,
  typesList,
  viewType = "card",
  relationshipsSearchTerm = "",
}) => {
  const [shouldDisplayElement, setShouldDisplayElement] = useState(true);

  return (
    elementData &&
    relationshipsList && (
      <div
        className={
          "card-container " +
          viewType +
          `${!shouldDisplayElement ? " hide" : ""}`
        }
      >
        <div className="card-content-wrapper">
          <CardTitleSection elementData={elementData} />
          <div className="relationships-notes-wrapper">
            <RelationshipsList
              elementData={elementData}
              relationshipsList={relationshipsList}
              typesList={typesList}
              relationshipsSearchTerm={relationshipsSearchTerm}
              setShouldDisplayElement={setShouldDisplayElement}
            />
            <NotesList elementData={elementData} />
          </div>
        </div>
      </div>
    )
  );
};

export default ElementCard;
