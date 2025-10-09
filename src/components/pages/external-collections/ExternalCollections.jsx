import { useState, useEffect } from "react";

// import { useContext } from "react";
// import AddCollectionForm from "../../forms/AddCollectionForm";
// import ItemCard from "../../item-cards/ItemCard";
// import { AuthContext } from "../../context/AuthContextProvider";
// import { CollectionContext } from "../../context/CollectionContextProvider";
// import useFetch from "../../../hooks/useFetch";

const GOOGLE_SHEET_ID = "1aYK-0RBzHnzvZKmVjWwwbfmPqY29f6SnyjfT8InQf10";
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv`;

const ExternalCollections = () => {
  const [externalCollections, setExternalCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const { authInfo } = useContext(AuthContext);
  // const { types } = useContext(CollectionContext);
  // const { data: collections = [], loading, refetch } = useFetch("/collections");

  // const handleCollectionAdded = () => {
  //   refetch();
  // };

  useEffect(() => {
    const fetchGoogleSheetData = async () => {
      try {
        setLoading(true);
        const response = await fetch(SHEET_CSV_URL);

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const csvText = await response.text();

        // Parse CSV data
        const lines = csvText.split("\n");
        const headers = lines[0]
          .split(",")
          .map((header) => header.replace(/^"|"$/g, "").trim());

        const data = lines
          .slice(1)
          .filter((line) => line.trim())
          .map((line) => {
            const values = line
              .split(",")
              .map((value) => value.replace(/^"|"$/g, "").trim());

            return headers.reduce((obj, header, index) => {
              obj[header] = values[index] || "";
              return obj;
            }, {});
          });

        setExternalCollections(data);
        console.log("External Collections Data:", data);
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
      {loading && <p>Loading external collections...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <p>
          Loaded {externalCollections.length} external collections (check
          console)
        </p>
      )}
      {/* <div className="items-wrapper">
        {authInfo && (
          <AddCollectionForm setCollections={handleCollectionAdded} />
        )}
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="collections-wrapper">
            {collections.map((collection) => (
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
      </div> */}
    </section>
  );
};

export default ExternalCollections;
