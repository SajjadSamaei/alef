// Numbers
// Convert English numerials to Farsi
export const toIndiaDigits = (str) => {
  const id = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (w) => id[+w]);
};

export const formatNumber = (number) => {
  const englishNumber = number.toString();
  const numberWithCommas = addCommasToEnglishNumber(englishNumber);
  return englishToPersianDigits(numberWithCommas);
};

//  Texts
export const isPersianText = (text) => {
  const persianRegex = /^[\u0600-\u06FF\s]+$/;
  return persianRegex.test(text);
};

export const isEnglishText = (text) => {
  const englishRegex = /^[A-Za-z\s]+$/;
  return englishRegex.test(text);
};

export const englishToPersianDigits = (number) => {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return number.toString().replace(/[0-9]/g, (d) => persianDigits[d]);
};

export const persianToEnglishDigits = (number) => {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return number.toString().replace(/[۰-۹]/g, (d) => persianDigits.indexOf(d));
};

/**
 * Formats a number using the specified locale.
 * @param {number|string} value - The number to format.
 * @param {string} [locale="ar-EG"] - The locale for formatting. Defaults to "ar-EG".
 * @returns {string} - The formatted number.
 */
export const showNumberInFarsi = (value, locale = "ar-EG") => {
  return new Intl.NumberFormat(locale).format(value);
};

export const addCommasToEnglishNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
