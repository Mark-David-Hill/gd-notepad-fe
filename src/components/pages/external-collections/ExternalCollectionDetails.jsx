import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

import ItemCard from "../../item-cards/ItemCard";
import ViewSelect from "../../forms/ViewSelect";
import ComboBox from "../../forms/ComboBox";
import NotesDisplay from "../../item-cards/NotesDisplay";

// Extract actual image URL from Google imgres URLs
const extractImageUrl = (url) => {
  if (!url) return url;

  if (url.includes("google.com/imgres") || url.includes("imgurl=")) {
    try {
      const urlObj = new URL(url);
      const imgurl = urlObj.searchParams.get("imgurl");
      if (imgurl) {
        return decodeURIComponent(imgurl);
      }
    } catch (e) {
      console.warn("Failed to parse image URL:", url);
    }
  }

  return url;
};

// Parse CSV with proper handling of quoted fields
const parseCSVLine = (line) => {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
};

const ExternalCollectionDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [types, setTypes] = useState([]);
  const [colorSchemes, setColorSchemes] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("square");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedElements, setSelectedElements] = useState([]);
  const [currentTab, setCurrentTab] = useState("items");

  // Get collection metadata from navigation state or localStorage
  const collectionData =
    location.state?.collection ||
    JSON.parse(localStorage.getItem(`external-collection-${id}`) || "null");

  useEffect(() => {
    // Store collection data in localStorage for page refreshes
    if (location.state?.collection) {
      localStorage.setItem(
        `external-collection-${id}`,
        JSON.stringify(location.state.collection)
      );
    }
  }, [id, location.state]);

  // Initialize selectedTypes when types are loaded (only once)
  useEffect(() => {
    if (types.length > 0) {
      setSelectedTypes(types.map((type) => type.name));
    }
  }, [types]);

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

  // Helper function to check if an item is related to selected elements
  const isItemRelatedToSelected = (item) => {
    if (selectedElements.length === 0) return true;

    return relationships.some((relationship) => {
      const item1 = items.find((i) => i.item_id === relationship.item_1_id);
      const item2 = items.find((i) => i.item_id === relationship.item_2_id);

      // Check if this item is in a relationship with any selected element
      const isRelated =
        (item.item_id === relationship.item_1_id &&
          selectedElements.includes(item2?.name)) ||
        (item.item_id === relationship.item_2_id &&
          selectedElements.includes(item1?.name));

      return isRelated;
    });
  };

  if (!collectionData) {
    return (
      <div className="collection-container">
        <p>Collection not found. Please navigate from the collections page.</p>
      </div>
    );
  }

  return (
    <div className="collection-container">
      <div className="view-select-wrapper">
        <button
          className={currentTab === "items" ? "selected" : ""}
          onClick={() => setCurrentTab("items")}
        >
          Items
        </button>

        <button
          className={currentTab === "types" ? "selected" : ""}
          onClick={() => setCurrentTab("types")}
        >
          Types
        </button>

        <button
          className={currentTab === "notes" ? "selected" : ""}
          onClick={() => setCurrentTab("notes")}
        >
          Notes
        </button>
      </div>

      {collectionData && items ? (
        <div className="collection-wrapper">
          <header className="collections-header">
            <h1>{collectionData.name}</h1>
            {collectionData.description && <p>{collectionData.description}</p>}
          </header>

          {currentTab === "items" && items.length > 0 ? (
            <div className="items-container">
              <div className="search-section">
                <input
                  className="search-box"
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {types.length > 0 && (
                  <ComboBox
                    placeholder="Types"
                    allOptions={types.map((type) => type.name)}
                    currentOptions={selectedTypes}
                    setCurrentOptions={setSelectedTypes}
                  />
                )}

                {items.length > 0 && (
                  <ComboBox
                    placeholder="Related Elements"
                    allOptions={items.map((item) => item.name)}
                    currentOptions={selectedElements}
                    setCurrentOptions={setSelectedElements}
                  />
                )}

                <ViewSelect viewType={viewType} setViewType={setViewType} />
              </div>

              <div className="items-container">
                <h2>Items</h2>

                <div className="items-wrapper">
                  {items
                    .filter((item) => {
                      // Find item type
                      const itemType = types.find(
                        (t) => t.type_id === item.type_id
                      );

                      // Filter by type
                      const typeMatch =
                        !itemType || selectedTypes.includes(itemType.name);

                      // Filter by search term
                      const searchMatch =
                        !searchTerm ||
                        item.name
                          ?.toLowerCase()
                          .includes(searchTerm.trim().toLowerCase());

                      // Filter by related elements
                      const relatedMatch = isItemRelatedToSelected(item);

                      return typeMatch && searchMatch && relatedMatch;
                    })
                    .map((item, index) => {
                      // Find the type and color scheme for this item
                      const itemType = types.find(
                        (t) => t.type_id === item.type_id
                      );
                      const colorScheme = itemType
                        ? colorSchemes.find(
                            (cs) =>
                              cs.color_scheme_id === itemType.color_scheme_id
                          )
                        : null;

                      // Use type's image_url as fallback if item doesn't have one
                      const itemWithImage = {
                        ...item,
                        image_url: item.image_url || itemType?.image_url || "",
                      };

                      return (
                        <ItemCard
                          key={item.item_id || index}
                          itemData={itemWithImage}
                          itemType="item"
                          pageRoute={null}
                          colorScheme={colorScheme}
                          typeImageUrl={itemType?.image_url}
                          viewType={viewType}
                          types={types}
                          isExternal={true}
                          relationships={relationships}
                          items={items}
                          colorSchemes={colorSchemes}
                        />
                      );
                    })}
                </div>
              </div>
            </div>
          ) : currentTab === "types" ? (
            <div className="items-container">
              <h2>Types</h2>

              <div className="items-wrapper">
                {types.map((type) => {
                  // Find color scheme for this type
                  const colorScheme = colorSchemes.find(
                    (cs) => cs.color_scheme_id === type.color_scheme_id
                  );

                  return (
                    <ItemCard
                      key={type.type_id}
                      itemData={type}
                      itemType="type"
                      pageRoute="type"
                      viewType="square"
                      colorScheme={colorScheme}
                      typeImageUrl={type.image_url}
                      types={types}
                      isExternal={true}
                    />
                  );
                })}
              </div>
            </div>
          ) : currentTab === "notes" ? (
            <NotesDisplay notes={notes} items={items} />
          ) : null}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ExternalCollectionDetails;
