import { LOCALE_LANGUAGE } from "@/constant/apiUrl";

export const formatSlug = (text) => {
  try {
    if (LOCALE_LANGUAGE === "en") {
      // Handle null or undefined
      if (text == null) return "";

      // If it's an object, try extracting useful values
      if (typeof text === "object") {
        if (text.slug) return formatText(text.slug);
        if (text.name) return formatText(text.name);

        const values = Object.values(text);
        return values.length > 0 ? formatText(values[0]) : "";
      }

      // Handle strings or numbers
      return formatText(decodeURIComponent(text));
    } else {
      // For non-English, just decode with dashes replaced by spaces
      return decodeURIComponent(text.toString() ?? "").replace(/-/g, " ");
    }
  } catch (error) {
    return "";
  }
};

// Utility to format text by replacing hyphens/underscores and capitalizing
const formatText = (value) => {
  return String(value)
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
