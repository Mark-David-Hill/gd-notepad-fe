const NotesList = ({ elementData }) => {
  return (
    elementData.notes.length > 0 && (
      <div className="element-notes">
        <h3>Notes</h3>
        {elementData.notes.map((note) => (
          <p key={note.note_id}>{note.content}</p>
        ))}
      </div>
    )
  );
};

export default NotesList;
