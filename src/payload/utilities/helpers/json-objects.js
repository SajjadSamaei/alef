/**
 * Safely parses a JSON string into an array.
 * @param {string} jsonString - The JSON string to parse.
 * @returns {Array} - The parsed array or an empty array if parsing fails.
 */
export const safeJsonParse = (str, fallback = []) => {
  try {
    if (typeof str === "string" && str.length > 0) {
      return JSON.parse(str);
    }
    return fallback;
  } catch (e) {
    console.error("JSON parsing error:", e);
    return fallback;
  }
};
