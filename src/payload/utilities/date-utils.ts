// utils/helpers/date-utils.ts

import * as JalaliDateModule from "jalali-date";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { toIndiaDigits } from "@/utils/helpers/strings-numbers";
import moment from "moment-jalaali";

// Define the type for the JDate class from the library
// @ts-ignore
type JDateType = typeof JalaliDateModule.default | typeof JalaliDateModule;

const JDate: JDateType = JalaliDateModule.default || JalaliDateModule;

// The `JDate` instance should be created on the client side
// or within a function that is only called in a browser environment.
const jdate = typeof window !== "undefined" ? new JDate(new Date()) : null;

export { JDate, jdate };

// Corrected logic for checking a leap year using the JDate object's year
const isLeapYear = jdate ? JDate.isLeapYear(jdate.getFullYear()) : false;

interface DatePickerMonth {
  monthName: string;
  monthNumber: number;
  days: number;
}

export const datePickerData: DatePickerMonth[] = [
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

export const formatTime = (number: number): string => {
  return number < 10 ? `0${number}` : `${number}`;
};

export const getPastDateJalali = (
  year: number,
  month: number,
  day: number,
  daysToSubtract: number,
): string => {
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
        currentMonth === 12 && JDate.isLeapYear(currentYear)
          ? 30
          : datePickerData[currentMonth - 1].days;
    }
  }

  return `${currentYear}-${formatTime(currentMonth)}-${formatTime(currentDay)}`;
};

export const formatDateInWords = (submitDateData: string): string => {
  if (!jdate) return submitDateData;
  const [year, month, day] = submitDateData.split(" ")[0].split("-");
  return toIndiaDigits(
    jdate
      .setFullYear(parseInt(year))
      .setMonth(parseInt(month))
      .setDate(parseInt(day))
      .format("DD MMMM YYYY"),
  );
};

export const formatDateInNumbers = (receiptDateData: string): string => {
  return digitsEnToFa(receiptDateData.replace(/-/g, "/"));
};

export const datePickerParseAndSetDate = (
  date: string,
  setYear: (y: number) => void,
  setMonth: (m: number) => void,
  setDay: (d: number) => void,
) => {
  const [year, month, day] = date.split("-");
  setYear(Number(year));
  setMonth(Number(formatDateToValue(month)));
  setDay(Number(formatDateToValue(day)));
};

export function formatDateToValue(number: string): string {
  return number.startsWith("0") ? number.slice(1) : number;
}

export const timestampToShamsi = (date: string): string => {
  if (!jdate) return date;
  const [year, month, dayWithTime] = date.split(":")[0].split("-");
  const day = dayWithTime.slice(0, -3);
  const jdateInstance = new JDate(
    new Date(Number(year), Number(month) - 1, Number(day)),
  );
  return `${jdateInstance.date[0]}/${formatTime(jdateInstance.date[1])}/${formatTime(jdateInstance.date[2])}`;
};

export function getPersianDateYYYYMMDD(dateToFormat: Date): string {
  const locale = "fa-IR";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    calendar: "persian",
    numberingSystem: "latn",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  const parts = formatter.formatToParts(dateToFormat);

  let year: string | undefined,
    month: string | undefined,
    day: string | undefined;
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

  if (year && month && day) {
    return `${year}-${month}-${day}`;
  } else {
    return formatter.format(dateToFormat);
  }
}

export const persianMonthNames = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export const getPersianYearFromGregorian = (date: Date): string => {
  const jdate = new JDate(date);
  return digitsEnToFa(jdate.getFullYear().toString());
};

export const getPersianMonthNumberFromGregorian = (date: Date): string => {
  const jdate = new JDate(date);
  const month = jdate.getMonth() + 1;
  return digitsEnToFa(month < 10 ? `0${month}` : month.toString());
};

export const getGregorianDateFromPersian = (
  year: string,
  month: string,
  day: number = 1,
): Date => {
  const jdate = new JDate(parseInt(year), parseInt(month) - 1, day);
  return jdate.getGregorianDate();
};

// Converts a Persian year and month into a Gregorian date range
export function getGregorianDateRangeFromPersian(year: string, month: string) {
  const y = parseInt(year);
  const m = parseInt(month);

  // Validate the inputs
  if (isNaN(y) || isNaN(m)) {
    console.error("Invalid Persian year or month provided.");
    return { start: null, end: null };
  }

  // Create moment-jalaali objects for the start and end of the month
  const jalaliStart = moment(`${y}/${m}/1`, "jYYYY/jM/jD");
  const jalaliEnd = moment(jalaliStart).endOf("jMonth");

  // Convert to Gregorian Date objects
  const start = jalaliStart.toDate();
  const end = jalaliEnd.toDate();

  return { start, end };
}

// Utility to get the number of days in a specific Persian month
const getPersianMonthLength = (year: number, month: number): number => {
  if (month <= 6) {
    return 31;
  }
  if (month <= 11) {
    return 30;
  }
  // Esfand (12) has 30 days in a leap year, otherwise 29
  return JDate.isLeapYear(year) ? 30 : 29;
};

export const convertEnglishToPersianNumerals = (str: string): string => {
  if (typeof str !== "string") return "";
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (digit) => persianNumbers[parseInt(digit)]);
};

export const convertPersianToEnglishNumerals = (str: string): string => {
  if (typeof str !== "string" || !str) return "";
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  let result = str;
  for (let i = 0; i < persianNumbers.length; i++) {
    const regex = new RegExp(persianNumbers[i], "g");
    result = result.replace(regex, englishNumbers[i]);
  }
  return result;
};
