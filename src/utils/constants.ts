// src/utils/constants.ts

// API базові URL-и
export const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

// Параметри запиту для списку монет
export const DEFAULT_MARKET_PARAMS = {
  vs_currency: "usd",
  order: "market_cap_desc",
  per_page: 100,
  page: 1,
  sparkline: false,
  price_change_percentage: "24h",
};

// Мапи або списки для UI
export const CURRENCY_SYMBOLS: Record<string, string> = {
  usd: "$",
  eur: "€",
  uah: "₴",
  btc: "₿",
};

export const ROUTE_PATHS = {
  HOME: "/",
  WATCHLIST: "/watchlist",
  COIN_DETAILS: "/coin/:id",
};

// Назви застосунку
export const APP_NAME = "Crypto Tracker";
