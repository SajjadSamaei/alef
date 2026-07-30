//
// NOTE: If we outgrow this or hit limitations, migrate to qs or query-string

function objectToQueryString(
  obj: Record<string, any>,
  parentKey: string = "",
): string {
  const keyValuePairs = [] as string[];

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key]) {
      const value = obj[key];
      const encodedKey = parentKey
        ? `${parentKey}[${encodeURIComponent(key)}]`
        : encodeURIComponent(key);

      if (typeof value === "object" && value !== null) {
        keyValuePairs.push(objectToQueryString(value, encodedKey));
      } else {
        keyValuePairs.push(
          `${encodedKey}=${encodeURIComponent(String(value))}`,
        );
      }
    }
  }

  return keyValuePairs.join("&");
}

function stringToObject(str: string): Record<string, any> {
  const obj: Record<string, any> = {};
  const stringToReturn = str.trim().replace(/^\?/, "");

  if (!stringToReturn) {
    return obj;
  }

  const pairs = stringToReturn.split("&");

  for (const pair of pairs) {
    const [key, value] = pair.split("=").map(decodeURIComponent);
    if (key in obj) {
      if (!Array.isArray(obj[key])) {
        obj[key] = [obj[key]];
      }
      obj[key].push(value);
    } else {
      obj[key] = value;
    }
  }

  return obj;
}

export const qs = {
  parse: stringToObject,
  stringify: objectToQueryString,
};
