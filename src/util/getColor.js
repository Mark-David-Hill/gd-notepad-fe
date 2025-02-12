export const getColor = (colorScheme, key, fallback) => {
  return colorScheme?.[key] || fallback;
};
