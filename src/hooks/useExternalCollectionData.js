import { useState, useEffect } from "react";
import { extractImageUrl, parseCSVLine } from "../util/googleSheetsUtil";

const useExternalCollectionData = (collectionData) => {
  const [items, setItems] = useState([]);
  const [types, setTypes] = useState([]);
  const [colorSchemes, setColorSchemes] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to fetch a specific sheet tab
  const fetchSheetTab = async (sheetId, tabName) => {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
      tabName
    )}`;
    const response = await fetch(csvUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${tabName} tab: ${response.status}`);
    }

    const csvText = await response.text();
    const lines = csvText.split("\n").filter((line) => line.trim());
    const headers = parseCSVLine(lines[0]);

    const data = lines.slice(1).map((line) => {
      const values = parseCSVLine(line);

      const obj = headers.reduce((acc, header, index) => {
        acc[header] = values[index] || "";
        return acc;
      }, {});

      // Extract actual image URL from Google imgres URLs
      if (obj.image_url) {
        obj.image_url = extractImageUrl(obj.image_url);
      }

      return obj;
    });

    return data;
  };

  useEffect(() => {
    const fetchCollectionData = async () => {
      if (!collectionData?.sheet_url) {
        setError("No sheet URL provided for this collection");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

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
          fetchSheetTab(sheetId, "Items"),
          fetchSheetTab(sheetId, "Types").catch(() => []),
          fetchSheetTab(sheetId, "ColorSchemes").catch(() => []),
          fetchSheetTab(sheetId, "Relationships").catch(() => []),
          fetchSheetTab(sheetId, "Notes").catch(() => []),
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

        console.log(`External Collection "${collectionData.name}" Data:`, {
          items: itemsData,
          types: typesData,
          colorSchemes: colorSchemesData,
          relationships: relationshipsData,
          notes: notesData,
        });

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

