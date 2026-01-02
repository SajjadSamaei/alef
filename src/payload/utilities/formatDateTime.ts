import { format } from "date-fns";

type Props = {
  date: string;
  format?: string;
};

export const formatDateTime = ({
  date,
  format: formatFromProps,
}: Props): string => {
  if (!date) return "";

  const dateFormat = formatFromProps ?? "dd/MM/yyyy";

  const formattedDate = format(new Date(date), dateFormat);

  return formattedDate;
};

export const formatPersianDateTime = (timestamp?: string): string => {
  const date = timestamp ? new Date(timestamp) : new Date();

  // Create a formatter for the Persian (Farsi) language in Iran,
  // specifying the calendar and the desired date components.
  const formatter = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    calendar: "persian",
  });

  // The 'fa-IR' locale with the 'persian' calendar will automatically
  // format the date according to the Jalali calendar system.
  return formatter.format(date);
};

export const formatPersianDateLong = (timestamp?: string): string => {
  const date = timestamp ? new Date(timestamp) : new Date();

  // Create a formatter with options for a long month name.
  const formatter = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    calendar: "persian",
  });

  return formatter.format(date);
};

export const formatEnglishDateLong = (timestamp?: string): string => {
  const date = timestamp ? new Date(timestamp) : new Date();

  // Create a formatter for English (US) with a long month name.
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    // 'calendar: "gregory"' is the default for en-US, so it's not needed.
  });

  return formatter.format(date);
};

export const formatPersianRelativeDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();

  // Normalize dates to the same day for accurate day-of-week comparison
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const diffInMilliseconds = startOfToday.getTime() - startOfDate.getTime();
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  const numberFormatter = new Intl.NumberFormat("fa-IR");

  if (diffInDays === 0) {
    return "امروز"; // Today
  }
  if (diffInDays === 1) {
    return "دیروز"; // Yesterday
  }
  if (diffInDays > 1 && diffInDays <= 6) {
    // Format the number to Persian before using it in the string
    const formattedDays = numberFormatter.format(diffInDays);
    return `${formattedDays} روز پیش`;
  }
  if (diffInDays === 7) {
    return "یک هفته پیش";
  }

  // Revert to the original format for anything older than a week
  const formatter = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    calendar: "persian",
  });

  return formatter.format(date);
};

export const formatGregorianRelativeDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();

  // Normalize dates to the same day for accurate day-of-week comparison
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const diffInMilliseconds = startOfToday.getTime() - startOfDate.getTime();
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  // --- English Relative Dates ---
  if (diffInDays === 0) {
    return "Today";
  }
  if (diffInDays === 1) {
    return "Yesterday";
  }
  if (diffInDays > 1 && diffInDays <= 6) {
    // Standard English formatting
    return `${diffInDays} days ago`;
  }
  if (diffInDays === 7) {
    return "A week ago";
  }

  // --- Fallback to Gregorian Calendar ---
  // Revert to the original format for anything older than a week
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    // No 'calendar' property needed, defaults to 'gregory' (Gregorian)
  });

  return formatter.format(date);
};

// The Persian month names are still needed for the UI, but the filtering logic
// will use the month number string (e.g., "01" for فروردین).
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

// Use Intl.DateTimeFormat for a robust, native way to get the Persian year
export const getPersianYear = (date: Date): string => {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    calendar: "persian",
  }).format(date);
};

// Use Intl.DateTimeFormat for a robust, native way to get the Persian month number
export const getPersianMonthNumber = (date: Date): string => {
  const month = new Intl.DateTimeFormat("fa-IR", {
    month: "2-digit",
    calendar: "persian",
  }).format(date);
  return month;
};
