import { useState, useEffect } from "react";
import { fetchSheetRows } from "../util/googleSheetsUtil";

const useExternalCollectionData = (collectionData) => {
  const [items, setItems] = useState([]);
  const [types, setTypes] = useState([]);
  const [colorSchemes, setColorSchemes] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollectionData = async () => {
      // Nothing to load yet (or this is an internal collection)
      if (!collectionData) return;

      if (!collectionData.sheet_url) {
        setError("No sheet URL provided for this collection");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Extract Google Sheet ID from the URL
        let sheetId;
        try {
          const urlMatch = collectionData.sheet_url.match(
            /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/
          );
          if (urlMatch) {
            sheetId = urlMatch[1];
          } else {
            throw new Error("Invalid Google Sheets URL");
          }
        } catch (e) {
          throw new Error("Could not extract sheet ID from URL");
        }

        // Fetch all tabs (Items, Types, ColorSchemes, Relationships, Notes)
        const [
          itemsData,
          typesData,
          colorSchemesData,
          relationshipsData,
          notesData,
        ] = await Promise.all([
          fetchSheetRows(sheetId, "Items"),
          fetchSheetRows(sheetId, "Types").catch(() => []),
          fetchSheetRows(sheetId, "ColorSchemes").catch(() => []),
          fetchSheetRows(sheetId, "Relationships").catch(() => []),
          fetchSheetRows(sheetId, "Notes").catch(() => []),
        ]);

        // Attach notes to items
        const itemsWithNotes = itemsData.map((item) => ({
          ...item,
          notes: notesData.filter((note) => note.item_id === item.item_id),
        }));

        setItems(itemsWithNotes);
        setTypes(typesData);
        setColorSchemes(colorSchemesData);
        setRelationships(relationshipsData);
        setNotes(notesData);

        setError(null);
      } catch (err) {
        console.error("Error fetching external collection data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionData();
  }, [collectionData]);

  return {
    items,
    types,
    colorSchemes,
    relationships,
    notes,
    loading,
    error,
  };
};

export default useExternalCollectionData;

