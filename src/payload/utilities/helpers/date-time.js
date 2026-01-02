import * as JalaliDateModule from "jalali-date";
const JDate = JalaliDateModule.default || JalaliDateModule;
const jdate = new JDate(new Date());
export { JDate, jdate };
const isLeapYear = JDate.isLeapYear(jdate.getFullYear());
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { toIndiaDigits } from "@/utils/helpers/strings-numbers";

export const datePickerData = [
  { monthName: "فروردین", monthNumber: 1, days: 31 },
  { monthName: "اردیبهشت", monthNumber: 2, days: 31 },
  { monthName: "خرداد", monthNumber: 3, days: 31 },
  { monthName: "تیر", monthNumber: 4, days: 31 },
  { monthName: "مرداد", monthNumber: 5, days: 31 },
  { monthName: "شهریور", monthNumber: 6, days: 31 },
  { monthName: "مهر", monthNumber: 7, days: 30 },
  { monthName: "آبان", monthNumber: 8, days: 30 },
  { monthName: "آذر", monthNumber: 9, days: 30 },
  { monthName: "دی", monthNumber: 10, days: 30 },
  { monthName: "بهمن", monthNumber: 11, days: 30 },
  {
    monthName: "اسفند",
    monthNumber: 12,
    days: isLeapYear ? 30 : 29,
  },
];

// Time
// Add zero before a number if the number is less than ten
export const formatTime = (number) => {
  return number < 10 ? `0${number}` : number;
};

export const getPastDateJalali = (year, month, day, daysToSubtract) => {
  let currentYear = year;
  let currentMonth = month;
  let currentDay = day;

  while (daysToSubtract > 0) {
    const daysInCurrentMonth =
      currentMonth === 12 && JDate.isLeapYear(currentYear)
        ? 30
        : datePickerData[currentMonth - 1].days;

    if (currentDay > daysToSubtract) {
      currentDay -= daysToSubtract;
      daysToSubtract = 0;
    } else {
      daysToSubtract -= currentDay;
      currentMonth--;

      if (currentMonth < 1) {
        currentMonth = 12;
        currentYear--;
      }

      currentDay =
        currentMonth === 12 && isLeapYear(currentYear)
          ? 30
          : datePickerData[currentMonth - 1].days;
    }
  }

  return `${currentYear}-${formatTime(currentMonth)}-${formatTime(currentDay)}`;
};

/**
 * Processes and formats submitted date.
 * @param {string} submitDateData - Date string in the format "YYYY-MM-DD HH:MM:SS".
 * @param {Object} jdate - Instance of Jalali date class.
 * @returns {string} - Formatted Jalali date string.
 */
export const formatDateInWords = (submitDateData) => {
  const [year, month, day] = submitDateData.split(" ")[0].split("-");
  return toIndiaDigits(
    jdate.setFullYear(year).setMonth(month).setDate(day).format("DD MMMM YYYY"),
  );
};

/**
 * Converts and formats a receipt date.
 * @param {string} receiptDateData - Date string in "YYYY-MM-DD" format.
 * @returns {string} - Converted and formatted date string.
 */
export const formatDateInNumbers = (receiptDateData) => {
  return digitsEnToFa(receiptDateData.replace(/-/g, "/"));
};

/**
 * Parses a date string and updates the state for year, month, and day.
 * @param {string} date - The date string in "YYYY-MM-DD" format.
 * @param {function} setYear - Function to update the year state.
 * @param {function} setMonth - Function to update the month state.
 * @param {function} setDay - Function to update the day state.
 */
export const datePickerParseAndSetDate = (date, setYear, setMonth, setDay) => {
  const [year, month, day] = date.split("-");
  setYear(Number(year));
  setMonth(Number(formatDateToValue(month)));
  setDay(Number(formatDateToValue(day)));
};

/**
 * Removes the leading zero from a number string if present.
 * @param {string} number - The string representation of the number to format.
 * @returns {string} - The formatted number without a leading zero.
 */
export function formatDateToValue(number) {
  return number.startsWith("0") ? number.slice(1) : number;
}

export const timestampToShamsi = (date) => {
  const [year, month, dayWithTime] = date.split(":")[0].split("-");
  const day = dayWithTime.slice(0, -3); // Remove trailing time info from the day
  const jdate = new JDate(
    new Date(Number(year), Number(month) - 1, Number(day)),
  ); // Adjust month to 0-based
  return `${jdate.date[0]}/${formatTime(jdate.date[1])}/${formatTime(jdate.date[2])}`;
};

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

// --- Let's test it ---

// // To get a specific Persian date like "1404-03-09",
// // you need to start with a Gregorian date that corresponds to it.
// // The Persian date 1404/03/09 corresponds to May 30, 2025, in the Gregorian calendar.
// const gregorianDateFor1404_03_09 = new Date(2025, 4, 30); // Note: Month is 0-indexed (4 = May)

// const formattedPersianDate = getPersianDateYYYYMMDD(gregorianDateFor1404_03_09);
// console.log(
//   `Gregorian ${gregorianDateFor1404_03_09.toLocaleDateString("en-CA")} is Persian: ${formattedPersianDate}`,
// );
// // Expected output: Gregorian 2025-05-30 is Persian: 1404-03-09

// // Test with today's date (June 5, 2025)
// const today = new Date(); // Current date: 2025-06-05 (Gregorian)
// const todayInPersian = getPersianDateYYYYMMDD(today);
// console.log(
//   `Today (Gregorian ${today.toLocaleDateString("en-CA")}) is Persian: ${todayInPersian}`,
// );
// // Expected output for June 5, 2025: 1404-03-16
