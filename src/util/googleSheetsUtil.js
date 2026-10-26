import { CATALOG_SHEET_ID } from "../lib/config";

// Extract actual image URL from Google imgres URLs
export const extractImageUrl = (url) => {
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
export const parseCSVLine = (line) => {
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

/**
 * Fetches a public Google Sheet as CSV and returns one object per row, keyed
 * by the header row. Pass a tab name to read a specific tab; otherwise the
 * sheet's first tab is used.
 */
export const fetchSheetRows = async (sheetId, tabName) => {
  const tabParam = tabName ? `&sheet=${encodeURIComponent(tabName)}` : "";
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv${tabParam}`;
  const response = await fetch(csvUrl);

  if (!response.ok) {
    const label = tabName ? `${tabName} tab` : "sheet";
    throw new Error(`Failed to fetch ${label}: ${response.status}`);
  }

  const csvText = await response.text();
  const lines = csvText.split("\n").filter((line) => line.trim());
  if (lines.length === 0) return [];

  const headers = parseCSVLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);

    const row = headers.reduce((acc, header, index) => {
      acc[header] = values[index] || "";
      return acc;
    }, {});

    if (row.image_url) {
      row.image_url = extractImageUrl(row.image_url);
    }

    return row;
  });
};

// Fetches the catalog of external collections
export const fetchCatalog = () => fetchSheetRows(CATALOG_SHEET_ID);
