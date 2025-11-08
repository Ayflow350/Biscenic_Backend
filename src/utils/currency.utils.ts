import { CURRENCY_CONFIG, SupportedCurrency } from "../config/currency.config";

/**
 * Convert amount from main currency unit to smallest unit (e.g., Naira to kobo)
 * This is required for payment processors like Paystack
 */
export const convertToSubunit = (
  amount: number,
  currency: SupportedCurrency = "NGN"
): number => {
  const subunitMultiplier = CURRENCY_CONFIG.CURRENCY_SUBUNITS[currency];
  return Math.round(amount * subunitMultiplier);
};

/**
 * Convert amount from smallest unit to main currency unit (e.g., kobo to Naira)
 */
export const convertFromSubunit = (
  amount: number,
  currency: SupportedCurrency = "NGN"
): number => {
  const subunitMultiplier = CURRENCY_CONFIG.CURRENCY_SUBUNITS[currency];
  return amount / subunitMultiplier;
};

/**
 * Format currency amount for display
 */
export const formatCurrency = (
  amount: number,
  currency: SupportedCurrency = "NGN"
): string => {
  const symbol = CURRENCY_CONFIG.CURRENCY_SYMBOLS[currency];
  return `${symbol}${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Validate currency code
 */
export const isValidCurrency = (
  currency: string
): currency is SupportedCurrency => {
  return CURRENCY_CONFIG.SUPPORTED_CURRENCIES.includes(
    currency as SupportedCurrency
  );
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (
  currency: SupportedCurrency = "NGN"
): string => {
  return CURRENCY_CONFIG.CURRENCY_SYMBOLS[currency];
};

/**
 * Get currency name
 */
export const getCurrencyName = (
  currency: SupportedCurrency = "NGN"
): string => {
  return CURRENCY_CONFIG.CURRENCY_NAMES[currency];
};
