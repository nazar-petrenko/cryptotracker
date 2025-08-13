// src/components/ThemeToggle.tsx
import React from "react";
import { Switch } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/theme/themeSlice";
import { type RootState } from "../store/store";

const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);

  return (
    <Switch
      checked={mode === "dark"}
      onChange={() => dispatch(toggleTheme())}
    />
  );
};

export default ThemeToggle;
