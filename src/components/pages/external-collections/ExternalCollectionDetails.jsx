import { useState, useEffect, useContext, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";

import ItemCard from "../../item-cards/ItemCard";
import ViewSelect from "../../forms/ViewSelect";
import ComboBox from "../../forms/ComboBox";
import NotesDisplay from "../../item-cards/NotesDisplay";
import { ThemeContext } from "../../context/ThemeContextProvider";

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

const LIGHT_DETAIL_STYLE = "aurora";
const DARK_DETAIL_STYLE = "noir";

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
  const { theme } = useContext(ThemeContext);

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

  const detailStyle = useMemo(
    () => (theme === "dark" ? DARK_DETAIL_STYLE : LIGHT_DETAIL_STYLE),
    [theme]
  );

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

  const heroInitial = collectionData.name?.[0]?.toUpperCase() || "?";
  const summaryStats = [
    { label: "Items", value: items.length },
    { label: "Types", value: types.length },
    { label: "Relationships", value: relationships.length },
    { label: "Notes", value: notes.length },
  ];
  const filteredItems = items.filter((item) => {
    const itemType = types.find((t) => t.type_id === item.type_id);
    const typeMatch = !itemType || selectedTypes.includes(itemType.name);
    const searchMatch =
      !searchTerm ||
      item.name?.toLowerCase().includes(searchTerm.trim().toLowerCase());
    const relatedMatch = isItemRelatedToSelected(item);

    return typeMatch && searchMatch && relatedMatch;
  });

  return (
    <div
      className={`collection-container external-collection-details external-collection-details--${detailStyle}`}
    >
      <section className="external-collection-details__hero">
        <div className="external-collection-details__hero-visual">
          {collectionData.image_url ? (
            <img
              src={collectionData.image_url}
              alt={`${collectionData.name} artwork`}
            />
          ) : (
            <span aria-hidden="true">{heroInitial}</span>
          )}
        </div>
        <div className="external-collection-details__hero-content">
          <h1>{collectionData.name}</h1>
          {collectionData.description && <p>{collectionData.description}</p>}
          <div className="external-collection-details__hero-meta">
            {summaryStats.map((stat) => (
              <div
                key={stat.label}
                className="external-collection-details__hero-stat"
              >
                <span className="value">{loading ? "..." : stat.value}</span>
                <span className="label">{stat.label}</span>
              </div>
            ))}
          </div>
          {collectionData.sheet_url && (
            <a
              className="external-collection-details__hero-link"
              href={collectionData.sheet_url}
              target="_blank"
              rel="noreferrer"
            >
              Open source sheet
            </a>
          )}
        </div>
      </section>

      {error ? (
        <p className="external-collection-details__alert">Error: {error}</p>
      ) : (
        <div className="external-collection-details__content">
          <div className="view-select-wrapper external-collection-details__tabs">
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

          {loading ? (
            <p className="external-collection-details__loading">
              Loading collection...
            </p>
          ) : (
            <div className="collection-wrapper">
              {currentTab === "items" ? (
                <>
                  <div className="search-section external-collection-details__search">
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

                  <div className="external-collection-details__panel">
                    <h2>Items</h2>

                    <div
                      className={`external-collection-details__grid external-collection-details__grid--${viewType}`}
                    >
                      {filteredItems.length === 0 ? (
                        <p className="external-collection-details__empty">
                          No items match your filters yet.
                        </p>
                      ) : (
                        filteredItems.map((item, index) => {
                          const itemType = types.find(
                            (t) => t.type_id === item.type_id
                          );
                          const colorScheme = itemType
                            ? colorSchemes.find(
                                (cs) =>
                                  cs.color_scheme_id ===
                                  itemType.color_scheme_id
                              )
                            : null;

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
                              isExternal={true}
                              relationships={relationships}
                              items={items}
                              colorSchemes={colorSchemes}
                            />
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              ) : currentTab === "types" ? (
                <div className="external-collection-details__panel">
                  <h2>Types</h2>

                  <div className="external-collection-details__grid">
                    {types.length === 0 ? (
                      <p className="external-collection-details__empty">
                        No types available.
                      </p>
                    ) : (
                      types.map((type) => {
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
                      })
                    )}
                  </div>
                </div>
              ) : currentTab === "notes" ? (
                notes.length === 0 ? (
                  <p className="external-collection-details__empty">
                    No notes available yet.
                  </p>
                ) : (
                  <NotesDisplay notes={notes} items={items} />
                )
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExternalCollectionDetails;
