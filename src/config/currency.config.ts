// Define a specific type for the currency codes your application will use.
// This prevents typos and provides autocompletion in your code.
export type SupportedCurrency = "NGN" | "USD" | "EUR" | "GBP";

// This is the main configuration object that the rest of your app needs.
export const CURRENCY_CONFIG = {
  // The list of currencies you support.
  SUPPORTED_CURRENCIES: ["NGN", "USD", "EUR", "GBP"] as const,

  // The default currency for new operations.
  DEFAULT_CURRENCY: "NGN" as SupportedCurrency,

  // --- MISSING PROPERTIES ADDED BELOW ---

  // A map of each currency to its smallest unit (e.g., 100 kobo in 1 Naira).
  CURRENCY_SUBUNITS: {
    NGN: 100,
    USD: 100,
    EUR: 100,
    GBP: 100,
  } as Record<SupportedCurrency, number>,

  // A map of each currency to its symbol.
  CURRENCY_SYMBOLS: {
    NGN: "₦",
    USD: "$",
    EUR: "€",
    GBP: "£",
  } as Record<SupportedCurrency, string>,

  // A map of each currency to its full name.
  CURRENCY_NAMES: {
    NGN: "Nigerian Naira",
    USD: "United States Dollar",
    EUR: "Euro",
    GBP: "British Pound",
  } as Record<SupportedCurrency, string>,
};
