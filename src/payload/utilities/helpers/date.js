export function getPersianDateYYYYMMDD(dateToFormat) {
  // 1. Specify the locale and calendar system:
  // 'fa' for Persian. 'fa-IR' for Persian (Iran) is also common.
  // The crucial part is `-u-ca-persian` or using the `calendar: 'persian'` option.
  const locale = "fa-IR"; // Or just 'fa'

  // 2. Define the formatting options:
  const options = {
    year: "numeric", // e.g., ١٤٠٤ or 1404
    month: "2-digit", // e.g., ٠٣ or 03
    day: "2-digit", // e.g., ٠٩ or 09
    calendar: "persian",
    numberingSystem: "latn", // This ensures Latin numerals (0-9) for the output parts
  };

  // 3. Create the formatter:
  const formatter = new Intl.DateTimeFormat(locale, options);

  // 4. Use formatToParts() to get individual date components:
  // This is the most reliable way to construct custom formats like yyyy-MM-dd,
  // as the standard .format() might include other characters or different ordering
  // based on the locale.
  const parts = formatter.formatToParts(dateToFormat);

  // 5. Extract the year, month, and day from the parts:
  let year, month, day;
  for (const part of parts) {
    switch (part.type) {
      case "year":
        year = part.value;
        break;
      case "month":
        month = part.value;
        break;
      case "day":
        day = part.value;
        break;
    }
  }

  // 6. Assemble the final string:
  if (year && month && day) {
    return `${year}-${month}-${day}`;
  } else {
    // Fallback or error handling if parts are not found
    // (should not happen with the specified options)
    return formatter.format(dateToFormat); // Fallback to default format
  }
}

export function getTehranTime() {
  // Define Tehran's timezone
  const tehranTimeZone = "Asia/Tehran";

  // Get current time in Tehran's timezone
  const tehranTime = new Date().toLocaleString("en-US", {
    timeZone: tehranTimeZone,
  });

  return new Date(tehranTime);
}

export function getTehranTimeInString() {
  // Get the current time in Tehran's timezone
  const tehranTime = getTehranTime();

  // Format it to a string
  return tehranTime.toLocaleString("fa-IR", {
    timeZone: "Asia/Tehran",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// Usage
// const timeInTehran = getTehranTime();
// console.log(`The current time in Tehran is: ${timeInTehran.toLocaleString()}`);
