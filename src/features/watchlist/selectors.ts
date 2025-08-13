// src/features/watchlist/selectors.ts
import {type RootState } from "../../store/store";

/**
 * Форма стану watchlist (див. watchlistSlice):
 * { ids: string[] }
 */

export const selectWatchlistIds = (state: RootState) => state.watchlist.ids;
export const selectWatchlistCount = (state: RootState) => state.watchlist.ids.length;

/**
 * Хелпер, що повертає селектор для перевірки, чи в watchlist входить монета з id
 * Використання: const isInWatchlist = useSelector(makeSelectIsInWatchlist(id));
 */
export const makeSelectIsInWatchlist = (id: string) => (state: RootState) =>
  state.watchlist.ids.includes(id);

/**
 * Тип монети (мінімальний набір полів, який використовується у додатку).
 * Якщо у тебе є окрема types/ або interfaces/ папка — перемісти туди.
 */
export type Coin = {
  id: string;
  symbol?: string;
  name?: string;
  image?: string;
  current_price?: number;
  market_cap?: number;
  price_change_percentage_24h?: number;
  total_volume?: number;
};

/**
 * Селектор, що повертає масив об'єктів монет з переданого списку `coins`,
 * які є в watchlist. Використання:
 * const watchlistCoins = useSelector(selectWatchlistCoins(coinsFromApi));
 */
export const selectWatchlistCoins =
  (coins?: Coin[]) =>
  (state: RootState): Coin[] => {
    if (!coins || coins.length === 0) return [];
    const idsSet = new Set(state.watchlist.ids);
    return coins.filter((c) => idsSet.has(c.id));
  };
