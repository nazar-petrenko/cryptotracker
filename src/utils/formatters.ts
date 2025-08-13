// src/utils/formatters.ts
import { CURRENCY_SYMBOLS } from "./constants";

/**
 * Форматує число як валюту
 * @param value Числове значення
 * @param currency Код валюти (usd, eur, uah...)
 * @param decimals Кількість знаків після коми
 */
export const formatCurrency = (
  value: number | null | undefined,
  currency: keyof typeof CURRENCY_SYMBOLS = "usd",
  decimals = 2
): string => {
  if (value == null || isNaN(value)) return "-";
  const symbol = CURRENCY_SYMBOLS[currency] ?? "";
  return `${symbol}${value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};

/**
 * Форматує великі числа з роздільниками
 */
export const formatNumber = (value: number | null | undefined, decimals = 0): string => {
  if (value == null || isNaN(value)) return "-";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Форматує відсотки (додає + перед додатними)
 */
export const formatPercent = (value: number | null | undefined, decimals = 2): string => {
  if (value == null || isNaN(value)) return "-";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
};
