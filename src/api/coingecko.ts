// src/api/coingecko.ts
import axios from "axios";

export const getMarketCoins = async (currency: string = "usd") => {
  const { data } = await axios.get("/api/coins/markets", {
    params: {
      vs_currency: currency,
      order: "market_cap_desc",
      per_page: 100,
      page: 1,
      sparkline: false,
    },
  });

  return Array.isArray(data) ? data : [];
};

export const getCoinDetails = async (id: string) => {
  const { data } = await axios.get(`/api/coin/${id}`);
  return data;
};

export const getCoinMarketChart = async (id: string, days: number = 7) => {
  const { data } = await axios.get(`/api/coin/${id}/market_chart`, {
    params: {
      vs_currency: "usd",
      days,
    },
  });
  return data;
};
