// src/features/coins/coinsSlice.ts

import { 
  createSlice, 
  createAsyncThunk, 
  type PayloadAction 
} from "@reduxjs/toolkit";
import axios from 'axios';
import type { RootState } from '../../store/store'; // Важливо: вкажіть правильний шлях до вашого store

// --- ІНТЕРФЕЙСИ ---

// Описує стан для однієї конкретної монети (дані, статус завантаження, помилка)
interface CoinDetailsState {
  data: any | null; // В ідеалі, тут має бути конкретний тип даних монети
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastUpdated: number | null;
}

// Описує загальний стан цього слайсу
interface CoinsState {
  // `items` буде об'єктом, де ключ - це ID монети (напр. "bitcoin")
  items: Record<string, CoinDetailsState>;
}

// --- ПОЧАТКОВИЙ СТАН ---
const initialState: CoinsState = {
  items: {},
};


// --- АСИНХРОННА THUNK-ФУНКЦІЯ ---
// Створюємо та експортуємо thunk для завантаження даних про монету
export const fetchCoinDetailsThunk = createAsyncThunk(
  'coins/fetchDetails', // Назва екшену для Redux DevTools
  async (coinId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/coin/${coinId}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch coin data';
      return rejectWithValue(errorMessage);
    }
  }
);


// --- СТВОРЕННЯ СЛАЙСУ ---
const coinsSlice = createSlice({
  name: "coins",
  initialState,
  // Синхронні редюсери (якщо вони вам потрібні)
  reducers: {
    // Тут можна додати редюсери, що не потребують асинхронних запитів
  },
  // Обробка зовнішніх екшенів, зокрема, наших асинхронних thunks
  extraReducers: (builder) => {
    builder
      // Коли запит починається
      .addCase(fetchCoinDetailsThunk.pending, (state, action) => {
        const coinId = action.meta.arg;
        state.items[coinId] = {
          ...state.items[coinId], // Зберігаємо старі дані, поки вантажаться нові
          status: 'loading',
          error: null,
        };
      })
      // Коли запит успішно завершився
      .addCase(fetchCoinDetailsThunk.fulfilled, (state, action: PayloadAction<any>) => {
        const coinId = action.payload.id;
        state.items[coinId] = {
          data: action.payload,
          status: 'succeeded',
          error: null,
          lastUpdated: Date.now(),
        };
      })
      // Коли запит завершився з помилкою
      .addCase(fetchCoinDetailsThunk.rejected, (state, action) => {
        const coinId = action.meta.arg;
        state.items[coinId] = {
          ...state.items[coinId], // Можна залишити старі дані, якщо вони є
          status: 'failed',
          error: action.payload as string,
        };
      });
  },
});


// --- СЕЛЕКТОРИ ---
// Експортуємо селектор, який ви намагалися імпортувати.
// Він приймає загальний стан Redux (RootState) та ID монети, 
// і повертає дані для цієї конкретної монети.
export const selectCoinById = (state: RootState, coinId: string) => state.coins.items[coinId];


// --- ЕКСПОРТ РЕДЮСЕРА ---
// Експортуємо редюсер для підключення до основного store
export default coinsSlice.reducer;