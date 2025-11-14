import { useEffect, useContext, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";

import AddColorSchemeForm from "../../forms/AddColorSchemeForm";
import CollectionTabSelect from "./CollectionTabSelect";
import ItemsList from "../../item-cards/ItemsList";
import CollectionOverview from "./CollectionOverview";
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

const UnifiedCollectionDetails = ({ isExternal = false }) => {
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
  const relationships = isExternal ? externalRelationships : internalRelationships;
  const notes = isExternal ? externalNotes : internalNotes;
  const colorSchemes = isExternal ? externalColorSchemes : [];
  const setItems = isExternal ? null : setInternalItems;
  const setTypes = isExternal ? null : setInternalTypes;

  const loading = isExternal ? externalLoading : !Boolean(collection && items);
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

  // Helper function to check if an item is related to selected elements
  const isItemRelatedToSelected = (item) => {
    if (selectedElements.length === 0) return true;

    if (isExternal) {
      // External collections use flat relationship structure
      return relationships.some((relationship) => {
        const item1 = items.find((i) => i.item_id === relationship.item_1_id);
        const item2 = items.find((i) => i.item_id === relationship.item_2_id);

        const isRelated =
          (item.item_id === relationship.item_1_id &&
            selectedElements.includes(item2?.name)) ||
          (item.item_id === relationship.item_2_id &&
            selectedElements.includes(item1?.name));

        return isRelated;
      });
    } else {
      // Internal collections use nested relationship structure
      return relationships.some((relationship) => {
        if (!relationship.item_1 || !relationship.item_2) {
          return false;
        }

        const isRelated =
          (item.name === relationship.item_1.name &&
            selectedElements.includes(relationship.item_2.name)) ||
          (item.name === relationship.item_2.name &&
            selectedElements.includes(relationship.item_1.name));

        return isRelated;
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

  // Render hero section for external collections
  const renderHeroSection = () => {
    if (!isExternal) return null;

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
          {collection.sheet_url && (
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
          className={
            isExternal
              ? "search-section external-collection-details__search"
              : "search-section"
          }
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

        <div
          className={
            isExternal ? "external-collection-details__panel" : "items-container"
          }
        >
          <h2>Items</h2>

          <div
            className={
              isExternal
                ? `external-collection-details__grid external-collection-details__grid--${viewType}`
                : "items-wrapper"
            }
          >
            {filteredItems.length === 0 ? (
              <p
                className={
                  isExternal ? "external-collection-details__empty" : ""
                }
              >
                No items match your filters yet.
              </p>
            ) : isExternal ? (
              filteredItems.map((item, index) => {
                const itemType = types.find((t) => t.type_id === item.type_id);
                const colorScheme = itemType
                  ? colorSchemes.find(
                      (cs) => cs.color_scheme_id === itemType.color_scheme_id
                    )
                  : null;

                const itemWithImage = {
                  ...item,
                  image_url: item.image_url || itemType?.image_url || "",
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
            ) : (
              <ItemsList
                collectionId={currentCollectionId}
                itemsList={items}
                setItems={setItems}
                currentRelationships={selectedElements}
                viewType={viewType}
                searchTerm={searchTerm}
                currentTypes={selectedTypes}
                currentCollections={[collection]}
                currentRelatedElements={selectedElements}
                types={types}
              />
            )}
          </div>
        </div>
      </>
    );
  };

  // Render types tab content
  const renderTypesTab = () => {
    return (
      <div
        className={
          isExternal ? "external-collection-details__panel" : "items-container"
        }
      >
        {!isExternal && authInfo && (
          <AddTypeForm collectionId={id} setTypes={setTypes} />
        )}

        {!isExternal && authInfo?.role === "super-admin" && (
          <AddColorSchemeForm />
        )}

        <h2>Types</h2>

        <div
          className={
            isExternal ? "external-collection-details__grid" : "items-wrapper"
          }
        >
          {types.length === 0 ? (
            <p className={isExternal ? "external-collection-details__empty" : ""}>
              No types available.
            </p>
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
        <p className={isExternal ? "external-collection-details__empty" : ""}>
          No notes available yet.
        </p>
      );
    }
    return <NotesDisplay notes={notes} items={items} />;
  };

  // Render main content
  const renderContent = () => {
    if (loading) {
      return (
        <p
          className={
            isExternal ? "external-collection-details__loading" : ""
          }
        >
          {isExternal ? "Loading collection..." : "Loading..."}
        </p>
      );
    }

    return (
      <div className="collection-wrapper">
        {!isExternal && (
          <CollectionOverview
            collectionData={collection}
            types={types}
            items={items}
          />
        )}

        {currentTab === "items" && items.length > 0 && renderItemsTab()}
        {currentTab === "types" && renderTypesTab()}
        {currentTab === "notes" && renderNotesTab()}
      </div>
    );
  };

  // Main render
  const containerClassName = isExternal
    ? `collection-container external-collection-details external-collection-details--${detailStyle}`
    : "collection-container";

  const tabsClassName = isExternal
    ? "view-select-wrapper external-collection-details__tabs"
    : "view-select-wrapper";

  const contentContainerClassName = isExternal
    ? "external-collection-details__content"
    : "";

  return (
    <div className={containerClassName}>
      {renderHeroSection()}
      {error ? (
        <p className="external-collection-details__alert">Error: {error}</p>
      ) : (
        <div className={contentContainerClassName || undefined}>
          <CollectionTabSelect
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            className={tabsClassName}
          />
          {renderContent()}
        </div>
      )}
    </div>
  );
};

export default UnifiedCollectionDetails;

