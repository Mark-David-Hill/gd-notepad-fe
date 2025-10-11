import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

import ItemCard from "../../item-cards/ItemCard";
import { CollectionContext } from "../../context/CollectionContextProvider";

const GOOGLE_SHEET_ID = "1aYK-0RBzHnzvZKmVjWwwbfmPqY29f6SnyjfT8InQf10";
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv`;

// Extract actual image URL from Google imgres URLs
const extractImageUrl = (url) => {
  if (!url) return url;

  // If it's a Google imgres URL, extract the imgurl parameter
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

  // Return original URL if not a Google imgres URL
  return url;
};

// Wrapper component to add external link functionality
const ExternalCollectionCard = ({ collection, types }) => {
  useEffect(() => {
    // Debug image loading
    if (collection.image_url) {
      const img = new Image();
      img.onload = () => {
        console.log(`✓ Image loaded successfully for: ${collection.name}`);
      };
      img.onerror = () => {
        console.error(`✗ Failed to load image for: ${collection.name}`, {
          url: collection.image_url,
          collection: collection,
        });
      };
      img.src = collection.image_url;
    } else {
      console.warn(`⚠ No image URL provided for: ${collection.name}`);
    }
  }, [collection]);

  return (
    <div style={{ position: "relative" }}>
      <ItemCard
        itemData={collection}
        itemType="collection"
        pageRoute={null}
        types={types}
      />
      {collection.sheet_url && (
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            right: "10px",
            padding: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "4px",
          }}
        >
          <a
            href={collection.sheet_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "8px 16px",
              backgroundColor: "#4CAF50",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "500",
            }}
          >
            View External Collection →
          </a>
        </div>
      )}
    </div>
  );
};

ExternalCollectionCard.propTypes = {
  collection: PropTypes.shape({
    collection_id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    image_url: PropTypes.string,
    sheet_url: PropTypes.string,
  }).isRequired,
  types: PropTypes.array,
};

const ExternalCollections = () => {
  const [externalCollections, setExternalCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { types } = useContext(CollectionContext);

  useEffect(() => {
    const fetchGoogleSheetData = async () => {
      try {
        setLoading(true);
        const response = await fetch(SHEET_CSV_URL);

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const csvText = await response.text();

        // Parse CSV data with proper handling of quoted fields
        const parseCSVLine = (line) => {
          const values = [];
          let current = "";
          let inQuotes = false;

          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
              if (inQuotes && nextChar === '"') {
                // Escaped quote
                current += '"';
                i++;
              } else {
                // Toggle quote state
                inQuotes = !inQuotes;
              }
            } else if (char === "," && !inQuotes) {
              // End of field
              values.push(current.trim());
              current = "";
            } else {
              current += char;
            }
          }
          values.push(current.trim());
          return values;
        };

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
            const extractedUrl = extractImageUrl(obj.image_url);
            console.log(`Image URL transformation for ${obj.name}:`, {
              original: obj.image_url,
              extracted: extractedUrl,
            });
            obj.image_url = extractedUrl;
          }

          return obj;
        });

        setExternalCollections(data);
        console.log("External Collections Data:", data);
        console.log(
          "Sample image URLs:",
          data.slice(0, 3).map((d) => ({
            name: d.name,
            image_url: d.image_url,
          }))
        );
        setError(null);
      } catch (err) {
        console.error("Error fetching Google Sheet data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGoogleSheetData();
  }, []);

  return (
    <section className="items-container">
      <header className="collections-header">
        <h1>External Collections</h1>
      </header>
      <div className="items-wrapper">
        {loading ? (
          <p>Loading external collections...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div className="collections-wrapper">
            {externalCollections.map((collection) => (
              <ExternalCollectionCard
                key={collection.collection_id}
                collection={collection}
                types={types}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExternalCollections;
