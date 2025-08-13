// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import watchlistReducer from "../features/watchlist/watchlistSlice";
import themeReducer from "../features/theme/themeSlice";
import coinsReducer from "../features/coins/coinsSlice";

export const store = configureStore({
  reducer: {
    watchlist: watchlistReducer,
    theme: themeReducer,
    coins: coinsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
