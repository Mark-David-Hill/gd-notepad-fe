import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

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

// Individual item card for external collection items
const ExternalItemCard = ({ item, types, colorSchemes }) => {
  // Find the type for this item
  const itemType = types.find((t) => t.type_id === item.type_id);

  // Find the color scheme for this type
  const colorScheme = itemType
    ? colorSchemes.find((cs) => cs.color_scheme_id === itemType.color_scheme_id)
    : null;

  // Get colors with defaults
  const borderColor = colorScheme?.secondary_color || "black";
  const backgroundColor = colorScheme?.background_color || "rgb(198, 255, 237)";
  const primaryColor = colorScheme?.primary_color || "white";
  const textColor = colorScheme?.text_color || "black";

  return (
    <div
      className="item-card-container square"
      style={{
        border: `1px solid ${borderColor}`,
        backgroundColor: backgroundColor,
      }}
    >
      <div className="square-view-container">
        <div className="title-wrapper">
          <h2 style={{ backgroundColor: primaryColor, color: textColor }}>
            {item.name}
          </h2>
        </div>
        <div className="square-container">
          <div className="image-wrapper">
            {item.image_url && (
              <img src={item.image_url} alt={`${item.name} image`} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ExternalItemCard.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
    image_url: PropTypes.string,
    type_id: PropTypes.string,
  }).isRequired,
  types: PropTypes.array,
  colorSchemes: PropTypes.array,
};

const ExternalCollectionDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [types, setTypes] = useState([]);
  const [colorSchemes, setColorSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        // Fetch all tabs (Items, Types, ColorSchemes)
        const [itemsData, typesData, colorSchemesData] = await Promise.all([
          fetchSheetTab(sheetId, "Items"),
          fetchSheetTab(sheetId, "Types").catch(() => []),
          fetchSheetTab(sheetId, "ColorSchemes").catch(() => []),
        ]);

        setItems(itemsData);
        setTypes(typesData);
        setColorSchemes(colorSchemesData);

        console.log(`External Collection "${collectionData.name}" Data:`, {
          items: itemsData,
          types: typesData,
          colorSchemes: colorSchemesData,
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

        <div className="items-container">
          {loading ? (
            <p>Loading items...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <>
              {types.length > 0 && (
                <div
                  style={{
                    marginBottom: "20px",
                    padding: "10px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "5px",
                  }}
                >
                  <p>
                    <strong>Types:</strong>{" "}
                    {types.map((t) => t.name).join(", ")}
                  </p>
                </div>
              )}
              <h2>Items ({items.length})</h2>
              <div className="items-wrapper">
                {items.map((item, index) => (
                  <ExternalItemCard
                    key={item.item_id || index}
                    item={item}
                    types={types}
                    colorSchemes={colorSchemes}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExternalCollectionDetails;
