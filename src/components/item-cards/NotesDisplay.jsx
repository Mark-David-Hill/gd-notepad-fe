import PropTypes from "prop-types";

const NotesDisplay = ({ notes, items }) => {
  if (!notes || notes.length === 0) {
    return (
      <div className="notes-container">
        <h2>Notes</h2>
        <p>No notes available for this collection.</p>
      </div>
    );
  }

  // Group notes by item
  const notesByItem = notes.reduce((acc, note) => {
    const itemId = note.item_id;
    if (!acc[itemId]) {
      acc[itemId] = [];
    }
    acc[itemId].push(note);
    return acc;
  }, {});

  return (
    <div className="notes-container">
      <h2>Notes</h2>
      <div className="notes-wrapper">
        {Object.entries(notesByItem).map(([itemId, itemNotes]) => {
          const item = items.find(i => i.item_id === itemId);
          if (!item) return null;
          
          // Get the type image URL as fallback
          // Handle both internal (nested type) and external (flat type) structures
          const typeImageUrl = item.type?.image_url || '';
          const itemImageUrl = item.image_url || typeImageUrl;
          
          return (
            <div key={itemId} className="item-notes-section">
              <div className="item-header">
                <div className="item-image">
                  <img 
                    src={itemImageUrl || "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"} 
                    alt={`${item.name} image`}
                  />
                </div>
                <h3>{item.name}</h3>
              </div>
              {itemNotes.map((note) => (
                <div key={note.note_id} className="note-item">
                  <p>{note.content}</p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

NotesDisplay.propTypes = {
  notes: PropTypes.array,
  items: PropTypes.array.isRequired,
};

export default NotesDisplay;
