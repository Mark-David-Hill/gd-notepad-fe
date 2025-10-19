import { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import { AuthContext } from "../../context/AuthContextProvider";
import { CollectionContext } from "../../context/CollectionContextProvider";
import useFetch from "../../../hooks/useFetch";
import ItemCard from "../../item-cards/ItemCard";

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

// Custom card view for external collections
const ExternalCollectionCard = ({ collection }) => {
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
    <div
      className="item-card-container card"
      style={{
        border: "1px solid black",
        backgroundColor: "rgb(198, 255, 237)",
      }}
    >
      <div className="card-view-container">
        <div className="title-wrapper">
          <h2 style={{ backgroundColor: "white", color: "black" }}>
            {collection.name}
          </h2>
        </div>
        <div className="card-content-wrapper">
          <div className="image-wrapper">
            <img src={collection.image_url} alt={`${collection.name} image`} />
          </div>
          <div className="text-wrapper">
            <p>{collection.description}</p>
            {collection.sheet_url && (
              <NavLink
                to={`/external-collection/${collection.collection_id}`}
                state={{ collection }}
              >
                View External Collection
              </NavLink>
            )}
          </div>
        </div>
      </div>
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
};

const ExternalCollections = () => {
  const [externalCollections, setExternalCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { authInfo } = useContext(AuthContext);
  const { types } = useContext(CollectionContext);
  const { data: internalCollections = [], loading: internalLoading } =
    useFetch("/collections");

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
        <h1>Collections</h1>
      </header>
      <div className="items-wrapper">
        {/* External Collections Section */}
        <div style={{ marginBottom: "40px" }}>
          {authInfo && <h2>External Collections</h2>}
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
                />
              ))}
            </div>
          )}
        </div>

        {/* Internal Collections Section */}
        {authInfo && (
          <div>
            <h2>Internal Collections</h2>
            {internalLoading ? (
              <p>Loading internal collections...</p>
            ) : (
              <div className="collections-wrapper">
                {internalCollections.map((collection) => (
                  <ItemCard
                    key={collection.collection_id}
                    itemData={collection}
                    itemType="collection"
                    pageRoute="collection"
                    types={types}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExternalCollections;
