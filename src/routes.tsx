// src/routes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ROUTE_PATHS } from "./utils/constants";

// Сторінки
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";
import CoinDetails from "./pages/CoinDetails";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path={ROUTE_PATHS.HOME} element={<Home />} />
      <Route path={ROUTE_PATHS.WATCHLIST} element={<Watchlist />} />
      <Route path={ROUTE_PATHS.COIN_DETAILS} element={<CoinDetails />} />
    </Routes>
  );
};

export default AppRoutes;
