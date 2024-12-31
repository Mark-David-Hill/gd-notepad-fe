import { useState } from "react";

import RelationshipsList from "./RelationshipsList";
import CardTitleSection from "./CardTitleSection";
import NotesList from "./NotesList";

const ElementCard = ({
  relationships,
  elementData,
  typesList,
  viewType = "card",
}) => {
  const [shouldDisplayElement, setShouldDisplayElement] = useState(true);

  return (
    elementData &&
    relationships && (
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
              relationships={relationships}
              typesList={typesList}
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
