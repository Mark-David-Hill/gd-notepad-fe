import { getColor } from "./getColor";

export const getCardStyles = (scheme) => ({
  "--item-card-background": getColor(
    scheme,
    "background_color",
    "var(--surface-card)"
  ),
  "--item-card-border": getColor(
    scheme,
    "secondary_color",
    "var(--border-color)"
  ),
  "--item-card-accent": getColor(scheme, "primary_color", "var(--accent)"),
  "--item-card-text": getColor(scheme, "text_color", "var(--text-primary)"),
});
