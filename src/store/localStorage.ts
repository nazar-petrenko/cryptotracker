// src/store/localStorage.ts
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("watchlist");
    if (serializedState === null) return [];
    return JSON.parse(serializedState);
  } catch (err) {
    return [];
  }
};

export const saveState = (state: string[]) => {
  try {
    localStorage.setItem("watchlist", JSON.stringify(state));
  } catch {
    // ignore write errors
  }
};
