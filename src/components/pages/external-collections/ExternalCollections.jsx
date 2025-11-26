import { useEffect, useContext, useMemo, useState } from "react";

import CollectionCard from "../collections/CollectionCard";
import useFetch from "../../../hooks/useFetch";

import { ThemeContext } from "../../context/ThemeContextProvider";
import { AuthContext } from "../../context/AuthContextProvider";

const GOOGLE_SHEET_ID = "1aYK-0RBzHnzvZKmVjWwwbfmPqY29f6SnyjfT8InQf10";
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv`;

const LIGHT_MODE_VARIANT = "soft";
const DARK_MODE_VARIANT = "modern";

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

// No longer needed - using unified CollectionCard component

const ExternalCollections = () => {
  const [externalCollections, setExternalCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { authInfo } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const { data: internalCollections = [], loading: internalLoading } =
    useFetch("/collections");

  const cardStyle = useMemo(
    () => (theme === "dark" ? DARK_MODE_VARIANT : LIGHT_MODE_VARIANT),
    [theme]
  );

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
            obj.image_url = extractImageUrl(obj.image_url);
          }

          return obj;
        });

        setExternalCollections(data);
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
    <section className="items-container external-collections-page">
      <header className="collections-header">
        <h1>Collections</h1>
      </header>
      <div className="items-wrapper">
        {/* External Collections Section */}
        <div className="external-collections-section">
          <div className="external-collections-section__header">
            {authInfo && <h2>External Collections</h2>}
          </div>
          {loading ? (
            <p>Loading external collections...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <div className="collections-wrapper external-collections__grid">
              {externalCollections.map((collection) => (
                <CollectionCard
                  key={collection.collection_id || collection.name}
                  collection={collection}
                  variant={cardStyle}
                  isExternal={true}
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
              <div className="collections-wrapper external-collections__grid">
                {internalCollections.map((collection) => (
                  <CollectionCard
                    key={collection.collection_id}
                    collection={collection}
                    variant={cardStyle}
                    isExternal={false}
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

ExternalCollections.propTypes = {
  // This component does not accept any props
};

export default ExternalCollections;
