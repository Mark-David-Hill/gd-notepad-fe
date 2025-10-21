import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

import ItemCard from "../../item-cards/ItemCard";
import ViewSelect from "../../forms/ViewSelect";
import ComboBox from "../../forms/ComboBox";

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
      <div className="collection-wrapper">
        <header className="collections-header">
          <h1>{collectionData.name}</h1>
          {collectionData.description && <p>{collectionData.description}</p>}
        </header>

        <div
          className="tab-selector"
          style={{ marginBottom: "20px", borderBottom: "1px solid #ccc" }}
        >
          <button
            className={`tab-button ${currentTab === "items" ? "active" : ""}`}
            onClick={() => setCurrentTab("items")}
            style={{
              padding: "10px 20px",
              marginRight: "10px",
              border: "none",
              backgroundColor:
                currentTab === "items" ? "#007bff" : "transparent",
              color: currentTab === "items" ? "white" : "#333",
              cursor: "pointer",
              borderRadius: "5px 5px 0 0",
            }}
          >
            Items ({items.length})
          </button>
          {relationships.length > 0 && (
            <button
              className={`tab-button ${
                currentTab === "relationships" ? "active" : ""
              }`}
              onClick={() => setCurrentTab("relationships")}
              style={{
                padding: "10px 20px",
                marginRight: "10px",
                border: "none",
                backgroundColor:
                  currentTab === "relationships" ? "#007bff" : "transparent",
                color: currentTab === "relationships" ? "white" : "#333",
                cursor: "pointer",
                borderRadius: "5px 5px 0 0",
              }}
            >
              Relationships ({relationships.length})
            </button>
          )}
          {notes.length > 0 && (
            <button
              className={`tab-button ${currentTab === "notes" ? "active" : ""}`}
              onClick={() => setCurrentTab("notes")}
              style={{
                padding: "10px 20px",
                border: "none",
                backgroundColor:
                  currentTab === "notes" ? "#007bff" : "transparent",
                color: currentTab === "notes" ? "white" : "#333",
                cursor: "pointer",
                borderRadius: "5px 5px 0 0",
              }}
            >
              Notes ({notes.length})
            </button>
          )}
        </div>

        <div className="items-container">
          {loading ? (
            <p>Loading items...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <>
              {currentTab === "items" && (
                <>
                  <div
                    className="search-section"
                    style={{ marginBottom: "20px" }}
                  >
                    <input
                      className="search-box"
                      type="text"
                      placeholder="Search items..."
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

                  {types.length > 0 && (
                    <div
                      style={{
                        marginBottom: "20px",
                        padding: "10px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "5px",
                      }}
                    >
                      <p style={{ margin: 0 }}>
                        <strong>Types:</strong>{" "}
                        {types.map((t) => t.name).join(", ")}
                      </p>
                    </div>
                  )}

                  <h2>
                    Items (
                    {
                      items.filter((item) => {
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
                      }).length
                    }
                    )
                  </h2>
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
                          image_url:
                            item.image_url || itemType?.image_url || "",
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
                          />
                        );
                      })}
                  </div>
                </>
              )}

              {currentTab === "relationships" && relationships.length > 0 && (
                <>
                  <h2>Relationships ({relationships.length})</h2>
                  <div
                    className="collections-wrapper"
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                      gap: "20px",
                    }}
                  >
                    {relationships.map((relationship, index) => {
                      const item1 = items.find(
                        (item) => item.item_id === relationship.item_1_id
                      );
                      const item2 = items.find(
                        (item) => item.item_id === relationship.item_2_id
                      );

                      return (
                        <div
                          key={index}
                          className="item-card-container card"
                          style={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            overflow: "hidden",
                            backgroundColor: "rgb(198, 255, 237)",
                          }}
                        >
                          <div className="card-view-container">
                            {/* Header with relationship title */}
                            <div
                              className="title-wrapper"
                              style={{
                                backgroundColor: "#4a90e2",
                                padding: "10px",
                              }}
                            >
                              <h2
                                style={{
                                  backgroundColor: "transparent",
                                  color: "white",
                                  margin: 0,
                                  fontSize: "16px",
                                }}
                              >
                                {item1?.name ||
                                  `Item ${relationship.item_1_id}`}{" "}
                                ↔{" "}
                                {item2?.name ||
                                  `Item ${relationship.item_2_id}`}
                              </h2>
                            </div>

                            {/* Content area with images and details */}
                            <div
                              className="card-content-wrapper"
                              style={{ padding: "15px" }}
                            >
                              {/* Images side by side */}
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  gap: "20px",
                                  marginBottom: "15px",
                                }}
                              >
                                <div style={{ textAlign: "center" }}>
                                  <div
                                    style={{
                                      width: "80px",
                                      height: "80px",
                                      border: "1px solid #ddd",
                                      borderRadius: "4px",
                                      backgroundColor: "white",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      marginBottom: "5px",
                                    }}
                                  >
                                    {item1?.image_url ? (
                                      <img
                                        src={item1.image_url}
                                        alt={item1.name}
                                        style={{
                                          maxWidth: "100%",
                                          maxHeight: "100%",
                                          objectFit: "contain",
                                        }}
                                      />
                                    ) : (
                                      <span
                                        style={{
                                          fontSize: "12px",
                                          color: "#666",
                                        }}
                                      >
                                        No Image
                                      </span>
                                    )}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {item1?.name ||
                                      `Item ${relationship.item_1_id}`}
                                  </div>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    fontSize: "24px",
                                    color: "#4a90e2",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ↔
                                </div>

                                <div style={{ textAlign: "center" }}>
                                  <div
                                    style={{
                                      width: "80px",
                                      height: "80px",
                                      border: "1px solid #ddd",
                                      borderRadius: "4px",
                                      backgroundColor: "white",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      marginBottom: "5px",
                                    }}
                                  >
                                    {item2?.image_url ? (
                                      <img
                                        src={item2.image_url}
                                        alt={item2.name}
                                        style={{
                                          maxWidth: "100%",
                                          maxHeight: "100%",
                                          objectFit: "contain",
                                        }}
                                      />
                                    ) : (
                                      <span
                                        style={{
                                          fontSize: "12px",
                                          color: "#666",
                                        }}
                                      >
                                        No Image
                                      </span>
                                    )}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {item2?.name ||
                                      `Item ${relationship.item_2_id}`}
                                  </div>
                                </div>
                              </div>

                              {/* Relationship details */}
                              {relationship.description && (
                                <div
                                  style={{
                                    fontStyle: "italic",
                                    marginBottom: "10px",
                                    fontSize: "14px",
                                    color: "#333",
                                  }}
                                >
                                  {relationship.description}
                                </div>
                              )}

                              {relationship.count && (
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#666",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Count: {relationship.count}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {currentTab === "notes" && notes.length > 0 && (
                <>
                  <h2>Notes ({notes.length})</h2>
                  <div className="notes-wrapper">
                    {notes.map((note, index) => {
                      const item = items.find(
                        (i) => i.item_id === note.item_id
                      );

                      return (
                        <div
                          key={index}
                          style={{
                            border: "1px solid #ddd",
                            padding: "15px",
                            margin: "10px 0",
                            borderRadius: "5px",
                            backgroundColor: "#f9f9f9",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "10px",
                            }}
                          >
                            <strong>
                              {item?.name || `Item ${note.item_id}`}
                            </strong>
                            {note.date_time && (
                              <span style={{ fontSize: "12px", color: "#666" }}>
                                {note.date_time}
                              </span>
                            )}
                          </div>
                          <div style={{ marginBottom: "10px" }}>
                            {note.content}
                          </div>
                          {note.link_url && (
                            <div>
                              <a
                                href={note.link_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "#007bff",
                                  textDecoration: "none",
                                }}
                              >
                                {note.link_type || "Link"} →
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExternalCollectionDetails;
