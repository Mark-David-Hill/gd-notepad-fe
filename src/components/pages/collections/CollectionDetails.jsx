import { useEffect, useContext, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import AddColorSchemeForm from "../../forms/AddColorSchemeForm";
import CollectionTabSelect from "./CollectionTabSelect";
import AddItemForm from "../../forms/AddItemForm";
import AddTypeForm from "../../forms/AddTypeForm";
import ItemCard from "../../item-cards/ItemCard";
import SearchSection from "./SearchSection";
import NotesDisplay from "../../item-cards/NotesDisplay";

import { CollectionContext } from "../../context/CollectionContextProvider";
import { AuthContext } from "../../context/AuthContextProvider";
import { ThemeContext } from "../../context/ThemeContextProvider";
import useCollectionViewState from "../../../hooks/useCollectionViewState";
import useExternalCollectionData from "../../../hooks/useExternalCollectionData";

const LIGHT_DETAIL_STYLE = "aurora";
const DARK_DETAIL_STYLE = "noir";

const CollectionDetails = ({ isExternal = false }) => {
  const { id } = useParams();
  const location = useLocation();
  const { theme } = useContext(ThemeContext);
  const { authInfo } = useContext(AuthContext);

  // Internal collection data (from context)
  const {
    currentCollectionId,
    setCurrentCollectionId,
    currentCollection: internalCollection,
    types: internalTypes,
    setTypes: setInternalTypes,
    items: internalItems,
    setItems: setInternalItems,
    relationships: internalRelationships,
    notes: internalNotes,
  } = useContext(CollectionContext);

  // External collection data (from localStorage/state)
  const externalCollectionData =
    location.state?.collection ||
    JSON.parse(localStorage.getItem(`external-collection-${id}`) || "null");

  const {
    items: externalItems,
    types: externalTypes,
    colorSchemes: externalColorSchemes,
    relationships: externalRelationships,
    notes: externalNotes,
    loading: externalLoading,
    error: externalError,
  } = useExternalCollectionData(isExternal ? externalCollectionData : null);

  // Store external collection data in localStorage for page refreshes
  useEffect(() => {
    if (isExternal && location.state?.collection) {
      localStorage.setItem(
        `external-collection-${id}`,
        JSON.stringify(location.state.collection)
      );
    }
  }, [id, location.state, isExternal]);

  // Set internal collection ID
  useEffect(() => {
    if (
      !isExternal &&
      ((id && !currentCollectionId) ||
        (id && currentCollectionId && currentCollectionId !== id))
    ) {
      setCurrentCollectionId(id);
    }
  }, [id, isExternal, currentCollectionId, setCurrentCollectionId]);

  // Determine which data source to use
  const collection = isExternal ? externalCollectionData : internalCollection;
  const items = isExternal ? externalItems : internalItems;
  const types = isExternal ? externalTypes : internalTypes;
  const relationships = isExternal
    ? externalRelationships
    : internalRelationships;
  const notes = isExternal ? externalNotes : internalNotes;
  const colorSchemes = isExternal ? externalColorSchemes : [];
  const setItems = isExternal ? null : setInternalItems;
  const setTypes = isExternal ? null : setInternalTypes;

  const loading = isExternal ? externalLoading : !(collection && items);
  const error = isExternal ? externalError : null;

  const {
    viewType,
    setViewType,
    selectedElements,
    setSelectedElements,
    selectedTypes,
    setSelectedTypes,
    searchTerm,
    setSearchTerm,
    currentTab,
    setCurrentTab,
  } = useCollectionViewState(types);

  const detailStyle = useMemo(
    () => (theme === "dark" ? DARK_DETAIL_STYLE : LIGHT_DETAIL_STYLE),
    [theme]
  );

  // Helper function to check if an item is related to ALL selected elements
  const isItemRelatedToSelected = (item) => {
    if (selectedElements.length === 0) return true;

    if (isExternal) {
      // External collections use flat relationship structure
      // Check that item is related to ALL selected elements
      return selectedElements.every((selectedName) => {
        return relationships.some((relationship) => {
          const item1 = items.find((i) => i.item_id === relationship.item_1_id);
          const item2 = items.find((i) => i.item_id === relationship.item_2_id);

          // Check if this relationship connects the item to the selected element
          const isRelated =
            (item.item_id === relationship.item_1_id &&
              item2?.name === selectedName) ||
            (item.item_id === relationship.item_2_id &&
              item1?.name === selectedName);

          return isRelated;
        });
      });
    } else {
      // Internal collections use nested relationship structure
      // Check that item is related to ALL selected elements
      return selectedElements.every((selectedName) => {
        return relationships.some((relationship) => {
          if (!relationship.item_1 || !relationship.item_2) {
            return false;
          }

          // Check if this relationship connects the item to the selected element
          const isRelated =
            (item.name === relationship.item_1.name &&
              relationship.item_2.name === selectedName) ||
            (item.name === relationship.item_2.name &&
              relationship.item_1.name === selectedName);

          return isRelated;
        });
      });
    }
  };

  // Filter items based on search, types, and relationships
  const filteredItems = items.filter((item) => {
    const itemType = isExternal
      ? types.find((t) => t.type_id === item.type_id)
      : item.type;

    const typeMatch = !itemType || selectedTypes.includes(itemType.name);
    const searchMatch =
      !searchTerm ||
      item.name?.toLowerCase().includes(searchTerm.trim().toLowerCase());
    const relatedMatch = isItemRelatedToSelected(item);

    return typeMatch && searchMatch && relatedMatch;
  });

  // Early return if collection not found
  if (isExternal && !collection) {
    return (
      <div className="collection-container">
        <p>Collection not found. Please navigate from the collections page.</p>
      </div>
    );
  }

  // Render hero section for all collections
  const renderHeroSection = () => {
    if (!collection) return null;

    const heroInitial = collection.name?.[0]?.toUpperCase() || "?";
    const summaryStats = [
      { label: "Items", value: items.length },
      { label: "Types", value: types.length },
      { label: "Relationships", value: relationships.length },
      { label: "Notes", value: notes.length },
    ];

    return (
      <section className="external-collection-details__hero">
        <div className="external-collection-details__hero-visual">
          {collection.image_url ? (
            <img
              src={collection.image_url}
              alt={`${collection.name} artwork`}
            />
          ) : (
            <span aria-hidden="true">{heroInitial}</span>
          )}
        </div>
        <div className="external-collection-details__hero-content">
          <h1>{collection.name}</h1>
          {collection.description && <p>{collection.description}</p>}
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
          {isExternal && collection.sheet_url && authInfo && (
            <a
              className="external-collection-details__hero-link"
              href={collection.sheet_url}
              target="_blank"
              rel="noreferrer"
            >
              Open source sheet
            </a>
          )}
        </div>
      </section>
    );
  };

  // Render items tab content
  const renderItemsTab = () => {
    return (
      <>
        <SearchSection
          className="search-section"
          types={types}
          viewType={viewType}
          setViewType={setViewType}
          selectedElements={selectedElements}
          setSelectedElements={setSelectedElements}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          allItems={items}
        />

        {!isExternal && authInfo && (
          <AddItemForm
            setItems={setItems}
            collectionId={currentCollectionId}
            types={types}
          />
        )}

        <div className="collection-details__panel">
          <h2>Items</h2>

          <div
            className={`collection-details__grid collection-details__grid--${viewType}`}
          >
            {filteredItems.length === 0 ? (
              <p className="collection-details__empty">
                No items match your filters yet.
              </p>
            ) : (
              filteredItems.map((item, index) => {
                const itemType = isExternal
                  ? types.find((t) => t.type_id === item.type_id)
                  : item.type;
                const colorScheme = isExternal
                  ? itemType
                    ? colorSchemes.find(
                        (cs) => cs.color_scheme_id === itemType.color_scheme_id
                      )
                    : null
                  : itemType?.color_scheme;

                // Apply image fallback for both internal and external collections
                const itemWithImage = {
                  ...item,
                  image_url: item.image_url || itemType?.image_url || "",
                };

                return (
                  <ItemCard
                    key={item.item_id || index}
                    itemData={itemWithImage}
                    itemType="item"
                    pageRoute={isExternal ? null : "item"}
                    colorScheme={colorScheme}
                    typeImageUrl={itemType?.image_url}
                    viewType={viewType}
                    types={types}
                    isExternal={isExternal}
                    relationships={isExternal ? relationships : undefined}
                    items={isExternal ? items : undefined}
                    colorSchemes={isExternal ? colorSchemes : undefined}
                    setItems={!isExternal ? setItems : undefined}
                  />
                );
              })
            )}
          </div>
        </div>
      </>
    );
  };

  // Render types tab content
  const renderTypesTab = () => {
    return (
      <div className="collection-details__panel">
        {!isExternal && authInfo && (
          <AddTypeForm collectionId={id} setTypes={setTypes} />
        )}

        {!isExternal && authInfo?.role === "super-admin" && (
          <AddColorSchemeForm />
        )}

        <h2>Types</h2>

        <div className="collection-details__grid">
          {types.length === 0 ? (
            <p className="collection-details__empty">No types available.</p>
          ) : (
            types.map((type) => {
              const colorScheme = isExternal
                ? colorSchemes.find(
                    (cs) => cs.color_scheme_id === type.color_scheme_id
                  )
                : type.color_scheme;

              return (
                <ItemCard
                  key={type.type_id}
                  itemData={type}
                  setItems={setTypes}
                  itemType="type"
                  pageRoute="type"
                  viewType="square"
                  colorScheme={colorScheme}
                  typeImageUrl={type.image_url}
                  types={types}
                  isExternal={isExternal}
                />
              );
            })
          )}
        </div>
      </div>
    );
  };

  // Render notes tab content
  const renderNotesTab = () => {
    if (notes.length === 0) {
      return (
        <p className="collection-details__empty">No notes available yet.</p>
      );
    }
    return <NotesDisplay notes={notes} items={items} />;
  };

  // Render main content
  const renderContent = () => {
    if (loading) {
      return (
        <p className="collection-details__loading">Loading collection...</p>
      );
    }

    return (
      <div className="collection-wrapper">
        {currentTab === "items" && items.length > 0 && renderItemsTab()}
        {currentTab === "types" && renderTypesTab()}
        {currentTab === "notes" && renderNotesTab()}
      </div>
    );
  };

  // Main render
  const containerClassName = `collection-container collection-details collection-details--${detailStyle}`;

  return (
    <div className={containerClassName}>
      {renderHeroSection()}
      {error ? (
        <p className="collection-details__alert">Error: {error}</p>
      ) : (
        <div className="collection-details__content">
          <CollectionTabSelect
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            className="view-select-wrapper"
          />
          {renderContent()}
        </div>
      )}
    </div>
  );
};

CollectionDetails.propTypes = {
  isExternal: PropTypes.bool,
};

export default CollectionDetails;
