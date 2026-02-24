// Indian currency thresholds: Padma (1000T), Neel (10T), Kharab (100B), Arab (1B), Crore (10M), Lakh (100K), Thousand (1K)
const INDIAN_CURRENCY_THRESHOLDS = [
  { value: 1000000000000000, suffix: "Pad" }, // 1 Padma = 1000 Trillion
  { value: 10000000000000, suffix: "Ne" }, // 1 Neel = 10 Trillion
  { value: 100000000000, suffix: "Khar" }, // 1 Kharab = 100 Billion
  { value: 1000000000, suffix: "Ar" }, // 1 Arab = 1 Billion
  { value: 10000000, suffix: "Cr" }, // 1 Crore = 10 Million
  { value: 100000, suffix: "L" }, // 1 Lakh = 100 Thousand
  { value: 1000, suffix: "K" }, // 1 Thousand
];

/**
 * Formats a number to Indian currency format with suffixes (K, L, Cr, Ar, Khar, Ne, Pad)
 * Example: 1500 -> "1.5K", 250000 -> "2.5L", 15000000 -> "1.5Cr"
 *
 * @param {string|number} value - The amount to format
 * @param {string} currencySymbol - Currency symbol (e.g., "₹", "$")
 * @returns {string} Formatted currency string
 */
export const toReadableCurrency = (value, currencySymbol = "") => {
  try {
    const numValue = typeof value === "string" ? parseFloat(value) : value;

    // Handle invalid numbers
    if (!isFinite(numValue) || isNaN(numValue)) {
      return "0";
    }

    const absoluteValue = Math.abs(numValue);
    const sign = numValue < 0 ? "-" : "";

    // Find the appropriate threshold
    const threshold = INDIAN_CURRENCY_THRESHOLDS.find(
      (t) => absoluteValue >= t.value
    );

    if (threshold) {
      // Scale the value and format
      const scaledValue = absoluteValue / threshold.value;

      // Format to Indian locale with Indian grouping pattern (##,##,##0.##)
      // Indian format uses: last 3 digits, then groups of 2
      const formatted = new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(scaledValue);

      return `${sign}${currencySymbol}${formatted}${threshold.suffix}`;
    }

    // For values less than 1000, show full number with Indian formatting
    const formatted = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    }).format(absoluteValue);

    return `${sign}${currencySymbol}${formatted}`;
  } catch (error) {
    // Fallback to original value if formatting fails
    return "0";
  }
};

/**
 * Formats a number to Indian currency format with commas and decimals (no suffixes)
 * Example: 12000 -> "12,000.00", 150980 -> "1,50,980.00"
 *
 * @param {string|number} value - The amount to format
 * @param {string} currencySymbol - Currency symbol (e.g., "₹", "$")
 * @returns {string} Formatted currency string
 */
export const toCommaSeparatedCurrency = (value, currencySymbol = "") => {
  try {
    const numValue = typeof value === "string" ? parseFloat(value) : value;

    // Handle invalid numbers
    if (!isFinite(numValue) || isNaN(numValue)) {
      return "0.00";
    }

    const sign = numValue < 0 ? "-" : "";
    const absoluteValue = Math.abs(numValue);

    const formatted = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(absoluteValue);

    return `${sign}${currencySymbol}${formatted}`;
  } catch (error) {
    return "0.00";
  }
};
