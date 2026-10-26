/**
 * Build-time configuration.
 *
 * Demo mode is on when VITE_API_BASE_URL is unset. The app then runs as a
 * read-only demo backed only by public Google Sheets: no API calls, no login.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const IS_DEMO_MODE = !API_BASE_URL;

export const BACKEND_REPO_URL =
  "https://github.com/Mark-David-Hill/gd-notepad-be";
