import { useEffect, useContext, useMemo, useState } from "react";

import CollectionCard from "../collections/CollectionCard";
import LoadingSpinner from "../../common/LoadingSpinner";
import ErrorMessage from "../../common/ErrorMessage";
import useFetch from "../../../hooks/useFetch";
import { fetchCatalog } from "../../../util/googleSheetsUtil";

import { ThemeContext } from "../../context/ThemeContextProvider";
import { AuthContext } from "../../context/AuthContextProvider";

const LIGHT_MODE_VARIANT = "soft";
const DARK_MODE_VARIANT = "modern";

// No longer needed - using unified CollectionCard component

const ExternalCollections = () => {
  const [externalCollections, setExternalCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { authInfo } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  // Internal collections need a logged-in API session, so skip the request
  // for visitors (always the case in demo mode).
  const { data: internalCollections, loading: internalLoading } = useFetch(
    authInfo ? "/collections" : null
  );

  // Ensure internalCollections is always an array
  const safeInternalCollections = Array.isArray(internalCollections)
    ? internalCollections
    : [];

  const cardStyle = useMemo(
    () => (theme === "dark" ? DARK_MODE_VARIANT : LIGHT_MODE_VARIANT),
    [theme]
  );

  useEffect(() => {
    const fetchGoogleSheetData = async () => {
      try {
        setLoading(true);
        const data = await fetchCatalog();
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
        <h1>{authInfo ? "GD Notepad" : "GD Notepad Collections"}</h1>
      </header>
      <div className="items-wrapper">
        {/* External Collections Section */}
        <div className="external-collections-section">
          <div className="external-collections-section__header">
            {authInfo && <h2>External Collections</h2>}
          </div>
          {loading ? (
            <LoadingSpinner message="Loading external collections..." />
          ) : error ? (
            <ErrorMessage message={error} />
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
              <LoadingSpinner message="Loading internal collections..." />
            ) : (
              <div className="collections-wrapper external-collections__grid">
                {safeInternalCollections.map((collection) => (
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

export default ExternalCollections;
