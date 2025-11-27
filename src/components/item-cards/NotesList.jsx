import PropTypes from "prop-types";

const NotesList = ({ itemData }) => {
  return (
    itemData.notes.length > 0 && (
      <div className="element-notes">
        <h3>Notes</h3>
        {itemData.notes.map((note) => (
          <p key={note.note_id}>{note.content}</p>
        ))}
      </div>
    )
  );
};

NotesList.propTypes = {
  itemData: PropTypes.object.isRequired,
};

export default NotesList;
