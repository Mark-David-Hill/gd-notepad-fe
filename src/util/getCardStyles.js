import { getColor } from "./getColor";

export const getCardStyles = (scheme) => ({
  border: `1px solid ${getColor(scheme, "secondary_color", "black")}`,
  backgroundColor: getColor(scheme, "background_color", "rgb(198, 255, 237)"),
});
