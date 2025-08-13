// src/features/watchlist/watchlistSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface WatchlistState {
  ids: string[];
}

// Початковий стан тепер завжди однаковий — пустий масив.
// Завантаження даних з localStorage тепер відбувається на рівні store.
const initialState: WatchlistState = {
  ids: [],
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    toggleWatchlist: (state, action: PayloadAction<string>) => {
      if (state.ids.includes(action.payload)) {
        state.ids = state.ids.filter((id) => id !== action.payload);
      } else {
        state.ids.push(action.payload);
      }
      // ВИДАЛЕНО: saveState(state.ids);
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      state.ids = state.ids.filter((id) => id !== action.payload);
      // ВИДАЛЕНО: saveState(state.ids);
    },
  },
});

export const { toggleWatchlist, removeFromWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;