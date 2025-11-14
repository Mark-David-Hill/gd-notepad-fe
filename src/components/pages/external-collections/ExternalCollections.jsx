import { useEffect, useContext, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import ItemCard from "../../item-cards/ItemCard";
import useFetch from "../../../hooks/useFetch";

import { CollectionContext } from "../../context/CollectionContextProvider";
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

// Custom card view for external collections
const CARD_VARIANTS = [LIGHT_MODE_VARIANT, DARK_MODE_VARIANT];

const ExternalCollectionCard = ({ collection, variant }) => {
  const cardVariant = CARD_VARIANTS.includes(variant)
    ? variant
    : LIGHT_MODE_VARIANT;

  const placeholderLetter = collection.name?.[0]?.toUpperCase() || "?";

  return (
    <article
      className={`external-collection-card external-collection-card--${cardVariant}`}
    >
      <div className="external-collection-card__media">
        {collection.image_url ? (
          <img
            src={collection.image_url}
            alt={`${collection.name} cover art`}
            loading="lazy"
          />
        ) : (
          <div
            aria-hidden="true"
            className="external-collection-card__placeholder"
          >
            {placeholderLetter}
          </div>
        )}
      </div>
      <div className="external-collection-card__content">
        <h3>{collection.name}</h3>
        {collection.description && <p>{collection.description}</p>}
        {collection.sheet_url && (
          <NavLink
            className="external-collection-card__link"
            to={`/external-collection/${collection.collection_id}`}
            state={{ collection }}
          >
            View External Collection
          </NavLink>
        )}
      </div>
    </article>
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
  variant: PropTypes.oneOf(CARD_VARIANTS).isRequired,
};

const ExternalCollections = () => {
  const [externalCollections, setExternalCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { authInfo } = useContext(AuthContext);
  const { types } = useContext(CollectionContext);
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
                <ExternalCollectionCard
                  key={collection.collection_id || collection.name}
                  collection={collection}
                  variant={cardStyle}
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
